/* ============================================================
   NEXOVA — interactions.js
   Améliorations dynamiques & conversion
   ============================================================ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     1. SPLASH SCREEN — Intro cinématique à l'ouverture
  ══════════════════════════════════════════════════════════ */
  function initSplash() {
    // Seulement sur index.html
    if (!document.body.classList.contains('page-index')) return;
    // Ne pas rejouer si déjà vu dans cette session
    if (sessionStorage.getItem('nexova_splash_seen')) return;

    const splash = document.createElement('div');
    splash.id = 'nexova-splash';
    splash.innerHTML = `
      <div class="splash__inner">
        <div class="splash__lines" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <div class="splash__logo">
          <img src="Photo/Logo_La Déclinaison Secondaire.png" alt="NEXOVA" class="splash__img">
        </div>
        <p class="splash__tagline">Agence de communication · Depuis 1970</p>
        <div class="splash__bar"><div class="splash__progress"></div></div>
      </div>
    `;
    document.body.appendChild(splash);
    document.body.style.overflow = 'hidden';

    // Animation de la barre de chargement puis sortie
    const progress = splash.querySelector('.splash__progress');
    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.random() * 18 + 4;
      if (pct >= 100) {
        pct = 100;
        clearInterval(interval);
        setTimeout(() => {
          splash.classList.add('splash--exit');
          setTimeout(() => {
            splash.remove();
            document.body.style.overflow = '';
            sessionStorage.setItem('nexova_splash_seen', '1');
          }, 700);
        }, 280);
      }
      progress.style.width = Math.min(pct, 100) + '%';
    }, 80);
  }

  /* ══════════════════════════════════════════════════════════
     2. BARRE DE PROGRESSION DE LECTURE
  ══════════════════════════════════════════════════════════ */
  function initReadingBar() {
    const bar = document.createElement('div');
    bar.id = 'reading-bar';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════════
     3. HOVER 3D SUR LES CARTES
  ══════════════════════════════════════════════════════════ */
  function initCard3D() {
    const cards = document.querySelectorAll('.expertise-card, .realisation-card:not(.ba-slider), .team-card, .info-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotY = ((x - cx) / cx) * 6;
        const rotX = -((y - cy) / cy) * 6;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
        card.style.transition = 'transform 0.1s ease';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.4s cubic-bezier(.4,0,.2,1)';
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     4. POPUP DE SORTIE INTELLIGENT
  ══════════════════════════════════════════════════════════ */
  function initExitPopup() {
    if (sessionStorage.getItem('nexova_exit_shown')) return;

    const popup = document.createElement('div');
    popup.id = 'exit-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-label', 'Avant de partir');
    popup.innerHTML = `
      <div class="exit-popup__card">
        <button class="exit-popup__close" aria-label="Fermer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div class="exit-popup__icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <p class="exit-popup__eyebrow">Avant de partir…</p>
        <h3 class="exit-popup__title">Votre projet mérite<br>un devis gratuit</h3>
        <p class="exit-popup__text">Notre équipe vous répond sous 24h. Laissez-nous simplement votre email.</p>
        <div class="exit-popup__form">
          <input type="email" id="exit-email" class="exit-popup__input" placeholder="votre@email.fr" autocomplete="email" aria-label="Votre adresse email">
          <button class="exit-popup__btn" id="exit-submit">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Être recontacté
          </button>
        </div>
        <p class="exit-popup__footer">Ou appelez-nous : <a href="tel:+33142001122">01 42 00 11 22</a></p>
        <div class="exit-popup__success" id="exit-success" hidden>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <p>Merci ! On vous recontacte très vite.</p>
        </div>
      </div>
      <div class="exit-popup__backdrop"></div>
    `;
    document.body.appendChild(popup);

    function showPopup() {
      popup.classList.add('exit-popup--visible');
      sessionStorage.setItem('nexova_exit_shown', '1');
    }

    function hidePopup() {
      popup.classList.remove('exit-popup--visible');
    }

    // Détection sortie par le haut
    let triggered = false;
    document.addEventListener('mouseleave', e => {
      if (e.clientY <= 5 && !triggered) {
        triggered = true;
        showPopup();
      }
    });

    // Fermeture
    popup.querySelector('.exit-popup__close').addEventListener('click', hidePopup);
    popup.querySelector('.exit-popup__backdrop').addEventListener('click', hidePopup);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') hidePopup(); });

    // Soumission
    popup.querySelector('#exit-submit').addEventListener('click', () => {
      const email = popup.querySelector('#exit-email').value;
      if (!email || !email.includes('@')) {
        popup.querySelector('#exit-email').focus();
        popup.querySelector('#exit-email').style.borderColor = '#e53e3e';
        return;
      }
      popup.querySelector('.exit-popup__form').hidden = true;
      popup.querySelector('#exit-success').hidden = false;
      setTimeout(hidePopup, 2800);
    });
  }

  /* ══════════════════════════════════════════════════════════
     5. MICRO-CTA FLOTTANT (sticky contact rapide)
  ══════════════════════════════════════════════════════════ */
  function initFloatingCTA() {
    const cta = document.createElement('div');
    cta.id = 'floating-cta';
    cta.setAttribute('aria-label', 'Contact rapide');
    cta.innerHTML = `
      <a href="tel:+33142001122" class="floating-cta__btn floating-cta__phone" aria-label="Appeler NEXOVA">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.43 2 2 0 0 1 3.55 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.76a16 16 0 0 0 6 6l1.58-1.36a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.01z"/></svg>
        <span>Appeler</span>
      </a>
      <a href="mailto:contact@nexova-agence de communication.fr" class="floating-cta__btn floating-cta__mail" aria-label="Envoyer un email">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        <span>Email</span>
      </a>
      <a href="contact.html" class="floating-cta__btn floating-cta__devis" aria-label="Demander un devis">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <span>Devis</span>
      </a>
    `;
    document.body.appendChild(cta);

    // Apparaît après avoir scrollé 400px
    window.addEventListener('scroll', () => {
      cta.classList.toggle('floating-cta--visible', window.scrollY > 400);
    }, { passive: true });
  }


  /* ══════════════════════════════════════════════════════════
     7. SCROLL CINÉMATIQUE AMÉLIORÉ — stagger + parallax léger
  ══════════════════════════════════════════════════════════ */
  function initScrollCinematic() {
    // Stagger automatique pour les enfants de grilles
    document.querySelectorAll('.expertises-grid, .realisations-grid, .team-grid, .stats-grid').forEach(grid => {
      Array.from(grid.children).forEach((child, i) => {
        child.style.transitionDelay = `${i * 80}ms`;
      });
    });

    // Parallax léger sur le hero__bg
    const heroBg = document.querySelector('.hero__bg');
    if (heroBg) {
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        heroBg.style.transform = `translateY(${y * 0.25}px)`;
      }, { passive: true });
    }
  }

  /* ══════════════════════════════════════════════════════════
     8. FORMULAIRE CONTACT — champ "Être recontacté" rapide
        (injecté dans contact.html avant le formulaire long)
  ══════════════════════════════════════════════════════════ */
  function initQuickContact() {
    const formCard = document.querySelector('.form-card');
    if (!formCard) return;

    const quickBlock = document.createElement('div');
    quickBlock.className = 'quick-contact reveal';
    quickBlock.innerHTML = `
      <div class="quick-contact__inner">
        <div class="quick-contact__icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.43 2 2 0 0 1 3.55 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.76a16 16 0 0 0 6 6l1.58-1.36a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.01z"/></svg>
        </div>
        <div class="quick-contact__text">
          <p class="quick-contact__label">Pas le temps de remplir le formulaire ?</p>
          <p class="quick-contact__sub">Laissez votre email, on vous rappelle dans la journée.</p>
        </div>
        <div class="quick-contact__action">
          <input type="email" id="quick-email" class="quick-contact__input" placeholder="votre@email.fr" autocomplete="email" aria-label="Votre email pour être recontacté">
          <button class="quick-contact__send" id="quick-send">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            <span>Être rappelé</span>
          </button>
        </div>
        <div class="quick-contact__success" id="quick-success" hidden>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <p>Parfait ! On vous recontacte très vite.</p>
        </div>
      </div>
    `;
    formCard.parentElement.insertBefore(quickBlock, formCard);

    document.getElementById('quick-send')?.addEventListener('click', () => {
      const input = document.getElementById('quick-email');
      if (!input.value || !input.value.includes('@')) {
        input.style.borderColor = '#e53e3e';
        input.focus();
        return;
      }
      quickBlock.querySelector('.quick-contact__action').hidden = true;
      quickBlock.querySelector('#quick-success').hidden = false;
    });
  }

  /* ══════════════════════════════════════════════════════════
     9. MINI-CTA DANS CHAQUE SECTION (témoignage + urgence)
  ══════════════════════════════════════════════════════════ */
  function initSectionCTAs() {
    // Badge "Réponse sous 24h" discret dans la section about
    const aboutText = document.querySelector('.about-section__text');
    if (aboutText) {
      const badge = document.createElement('div');
      badge.className = 'urgency-badge reveal';
      badge.innerHTML = `
        <span class="urgency-badge__dot" aria-hidden="true"></span>
        <span>Devis gratuit · Réponse sous 24h</span>
      `;
      const btnWrap = aboutText.querySelector('.flex-center');
      if (btnWrap) btnWrap.parentElement.insertBefore(badge, btnWrap);
    }

    // Mini-CTA discret dans la section expertises
    const expertText = document.querySelector('#expertises-title')?.closest('section');
    if (expertText) {
      const miniCta = document.createElement('div');
      miniCta.className = 'section-mini-cta reveal';
      miniCta.innerHTML = `
        <p>Un projet en tête ? <a href="contact.html" class="section-mini-cta__link">Parlez-en à notre équipe →</a></p>
      `;
      const grid = expertText.querySelector('.expertises-grid');
      if (grid) grid.after(miniCta);
    }
  }

  /* ══════════════════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    initSplash();
    initReadingBar();
    initCard3D();
    initExitPopup();
    initFloatingCTA();
    initSocialProof();
    initScrollCinematic();
    initQuickContact();
    initSectionCTAs();
  });

})();
