<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	// DEMO DATA — sample youth leaders (real dropdown is populated from the DB).
	const leaders = [
		{ id: 1, name: 'Бальжик Вениамин' },
		{ id: 2, name: 'Озеров Андрей' },
		{ id: 3, name: 'Кузнецов Сергей' },
		{ id: 4, name: 'Бадулин Павел' }
	];

	let submitted = false;

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		// Demo only — no data is sent anywhere.
		submitted = true;
	}
</script>

<svelte:head>
	<title>Регистрация — Зимний молодежный лагерь СЗР (Демо)</title>
</svelte:head>

<Header title="Регистрация на лагерь" subtitle="Зимний молодежный лагерь СЗР" />

<div class="container-xxl py-6">
	<div class="container">
		<div class="measure-wide mx-auto">
			{#if submitted}
				<div class="alert alert-success" role="alert">
					Спасибо! Мы получили вашу заявку. (Демо — данные не отправлены.)
				</div>
			{:else}
				<form on:submit={handleSubmit}>
					<div class="mb-3">
						<label class="form-label" for="firstName">Имя</label>
						<input class="form-control" id="firstName" name="firstName" value="Иван" />
					</div>

					<div class="mb-3">
						<label class="form-label" for="lastName">Фамилия</label>
						<input class="form-control" id="lastName" name="lastName" value="Петров" />
					</div>

					<div class="mb-3">
						<label class="form-label" for="church">Церковь</label>
						<input class="form-control" id="church" name="church" value="Сиэтл, Вашингтон" />
					</div>

					<div class="mb-3">
						<label class="form-label" for="email">Email</label>
						<input
							class="form-control"
							id="email"
							name="email"
							type="email"
							value="ivan.petrov@example.com"
						/>
					</div>

					<div class="mb-3">
						<label class="form-label" for="phone">Телефон</label>
						<input class="form-control" id="phone" name="phone" value="(206) 555-0142" />
					</div>

					<div class="mb-4">
						<label class="form-label" for="leaderId">Ответственный за молодежь</label>
						<select class="form-select" id="leaderId" name="leaderId">
							<option value="">— Выберите —</option>
							{#each leaders as leader (leader.id)}
								<option value={leader.id}>{leader.name}</option>
							{/each}
						</select>
					</div>

					<button class="btn btn-primary" type="submit">Отправить заявку</button>
				</form>
			{/if}
		</div>
	</div>
</div>
