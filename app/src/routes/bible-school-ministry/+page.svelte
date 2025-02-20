<script>
	import Calendar from '$lib/components/Calendar.svelte';
	import Header from '$lib/components/Header.svelte';
	import UpcomingEvents from '$lib/components/UpcomingEvents.svelte';
	export let data;
</script>

<Header title="Библейская Школа" />

<div class="container-fluid">
	<div class="container">
		<div class="row g-0 gx-5 align-items-end">
			<div class="col-lg-8">
				<div class="section-header mb-5 text-start" style="max-width: 700px;">
					<h1 class="display-5 mb-3">Приветственное слово</h1>
					<p>«Вникай в себя и в учение; занимайся сим постоянно...» 1Тим.4:16</p>
				</div>
			</div>
		</div>

		<div class="row">
			<!-- First Column -->
			<div class="col-lg-9">
				<h2 class="mb-3">О школе</h2>
				<p>
					Библейская школа Американского объединения предназначена для твёрдого усвоения основных догматов Писания о Личности Бога, получения хороших навыков экзегетического исследования Писания, более глубокого изучения принципов проповеди Благой вести.
				</p>
				<p>
					Предполагаемый возраст студентов — от 20 до 40 лет. Учебный план школы включает 15 предметов, которые изучаются в течение 4 лет. На каждый год запланированы 3 очные сессии, а также уроки в режиме онлайн. Таким образом, за 1 учебный год студенты школы проходят 75 рабочих часов непосредственного обучения в классе, дополняется еженедельной самостоятельной работой (до 2 часов в неделю), что в общей сложности составляет 175 учебных часов за год.
				</p>
				<p>
					Программа полного курса обучения состоит из 4 независимых блоков, что позволяет новым студентам поступать в школу в начале каждого года. Техническое обеспечение учебного процесса осуществляется на платформе Canvas, что обеспечивает удобство и доступность для всех студентов.
				</p>

		</div>
			<!-- Second Column -->
			<div class="col-lg-3">
				<div class="team-wrap rounded border p-3">
					<div class="team-member text-center">
						<div class="team-img mb-3">
							<img style="width: 100%;" src="{data.media_url}upfiles/page/2110baeef15c81cd594268c9bffe0af139777496.jpg" alt=""/>
						</div>
						<h5 class="team-title">Камке<br /> Фёдор Васильевич</h5>
						<div class="social">
							<a href="mailto:bibleeducation@bratstvousa.com">bibleeducation@bratstvousa.com</a>
						</div>
					</div>
				</div>
			</div>
		</div>
		</div>
		</div>



