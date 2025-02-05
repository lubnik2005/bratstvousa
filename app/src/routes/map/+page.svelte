<script>
	import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';
	export let data;

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
				maxZoom: 14
			}).addTo(map);

			// Define a custom icon
			const customIcon = L.icon({
				iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png', // Your custom icon URL
				iconSize: [38, 95], // Size of the icon
				iconAnchor: [22, 94], // Point of the icon which corresponds to marker's location
				popupAnchor: [-3, -76] // Point from which the popup should open
			});

			// Add a marker at Los Angeles, CA
			for (let index = 0; index < data.churches.length; index++) {
				const church = data.churches[index];
				L.marker([church.latitude, church.longitude]).addTo(map).bindPopup(`
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
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
		integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
		crossorigin=""
	/>
</svelte:head>
<div style="height: 500px" />
<div id="map" style="height: 600px; width: 100%;"></div>
