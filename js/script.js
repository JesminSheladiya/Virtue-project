// Smooth scroll for all internal anchor links — keeps URL clean (no #hash appended)
document.addEventListener("click", function(e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const targetId = href.slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = document.querySelector(".navbar")?.offsetHeight || 0;
    const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

    window.scrollTo({ top, behavior: "smooth" });
});

// logic for nav bar active class
document.addEventListener("DOMContentLoaded", function() {    
    const navLinks = document.querySelectorAll(".nav-links a");
    const sections = document.querySelectorAll("section[id]"); 

    const observerOptions = {
        root: null,
        threshold: 0.6, 
        rootMargin: "-10% 0px -30% 0px" 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});

// Mobile Menu Toggle Logic
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (!mobileToggle || !navLinksContainer) return;

    function toggleMenu() {
        const isOpen = navLinksContainer.classList.contains('active');
        if (isOpen) {
            mobileToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
        } else {
            mobileToggle.classList.add('active');
            navLinksContainer.classList.add('active');
        }
    }

    function closeMenu() {
        mobileToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
    }

    mobileToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMenu();
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInside = navLinksContainer.contains(e.target) || mobileToggle.contains(e.target);
        if (!isClickInside && navLinksContainer.classList.contains('active')) {
            closeMenu();
        }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
}

document.addEventListener('DOMContentLoaded', initMobileMenu);
if (document.readyState !== 'loading') initMobileMenu();


// Handle slider interactivity via event delegation (fixes DOM load timing issues)
const processSliderInteraction = (e) => {
    const container = e.target.closest('.slider-container');
    if (!container) return;

    const beforeImg = container.querySelector('.before-image');
    const handle = container.querySelector('.slider-handle');
    if (!beforeImg) return;

    const rect = container.getBoundingClientRect();

    let clientX = e.clientX;
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
    }

    if (clientX === undefined) return;

    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(x, rect.width));
    const percentage = (position / rect.width) * 100;

    beforeImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    if (handle) {
        handle.style.left = `${percentage}%`;
    }
};

document.addEventListener('mousemove', processSliderInteraction);
document.addEventListener('touchmove', processSliderInteraction, { passive: true });

const init = () => {
    // 1. FAQ auto-close logic
    const details = document.querySelectorAll('details.faq-item');
    details.forEach(targetDetail => {
        targetDetail.addEventListener('click', () => {
            details.forEach(detail => {
                if (detail !== targetDetail) {
                    detail.removeAttribute('open');
                }
            });
        });
    });

    // 2. Rolling Number Counter Logic
    const counters = document.querySelectorAll('.stat-counter');
    if (counters.length > 0) {
        const animateCounter = (counter) => {
            const target = parseFloat(counter.getAttribute('data-target'));
            if (target === 0) return;

            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000;
            let startTimestamp = null;

            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                
                const easeOut = 1 - Math.pow(1 - progress, 4);
                let current = target * easeOut;
                
                // Format with commas
                current = Math.floor(current).toLocaleString();

                counter.innerText = current + suffix;

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    counter.innerText = target.toLocaleString() + suffix;
                }
            };
            window.requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(counter => observer.observe(counter));
    }

};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}



// service button click to scroll dropdown
function toggleAndScroll() {
    const dropdown = document.getElementById('servicesDropdown');
    const toggleBtn = document.getElementById('viewAllServicesBtn');
    const grid = dropdown.querySelector('.services-dropdown-grid');
    
    if (!dropdown) return;

    const isOpening = dropdown.classList.contains('hidden');
    
    if (isOpening) {
        // Open the dropdown
        dropdown.classList.remove('hidden');
        if (toggleBtn) toggleBtn.innerText = 'Close All Services';
        
        if (grid) {
            grid.classList.add('highlight-grid');
            setTimeout(() => {
                grid.classList.remove('highlight-grid');
            }, 400);
        }

        // Scroll to the dropdown after it's visible
        setTimeout(() => {
            const elementPosition = dropdown.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - 200;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }, 100);
    } else {
        // Close the dropdown
        dropdown.classList.add('hidden');
        if (toggleBtn) toggleBtn.innerText = 'View All Services';
    }
}


