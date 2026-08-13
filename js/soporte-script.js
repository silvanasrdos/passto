// Script para la página de Términos y Condiciones

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeSupportPage();
    setupEventListeners();
});

// Inicializar página de soporte
function initializeSupportPage() {
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
    
    // Configurar scroll suave para los enlaces del índice
    setupSmoothScroll();
    
    // Configurar botón de volver arriba
    setupBackToTop();
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

// Configurar scroll suave para los enlaces del índice
function setupSmoothScroll() {
    const tocLinks = document.querySelectorAll('.table-of-contents a[href^="#"]');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 100; // Altura del header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Resaltar la sección al llegar
                highlightSection(targetElement);
            }
        });
    });
}

// Resaltar sección al hacer scroll
function highlightSection(element) {
    // Remover resaltado anterior
    document.querySelectorAll('.terms-section').forEach(section => {
        section.classList.remove('highlighted');
    });
    
    // Agregar resaltado
    element.classList.add('highlighted');
    
    // Remover después de 2 segundos
    setTimeout(() => {
        element.classList.remove('highlighted');
    }, 2000);
}

// Configurar botón de volver arriba
function setupBackToTop() {
    // Crear botón si no existe
    let backToTopBtn = document.getElementById('backToTopBtn');
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'backToTopBtn';
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.title = 'Volver arriba';
        backToTopBtn.style.display = 'none';
        document.body.appendChild(backToTopBtn);
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Mostrar/ocultar botón según scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
}

// Detectar sección visible para resaltar en el índice
function updateActiveSection() {
    const sections = document.querySelectorAll('.terms-section');
    const tocLinks = document.querySelectorAll('.table-of-contents a[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = section.id;
        }
    });
    
    // Actualizar enlaces activos en el índice
    tocLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        if (href === currentSection) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Ejecutar actualización de sección activa al hacer scroll
window.addEventListener('scroll', updateActiveSection);
updateActiveSection(); // Ejecutar al cargar

// Manejar formulario de contacto
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const formData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                phone: document.getElementById('contactPhone').value,
                subject: document.getElementById('contactSubject').value,
                message: document.getElementById('contactMessage').value,
                consent: document.getElementById('contactConsent').checked
            };
            
            // Validación básica
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                showContactNotification('Por favor, complete todos los campos requeridos.', 'error');
                return;
            }
            
            if (!formData.consent) {
                showContactNotification('Debe aceptar el procesamiento de datos para enviar el formulario.', 'error');
                return;
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showContactNotification('Por favor, ingrese un email válido.', 'error');
                return;
            }
            
            // Simular envío (en producción, aquí se enviaría al servidor)
            showContactNotification('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success');
            
            // Limpiar formulario
            contactForm.reset();
            
            // En producción, aquí harías una petición AJAX:
            /*
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showContactNotification('¡Mensaje enviado con éxito!', 'success');
                    contactForm.reset();
                } else {
                    showContactNotification('Error al enviar el mensaje. Por favor, intente nuevamente.', 'error');
                }
            })
            .catch(error => {
                showContactNotification('Error al enviar el mensaje. Por favor, intente nuevamente.', 'error');
            });
            */
        });
    }
}

// Mostrar notificación de contacto
function showContactNotification(message, type) {
    // Remover notificación anterior si existe
    const existingNotification = document.querySelector('.contact-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `contact-notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Insertar después del formulario
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.parentElement.insertBefore(notification, contactForm.nextSibling);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Inicializar formulario de contacto cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    setupContactForm();
});

