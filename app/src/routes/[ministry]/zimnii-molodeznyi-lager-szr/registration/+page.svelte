<script lang="ts">
	import { enhance } from '$app/forms';
	import Header from '$lib/components/Header.svelte';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	$: errors = (form?.form && 'errors' in form.form ? form.form.errors : {}) as Record<
		string,
		string
	>;
	$: values = (form?.form && 'fields' in form.form ? form.form.fields : {}) as Record<
		string,
		string
	>;
</script>

<svelte:head>
	<title>Регистрация — Зимний молодежный лагерь СЗР</title>
</svelte:head>

<Header title="Регистрация на лагерь" subtitle="Зимний молодежный лагерь СЗР" />

<div class="container-xxl py-6">
	<div class="container">
		<div class="measure-wide mx-auto">
			{#if form?.message}
				<div class="alert alert-success" role="alert">{form.message}</div>
			{:else}
				<form method="post" use:enhance>
					<!-- honeypot -->
					<input
						type="text"
						name="middle_name"
						tabindex="-1"
						autocomplete="off"
						style="position:absolute;left:-9999px"
						aria-hidden="true"
					/>

					<div class="mb-3">
						<label class="form-label" for="firstName">Имя</label>
						<input
							class="form-control"
							id="firstName"
							name="firstName"
							value={values.firstName ?? ''}
						/>
						{#if errors.firstName}<div class="text-danger small mt-1">{errors.firstName}</div>{/if}
					</div>

					<div class="mb-3">
						<label class="form-label" for="lastName">Фамилия</label>
						<input class="form-control" id="lastName" name="lastName" value={values.lastName ?? ''} />
						{#if errors.lastName}<div class="text-danger small mt-1">{errors.lastName}</div>{/if}
					</div>

					<div class="mb-3">
						<label class="form-label" for="church">Церковь</label>
						<input class="form-control" id="church" name="church" value={values.church ?? ''} />
						{#if errors.church}<div class="text-danger small mt-1">{errors.church}</div>{/if}
					</div>

					<div class="mb-3">
						<label class="form-label" for="email">Email</label>
						<input
							class="form-control"
							id="email"
							name="email"
							type="email"
							value={values.email ?? ''}
						/>
						{#if errors.email}<div class="text-danger small mt-1">{errors.email}</div>{/if}
					</div>

					<div class="mb-3">
						<label class="form-label" for="phone">Телефон</label>
						<input class="form-control" id="phone" name="phone" value={values.phone ?? ''} />
					</div>

					<div class="mb-4">
						<label class="form-label" for="leaderId">Ответственный за молодежь</label>
						<select class="form-select" id="leaderId" name="leaderId">
							<option value="">— Выберите —</option>
							{#each data.leaders as leader (leader.id)}
								<option value={leader.id} selected={String(values.leaderId) === String(leader.id)}>
									{leader.name}
								</option>
							{/each}
						</select>
						{#if errors.leaderId}<div class="text-danger small mt-1">{errors.leaderId}</div>{/if}
					</div>

					<button class="btn btn-primary" type="submit">Отправить заявку</button>
				</form>
			{/if}
		</div>
	</div>
</div>
