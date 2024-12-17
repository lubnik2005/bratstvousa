<script lang="ts">
	const members = [
		{
			name: 'Нейман Константин Андреевич',
			role: 'Ответственный за АО, член Совета церквей МСЦ ЕХБ',
			phone: '13609070399',
			whatsapp: 'https://wa.me/13609070399',
			viber: 'viber://chat?number=13609070399',
			image: 'upfiles/page/ba02c86ed301cc2580bfac08e00286ad66260659.jpg'
		},
		{
			name: 'Власенко Александр Мефодьевич',
			role: 'Член Совета церквей МСЦ ЕХБ Ответственный за семейный отдел в ВР',
			phone: '14132423565',
			whatsapp: 'https://wa.me/14132423565',
			viber: 'viber://chat?number=14132423565',
			image: 'upfiles/page/4bc91f92895f57e7241632fdd1965f9048005157.jpg'
		},
		{
			name: 'Никита Георгий Андреевич',
			role: 'Почётный член совета АО',
			phone: '17042235559',
			whatsapp: 'https://wa.me/17042235559',
			viber: 'viber://chat?number=17042235559',
			image: 'upfiles/page/87cabb2692d058d10d6ae0eda3e80d2750977893.jpg'
		},
		{
			name: 'Бровер Александр Яковлевич',
			role: 'Почётный член совета АО',
			phone: '15402094489',
			whatsapp: 'https://wa.me/15402094489',
			viber: 'viber://chat?number=15402094489',
			image: 'upfiles/page/af3adebccee815dbb6a43bd0456cdb1486008029.jpg'
		},
		{
			name: 'Помазнюк Виктор Владимирович',
			role: 'Ответственный за КР и семейный отдел АО, сотрудник Совета церквей МСЦ ЕХБ',
			phone: '19165888057',
			whatsapp: 'https://wa.me/19165888057',
			viber: 'viber://chat?number=19165888057',
			image: 'upfiles/page/f9aed63d5d9b501c5ac83f4cd217f4f151660445.jpg'
		},
		{
			name: 'Шуст Николай Иванович',
			role: 'Ответственный за отдел благовестия АО',
			phone: '19164705422',
			whatsapp: 'https://wa.me/19164705422',
			viber: 'viber://chat?number=19164705422',
			image: 'upfiles/page/dc521a6ad4e3461000aa1c116f36613220574103.jpg'
		},
		{
			name: 'Станиславский Николай Николаевич',
			role: 'Пресвитер одной из церквей КР',
			phone: '19162015033',
			whatsapp: 'https://wa.me/19162015033',
			viber: 'viber://chat?number=19162015033',
			image: 'upfiles/page/94037540a10632cadf5b8629b0f823d570481879.jpg'
		},
		{
			name: 'Деркач Павел Владимирович',
			role: 'Пресвитер одной из церквей КР',
			phone: '19162476772',
			whatsapp: 'https://wa.me/19162476772',
			viber: 'viber://chat?number=19162476772',
			image: 'upfiles/page/7aa27e67e9706087cd0cc05964c5da6679338535.jpg'
		},
		{
			name: 'Бадулин Павел Иванович',
			role: 'Помощник ответственного за СЗР',
			phone: '15099817000',
			whatsapp: 'https://wa.me/15099817000',
			viber: 'viber://chat?number=15099817000',
			image: 'upfiles/page/d72154b1e8d3c95bb5df3d75e2a6735b78957589.jpg'
		},
		{
			name: 'Кузнецов Сергей Григорьевич',
			role: 'Ответственный за молодёжный отдел СЗР',
			phone: '15092708621',
			whatsapp: 'https://wa.me/15092708621',
			viber: 'viber://chat?number=15092708621',
			image: 'upfiles/page/e0fe0d8d17ccb858a38cf0be9f4b8dda57901834.jpg'
		},
		{
			name: 'Камке Фёдор Васильевич',
			role: 'Ответственный за детский отдел АО',
			phone: '13609311729',
			whatsapp: 'https://wa.me/13609311729',
			viber: 'viber://chat?number=13609311729',
			image: 'upfiles/page/ce0256251e1b6b11d241ba750ec9b66037651884.jpg'
		},
		{
			name: 'Бальжик Вениамин Петрович',
			role: 'Ответственный за молодежный отдел АО',
			phone: '19168012356',
			whatsapp: 'https://wa.me/19168012356',
			viber: 'viber://chat?number=19168012356',
			image: 'upfiles/page/cb31fa8b08e23898656310e1a7e4a95443869999.jpg'
		},
		{
			name: 'Павленко Юрий Иванович',
			role: 'Ответственный за МХО АО',
			phone: '15038055545',
			whatsapp: 'https://wa.me/15038055545',
			viber: 'viber://chat?number=15038055545',
			image: 'upfiles/page/60668a880d8bc70c8bbf16516cf8cd1f99637969.jpg'
		},
		{
			name: 'Озеров Андрей Иванович',
			role: 'Ответственный за детский отдел СЗР',
			phone: '15035100863',
			whatsapp: 'https://wa.me/15035100863',
			viber: 'viber://chat?number=15035100863',
			image: 'upfiles/page/30add9974cbb6503e519404ce01fee9587610745.jpg'
		},
		{
			name: 'Савченко Андрей Михайлович',
			role: 'Ответственный за ВР, сотрудник Совета церквей МСЦ ЕХБ',
			phone: '12153008743',
			whatsapp: 'https://wa.me/12153008743',
			viber: 'viber://chat?number=12153008743',
			image: 'upfiles/page/452f607bccce75a4929d4795a582d5e845931310.jpg'
		},
		{
			name: 'Чепуренко Василий Иванович',
			role: 'Пресвитер одной из церквей ВР',
			phone: '14133880078',
			whatsapp: 'https://wa.me/14133880078',
			viber: 'viber://chat?number=14133880078',
			image: 'upfiles/page/791ad11272fb995d6e6c0250941e457072765829.jpg'
		},
		{
			name: 'Щербина Борис Егорович',
			role: 'Пресвитер одной из церквей ВР',
			phone: '12679392537',
			whatsapp: 'https://wa.me/12679392537',
			viber: 'viber://chat?number=12679392537',
			image: 'upfiles/page/00ec1eef9c83f98c0c615383c14ab81e70302441.jpg'
		},
		{
			name: 'Димитров Виталий Борисович',
			role: 'Благовестник одной из церквей ВР',
			phone: '14139771337',
			whatsapp: 'https://wa.me/14139771337',
			viber: 'viber://chat?number=14139771337',
			image: 'upfiles/page/f55878cadf26606682f48b9016feb1b091841480.jpg'
		},
		{
			name: 'Солохин Вениамин Иванович',
			role: 'Ответственный за ЦР',
			phone: '14028908181',
			whatsapp: 'https://wa.me/14028908181',
			viber: 'viber://chat?number=14028908181',
			image: 'upfiles/page/734719b91a5419650780de028989d19b99232407.jpg'
		},
		{
			name: 'Русавук Леонид Андреевич',
			role: 'Помощник ответственного за ЦР и ответственный за МХО ЦР',
			phone: '15097681995',
			whatsapp: 'https://wa.me/15097681995',
			viber: 'viber://chat?number=15097681995',
			image: 'upfiles/page/eb3a68713071dbe3142c351a25f5f1aa48726240.jpg'
		}
	];
