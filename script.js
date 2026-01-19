// ================== ТЕМА ==================

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;

  // Функция установки размеров логотипа
  function setLogoSize(logo, isLight) {
    if (logo) {
      // Базовые размеры одинаковые для обеих тем, масштабирование через CSS transform
      logo.style.height = '50px';
      logo.style.width = '200px';
      logo.style.minHeight = '50px';
      logo.style.minWidth = '200px';
      logo.style.maxHeight = '50px';
      logo.style.maxWidth = '200px';
      logo.style.objectFit = 'contain';
      logo.style.objectPosition = 'left center';
      logo.style.flexShrink = '0';
      logo.style.display = 'block';
      logo.style.boxSizing = 'border-box';
      // Масштабирование для тёмной темы через transform
      if (!isLight) {
        logo.style.transform = 'scale(3)';
        logo.style.transformOrigin = 'left center';
      } else {
        logo.style.transform = 'scale(1)';
        logo.style.transformOrigin = 'left center';
      }
    }
  }

  // Функция обновления логотипа в зависимости от темы
  function updateLogo() {
    const logo = document.getElementById('siteLogo');
    const logoContainer = document.querySelector('.Topline_logo__jPjtC');
    const isLight = body.getAttribute('data-theme') === 'light';
    
    if (logo) {
      // Устанавливаем размеры перед сменой изображения
      setLogoSize(logo, isLight);
      logo.src = isLight ? 'logo.png' : 'alt_logo.png';
      
      // Устанавливаем размеры сразу после смены src
      setLogoSize(logo, isLight);
      
      // Обновляем размеры контейнера
      if (logoContainer) {
        logoContainer.style.height = '50px';
        logoContainer.style.width = '200px';
        logoContainer.style.minWidth = '200px';
        logoContainer.style.maxWidth = '200px';
        logoContainer.style.overflow = 'visible';
      }
      
      // И после загрузки изображения
      if (logo.complete) {
        setLogoSize(logo, isLight);
      } else {
        logo.onload = function() {
          setLogoSize(logo, isLight);
          logo.onload = null;
        };
      }
    }
  }

  // Загрузка сохранённой темы
  const savedTheme = localStorage.getItem('theme') || 'light';
  body.setAttribute('data-theme', savedTheme);
  updateLogo();

  // Переключение темы
  themeToggle?.addEventListener('click', () => {
    const isLight = body.getAttribute('data-theme') === 'light';
    const newTheme = isLight ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateLogo();
  });
});

// ================== ПОИСК ==================

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.Topline_search__zZ0Eg input');
  const searchButton = document.querySelector('.Topline_search__zZ0Eg button');

  function handleSearch() {
    const query = searchInput?.value.trim();
    if (query) {
      console.log('Поиск:', query);
      filterNews(query);
    }
  }

  function filterNews(query) {
    const articles = document.querySelectorAll('.MatterBig_wrapper__BhMuQ, .news-item, .top-news__item');
    const lowerQuery = query.toLowerCase();
    let foundResults = false;
    
    articles.forEach(article => {
      const text = article.textContent.toLowerCase();
      if (text.includes(lowerQuery)) {
        article.style.display = '';
        article.style.opacity = '0';
        article.style.animation = 'fadeIn 0.5s ease forwards';
        foundResults = true;
      } else {
        article.style.display = 'none';
      }
    });
    
    // Если результатов нет, показываем сообщение
    if (!foundResults) {
      const noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.innerHTML = `<p>По запросу "<strong>${query}</strong>" ничего не найдено.</p>`;
      noResults.style.textAlign = 'center';
      noResults.style.padding = '2rem';
      noResults.style.color = 'var(--text-muted)';
      
      const content = document.querySelector('.main-content');
      if (content && !document.querySelector('.no-results')) {
        content.prepend(noResults);
      }
    } else {
      // Удаляем сообщение "нет результатов", если оно есть
      const noResults = document.querySelector('.no-results');
      if (noResults) noResults.remove();
    }
  }

  searchButton?.addEventListener('click', handleSearch);
  searchInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });
});

// ================== МОБИЛЬНОЕ МЕНЮ ==================

