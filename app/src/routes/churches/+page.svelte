<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { onMount } from 'svelte';
	export let data;

	const churches = [
		{
			region: 'Центральный регион',
			city: 'Altona, Canada',
			address: '6153 PR 306 Plum Coulee Intersection of Hwy 201 & 306',
			contact: 'Шеффер Даниил',
			phone: '+1 (204) 384-7777'
		},
		{
			region: 'Центральный регион',
			city: 'Chicago, IL',
			address: '2184A Bloomingdale Rd. Glendale Heights, IL 60139',
			contact: 'Русавук Леонид Андреевич',
			phone: '+1 (509) 768-1995'
		},
		{
			region: 'Центральный регион',
			city: 'Denver, CO',
			address: '8235 W 44th ave, Wheat Ridge, CO 80033',
			contact: 'Науменко Владимир',
			phone: '+1 (303) 748-3406'
		},
		{
			region: 'Центральный регион',
			city: 'Goshen, IN',
			address: '320 Е 4th Street Mishawaka IN 46544',
			contact: 'Русавук Леонид Андреевич',
			phone: '+1 (509) 768-1995'
		},
		{
			region: 'Центральный регион',
			city: 'Houston, TX',
			address: '7711 S Braeswood Blvd. Houston, TX 77071',
			contact: 'Пикалов Александр',
			phone: '+1 (832) 432-4163'
		},
		{
			region: 'Центральный регион',
			city: 'Kansas City, KS',
			address: '8820 W 49th. Street Shawnee, KS 66203',
			contact: 'Мисирук Сергей',
			phone: '+1 (916) 504-0126'
		},
		{
			region: 'Центральный регион',
			city: 'Lincoln, NE',
			address: '1324 New Hampshire Lincoln, NE 68521',
			contact: 'Солохин Вениамин',
			phone: '+1 (402) 890-8181'
		},
		{
			region: 'Центральный регион',
			city: 'Minneapolis, MN',
			address: '7570 210th St W, Lakeville, MN 55044',
			contact: 'Сергей Библенко',
			phone: '+1 (952) 239-4314'
		},
		{
			region: 'Центральный регион',
			city: 'Minneapolis, MN',
			address: '3655 Togo Rd. Wayzata, MN 55391',
			contact: 'Бутков Пётр',
			phone: '+1 (916) 430-1212'
		},
		{
			region: 'Центральный регион',
			city: 'Nashville, TN',
			address: '3183 Highway 431 Spring Hill, TN 37174',
			contact: 'Огородник Константин',
			phone: '+1 (615) 335-0898'
		},
		{
			region: 'Центральный регион',
			city: 'North Chicago, IL',
			address: '123 N Plum Grove Rd. Palatine, IL 60067',
			contact: 'Охотин Андрей Владимирович',
			phone: '+1 (617) 548-6880'
		},
		{
			region: 'Центральный регион',
			city: 'Ozark, MO',
			address: '957 Canyon Ln. Nixa, MO, 65714',
			contact: 'Косаван Константин Иванович',
			phone: '+1 (360) 601-5068'
		},
		{
			region: 'Центральный регион',
			city: 'Sedalia, MO',
			address: '510 W Johnson St. Sedalia, MO 65301',
			contact: 'Моднов Александр',
			phone: '+1 (916) 695-3040'
		},
		{
			region: 'Центральный регион',
			city: 'Steinbach, Canada',
			address: '21 Berg Dr. Mitchell MB R5G 2L5 Canada',
			contact: 'Гирич Павел',
			phone: '+1 (204) 408-3414'
		},
		{
			region: 'Центральный регион',
			city: 'Winkler, Canada',
			address: '295 Eighth Street Winkler MB R6W 0M1 Canada',
			contact: 'Гирич Юрий',
			phone: '+1 (431) 554-1333'
		},
		{
			region: 'Восточный регион',
			city: 'Abbeville, SC',
			address: '1800 US-178, Honea Path, SC 29654',
			contact: 'Фурсов Вячеслав',
			phone: '+1 (916) 678-0791'
		},
		{
			region: 'Восточный регион',
			city: 'Atlanta, GA',
			address: '656 Indian Trail Rd. NW, Liburn, GA 30047',
			contact: 'Руденко Александр',
			phone: '+1 (770) 557-2710'
		},
		{
			region: 'Восточный регион',
			city: 'Brooklyn, NY',
			address: '1009 Brighton Beach Ave., Brooklyn, NY 11235',
			contact: 'Григоренко Павел',
			phone: '+1 (267) 242-9575'
		},
		{
			region: 'Восточный регион',
			city: 'Charlotte, NC',
			address: '12021 Flowes Store Rd., Midland, NC 28107',
			contact: 'Ильницкий Олег Николаевич',
			phone: '+1 (704) 497-2034'
		},
		{
			region: 'Восточный регион',
			city: 'Greenville, SC',
			address: '652 Old Grove Rd., Piedmont, SC 29673',
			contact: 'Юркин Михаил Борисович',
			phone: '+1 (864) 230-9822'
		},
		{
			region: 'Восточный регион',
			city: 'Harrisburg, PA',
			address: '100 Floral Ln., Dauphin, PA 17018',
			contact: 'Власенко Александр',
			phone: '+1 (413) 242-3565'
		},
		{
			region: 'Восточный регион',
			city: 'Harrisonburg, VA',
			address: '9001 Rawley Pike, Hinton, VA 22831',
			contact: 'Уваров Владимир',
			phone: '+1 (540) 908-8940'
		},
		{
			region: 'Восточный регион',
			city: 'Lititz, PA',
			address: '642 Temperance Hill Rd., Lititz, PA 17543',
			contact: 'Кулаков Николай Алексеевич',
			phone: '+1 (610) 733-1745'
		},
		{
			region: 'Восточный регион',
			city: 'Niagara Falls, Canada',
			address: '3855 St. Peter Ave., Niagara Falls, ON L2J 2N7, Canada',
			contact: 'Станислав Анончук',
			phone: '+1 (716) 313-3699'
		},
		{
			region: 'Восточный регион',
			city: 'North Port, FL',
			address: '20225 Kenilworth Blvd., Port Charlotte, FL 33954',
			contact: 'Казимиров Генадий',
			phone: '+1 (941) 457-9411'
		},
		{
			region: 'Восточный регион',
			city: 'Philadelphia, PA',
			address: '4055 Davisville Rd., Hatboro, PA 19040',
			contact: 'Борис Егорович Щербина',
			phone: '+1 (267) 939-2537'
		},
		{
			region: 'Восточный регион',
			city: 'Pittsburgh, PA',
			address: '935 Pine Ave., Pittsburgh, PA 15234',
			contact: 'Шейко Александр Леонидович',
			phone: '+1 (412) 977-1282'
		},
		{
			region: 'Восточный регион',
			city: 'Rainholds, PA',
			address: '930 Pennsylvania 897, Rainholds, PA 17569',
			contact: 'Филиппов Андрей',
			phone: '+1 (717) 803-9683'
		},
		{
			region: 'Восточный регион',
			city: 'Saint Petersburg, FL',
			address: '5945 54th Ave., Kenneth City, FL 33709',
			contact: 'Дуденков Владимир',
			phone: '+1 (727) 793-4915'
		},
		{
			region: 'Восточный регион',
			city: 'Southwick, MA',
			address: '261 College Hwy., Southwick, MA 01077',
			contact: 'Костенко Виталий',
			phone: '+1 (413) 896-6740'
		},
		{
			region: 'Восточный регион',
			city: 'Westfield, MA',
			address: '297 Russell Rd., Westfield, MA 01085',
			contact: 'Помазнюк Андрей',
			phone: '+1 (413) 330-9206'
		},
		{
			region: 'Восточный регион',
			city: 'Washington, PA',
			address: '1068 Linden Rd., Eighty Four, PA 15330',
			contact: 'Шейко Павел',
			phone: '+1 (412) 334-4263'
		},
		{
			region: 'Калифорнийский регион',
			city: 'Fresno, CA',
			address: '7407 N Maple Ave, Fresno, CA 93720',
			contact: 'Дрига Павел Михайлович',
			phone: '+1 (559) 473-5478'
		},
		{
			region: 'Калифорнийский регион',
			city: 'Phoenix, AZ',
			address: '1801 E Osborn Rd., Phoenix, AZ 85016',
			contact: 'Романович Виктор Георгиевич',
			phone: '+1 (520) 635-0346'
		},
		{
			region: 'Калифорнийский регион',
			city: 'San Diego, CA',
			address: 'Glass Room, 6365 El Apajo, Rancho Santa Fe, CA 92067',
			contact: 'Охотин Давид Владимирович',
			phone: '+1 (858) 345-7332'
		},
		{
			region: 'Калифорнийский регион',
			city: 'English-language church in Sacramento, CA',
			address: '3644 Bolivar Ave, North Highlands, CA 95660',
			contact: 'Clark Daniel',
			phone: '+1 (279) 782-3832',
			youtube: 'https://www.ebf.church/'
		},
		{
			region: 'Калифорнийский регион',
			city: 'Sacramento, CA',
			address: '7635 Auburn Blvd, Citrus Heights, CA 95610',
			contact: 'Деркач Павел',
			phone: '+1 (916) 247-6772',
			youtube: 'https://www.youtube.com/channel/UCxv6lC-lUM1evS7CgTX9kFg'
		},
		{
			region: 'Калифорнийский регион',
			city: 'Sacramento, CA',
			address: '3900 Astoria St., Sacramento, CA 95838',
			contact: 'Минников Григорий Васильевич',
			phone: '+1 (916) 769-9319',
			youtube: 'https://www.youtube.com/@independentbaptistchurch6063'
		},
		{
			region: 'Калифорнийский регион',
			city: 'Sacramento, CA',
			address: '4659 Dry Creek Road, Sacramento, CA 95838',
			contact: 'Станиславский Николай',
			phone: '+1 (916) 201-5033'
		},
		{
			region: 'Калифорнийский регион',
			city: 'Sacramento, CA',
			address: '1608 Lisbon Ave., West Sacramento, CA 95605',
			contact: 'Власов Павел Васильевич',
			phone: '+1 (916) 770-9776'
		},
		{
			region: 'Калифорнийский регион',
			city: 'Sacramento, CA',
			address: '440 Pinedale Ave., Sacramento, CA 95838',
			contact: 'Дубинетский Авель',
			phone: '+1 (916) 224-9659'
		},
		{
			region: 'Калифорнийский регион',
			city: 'Sacramento, CA',
			address: '7140 Watt Ave., North Highlands, CA 95660',
			contact: 'Пукасенко Александр Семёнович',
			phone: '+1 (916) 759-4918'
		},
		{
			region: 'Калифорнийский регион',
			city: 'Sacramento, CA',
			address: '2231 59th St., Sacramento, CA 95817',
			contact: 'Сенцов Александр Борисович',
			phone: '+1 (916) 868-7017',
			youtube: 'https://www.youtube.com/@59Street'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Bellingham, WA',
			address: 'Peace Arch Historical State Park 19 A Street, Blaine, WA 98231',
			contact: 'Кайдалов Давид',
			phone: '+1 (360) 201-0915'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Boise, ID',
			address: '1846 N Dawn Pl., Boise, ID 83713',
			contact: 'Рыжук Александр',
			phone: '+1 (916) 903-2931'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Camas, WA',
			address: '25018 NE 25th St., Camas, WA 98607',
			contact: 'Косаван Алексей Иванович',
			phone: '+1 (360) 771-5578'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Everett, WA',
			address: '8704 3rd Ave SE, Everett, WA 98208',
			contact: 'Цуман Виталий Петрович',
			phone: '+1 (425) 273-8298'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Fort St. John, Canada',
			address: '13431 Hwy 29N, Charlie Lake, BC V0C 1H0, Canada',
			contact: 'Андриец Александр',
			phone: '+1 250 263 5903'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Grande Prairie, Canada',
			address: '10913 107th Ave, Grande Prairie, AB T8V 7P9, Canada',
			contact: 'Birchuk Vladimir',
			phone: '+1 (780) 876-9891'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Kalispell, MT',
			address: '902 1st Ave. E, Kalispell, MT 59901',
			contact: 'Шелко Иван Петрович',
			phone: '+1 (406) 751-5536'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Hazel Dell, WA',
			address: '8802 NW 9th Ave, Vancouver, WA 98665',
			contact: 'Нейман Константин Андреевич',
			phone: '+1 (360) 907-0399',
			youtube: 'https://www.youtube.com/@slavic-baptist-church-wa/streams'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Portland, OR',
			address: '7950 SE 62nd Ave., Portland, OR 97206',
			contact: 'Пауль Юрий',
			phone: '+1 (360) 608-5871'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Portland, OR',
			address: '5309 SE 115th Ave., Portland, OR 97266',
			contact: 'Головин Сергей Михайлович',
			phone: '+1 (503) 810-5840'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Salem, OR',
			address: '7625 Sunnyside Rd. SE, Salem, OR 97306',
			contact: 'Озеров Андрей Иванович',
			phone: '+1 (503) 510-0863'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Salt Lake City, UT',
			address: '2065 E 6200 St., Salt Lake City, UT 84121',
			contact: 'Бенковский Андрей Леонидович',
			phone: '+1 (801) 556-0288'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Seattle, WA',
			address: '233 S 156th St., Burien, WA 98148',
			contact: 'Бобровников Андрей Николаевич',
			phone: '+1 (763) 300-9270',
			youtube: 'https://www.youtube.com/@ecbcseattle'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Skamokawa, WA',
			address: '548 E Valley Rd., Skamokawa, WA 98647',
			contact: 'Голдинов Пётр',
			phone: '+1 (360) 907-4744'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Soap Lake, WA',
			address: '319 SE 5th Ave., Soap Lake, WA 98851',
			contact: 'Горбунов Владимир',
			phone: '+1 (425) 772-1624'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Soap Lake, WA',
			address: '110 Main Ave. W, Soap Lake, WA 98851',
			contact: 'Козлов Александр',
			phone: '+1 (509) 246-0861'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Spokane, WA',
			address: '5116 W Garden Springs Rd., Spokane, WA 99224',
			contact: 'Бадулин Павел Иванович',
			phone: '+1 (509) 981-7000'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Vancouver, WA',
			address: '16807 NE Fourth Plain Blvd., Vancouver, WA 98682',
			contact: 'Коротких Михаил',
			phone: '+1 (503) 816-1008'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Vancouver, WA',
			address: '7209 NE 131st Ave., Vancouver, WA 98682',
			contact: 'Пастухов Григорий',
			phone: '+1 (360) 798-8160'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Walla Walla, WA',
			address: '1132 S 2nd Ave., Walla Walla, WA 99362',
			contact: 'Ромадин Владимир Ильич',
			phone: '+1 (509) 520-6246'
		},
		{
			region: 'Северо-Западный регион',
			city: 'Wasilla, AK',
			address: '8350 W Sunset Ave., Wasilla, AK 99654',
			contact: 'Гирич Александр',
			phone: '+1 (907) 315-7177'
		}
	].sort((a, b) => {
		const stateA = a.city.split(', ')[1];
		const stateB = b.city.split(', ')[1];

		if (stateA < stateB) return -1;
		if (stateA > stateB) return 1;

		// If states are the same, compare cities
		const cityA = a.city.split(', ')[0];
		const cityB = b.city.split(', ')[0];
		return cityA.localeCompare(cityB);
	});

	let selectedRegion = 'Центральный регион';
	let map;
	let markers = [];

	const filterByRegion = (region) => {
		selectedRegion = region;
		updateMarkers();
	};

	const uniqueRegions = [...new Set(data.churches.map((church) => church.region))];
