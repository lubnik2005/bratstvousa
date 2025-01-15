<script lang="ts">
	export let data;
	const totalPages = Math.ceil(data.totalArticles / data.perPage); // Calculate total pages
</script>

<div class="container-xxl py-6">
	<div class="container">
		<div class="section-header mx-auto mb-5 text-center" style="max-width: 500px;">
			<h1 class="display-5 mb-3">Новости</h1>
		</div>
		<div class="row g-4">
			{#each data.news_articles as article}
				<div class="col-lg-4 col-md-6">
					<img class="img-fluid" src="{data.media_url}{article.featuredImage}" alt="" />
					<div class="bg-light p-4">
						<a class="d-block h5 lh-base mb-4" href="news/{article.slug}">{article.title}</a>
						<div class="text-muted border-top pt-4">
							<!-- I would like for region info to go here -->
							<!-- <small class="me-3"><i class="fa fa-user text-primary me-2"></i>{article.region}</small> -->
							<small class="me-3"
								><i class="fa fa-calendar text-primary me-2"></i>{article.date}</small
							>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<nav aria-label="Page navigation example">
	<ul class="pagination">
		<!-- Previous button -->
		{#if data.page > 1}
			<li class="page-item">
				<a class="page-link" href="?page={data.page - 1}" aria-label="Previous">
					<span aria-hidden="true">&laquo;</span>
					<span class="sr-only">Previous</span>
				</a>
			</li>
		{/if}

		<!-- Page numbers -->
		{#each Array.from({ length: totalPages }, (_, i) => i + 1) as pageNumber}
			<li
				class="page-item {pageNumber === data.page ? 'active' : ''}"
				aria-current={pageNumber === data.page ? 'page' : undefined}
			>
				<a class="page-link" href="?page={pageNumber}">
					{pageNumber}
				</a>
			</li>
		{/each}

		<!-- Next button -->
		{#if data.page < totalPages}
			<li class="page-item">
				<a class="page-link" href="?page={data.page + 1}" aria-label="Next">
					<span aria-hidden="true">&raquo;</span>
					<span class="sr-only">Next</span>
				</a>
			</li>
		{/if}
	</ul>
</nav>

<style>
	.pagination {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}

	.pagination a {
		padding: 10px 15px;
		border: 1px solid #ddd;
		margin: 0 5px;
		text-decoration: none;
		color: #007bff;
	}

	.pagination a:hover {
		background-color: #007bff;
		color: white;
	}
</style>
