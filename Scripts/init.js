document.addEventListener("DOMContentLoaded", function() {
    updateContentBasedOnLanguage("en");
    createSimpleHexagonGrid(10, 20);
    removeHexagonsOutsideContainer();
    
    // Définir la navigation active initiale
    const currentSection = window.location.hash || '#Home';
    const activeNavLink = document.querySelector(`.choice[href="${currentSection}"]`);
    if (activeNavLink) {
        activeNavLink.classList.add('active');
    } else {
        // Par défaut, activer le lien Home
        document.querySelector('.choice[href="#Home"]').classList.add('active');
    }
});

window.addEventListener('resize', function () {
    createSimpleHexagonGrid(10, 20);
    removeHexagonsOutsideContainer();
});
