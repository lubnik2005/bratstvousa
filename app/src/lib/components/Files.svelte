<script lang="ts">
	let selectedCategory = 'all';
	export let files = [];
	export let media_url;
	export let title = 'Материалы и Литература';

	interface Category {
		key: string;
		label: string;
	}

	// This should be optimized, I even feel like this should be created on backend on the sql pull.
	// The reason this is like this is due to changing reqs. Please be understanding :).
	const categories_map: Category[] = [
		{ key: 'all', label: 'Все' },
		{ key: 'preteen-homework', label: 'Для занятий с детьми и подростками' },
		{ key: 'seminary', label: 'Библейские курсы для подростков' },
		{ key: 'children', label: 'Для детей' },
		{ key: 'preteen', label: 'Для подростков' },
		{ key: 'preteen-bible-school-course-material', label: 'Для курсов и семинаров' },
		{ key: 'preteen-camp', label: 'Подростковый Лагерь' },
		{ key: 'children-camp', label: 'Детский Лагерь' }
	];

	const categories: Record<string, string> = files.reduce(
		(acc, file) => {
			const label = categories_map.find((c) => c.key === file.category)?.label ?? file.category;
			acc[file.category] = label;
			return acc;
		},
		{} as Record<string, string>
	);

	let filteredResources = files;

	function filterResources(key: string) {
		filteredResources = key === 'all' ? files : files.filter((file) => file.category === key);
	}
</script>

<div class="container py-5">
	<div class="row g-0 gx-5 align-items-end">
		<div class="col-lg-8">
			<div class="section-header mb-5 text-start" style="max-width: 800px;">
				<h1 class="display-5 mb-3">{title}</h1>
			</div>
		</div>
	</div>

	<!-- Category Filter -->
	<div class="row d-flex justify-content-left mb-4 flex-wrap">
		<ul class="nav nav-pills d-inline-flex">
			<li class="nav-item me-2">
				<button
					class="btn btn-outline-primary border-2 {'all' === selectedCategory ? 'active' : ''}"
					data-bs-toggle="pill"
					on:click={() => filterResources('all')}>Все</button
				>
			</li>
			{#each Object.entries(categories) as [key, label]}
				<li class="nav-item me-2">
					<button
						class="btn btn-outline-primary border-2 {key === selectedCategory ? 'active' : ''}"
						data-bs-toggle="pill"
						on:click={() => filterResources(key)}>{label}</button
					>
				</li>
			{/each}
		</ul>
	</div>
	<div class="row">
		<table class="table-striped table-hover table">
			<thead class="bg-secondary text-light">
				<tr>
					<th>Файл</th>
					<th>Категория</th>
					<th>Скaчать</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredResources as resource}
					<tr style="cursor: pointer;">
						<td>{resource.name}</td>
						<td>{categories[resource.category] ?? resource.category}</td>
						<td>
							<a href={`${media_url}${resource.path}`} target="_blank" class="text-decoration-none">
								Скачать PDF
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
