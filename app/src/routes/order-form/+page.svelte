<script>
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import { goto } from '$app/navigation';
	export let data;
	export let form;

	let churches = [];
	let selectedChurch = '';
	let newChurch = '';
	let useNewChurch = false;
  let shippingAddress = '';

	let lastName = '';
	let middleName = '';
	let firstName = '';
	let church = '';
	let age = '';
	let email = '';
	let phone = '';
	let educationHistory = '';
	let regionalCourses = '';
	let ministry = '';
	let recommendation = '';
	let responsiblePerson = '';
	let signature = '';
	let personalPhoto = null;
	let agreeToRules = false;


</script>

<svelte:head>
	<title>Форма Саказа / заявки</title>
	<meta property="og:title" content="Анкета поступающего в Библейскую школу" />
	<meta name="twitter:title" content="Анкета поступающего в Библейскую школу" />
	<meta
		property="og:image"
		content="https://bratstvo-usa.s3.us-west-2.amazonaws.com/logo_medium.png"
	/>
	<!-- <meta property="og:description" content="Your site description here." /> -->
	<!-- <meta property="og:image" content="%sveltekit.assets%/og-image.png" /> -->
	<!-- <meta property="og:url" content="https://yourdomain.com" /> -->
	<!-- <meta name="twitter:card" content="summary_large_image" /> -->
</svelte:head>

<Header title="Форма заказа/заявки" />

<div class="container mt-4">
	{#if form?.success}
		<div class="alert alert-success mt-4" role="alert">
			<h4 class="alert-heading">Спасибо за подачу анкеты!</h4>
			<p>
				В ближайшие несколько дней с вами свяжется ответственный служитель для дальнейшего
				обсуждения.
			</p>
			<hr />
			<p class="mb-0">
				Если у вас есть вопросы, вы можете связаться с нами по указанным контактным данным.
			</p>
			<p class="mb-0">Благословений!</p>
		</div>
	{:else}
		<form
			method="POST"
			class="needs-validation"
			enctype="multipart/form-data"
		>
			<!-- Names on One Line -->
			<div class="row">
				<div class="col-md-4">
					<label class="form-label">Имя <span class="text-danger">*</span></label>
					<input
						name="first_name"
						type="text"
						class="form-control"
						bind:value={firstName}
						required
					/>
				</div>
				<div class="col-md-4">
					<label class="form-label">Фамилия <span class="text-danger">*</span></label>
					<input name="last_name" type="text" class="form-control" bind:value={lastName} required />
				</div>
				<div class="col-md-4">
					<label class="form-label">Отчество</label>
					<input name="middle_name" type="text" class="form-control" bind:value={middleName} />
				</div>
			</div>
			<!-- Email and Phone on One Line -->
			<div class="row mt-3">
				<div class="col-md-6">
					<label class="form-label">Email</label>
					<input name="email" type="email" class="form-control" bind:value={email}/>
				</div>
				<div class="col-md-6">
					<label class="form-label">Телефон <span class="text-danger">*</span></label>
					<input name="phone" type="tel" class="form-control" bind:value={phone} required/>
				</div>
			</div>

			<!-- Church Selection -->
			<div class="mt-3">
				<label class="form-label">Церковь <span class="text-danger">*</span></label>
				<select
					name="church"
					class="form-select"
					bind:value={selectedChurch}
					on:change={() => (useNewChurch = selectedChurch === 'other')}
					required
				>
					<option value="" disabled selected>Выберите церковь</option>
					{#each data.churches as church}
						<option value={church.id}
							>{church.name_line_1 +
								' ' +
								(church.name_line_2 ?? '') +
								' (' +
								church.address_line_1 +
								' ' +
								(church.address_line_2 ?? '') +
								')'}</option
						>
					{/each}
					<option value="other">Другое (ввести вручную)</option>
				</select>
			</div>

			<!-- New Church Field (Conditional) -->
			{#if useNewChurch}
				<div class="mt-3">
					<label class="form-label"
						>Введите название церкви <span class="text-danger">*</span></label
					>
					<input
						name="new_church"
						type="text"
						class="form-control"
						bind:value={newChurch}
						required
					/>
				</div>
			{/if}
<div class="row mt-3">
	<div class="col-md-4">
		<label class="form-label">Количество книг №1</label>
		<input
			name="books_no1"
			type="number"
			class="form-control"
			min="0"
			step="1"
			value="0"
		/>
	</div>
	<div class="col-md-4">
		<label class="form-label">Количество книг №2</label>
		<input
			name="books_no2"
			type="number"
			class="form-control"
			min="0"
			step="1"
			value="0"
		/>
	</div>
	<div class="col-md-4">
		<label class="form-label">Количество книг №3</label>
		<input
			name="books_no3"
			type="number"
			class="form-control"
			min="0"
			step="1"
			value="0"
		/>
	</div>
</div>

			<!-- Education History -->
			<div class="mt-3">
				<label class="form-label"
					>Полный адрес для отправки<span class="text-danger">*</span></label
				>
		<input
			name="shipping_address"
			type="text"
			class="form-control"
          required
		/>
			</div>


			<button type="submit" class="btn btn-primary my-4">Отправить</button>
		</form>
	{/if}
</div>