document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.querySelector('.Topline_nav_container');
  const menuToggle = document.querySelector('.menu-toggle');
  const topLine = document.querySelector('.Topline_top__lg7_J');

  // Создаём кнопку мобильного меню, если её нет
  if (!menuToggle && navContainer && topLine) {
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'menu-toggle';
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.setAttribute('aria-label', 'Открыть меню');
    mobileMenuBtn.style.display = 'none';
    
    topLine.insertBefore(mobileMenuBtn, topLine.firstChild);

    mobileMenuBtn.addEventListener('click', () => {
      navContainer.classList.toggle('mobile-open');
      mobileMenuBtn.textContent = navContainer.classList.contains('mobile-open') ? '✕' : '☰';
    });

    // Показываем кнопку на мобильных устройствах
    function checkMobileMenu() {
      if (window.innerWidth <= 768) {
        mobileMenuBtn.style.display = 'block';
        navContainer.classList.remove('mobile-open');
        mobileMenuBtn.textContent = '☰';
      } else {
        mobileMenuBtn.style.display = 'none';
        navContainer.classList.add('mobile-open');
      }
    }

    checkMobileMenu();
    window.addEventListener('resize', checkMobileMenu);
  }
});

// ================== КНОПКА "НАВЕРХ" И ХЭДЕР ==================

document.addEventListener('DOMContentLoaded', () => {
  const scrollTopBtn = document.getElementById('scrollToTop');
  const header = document.querySelector('.Topline_wrapper___SFz_');
  let lastScrollY = window.scrollY;
  let ticking = false;

  if (scrollTopBtn && header) {
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      // Показать/скрыть кнопку "Наверх"
      if (currentScrollY > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }

      // Оптимизация производительности скрытия хэдера
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Скрываем/показываем хэдер в зависимости от направления скролла
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Скролл вниз - скрываем хэдер
            header.classList.add('header-hidden');
          } else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
            // Скролл вверх или в самом верху - показываем хэдер
            header.classList.remove('header-hidden');
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      header.classList.remove('header-hidden'); // Показываем хэдер при нажатии
    });
  }
});

// ================== КНОПКА "ПОКАЗАТЬ ЕЩЁ" ==================

document.addEventListener('DOMContentLoaded', () => {
  const showMoreBtn = document.querySelector('.MattersBlock_more__GsimI');
  
  showMoreBtn?.addEventListener('click', () => {
    // Имитация загрузки дополнительных новостей
    showMoreBtn.textContent = 'Загрузка...';
    showMoreBtn.disabled = true;
    
    setTimeout(() => {
      // Создаём новые карточки новостей
      const newNews = [
        {
          title: 'Новые культурные центры открылись в пригородах',
          category: 'Культура',
          rating: '8.2/10'
        },
        {
          title: 'Спортивные соревнования среди школьников набрали популярность',
          category: 'Спорт',
          rating: '8.5/10'
        },
        {
          title: 'Технологический форум собрал молодых инноваторов',
          category: 'Технологии',
          rating: '8.7/10'
        }
      ];

      const middleWrapper = document.querySelector('.MattersBlock_middleWrapper__vE8B2');
      if (middleWrapper) {
        newNews.forEach(news => {
          const article = document.createElement('article');
          article.className = 'MatterBig_wrapper__BhMuQ no-image fade-in';
          article.innerHTML = `
            <h3 class="MatterBig_title__lSQFy">${news.title}</h3>
            <div class="MatterBig_meta__DPsSp">
              <a href="#" class="RubricTag_category__2eBld">${news.category}</a>
              <span class="Rating_rating__tV72K">${news.rating}</span>
            </div>
          `;
          middleWrapper.querySelector('.slider-content').appendChild(article);
        });
      }

      showMoreBtn.textContent = 'Показать ещё';
      showMoreBtn.disabled = false;
      
      // Переинициализируем слайдер
      initSlider('popular');
    }, 1500);
  });
});

// ================== ПЛАВНОЕ ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ==================

