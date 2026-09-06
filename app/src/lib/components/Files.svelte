<script lang="ts">
	interface FileResource {
		name: string | null;
		category: string | null;
		path: string | null;
	}

	interface Category {
		key: string;
		label: string;
	}

	let selectedCategory = 'all';
	export let files: FileResource[] = [];
	export let media_url = '/';
	export let title = 'Материалы и Литература';

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
			const key = file.category ?? 'other';
			const label = categories_map.find((c) => c.key === file.category)?.label ?? key;
			acc[key] = label;
			return acc;
		},
		{} as Record<string, string>
	);

	let filteredResources = files;

	function filterResources(key: string) {
		filteredResources = key === 'all' ? files : files.filter((file) => file.category === key);
	}
</script>

<section class="my-6">
	<div class="container">
		<div class="section-header mb-4 text-start">
			<p class="eyebrow">Библиотека</p>
			<h2 class="mb-0">{title}</h2>
		</div>

		<!-- Category Filter -->
		<ul class="nav category-filter mb-4">
			<li class="nav-item">
				<button
					class="category-tab {'all' === selectedCategory ? 'active' : ''}"
					on:click={() => filterResources('all')}>Все</button
				>
			</li>
			{#each Object.entries(categories) as [key, label]}
				<li class="nav-item">
					<button
						class="category-tab {key === selectedCategory ? 'active' : ''}"
						on:click={() => filterResources(key)}>{label}</button
					>
				</li>
			{/each}
		</ul>

		<div class="table-responsive">
			<table class="files-table table">
				<thead>
					<tr>
						<th>Файл</th>
						<th>Категория</th>
						<th>Скачать</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredResources as resource}
						<tr>
							<td>{resource.name}</td>
							<td>{categories[resource.category ?? 'other'] ?? resource.category}</td>
							<td>
								<a href={`${media_url}${resource.path}`} target="_blank" class="btn-quiet">
									Скачать PDF
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>

<style>
	.category-filter {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.5rem;
		border-bottom: 1px solid var(--bs-rule);
		padding-bottom: 0.75rem;
	}
	.category-tab {
		background: none;
		border: none;
		padding: 0.25rem 0;
		font-size: 0.82rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--bs-ink-muted);
		border-bottom: 2px solid transparent;
		transition:
			color 0.3s ease,
			border-color 0.3s ease;
	}
	.category-tab:hover {
		color: var(--bs-dark);
	}
	.category-tab.active {
		color: var(--bs-primary);
		border-bottom-color: var(--bs-secondary);
	}
	.files-table {
		--bs-table-bg: transparent;
	}
	.files-table thead th {
		font-family: var(--bs-font-serif, 'Lora', serif);
		font-weight: 600;
		font-size: 0.95rem;
		color: var(--bs-dark);
		border-bottom: 1px solid var(--bs-rule-strong);
		padding-bottom: 0.75rem;
	}
	.files-table tbody td {
		padding: 0.9rem 0.75rem 0.9rem 0;
		border-bottom: 1px solid var(--bs-rule);
		vertical-align: middle;
	}
	.files-table tbody tr:hover td {
		background: var(--bs-paper-sunk);
	}
</style>
