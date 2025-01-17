<script>
	export let data;
	import Header from '$lib/components/Header.svelte';
</script>

<Header title="Семейный отдел" />

<!-- Page Header Start -->
<div class="container-fluid pb-5">
	<div class="container">
		<div class="row">
			<!-- First Column -->
			<div class="col-lg-8">
				<p>
					«А я и дом мой будем служить Господу» И. Нав. 24:15 Эти слова произнес Иисус Навин, вождь
					народа Израильского, которого Бог поставил после Моисея. Каждая поместная церковь состоит
					из семей, поэтому очень важно, чтобы семьи были крепкие, богобоязненые и служили Господу.
					На протяжении нескольких лет, в Американском объединении, совершается служение семейного
					отдела. Во всех четырёх регионах есть ответственные за это служение братья, которые
					проводят семейные лагеря, общения для сестёр, общения для отцов и сыновей, мам и дочерей,
					общения для семей в которых есть дети с ограниченными возможностями, а также для вдов и
					одиноких. Совершаются молитвы над детьми. Слава Господу! Молимся, чтобы Бог сохранил наши
					семьи для неба. Хранил от разрушений. Да будет имя Господа нашего прославленно вовеки.
					Слава Ему.
				</p>

				<footer class="blockquote-footer">Помазнюк Виктор Владимирович</footer>
			</div>

			<div class="col-lg-3">
				<div class="team-wrap rounded border p-3">
					<div class="team-member text-center">
						<div class="team-img mb-3">
							<img
								style="width: 100%;"
								src="{data.media_url}upfiles/page/e76ed1bc8553f6df3a8dff8e774622c926341736.jpg"
								alt=""
							/>
						</div>

						<h5 class="team-title">Помазнюк <br />Виктор Владимирович</h5>
						<div class="social">
							<a href="mailto:info@bratstvousa.com">info@bratstvousa.com</a>
							<!-- <div class="social"> -->
							<!-- 	<a href="tel:{member.phone}" class="phone" title="Phone" style="width: 20px;" -->
							<!-- 		><i class="fas fa-phone"></i></a -->
							<!-- 	> -->
							<!-- 	<a href={member.whatsapp} class="whatsapp" title="WhatsApp" style="width: 20px;" -->
							<!-- 		><i class="fab fa-whatsapp"></i></a -->
							<!-- 	> -->
							<!-- 	<a href={member.viber} title="Viber"> -->
							<!-- 		<img src="{data.media_url}img/viber.svg" alt="Viber" style="width: 20px;" /> -->
							<!-- 	</a> -->
							<!-- </div> -->
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