document.addEventListener('DOMContentLoaded', () => {
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target); // Останавливаем наблюдение
        }
      });
    }, observerOptions);

    // Наблюдаем за карточками новостей
    document.querySelectorAll('.MatterBig_wrapper__BhMuQ, .news-item, .top-news__item').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });

    // Наблюдаем за другими анимируемыми элементами
    document.querySelectorAll('.fade-in, .slide-in-right').forEach(el => {
      el.style.opacity = '0';
      if (el.classList.contains('fade-in')) {
        el.style.transform = 'translateY(20px)';
      } else if (el.classList.contains('slide-in-right')) {
        el.style.transform = 'translateX(30px)';
      }
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }
});

// ================== ОБНОВЛЕНИЕ ДАТЫ ==================

document.addEventListener('DOMContentLoaded', () => {
  function updateDate() {
    const dateElement = document.querySelector('.Topline_date___tXOh');
    if (dateElement) {
      const now = new Date();
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      };
      const dateStr = now.toLocaleDateString('ru-RU', options);
      dateElement.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    }
  }
  
  updateDate();
  
  // Обновляем дату каждую минуту (на случай, если страница открыта долго)
  setInterval(updateDate, 60000);
});

// ================== ЛЕНТА НОВОСТЕЙ ==================

document.addEventListener('DOMContentLoaded', () => {
  const newsSidebar = document.querySelector('.news-sidebar');
  const toggleNewsBtn = document.getElementById('toggleNews');
  const moreNewsBtn = document.getElementById('moreNews');
  const revealNewsBtn = document.getElementById('revealNews');
  const newsTabAll = document.getElementById('newsTabAll');
  const newsTabRegion = document.getElementById('newsTabRegion');

  const newsBatchesAll = [
    [
      { time: '09:47', title: 'Музыканты из Грузии и Ирана выбрали Казань для зимнего тура' },
      { time: '09:39', title: 'В центре города открыли уличную фотовыставку о жизни казанцев' },
      { time: '09:25', title: 'Новый айти‑кластер в Татарстане создаст сотни рабочих мест' },
      { time: '09:12', title: 'На набережной Кабы завершают монтаж праздничной иллюминации' },
      { time: '08:58', title: 'Казанский университет запускает серию открытых лекций по дизайну медиа' },
      { time: '08:41', title: 'В аэропорту усилили работу волонтёров из‑за роста пассажиропотока' },
      { time: '08:29', title: 'Город добавил ночные автобусы к ключевым магистралям' },
      { time: '08:10', title: 'Музеи Казани готовят бесплатный вход для студентов в январе' },
      { time: '07:55', title: 'Спортивные школы открывают зимние наборы на фигурное катание' },
      { time: '07:37', title: 'Креативные индустрии: стартует конкурс микрогрантов для дизайнеров' },
    ],
    [
      { time: '10:05', title: 'IT-парк объявил набор на акселератор медиапроектов' },
      { time: '09:58', title: 'В Казани протестировали умные остановки с подогревом' },
      { time: '09:42', title: 'Волонтёры запускают горячую линию помощи пожилым на выходных' },
      { time: '09:21', title: 'Запустили рейс Казань — Баку дополнительно на праздничные дни' },
      { time: '09:07', title: 'Открылась интерактивная экспозиция о казанских архитекторах' },
      { time: '08:54', title: 'Лыжные трассы в окрестностях города готовят к ночным заездам' },
      { time: '08:36', title: 'Стартовал городской конкурс проектов по раздельному сбору' },
      { time: '08:18', title: 'Молодёжные центры проведут серию мастер-классов по анимации' },
      { time: '08:02', title: 'Метрополитен продлил работу на один час в выходные' },
      { time: '07:50', title: 'Запустили пилот по eSIM в муниципальных сервисах' },
    ]
  ];

  const newsBatchesRegion = [
    [
      { time: '09:47', title: 'Казань: Музыканты из Грузии и Ирана выбрали город для зимнего тура' },
      { time: '09:39', title: 'В центре Казани открыли уличную фотовыставку о жизни казанцев' },
      { time: '09:25', title: 'Новый айти‑кластер в Татарстане создаст сотни рабочих мест' },
      { time: '09:12', title: 'На набережной Кабы завершают монтаж праздничной иллюминации' },
      { time: '08:58', title: 'Казанский университет запускает серию открытых лекций по дизайну медиа' },
      { time: '08:41', title: 'В аэропорту Казани усилили работу волонтёров из‑за роста пассажиропотока' },
      { time: '08:29', title: 'Казань добавила ночные автобусы к ключевым магистралям' },
      { time: '08:10', title: 'Музеи Казани готовят бесплатный вход для студентов в январе' },
      { time: '07:55', title: 'Спортивные школы Казани открывают зимние наборы на фигурное катание' },
      { time: '07:37', title: 'Креативные индустрии Казани: стартует конкурс микрогрантов для дизайнеров' },
    ]
  ];

  let currentBatch = 0;
  let currentNewsType = 'all';

  function renderNews(batchIndex, newsType = 'all') {
    const newsFeed = document.getElementById('newsFeed');
    if (!newsFeed) return;
    
    const batches = newsType === 'all' ? newsBatchesAll : newsBatchesRegion;
    const batch = batches[batchIndex];
    if (!batch) return;
    
    const moreBtn = newsFeed.querySelector('.news-feed__more');
    newsFeed.innerHTML = batch
      .map(
        (item) => `
          <article class="news-item">
            <time class="news-item__time">${item.time}</time>
            <h3 class="news-item__title">${item.title}</h3>
          </article>
        `
      )
      .join('');
    
    if (moreBtn) {
      newsFeed.appendChild(moreBtn);
    }
    
    // Добавляем обработчики для новых новостей
    attachNewsFeedHandlers();
  }

  // Управление лентой новостей
  toggleNewsBtn?.addEventListener('click', () => {
    const hidden = newsSidebar.classList.toggle('news-sidebar--hidden');
    toggleNewsBtn.textContent = hidden ? 'Показать' : 'Скрыть';
    
    const mainContentWrapper = document.querySelector('.main-content-wrapper');
    if (hidden) {
      revealNewsBtn?.classList.add('visible');
      mainContentWrapper?.classList.add('news-sidebar-hidden');
    } else {
      revealNewsBtn?.classList.remove('visible');
      mainContentWrapper?.classList.remove('news-sidebar-hidden');
    }
  });

  revealNewsBtn?.addEventListener('click', () => {
    newsSidebar.classList.remove('news-sidebar--hidden');
    toggleNewsBtn.textContent = 'Скрыть';
    revealNewsBtn.classList.remove('visible');
    
    const mainContentWrapper = document.querySelector('.main-content-wrapper');
    mainContentWrapper?.classList.remove('news-sidebar-hidden');
  });

  // Переключение между "Все новости" и "Регион"
  newsTabAll?.addEventListener('click', () => {
    newsTabAll.classList.add('active');
    newsTabRegion?.classList.remove('active');
    currentNewsType = 'all';
    currentBatch = 0;
    renderNews(currentBatch, 'all');
  });

  newsTabRegion?.addEventListener('click', () => {
    newsTabRegion.classList.add('active');
    newsTabAll?.classList.remove('active');
    currentNewsType = 'region';
    currentBatch = 0;
    renderNews(currentBatch, 'region');
  });

  moreNewsBtn?.addEventListener('click', () => {
    const batches = currentNewsType === 'all' ? newsBatchesAll : newsBatchesRegion;
    currentBatch = (currentBatch + 1) % batches.length;
    renderNews(currentBatch, currentNewsType);
  });

  // Инициализация
  renderNews(0, 'all');
});

