<script lang="ts">
	// let { data } = $props();
	export let data;
</script>
<svelte:head>
  <link fetchpriority="high" rel="preload" as="image" href="{data.media_url}/video/first-frame.webp" type="image/webp">

</svelte:head>

<div class="container-fluid mb-5 p-0">
	<div id="header-carousel" class="carousel slide">
		<div class="carousel-inner">
			<div class="carousel-item active">
				<div class="video-wrapper d-none d-lg-block">
					<video autoplay muted loop loading="lazy">
						<source
							poster="{data.media_url}/video/first-frame.webp"
							src="{data.media_url}video/bg_compressed_no_audio.webm"
							type="video/webm"
						/>
						Your browser does not support the video tag.
					</video>
					<!---->
					<!-- <video muted loop> -->
					<!--     <source poster="{data.media_url}/video/first-frame.webp" src="{data.media_url}/video/bg_compressed_no_audio.webm" type="video/webm" /> -->
					<!--     Your browser does not support the video tag. -->
					<!-- </video> -->
				</div>
				<div class="d-lg-none">
					<div class="image-container">
						<img src="{data.media_url}img/bratstvo_header.webp" alt="" />
					</div>
				</div>
				<div class="carousel-caption">
					<div class="container">
						<div class="row justify-content-start">
							<div class="col-lg-12">
								<h1 class="display-2 text-outline mb-5 text-center">
									Американское Объединение <br /> МСЦ ЕХБ
								</h1>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Carousel Start -->
<!-- <div class="container-fluid mb-5 p-0"> -->
<!-- 	<div id="header-carousel" class="carousel slide" data-bs-ride="carousel"> -->
<!-- 		<div class="carousel-inner"> -->
<!-- 			<div class="carousel-item active"> -->
<!-- 				<video class="w-100" autoplay muted loop> -->
<!-- 					<source src="{data.media_url}/video/bg_compressed_no_audio.webm" type="video/webm" /> -->
<!-- 					Your browser does not support the video tag. -->
<!-- 				</video> -->
<!-- 				<div class="carousel-caption"> -->
<!-- 					<div class="container"> -->
<!-- 						<div class="row justify-content-start"> -->
<!-- 							<div class="col-lg-12"> -->
<!-- 								<h1 class="display-2 animated slideInDown text-outline mb-5 text-center"> -->
<!-- 									Американское Объединение <br /> МСЦ ЕХБ -->
<!-- 								</h1> -->
<!-- 								<!-- <a href="" class="btn btn-primary rounded-pill py-sm-3 px-sm-5">Products</a> -->
<!-- 								<!-- <a href="" class="btn btn-secondary rounded-pill py-sm-3 px-sm-5 ms-3">Services</a> -->
<!-- 							</div> -->
<!-- 						</div> -->
<!-- 					</div> -->
<!-- 				</div> -->
<!-- 			</div> -->
<!-- 			<div class="carousel-item"> -->
<!-- 				<img class="w-100" src="{data.media_url}img/carousel-2.jpg" alt="Image" /> -->
<!-- 				<div class="carousel-caption"> -->
<!-- 					<div class="container"> -->
<!-- 						<div class="row justify-content-start"> -->
<!-- 							<div class="col-lg-7"> -->
<!-- 								<h1 class="display-2 animated slideInDown mb-5">Natural Food Is Always Healthy</h1> -->
<!-- 								<a href="" class="btn btn-primary rounded-pill py-sm-3 px-sm-5">Products</a> -->
<!-- 								<a href="" class="btn btn-secondary rounded-pill py-sm-3 px-sm-5 ms-3">Services</a> -->
<!-- 							</div> -->
<!-- 						</div> -->
<!-- 					</div> -->
<!-- 				</div> -->
<!-- 			</div> -->
<!-- 		</div> -->
<!-- 		<button -->
<!-- 			class="carousel-control-prev" -->
<!-- 			type="button" -->
<!-- 			data-bs-target="#header-carousel" -->
<!-- 			data-bs-slide="prev" -->
<!-- 		> -->
<!-- 			<span class="carousel-control-prev-icon" aria-hidden="true"></span> -->
<!-- 			<span class="visually-hidden">Previous</span> -->
<!-- 		</button> -->
<!-- 		<button -->
<!-- 			class="carousel-control-next" -->
<!-- 			type="button" -->
<!-- 			data-bs-target="#header-carousel" -->
<!-- 			data-bs-slide="next" -->
<!-- 		> -->
<!-- 			<span class="carousel-control-next-icon" aria-hidden="true"></span> -->
<!-- 			<span class="visually-hidden">Next</span> -->
<!-- 		</button> -->
<!-- 	</div> -->
<!-- </div> -->
<!-- Carousel End -->

