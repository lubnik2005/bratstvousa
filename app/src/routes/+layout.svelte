<script lang="ts">
	// import MainNav from '$lib/components/MainNav.svelte';
	import MainNav from '$lib/components/MainNav/Main.svelte';
	import { onMount } from 'svelte';
	export let data;
	export let children;
	onMount(() => {
		// Fixed Navbar
		window.addEventListener('scroll', () => {
			const fixedTop: HTMLElement | null = document.querySelector('.fixed-top');
			if (!fixedTop) return;
			if (window.innerWidth < 992) {
				if (window.scrollY > 45) {
					fixedTop.classList.add('bg-white', 'shadow');
				} else {
					fixedTop.classList.remove('bg-white', 'shadow');
				}
			} else {
				if (window.scrollY > 45) {
					fixedTop.classList.add('bg-white', 'shadow');
					fixedTop.style.top = '0';
				} else {
					fixedTop.classList.remove('bg-white', 'shadow');
					fixedTop.style.top = '0';
				}
			}
		});
	});
</script>

<MainNav media_url={data.media_url} />

{@render children()}

<!-- Footer Start -->
<div class="container-fluid bg-dark footer mt-0 pt-5">
	<div class="container py-5">
		<div class="row g-5">
			<div class="col-lg-3 col-md-6">
				<h1 class="fw-bold text-primary text-light mb-4">МСЦ ЕХБ</h1>
				<p>Американское объединение</p>
				<div class="d-flex pt-2">
					<!-- <a class="btn btn-square btn-outline-light rounded-circle me-1" href="" -->
					<!-- 	><i class="fab fa-twitter"></i></a -->
					<!-- > -->
					<!-- <a class="btn btn-square btn-outline-light rounded-circle me-1" href="" -->
					<!-- 	><i class="fab fa-facebook-f"></i></a -->
					<!-- > -->
					<!-- <a class="btn btn-square btn-outline-light rounded-circle me-1" href="" -->
					<!-- 	><i class="fab fa-instagram"></i></a -->
					<!-- > -->
					<!-- class="btn btn-square btn-outline-light rounded-circle me-1" -->
					<a
						class="btn btn-outline-light rounded-circle me-1"
						target="_blank"
						href="https://www.youtube.com/@bratstvousa"><i class="fab fa-youtube"></i></a
					>
				</div>
			</div>
			<div class="col-lg-3 col-md-6">
				<h4 class="text-light mb-4">Quick Links</h4>
				<!-- <a class="btn btn-link" href="">Youtube Channel</a> -->
				<a class="btn btn-link" target="_blank" href="https://awakeningmission.org/"
					>Awakening Mission</a
				>
				<a class="btn btn-link" target="_blank" href="https://missionrem.org/">Mission REM</a>
				<a class="btn btn-link" target="_blank" href="https://mscmusic.org/">MSC Music</a>
				<a class="btn btn-link" target="_blank" href="https://iosifnichita.com/">Iosif Nichita</a>
				<form action={data.donation_url} method="post" target="_blank">
					<input type="hidden" name="cmd" value="_xclick" />
					<input type="hidden" name="tokenuid" value={data.donation_tokenuid} />

					<button name="submit" type="submit" class="btn btn-link">Пожертвовать</button>
				</form>
				<!-- <a class="btn btn-link" target="_blank" href="/participation">Participating in Webdev</a> -->
			</div>
			<div class="col-lg-3 col-md-6">
				<h4 class="text-light mb-4">Privacy Policy</h4>
				<p class="text-muted">
					We are committed to protecting your privacy. We do not collect, store, or process any
					personal information or data about our users during general use of our platform. Any
					interaction with our service is entirely anonymous, and no identifiable or
					non-identifiable data is gathered from your use of our platform. <a href="/privacy-policy"
						>Learn More</a
					>
				</p>
			</div>
			<!-- <div class="col-lg-3 col-md-6"> -->
			<!-- 	<h4 class="text-light mb-4">Donate</h4> -->
			<!-- 	<a class="btn btn-link" href="">Venmo</a> -->
			<!-- 	<a class="btn btn-link" href="">PayPal</a> -->
			<!-- 	<a class="btn btn-link" href="">Cash App</a> -->
			<!-- </div> -->
			<div class="col-lg-3 col-md-6">
				<h4 class="text-light mb-4">Контакт</h4>
				<a
					class="btn btn-link"
					style="text-transform: lowercase;"
					href="mailto:info@bratstvousa.com">info@bratstvousa.com</a
				>
			</div>

			<!-- <div class="col-lg-3 col-md-6"> -->
			<!-- 	<h4 class="text-light mb-4">Рассылка</h4> -->
			<!-- 	<p> -->
			<!-- 		Получайте свежие новости, специальные предложения и полезную информацию прямо на вашу -->
			<!-- 		электронную почту. -->
			<!-- 	</p> -->
			<!-- 	<div class="position-relative mx-auto" style="max-width: 400px;"> -->
			<!-- 		<input -->
			<!-- 			class="form-control w-100 bg-transparent py-3 pe-5 ps-4" -->
			<!-- 			type="text" -->
			<!-- 			placeholder="Ваш email" -->
			<!-- 		/> -->
			<!-- 		<button type="button" class="btn btn-primary position-absolute end-0 top-0 me-2 mt-2 py-2" -->
			<!-- 			>Подписаться</button -->
			<!-- 		> -->
			<!-- 	</div> -->
			<!-- </div> -->
		</div>
	</div>
	<div class="container-fluid copyright">
		<div class="container">
			<div class="row">
				<div class="col-md-6 text-md-start mb-md-0 mb-3 text-center">
					&copy; <a href="#">Bratstvo USA</a>, All Right Reserved.
				</div>
			</div>
		</div>
	</div>
</div>
<!-- Footer End -->

<!-- Back to Top -->
<a href="#" class="btn btn-lg btn-primary rounded-circle back-to-top"
	><i class="bi bi-arrow-up"></i></a
>
