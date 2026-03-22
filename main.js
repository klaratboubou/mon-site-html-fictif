/* ============================================================
   NEXOVA — JavaScript global
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

/* ── REPERES DE COUPE (JS) ─────────────────────────────── */
const cropCursor = document.querySelector('.cursor-crop-marks');

if (cropCursor) {
  document.addEventListener('mousemove', e => {
    cropCursor.style.left = e.clientX + 'px';
    cropCursor.style.top  = e.clientY + 'px';
  });

  // Gestion du survol des éléments cliquables
  const links = document.querySelectorAll('a, button, .clickable');
  links.forEach(link => {
    link.addEventListener('mouseenter', () => cropCursor.classList.add('hover'));
    link.addEventListener('mouseleave', () => cropCursor.classList.remove('hover'));
  });

  // Gestion du clic
  document.addEventListener('mousedown', () => cropCursor.classList.add('active'));
  document.addEventListener('mouseup', () => cropCursor.classList.remove('active'));
}

  /* ── NAVIGATION STICKY ────────────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── INDICATEUR DE PAGE ACTIVE ────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage ||
       (currentPage === '' && href === 'index.html') ||
       (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── BURGER MENU ──────────────────────────────────────── */
  const burger     = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.nav__mobile');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      burger.setAttribute('aria-expanded', open);
    });

    // Fermer au clic sur un lien
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── ANIMATIONS AU SCROLL ─────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (revealEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback : tout révéler immédiatement
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  /* ── BACK TO TOP ──────────────────────────────────────── */
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── PANNEAU ACCESSIBILITÉ ────────────────────────────── */
  const a11yBtn   = document.querySelector('.a11y-btn');
  const a11yPanel = document.querySelector('.a11y-panel');

  if (a11yBtn && a11yPanel) {
    a11yBtn.addEventListener('click', () => {
      const open = a11yPanel.classList.toggle('open');
      a11yBtn.setAttribute('aria-expanded', open);
    });

    // Taille du texte
    let currentSize = 100;
    const htmlEl = document.documentElement;

    document.getElementById('font-increase')?.addEventListener('click', () => {
      currentSize = Math.min(currentSize + 10, 140);
      htmlEl.style.fontSize = currentSize + '%';
    });

    document.getElementById('font-decrease')?.addEventListener('click', () => {
      currentSize = Math.max(currentSize - 10, 80);
      htmlEl.style.fontSize = currentSize + '%';
    });

    document.getElementById('font-reset')?.addEventListener('click', () => {
      currentSize = 100;
      htmlEl.style.fontSize = '100%';
    });

    // Contraste élevé
    document.getElementById('high-contrast')?.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      const on = document.body.classList.contains('high-contrast');
      document.getElementById('high-contrast').textContent = on ? 'Désactiver' : 'Activer';
    });

    // Fermer panel au clic extérieur
    document.addEventListener('click', e => {
      if (!a11yBtn.contains(e.target) && !a11yPanel.contains(e.target)) {
        a11yPanel.classList.remove('open');
      }
    });
  }

  /* ── COMPTEUR CHIFFRES CLÉS ───────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start  = performance.now();

        function update(now) {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => countObserver.observe(el));
  }

  /* ── SMOOTH SCROLL ANCHRES INTERNES ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});