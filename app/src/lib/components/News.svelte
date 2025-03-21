<script lang="ts">
	import type { Article } from '$lib/server/db/schema';
	import { formatDate } from '@fullcalendar/core/index.js';
	import { bindIfParam } from 'drizzle-orm';
	export let articles: (typeof Article)[] = [];
	export let title = 'Новости';
	export let subtitle;
	export let media_url = '/';
</script>

{#if articles?.length}
	<div class="container-xxl py-5">
		<div class="container">
			<div class="row g-0 gx-5 align-items-end">
				<div class="col-lg-5">
					<div class="section-header mb-5 text-start" style="max-width: 500px;">
						<h1 class="display-5 mb-3">{title}</h1>
						<p>{subtitle}</p>
					</div>
				</div>
			</div>
			<div class="row g-4">
				{#each articles as article}
					<div class="col-xl-4 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								{#if article.featuredImage}
									<img
										class="img-fluid w-100"
										src={`${media_url}${article.featuredImage}`}
										alt=""
									/>
								{/if}
							</div>
							<div class="p-4 text-center">
								<a
									class="d-block h5 mb-2"
									style="min-height: calc(1.5em * 2)"
									href={`/news/${article.slug}`}>{article.title}</a
								>
								<span class="text-primary me-1">{article.dateString}</span>
								<!-- <span class="text-body text-decoration-line-through">$29.00</span> -->
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<!-- Product End -->
{/if}