</script>

<Header title="Адреса Домов Молитвы" />

<div class="container mt-5">
	<!-- Region Filter -->
	<div class="filter-buttons d-flex mb-4">
		{#each uniqueRegions as region}
			<button class="btn btn-primary" on:click={() => filterByRegion(region)}>
				{region}
			</button>
		{/each}
	</div>

	<!-- Church Grid -->
	<div class="row">
		{#each data.churches.filter((church) => !selectedRegion || church.region === selectedRegion) as church}
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

	<!-- Category Filter -->
	<div class="row d-flex justify-content-left mb-4 flex-wrap">
		<ul class="nav nav-pills d-inline-flex">
			{#each uniqueRegions as category}
				<li class="nav-item me-2">
					<button
						class="btn btn-outline-primary border-2 {category === selectedRegion ? 'active' : ''}"
						data-bs-toggle="pill"
						on:click={() => filterByRegion(category)}>{category}</button
					>
				</li>
			{/each}
		</ul>
	</div>

	<div class="row">
		<table class="table-striped table-hover table">
			<thead class="bg-secondary text-light">
				<tr>
					<th>Штат</th>
					<th>Город</th>
					<th>Адрес</th>
					<th>Название</th>
					<!-- <th>Ригион</th> -->
					<th>Контакт</th>
					<th>Телефон</th>
				</tr>
			</thead>
			<tbody>
				{#each data.churches
					.filter((church) => !selectedRegion || church.region === selectedRegion)
					.sort() as church}
					<tr>
						<td>{church.state}</td>
						<td>{church.city.split(',')[0]}</td>
						<td>{church.address_line_1}<br />{church.address_line_2}</td>
						<td>{church.name_line_1}<br />{church.name_line_2}</td>
						<td>{church.contact_last_name}<br />{church.contact_first_name}</td>
						<td
							><a href={`tel:${church.phone}`}> {church.phone}</a><br /><a href={church.youtube}
								>Youtube Channel</a
							></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Map -->
	<div id="map"></div>
</div>

<!-- <script -->
<!--   src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY"> -->
<!-- </script> -->

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
