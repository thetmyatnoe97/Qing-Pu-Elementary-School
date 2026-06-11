/* ============================================================
   Qing Pu Elementary School — English Website
   main.js  |  Shared JS: navbar, mobile menu, active links
   ============================================================ */

   document.addEventListener('DOMContentLoaded', () => {

    /* ── 1. Navbar scroll shadow ── */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // run once on load
    }
  
  
    /* ── 2. Mobile menu toggle ── */
    const toggle = document.querySelector('.navbar__toggle');
    const mobileMenu = document.querySelector('.navbar__mobile');
  
    if (toggle && mobileMenu) {
      toggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
  
      // Close mobile menu when a link is clicked
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('open');
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
  
      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
          mobileMenu.classList.remove('open');
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }
  
  
    /* ── 3. Mark active nav link based on current page ── */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
    // Desktop links
    document.querySelectorAll('.navbar__links a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  
    // Mobile links
    document.querySelectorAll('.navbar__mobile a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  
  
    /* ── 4. Smooth scroll for anchor links ── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--navbar-height')) || 64;
          const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  
  
    /* ── 5. Fade-in on scroll (subtle, respects reduced motion) ── */
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
    if (!prefersReduced) {
      const fadeEls = document.querySelectorAll('.fade-in');
  
      if (fadeEls.length > 0) {
        // Set initial hidden state via JS (not CSS) so it only applies when JS is on
        fadeEls.forEach(el => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(16px)';
          el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
  
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
  
        fadeEls.forEach(el => observer.observe(el));
      }
    }
  
  }); // end DOMContentLoaded