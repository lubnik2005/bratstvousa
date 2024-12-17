<script lang="ts">
	import { onMount } from 'svelte';
  export let data;

	// Categories and resources
	let categories = ['Все', 'Для детей', 'Для подростков', 'Курсы и семинары', 'Занятия'];

	let selectedCategory = 'Все';

	let resources = [
		{
			title: 'Сборник песен на Рождество и Новый Год 2017',
			link: '/upfiles/file/Сборник песен на Рождество и Новый Год 2017.pdf',
			category: 'Для детей',
			type: 'pdf'
		},
		{
			title: 'Сборник стихов на Рождество 2020',
			link: '/upfiles/file/Сборник стихов на Рождество 2020.pdf',
			category: 'Для детей',
			type: 'pdf'
		},
		{
			title: 'Сборник стихов на Рожденственскую и Новогоднюю тему 2017',
			link: '/upfiles/file/Сборник стихов на Рожденственскую и Новогоднюю тему 2017.pdf',
			category: 'Для детей',
			type: 'pdf'
		},
		{
			title: 'РАДУГА. 100 стихов для детей',
			link: '/upfiles/file/РАДУГА. 100 стихов для детей.pdf',
			category: 'Для детей',
			type: 'pdf'
		},
		{
			title: 'Сборник детских песен - Росиночка',
			link: '/upfiles/file/Сборник детских песен - Росиночка.pdf',
			category: 'Для детей',
			type: 'pdf'
		},
		{
			title: 'Библейские лабиринты',
			link: '/upfiles/file/Библейские лабиринты.pdf',
			category: 'Для детей',
			type: 'pdf'
		},
		{
			title: 'Программа последовательного преподавания 3 - 8 лет',
			link: '/upfiles/file/Программа последовательного преподавания 3 - 8 лет.pdf',
			category: 'Для детей',
			type: 'pdf'
		},
		{
			title: 'Пособие для занятий с подростками',
			link: '/upfiles/file/Пособие для занятий с подростками.pdf',
			category: 'Для подростков',
			type: 'pdf'
		},
		{
			title: 'Послание к Галатам - тетрадь',
			link: '/upfiles/file/Послание к Галатам - тетрадь .pdf',
			category: 'Для подростков',
			type: 'pdf'
		},
		{
			title: 'Послание к Галатам - обложка',
			link: '/upfiles/file/Послание к Галатам - обложка .pdf',
			category: 'Для подростков',
			type: 'pdf'
		},
		{
			title: 'Возрастные планы для занятий с детьми (PDF)',
			link: '/upfiles/file/Возрастные планы для занятий с детьми.pdf',
			category: 'Занятия',
			type: 'pdf'
		},
		{
			title: 'Возрастные планы для занятий с детьми (DOC)',
			link: '/upfiles/file/Возрастные планы для занятий с детьми.doc',
			category: 'Занятия',
			type: 'doc'
		},
		{
			title: 'Методическое пособие - Юный домостроитель',
			link: '/upfiles/file/Методическое пособие - Юный домостроитель.pdf',
			category: 'Занятия',
			type: 'pdf'
		},
		{
			title: 'Методика',
			link: '/upfiles/file/Методика.pdf',
			category: 'Курсы и семинары',
			type: 'pdf'
		},
		{
			title: 'Пособие по методике',
			link: '/upfiles/file/Пособие по методике.pdf',
			category: 'Курсы и семинары',
			type: 'pdf'
		},
		{
			title: 'Пособие по педагогике 2015',
			link: '/upfiles/file/Пособие по педагогике 2015.pdf',
			category: 'Курсы и семинары',
			type: 'pdf'
		},
		{
			title: 'В помощь учителю',
			link: '/upfiles/file/В помощь учителю.pdf',
			category: 'Курсы и семинары',
			type: 'pdf'
		},
		{
			title: 'Программа лагеря - Кто же этот',
			link: '/upfiles/file/Программа лагеря - Кто же этот.pdf',
			category: 'Курсы и семинары',
			type: 'pdf'
		},
		{
			title: 'Догматика - Пособие для библейских курсов',
			link: '/upfiles/file/Догматика - Пособие для  библейских курсов.pdf',
			category: 'Курсы и семинары',
			type: 'pdf'
		},
		{
			title: 'Экзегетика. Обложка',
			link: '/upfiles/file/Экзегетика. Обложка.pdf',
			category: 'Курсы и семинары',
			type: 'pdf'
		},
		{
			title: 'Экзегетика. Рабочая тетрадь',
			link: '/upfiles/file/Экзегетика. Рабочая тетрадь.pdf',
			category: 'Курсы и семинары',
			type: 'pdf'
		}
	];

	// Resources data
	// Filtered resources
	let filteredResources = resources;

	function filterResources(category: string) {
    console.log('clicekd on ');
    console.log(category);
		selectedCategory = category;
		filteredResources =
			category === 'Все'
				? resources
				: resources.filter((resource) => resource.category === category);
    console.log(filteredResources);
	}
</script>





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
    </div>
  </div>
</div>




<div class="container py-5">
	<h1 class="mb-5 text-center">Материалы и Литература</h1>

	<!-- Category Filter -->
	<div class="d-flex justify-content-center mb-4 flex-wrap">
		{#each categories as category}
			<button
				class="filter-btn {category === selectedCategory ? 'active' : ''}"
				on:click={() => filterResources(category)}
			>
				{category}
			</button>
		{/each}
	</div>

	<!-- Resource Cards -->
	<div class="row">
		{#each filteredResources as resource}
			<div class="col-md-4">
				<div class="resource-card">
					<h5>{resource.title}</h5>
					<p>Category: {resource.category}</p>
					{#if resource.type === 'pdf'}
						<a href={resource.link} target="_blank">Download PDF</a>
					{:else}
						<a href={resource.link} target="_blank">Visit Page</a>
					{/if}
				</div>
			</div>
		{/each}
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




<style>
	.resource-card {
		border: 1px solid #ddd;
		border-radius: 5px;
		padding: 1rem;
		margin: 0.5rem;
		text-align: center;
	}
	.resource-card a {
		text-decoration: none;
		color: #007bff;
		font-weight: bold;
	}
</style>

