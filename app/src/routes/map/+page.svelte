<script lang="ts">
	import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';
	import Header from '$lib/components/Header.svelte';
	import type * as Leaflet from 'leaflet';
	export let data;

	let map: Leaflet.Map | null = null;
	let L: typeof Leaflet;

	onMount(async () => {
		const leaflet = await import('leaflet');
		L = leaflet.default;

		const container = document.getElementById('map');
		if (container) {
			map = L.map(container).setView([37.8, -96], 4);
			L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
				maxZoom: 19
			}).addTo(map);

			// Self-hosted marker icon (static/img/markers) — no external CDN deps.
			const customIcon = L.icon({
				iconUrl: '/img/markers/marker-icon.png',
				shadowUrl: '/img/markers/marker-shadow.png',
				iconSize: [25, 41],
				iconAnchor: [12, 41],
				popupAnchor: [1, -34],
				shadowSize: [41, 41]
			});

			// Add a marker at Los Angeles, CA
			for (let index = 0; index < data.churches.length; index++) {
				const church = data.churches[index];
				if (!(church.latitude && church.longitude)) continue;
				L.marker([Number(church.latitude), Number(church.longitude)], { icon: customIcon })
					.addTo(map).bindPopup(`
				<div class="church-card">
					<h4>${church.state}, ${church.city}</h4>
					<p>${church.name_line_1} ${church.name_line_2}</p>
					<p><strong>Address:</strong> ${church.address_line_1}, ${church.address_line_2}</p>
					<p><strong>Contact:</strong> ${church.contact_first_name} ${church.contact_last_name}</p>
					<p><strong>Phone:</strong> <a href="tel:${church.phone}">${church.phone}</a></p>
					${
						church.youtube &&
						`<p>
							<a href="${church.youtube}" target="_blank" rel="noopener noreferrer">
								YouTube Channel
							</a>
						</p>`
					}
				</div> `);
			}
		}
	});

	function destroyMap() {
		if (map) {
			map.remove();
			map = null;
		}
	}
</script>

<svelte:head>
	<title>Карта Домов Молитвы — Американское Объединение МСЦ ЕХБ</title>
</svelte:head>
<Header title="Карта Домов Молитвы" />
<div id="map" style="height: 600px; width: 100%;"></div>
