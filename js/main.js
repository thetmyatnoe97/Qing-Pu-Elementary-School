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
  
    /* ── 6. Section nav scroll-spy (bilingual page) ── */
    const sectionNavLinks = document.querySelectorAll('.section-nav__link');
  
    if (sectionNavLinks.length > 0) {
      // Collect the target sections from each link's href
      const sections = [...sectionNavLinks].map(link => {
        const id = link.getAttribute('href').replace('#', '');
        return document.getElementById(id);
      }).filter(Boolean);
  
      const navbarH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 64;
      const sectionNavH = document.querySelector('.section-nav')?.offsetHeight || 48;
      const offset    = navbarH + sectionNavH + 24;
  
      const onSectionScroll = () => {
        // Find the last section whose top is above the offset line
        let current = sections[0];
        sections.forEach(section => {
          if (window.scrollY >= section.offsetTop - offset) {
            current = section;
          }
        });
  
        sectionNavLinks.forEach(link => {
          const matches = link.getAttribute('href') === `#${current?.id}`;
          link.classList.toggle('active', matches);
        });
      };
  
      window.addEventListener('scroll', onSectionScroll, { passive: true });
      onSectionScroll(); // run once on load
    }
  
  
    /* ── 7. News page — category filter ── */
    const filterBtns    = document.querySelectorAll('.filter-btn, .category-list__item');
    const newsArticles  = document.querySelectorAll('[data-category]'); // featured + cards
    const newsCountEl   = document.querySelector('.news-count__num');
    const emptyState    = document.querySelector('.news-empty');
  
    if (filterBtns.length && newsArticles.length) {
  
      const applyFilter = (filter) => {
        let visible = 0;
  
        newsArticles.forEach(article => {
          const cat     = article.dataset.category;
          const matches = filter === 'all' || cat === filter;
          article.hidden = !matches;
          if (matches) visible++;
        });
  
        // Update count
        if (newsCountEl) newsCountEl.textContent = visible;
  
        // Show/hide empty state
        if (emptyState) emptyState.hidden = visible > 0;
  
        // Sync active state across BOTH filter bars and sidebar list
        document.querySelectorAll('.filter-btn, .category-list__item').forEach(btn => {
          const isActive = btn.dataset.filter === filter;
          btn.classList.toggle('active', isActive);
          if (btn.getAttribute('role') === 'tab') {
            btn.setAttribute('aria-selected', isActive);
          }
        });
      };
  
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
      });
  
      // "View all" link inside empty state
      const resetLink = document.querySelector('.filter-reset-link');
      if (resetLink) {
        resetLink.addEventListener('click', (e) => {
          e.preventDefault();
          applyFilter('all');
        });
      }
    }
  
  
    /* ── 8. News page — live search ── */
    const searchInput = document.querySelector('#news-search');
  
    if (searchInput && newsArticles.length) {
  
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
  
        // Reset filter buttons to "all" when user types
        if (query.length > 0) {
          document.querySelectorAll('.filter-btn, .category-list__item').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('role') === 'tab') btn.setAttribute('aria-selected', 'false');
          });
        }
  
        let visible = 0;
  
        newsArticles.forEach(article => {
          if (query === '') {
            // Empty query → show everything
            article.hidden = false;
            visible++;
          } else {
            // Search in title + excerpt text
            const title   = article.querySelector('h2, h3')?.textContent.toLowerCase() || '';
            const excerpt = article.querySelector('p')?.textContent.toLowerCase() || '';
            const matches = title.includes(query) || excerpt.includes(query);
            article.hidden = !matches;
            if (matches) visible++;
          }
        });
  
        if (newsCountEl) newsCountEl.textContent = visible;
        if (emptyState)  emptyState.hidden = visible > 0;
  
        // If cleared, restore "all" active state
        if (query === '') {
          const allBtn = document.querySelector('[data-filter="all"]');
          if (allBtn) {
            allBtn.classList.add('active');
            if (allBtn.getAttribute('role') === 'tab') allBtn.setAttribute('aria-selected', 'true');
          }
        }
      });
    }
  
  
    /* ── 9. Contact form — client-side validation + AJAX submit ── */
    const contactForm = document.getElementById('contact-form');
  
    if (contactForm) {
  
      // ── Character counter for message textarea ──
      const textarea     = contactForm.querySelector('#message');
      const charCountEl  = contactForm.querySelector('.form-char-count__num');
      const charWrap     = contactForm.querySelector('.form-char-count');
      const MAX_CHARS    = 1000;
  
      if (textarea && charCountEl) {
        textarea.addEventListener('input', () => {
          const len = textarea.value.length;
          charCountEl.textContent = len;
          charWrap.classList.toggle('form-char-count--over', len > MAX_CHARS);
        });
      }
  
      // ── Field validator ──
      const showError = (field, msg) => {
        field.classList.add('invalid');
        const errEl = field.closest('.form-group')?.querySelector('.form-error');
        if (errEl) errEl.textContent = msg;
      };
  
      const clearError = (field) => {
        field.classList.remove('invalid');
        const errEl = field.closest('.form-group')?.querySelector('.form-error');
        if (errEl) errEl.textContent = '';
      };
  
      // Clear errors as user types
      contactForm.querySelectorAll('.form-input').forEach(field => {
        field.addEventListener('input', () => clearError(field));
      });
  
      // ── Full form validation ──
      const validateForm = () => {
        let valid = true;
  
        const firstName = contactForm.querySelector('#first-name');
        const lastName  = contactForm.querySelector('#last-name');
        const email     = contactForm.querySelector('#email');
        const subject   = contactForm.querySelector('#subject');
        const message   = contactForm.querySelector('#message');
  
        if (!firstName.value.trim()) {
          showError(firstName, 'Please enter your first name.');
          valid = false;
        }
  
        if (!lastName.value.trim()) {
          showError(lastName, 'Please enter your last name.');
          valid = false;
        }
  
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
          showError(email, 'Please enter your email address.');
          valid = false;
        } else if (!emailPattern.test(email.value.trim())) {
          showError(email, 'Please enter a valid email address (e.g. name@example.com).');
          valid = false;
        }
  
        if (!subject.value) {
          showError(subject, 'Please select a subject.');
          valid = false;
        }
  
        if (!message.value.trim()) {
          showError(message, 'Please write a message before sending.');
          valid = false;
        } else if (message.value.length > MAX_CHARS) {
          showError(message, `Message is too long — please keep it under ${MAX_CHARS} characters.`);
          valid = false;
        }
  
        return valid;
      };
  
      // ── Form submit handler ──
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        // Honeypot check
        const honeypot = contactForm.querySelector('#website');
        if (honeypot && honeypot.value) return; // silent drop — it's a bot
  
        if (!validateForm()) {
          // Scroll to first error
          const firstInvalid = contactForm.querySelector('.invalid');
          if (firstInvalid) {
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInvalid.focus();
          }
          return;
        }
  
        // ── Show loading state ──
        const submitBtn    = contactForm.querySelector('#submit-btn');
        const btnText      = submitBtn.querySelector('.form-submit-btn__text');
        const btnSpinner   = submitBtn.querySelector('.form-submit-btn__spinner');
        const successMsg   = contactForm.querySelector('.form-feedback--success');
        const errorMsg     = contactForm.querySelector('.form-feedback--error');
  
        submitBtn.disabled = true;
        btnText.textContent = 'Sending…';
        btnSpinner.hidden   = false;
        successMsg.hidden   = true;
        errorMsg.hidden     = true;
  
        try {
          const formData = new FormData(contactForm);
  
          const response = await fetch('contact.php', {
            method: 'POST',
            body: formData,
          });
  
          if (response.ok) {
            // ── Success ──
            contactForm.reset();
            if (charCountEl) charCountEl.textContent = '0';
            successMsg.hidden = false;
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } else {
            throw new Error(`Server returned ${response.status}`);
          }
  
        } catch (err) {
          // ── Error — show fallback message ──
          errorMsg.hidden = false;
          errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          console.error('Form submission error:', err);
        } finally {
          submitBtn.disabled  = false;
          btnText.textContent = 'Send message';
          btnSpinner.hidden   = true;
        }
      });
    }
  
  
    /* ── 10. FAQ accordion ── */
    const faqItems = document.querySelectorAll('.faq-item');
  
    if (faqItems.length) {
      faqItems.forEach(item => {
        const btn    = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
  
        if (!btn || !answer) return;
  
        btn.addEventListener('click', () => {
          const isOpen = btn.getAttribute('aria-expanded') === 'true';
  
          // Close all other items first (accordion behaviour)
          faqItems.forEach(other => {
            if (other !== item) {
              other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
              const otherAnswer = other.querySelector('.faq-answer');
              if (otherAnswer) otherAnswer.hidden = true;
            }
          });
  
          // Toggle this one
          btn.setAttribute('aria-expanded', !isOpen);
          answer.hidden = isOpen;
  
          // Smooth scroll so the answer doesn't jump off screen
          if (!isOpen) {
            setTimeout(() => {
              answer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 50);
          }
        });
      });
    }
  
  
    /* ── 11. Gallery — category filter ── */
    const galleryFilterBtns = document.querySelectorAll('.gallery-filter__btn');
    const galleryItems      = document.querySelectorAll('.gallery-item');
    const galleryCountEl    = document.querySelector('.gallery-count__num');
    const galleryEmpty      = document.querySelector('.gallery-empty');
    const galleryLoadMore   = document.getElementById('gallery-load-more');
  
    if (galleryFilterBtns.length && galleryItems.length) {
  
      const applyGalleryFilter = (filter) => {
        let visible = 0;
  
        galleryItems.forEach(item => {
          const matches = filter === 'all' || item.dataset.category === filter;
          item.hidden = !matches;
          if (matches) visible++;
        });
  
        if (galleryCountEl) galleryCountEl.textContent = visible;
        if (galleryEmpty)   galleryEmpty.hidden = visible > 0;
  
        // Hide "load more" when filtered — it only makes sense for "all"
        if (galleryLoadMore) galleryLoadMore.hidden = filter !== 'all';
  
        galleryFilterBtns.forEach(btn => {
          const isActive = btn.dataset.filter === filter;
          btn.classList.toggle('active', isActive);
          btn.setAttribute('aria-selected', isActive);
        });
      };
  
      galleryFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => applyGalleryFilter(btn.dataset.filter));
      });
  
      // Empty state reset button
      const galleryReset = document.querySelector('.gallery-empty__reset');
      if (galleryReset) {
        galleryReset.addEventListener('click', () => applyGalleryFilter('all'));
      }
    }
  
  
    /* ── 12. Gallery — lightbox ── */
    const lightbox         = document.getElementById('lightbox');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');
    const lightboxClose    = document.getElementById('lightbox-close');
    const lightboxPrev     = document.getElementById('lightbox-prev');
    const lightboxNext     = document.getElementById('lightbox-next');
    const lightboxImg      = document.getElementById('lightbox-img');
    const lightboxEmoji    = document.getElementById('lightbox-emoji');
    const lightboxPlaceholder = document.getElementById('lightbox-placeholder');
    const lightboxCaption  = document.getElementById('lightbox-caption');
    const lightboxCurrent  = document.getElementById('lightbox-current');
    const lightboxTotal    = document.getElementById('lightbox-total');
    const lightboxSpinner  = lightbox?.querySelector('.lightbox__spinner');
  
    if (lightbox && galleryItems.length) {
  
      let currentIndex = 0;
  
      // Build a navigable list of visible items at the time of opening
      const getVisible = () => [...galleryItems].filter(el => !el.hidden);
  
      // ── Open lightbox at a given item ──
      const openLightbox = (index, visibleItems) => {
        const item    = visibleItems[index];
        if (!item) return;
  
        currentIndex  = index;
        const total   = visibleItems.length;
        const src     = item.dataset.src   || '';
        const caption = item.dataset.caption || item.querySelector('.gallery-item__caption')?.textContent || '';
  
        // Get the emoji from the placeholder for the lightbox placeholder
        const emojiEl = item.querySelector('.gallery-placeholder span');
        const emoji   = emojiEl ? emojiEl.textContent : '📷';
  
        // Update counter
        if (lightboxCurrent) lightboxCurrent.textContent = index + 1;
        if (lightboxTotal)   lightboxTotal.textContent   = total;
  
        // Update caption
        if (lightboxCaption) lightboxCaption.textContent = caption;
  
        // Show/hide nav arrows
        if (lightboxPrev) lightboxPrev.hidden = index === 0;
        if (lightboxNext) lightboxNext.hidden = index === total - 1;
  
        // Show spinner, hide image
        if (lightboxSpinner) lightboxSpinner.hidden = false;
        if (lightboxImg)     { lightboxImg.hidden = true; lightboxImg.src = ''; }
        if (lightboxEmoji)   lightboxEmoji.textContent = emoji;
        if (lightboxPlaceholder) lightboxPlaceholder.hidden = false;
  
        // Load real image if src is provided
        if (src) {
          const tempImg = new Image();
          tempImg.onload = () => {
            if (lightboxImg) {
              lightboxImg.src = src;
              lightboxImg.alt = caption;
              lightboxImg.hidden = false;
            }
            if (lightboxSpinner)     lightboxSpinner.hidden = true;
            if (lightboxPlaceholder) lightboxPlaceholder.hidden = true;
          };
          tempImg.onerror = () => {
            // Image failed to load — keep placeholder visible
            if (lightboxSpinner) lightboxSpinner.hidden = true;
          };
          tempImg.src = src;
        } else {
          // No src — show placeholder only
          if (lightboxSpinner) lightboxSpinner.hidden = true;
        }
  
        // Show the lightbox
        lightbox.hidden = false;
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lightboxClose?.focus();
      };
  
      // ── Close lightbox ──
      const closeLightbox = () => {
        lightbox.hidden = true;
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
  
        // Return focus to the item that opened the lightbox
        const visibleItems = getVisible();
        visibleItems[currentIndex]?.focus();
      };
  
      // ── Navigate ──
      const navigate = (direction) => {
        const visibleItems = getVisible();
        const next = currentIndex + direction;
        if (next >= 0 && next < visibleItems.length) {
          openLightbox(next, visibleItems);
        }
      };
  
      // ── Attach click handlers to each gallery item ──
      galleryItems.forEach((item) => {
        const openHandler = () => {
          const visibleItems = getVisible();
          const index = visibleItems.indexOf(item);
          if (index !== -1) openLightbox(index, visibleItems);
        };
  
        item.addEventListener('click', openHandler);
  
        // Keyboard: Enter or Space opens the lightbox
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openHandler();
          }
        });
      });
  
      // ── Control buttons ──
      lightboxClose?.addEventListener('click', closeLightbox);
      lightboxBackdrop?.addEventListener('click', closeLightbox);
      lightboxPrev?.addEventListener('click', () => navigate(-1));
      lightboxNext?.addEventListener('click', () => navigate(1));
  
      // ── Keyboard navigation ──
      document.addEventListener('keydown', (e) => {
        if (lightbox.hidden) return;
        switch (e.key) {
          case 'Escape':    closeLightbox();   break;
          case 'ArrowLeft': navigate(-1);       break;
          case 'ArrowRight':navigate(1);        break;
        }
      });
  
      // ── Touch swipe support ──
      let touchStartX = 0;
  
      lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
  
      lightbox.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
      }, { passive: true });
    }
  
  
    /* ── 13. Gallery — "load more" button (stub) ──
       Wire this to your PHP backend when ready.
       For now it just hides itself after one click to show the pattern. */
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn && galleryLoadMore) {
      loadMoreBtn.addEventListener('click', () => {
        // TODO: fetch the next batch of photos from the server and
        // append them to #gallery-grid as new .gallery-item elements,
        // then re-attach the click/keydown handlers above.
        // For the portfolio version, we just disable the button:
        loadMoreBtn.textContent    = 'All photos loaded';
        loadMoreBtn.disabled       = true;
        loadMoreBtn.style.opacity  = '0.5';
        loadMoreBtn.style.cursor   = 'default';
      });
    }
  
  }); // end DOMContentLoaded