<script lang="ts">
	import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';
	import type * as Leaflet from 'leaflet';
	export let churches: Array<Record<string, any>>;

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

			// Self-hosted marker assets (static/img/markers) — no external CDN deps.
			const shadowUrl = '/img/markers/marker-shadow.png';
			const makeIcon = (iconUrl: string) =>
				new L.Icon({
					iconUrl,
					shadowUrl,
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
					shadowSize: [41, 41]
				});

			const icons = {
				// Fallback for churches whose region is unset/unknown.
				churchIcon: makeIcon('/img/markers/marker-icon.png'),
				central: makeIcon('/img/markers/marker-icon-green.png'),
				east: makeIcon('/img/markers/marker-icon-red.png'),
				california: makeIcon('/img/markers/marker-icon-gold.png'),
				'north-west': makeIcon('/img/markers/marker-icon-violet.png')
			};

			// Add a marker at Los Angeles, CA
			for (let index = 0; index < churches.length; index++) {
				const church = churches[index];
				if (!(church.longitude && church.latitude)) continue;
				const regionIcon =
					(icons as Record<string, Leaflet.Icon>)[church.region] ?? icons.churchIcon;
				L.marker([church.latitude, church.longitude], { icon: regionIcon }).addTo(map).bindPopup(`
				<div class="church-card">
					<h4>${church.state ?? ''}, ${church.city ?? ''}</h4>
					<p>${church.name_line_1 ?? ''} ${church.name_line_2 ?? ''}</p>
					<p><strong>Address:</strong> ${church.address_line_1 ?? ''}, ${church.address_line_2 ?? ''}</p>
					<p><strong>Contact:</strong> ${church.contact_first_name ?? ''} ${church.contact_last_name ?? ''}</p>
					<p><strong>Phone:</strong> <a href="tel:${church.phone ?? ''}">${church.phone ?? ''}</a></p>
					${
						church.youtube
							? `<p>
							<a href="${church.youtube}" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-youtube"></i>
							</a>
						</p>`
							: ''
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

<div id="map" style="height: 600px; width: 100%;"></div>
