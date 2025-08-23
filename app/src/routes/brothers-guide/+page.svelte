<script lang="ts">
  import Header from '$lib/components/Header.svelte';

  export let data: any;
  const media_url: string = data?.media_url ?? '';

  // Same files you already had
  const downloads = [
    { lang: 'Русский',  file: `${media_url}bible-school/01_Методическое пособие_rus.pdf` },
    { lang: 'Русский/English', file: `${media_url}bible-school/02_Brothers’ Fellowship Meetings_rus_eng.pdf` },
    { lang: 'Русский/English/Română', file: `${media_url}bible-school/03_Ghid+metodologoic+Rus_eng_rom.pdf` },
  ];

  // Three covers placeholders (#1, #2, #3) – replace src if you have real images
  const covers = [
    { n: '#1', alt: 'Обложка #1', src: `${media_url}upfiles/photos/cover-1.jpg` },
    { n: '#2', alt: 'Обложка #2', src: `${media_url}upfiles/photos/cover-2.jpg` },
    { n: '#3', alt: 'Обложка #3', src: `${media_url}upfiles/photos/cover-3.jpg` }
  ];



    // Keep your downloads list
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


<Header
  title="Методическое пособие для проведения братских общений"
/>

<div class="container-fluid">
  <div class="container">

    <!-- ==== Вербатим текст, без переиначиваний ==== -->
    <div class="row">
      <div class="col-lg-9 mx-auto">
        <p class="mb-3">
          Цель пособия — содействовать проведению в церквях духовно-назидательных встреч на постоянной основе,
          направленных на укрепление взаимных связей между братьями и их духовный рост.
        </p>
        <p class="mb-3">
          Пособие включает 12 тем из Первого послания апостола Павла к Тимофею.
        </p>
        <p class="mb-4">
          Мы верим, что это станет большим благословением как для личного духовного роста, так и для укрепления отношений
          между братьями — внутри поместной церкви, в регионах и в нашем объединении.
        </p>

        <!-- Дедлайны — строка оставлена как в оригинале (два предложения) -->
        <div class="alert alert-secondary border-0 shadow-sm mb-4">
          Если вы планируете начать беседы в сентябре 2025 года, просьба подать заявку до 1 сентября на удобном для вас языке.
          <br />
          Если вы планируете начать беседы в январе 2026 года, просьба подать заявку до 1 декабря на удобном для вас языке.
        </div>

        <!-- “Скачать PDF файл и напечатать самостоятельно” — показываем фразой + кнопками -->

<section class="mt-4">
  <h3 class="h5 mb-3">Заявка / Скачать</h3>

  <div class="list-group shadow-sm">
    {#each downloads as d}
      <div class="list-group-item d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
        <div>
          <div class="fw-semibold">{d.lang}</div>
          <div class="small text-muted">PDF</div>
        </div>

        <div class="d-flex gap-2">
          <a class="btn btn-primary" href={d.file} download rel="noopener">
            Скачать
          </a>
          <a class="btn btn-light border" href={d.file} target="_blank" rel="noopener">
            Открыть в новой вкладке
          </a>
        </div>
      </div>
    {/each}
  </div>

  <p class="text-muted small mt-2">
    «Скачать PDF файл и напечатать самостоятельно». Для чтения онлайн используется встроенный просмотр PDF вашего браузера.
  </p>
</section>

        <!-- Кнопка заявки (нейтральная подпись, чтобы не менять смысл) -->
        <div class="mb-5">
          <a class="btn btn-success btn-lg" href="/order-form" rel="noopener">Подать заявку</a>
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
        <a class="btn btn-light" href={readerSrc || '#'} target="_blank" rel="noopener">Открыть в новой вкладке</a>
        <button class="btn btn-secondary" on:click={closeReader}>Закрыть</button>
      </div>
    </div>
    <iframe class="pdf-reader-frame" src={readerSrc} title={readerTitle} />
  </div>
{/if}

<style>
  .cover-tile {
    height: 160px;
    background: #fff;
  }
  @media (min-width: 992px) {
    .cover-tile { height: 200px; }
  }



    .list-group-item { border: none; border-bottom: 1px solid #eee; }

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
    gap: .75rem;
    justify-content: space-between;
    background: rgba(255,255,255,0.9);
    backdrop-filter: saturate(1.2) blur(4px);
    border-bottom: 1px solid rgba(0,0,0,.06);
    padding: .5rem .75rem;
  }
  .pdf-reader-title {
    font-weight: 600;
    color: #222;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .pdf-reader-actions .btn { margin-left: .5rem; }
  .pdf-reader-frame {
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    border: 0;
    background: #2b2b2b;
  }

  @media (max-width: 576px) {
    .pdf-reader-actions .btn { padding: .375rem .5rem; }
    .pdf-reader-title { max-width: 40vw; }
  }
</style>