// ================== СМЕНЯЮЩИЕСЯ ВИДЕО ==================

document.addEventListener('DOMContentLoaded', () => {
  const rotatingVideos = document.querySelectorAll('.rotating-headlines__video');
  const videoPrevBtn = document.getElementById('videoPrev');
  const videoNextBtn = document.getElementById('videoNext');
  let currentVideoIndex = 0;
  let videoInterval;

  function showVideo(index) {
    if (rotatingVideos.length === 0) return;
    
    rotatingVideos.forEach(video => {
      video.classList.remove('active');
      video.pause();
      video.currentTime = 0;
    });
    
    currentVideoIndex = index;
    const selectedVideo = rotatingVideos[currentVideoIndex];
    selectedVideo.classList.add('active');
    
    selectedVideo.play().catch(e => {
      console.log('Автовоспроизведение заблокировано, ожидание взаимодействия пользователя');
    });
  }

  function nextVideo() {
    const nextIndex = (currentVideoIndex + 1) % rotatingVideos.length;
    showVideo(nextIndex);
  }

  function prevVideo() {
    const prevIndex = (currentVideoIndex - 1 + rotatingVideos.length) % rotatingVideos.length;
    showVideo(prevIndex);
  }

  function startVideoRotation() {
    stopVideoRotation();
    videoInterval = setInterval(nextVideo, 10000); // Смена каждые 10 секунд
  }

  function stopVideoRotation() {
    if (videoInterval) {
      clearInterval(videoInterval);
    }
  }

  // Инициализация видео
  if (rotatingVideos.length > 0) {
    showVideo(0);
    startVideoRotation();
    
    // Обработчики для стрелок
    videoNextBtn?.addEventListener('click', () => {
      nextVideo();
      startVideoRotation(); // Перезапускаем интервал после ручного переключения
    });
    
    videoPrevBtn?.addEventListener('click', () => {
      prevVideo();
      startVideoRotation(); // Перезапускаем интервал после ручного переключения
    });
    
    // Приостанавливаем автопрокрутку при наведении
    const videoContainer = document.querySelector('.rotating-headlines__container');
    videoContainer?.addEventListener('mouseenter', stopVideoRotation);
    videoContainer?.addEventListener('mouseleave', startVideoRotation);
    
    // Пауза при уходе со страницы
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopVideoRotation();
      } else {
        startVideoRotation();
      }
    });
  }
});

