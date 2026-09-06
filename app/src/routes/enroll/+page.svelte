<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	export let data;
	export let form;

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
	let ministry = '';
	let recommendation = '';
	let responsiblePerson = '';
	let personalPhoto: File | null = null;
	let agreeToRules = false;

	// New: Error Message and Maximum File Size
	let photoErrorMessage = '';
	const MAX_FILE_SIZE = 0.5 * 1024 * 1024; // 0.5 MB

	function checkFileSize(file: File) {
		if (file.size > MAX_FILE_SIZE) {
			photoErrorMessage = 'Файл превышает 0.5MB. Пожалуйста, выберите файл меньшего размера.';
			return false;
		}
		photoErrorMessage = '';
		return true;
	}

	function handlePhotoChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file && checkFileSize(file)) {
			personalPhoto = file;
		} else {
			// Reset the input if file is too large
			input.value = '';
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
			age = String(calculatedAge);
		} else {
			age = '';
		}
	}

	function validateForm(event: Event) {
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

<div class="container-xxl py-6">
	<div class="container">
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
						<label class="form-label" for="first_name">Имя <span class="text-danger">*</span></label
						>
						<input
							id="first_name"
							name="first_name"
							type="text"
							class="form-control"
							bind:value={firstName}
							required
						/>
					</div>
					<div class="col-md-4">
						<label class="form-label" for="last_name"
							>Фамилия <span class="text-danger">*</span></label
						>
						<input
							id="last_name"
							name="last_name"
							type="text"
							class="form-control"
							bind:value={lastName}
							required
						/>
					</div>
					<div class="col-md-4">
						<label class="form-label" for="middle_name">Отчество</label>
						<input
							id="middle_name"
							name="middle_name"
							type="text"
							class="form-control"
							bind:value={middleName}
						/>
					</div>
				</div>

				<!-- Birth Date and Age on One Line -->
				<div class="row mt-3">
					<div class="col-md-6">
						<label class="form-label" for="date_of_birth"
							>Дата рождения <span class="text-danger">*</span></label
						>
						<input
							id="date_of_birth"
							name="date_of_birth"
							type="date"
							class="form-control"
							bind:value={birthDate}
							on:input={calculateAge}
							required
						/>
					</div>
					<div class="col-md-6">
						<label class="form-label" for="age">Возраст</label>
						<input id="age" name="age" type="text" class="form-control" bind:value={age} readonly />
					</div>
				</div>

				<!-- Email and Phone on One Line -->
				<div class="row mt-3">
					<div class="col-md-6">
						<label class="form-label" for="email">Email <span class="text-danger">*</span></label>
						<input
							id="email"
							name="email"
							type="email"
							class="form-control"
							bind:value={email}
							required
						/>
					</div>
					<div class="col-md-6">
						<label class="form-label" for="phone">Телефон</label>
						<input id="phone" name="phone" type="tel" class="form-control" bind:value={phone} />
					</div>
				</div>

				<!-- Church Selection -->
				<div class="mt-3">
					<label class="form-label" for="church">Церковь <span class="text-danger">*</span></label>
					<select
						id="church"
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
						<label class="form-label" for="new_church"
							>Введите название церкви <span class="text-danger">*</span></label
						>
						<input
							id="new_church"
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
					<label class="form-label" for="education_history"
						>Где и когда проходил обучение <span class="text-danger">*</span></label
					>
					<textarea
						id="education_history"
						rows="10"
						name="education_history"
						class="form-control"
						bind:value={educationHistory}
						required
					></textarea>
				</div>

				<!-- Ministry -->
				<div class="mt-3">
					<label class="form-label" for="ministry"
						>Служение в церкви <span class="text-danger">*</span></label
					>
					<input
						id="ministry"
						name="ministry"
						type="text"
						class="form-control"
						bind:value={ministry}
						required
					/>
				</div>

				<!-- Recommendation -->
				<div class="mt-3">
					<label class="form-label" for="recommendation"
						>Рекомендация служителя <span class="text-danger">*</span></label
					>
					<textarea
						id="recommendation"
						name="recommendation"
						rows="10"
						class="form-control"
						bind:value={recommendation}
						required
					></textarea>
				</div>

				<!-- Responsible Minister -->
				<div class="mt-3">
					<label class="form-label" for="responsible_minister"
						>Ф.И.О. ответственного служителя <span class="text-danger">*</span></label
					>
					<input
						id="responsible_minister"
						name="responsible_minister"
						type="text"
						class="form-control"
						bind:value={responsiblePerson}
						required
					/>
				</div>

				<!-- Personal Photo -->
				<div class="mt-3">
					<label class="form-label" for="personal_photo"
						>Личная Фотография <span class="text-danger">*</span></label
					>
					<input
						id="personal_photo"
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
					<h2 class="h5">Правила поступления:</h2>
					<ul>
						<li>Подтверждаю обучение на региональных Библейских курсах не менее трех лет.</li>
						<li>Обязуюсь сдать вступительный экзамен.</li>
						<li>Обязуюсь посещать все очные сессии на протяжении четырех лет.</li>
						<li>Принимаю на себя финансовые обязательства по обучению и транспортным расходам.</li>
					</ul>
					<div class="form-check">
						<input
							id="agree_to_rules"
							class="form-check-input"
							type="checkbox"
							bind:checked={agreeToRules}
							required
						/>
						<label class="form-check-label" for="agree_to_rules">
							Я согласен с правилами поступления <span class="text-danger">*</span>
						</label>
					</div>
				</div>

				<button type="submit" class="btn btn-primary my-4">Отправить</button>
			</form>
		{/if}
	</div>
</div>
