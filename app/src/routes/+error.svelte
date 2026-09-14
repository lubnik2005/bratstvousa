<script lang="ts">
	import { page } from '$app/state';

	function statusText(status: number): { title: string; subtitle: string } {
		switch (status) {
			case 404:
				return {
					title: 'Страница не найдена',
					subtitle: 'Возможно, она была перемещена или больше не существует.'
				};
			case 403:
				return {
					title: 'Доступ запрещён',
					subtitle: 'У вас нет прав для просмотра этой страницы.'
				};
			case 500:
				return {
					title: 'Что-то пошло не так',
					subtitle: 'Мы уже разбираемся. Попробуйте обновить страницу чуть позже.'
				};
			default:
				return {
					title: 'Что-то пошло не так',
					subtitle: 'Произошла непредвиденная ошибка.'
				};
		}
	}

	$: info = statusText(page.status);
	$: rawMessage = page.error?.message;
	$: showRaw = rawMessage && rawMessage !== info.title && rawMessage !== `${page.status}`;

	function goBack() {
		history.back();
	}
</script>

<section class="err">
	<svg class="err-watermark" viewBox="0 0 142 140" aria-hidden="true" focusable="false">
		<path d="M42 0 h16 v46 h42 v16 h-42 v78 h-16 v-78 h-42 v-16 h42 z" fill="currentColor" />
	</svg>

	<div class="err-inner">
		<p class="err-code">{page.status}</p>
		<h1 class="err-title">{info.title}</h1>
		<p class="err-subtitle">{info.subtitle}</p>

		{#if showRaw}
			<p class="err-raw">{rawMessage}</p>
		{/if}

		<div class="err-actions">
			<a class="btn btn-primary err-btn" href="/">Вернуться на главную</a>
			<button type="button" class="btn btn-outline-secondary err-btn" on:click={goBack}>
				Назад
			</button>
		</div>
	</div>
</section>

<style>
	.err {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 70vh;
		padding: 4rem 1.5rem;
		background: var(--bs-paper, #f6f2ea);
		overflow: hidden;
	}

	.err-watermark {
		position: absolute;
		top: 50%;
		left: 50%;
		width: min(60vw, 460px);
		height: auto;
		transform: translate(-50%, -50%);
		color: var(--bs-secondary, #a28c6a);
		opacity: 0.05;
		pointer-events: none;
	}

	.err-inner {
		position: relative;
		text-align: center;
		max-width: 40rem;
	}

	.err-code {
		font-family: var(--bs-font-serif, 'Lora'), serif;
		font-weight: 600;
		font-size: clamp(4.5rem, 14vw, 9rem);
		line-height: 1;
		color: var(--bs-secondary, #a28c6a);
		margin: 0 0 0.5rem;
		letter-spacing: 0.02em;
	}

	.err-title {
		font-family: var(--bs-font-serif, 'Lora'), serif;
		font-weight: 600;
		font-size: clamp(1.6rem, 4vw, 2.4rem);
		color: var(--bs-dark, #2c2b29);
		margin: 0 0 0.75rem;
	}

	.err-subtitle {
		color: var(--bs-ink-muted, #736a5f);
		font-size: 1.05rem;
		margin: 0 auto 1.5rem;
		max-width: 32rem;
	}

	.err-raw {
		display: inline-block;
		font-size: 0.85rem;
		color: var(--bs-ink-muted, #736a5f);
		border-top: 1px solid var(--bs-rule, #ddd5c8);
		padding-top: 0.75rem;
		margin: 0 0 1.75rem;
		max-width: 34rem;
		word-break: break-word;
	}

	.err-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: center;
	}

	.err-btn {
		padding: 0.65rem 1.75rem;
	}
</style>