{#if data.events.length}
	<div class="container my-5">
		<div class="d-flex align-items-center justify-content-between bg-light rounded p-4 shadow-sm">
			<!-- Event Image -->
			{#if data.events[0]?.featuredImage}
				<div class="d-none d-lg-block event-image me-4">
					<img
						src="{data.media_url}{data.events[0].featuredImage}"
						alt={data.events[0].title}
						class="rounded"
						style="width: 150px; height: auto;"
					/>
				</div>
			{/if}

			<!-- Event Details -->
			<!-- content here -->
			<div class="event-details flex-grow-1">
				<span class="badge bg-primary mb-2">Следующее предстоящее событие</span>
				<a href="/general-event/{data.events[0].slug}"
					><h3 class="mb-2">{data.events[0].title}</h3></a
				>
				<p class="text-muted">{data.events[0].dates_description}</p>
			</div>
		</div>
	</div>
{/if}

<div class="container my-5">
	<div class="row">
		<!-- Upcoming Events -->
		<div class="col-lg-6">
			<h3 class="mb-4">События</h3>
			{#each data.events as event}
				<div class="d-flex align-items-start mb-4">
					<div class="bg-primary me-3 rounded p-3 text-center text-white" style="min-width: 70px;">
						<h5 class="text-light mb-0">{event.numerical_date}</h5>
						<small>{event.month_short}</small>
					</div>
					<div>
						<h5 class="mb-1"><a href="/general-event/{event.slug}">{event.title}</a></h5>
						<small class="text-muted">{event.dates_description}</small>
						<p class="text-muted mb-0">{event.description}</p>
					</div>
				</div>
			{/each}
		</div>

		<!-- Latest News -->
		<div class="col-lg-6">
			<h3 class="mb-4">Новости</h3>
			{#each data.news_articles as article}
				<!-- content here -->
				<div class="d-flex align-items-start mb-4">
					<img
						src="{data.media_url}{article.featuredImage}"
						alt={article.title}
						class="me-3 rounded"
						style="width: 100px; height: 100px; object-fit: cover;"
					/>
					<div>
						<a href="/news/{article.slug}"><h5 class="mb-1">{article.title}</h5></a>
						<small class="text-muted"
							>Опубликовано: {new Intl.DateTimeFormat('ru-RU', {
								day: 'numeric',
								month: 'long',
								year: 'numeric'
							}).format(new Date(article.date))}
						</small>
						<p class="text-muted mb-0">
							{article.description}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	#header-carousel .carousel-item {
		position: relative;
		background-color: black; /* Black background for the bars */
	}

	/* Apply blue tint as an overlay */
	.video-wrapper::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(162, 140, 106, 0.3); /* Blue tint with transparency */
		z-index: 2; /* Overlay above the video */
		pointer-events: none; /* Allow clicks to pass through to the video */
	}

	/* General styles for the video wrapper */
	.video-wrapper {
		position: relative;
		max-width: 120rem;
		margin: 0 auto;
		display: block;
		width: 100%;
		height: auto; /* Default height for larger screens */
	}

	/* Ensure the video covers the wrapper */
	.video-wrapper video {
		display: block;
		width: 100%; /* Ensure it stretches the width of the wrapper */
		height: 100%; /* Make it stretch to the full height */
		object-fit: cover; /* Ensures the video fills the container while cropping edges */
		z-index: 1; /* Video below the overlay */
		position: relative;
	}

	/* Responsive styling for smaller screens */
	@media (max-width: 768px) {
		.video-wrapper {
			height: 80vh; /* Full height of the viewport */
			width: 100%; /* Full width */
		}
	}

	/* Carousel caption styling */
	.carousel-caption {
		position: absolute;
		top: 50%; /* Centers vertically */
		left: 50%; /* Centers horizontally */
		transform: translate(-50%, -50%); /* Ensures both horizontal and vertical centering */
		z-index: 3; /* Ensure it stays above other elements */
		color: white; /* Text color */
		text-shadow:
			1px 1px 2px black,
			-1px -1px 2px black,
			1px -1px 2px black,
			-1px 1px 2px black; /* Adds a text outline for readability */
		text-align: center; /* Ensures text is horizontally centered */
		width: 100%; /* Makes it span the full width */
		max-width: 80%; /* Optional: Limit the width for better readability */
	}

	@media (max-width: 768px) {
		.carousel-caption {
			top: 60%; /* Adjust vertical position for smaller screens */
			transform: translate(-50%, -60%); /* Re-centers with new top value */
		}
	}

	.text-outline {
		color: white;
		text-shadow:
			1px 1px 2px black,
			-1px -1px 2px black,
			1px -1px 2px black,
			-1px 1px 2px black;
	}

	.image-container img {
		display: block;
		filter: blur(2px); /* Adjust the blur radius */
		width: 100%; /* Ensures the image scales properly */
	}

	.image-container::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.1); /* Adjust the opacity and color of the overlay */
		pointer-events: none; /* Ensures the overlay doesn't block interactions */
	}
</style>
