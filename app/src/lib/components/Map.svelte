<script>
	import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';
	export let churches;

	let map;
	let L;

	onMount(async () => {
		const leaflet = await import('leaflet');
		L = leaflet.default;

		const container = document.getElementById('map');
		if (container) {
			map = L.map(container).setView([37.8, -96], 4);
			L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
				attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
            &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
				subdomains: 'abcd',
				maxZoom: 20
			}).addTo(map);

			const icons = {
				// Define a custom icon
				churchIcon: L.icon({
					// iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png', // Your custom icon URL
					iconUrl: 'https://www.svgrepo.com/show/176337/church-pin.svg',
					iconSize: [38, 95], // Size of the icon
					iconAnchor: [19, 65],
					// iconAnchor: [22, 94], // Point of the icon which corresponds to marker's location
					popupAnchor: [-3, -76] // Point from which the popup should open
				}),

				central: new L.Icon({
					iconUrl:
						'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
					shadowUrl:
						'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
					shadowSize: [41, 41]
				}),

				east: new L.Icon({
					iconUrl:
						'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
					shadowUrl:
						'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
					shadowSize: [41, 41]
				}),

				california: new L.Icon({
					iconUrl:
						'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
					shadowUrl:
						'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
					shadowSize: [41, 41]
				}),

				'north-west': new L.Icon({
					iconUrl:
						'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
					shadowUrl:
						'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
					shadowSize: [41, 41]
				})
			};

			// Add a marker at Los Angeles, CA
			for (let index = 0; index < churches.length; index++) {
				const church = churches[index];
				if (!(church.longitude && church.latitude)) continue;
				L.marker([church.latitude, church.longitude], { icon: icons[church.region] }).addTo(map)
					.bindPopup(`
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

<svelte:head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
		integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
		crossorigin=""
	/>
</svelte:head>
<div id="map" style="height: 600px; width: 100%;"></div>