// ================== СЛАЙДЕРЫ ==================

function initSlider(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) {
    console.warn(`Section ${sectionId} not found`);
    return;
  }

  const container = section.nextElementSibling;
  if (!container || !container.classList.contains('slider-container')) {
    console.warn(`Slider container not found for ${sectionId}`);
    return;
  }

  const content = container.querySelector('.slider-content');
  const prevBtn = container.querySelector('.slider-arrow--prev');
  const nextBtn = container.querySelector('.slider-arrow--next');

  if (!content || !prevBtn || !nextBtn) {
    console.warn(`Slider elements not found for ${sectionId}`);
    return;
  }

  let currentIndex = 0;
  const articles = content.querySelectorAll('article');
  const articlesPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 3 : 5;
  const totalSlides = Math.ceil(articles.length / articlesPerView);

  function updateSlider() {
    const articleWidth = 280;
    const gap = 20;
    const slideWidth = articleWidth * articlesPerView + gap * (articlesPerView - 1);
    const translateX = -currentIndex * slideWidth;
    
    content.style.transform = `translateX(${translateX}px)`;
    content.style.transition = 'transform 0.3s ease';

    // Обновляем состояние кнопок
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalSlides - 1;
  }

  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
      updateSlider();
    }
  });

  // Адаптация при изменении размера окна
  function handleResize() {
    const newArticlesPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 3 : 5;
    if (newArticlesPerView !== articlesPerView) {
      currentIndex = 0;
      updateSlider();
    }
  }

  window.addEventListener('resize', handleResize);

  // Инициализация
  updateSlider();
}

// Инициализация всех слайдеров при загрузке
document.addEventListener('DOMContentLoaded', () => {
  const sections = ['popular', 'exclusive', 'society', 'economy'];
  sections.forEach(section => initSlider(section));
});

// ================== ТОП НОВОСТИ ==================

document.addEventListener('DOMContentLoaded', () => {
  const newsTabs = document.querySelectorAll('.top-news__tab');
  const newsLists = document.querySelectorAll('.top-news__list[data-region]');
  
  newsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const region = tab.getAttribute('data-region');
      
      // Убираем активный класс со всех вкладок
      newsTabs.forEach(t => t.classList.remove('active'));
      // Добавляем активный класс к выбранной вкладке
      tab.classList.add('active');
      
      // Скрываем все списки
      newsLists.forEach(list => {
        list.classList.remove('active');
      });
      
      // Показываем выбранный список
      const selectedList = document.querySelector(`.top-news__list[data-region="${region}"]`);
      if (selectedList) {
        selectedList.classList.add('active');
      }
    });
  });
});

// ================== ПЕРЕКЛЮЧЕНИЕ ГОРОДА ==================