<div class="container mt-5">
    <h2 class="mb-4 text-center">Учебный процесс</h2>
    <p class="text-center">
        Каждый год обучения включает <strong>три очных сессии</strong> по 25 часов каждая и <strong>50 часов заочного обучения</strong>, дополняемых самостоятельной работой.
    </p>

    <div class="row text-center">
        <div class="col-md-4">
            <div class="p-3 border rounded">
                <img src="https://placehold.co/300x200" class="img-fluid mb-3 rounded" alt="Vancouver Session">
                <h5 class="fw-bold">1-я сессия</h5>
                <p>27 - 30 марта</p>
                <p><strong>Vancouver, WA</strong></p>
            </div>
        </div>
        <div class="col-md-4">
            <div class="p-3 border rounded">
                <img src="https://placehold.co/300x200" class="img-fluid mb-3 rounded" alt="Sacramento Session">
                <h5 class="fw-bold">2-я сессия</h5>
                <p>24 - 27 июля</p>
                <p><strong>Sacramento, CA</strong></p>
            </div>
        </div>
        <div class="col-md-4">
            <div class="p-3 border rounded">
                <img src="https://placehold.co/300x200" class="img-fluid mb-3 rounded" alt="Philadelphia Session">
                <h5 class="fw-bold">3-я сессия</h5>
                <p>11 - 14 декабря</p>
                <p><strong>Philadelphia, PA</strong></p>
            </div>
        </div>
    </div>

    <p class="mt-4 text-center">
        Между сессиями студенты выполняют <strong>50 часов заочной работы</strong> на платформе <strong>Canvas</strong>, а также выделяют <strong>2 часа в неделю</strong> на самостоятельное изучение.
    </p>

    <h2 class="mt-5 text-center">Курсы по годам</h2>

    <div class="row">
        <div class="col-md-6">
            <div class="p-3 border rounded mb-3">
                <h4 class="fw-bold">Первый курс</h4>
                <img src="https://placehold.co/400x200" class="img-fluid mb-3 rounded" alt="Первый курс">
                <ul>
                    <li>Герменевтика: Практическая работа с текстом</li>
                    <li>Экзегетика: Послание к Титу, Первое и Второе Тимофею</li>
                    <li>Библиология</li>
                    <li>Душепопечение</li>
                    <li>Догматика: Учение о Боге</li>
                </ul>
            </div>
        </div>
        <div class="col-md-6">
            <div class="p-3 border rounded mb-3">
                <h4 class="fw-bold">Второй курс</h4>
                <img src="https://placehold.co/400x200" class="img-fluid mb-3 rounded" alt="Второй курс">
                <ul>
                    <li>Гомилетика: Христоцентричная проповедь</li>
                    <li>Экзегетика: Послание к Евреям</li>
                    <li>Апологетика</li>
                    <li>Пастырелогия</li>
                    <li>Догматика: Учение об Иисусе Христе</li>
                </ul>
            </div>
        </div>
        <div class="col-md-6">
            <div class="p-3 border rounded mb-3">
                <h4 class="fw-bold">Третий курс</h4>
                <img src="https://placehold.co/400x200" class="img-fluid mb-3 rounded" alt="Третий курс">
                <ul>
                    <li>Гомилетика: Текстовая и тематическая проповедь</li>
                    <li>Экзегетика: Книга Пророка Исаии</li>
                    <li>Аполгетика</li>
                    <li>Принципы служения в Церкви</li>
                    <li>Догматика: Учение о Духе Святом</li>
                </ul>
            </div>
        </div>
        <div class="col-md-6">
            <div class="p-3 border rounded mb-3">
                <h4 class="fw-bold">Четвёртый курс</h4>
                <img src="https://placehold.co/400x200" class="img-fluid mb-3 rounded" alt="Четвёртый курс">
                <ul>
                    <li>Гомилетика: Экспозиционная проповедь</li>
                    <li>Экзегетика: Послание к Римлянам</li>
                    <li>Апологетика</li>
                    <li>Благовестие</li>
                    <li>Догматика: Учение о спасении</li>
                </ul>
            </div>
        </div>
    </div>

    <h2 class="mt-5 text-center">Финансовая информация</h2>
    <p class="text-center">
        Для покрытия текущих затрат школы курсантам необходимо платить <strong>$1,000 в год</strong>. Кроме того, обучение включает расходы на транспорт, которые рекомендуется покрывать из церковной кассы.
    </p>

    <h2 class="mt-5 text-center">Руководство школы</h2>
    <div class="row text-center">
        <div class="col-md-4">
            <div class="p-3 border rounded">
                <img src="https://placehold.co/150x150" class="img-fluid rounded-circle mb-3" alt="Диакон Дмитрий">
                <h5 class="fw-bold">Ответственный за школу</h5>
                <p>Диакон Дмитрий</p>
            </div>
        </div>
        <div class="col-md-4">
            <div class="p-3 border rounded">
                <img src="https://placehold.co/150x150" class="img-fluid rounded-circle mb-3" alt="Щербина Борис">
                <h5 class="fw-bold">Помощник по учебной части</h5>
                <p>Щербина Борис</p>
            </div>
        </div>
        <div class="col-md-4">
            <div class="p-3 border rounded">
                <img src="https://placehold.co/150x150" class="img-fluid rounded-circle mb-3" alt="Бруяко Андрей">
                <h5 class="fw-bold">Помощник по технической части</h5>
                <p>Бруяко Андрей</p>
            </div>
        </div>
    </div>
    <div class="mt-5 p-4 rounded bg-light text-center">
        <h3 class="mb-3">Поступление в школу</h3>
        <p>Если вы хотите поступить в Библейскую Школу, заполните анкету и отправьте её до 5 марта 2025 года.</p>
        <a href="path_to_form.pdf" class="btn btn-primary">Скачать анкету</a>
    </div>
</div>


		<!-- Form Recommendation Section -->

<UpcomingEvents ministry_slug="bible-courses-ministry" show_filters={false} upcomingEvents={data.upcomingEvents} media_url={data.media_url} />
<UpcomingEvents ministry_slug="bible-courses-ministry" title="Архив" show_filters={false} upcomingEvents={data.archivedEvents} media_url={data.media_url} />