</script>

<!-- Page Header Start -->
<div class="container-fluid p-0">
	<img src="img/committee.webp" class="img-fluid w-100" alt="Top Image" />
</div>
<!-- Page Header End -->

<div class="container-xxl py-6">
	<div class="container">
		<div class="section-header mx-auto mb-5 text-center" style="max-width: 500px;">
			<h1 class="display-5 mb-3">Состав Совета</h1>
		</div>
	</div>

	<div class="row g-4">
		<!-- First Team Member -->
		{#each members as member}
			<!-- content here -->
			<div class="col-md-6 col-lg-3">
				<div class="team-wrap rounded border p-3">
					<div class="team-member text-center">
						<div class="team-img mb-3">
							<img
								src="https://www.bratstvousa.com/{member.image}"
								alt={member.name}
								class="rounded-circle img-fluid"
							/>
						</div>
						<h5 class="team-title">{member.name}</h5>
						<p class="text-muted">{member.role}</p>
						<div class="social">
							<a href="tel:{member.phone}" class="phone" title="Phone"
								><i class="fas fa-phone"></i></a
							>
							<a href={member.whatsapp} class="whatsapp" title="WhatsApp"
								><i class="fab fa-whatsapp"></i></a
							>
							<a href={member.viber} title="Viber">
								<img
									src="https://www.bratstvousa.com/img/viber.svg"
									alt="Viber"
									style="width: 20px;"
								/>
							</a>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
