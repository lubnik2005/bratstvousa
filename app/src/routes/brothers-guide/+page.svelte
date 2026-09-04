<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	export let data: any;
	const media_url: string = data?.media_url ?? '';

	// Same files you already had
	const downloads = [
		{ lang: 'Русский', file: `${media_url}bible-school/01_Методическое пособие_rus.pdf` },
		{
			lang: 'Русский/English',
			file: `${media_url}bible-school/02_Brothers’ Fellowship Meetings_rus_eng.pdf`
		},
		{
			lang: 'Русский/English/Română',
			file: `${media_url}bible-school/03_Ghid+metodologoic+Rus_eng_rom.pdf`
		}
	];

	// Fullscreen reader state
	let readerOpen = false;
	let readerTitle = '';
	let readerSrc = '';

	// Use pdf.js viewer if you have it; otherwise fallback to the raw PDF
	// 1) To use pdf.js (recommended), host viewer at /pdfjs/web/viewer.html and set PDFJS_VIEWER:
	// const PDFJS_VIEWER = '/pdfjs/web/viewer.html';
	// 2) If you don’t have pdf.js yet, leave it undefined to use the raw PDF in an iframe.
	const PDFJS_VIEWER: string | undefined = undefined;

	function openReader(item: { lang: string; file: string }) {
		readerTitle = `Пособие — ${item.lang}`;
		readerSrc = PDFJS_VIEWER
			? `${PDFJS_VIEWER}?file=${encodeURIComponent(item.file)}#zoom=page-width`
			: `${item.file}#view=FitH`; // browser's native viewer hint
		readerOpen = true;
		// prevent body scroll
		document.documentElement.style.overflow = 'hidden';
		document.body.style.overflow = 'hidden';
	}

	function closeReader() {
		readerOpen = false;
		readerSrc = '';
		document.documentElement.style.overflow = '';
		document.body.style.overflow = '';
	}
</script>

<svelte:head>
	<meta property="og:title" content="Методическое пособие для проведения братских общений" />
	<meta property="og:image" content={media_url + 'bible-school/Study_Guide_Cover.jpg'} />
	<meta name="twitter:image" content={media_url + 'bible-school/Study_Guide_Cover.jpg'} />
	<meta property="og:description" content="Американское Объединение МСЦ ЕХБ" />
	<meta property="og:type" content="article" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.event?.title} />
	<meta name="twitter:description" content="Американское Объединение МСЦ ЕХБ" />
	<meta property="og:site_name" content="Bratstvo USA" />
	<title>Методическое пособие для проведения братских общений в церкви</title>
	<meta name="description" content="Американское Объединение МСЦ ЕХБ" />
</svelte:head>

<Header title="Методическое пособие для проведения братских общений" />

<div class="container-xxl py-6">
	<div class="container">
		<!-- ==== Вербатим текст, без переиначиваний ==== -->
		<div class="row">
			<div class="col-lg-9 mx-auto">
				<p class="mb-3">
					Цель пособия — содействовать проведению в церквях духовно-назидательных встреч на
					постоянной основе, направленных на укрепление взаимных связей между братьями и их духовный
					рост.
				</p>
				<p class="mb-3">Пособие включает 12 тем из Первого послания апостола Павла к Тимофею.</p>
				<p class="mb-4">
					Мы верим, что это станет большим благословением как для личного духовного роста, так и для
					укрепления отношений между братьями — внутри поместной церкви, в регионах и в нашем
					объединении.
				</p>

				<!-- Дедлайны -->
				<div class="deadline-note mb-4">
					Если вы планируете начать беседы в сентябре 2025 года, просьба подать заявку до 1 сентября
					на удобном для вас языке.
					<br />
					Если вы планируете начать беседы в январе 2026 года, просьба подать заявку до 1 декабря на
					удобном для вас языке.
				</div>

				<!-- “Скачать PDF файл и напечатать самостоятельно” — показываем фразой + кнопками -->

				<section class="mt-4">
					<h2 class="h5 mb-3">Заявка / Скачать</h2>

					<div class="download-list">
						{#each downloads as d}
							<div
								class="download-row d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3"
							>
								<div>
									<div class="download-lang">{d.lang}</div>
									<div class="eyebrow">PDF</div>
								</div>

								<div class="d-flex gap-3">
									<a class="btn-quiet" href={d.file} download rel="noopener">Скачать</a>
									<a class="btn-quiet" href={d.file} target="_blank" rel="noopener">
										Открыть в новой вкладке
									</a>
								</div>
							</div>
						{/each}
					</div>

					<p class="text-muted small mt-2">
						«Скачать PDF файл и напечатать самостоятельно». Для чтения онлайн используется
						встроенный просмотр PDF вашего браузера.
					</p>
				</section>

				<!-- Кнопка заявки -->
				<div class="mb-5">
					<a class="btn btn-primary" href="/order-form" rel="noopener">Подать заявку</a>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- ===================== FULLSCREEN READER OVERLAY ===================== -->
{#if readerOpen}
	<div class="pdf-reader-overlay" role="dialog" aria-modal="true" aria-label={readerTitle}>
		<div class="pdf-reader-bar">
			<div class="pdf-reader-title">{readerTitle}</div>
			<div class="pdf-reader-actions">
				<a class="btn btn-light" href={readerSrc || '#'} target="_blank" rel="noopener"
					>Открыть в новой вкладке</a
				>
				<button class="btn btn-secondary" on:click={closeReader}>Закрыть</button>
			</div>
		</div>
		<iframe class="pdf-reader-frame" src={readerSrc} title={readerTitle}></iframe>
	</div>
{/if}

<style>
	.deadline-note {
		padding: 1.25rem 1.5rem;
		background: var(--bs-paper-sunk);
		border-left: 2px solid var(--bs-secondary);
		color: var(--bs-body-color);
		line-height: 1.7;
	}
	.download-list {
		border-top: 1px solid var(--bs-rule);
	}
	.download-row {
		padding: 1.25rem 0;
		border-bottom: 1px solid var(--bs-rule);
	}
	.download-lang {
		font-family: var(--bs-font-serif);
		font-size: 1.1rem;
		color: var(--bs-dark);
	}

	/* Fullscreen reader */
	.pdf-reader-overlay {
		position: fixed;
		inset: 0;
		background: #111;
		z-index: 1050;
		display: flex;
		flex-direction: column;
	}
	.pdf-reader-bar {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		justify-content: space-between;
		background: var(--bs-paper);
		border-bottom: 1px solid var(--bs-rule);
		padding: 0.5rem 0.75rem;
	}
	.pdf-reader-title {
		font-weight: 600;
		color: #222;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.pdf-reader-actions .btn {
		margin-left: 0.5rem;
	}
	.pdf-reader-frame {
		flex: 1 1 auto;
		width: 100%;
		height: 100%;
		border: 0;
		background: #2b2b2b;
	}

	@media (max-width: 576px) {
		.pdf-reader-actions .btn {
			padding: 0.375rem 0.5rem;
		}
		.pdf-reader-title {
			max-width: 40vw;
		}
	}
</style>
