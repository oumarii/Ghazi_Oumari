// Navigation Enhancement Script
// Améliore l'expérience utilisateur avec indicateur de progression et navigation active

document.addEventListener('DOMContentLoaded', function() {
    // Éléments de navigation
    const navbar = document.getElementById('stickyNav');
    const navLinks = document.querySelectorAll('.choice');
    const sections = document.querySelectorAll('section');
    
    // Configuration
    const config = {
        offset: 100, // Offset pour l'activation des sections
        smoothScrollDuration: 800
    };

    // 1. Indicateur de progression de lecture
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Mise à jour de la variable CSS
        document.documentElement.style.setProperty('--scroll-progress', `${scrollPercent}%`);
    }

    // 2. Navigation active basée sur la section visible
    function updateActiveNavigation() {
        const scrollPos = window.scrollY + config.offset;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Retirer la classe active de tous les liens
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Ajouter la classe active au lien correspondant
                const activeLinks = document.querySelectorAll(`a[href="#${sectionId}"]`);
                activeLinks.forEach(link => {
                    link.classList.add('active');
                });
            }
        });
    }

    // 3. Smooth scroll amélioré
    function smoothScrollTo(target, duration = config.smoothScrollDuration) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;

        const targetPosition = targetElement.offsetTop - 80; // Offset pour la navbar
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        // Fonction d'easing pour un scroll plus fluide
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // 4. Gestion des clics sur les liens de navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            
            if (target && target.startsWith('#')) {
                smoothScrollTo(target);
                
                // Fermer le menu mobile si ouvert
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                }
                
                // Ajouter la classe active au lien cliqué
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // 5. Effet de navbar au scroll
    let lastScrollTop = 0;
    function handleNavbarScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Effet de transparence et d'ombre basé sur la position de défilement
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
            navbar.style.height = '70px';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.height = '75px';
        }
        
        lastScrollTop = scrollTop;
    }

    // 6. Intersection Observer pour les animations d'entrée
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observer toutes les sections
    sections.forEach(section => {
        observer.observe(section);
    });

    // 7. Event listeners
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                updateActiveNavigation();
                handleNavbarScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // 8. Initialisation
    updateScrollProgress();
    updateActiveNavigation();
    handleNavbarScroll();

    // 9. Gestion du redimensionnement
    window.addEventListener('resize', () => {
        updateActiveNavigation();
    });

    // 10. Préchargement des sections pour une navigation plus fluide
    const preloadSections = () => {
        sections.forEach(section => {
            const images = section.querySelectorAll('img');
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        });
    };

    // Précharger après un délai
    setTimeout(preloadSections, 1000);
});

// Utilitaire pour débouncer les événements
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Export pour utilisation dans d'autres scripts
window.NavigationEnhancement = {
    updateScrollProgress,
    smoothScrollTo,
    debounce
};
