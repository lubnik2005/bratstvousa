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

	let lastName = '';
	let middleName = '';
	let firstName = '';
	let birthDate = '';
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

	// New: Error Message and Maximum File Size (5MB)
	let photoErrorMessage = '';
	const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

	function checkFileSize(file) {
		if (file.size > MAX_FILE_SIZE) {
			photoErrorMessage = `Файл превышает 5MB. Пожалуйста, выберите файл меньшего размера.`;
			return false;
		}
		photoErrorMessage = '';
		return true;
	}

	function handlePhotoChange(event) {
		const file = event.target.files[0];
		if (file && checkFileSize(file)) {
			personalPhoto = file;
		} else {
			// Reset the input if file is too large
			event.target.value = '';
			personalPhoto = null;
		}
	}

	function calculateAge() {
		if (birthDate) {
			const today = new Date();
			const birth = new Date(birthDate);
			let calculatedAge = today.getFullYear() - birth.getFullYear();
			const monthDifference = today.getMonth() - birth.getMonth();
			if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
				calculatedAge--;
			}
			age = calculatedAge;
		} else {
			age = '';
		}
	}

	function validateForm(event) {
		if (!agreeToRules) {
			alert('Вы должны согласиться с правилами для подачи анкеты.');
			event.preventDefault();
		}
	}
</script>

<svelte:head>
	<title>Анкета поступающего в Библейскую школу</title>
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

<Header title="Анкета поступающего в Библейскую школу" />

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
			on:submit={validateForm}
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

			<!-- Birth Date and Age on One Line -->
			<div class="row mt-3">
				<div class="col-md-6">
					<label class="form-label">Дата рождения <span class="text-danger">*</span></label>
					<input
						name="date_of_birth"
						type="date"
						class="form-control"
						bind:value={birthDate}
						on:input={calculateAge}
						required
					/>
				</div>
				<div class="col-md-6">
					<label class="form-label">Возраст</label>
					<input name="age" type="text" class="form-control" bind:value={age} readonly />
				</div>
			</div>

			<!-- Email and Phone on One Line -->
			<div class="row mt-3">
				<div class="col-md-6">
					<label class="form-label">Email <span class="text-danger">*</span></label>
					<input name="email" type="email" class="form-control" bind:value={email} required />
				</div>
				<div class="col-md-6">
					<label class="form-label">Телефон</label>
					<input name="phone" type="tel" class="form-control" bind:value={phone} />
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

			<!-- Education History -->
			<div class="mt-3">
				<label class="form-label"
					>Где и когда проходил обучение <span class="text-danger">*</span></label
				>
				<textarea
					rows="10"
					name="education_history"
					class="form-control"
					bind:value={educationHistory}
					required
				></textarea>
			</div>

			<!-- Ministry -->
			<div class="mt-3">
				<label class="form-label">Служение в церкви <span class="text-danger">*</span></label>
				<input name="ministry" type="text" class="form-control" bind:value={ministry} required />
			</div>

			<!-- Recommendation -->
			<div class="mt-3">
				<label class="form-label">Рекомендация служителя <span class="text-danger">*</span></label>
				<textarea
					name="recommendation"
					rows="10"
					class="form-control"
					bind:value={recommendation}
					required
				></textarea>
			</div>

			<!-- Responsible Minister -->
			<div class="mt-3">
				<label class="form-label"
					>Ф.И.О. ответственного служителя <span class="text-danger">*</span></label
				>
				<input
					name="responsible_minister"
					type="text"
					class="form-control"
					bind:value={responsiblePerson}
					required
				/>
			</div>

			Personal Photo
			<div class="mt-3">
				<label class="form-label">Личная Фотография <span class="text-danger">*</span></label>
				<input
					name="personal_photo"
					type="file"
					class="form-control"
					on:change={handlePhotoChange}
					accept="image/*"
					required
				/>
				{#if photoErrorMessage}
					<p class="text-danger">{photoErrorMessage}</p>
				{/if}
			</div>

			<!-- Agreement to Rules -->
			<div class="mt-3">
				<h5>Правила поступления:</h5>
				<ul>
					<li>Подтверждаю обучение на региональных Библейских курсах не менее трех лет.</li>
					<li>Обязуюсь сдать вступительный экзамен.</li>
					<li>Обязуюсь посещать все очные сессии на протяжении четырех лет.</li>
					<li>Принимаю на себя финансовые обязательства по обучению и транспортным расходам.</li>
				</ul>
				<input type="checkbox" bind:checked={agreeToRules} required /> Я согласен с правилами
				поступления <span class="text-danger">*</span>
			</div>

			<button type="submit" class="btn btn-primary my-4">Отправить</button>
		</form>
	{/if}
</div>
