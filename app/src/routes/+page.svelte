<script lang="ts">
	// let { data } = $props();
  export let data;
</script>

<!-- Carousel Start -->
<div class="container-fluid mb-5 p-0">
	<div id="header-carousel" class="carousel slide" data-bs-ride="carousel">
		<div class="carousel-inner">
			<div class="carousel-item active">
				<video class="w-100" autoplay muted loop>
					<source src="{data.media_url}/video/bg_compressed_no_audio.webm" type="video/webm" />
					Your browser does not support the video tag.
				</video>
				<div class="carousel-caption">
					<div class="container">
						<div class="row justify-content-start">
							<div class="col-lg-12">
								<h1 class="display-2 animated slideInDown text-outline mb-5 text-center">
									Американское Объединение <br /> МСЦ ЕХБ
								</h1>
								<!-- <a href="" class="btn btn-primary rounded-pill py-sm-3 px-sm-5">Products</a> -->
								<!-- <a href="" class="btn btn-secondary rounded-pill py-sm-3 px-sm-5 ms-3">Services</a> -->
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="carousel-item">
				<img class="w-100" src="{data.media_url}img/carousel-2.jpg" alt="Image" />
				<div class="carousel-caption">
					<div class="container">
						<div class="row justify-content-start">
							<div class="col-lg-7">
								<h1 class="display-2 animated slideInDown mb-5">Natural Food Is Always Healthy</h1>
								<a href="" class="btn btn-primary rounded-pill py-sm-3 px-sm-5">Products</a>
								<a href="" class="btn btn-secondary rounded-pill py-sm-3 px-sm-5 ms-3">Services</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<button
			class="carousel-control-prev"
			type="button"
			data-bs-target="#header-carousel"
			data-bs-slide="prev"
		>
			<span class="carousel-control-prev-icon" aria-hidden="true"></span>
			<span class="visually-hidden">Previous</span>
		</button>
		<button
			class="carousel-control-next"
			type="button"
			data-bs-target="#header-carousel"
			data-bs-slide="next"
		>
			<span class="carousel-control-next-icon" aria-hidden="true"></span>
			<span class="visually-hidden">Next</span>
		</button>
	</div>
</div>
<!-- Carousel End -->

<div class="container my-5">
	<div class="d-flex align-items-center justify-content-between bg-light rounded p-4 shadow-sm">
		<!-- Event Image -->
		<div class="event-image me-4">
			<img
				src="https://via.placeholder.com/150"
				alt="Event Image"
				class="rounded"
				style="width: 150px; height: auto;"
			/>
		</div>

		<!-- Event Details -->
		<div class="event-details flex-grow-1">
			<span class="badge bg-primary mb-2">Следующее предстоящее событие</span>
			<a href="/{data.events[0].slug}"><h3 class="mb-2">{data.events[0].title}</h3></a>
			<p class="text-muted mb-0">
				{new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(
					new Date(data.events[0].startAt)
				)}

				{data.events[0].endAt &&
					' - ' +
						new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(
							new Date(data.events[0].endAt)
						)}
			</p>
			<p class="text-muted">341 Magnetic State, US</p>
		</div>

		<!-- Countdown Timer -->
		<div class="event-timer text-center">
			<div class="d-flex align-items-center justify-content-center">
				<div class="px-3">
					<h4 class="text-primary mb-0">0</h4>
					<small class="text-muted">Days</small>
				</div>
				<div class="px-3">
					<h4 class="text-primary mb-0">00</h4>
					<small class="text-muted">Hrs</small>
				</div>
				<div class="px-3">
					<h4 class="text-primary mb-0">00</h4>
					<small class="text-muted">Mins</small>
				</div>
				<div class="px-3">
					<h4 class="text-primary mb-0">00</h4>
					<small class="text-muted">Secs</small>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="container my-5">
	<div class="row">
		<!-- Upcoming Events -->
		<div class="col-lg-6">
			<h3 class="mb-4">События</h3>
			{#each data.events as event}
				<div class="d-flex align-items-start mb-4">
					<div class="bg-primary me-3 rounded p-3 text-center text-white" style="width: 70px;">
						<h5 class="mb-0">				{new Intl.DateTimeFormat('ru-RU', { day: 'numeric' }).format(
					new Date(event.startAt)
				)}
</h5>
						<small>{new Intl.DateTimeFormat('ru-RU', { month: 'short' }).format(
					new Date(event.startAt)
				)}
</small>
					</div>
					<div>
						<h5 class="mb-1"><a href="/{event.slug}">{event.title}</a></h5>
						<small class="text-muted">

				{new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(
					new Date(event.startAt)
				)}

				{data.events[0].endAt &&
					' - ' +
						new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(
							new Date(event.endAt)
						)}


            </small>
						<p class="text-muted mb-0">{event.description}
						</p>
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
						src="https://via.placeholder.com/100"
						alt="News Image"
						class="me-3 rounded"
						style="width: 100px; height: 100px; object-fit: cover;"
					/>
					<div>
						<a href="/{article.slug}"><h5 class="mb-1">{article.title}</h5></a>
						<small class="text-muted">Опубликовано: {new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format( new Date(article.date))} </small>
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
	.text-outline {
		color: white;
		text-shadow:
			1px 1px 2px black,
			-1px -1px 2px black,
			1px -1px 2px black,
			-1px 1px 2px black;
	}
</style>
