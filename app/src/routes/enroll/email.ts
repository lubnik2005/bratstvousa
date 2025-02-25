export const email_template = (props) => `
<html lang='ru'>
	<head>
		<meta charset='UTF-8' />
		<meta name='viewport' content='width=device-width, initial-scale=1.0' />
		<title>Новая анкета в Библейскую школу</title>
		<style>
			body { font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0; color: #333; }
			.container { max-width: 700px; margin: 0 auto; background-color: #fff; border-radius: 10px; 
				box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden; border: 1px solid #e0e0e0; }
			.header { background-color: #0d6efd; color: #fff; padding: 20px; text-align: center; }
			.header h2 { margin: 0; font-size: 24px; }
			.content { padding: 20px; line-height: 1.6; }
			.content h3 { color: #0d6efd; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px; 
				margin-bottom: 15px; font-size: 20px; }
			.content ul { padding: 0; list-style: none; }
			.content ul li { background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 5px; 
				margin-bottom: 10px; padding: 10px; }
			.button { display: block; width: fit-content; background-color: #28a745; color: #fff; 
				padding: 10px 15px; text-decoration: none; border-radius: 5px; text-align: center; 
				margin: 20px auto; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); }
			.button:hover { background-color: #218838; }
			.footer { text-align: center; padding: 10px; background-color: #f1f1f1; color: #777; font-size: 12px; }
			.textarea { background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 5px; padding: 10px; 
				color: #333; font-size: 14px; line-height: 1.4; white-space: pre-wrap; overflow-wrap: break-word; 
				max-height: 400px; overflow-y: auto; }
			.photo { display: block; margin: 20px auto; max-width: 200px; border-radius: 10px; 
				box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
		</style>
	</head>
	<body>
		<div class='container'>
			<div class='header'>
				<h2>Новая анкета в Библейскую школу</h2>
			</div>
			<div class='content'>
				<h3>Фото заявителя:</h3>
				<img src="${props.photoUrl}" alt="Фото заявителя" class="photo" />
				<h3>Данные заявителя:</h3>
				<ul>
					<li><strong>Фамилия:</strong> ${props.lastName}</li>
					<li><strong>Имя:</strong> ${props.firstName}</li>
					<li><strong>Отчество:</strong> ${props.middleName}</li>
					<li><strong>Дата рождения:</strong> ${props.dateOfBirth}</li>
					<li><strong>Возраст:</strong> ${props.age}</li>
					<li><strong>Email:</strong> <a href='mailto:${props.email}'>${props.email}</a></li>
					<li><strong>Телефон:</strong> ${props.phone}</li>
					<li><strong>Церковь:</strong> ${props.church_name}</li>
				</ul>
				<h3>История обучения:</h3>
				<div class='textarea'>
					${props.educationHistory}
				</div>
				<h3>Служение в церкви:</h3>
				<div class='textarea'>
					${props.ministry}
				</div>
				<h3>Рекомендация служителя:</h3>
				<div class='textarea'>
					${props.recommendation}
				</div>
				<h3>Ответственный служитель:</h3>
				<p>${props.responsibleMinister}</p>
				<a href='mailto:${props.email}' class='button'>Ответить заявителю</a>
			</div>
			<div class='footer'>
				<p>© 2025 Библейская школа. Все права защищены.</p>
			</div>
		</div>
	</body>
</html>
`;
