<script>
  export let data;
  import Header from "$lib/components/Header.svelte";
</script>

<Header title="Музыкально хоровой отдел (МХО)" />

<!-- Page Header Start -->
<div class="container-fluid">
  <div class="container">
    <div class="row">
      <!-- First Column -->
      <div class="col-lg-8">
        <p>
          Дорогие друзья, Музыкально-хоровой отдел МСЦ ЕХБ, имеет благодарность Богу и радость за
          благословения в этом служении. Радость за пройденный путь этого служения и видеть, как
          молодое поколение, в этом служении проявляет усердие и ревность. Благослови Вас Бог,
          чтобы каждый человек послужил Ему в своей жизни и через музыкальное служение, ещё больше
          прославился наш Великий Бог!   
        </p>
        <footer class="blockquote-footer">Юрий Иванович Павленко </footer>
        <a class="btn btn-primary" target="_blank" href="https://mscmusic.org/">MSC Music</a>

      </div>

      <!-- Second Column -->
      <div class="col-lg-4">
        <img
          style="width: 100%;"
          src="{data.media_url}/upfiles/page/e520e72681104b35e9d52bd1ac40119b26192271.jpg"
          alt=""
        />
      </div>
    </div>
  </div>
</div>

