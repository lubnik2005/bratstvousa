<script lang="ts">
	let { data } = $props();
	import '@splidejs/svelte-splide/css';
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
</script>

<!-- Page Header Start -->
<div class="container-fluid page-header">
	<div class="container">
		<h1 class="display-3 mb-3">Молодежный отдел</h1>
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb mb-0">
				<li class="breadcrumb-item"><a class="text-body" href="#">Home</a></li>
				<li class="breadcrumb-item"><a class="text-body" href="#">Pages</a></li>
				<li class="breadcrumb-item text-dark active" aria-current="page">Молодежный отдел</li>
			</ol>
		</nav>
	</div>
</div>
<!-- Page Header End -->

<div class="container-xxl py-5">
	<div class="container">
		<div class="row g-0 gx-5 align-items-end">
			<div class="col-lg-6">
				<div class="section-header mb-5 text-start" style="max-width: 500px;">
					<h1 class="display-5 mb-3">События</h1>
					<p>
						Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed rebum vero
						dolor duo.
					</p>
				</div>
			</div>
			<div class="col-lg-6 text-lg-end text-start">
				<ul class="nav nav-pills d-inline-flex justify-content-end mb-5">
					<li class="nav-item me-2">
						<a class="btn btn-outline-primary active border-2" data-bs-toggle="pill" href="#tab-1"
							>Восточный</a
						>
					</li>
					<li class="nav-item me-2">
						<a class="btn btn-outline-primary border-2" data-bs-toggle="pill" href="#tab-2"
							>Западный</a
						>
					</li>
					<li class="nav-item me-0">
						<a class="btn btn-outline-primary border-2" data-bs-toggle="pill" href="#tab-3"
							>Северный</a
						>
					</li>
				</ul>
			</div>
		</div>
		<div class="tab-content">
			<div id="tab-1" class="tab-pane fade show active p-0">
				<div class="row g-4">
					{#each data.youth_events as event}
						<div class="col-xl-4 col-lg-4 col-md-6">
							<div class="product-item">
								<div class="position-relative bg-light overflow-hidden">
									<img
										class="img-fluid w-100"
										src="http://192.168.7.61:7128/storage/18Mj3G7xCHfNo884OUmgGRabk1cczVBffbs5a34V.jpg"
										alt=""
									/>
									<div
										class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
									>
										ВР
									</div>
								</div>
								<div class="p-4 text-center">
									<a class="d-block h5 mb-2" href={event.slug}>{event.title}</a>
									<span class="text-primary me-1">{event.startAt}</span>
									<!-- <span class="text-body text-decoration-line-through">$29.00</span> -->
								</div>
								<div class="d-flex border-top">
									<small class="w-50 border-end py-2 text-center">
										<a class="text-body" href=""
											><i class="fa fa-eye text-primary me-2"></i>Регистрация</a
										>
									</small>
									<small class="w-50 py-2 text-center">
										<a class="text-body" href=""
											><i class="fa fa-shopping-bag text-primary me-2"></i>Карта</a
										>
									</small>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
			<div id="tab-2" class="tab-pane fade show p-0">
				<div class="row g-4">
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-1.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-2.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-3.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-4.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-5.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-6.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-7.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-8.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-12 text-center">
						<a class="btn btn-primary rounded-pill px-5 py-3" href="">Browse More Products</a>
					</div>
				</div>
			</div>
			<div id="tab-3" class="tab-pane fade show p-0">
				<div class="row g-4">
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-1.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-2.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-3.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-4.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-5.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-6.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-7.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-8.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-12 text-center">
						<a class="btn btn-primary rounded-pill px-5 py-3" href="">Browse More Products</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- Product End -->

<div class="container-fluid bg-dark py-5">
	<div class="container">
		<div class="row g-0 gx-5 align-items-end">
			<div class="col-lg-6">
				<div
					class="section-header wow fadeInUp mb-5 text-start"
					data-wow-delay="0.1s"
					style="max-width: 500px;"
				>
					<h1 class="display-5 text-light mb-3">Новости</h1>
					<p>
						Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed rebum vero
						dolor duo.
					</p>
				</div>
			</div>
		</div>
		<div id="blogCarousel" class="carousel slide" data-bs-ride="carousel">
			<!-- Carousel Indicators -->
			<ol class="carousel-indicators">
				<li data-bs-target="#blogCarousel" data-bs-slide-to="0" class="active"></li>
				<li data-bs-target="#blogCarousel" data-bs-slide-to="1"></li>
				<li data-bs-target="#blogCarousel" data-bs-slide-to="2"></li>
			</ol>

			<!-- Carousel Items -->
			<div class="carousel-inner">
				<div class="carousel-item active">
					<div class="row">
						<!-- Blog Card 1 -->
						<div class="col-md-4">
							<div class="card">
								<img
									src="http://192.168.7.61:7128/storage/18Mj3G7xCHfNo884OUmgGRabk1cczVBffbs5a34V.jpg"
									class="card-img-top"
									alt="Blog Image"
								/>
								<div class="card-body">
									<h5 class="card-title">Blog Title 1</h5>
									<p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
									<a href="#" class="btn btn-primary">Read More</a>
								</div>
							</div>
						</div>
						<!-- Blog Card 2 -->
						<div class="col-md-4">
							<div class="card">
								<img
									src="https://via.placeholder.com/300x200"
									class="card-img-top"
									alt="Blog Image"
								/>
								<div class="card-body">
									<h5 class="card-title">Blog Title 2</h5>
									<p class="card-text">Ut enim ad minim veniam, quis nostrud exercitation.</p>
									<a href="#" class="btn btn-primary">Read More</a>
								</div>
							</div>
						</div>
						<!-- Blog Card 3 -->
						<div class="col-md-4">
							<div class="card">
								<img
									src="https://via.placeholder.com/300x200"
									class="card-img-top"
									alt="Blog Image"
								/>
								<div class="card-body">
									<h5 class="card-title">Blog Title 3</h5>
									<p class="card-text">Duis aute irure dolor in reprehenderit in voluptate.</p>
									<a href="#" class="btn btn-primary">Read More</a>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Additional Carousel Items -->
				<div class="carousel-item">
					<div class="row">
						<!-- Blog Card 4 -->
						<div class="col-md-4">
							<div class="card">
								<img
									src="https://via.placeholder.com/300x200"
									class="card-img-top"
									alt="Blog Image"
								/>
								<div class="card-body">
									<h5 class="card-title">Blog Title 4</h5>
									<p class="card-text">Sed ut perspiciatis unde omnis iste natus error sit.</p>
									<a href="#" class="btn btn-primary">Read More</a>
								</div>
							</div>
						</div>
						<!-- Blog Card 5 -->
						<div class="col-md-4">
							<div class="card">
								<img
									src="https://via.placeholder.com/300x200"
									class="card-img-top"
									alt="Blog Image"
								/>
								<div class="card-body">
									<h5 class="card-title">Blog Title 5</h5>
									<p class="card-text">Accusantium doloremque laudantium, totam rem aperiam.</p>
									<a href="#" class="btn btn-primary">Read More</a>
								</div>
							</div>
						</div>
						<!-- Blog Card 6 -->
						<div class="col-md-4">
							<div class="card">
								<img
									src="https://via.placeholder.com/300x200"
									class="card-img-top"
									alt="Blog Image"
								/>
								<div class="card-body">
									<h5 class="card-title">Blog Title 6</h5>
									<p class="card-text">Eaque ipsa quae ab illo inventore veritatis et quasi.</p>
									<a href="#" class="btn btn-primary">Read More</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Carousel Controls -->
			<a class="carousel-control-prev" href="#blogCarousel" role="button" data-bs-slide="prev">
				<span class="carousel-control-prev-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Previous</span>
			</a>
			<a class="carousel-control-next" href="#blogCarousel" role="button" data-bs-slide="next">
				<span class="carousel-control-next-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Next</span>
			</a>
		</div>
	</div>
</div>

<div class="container-xxl py-5">
	<div class="container">
		<div class="row g-0 gx-5 align-items-end">
			<div class="col-lg-6">
				<div
					class="section-header wow fadeInUp mb-5 text-start"
					data-wow-delay="0.1s"
					style="max-width: 500px;"
				>
					<h1 class="display-5 mb-3">Архивы</h1>
					<p>
						Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed rebum vero
						dolor duo.
					</p>
				</div>
			</div>
			<div class="col-lg-6 text-lg-end wow slideInRight text-start" data-wow-delay="0.1s">
				<ul class="nav nav-pills d-inline-flex justify-content-end mb-5">
					<li class="nav-item me-2">
						<a class="btn btn-outline-primary active border-2" data-bs-toggle="pill" href="#tab-1"
							>Vegetable</a
						>
					</li>
					<li class="nav-item me-2">
						<a class="btn btn-outline-primary border-2" data-bs-toggle="pill" href="#tab-2"
							>Fruits
						</a>
					</li>
					<li class="nav-item me-0">
						<a class="btn btn-outline-primary border-2" data-bs-toggle="pill" href="#tab-3">Fresh</a
						>
					</li>
				</ul>
			</div>
		</div>
		<div class="tab-content">
			<div id="tab-1" class="tab-pane fade show active p-0">
				<div class="row g-4">
					{#each data.youth_events as event}
						<div class="col-xl-4 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
							<div class="product-item">
								<div class="position-relative bg-light overflow-hidden">
									<img class="img-fluid w-100" src="img/product-1.jpg" alt="" />
									<div
										class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
									>
										ВР
									</div>
								</div>
								<div class="p-4 text-center">
									<a class="d-block h5 mb-2" href="">{event.title}</a>
									<span class="text-primary me-1">{event.startAt}</span>
									<!-- <span class="text-body text-decoration-line-through">$29.00</span> -->
								</div>
								<div class="d-flex border-top">
									<small class="w-50 border-end py-2 text-center">
										<a class="text-body" href=""
											><i class="fa fa-eye text-primary me-2"></i>Регистрация</a
										>
									</small>
									<small class="w-50 py-2 text-center">
										<a class="text-body" href=""
											><i class="fa fa-shopping-bag text-primary me-2"></i>Карта</a
										>
									</small>
								</div>
							</div>
						</div>
					{/each}
					<div class="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-2.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-3.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>

					<div class="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.7s">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-8.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div id="tab-2" class="tab-pane fade show p-0">
				<div class="row g-4">
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-1.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-2.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-3.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-4.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-5.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-6.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-7.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-8.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-12 text-center">
						<a class="btn btn-primary rounded-pill px-5 py-3" href="">Browse More Products</a>
					</div>
				</div>
			</div>
			<div id="tab-3" class="tab-pane fade show p-0">
				<div class="row g-4">
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-1.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-2.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-3.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-4.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-5.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-6.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-7.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								<img class="img-fluid w-100" src="img/product-8.jpg" alt="" />
								<div
									class="bg-secondary position-absolute start-0 top-0 m-4 rounded px-3 py-1 text-white"
								>
									New
								</div>
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" href="">Fresh Tomato</a>
								<span class="text-primary me-1">$19.00</span>
								<span class="text-body text-decoration-line-through">$29.00</span>
							</div>
							<div class="d-flex border-top">
								<small class="w-50 border-end py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-eye text-primary me-2"></i>View detail</a
									>
								</small>
								<small class="w-50 py-2 text-center">
									<a class="text-body" href=""
										><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a
									>
								</small>
							</div>
						</div>
					</div>
					<div class="col-12 text-center">
						<a class="btn btn-primary rounded-pill px-5 py-3" href="">Browse More Products</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
