<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  export let data;

  let churches = [];
  let selectedChurch = '';
  let newChurch = '';
  let useNewChurch = false;

  let lastName = '';
  let middleName = '';
  let firstName = '';
  let birthDate = '';
  let age = '';
  let regionalCourses = '';
  let educationHistory = '';
  let ministry = '';
  let recommendation = '';
  let responsiblePerson = '';
  let signature = '';
  let email = '';
  let phone = '';
  console.log(data.churches);

  function calculateAge() {
    if (birthDate) {
      const today = new Date();
      const birth = new Date(birthDate);
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      const monthDifference = today.getMonth() - birth.getMonth();

      // Adjust age if birthday hasn't occurred this year yet
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birth.getDate())
      ) {
        calculatedAge--;
      }

      age = calculatedAge;
    } else {
      age = '';
    }
  }
</script>

<div class="container mt-4">
  <h2>Анкета поступающего в Библейскую школу</h2>

  <form method="POST" class="needs-validation">
    <!-- Names on One Line -->
    <div class="row">
      <div class="col-md-4">
        <label class="form-label">Фамилия</label>
        <input name="last_name" type="text" class="form-control" bind:value={lastName} required />
      </div>
      <div class="col-md-4">
        <label class="form-label">Имя</label>
        <input name="first_name" type="text" class="form-control" bind:value={firstName} required />
      </div>
      <div class="col-md-4">
        <label class="form-label">Отчество</label>
        <input name="middle_name" type="text" class="form-control" bind:value={middleName} required />
      </div>
    </div>

    <!-- Birth Date and Age on One Line -->
    <div class="row mt-3">
      <div class="col-md-6">
        <label class="form-label">Дата рождения</label>
        <input 
          name="date_of_birth" 
          type="date" 
          class="form-control" 
          bind:value={birthDate} 
          on:input={calculateAge} 
          required 
        />
      </div>
      <div class="col-md-6">
        <label class="form-label">Возраст</label>
        <input 
          name="age" 
          type="text" 
          class="form-control" 
          bind:value={age} 
          readonly 
        />
      </div>
    </div>

    <!-- Email and Phone on One Line -->
    <div class="row mt-3">
      <div class="col-md-6">
        <label class="form-label">Email</label>
        <input name="email" type="email" class="form-control" bind:value={email} required />
      </div>
      <div class="col-md-6">
        <label class="form-label">Телефон</label>
        <input name="phone" type="tel" class="form-control" bind:value={phone} />
      </div>
    </div>

    <!-- Church Selection -->
    <div class="mt-3">
      <label class="form-label">Церковь</label>
      <select name="church" class="form-select" bind:value={selectedChurch} on:change={() => useNewChurch = selectedChurch === 'other'}>
        <option value="" disabled selected>Выберите церковь</option>
        {#each data.churches as church}
          <option value={church.id}>{church.name_line_1 + " " + church.name_line_2}</option>
        {/each}
        <option value="other">Другое (ввести вручную)</option>
      </select>
    </div>

    <!-- New Church Field (Conditional) -->
    {#if useNewChurch}
      <div class="mt-3">
        <label class="form-label">Введите название церкви</label>
        <input name="new_church" type="text" class="form-control" bind:value={newChurch} required />
      </div>
    {/if}

    <!-- Education History -->
    <div class="mt-3">
      <label class="form-label">Где и когда проходил обучение</label>
      <textarea name="education_history" class="form-control" bind:value={educationHistory}></textarea>
    </div>

    <!-- Ministry -->
    <div class="mt-3">
      <label class="form-label">Служение в церкви</label>
      <input name="ministry" type="text" class="form-control" bind:value={ministry} />
    </div>

    <!-- Recommendation -->
    <div class="mt-3">
      <label class="form-label">Рекомендация служителя</label>
      <textarea name="recommendation" class="form-control" bind:value={recommendation}></textarea>
    </div>

    <!-- Responsible Minister -->
    <div class="mt-3">
      <label class="form-label">Ф.И.О. ответственного служителя</label>
      <input name="responsible_minister" type="text" class="form-control" bind:value={responsiblePerson} />
    </div>

    <button type="submit" class="btn btn-primary mt-4">Отправить</button>
  </form>
</div>