// ── Treatments: load from JSON and render cards ──
(async function loadTreatments() {
  const grid = document.getElementById('treatmentsGrid');
  const btn  = document.getElementById('treatmentsToggleBtn');
  if (!grid) return;

  // Columns per breakpoint
  function getCols() {
    const w = window.innerWidth;
    if (w >= 1140) return 4;
    if (w >= 768) return 3;
    if (w >= 575)  return 2;
    return 2;
  }

  const COLS        = getCols();
  const ROWS_STEP   = 2;               // rows to show / load at a time
  const INITIAL     = COLS * ROWS_STEP; // first 2 rows visible

  // Track how many cards are currently visible
  let visibleCount = INITIAL;

  try {
    const response = await fetch('./js/treatments.json');
    if (!response.ok) throw new Error('Failed to load treatments');
    const treatments = await response.json();
    const total = treatments.length;

    // Render all cards, all hidden by default
    treatments.forEach((t) => {
      const card = document.createElement('div');
      card.className = 'treatment-card treatment-extra';
      card.innerHTML = `
        <div class="treatment-slider slider-container">
          <img src="${t.beforeImg}" alt="Before ${t.alt}" class="before-image" loading="lazy"
               onerror="this.style.background='#f5f5f5';this.style.height='220px'">
          <img src="${t.afterImg}" alt="After ${t.alt}" class="after-image" loading="lazy"
               onerror="this.style.background='#e8f5e9';this.style.height='220px'">
          <div class="slider-handle"></div>
          <div class="tag tag-before">BEFORE</div>
          <div class="tag tag-after">AFTER</div>
        </div>
        <div class="treatment-card-body">
          <h3>${t.title}</h3>
          <p>${t.desc}</p>
          <a href="${t.href}" class="treatment-link">
            Learn More
            <span class="material-symbols-outlined">trending_flat</span>
          </a>
        </div>`;
      grid.appendChild(card);
    });

    // Show the first batch
    updateVisible(total);

    function updateVisible(total) {
      const cards = grid.querySelectorAll('.treatment-card');
      cards.forEach((card, i) => {
        if (i < visibleCount) {
          card.classList.add('visible');
        } else {
          card.classList.remove('visible');
        }
      });
      updateButton(total);
    }

    function updateButton(total) {
      if (!btn) return;
      const allShown   = visibleCount >= total;
      const isInitial  = visibleCount <= INITIAL;

      if (allShown && isInitial) {
        // All cards fit in 2 rows — hide button
        btn.style.display = 'none';
        return;
      }

      btn.style.display = '';

      if (allShown) {
        // Everything visible → offer Show Less
        btn.classList.add('expanded');
        btn.innerHTML = '<span class="material-symbols-outlined icon-fill">expand_more</span> Show Less';
      } else {
        // More to load
        btn.classList.remove('expanded');
        const remaining = total - visibleCount;
        const nextRows  = Math.min(ROWS_STEP, Math.ceil(remaining / COLS));
        btn.innerHTML = `<span class="material-symbols-outlined icon-fill">expand_more</span> Load More (${nextRows * COLS > remaining ? remaining : nextRows * COLS} more)`;
      }
    }

    // Expose toggle function to global scope
    window.toggleTreatments = function () {
      const cards = grid.querySelectorAll('.treatment-card');
      const total = cards.length;
      const isExpanded = btn.classList.contains('expanded');

      if (isExpanded) {
        // Show Less → collapse to first 2 rows
        visibleCount = INITIAL;
        updateVisible(total);
        // Scroll back to section top
        const section = document.getElementById('treatments');
        if (section) {
          window.scrollTo({ top: section.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
        }
      } else {
        // Load More → reveal next 2 rows
        visibleCount = Math.min(visibleCount + COLS * ROWS_STEP, total);
        updateVisible(total);
      }
    };

  } catch (error) {
    console.error('Error loading treatments:', error);
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #d32f2f; padding: 2rem;">Failed to load treatments. Please ensure the page is served via HTTP (not file://).</p>';
  }
})();
