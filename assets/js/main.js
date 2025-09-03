// Initialize ScrollReveal
document.addEventListener('DOMContentLoaded', function() {
    // ScrollReveal configuration
    const sr = ScrollReveal({
        origin: 'bottom',
        distance: '60px',
        duration: 800,
        delay: 100,
        easing: 'ease-out',
        reset: false,
        mobile: true
    });

    // Hero section animations
    sr.reveal('.hero-content', {
        origin: 'left',
        distance: '100px',
        duration: 1000
    });

    sr.reveal('.hero-image', {
        origin: 'right',
        distance: '100px',
        duration: 1000,
        delay: 200
    });

    // Section headers
    sr.reveal('.section-header', {
        origin: 'top',
        distance: '50px',
        duration: 600
    });

    // Project cards with staggered animation
    sr.reveal('.project-card', {
        interval: 200,
        scale: 0.9
    });

    // Timeline items
    sr.reveal('.timeline-item', {
        origin: 'left',
        distance: '80px',
        interval: 150
    });

    // Stats and achievements
    sr.reveal('.stat-item', {
        origin: 'bottom',
        distance: '40px',
        interval: 100,
        scale: 0.95
    });

    // Contact form
    sr.reveal('.contact-form', {
        origin: 'bottom',
        distance: '60px',
        duration: 800
    });

    // Mobile menu functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // If it's a link to a section on the homepage
            if (href.startsWith('/#')) {
                const targetId = href.substring(2); // Remove '/#'
                
                // If we're not on the homepage, navigate there first
                if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
                    window.location.href = href;
                    return;
                }
                
                // If we're on the homepage, smooth scroll to the section
                e.preventDefault();
                const target = document.getElementById(targetId);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            } else if (href.startsWith('#')) {
                // Handle regular anchor links on the same page
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }

            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.getElementById('header');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);

    // Intersection Observer for counting animations
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const finalNumber = parseInt(counter.dataset.count);
                animateCounter(counter, finalNumber);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    // Observe all counter elements
    document.querySelectorAll('[data-count]').forEach(counter => {
        observer.observe(counter);
    });

    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(progress * target);
            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Project filter functionality (if needed)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const blogPosts = document.querySelectorAll('.blog-post');
    const tagFilters = document.querySelectorAll('.tag-filter');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-neutral-800', 'text-white');
                btn.classList.add('bg-white', 'text-neutral-600', 'border', 'border-neutral-300');
            });
            
            this.classList.add('active');
            this.classList.remove('bg-white', 'text-neutral-600', 'border', 'border-neutral-300');
            this.classList.add('bg-neutral-800', 'text-white');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    sr.reveal(card, {reset: true});
                } else {
                    card.style.display = 'none';
                }
            });

            // Filter blog posts
            blogPosts.forEach(post => {
                let show = false;
                
                if (filter === 'all') {
                    show = true;
                } else {
                    const categories = post.dataset.categories;
                    if (categories && categories.includes(filter)) {
                        show = true;
                    }
                }
                
                if (show) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });

    // Tag filter functionality
    tagFilters.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tag = this.dataset.tag;
            
            // If we're on the tags page, show the relevant section
            if (window.location.pathname.includes('/tags/')) {
                const tagSections = document.querySelectorAll('[data-tag-section]');
                tagSections.forEach(section => {
                    if (section.dataset.tagSection === tag) {
                        section.scrollIntoView({ behavior: 'smooth' });
                        section.classList.add('highlight-section');
                        setTimeout(() => {
                            section.classList.remove('highlight-section');
                        }, 2000);
                    }
                });
            } else {
                // If we're on the blog page, filter posts
                blogPosts.forEach(post => {
                    const categories = post.dataset.categories;
                    if (categories && categories.includes(tag)) {
                        post.style.display = 'block';
                    } else {
                        post.style.display = 'none';
                    }
                });
                
                // Update filter buttons
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.classList.remove('bg-neutral-800', 'text-white');
                    btn.classList.add('bg-white', 'text-neutral-600', 'border', 'border-neutral-300');
                });
            }
        });
    });

    // Add loading animation
    window.addEventListener('load', function() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }
    });
});

// BibTeX copy functionality (outside DOMContentLoaded for global access)
function copyBibTeX(itemId) {
    const bibtexElement = document.getElementById('bibtex-' + itemId);
    if (!bibtexElement) return;

    const bibtexText = bibtexElement.textContent.trim();
    
    // Create a temporary textarea to copy text
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = bibtexText;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    
    try {
        document.execCommand('copy');
        
        // Show feedback
        const button = event.target.closest('button');
        const originalText = button.innerHTML;
        button.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>Copied!';
        button.classList.add('text-green-600');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('text-green-600');
        }, 2000);
        
    } catch (err) {
        console.error('Failed to copy BibTeX:', err);
    } finally {
        document.body.removeChild(tempTextarea);
    }
}
