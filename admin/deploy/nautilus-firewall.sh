#!/usr/bin/env bash
# Run as root on Nautilus after the bratstvo-admin networks have been created.
# This constrains containers to their intended paths without changing existing
# host or Docker service rules. It is intentionally not run from the app.
set -euo pipefail

iptables -N BRATSTVO_ADMIN_EGRESS 2>/dev/null || true
iptables -C DOCKER-USER -j BRATSTVO_ADMIN_EGRESS 2>/dev/null || \
    iptables -I DOCKER-USER 1 -j BRATSTVO_ADMIN_EGRESS
iptables -F BRATSTVO_ADMIN_EGRESS
iptables -A BRATSTVO_ADMIN_EGRESS -m conntrack --ctstate ESTABLISHED,RELATED -j RETURN

# Permit tunnel -> app only on the private admin network.
iptables -A BRATSTVO_ADMIN_EGRESS -s 172.30.0.0/24 -d 172.30.0.0/24 -p tcp --dport 8080 -j RETURN
# Deny the tunnel and Laravel app access to the host, LAN, Tailscale, and all
# other Docker ranges. Container DNS (127.0.0.11) remains available.
for source in 172.30.0.0/24 172.31.0.0/24 172.29.0.0/24; do
    for destination in 10.0.0.0/8 172.16.0.0/12 192.168.0.0/16 100.64.0.0/10; do
        iptables -A BRATSTVO_ADMIN_EGRESS -s "$source" -d "$destination" -j DROP
    done
done
iptables -A BRATSTVO_ADMIN_EGRESS -j RETURN

# Traffic addressed to the Docker host traverses INPUT, not DOCKER-USER.
# Preserve replies to host-initiated connections, then deny new container
# connections to host services, including services bound to a public address.
iptables -N BRATSTVO_ADMIN_HOST 2>/dev/null || true
iptables -C INPUT -j BRATSTVO_ADMIN_HOST 2>/dev/null || \
    iptables -I INPUT 1 -j BRATSTVO_ADMIN_HOST
iptables -F BRATSTVO_ADMIN_HOST
iptables -A BRATSTVO_ADMIN_HOST -m conntrack --ctstate ESTABLISHED,RELATED -j RETURN
for source in 172.30.0.0/24 172.31.0.0/24 172.29.0.0/24; do
    iptables -A BRATSTVO_ADMIN_HOST -s "$source" -j DROP
done
iptables -A BRATSTVO_ADMIN_HOST -j RETURN
