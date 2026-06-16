/**
 * Virtue Aesthetic Clinic - Site-wide Animations
 * Handles scroll-triggered entrance reveals and staggered animations.
 */
(function() {
    // 1. Configuration for Premium Feel
    const REVEAL_DISTANCE = '15px'; // Even lighter movement
    const REVEAL_DURATION = '1.4s'; // Even smoother transition
    const REVEAL_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'; // Very smooth ease-out

    // 2. Inject Animation Styles
    const injectStyles = () => {
        const style = document.createElement('style');
        style.id = 'virtue-animation-styles';
        style.innerHTML = `
            .reveal {
                opacity: 0;
                transform: translateY(${REVEAL_DISTANCE}) scale(0.99);
                transition: opacity ${REVEAL_DURATION} ${REVEAL_EASE}, 
                            transform ${REVEAL_DURATION} ${REVEAL_EASE};
                will-change: opacity, transform;
            }
            .reveal.active {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            .reveal-left {
                opacity: 0;
                transform: translateX(-${REVEAL_DISTANCE}) scale(0.99);
                transition: opacity ${REVEAL_DURATION} ${REVEAL_EASE}, 
                            transform ${REVEAL_DURATION} ${REVEAL_EASE};
                will-change: opacity, transform;
            }
            .reveal-left.active {
                opacity: 1;
                transform: translateX(0) scale(1);
            }
            .reveal-right {
                opacity: 0;
                transform: translateX(${REVEAL_DISTANCE}) scale(0.99);
                transition: opacity ${REVEAL_DURATION} ${REVEAL_EASE}, 
                            transform ${REVEAL_DURATION} ${REVEAL_EASE};
                will-change: opacity, transform;
            }
            .reveal-right.active {
                opacity: 1;
                transform: translateX(0) scale(1);
            }
            .stagger-item {
                transition-delay: calc(var(--stagger-index, 0) * 0.2s);
            }
            /* Pulse effect for key CTAs */
            .btn-glow {
                animation: btnGlow 3s infinite;
            }
            @keyframes btnGlow {
                0% { box-shadow: 0 0 0 0 rgba(0, 82, 74, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(0, 82, 74, 0); }
                100% { box-shadow: 0 0 0 0 rgba(0, 82, 74, 0); }
            }
        `;
        document.head.appendChild(style);
    };

    // 3. Intersection Observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05, // Trigger slightly earlier
        rootMargin: '0px 0px -20px 0px'
    });

    // 4. Initialization Logic
    const initAnimations = () => {
        injectStyles();

        // Broad Selectors to cover ALL parts of the page
        const selectors = [
            'section > *', // Everything directly inside a section
            '.hero-content > *',
            '.results-header > *',
            '.card',
            '.trust-card',
            '.test-card',
            '.faq-item',
            '.timeline-step',
            '.stat-item',
            '.footer-col > *',
            '.support-box',
            '.social-proof',
            '.hero-slider-wrap',
            '.gallery-grid img'
        ];

        // Apply base reveal classes first (opacity 0 state)
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                // Skip if already has a reveal class
                if (el.classList.contains('active') || el.classList.contains('reveal') || el.classList.contains('reveal-left') || el.classList.contains('reveal-right')) {
                    return;
                }

                // Determine direction based on class or position
                if (el.closest('.hero-slider-wrap') || el.tagName === 'IMG') {
                    el.classList.add('reveal-right');
                } else if (el.closest('.reveal-left-container')) {
                    el.classList.add('reveal-left');
                } else {
                    el.classList.add('reveal');
                }
            });
        });

        // Stagger Logic for Grid Containers and Hero
        const staggerContainers = [
            '.gallery-grid', 
            '.trust-grid', 
            '.testimonials-grid', 
            '.stats-grid', 
            '.timeline-container',
            '.faq-container',
            '.hero-content',
            '.hero-actions',
            '.footer-grid'
        ];

        staggerContainers.forEach(containerSelector => {
            const container = document.querySelector(containerSelector);
            if (container) {
                Array.from(container.children).forEach((child, index) => {
                    child.style.setProperty('--stagger-index', index);
                    child.classList.add('stagger-item');
                });
            }
        });

        // Start observing with a small delay to ensure the browser paints the initial state
        // and that elements already in viewport get their "active" class with a transition.
        setTimeout(() => {
            document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
                revealObserver.observe(el);
            });
        }, 200);

        // CTA Enhancement
        document.querySelectorAll('.btn-primary.btn-lg').forEach(btn => {
            btn.classList.add('btn-glow');
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimations);
    } else {
        initAnimations();
    }
})();
