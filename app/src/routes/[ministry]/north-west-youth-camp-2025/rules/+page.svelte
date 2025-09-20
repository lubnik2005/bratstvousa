<script lang="ts">
  export const prerender = true;

  // Optional: tweak these to match your site
  const EVENT_TITLE = 'Христианский молодёжный лагерь — СЗР';
  const EVENT_DATES = '16–19 октября 2025 г.';
  const REGISTER_URL = '/youth-ministry/north-west-youth-camp-2025/registration';
  const EVENT_URL = '/youth-ministry/north-west-youth-camp-2025';
</script>

<svelte:head>
  <title>Правила лагеря — СЗР, 16–19 октября 2025</title>
  <meta name="description" content="Правила христианского молодёжного лагеря СЗР (16–19 октября 2025 г.)." />
  <meta property="og:title" content="Правила лагеря — СЗР" />
  <meta property="og:description" content="Правила христианского молодёжного лагеря СЗР (16–19 октября 2025 г.)." />
</svelte:head>

<div class="container-xxl pb-5">
  <div class="container">
    <div class="section-header mx-auto mt-5" style="max-width: 900px;">
      <header class="text-center mb-4">
        <h1 class="display-6 mb-2">Правила лагеря</h1>
        <p class="text-muted">{EVENT_TITLE} • <strong>{EVENT_DATES}</strong></p>
      </header>
      <article class="card shadow-sm border-0">
        <div class="card-body p-4 p-md-5">
          <h2 class="h4 mb-3">Общие положения</h2>
          <ul class="rules-list">
            <li>Участниками лагеря могут быть юноши и девушки молодёжного возраста, ведущие христианский образ жизни.</li>
            <li>Присутствие в лагере должно быть согласовано с руководством церкви.</li>
            <li>Участники должны находиться в лагере весь период, от начала до конца.</li>
            <li><strong>Важно!</strong> Всем участникам необходимо пройти предварительную регистрацию и оплатить стоимость пребывания.</li>
            <li>Все присутствующие должны иметь с собой Библию, письменные принадлежности, средства личной гигиены, тёплую одежду и спальные принадлежности.</li>
            <li>Участники обязаны посещать все обязательные мероприятия и соблюдать распорядок дня.</li>
            <li>Перед выездом необходимо привести в порядок место проживания и территорию.</li>
            <li>Участники обязаны уважительно относиться друг к другу и к сотрудникам лагеря.</li>
            <li>Каждый присутствующий должен выполнять распоряжения службы охраны, связанные с безопасностью, дисциплиной и порядком в лагере.</li>
            <li>Руководство лагеря не несёт ответственности за утерянные вещи и ценности.</li>
          </ul>

          <hr class="my-4" />

          <h2 class="h4 mb-3">Строго запрещается</h2>
          <ul class="rules-list">
            <li>Ввозить, хранить и употреблять спиртные напитки, наркотические и курительные средства.</li>
            <li>Привозить, хранить или использовать любое оружие.</li>
            <li>Самовольно покидать территорию лагеря без уведомления руководства или ответственного за молодёжную группу.</li>
            <li>Наносить материальный ущерб лагерю или имуществу других участников.</li>
          </ul>

          <hr class="my-4" />

          <h2 class="h4 mb-3">Внешний вид</h2>
          <ul class="rules-list">
            <li>Причёска, одежда и обувь должны соответствовать христианским нормам.</li>
            <li>Братьям следует одеваться скромно, избегая маек, шортов и обтягивающих брюк.</li>
            <li>Сёстры не должны использовать косметику, носить брюки, обтягивающую, прозрачную и короткую одежду, а также иметь распущенные волосы.</li>
          </ul>

          <div class="alert alert-warning mt-4" role="alert">
            Соблюдение правил обязательно для всех участников. Несоблюдение может привести к ограничению участия в мероприятиях или досрочному выезду из лагеря.
          </div>
        </div>
      </article>

    </div>
  </div>
</div>

<style>
  .rules-list {
    padding-left: 1.25rem;
  }
  .rules-list li + li {
    margin-top: .4rem;
  }
  @media print {
    nav, .btn, .alert, .text-center.mt-4 { display: none !important; }
    .card { box-shadow: none !important; border: none !important; }
    body { color: #000; }
  }
</style>

