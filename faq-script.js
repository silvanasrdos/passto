// Script para la página de Preguntas Frecuentes

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeFAQPage();
    setupEventListeners();
    setupAccordion();
    setupSearch();
    setupCategories();
});

// Inicializar página FAQ
function initializeFAQPage() {
    // Establecer enlace activo en la navbar
    if (typeof window.setActiveNavLink === 'function') {
        window.setActiveNavLink();
    }
    
    // Actualizar UI de usuario
    if (typeof updateUserUI === 'function') {
        updateUserUI();
    }
    
    // Actualizar carrito
    if (typeof updateCart === 'function') {
        updateCart();
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Botón crear evento del header
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            window.location.href = 'evento.html';
        });
    }
    
    // Botón del carrito
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn && typeof openCart === 'function') {
        cartBtn.addEventListener('click', openCart);
    }
}

// Configurar acordeón
function setupAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Cerrar todos los demás items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });
            
            // Toggle del item actual
            if (isActive) {
                faqItem.classList.remove('active');
            } else {
                faqItem.classList.add('active');
            }
        });
    });
}

// Configurar búsqueda
function setupSearch() {
    const searchInput = document.getElementById('faqSearch');
    const searchClear = document.getElementById('searchClear');
    
    if (!searchInput) return;
    
    // Mostrar/ocultar botón de limpiar
    searchInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            searchClear.style.display = 'flex';
        } else {
            searchClear.style.display = 'none';
            filterFAQs('');
        }
    });
    
    // Limpiar búsqueda
    if (searchClear) {
        searchClear.addEventListener('click', function() {
            searchInput.value = '';
            this.style.display = 'none';
            filterFAQs('');
        });
    }
    
    // Filtrar mientras se escribe
    searchInput.addEventListener('input', function() {
        filterFAQs(this.value.toLowerCase().trim());
    });
}

// Filtrar FAQs por texto
function filterFAQs(searchTerm) {
    const faqItems = document.querySelectorAll('.faq-item');
    const faqSections = document.querySelectorAll('.faq-section');
    const noResults = document.getElementById('noResults');
    let hasResults = false;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question span').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
        
        if (searchTerm === '' || question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.classList.remove('hidden');
            hasResults = true;
        } else {
            item.classList.add('hidden');
        }
    });
    
    // Mostrar/ocultar secciones según si tienen items visibles
    faqSections.forEach(section => {
        const visibleItems = section.querySelectorAll('.faq-item:not(.hidden)');
        if (visibleItems.length === 0) {
            section.classList.add('hidden');
        } else {
            section.classList.remove('hidden');
            hasResults = true;
        }
    });
    
    // Mostrar mensaje de sin resultados
    if (noResults) {
        if (hasResults || searchTerm === '') {
            noResults.style.display = 'none';
        } else {
            noResults.style.display = 'block';
        }
    }
}

// Configurar categorías
function setupCategories() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Actualizar botones activos
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar por categoría
            filterByCategory(category);
            
            // Limpiar búsqueda si hay
            const searchInput = document.getElementById('faqSearch');
            if (searchInput) {
                searchInput.value = '';
                const searchClear = document.getElementById('searchClear');
                if (searchClear) {
                    searchClear.style.display = 'none';
                }
            }
        });
    });
}

// Filtrar por categoría
function filterByCategory(category) {
    const faqSections = document.querySelectorAll('.faq-section');
    const noResults = document.getElementById('noResults');
    let hasResults = false;
    
    faqSections.forEach(section => {
        const sectionCategory = section.getAttribute('data-category');
        
        if (category === 'all' || sectionCategory === category) {
            section.classList.remove('hidden');
            hasResults = true;
        } else {
            section.classList.add('hidden');
        }
    });
    
    // Mostrar mensaje de sin resultados
    if (noResults) {
        if (hasResults) {
            noResults.style.display = 'none';
        } else {
            noResults.style.display = 'block';
        }
    }
}

// Scroll suave a FAQ específico si hay hash en la URL
window.addEventListener('load', function() {
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            setTimeout(() => {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Abrir el acordeón si es un FAQ item
                const faqItem = targetElement.closest('.faq-item');
                if (faqItem) {
                    faqItem.classList.add('active');
                }
            }, 100);
        }
    }
});

