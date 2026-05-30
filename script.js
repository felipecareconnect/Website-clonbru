/* ============================================================
   CLONBRU — script.js
   Global JavaScript: mobile menu, scroll animations, smooth scroll, UI
   ============================================================ */

(function () {
  'use strict';

  /* ---- Helpers ---- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ============================================================
     1. NAVBAR — sticky + scroll state
     ============================================================ */
  const navbar = $('.navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run on load

  /* ---- Active nav link ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a, .mobile-menu a').forEach((link) => {
    const href = link.getAttribute('href');
    if (
      href === currentPage ||
      (currentPage === '' && href === 'index.html') ||
      (currentPage === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active');
    }
  });

  /* ============================================================
     2. MOBILE MENU
     ============================================================ */
  const hamburger = $('.hamburger');
  const mobileMenu = $('.mobile-menu');
  const mobileLinks = $$('.mobile-menu a');

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close on backdrop tap
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMenu();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ============================================================
     3. SMOOTH SCROLL (for anchor links on same page)
     ============================================================ */
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height buffer
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
     4. SCROLL ANIMATIONS (IntersectionObserver fade-up)
     ============================================================ */
  const fadeEls = $$('.fade-up');

  if ('IntersectionObserver' in window && fadeEls.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show all if IO not supported
    fadeEls.forEach((el) => el.classList.add('visible'));
  }

  /* ============================================================
     5. CONTACT FORM — submission + validation
     ============================================================ */
  const contactForm = $('#contactForm');
  const formSuccess = $('.form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const message = contactForm.querySelector('#message');
      let valid = true;

      // Simple validation
      [name, email, message].forEach((field) => {
        if (!field) return;
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#ff5a5a';
          valid = false;
        }
      });

      if (email && !/^\S+@\S+\.\S+$/.test(email.value)) {
        email.style.borderColor = '#ff5a5a';
        valid = false;
      }

      if (!valid) return;

      // Simulate send (replace with actual endpoint)
      const submitBtn = contactForm.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        contactForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.classList.add('show');
        }
      }, 1200);
    });
  }

  /* ============================================================
     6. HERO COUNT-UP ANIMATION
     ============================================================ */
  const countEls = $$('[data-count]');

  if (countEls.length > 0) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1600;
            const start = performance.now();

            function update(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
              const value = Math.floor(eased * target);
              el.textContent = value + suffix;
              if (progress < 1) requestAnimationFrame(update);
            }

            requestAnimationFrame(update);
            countObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    countEls.forEach((el) => countObserver.observe(el));
  }

  /* ============================================================
     7. CARD HOVER TILT (subtle)
     ============================================================ */
  $$('.service-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

})();
