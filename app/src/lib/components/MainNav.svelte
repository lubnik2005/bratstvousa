<script lang="ts">
  import { onMount } from 'svelte';

  // provide your media URL when using the component: <Navbar media_url="/media/" />
  export let media_url = '/media/';

  const menu_items = [
    {
      title: 'О НАС',
      children: [
        { title: 'Приветственное слово', href: 'greeting' },
        { title: 'Краткий обзор', href: 'short-introduction' },
        { title: 'Состав совета', href: 'committee' },
        { title: 'Вероучение', href: 'beliefs' }
      ]
    },
    { title: 'АДРЕСА ДОМОВ МОЛИТВЫ', href: 'churches' },
    { title: 'КАЛЕНДАРЬ', href: 'calendar' },
    { title: 'НОВОСТИ', href: 'news' },
    {
      title: 'ОТДЕЛЫ',
      children: [
        {
          title: 'Детский отдел',
          href: 'childrens-ministry',
          description: 'Учение в юности — основа жизни.'
        },
        {
          title: 'Молодежный отдел',
          href: 'youth-ministry',
          description: 'Молодежь, исполненная Духа Святого, — надежда церкви.'
        },
        {
          title: 'Семейный отдел',
          href: 'family-ministry',
          description: 'Крепкая семья — основа крепкой церкви.'
        },
        {
          title: 'Отдел Благовестия',
          href: 'gospel-ministry',
          description: 'Проповедуйте Евангелие всей твари.'
        },
        {
          title: 'Музыкально хоровой отдел (МХО)',
          href: 'music-choir-ministry',
          description: 'Пойте Господу новую песнь.'
        },
        {
          title: 'Библейское Образование',
          href: 'bible-education-ministry',
          subcategory: [
            { title: 'Библейская Школа', href: 'bible-school-ministry' },
            { title: 'Библейские Курсы', href: 'bible-courses-ministry' },
            { title: 'Application', href: 'enroll' }
          ],
          description: 'Познайте истину, и истина сделает вас свободными.'
        }
      ]
    },
    { title: 'ПРОПОВЕДИ', link: 'https://www.youtube.com/@bratstvousa' }
  ];

  // Helper to build hrefs safely
  const hrefOrLink = (item: any) =>
    item?.href ? `/${item.href}` : item?.link ? item.link : '#';

  onMount(() => {
    // Fixed Navbar shadow on scroll
    const fixedTop: HTMLElement | null = document.querySelector('.responsive-fixed-top');
    const onScroll = () => {
      if (!fixedTop) return;
      if (window.scrollY > 45) {
        fixedTop.classList.add('bg-white', 'shadow');
      } else {
        fixedTop.classList.remove('bg-white', 'shadow');
      }
    };
    window.addEventListener('scroll', onScroll);
    onScroll();

    // Desktop hover for dropdowns (keep Bootstrap click for mobile)
    const enableHover = () => {
      const isDesktop = window.matchMedia('(min-width: 992px)').matches;
      document.querySelectorAll('.navbar .dropdown').forEach((dd) => {
        const toggle = dd.querySelector('[data-bs-toggle="dropdown"]') as HTMLElement | null;
        const menu = dd.querySelector('.dropdown-menu') as HTMLElement | null;
        if (!toggle || !menu) return;

        // clean previous handlers
        dd.removeEventListener('mouseenter', (dd as any)._enter);
        dd.removeEventListener('mouseleave', (dd as any)._leave);
        toggle.removeEventListener('click', (dd as any)._clickPrevent);

        if (isDesktop) {
          (dd as any)._enter = () => {
            dd.classList.add('show');
            menu.classList.add('show');
            toggle.setAttribute('aria-expanded', 'true');
          };
          (dd as any)._leave = () => {
            dd.classList.remove('show');
            menu.classList.remove('show');
            toggle.setAttribute('aria-expanded', 'false');
          };
          (dd as any)._clickPrevent = (e: Event) => {
            // prevent jumping to "#" on desktop for toggles
            if (toggle.getAttribute('href') === '#') e.preventDefault();
          };
          dd.addEventListener('mouseenter', (dd as any)._enter);
          dd.addEventListener('mouseleave', (dd as any)._leave);
          toggle.addEventListener('click', (dd as any)._clickPrevent);
        } else {
          // mobile: rely on Bootstrap's default click/tap
          dd.classList.remove('show');
          menu.classList.remove('show');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    };

    enableHover();
    window.addEventListener('resize', enableHover);
  });
</script>

<!-- Navbar Start -->
<div class="container-fluid responsive-fixed-top whole-navbar px-0">
  <!-- Mobile only title -->
  <div class="d-lg-none text-center">
    <h1 class="text-primary ms-2 p-2" style="font-size:1.4rem">Американское Объединение МСЦ ЕХБ</h1>
  </div>

  <nav class="navbar navbar-expand-lg navbar-light">
    <!-- align navbar contents to the same width as page content -->
    <div class="container">
      <a href="/" class="navbar-brand d-flex align-items-center">
        <img width="100" style="display:inline" src="{media_url}logo.png" alt="Логотип АО" />
        <span class="ms-2">
          <h1 class="fw-bold text-primary d-none d-lg-block m-0 text-center" style="font-size:1.4rem">
            Американское Объединение <br /> МСЦ ЕХБ
          </h1>
        </span>
      </a>

      <button
        type="button"
        class="navbar-toggler"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarCollapse">
        <div class="navbar-nav ms-auto p-4 p-lg-0">
          {#each menu_items as item}
            {#if item.children && item.title === 'ОТДЕЛЫ'}
              <!-- Mega Menu -->
              <div class="nav-item dropdown mega position-static">
                <a
                  href="#"
                  class="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {item.title}
                </a>

                <!-- Full-bleed menu; inner .container matches navbar/page width -->
                <div class="dropdown-menu border-0 shadow mega-menu p-0">
                  <div class="container py-3">
                    <div class="row g-3">
                      {#each item.children as department}
                        <div class="col-12 col-md-6 col-lg-4">
                          <a class="dropdown-item fw-semibold px-0" href={hrefOrLink(department)}>
                            {department.title}
                          </a>

                          {#if department.subcategory}
                            <ul class="list-unstyled mt-2 mb-0">
                              {#each department.subcategory as sub}
                                <li>
                                  <a href={'/' + sub.href} class="dropdown-item px-0 small">
                                    {sub.title}
                                  </a>
                                </li>
                              {/each}
                            </ul>
                          {/if}

                          {#if department.description}
                            <p class="text-muted small mt-2 mb-0">{department.description}</p>
                          {/if}
                        </div>
                      {/each}
                    </div>
                  </div>
                </div>
              </div>
            {:else if item.children}
              <!-- Regular dropdown -->
              <div class="nav-item dropdown">
                <a
                  href="#"
                  class="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {item.title}
                </a>
                <div class="dropdown-menu border-0 shadow">
                  {#each item.children as child}
                    <a href={'/' + child.href} class="dropdown-item">{child.title}</a>
                  {/each}
                </div>
              </div>
            {:else}
              <!-- Simple link -->
              <a href={hrefOrLink(item)} class="nav-item nav-link">{item.title}</a>
            {/if}
          {/each}
        </div>
      </div>
    </div>
  </nav>
</div>
<!-- Navbar End -->

<style>
  /* Fixed header background + shadow on scroll */
  .responsive-fixed-top {
    background: linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0));
    transition: background .3s, box-shadow .3s;
    z-index: 1000;
    width: 100%;
    top: 0;
    position: fixed;
  }

  /* MEGA MENU LAYOUT */
  .navbar .dropdown.mega.position-static { position: static; }
  .navbar .dropdown .dropdown-menu { margin-top: 0; }

  /* Make the dropdown span the viewport but constrain its inner content
     to the same width as the navbar/page .container, eliminating the
     "extra right margin" look. */
  .mega-menu {
    left: 0;
    right: 0;
    width: 100vw;
    border: 0;
    box-shadow: 0 6px 24px rgba(0,0,0,.12);
  }

  .mega-menu > .container {
    /* Match your site’s container cap; adjust if you use container-xxl, etc. */
    max-width: 1140px; /* use 1320px if your pages use .container-xxl */
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  /* Desktop hover assist (JS still handles ARIA/show) */
  @media (min-width: 992px) {
    .navbar .dropdown:hover > .dropdown-menu {
      display: block;
    }
  }

  /* Mobile: let the menu flow naturally */
  @media (max-width: 991.98px) {
    .mega-menu {
      position: static;
      width: 100%;
      box-shadow: none !important;
    }
    .mega-menu > .container {
      max-width: 100%;
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
</style>

