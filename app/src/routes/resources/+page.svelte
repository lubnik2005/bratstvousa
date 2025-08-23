<script lang="ts">
  const cards = [
    {
      href: '/brothers-guide',
      title: 'Методическое пособие для братских общений',
      subtitle:
        '12 тем из 1-го Послания к Тимофею. Встречи раз в месяц, укрепляющие духовный рост и братское общение.',
      badge: 'PDF • RUS / ENG / ROM',
    },
    // add more resources here later…
  ];
	import Header from '$lib/components/Header.svelte';
</script>

<svelte:head>
	<title>Ресурсы</title>
	<meta property="og:title" content="Ресурсы" />
	<meta name="twitter:title" content="Ресурсы" />
	<meta
		property="og:image"
		content="https://bratstvo-usa.s3.us-west-2.amazonaws.com/logo_medium.png"
	/>

  <title>Ресурсы — Отдел библейского образования</title>
  <meta name="description" content='«Чтобы … ты знал, как должно поступать в доме Божием …» (1Тим 3:15)' />
</svelte:head>

<Header title="Ресурсы" subtitle='«Чтобы … ты знал, как должно поступать в доме Божием …» (1Тим 3:15)'  />

<div class="container-fluid">
  <div class="container">
    <section class="mb-4">
      <p class="text-dark">
        Учитывая многообразие служений в поместной церкви и осознавая необходимость уделять внимание
        различным группам верующих, Отдел библейского образования Американского объединения ставит своей
        целью разработку и предоставление методических пособий, призванных содействовать проведению
        систематических и регулярных бесед с разными категориями членов поместной церкви.
      </p>
    </section>

    <section class="row g-4">
      {#each cards as c}
        <div class="col-md-6 col-lg-4">
          <a class="text-decoration-none" href={c.href}>
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body d-flex flex-column">
                <div class="d-flex align-items-start justify-content-between mb-2">
                  <h3 class="h5 mb-0">{c.title}</h3>
                </div>
                <p class="text-muted flex-grow-1">{c.subtitle}</p>
                <div>
                  <span class="badge bg-light text-dark border">{c.badge}</span>
                </div>
              </div>
              <div class="card-footer bg-white border-0 pt-0 pb-3">
                <span class="btn btn-outline-primary">Подробнее</span>
              </div>
            </div>
          </a>
        </div>
      {/each}
    </section>
  </div>
</div>

<style>
  .card:hover { transform: translateY(-2px); transition: transform .15s ease; }
</style>

