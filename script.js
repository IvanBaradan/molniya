// Переключение темы
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('.theme-toggle');
  const html = document.documentElement;

  // Загрузка сохранённой темы
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }
});

// Поиск
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.Topline_search__zZ0Eg input');
  const searchButton = document.querySelector('.Topline_search__zZ0Eg button');

  searchButton?.addEventListener('click', handleSearch);
  searchInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });
});

function handleSearch() {
  const query = searchInput?.value.trim();
  if (query) {
    // Здесь можно добавить реальную логику поиска
    console.log('Поиск:', query);
    // Пример: фильтрация новостей
    filterNews(query);
  }
}

function filterNews(query) {
  const articles = document.querySelectorAll('.MatterBig_wrapper__BhMuQ, .Matters_matterTitle__zgLsg');
  const lowerQuery = query.toLowerCase();
  
  articles.forEach(article => {
    const text = article.textContent.toLowerCase();
    const parent = article.closest('article') || article.parentElement;
    if (text.includes(lowerQuery)) {
      parent.style.display = '';
      parent.style.animation = 'fadeIn 0.3s ease';
    } else {
      parent.style.display = 'none';
    }
  });
}

// Мобильное меню
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navContainer = document.querySelector('.Topline_nav_container');

  // Создаём кнопку мобильного меню, если её нет
  if (!menuToggle && navContainer) {
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'menu-toggle';
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.setAttribute('aria-label', 'Открыть меню');
    const topLine = document.querySelector('.Topline_top__lg7_J');
    if (topLine) {
      topLine.insertBefore(mobileMenuBtn, topLine.firstChild);
      mobileMenuBtn.addEventListener('click', () => {
        navContainer.classList.toggle('mobile-open');
        mobileMenuBtn.textContent = navContainer.classList.contains('mobile-open') ? '✕' : '☰';
      });
    }
  }
});

// Кнопка "Наверх" и скрытие/показ хэдера при скролле
const scrollTopBtn = document.getElementById('scrollToTop');
const header = document.querySelector('.Topline_wrapper___SFz_');
let lastScrollY = window.scrollY;

if (scrollTopBtn) {
  console.log('Header script loaded');
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    console.log('Scroll event:', currentScrollY, lastScrollY);

    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    // Скрываем/показываем хэдер в зависимости от направления скролла
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // Скролл вниз - скрываем хэдер
      console.log('Hiding header');
      header.classList.add('header-hidden');
    } else if (currentScrollY < lastScrollY) {
      // Скролл вверх - показываем хэдер
      console.log('Showing header');
      header.classList.remove('header-hidden');
    }

    lastScrollY = currentScrollY;
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Кнопка "Показать ещё"
document.addEventListener('DOMContentLoaded', () => {
  const showMoreBtn = document.querySelector('.MattersBlock_more__GsimI');
  showMoreBtn?.addEventListener('click', () => {
    // Здесь можно добавить загрузку дополнительных новостей
    console.log('Загрузка дополнительных новостей...');
    showMoreBtn.textContent = 'Загрузка...';
    showMoreBtn.disabled = true;
    setTimeout(() => {
      showMoreBtn.textContent = 'Показать ещё';
      showMoreBtn.disabled = false;
    }, 1000);
  });
});

// Плавное появление элементов при скролле
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
      }
    });
  }, observerOptions);

  // Наблюдаем за карточками новостей после загрузки DOM
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.MatterBig_wrapper__BhMuQ, article').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  });
}

// Обновление даты
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
});
