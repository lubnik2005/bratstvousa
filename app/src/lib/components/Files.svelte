<script lang="ts">
	let selectedCategory = 'all';
	export let files = [];
	export let media_url;

	interface Category {
		key: string;
		label: string;
	}

	const categories: Category[] = [
		{ key: 'all', label: 'Все' },
		{ key: 'preteen-homework', label: 'Для занятий с детьми и подростками' },
		{ key: 'seminary', label: 'Библейские курсы для подростков' },
		{ key: 'children', label: 'Для детей' },
		{ key: 'preteen', label: 'Для подростков' },
		{ key: 'preteen-bible-school-course-material', label: 'Для курсов и семинаров' }
	];

	let filteredResources = files;

	function filterResources(category: Category) {
		filteredResources =
			category.key === 'all' ? files : files.filter((file) => file.category === category.key);
	}
</script>

<div class="container py-5">
	<div class="row g-0 gx-5 align-items-end">
		<div class="col-lg-8">
			<div class="section-header mb-5 text-start" style="max-width: 800px;">
				<h1 class="display-5 mb-3">Материалы и Литература</h1>
			</div>
		</div>
	</div>

	<!-- Category Filter -->
	<div class="row d-flex justify-content-left mb-4 flex-wrap">
		<ul class="nav nav-pills d-inline-flex">
			{#each categories as category}
				<li class="nav-item me-2">
					<button
						class="btn btn-outline-primary border-2 {category.key === selectedCategory
							? 'active'
							: ''}"
						data-bs-toggle="pill"
						on:click={() => filterResources(category)}>{category.label}</button
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
						<td>{categories.find((c) => resource.category == c.key)?.label ?? resource.category}</td
						>
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