document.addEventListener('DOMContentLoaded', () => {
  const citySelect = document.getElementById('citySelect');
  
  citySelect?.addEventListener('change', function() {
    const selectedCity = this.value;
    console.log('Выбран город:', selectedCity);
    
    // Здесь можно добавить логику обновления контента в зависимости от города
    // Например, загрузка новостей для выбранного города
    
    // Показываем уведомление о смене города
    showNotification(`Город изменён на ${this.options[this.selectedIndex].text}`);
  });
});

// ================== УВЕДОМЛЕНИЯ ==================

function showNotification(message, type = 'info') {
  // Проверяем, есть ли уже контейнер для уведомлений
  let notificationContainer = document.querySelector('.notification-container');
  
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    notificationContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(notificationContainer);
  }
  
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <div class="notification__content">
      <p>${message}</p>
      <button class="notification__close">&times;</button>
    </div>
  `;
  
  // Стили для уведомления
  notification.style.cssText = `
    background: var(--secondary);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    opacity: 0;
    transform: translateX(100%);
    transition: opacity 0.3s ease, transform 0.3s ease;
  `;
  
  notificationContainer.appendChild(notification);
  
  // Анимация появления
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Закрытие по кнопке
  const closeBtn = notification.querySelector('.notification__close');
  closeBtn.addEventListener('click', () => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  });
  
  // Автоматическое закрытие через 5 секунд
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// ================== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ==================

document.addEventListener('DOMContentLoaded', () => {
  // Обновляем дату
  updateDate();
  
  // Инициализируем мобильное меню
  initMobileMenu();
  
  // Запускаем все слайдеры
  ['popular', 'exclusive', 'society', 'economy'].forEach(section => {
    initSlider(section);
  });
  
  console.log('Молния Инфо - все системы запущены!');
});

// ================== ДОПОЛНИТЕЛЬНЫЕ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==================

// Функция для форматирования чисел (для рейтингов, курсов валют и т.д.)
function formatNumber(num, decimals = 2) {
  return parseFloat(num).toFixed(decimals);
}

// Функция для обрезки длинного текста
function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Функция для форматирования времени
function formatTime(date) {
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

// Функция для проверки поддержки webp
function supportsWebP() {
  const elem = document.createElement('canvas');
  if (!!(elem.getContext && elem.getContext('2d'))) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
  }
  return false;
}

// Применение webp, если поддерживается
if (supportsWebP()) {
  document.body.classList.add('webp');
} else {
  document.body.classList.add('no-webp');
}
// ================== БЛОК "ЧЕМ ЭТО ПОЛЕЗНО?" ==================

const usefulnessToggle = document.getElementById('usefulnessToggle');
const usefulnessInfo = document.getElementById('usefulnessInfo');
let usefulnessOpen = false;

usefulnessToggle.addEventListener('click', () => {
  usefulnessOpen = !usefulnessOpen;
  
  if (usefulnessOpen) {
    usefulnessToggle.classList.add('active');
    usefulnessInfo.classList.add('active');
    
    // Плавная прокрутка к открытому блоку
    setTimeout(() => {
      usefulnessInfo.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    }, 300);
  } else {
    usefulnessToggle.classList.remove('active');
    usefulnessInfo.classList.remove('active');
  }
});

// Закрытие при клике вне блока
document.addEventListener('click', (e) => {
  if (usefulnessOpen && 
      !usefulnessToggle.contains(e.target) && 
      !usefulnessInfo.contains(e.target)) {
    usefulnessOpen = false;
    usefulnessToggle.classList.remove('active');
    usefulnessInfo.classList.remove('active');
  }
});

// Анимация появления элементов при открытии
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -20px 0px'
};

const usefulnessObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && usefulnessOpen) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Наблюдаем за элементами внутри блока
document.querySelectorAll('.usefulness-item').forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(20px)';
  item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  usefulnessObserver.observe(item);
});

// Анимация появления элементов при открытии блока
function animateUsefulnessItems() {
  if (usefulnessOpen) {
    const items = document.querySelectorAll('.usefulness-item');
    items.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
}

// Обновляем анимацию при открытии
usefulnessToggle.addEventListener('click', () => {
  if (usefulnessOpen) {
    setTimeout(animateUsefulnessItems, 300);
  } else {
    // Сбрасываем анимацию при закрытии
    document.querySelectorAll('.usefulness-item').forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
    });
  }
});