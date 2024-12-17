<script lang="ts">
  import { onMount } from "svelte";

const churches = [
  {
    region: "Центральный регион",
    city: "Altona, Canada",
    address: "6153 PR 306 Plum Coulee Intersection of Hwy 201 & 306",
    contact: "Шеффер Даниил",
    phone: "+1 (204) 384-7777",
  },
  {
    region: "Центральный регион",
    city: "Chicago, IL",
    address: "2184A Bloomingdale Rd. Glendale Heights, IL 60139",
    contact: "Русавук Леонид Андреевич",
    phone: "+1 (509) 768-1995",
  },
  {
    region: "Центральный регион",
    city: "Denver, CO",
    address: "8235 W 44th ave, Wheat Ridge, CO 80033",
    contact: "Науменко Владимир",
    phone: "+1 (303) 748-3406",
  },
  {
    region: "Центральный регион",
    city: "Goshen, IN",
    address: "320 Е 4th Street Mishawaka IN 46544",
    contact: "Русавук Леонид Андреевич",
    phone: "+1 (509) 768-1995",
  },
  {
    region: "Центральный регион",
    city: "Houston, TX",
    address: "7711 S Braeswood Blvd. Houston, TX 77071",
    contact: "Пикалов Александр",
    phone: "+1 (832) 432-4163",
  },
  {
    region: "Центральный регион",
    city: "Kansas City, KS",
    address: "8820 W 49th. Street Shawnee, KS 66203",
    contact: "Мисирук Сергей",
    phone: "+1 (916) 504-0126",
  },
  {
    region: "Центральный регион",
    city: "Lincoln, NE",
    address: "1324 New Hampshire Lincoln, NE 68521",
    contact: "Солохин Вениамин",
    phone: "+1 (402) 890-8181",
  },
  {
    region: "Центральный регион",
    city: "Minneapolis, MN",
    address: "7570 210th St W, Lakeville, MN 55044",
    contact: "Сергей Библенко",
    phone: "+1 (952) 239-4314",
  },
  {
    region: "Центральный регион",
    city: "Minneapolis, MN",
    address: "3655 Togo Rd. Wayzata, MN 55391",
    contact: "Бутков Пётр",
    phone: "+1 (916) 430-1212",
  },
  {
    region: "Центральный регион",
    city: "Nashville, TN",
    address: "3183 Highway 431 Spring Hill, TN 37174",
    contact: "Огородник Константин",
    phone: "+1 (615) 335-0898",
  },
  {
    region: "Центральный регион",
    city: "North Chicago, IL",
    address: "123 N Plum Grove Rd. Palatine, IL 60067",
    contact: "Охотин Андрей Владимирович",
    phone: "+1 (617) 548-6880",
  },
  {
    region: "Центральный регион",
    city: "Ozark, MO",
    address: "957 Canyon Ln. Nixa, MO, 65714",
    contact: "Косаван Константин Иванович",
    phone: "+1 (360) 601-5068",
  },
  {
    region: "Центральный регион",
    city: "Sedalia, MO",
    address: "510 W Johnson St. Sedalia, MO 65301",
    contact: "Моднов Александр",
    phone: "+1 (916) 695-3040",
  },
  {
    region: "Центральный регион",
    city: "Steinbach, Canada",
    address: "21 Berg Dr. Mitchell MB R5G 2L5 Canada",
    contact: "Гирич Павел",
    phone: "+1 (204) 408-3414",
  },
  {
    region: "Центральный регион",
    city: "Winkler, Canada",
    address: "295 Eighth Street Winkler MB R6W 0M1 Canada",
    contact: "Гирич Юрий",
    phone: "+1 (431) 554-1333",
  },
  {
    region: "Восточный регион",
    city: "Abbeville, SC",
    address: "1800 US-178, Honea Path, SC 29654",
    contact: "Фурсов Вячеслав",
    phone: "+1 (916) 678-0791",
  },
  {
    region: "Восточный регион",
    city: "Atlanta, GA",
    address: "656 Indian Trail Rd. NW Liburn, GA 30047",
    contact: "Руденко Александр",
    phone: "+1 (770) 557-2710",
  },
  {
    region: "Восточный регион",
    city: "Brooklyn, NY",
    address: "1009 Brighton Beach Ave. Brooklyn, NY 11235",
    contact: "Григоренко Павел",
    phone: "+1 (267) 242-9575",
  },
  {
    region: "Восточный регион",
    city: "Charlotte, NC",
    address: "12021 Flowes Store Rd, Midland, NC 28107",
    contact: "Ильницкий Олег Николаевич",
    phone: "+1 (704) 497-2034",
    youtube: "https://www.youtube.com/@GLBC2016",
  },
  {
    region: "Восточный регион",
    city: "Greenville, SC",
    address: "652 Old Grove Rd. Piedmont, SC 29673",
    contact: "Юркин Михаил Борисович",
    phone: "+1 (864) 230-9822",
  },
];


  let selectedRegion = "Центральный регион";
  let map;
  let markers = [];

  const filterByRegion = (region) => {
    selectedRegion = region;
    updateMarkers();
  };

  const uniqueRegions = [...new Set(churches.map((church) => church.region))];

  function updateMarkers() {
    markers.forEach((marker) => marker.setMap(null));
    markers = churches
      .filter((church) => !selectedRegion || church.region === selectedRegion)
      .map((church) => {
        const marker = new google.maps.Marker({
          position: {
            lat: getRandomLat(), // Dummy placeholder for lat/lng values
            lng: getRandomLng(),
          },
          map: map,
          title: church.city,
        });
        return marker;
      });
  }

  function getRandomLat() {
    return 37.7749 + Math.random() * 5;
  }

  function getRandomLng() {
    return -122.4194 + Math.random() * 5;
  }

  onMount(() => {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 39.8283, lng: -98.5795 },
      zoom: 4,
    });
    updateMarkers();
  });
</script>

<style>
  .church-card {
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  .filter-buttons button {
    margin-right: 0.5rem;
  }
  #map {
    width: 100%;
    height: 400px;
    margin-top: 2rem;
  }
</style>

<div class="container mt-5">
  <h1 class="text-center mb-4">Адреса Домов Молитвы</h1>

  <!-- Region Filter -->
  <div class="filter-buttons mb-4 d-flex justify-content-center">
    {#each uniqueRegions as region}
      <button class="btn btn-secondary" on:click={() => filterByRegion(region)}>
        {region}
      </button>
    {/each}
  </div>

  <!-- Church Grid -->
  <div class="row">
    {#each churches.filter(
      (church) => !selectedRegion || church.region === selectedRegion
    ) as church}
      <div class="col-md-4 col-sm-6">
        <div class="church-card">
          <h4>{church.city}</h4>
          <p><strong>Region:</strong> {church.region}</p>
          <p><strong>Address:</strong> {church.address}</p>
          <p><strong>Contact:</strong> {church.contact}</p>
          <p><strong>Phone:</strong> {church.phone}</p>
          {#if church.youtube}
            <p>
              <a href={church.youtube} target="_blank" rel="noopener noreferrer">
                YouTube Channel
              </a>
            </p>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <!-- Map -->
  <div id="map"></div>
</div>

<!-- <script -->
<!--   src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY"> -->
<!-- </script> -->

