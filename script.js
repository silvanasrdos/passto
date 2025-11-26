// State Management - Make globally accessible
window.currentUser = null;
window.cart = [];
window.myTickets = [];
window.users = [];

// Helper functions to sync local and global variables
function setCurrentUser(user) {
    currentUser = user;
    window.currentUser = user;
}

function setCart(newCart) {
    cart = newCart;
    window.cart = newCart;
}

function setMyTickets(tickets) {
    myTickets = tickets;
    window.myTickets = tickets;
}

function setUsers(newUsers) {
    users = newUsers;
    window.users = newUsers;
}

let currentUser = window.currentUser;
let cart = window.cart;
let myTickets = window.myTickets;
let users = window.users;
let authMode = 'login';
let pendingCreateEvent = false;

// Load data from localStorage
function loadData() {
    const savedUser = localStorage.getItem('currentUser');
    const savedCart = localStorage.getItem('cart');
    const savedTickets = localStorage.getItem('myTickets');
    const savedUsers = localStorage.getItem('users');
    
    if (savedUser) {
        try {
            const parsedUser = JSON.parse(savedUser);
            setCurrentUser(parsedUser);
            // Asegurar que currentUser esté disponible globalmente
            window.currentUser = parsedUser;
        } catch (e) {
            console.error('Error parsing currentUser:', e);
            setCurrentUser(null);
            window.currentUser = null;
        }
    } else {
        setCurrentUser(null);
        window.currentUser = null;
    }
    if (savedCart) {
        try {
            setCart(JSON.parse(savedCart));
        } catch (e) {
            console.error('Error parsing cart:', e);
        }
    }
    if (savedTickets) {
        try {
            setMyTickets(JSON.parse(savedTickets));
        } catch (e) {
            console.error('Error parsing myTickets:', e);
            setMyTickets([]);
        }
    }
    if (savedUsers) {
        try {
            setUsers(JSON.parse(savedUsers));
        } catch (e) {
            console.error('Error parsing users:', e);
        }
    }
}

// Save data to localStorage
function saveData() {
    // Sync local variables with global ones
    window.currentUser = currentUser;
    window.cart = cart;
    window.myTickets = myTickets;
    window.users = users;
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('myTickets', JSON.stringify(myTickets));
    localStorage.setItem('users', JSON.stringify(users));
}

// Event Data - Make it globally accessible
window.eventsData = [
    {
        id: 1,
        title: "Las Pastillas del Abuelo",
        category: "music",
        date: "25 Abril del 2026",
        time: "20:00",
        location: "Punta Norte",
        locality: "Roque Sáenz Peña",
        price: 30000.00,
        image: "img/las-pastillas-del-abuelo.png",
        badge: "Trending",
        description: "Concierto de Las Pastillas del Abuelo. Disfruta de los mejores temas de la banda en una noche inolvidable.",
        tickets: [
            { type: "General", description: "Acceso general al evento", price: 30000.00 },
            { type: "VIP", description: "Acceso VIP con área exclusiva", price: 45000.00 },
            { type: "Premium", description: "Backstage y meet & greet", price: 60000.00 }
        ]
    },
    {
        id: 2,
        title: "Partido Club Acción",
        category: "sports",
        date: "15 Noviembre del 2026",
        time: "19:30",
        location: "Club Acción",
        locality: "Roque Sáenz Peña",
        price: 4000.00,
        image: "img/partido-club-accion.png",
        badge: "Agotándose",
        description: "Partido del Club Acción. Vive la emoción del basquet en vivo.",
        tickets: [
            { type: "Tribuna", description: "Asientos en tribuna", price: 4000.00 },
            { type: "Palco", description: "Palco VIP", price: 6000.00 }
        ]
    },
    {
        id: 3,
        title: "Tributo Coldplay",
        category: "music",
        date: "05 Diciembre del 2025",
        time: "21:00",
        location: "Beer Garden",
        locality: "Roque Sáenz Peña",
        price: 8000.00,
        image: "img/tributo-coldplay.png",
        badge: "Nuevo",
        description: "Una noche de tributo a Coldplay con las mejores bandas de la escena local.",
        tickets: [
            { type: "General", description: "Entrada general", price: 8000.00 },
            { type: "Fan Zone", description: "Zona de fans cerca del escenario", price: 10000.00 }
        ]
    },
    {
        id: 4,
        title: "Bodas de Sangre",
        category: "theater",
        date: "30 Agosto del 2026",
        time: "18:00",
        location: "Centro Cultural",
        locality: "Roque Sáenz Peña",
        price: 3000.00,
        image: "img/bodas-de-sangre-obra.png",
        badge: "",
        description: "Una interpretación magistral de la obra de Federico García Lorca.",
        tickets: [
            { type: "Platea", description: "Asientos en platea", price: 3000.00 },
            { type: "Preferencial", description: "Mejores asientos", price: 5000.00 }
        ]
    },
    {
        id: 5,
        title: "Bienal Tecno",
        category: "conference",
        date: "14/15/16 de Noviembre del 2025",
        time: "09:00",
        location: "Domo Centenario",
        locality: "Resistencia",
        price: 15000.00,
        image: "img/bienal-tecno.png",
        badge: "Destacado",
        description: "La conferencia de tecnología más importante del año con speakers de todo el mundo.",
        tickets: [
            { type: "Básico", description: "Acceso a conferencias", price: 15000.00 },
            { type: "Pro", description: "Acceso + workshops", price: 20000.00 }
        ]
    },
    {
        id: 6,
        title: "Bienal de Arte",
        category: "art",
        date: "10 Abril del 2026",
        time: "10:00",
        location: "Av. de los Inmigrantes 1001",
        locality: "Resistencia",
        price: 25000.00,
        image: "img/bienal-arte.png",
        badge: "",
        description: "Descubre las últimas tendencias del arte contemporáneo con artistas emergentes.",
        tickets: [
            { type: "Individual", description: "Entrada individual", price: 25000.00 },
            { type: "Familiar", description: "Entrada familiar (4 personas)", price: 60000.00 }
        ]
    },
    {
        id: 7,
        title: "Festival de Folklore",
        category: "music",
        date: "21/22/23 de Noviembre del 2025",
        time: "19:00",
        location: "Parque 2 de Febrero",
        locality: "Resistencia",
        price: 10000.00,
        image: "img/festival-folklore.png",
        badge: "Trending",
        description: "Una celebración del folklore con músicos de renombre nacional.",
        tickets: [
            { type: "General", description: "Acceso general", price: 10000.00 },
            { type: "Premium", description: "Asientos preferenciales", price: 15000.00 }
        ]
    },
    {
        id: 8,
        title: "Encuentro de Hockey",
        category: "sports",
        date: "30 de Agosto del 2025",
        time: "18:30",
        location: "Club Regatas",
        locality: "Resistencia",
        price: 3000.00,
        image: "img/encuentro-hockey.png",
        badge: "",
        description: "Encuentro de hockey con los mejores equipos de la región.",
        tickets: [
            { type: "General", description: "Entrada general", price: 3000.00 },
            { type: "Preferente", description: "Zona preferente", price: 4500.00 }
        ]
    },
    {
        id: 9,
        title: "Mamagula",
        category: "music",
        date: "08 de Marzo del 2026",
        time: "21:00",
        location: "Complejo La Pacú",
        locality: "Roque Sáenz Peña",
        price: 10000.00,
        image: "img/mamagula.png",
        badge: "Nuevo",
        description: "Festival de comidas y bebidas con artistas locales.",
        tickets: [
            { type: "General", description: "Entrada general", price: 10000.00 },
            { type: "VIP", description: "Pase VIP (incluye 3 días de festival)", price: 24000.00 }
        ]
    },
    {
        id: 10,
        title: "Muestra de Folklore",
        category: "art",
        date: "21 de Noviembre del 2025",
        time: "19:00",
        location: "Centro Cultural",
        locality: "Roque Sáenz Peña",
        price: 2000.00,
        image: "img/muestra-folklore.png",
        badge: "",
        description: "Muestra de folklore tradicional con artistas locales.",
        tickets: [
            { type: "General", description: "Entrada general", price: 2000.00 }
        ]
    },
    {
        id: 11,
        title: "Títeres",
        category: "theater",
        date: "17 de Octubre del 2025",
        time: "16:00",
        location: "Teatro Infantil",
        locality: "Resistencia",
        price: 2000.00,
        image: "img/titeres.png",
        badge: "",
        description: "Espectáculo de títeres para toda la familia.",
        tickets: [
            { type: "General", description: "Entrada general", price: 2000.00 },
            { type: "Niños", description: "Entrada para niños (hasta 12 años)", price: 0.00 }
        ]
    },
    {
        id: 12,
        title: "Evento Gratuito",
        category: "music",
        date: "05 de Noviembre del 2025",
        time: "18:00",
        location: "Plaza Central",
        locality: "Resistencia",
        price: 0.00,
        image: "img/evento-gratuito.png",
        badge: "Gratis",
        description: "Evento gratuito para toda la comunidad. Se solicitará como entrada alimentos no perecederos.",
        tickets: [
            { type: "General", description: "Entrada gratuita", price: 0.00 }
        ]
    },
    {
        id: 13,
        title: "Fiesta del Algodón",
        category: "music",
        date: "05/06/07 de Noviembre del 2025",
        time: "20:00",
        location: "FERICHACO",
        locality: "Roque Sáenz Peña",
        price: 10000.00,
        image: "img/fiesta-del-algodon-saenz-pena-2025-banner-001.jpg",
        badge: "Destacado",
        description: "Fiesta del Algodón 2025 en Roque Sáenz Peña. Disfruta de la música, la danza y la cultura.",
        tickets: [
            { type: "General", description: "Entrada general", price: 10000.00 },
            { type: "VIP", description: "Pase VIP (incluye 3 días de festival)", price: 24000.00 }
        ]
    },
    {
        id: 14,
        title: "Otra Cosa",
        category: "music",
        date: "21 Diciembre del 2025",
        time: "22:00",
        location: "Consorcio Camionero",
        locality: "Roque Sáenz Peña",
        price: 10000.00,
        image: "img/otra-cosa.png",
        badge: "",
        description: "Evento musical con artistas locales.",
        tickets: [
            { type: "General", description: "Entrada general", price: 10000.00 }
        ]
    },
    {
        id: 15,
        title: "Agronea",
        category: "conference",
        date: "03/04/05 de Julio del 2026",
        time: "09:00",
        location: "Predio Agronea - Ruta 89",
        locality: "Charata",
        price: 15000.00,
        image: "img/agronea.jpg",
        badge: "Destacado",
        description: "Feria y exposición agropecuaria del NEA. Tecnología, maquinaria y productos del sector agro.",
        tickets: [
            { type: "General", description: "Entrada general", price: 15000.00 },
            { type: "Estudiante", description: "Entrada con descuento estudiantil", price: 10000.00 },
            { type: "VIP", description: "Acceso VIP con beneficios exclusivos", price: 20000.00 }
        ]
    }
];

// Make eventsData accessible globally
const eventsData = window.eventsData;

// Cargar eventos desde localStorage y agregarlos a eventsData
function loadEventsFromStorage() {
    try {
        const savedEvents = JSON.parse(localStorage.getItem('eventsData') || '[]');
        const myEvents = JSON.parse(localStorage.getItem('myEvents') || '[]');
        
        // Combinar eventos guardados con los eventos por defecto
        // Evitar duplicados por ID
        const existingIds = new Set(eventsData.map(e => e.id));
        
        savedEvents.forEach(event => {
            if (!existingIds.has(event.id)) {
                eventsData.push(event);
                existingIds.add(event.id);
            }
        });
        
        myEvents.forEach(event => {
            if (!existingIds.has(event.id)) {
                eventsData.push(event);
                existingIds.add(event.id);
            }
        });
        
        // Actualizar window.eventsData
        window.eventsData = eventsData;
    } catch (e) {
        console.error('Error loading events from storage:', e);
    }
}

const categoryLabels = {
    all: "Eventos Destacados",
    music: "Eventos de Música",
    sports: "Eventos Deportivos",
    theater: "Eventos de Teatro",
    conference: "Conferencias y Talks",
    art: "Eventos de Arte"
};

let currentCategory = "all";
let currentSearchTerm = "";
let currentLocality = "";
let currentProvince = "";
let currentDateFilter = "";

function setSectionTitle(text) {
    const titleEl = document.querySelector('.section-title');
    if (titleEl) {
        titleEl.textContent = text;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
        // Check if splash was already shown in this session
        const splashShown = sessionStorage.getItem('splashShown');
        
        if (splashShown === 'true') {
            // Already shown, hide immediately
            splashScreen.style.display = 'none';
            splashScreen.remove();
        } else {
            // First time, show splash
            document.body.classList.add('no-scroll');

            const hideSplash = () => {
                if (splashScreen.classList.contains('hide')) return;
                splashScreen.classList.add('hide');
                document.body.classList.remove('no-scroll');
                // Mark as shown in session
                sessionStorage.setItem('splashShown', 'true');
                setTimeout(() => {
                    if (splashScreen.parentNode) {
                        splashScreen.remove();
                    }
                }, 600);
            };

            splashScreen.addEventListener('click', hideSplash);
            setTimeout(hideSplash, 5000);
        }
    }

    loadData();
    
    // Only run these if we're on index.html (not on mistickets.html)
    const isTicketsPage = window.location.pathname.includes('mistickets.html');
    const isHistoriaPage = window.location.pathname.includes('historia.html');
    const isMisEventosPage = window.location.pathname.includes('mis-eventos.html');
    const isEventoPage = window.location.pathname.includes('evento.html');
    
    // Setup event listeners para la navbar en todas las páginas (excepto mistickets que tiene su propio script)
    if (!isTicketsPage) {
        setupEventListeners();
    }
    
    if (!isTicketsPage && !isHistoriaPage && !isMisEventosPage && !isEventoPage) {
        // Cargar eventos desde localStorage y combinarlos con eventsData
        loadEventsFromStorage();
        renderBannerCarousel();
        renderEvents(eventsData);
        setupFilterListeners();
        setSectionTitle(categoryLabels[currentCategory]);
    }
    
    // Always update cart and user UI (needed for all pages)
    updateCart();
    updateUserUI();
    
    // Setup hamburger menu
    setupHamburgerMenu();
    
    // Establecer enlace activo en todas las páginas
    if (typeof window.setActiveNavLink === 'function') {
        window.setActiveNavLink();
    }
    
    // Manejar el botón "atrás" del navegador para cerrar modales
    window.addEventListener('popstate', function(event) {
        const modal = document.getElementById('eventModal');
        if (modal && modal.classList.contains('active')) {
            // Cerrar el modal cuando el usuario presiona "atrás"
            modal.classList.remove('active');
            modal.style.zIndex = '';
        }
        
        // También cerrar otros modales si están abiertos
        const ticketModal = document.getElementById('ticketModal');
        if (ticketModal && ticketModal.classList.contains('active')) {
            ticketModal.classList.remove('active');
        }
    });
});

// Render Events
function renderEvents(events) {
    const eventsGrid = document.getElementById('eventsGrid');
    eventsGrid.innerHTML = '';
    
    events.forEach(event => {
        const eventCard = createEventCard(event);
        eventsGrid.appendChild(eventCard);
    });
}

// Create Event Card
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.setAttribute('data-event-id', event.id);
    card.innerHTML = `
        <div class="event-image-wrapper">
            <img src="${event.image}" alt="${event.title}" class="event-image">
            ${event.badge ? `<span class="event-badge">${event.badge}</span>` : ''}
        </div>
        <div class="event-info">
            <div class="event-date">
                <i class="far fa-calendar"></i>
                <span>${event.date} • ${event.time}</span>
            </div>
            <h3 class="event-title">${event.title}</h3>
            <div class="event-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${event.location}</span>
            </div>
            <div class="event-footer">
                <div class="event-price">
                    $${event.price.toFixed(2)}
                    <span>/ p</span>
                </div>
            </div>
        </div>
    `;
    
    // Add click event to open modal
    card.addEventListener('click', () => {
        openEventModal(event.id);
    });
    
    return card;
}

// Open Event Modal
function openEventModal(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;
    
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <img src="${event.image}" alt="${event.title}" class="event-detail-image">
        <div class="event-detail-content">
            <div class="event-detail-header">
                <h2 class="event-detail-title">${event.title}</h2>
                <div class="event-detail-meta">
                    <div class="meta-item">
                        <i class="far fa-calendar"></i>
                        <span>${event.date} - ${event.time}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.location}</span>
                    </div>
                </div>
            </div>
            <p class="event-description">${event.description}</p>
            
            <div class="ticket-selection">
                <h3>Selecciona tus entradas</h3>
                ${event.tickets.map((ticket, index) => `
                    <div class="ticket-type" id="ticket-${event.id}-${index}">
                        <div class="ticket-info">
                            <h4>${ticket.type}</h4>
                            <p>${ticket.description}</p>
                        </div>
                        <div class="ticket-price-wrapper">
                            <span class="ticket-price">$${ticket.price.toFixed(2)}</span>
                            <div class="quantity-selector">
                                <button class="qty-btn" onclick="changeQuantity(${event.id}, ${index}, -1)">-</button>
                                <span class="qty-display" id="qty-${event.id}-${index}">0</span>
                                <button class="qty-btn" onclick="changeQuantity(${event.id}, ${index}, 1)">+</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <button class="btn-primary" style="width: 100%; padding: 16px; font-size: 16px;" onclick="addSelectedTicketsToCart(${event.id})">
                <i class="fas fa-shopping-cart"></i>
                Agregar al Carrito
            </button>
        </div>
    `;
    
    // Agregar entrada al historial para manejar el botón "atrás" en móviles
    if (window.history && window.history.pushState) {
        window.history.pushState({ modalOpen: true, eventId: eventId }, '', window.location.href);
    }
    
    modal.classList.add('active');
}

// Change Ticket Quantity
function changeQuantity(eventId, ticketIndex, delta) {
    const qtyDisplay = document.getElementById(`qty-${eventId}-${ticketIndex}`);
    let currentQty = parseInt(qtyDisplay.textContent);
    let newQty = Math.max(0, Math.min(10, currentQty + delta));
    qtyDisplay.textContent = newQty;
}

// Add Selected Tickets to Cart
function addSelectedTicketsToCart(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;
    
    let addedCount = 0;
    
    event.tickets.forEach((ticket, index) => {
        const qty = parseInt(document.getElementById(`qty-${eventId}-${index}`).textContent);
        if (qty > 0) {
            for (let i = 0; i < qty; i++) {
                cart.push({
                    eventId: event.id,
                    eventTitle: event.title,
                    eventDate: event.date,
                    eventTime: event.time,
                    eventLocation: event.location,
                    ticketType: ticket.type,
                    price: ticket.price,
                    cartItemId: Date.now() + Math.random()
                });
                addedCount++;
            }
        }
    });
    
    if (addedCount > 0) {
        setCart(cart);
        updateCart();
        closeEventModal();
        showNotification(`${addedCount} entrada(s) agregada(s) al carrito`);
    }
}

// Update User UI
function updateUserUI() {
    const userNameEl = document.getElementById('userName');
    const userDropdown = document.getElementById('userDropdown');
    const userDropdownBtn = document.getElementById('userDropdownBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutText = document.getElementById('logoutText');
    const misEventosLink = document.getElementById('misEventosLink');
    
    if (currentUser) {
        if (userNameEl) {
            const displayName = currentUser.name.length > 10 
                ? currentUser.name.substring(0, 10) + '...' 
                : currentUser.name;
            userNameEl.textContent = displayName;
        }
        if (userDropdown) {
            userDropdown.style.display = 'block';
        }
        if (userDropdownBtn) {
            userDropdownBtn.style.cursor = 'pointer';
        }
        if (logoutText) {
            logoutText.textContent = 'Cerrar Sesión';
        }
        
        // Mostrar enlace "Mis Eventos" si el usuario tiene eventos creados
        if (misEventosLink) {
            const myEvents = JSON.parse(localStorage.getItem('myEvents') || '[]');
            const userEvents = myEvents.filter(e => e.creatorId === currentUser.id || e.creatorId === currentUser.email);
            if (userEvents.length > 0) {
                misEventosLink.style.display = 'block';
            } else {
                misEventosLink.style.display = 'none';
            }
        }
    } else {
        if (userNameEl) {
            userNameEl.textContent = 'Iniciar Sesión';
        }
        if (userDropdown) {
            userDropdown.style.display = 'block'; // Keep visible but change behavior
        }
        if (userDropdownBtn) {
            userDropdownBtn.style.cursor = 'pointer';
        }
        if (misEventosLink) {
            misEventosLink.style.display = 'none';
        }
        if (logoutText) {
            logoutText.textContent = 'Iniciar Sesión';
        }
    }
    
    if (registerBtn) {
        registerBtn.innerHTML = '<span class="btn-create-text">CREAR EVENTO</span>';
    }
    
    // Update hamburger menu UI
    if (typeof updateHamburgerMenuUI === 'function') {
        updateHamburgerMenuUI();
    }
}

// Update Cart
function updateCart() {
    const cartBadge = document.getElementById('cartBadge');
    const cartItems = document.getElementById('cartItems');
    const totalAmount = document.getElementById('totalAmount');
    
    // Check if elements exist (they might not exist on mistickets.html)
    if (!cartBadge && !cartItems && !totalAmount) {
        return; // Exit early if we're not on a page with cart elements
    }
    
    if (cartBadge) {
        cartBadge.textContent = cart.length;
    }
    
    if (cart.length === 0) {
        if (cartItems) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Tu carrito está vacío</p>
                </div>
            `;
        }
        if (totalAmount) {
            totalAmount.textContent = '$0.00';
        }
    } else {
        let subtotal = 0;
        cartItems.innerHTML = cart.map((item, index) => {
            subtotal += item.price;
            return `
                <div class="cart-item">
                    <div class="cart-item-header">
                        <h4>${item.eventTitle}</h4>
                        <button class="remove-item" onclick="removeFromCart(${index})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="cart-item-info">
                        <div><i class="fas fa-ticket"></i> ${item.ticketType}</div>
                        <div><i class="far fa-calendar"></i> ${item.eventDate} - ${item.eventTime}</div>
                    </div>
                    <div class="cart-item-footer">
                        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    </div>
                </div>
            `;
        }).join('');
        
        // Calcular cargo de servicio (10%)
        const serviceCharge = subtotal * 0.10;
        const total = subtotal + serviceCharge;
        
        // Agregar desglose del total en el carrito
        cartItems.innerHTML += `
            <div style="padding: 16px; border-top: 2px solid var(--border-color); margin-top: 16px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: var(--text-secondary);">
                    <span>Subtotal:</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: var(--text-secondary);">
                    <span>Cargo de servicio (10%):</span>
                    <span>$${serviceCharge.toFixed(2)}</span>
                </div>
            </div>
        `;
        
        totalAmount.textContent = `$${total.toFixed(2)}`;
    }
    setCart(cart);
    saveData();
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    setCart(cart);
    updateCart();
    showNotification('Entrada eliminada del carrito');
}

// Checkout - Show Payment Modal
function checkout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío');
        return;
    }
    
    if (!currentUser) {
        showAuthModal('login');
        return;
    }
    
    showPaymentModal();
}

// Show Auth Modal
function showAuthModal(mode = 'login') {
    authMode = mode;
    const isRegister = mode === 'register';
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('modalBody');
    
    const title = isRegister ? 'Crear Cuenta' : 'Iniciar Sesión';
    const subtitle = isRegister
        ? 'Completa tus datos para comenzar tu experiencia.'
        : 'Ingresa tus credenciales para continuar';
    const btnText = isRegister ? 'Crear cuenta' : 'Entrar';
    const icon = isRegister ? 'fas fa-user-plus' : 'fas fa-unlock-alt';
    const switchMode = isRegister ? 'login' : 'register';
    const switchText = isRegister ? '¿Ya tienes una cuenta?' : '¿Aún no tienes cuenta?';
    const switchCta = isRegister ? 'Inicia sesión' : 'Regístrate gratis';
    
    const formFields = isRegister
        ? `
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Usuario</label>
                <input type="text" id="registerUsername" required style="width: 100%; padding: 14px; border: 2px solid var(--bg-color); border-radius: 8px; font-size: 16px; transition: var(--transition);" placeholder="tu_usuario" onfocus="this.style.borderColor='var(--primary-color)'" onblur="this.style.borderColor='var(--bg-color)'">
            </div>
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Email</label>
                <input type="email" id="registerEmail" required style="width: 100%; padding: 14px; border: 2px solid var(--bg-color); border-radius: 8px; font-size: 16px; transition: var(--transition);" placeholder="correo@ejemplo.com" onfocus="this.style.borderColor='var(--primary-color)'" onblur="this.style.borderColor='var(--bg-color)'">
            </div>
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Clave de acceso</label>
                <input type="password" id="registerPassword" required minlength="6" style="width: 100%; padding: 14px; border: 2px solid var(--bg-color); border-radius: 8px; font-size: 16px; transition: var(--transition);" placeholder="••••••" onfocus="this.style.borderColor='var(--primary-color)'" onblur="this.style.borderColor='var(--bg-color)'">
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Repetir clave</label>
                <input type="password" id="registerPasswordConfirm" required minlength="6" style="width: 100%; padding: 14px; border: 2px solid var(--bg-color); border-radius: 8px; font-size: 16px; transition: var(--transition);" placeholder="••••••" onfocus="this.style.borderColor='var(--primary-color)'" onblur="this.style.borderColor='var(--bg-color)'">
            </div>
        `
        : `
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Email</label>
                <input type="email" id="loginEmail" required style="width: 100%; padding: 14px; border: 2px solid var(--bg-color); border-radius: 8px; font-size: 16px; transition: var(--transition);" placeholder="correo@ejemplo.com" onfocus="this.style.borderColor='var(--primary-color)'" onblur="this.style.borderColor='var(--bg-color)'">
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Clave de acceso</label>
                <input type="password" id="loginPassword" required minlength="6" style="width: 100%; padding: 14px; border: 2px solid var(--bg-color); border-radius: 8px; font-size: 16px; transition: var(--transition);" placeholder="••••••" onfocus="this.style.borderColor='var(--primary-color)'" onblur="this.style.borderColor='var(--bg-color)'">
            </div>
        `;
    
    modalBody.innerHTML = `
        <div class="event-detail-content" style="padding: 60px 40px;">
            <div style="text-align: center; margin-bottom: 32px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: white; font-size: 40px;">
                    <i class="${icon}"></i>
                </div>
                <h2 style="margin-bottom: 8px;">${title}</h2>
                <p style="color: var(--text-secondary);">${subtitle}</p>
            </div>
            
            <form id="authForm" onsubmit="handleAuth(event)" style="max-width: 400px; margin: 0 auto;">
                ${formFields}
                <button type="submit" class="btn-primary" style="width: 100%; padding: 16px; font-size: 16px; margin-top: 12px; justify-content: center;">
                    <i class="fas fa-arrow-right"></i>
                    ${btnText}
                </button>
            </form>
            <div style="margin-top: 24px; text-align: center; color: var(--text-secondary); font-size: 14px;">
                ${switchText}
                <button type="button" onclick="switchAuthMode('${switchMode}')" style="background: none; border: none; color: var(--secondary-color); font-weight: 700; cursor: pointer; margin-left: 6px;">${switchCta}</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function handleAuth(event) {
    event.preventDefault();
    
    if (authMode === 'register') {
        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim().toLowerCase();
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
        
        if (!username) {
            showNotification('Por favor ingresa un usuario válido', 'error');
            return;
        }
        if (password !== passwordConfirm) {
            showNotification('Las claves no coinciden', 'error');
            return;
        }
        if (users.some(user => user.email === email)) {
            showNotification('El email ya está registrado', 'error');
            return;
        }
        if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
            showNotification('El usuario ya está en uso', 'error');
            return;
        }
        
        const newUser = {
            username,
            email,
            password,
            phone: ''
        };
        users.push(newUser);
        setCurrentUser({ name: username, email, phone: '', password });
        const shouldLaunchCreate = pendingCreateEvent;
        saveData();
        updateUserUI();
        closeEventModal();
        showNotification('¡Cuenta creada exitosamente!');
        // Dispatch event for tickets page
        window.dispatchEvent(new Event('userLoggedIn'));
        if (shouldLaunchCreate) {
            setTimeout(() => {
                window.location.href = 'evento.html';
            }, 300);
        } else {
            pendingCreateEvent = false;
        }
    } else {
        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;
        
        const user = users.find(u => u.email === email);
        if (!user) {
            showNotification('No encontramos una cuenta con ese email', 'error');
            return;
        }
        if (user.password !== password) {
            showNotification('La clave ingresada es incorrecta', 'error');
            return;
        }
        
        setCurrentUser({ name: user.username, email: user.email, phone: user.phone || '', password: user.password });
        const shouldLaunchCreate = pendingCreateEvent;
        saveData();
        updateUserUI();
        closeEventModal();
        showNotification(`¡Bienvenido/a ${user.username}!`);
        // Dispatch event for tickets page
        window.dispatchEvent(new Event('userLoggedIn'));
        if (shouldLaunchCreate) {
            setTimeout(() => {
                window.location.href = 'evento.html';
            }, 300);
        } else {
            pendingCreateEvent = false;
        }
    }
}

function switchAuthMode(mode) {
    showAuthModal(mode);
}

// Show Payment Modal
function showPaymentModal() {
    // Cerrar el carrito antes de mostrar el modal de pago
    closeCart();
    
    // Pequeño delay para asegurar que el carrito se cierre antes de mostrar el modal
    setTimeout(() => {
        const modal = document.getElementById('eventModal');
        const modalBody = document.getElementById('modalBody');
        
        const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
        const serviceCharge = subtotal * 0.10; // 10% cargo de servicio
        const total = subtotal + serviceCharge;
        
        modalBody.innerHTML = `
        <div class="event-detail-content" style="padding: 60px 40px;">
            <div style="text-align: center; margin-bottom: 32px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #00B894 0%, #00D2D3 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: white; font-size: 40px;">
                    <i class="fas fa-credit-card"></i>
                </div>
                <h2 style="margin-bottom: 8px;">Finalizar Compra</h2>
                <p style="color: var(--text-secondary);">Total a pagar: <strong style="color: var(--primary-color); font-size: 24px;">$${total.toFixed(2)}</strong></p>
            </div>
            
            <div style="background: var(--bg-color); padding: 20px; border-radius: 12px; margin-bottom: 24px;">
                <h4 style="margin-bottom: 12px;">Resumen de compra (${cart.length} entradas)</h4>
                ${cart.map(item => `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                        <span style="font-size: 14px;">${item.eventTitle} - ${item.ticketType}</span>
                        <span style="font-weight: 600;">$${item.price.toFixed(2)}</span>
                    </div>
                `).join('')}
                <div style="margin-top: 16px; padding-top: 16px; border-top: 2px solid rgba(0,0,0,0.1);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: var(--text-secondary);">
                        <span>Subtotal:</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: var(--text-secondary);">
                        <span>Cargo de servicio (10%):</span>
                        <span>$${serviceCharge.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 2px solid rgba(0,0,0,0.1); font-size: 18px; font-weight: 700; color: var(--primary-color);">
                        <span>Total:</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <form id="paymentForm" onsubmit="processPayment(event)" style="max-width: 500px; margin: 0 auto;">
                <!-- Selector de método de pago -->
                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 12px; font-weight: 600; font-size: 16px;">Método de Pago</label>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <label style="display: flex; align-items: center; gap: 12px; padding: 16px; border: 2px solid var(--border-color); border-radius: 12px; cursor: pointer; transition: all 0.3s; background: var(--input-bg);" id="paymentMethodCard" onclick="switchPaymentMethod('card')">
                            <input type="radio" name="paymentMethod" value="card" checked style="width: 20px; height: 20px; cursor: pointer;" onchange="switchPaymentMethod('card')">
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                    <i class="fas fa-credit-card" style="color: var(--primary-color); font-size: 20px;"></i>
                                    <span style="font-weight: 600;">Tarjeta</span>
                                </div>
                                <span style="font-size: 12px; color: var(--text-secondary);">Débito/Crédito</span>
                            </div>
                        </label>
                        <label style="display: flex; align-items: center; gap: 12px; padding: 16px; border: 2px solid var(--border-color); border-radius: 12px; cursor: pointer; transition: all 0.3s; background: var(--input-bg);" id="paymentMethodTransfer" onclick="switchPaymentMethod('transfer')">
                            <input type="radio" name="paymentMethod" value="transfer" style="width: 20px; height: 20px; cursor: pointer;" onchange="switchPaymentMethod('transfer')">
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                    <i class="fas fa-university" style="color: var(--secondary-color); font-size: 20px;"></i>
                                    <span style="font-weight: 600;">Transferencia</span>
                                </div>
                                <span style="font-size: 12px; color: var(--text-secondary);">Bancaria</span>
                            </div>
                        </label>
                    </div>
                </div>
                
                <!-- Formulario de Tarjeta -->
                <div id="cardPaymentForm">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">Número de Tarjeta</label>
                        <input type="text" id="cardNumber" name="cardNumber" pattern="[0-9]{16}" maxlength="16" style="width: 100%; padding: 14px; border: 2px solid var(--bg-color); border-radius: 8px; font-size: 16px; font-family: monospace; background: var(--input-bg); color: var(--text-primary);" placeholder="1234567812345678" onfocus="this.style.borderColor='var(--primary-color)'" onblur="this.style.borderColor='var(--bg-color)'">
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Fecha Expiración</label>
                            <input type="text" id="cardExpiry" name="cardExpiry" pattern="(0[1-9]|1[0-2])\/[0-9]{2}" maxlength="5" style="width: 100%; padding: 14px; border: 2px solid var(--bg-color); border-radius: 8px; font-size: 16px; font-family: monospace; background: var(--input-bg); color: var(--text-primary);" placeholder="MM/YY" onfocus="this.style.borderColor='var(--primary-color)'" onblur="this.style.borderColor='var(--bg-color)'">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">CVV</label>
                            <input type="text" id="cardCVV" name="cardCVV" pattern="[0-9]{3,4}" maxlength="4" style="width: 100%; padding: 14px; border: 2px solid var(--bg-color); border-radius: 8px; font-size: 16px; font-family: monospace; background: var(--input-bg); color: var(--text-primary);" placeholder="123" onfocus="this.style.borderColor='var(--primary-color)'" onblur="this.style.borderColor='var(--bg-color)'">
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">Nombre en la Tarjeta</label>
                        <input type="text" id="cardName" name="cardName" style="width: 100%; padding: 14px; border: 2px solid var(--bg-color); border-radius: 8px; font-size: 16px; background: var(--input-bg); color: var(--text-primary);" placeholder="JUAN PEREZ" onfocus="this.style.borderColor='var(--primary-color)'" onblur="this.style.borderColor='var(--bg-color)'">
                    </div>
                    
                    <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 24px; padding: 16px; background: #E8F5E9; border-radius: 8px;">
                        <i class="fas fa-lock" style="color: #00B894; font-size: 20px;"></i>
                        <span style="font-size: 14px; color: #2D3436;">Pago seguro encriptado SSL</span>
                    </div>
                </div>
                
                <!-- Formulario de Transferencia -->
                <div id="transferPaymentForm" style="display: none;">
                    <div style="background: var(--input-bg); padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 2px solid var(--secondary-color);">
                        <h4 style="margin-bottom: 16px; color: var(--secondary-color); display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-info-circle"></i>
                            Datos para Transferencia
                        </h4>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <div>
                                <span style="font-size: 12px; color: var(--text-secondary);">Banco:</span>
                                <p style="font-weight: 600; margin: 4px 0;">Banco Santander</p>
                            </div>
                            <div>
                                <span style="font-size: 12px; color: var(--text-secondary);">CBU/Alias:</span>
                                <p style="font-weight: 600; margin: 4px 0; font-family: monospace; font-size: 18px; color: var(--primary-color);">0000123456789012345678</p>
                            </div>
                            <div>
                                <span style="font-size: 12px; color: var(--text-secondary);">Titular:</span>
                                <p style="font-weight: 600; margin: 4px 0;">PassTo Eventos S.A.</p>
                            </div>
                            <div>
                                <span style="font-size: 12px; color: var(--text-secondary);">Monto a transferir:</span>
                                <p style="font-weight: 600; margin: 4px 0; font-size: 20px; color: var(--accent-vip);">$${total.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: #FFF3CD; padding: 16px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #FFC107;">
                        <div style="display: flex; gap: 12px; align-items: start;">
                            <i class="fas fa-exclamation-triangle" style="color: #FFC107; font-size: 20px; margin-top: 2px;"></i>
                            <div>
                                <p style="font-weight: 600; margin-bottom: 4px; color: #856404;">Importante</p>
                                <p style="font-size: 13px; color: #856404; margin: 0;">Una vez realizada la transferencia, sube el comprobante. Las entradas se activarán después de verificar el pago (puede tardar hasta 24 horas).</p>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">Número de Operación/Transacción</label>
                        <input type="text" id="transferNumber" name="transferNumber" style="width: 100%; padding: 14px; border: 2px solid var(--bg-color); border-radius: 8px; font-size: 16px; background: var(--input-bg); color: var(--text-primary);" placeholder="Ingresa el número de operación" onfocus="this.style.borderColor='var(--primary-color)'" onblur="this.style.borderColor='var(--bg-color)'">
                        <small style="display: block; margin-top: 6px; color: var(--text-secondary); font-size: 12px;">Este número aparece en el comprobante de transferencia</small>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">Comprobante de Transferencia (Opcional)</label>
                        <input type="file" id="transferReceipt" name="transferReceipt" accept="image/*,.pdf" style="width: 100%; padding: 14px; border: 2px solid var(--bg-color); border-radius: 8px; font-size: 14px; background: var(--input-bg); color: var(--text-primary); cursor: pointer;" onchange="handleReceiptUpload(event)">
                        <small style="display: block; margin-top: 6px; color: var(--text-secondary); font-size: 12px;">Sube una imagen o PDF del comprobante</small>
                        <div id="receiptPreview" style="margin-top: 12px; display: none;">
                            <img id="receiptPreviewImg" style="max-width: 100%; max-height: 200px; border-radius: 8px; border: 2px solid var(--border-color);" alt="Vista previa del comprobante">
                        </div>
                    </div>
                </div>
                
                <button type="submit" class="btn-primary" id="submitPaymentBtn" style="width: 100%; padding: 16px; font-size: 16px; background: var(--secondary-color);">
                    <i class="fas fa-lock"></i>
                    <span id="submitPaymentText">Pagar $${total.toFixed(2)}</span>
                </button>
                
                <button type="button" onclick="closeEventModal()" style="width: 100%; padding: 16px; font-size: 16px; background: transparent; border: 2px solid var(--bg-color); border-radius: 8px; margin-top: 12px; cursor: pointer; font-weight: 600; color: var(--text-secondary);">
                    Cancelar
                </button>
            </form>
        </div>
    `;
    
        modal.classList.add('active');
        // Asegurar que el modal esté por encima de todo
        modal.style.zIndex = '4000';
        
        // Inicializar el método de pago por defecto (tarjeta)
        setTimeout(() => {
            if (document.getElementById('cardPaymentForm')) {
                switchPaymentMethod('card');
            }
        }, 150);
    }, 100);
}

// Switch Payment Method
function switchPaymentMethod(method) {
    const cardForm = document.getElementById('cardPaymentForm');
    const transferForm = document.getElementById('transferPaymentForm');
    const cardRadio = document.querySelector('input[value="card"]');
    const transferRadio = document.querySelector('input[value="transfer"]');
    const cardLabel = document.getElementById('paymentMethodCard');
    const transferLabel = document.getElementById('paymentMethodTransfer');
    const submitBtn = document.getElementById('submitPaymentBtn');
    const submitText = document.getElementById('submitPaymentText');
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const serviceCharge = subtotal * 0.10; // 10% cargo de servicio
    const total = subtotal + serviceCharge;
    
    if (method === 'card') {
        cardForm.style.display = 'block';
        transferForm.style.display = 'none';
        cardRadio.checked = true;
        transferRadio.checked = false;
        cardLabel.style.borderColor = 'var(--primary-color)';
        cardLabel.style.background = 'rgba(44, 140, 251, 0.1)';
        transferLabel.style.borderColor = 'var(--border-color)';
        transferLabel.style.background = 'var(--input-bg)';
        
        // Hacer campos de tarjeta requeridos
        document.getElementById('cardNumber').required = true;
        document.getElementById('cardExpiry').required = true;
        document.getElementById('cardCVV').required = true;
        document.getElementById('cardName').required = true;
        
        // Hacer campos de transferencia no requeridos
        document.getElementById('transferNumber').required = false;
        document.getElementById('transferReceipt').required = false;
        
        submitText.textContent = `Pagar $${total.toFixed(2)}`;
    } else {
        cardForm.style.display = 'none';
        transferForm.style.display = 'block';
        cardRadio.checked = false;
        transferRadio.checked = true;
        transferLabel.style.borderColor = 'var(--secondary-color)';
        transferLabel.style.background = 'rgba(109, 203, 90, 0.1)';
        cardLabel.style.borderColor = 'var(--border-color)';
        cardLabel.style.background = 'var(--input-bg)';
        
        // Hacer campos de tarjeta no requeridos
        document.getElementById('cardNumber').required = false;
        document.getElementById('cardExpiry').required = false;
        document.getElementById('cardCVV').required = false;
        document.getElementById('cardName').required = false;
        
        // Hacer campos de transferencia requeridos
        document.getElementById('transferNumber').required = true;
        
        submitText.textContent = `Confirmar Transferencia $${total.toFixed(2)}`;
    }
}

// Handle Receipt Upload
function handleReceiptUpload(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('receiptPreview');
    const previewImg = document.getElementById('receiptPreviewImg');
    
    if (file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'application/pdf') {
            previewImg.style.display = 'none';
            preview.innerHTML = `
                <div style="padding: 20px; background: var(--input-bg); border-radius: 8px; text-align: center;">
                    <i class="fas fa-file-pdf" style="font-size: 48px; color: var(--primary-color); margin-bottom: 8px;"></i>
                    <p style="margin: 0; font-weight: 600;">${file.name}</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--text-secondary);">PDF cargado correctamente</p>
                </div>
            `;
            preview.style.display = 'block';
        }
    } else {
        preview.style.display = 'none';
    }
}

// Process Payment
function processPayment(event) {
    event.preventDefault();
    
    const form = event.target;
    const paymentMethod = form.querySelector('input[name="paymentMethod"]:checked').value;
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitText = document.getElementById('submitPaymentText');
    
    // Validar según el método de pago
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCVV = document.getElementById('cardCVV').value;
        const cardName = document.getElementById('cardName').value;
        
        if (!cardNumber || !cardExpiry || !cardCVV || !cardName) {
            showNotification('Por favor completa todos los datos de la tarjeta', 'error');
            return;
        }
        
        if (cardNumber.length !== 16) {
            showNotification('El número de tarjeta debe tener 16 dígitos', 'error');
            return;
        }
    } else if (paymentMethod === 'transfer') {
        const transferNumber = document.getElementById('transferNumber').value;
        
        if (!transferNumber) {
            showNotification('Por favor ingresa el número de operación', 'error');
            return;
        }
    }
    
    // Simulate payment processing
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        const paymentMethod = form.querySelector('input[name="paymentMethod"]:checked').value;
        let ticketStatus = 'active';
        let notificationMessage = '¡Compra realizada con éxito!';
        
        // Si es transferencia, las entradas quedan pendientes
        if (paymentMethod === 'transfer') {
            ticketStatus = 'pending';
            notificationMessage = '¡Solicitud de compra registrada! Las entradas se activarán una vez verificado el pago (puede tardar hasta 24 horas).';
        }
        
        // Payment successful - generate tickets
        const purchasedTickets = cart.map(item => ({
            ...item,
            ticketId: `TKT-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            purchaseDate: new Date().toISOString(),
            email: currentUser ? currentUser.email : null,
            userName: currentUser ? currentUser.name : null,
            qrData: null,
            status: ticketStatus,
            paymentMethod: paymentMethod,
            transferNumber: paymentMethod === 'transfer' ? document.getElementById('transferNumber').value : null
        }));
        
        myTickets.push(...purchasedTickets);
        setMyTickets(myTickets);
        
        // Actualizar contadores de ventas en los eventos (solo si el pago fue aprobado)
        if (paymentMethod === 'card') {
            updateEventSalesCounters(cart);
        }
        
        // Clear cart
        setCart([]);
        saveData();
        updateCart();
        closeCart();
        closeEventModal();
        
        showNotification(notificationMessage);
        
        // Dispatch event for tickets page
        window.dispatchEvent(new Event('ticketsUpdated'));
        
        // Redirigir a Mis Tickets después del pago
        setTimeout(() => {
            window.location.href = 'mistickets.html';
        }, 1500);
    }, 2000);
}

// Actualizar contadores de ventas en eventos
function updateEventSalesCounters(cartItems) {
    // Agrupar por evento y tipo de ticket
    const salesByEvent = {};
    
    cartItems.forEach(item => {
        const key = `${item.eventId}_${item.ticketType}`;
        if (!salesByEvent[key]) {
            salesByEvent[key] = {
                eventId: item.eventId,
                ticketType: item.ticketType,
                count: 0
            };
        }
        salesByEvent[key].count++;
    });
    
    // Actualizar en myEvents
    const myEvents = JSON.parse(localStorage.getItem('myEvents') || '[]');
    const allEvents = JSON.parse(localStorage.getItem('eventsData') || '[]');
    
    Object.values(salesByEvent).forEach(sale => {
        // Actualizar en myEvents
        const myEvent = myEvents.find(e => e.id === sale.eventId);
        if (myEvent && myEvent.tickets) {
            const ticket = myEvent.tickets.find(t => t.type === sale.ticketType);
            if (ticket) {
                ticket.sold = (ticket.sold || 0) + sale.count;
                ticket.available = ticket.quantity - ticket.sold;
            }
        }
        
        // Actualizar en allEvents
        const event = allEvents.find(e => e.id === sale.eventId);
        if (event && event.tickets) {
            const ticket = event.tickets.find(t => t.type === sale.ticketType);
            if (ticket) {
                ticket.sold = (ticket.sold || 0) + sale.count;
                ticket.available = ticket.quantity - ticket.sold;
            }
        }
        
        // Actualizar en window.eventsData
        if (window.eventsData) {
            const globalEvent = window.eventsData.find(e => e.id === sale.eventId);
            if (globalEvent && globalEvent.tickets) {
                const ticket = globalEvent.tickets.find(t => t.type === sale.ticketType);
                if (ticket) {
                    ticket.sold = (ticket.sold || 0) + sale.count;
                    ticket.available = ticket.quantity - ticket.sold;
                }
            }
        }
    });
    
    // Guardar cambios
    localStorage.setItem('myEvents', JSON.stringify(myEvents));
    localStorage.setItem('eventsData', JSON.stringify(allEvents));
}

// Show My Tickets Modal
function showMyTicketsModal() {
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('modalBody');
    
    if (myTickets.length === 0) {
        modalBody.innerHTML = `
            <div class="event-detail-content" style="padding: 60px 40px; text-align: center;">
                <div style="width: 80px; height: 80px; background: var(--bg-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: var(--text-secondary); font-size: 40px;">
                    <i class="fas fa-ticket"></i>
                </div>
                <h2 style="margin-bottom: 8px;">Sin Entradas</h2>
                <p style="color: var(--text-secondary); margin-bottom: 24px;">Aún no has comprado ninguna entrada.</p>
                <button class="btn-primary" onclick="closeEventModal()">
                    Explorar Eventos
                </button>
            </div>
        `;
    } else {
        modalBody.innerHTML = `
            <div class="event-detail-content" style="padding: 40px;">
                <h2 style="margin-bottom: 24px;">Mis Entradas (${myTickets.length})</h2>
                <div style="display: grid; gap: 16px;">
                    ${myTickets.map((ticket, index) => `
                        <div style="background: var(--bg-color); padding: 20px; border-radius: 12px; border-left: 4px solid var(--primary-color);">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                                <div>
                                    <h3 style="font-size: 18px; margin-bottom: 4px;">${ticket.eventTitle}</h3>
                                    <span style="display: inline-block; background: var(--primary-color); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${ticket.ticketType}</span>
                                </div>
                                <button onclick="viewTicketDetail(${index})" style="background: var(--primary-color); color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                                    <i class="fas fa-qrcode"></i>
                                    Ver QR
                                </button>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 14px; color: var(--text-secondary);">
                                <div><i class="far fa-calendar"></i> ${ticket.eventDate}</div>
                                <div><i class="far fa-clock"></i> ${ticket.eventTime}</div>
                                <div><i class="fas fa-map-marker-alt"></i> ${ticket.eventLocation}</div>
                                <div><i class="fas fa-barcode"></i> ${ticket.ticketId}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    modal.classList.add('active');
}

// View Ticket Detail with QR
function viewTicketDetail(ticketIndex) {
    const ticket = myTickets[ticketIndex];
    const modal = document.getElementById('ticketModal');
    const container = document.getElementById('ticketContainer');
    
    container.innerHTML = `
        <div class="ticket-success">
            <div class="success-icon">
                <i class="fas fa-check"></i>
            </div>
            <h3>${ticket.eventTitle}</h3>
            <p>Entrada Digital</p>
        </div>
        
        <div class="ticket-details">
            <div class="ticket-detail-row">
                <span>Tipo:</span>
                <span>${ticket.ticketType}</span>
            </div>
            <div class="ticket-detail-row">
                <span>Fecha:</span>
                <span>${ticket.eventDate}</span>
            </div>
            <div class="ticket-detail-row">
                <span>Hora:</span>
                <span>${ticket.eventTime}</span>
            </div>
            <div class="ticket-detail-row">
                <span>Lugar:</span>
                <span>${ticket.eventLocation}</span>
            </div>
            <div class="ticket-detail-row">
                <span>Precio:</span>
                <span>$${ticket.price.toFixed(2)}</span>
            </div>
            <div class="ticket-detail-row">
                <span>ID Ticket:</span>
                <span style="font-family: monospace; font-size: 12px;">${ticket.ticketId}</span>
            </div>
            <div class="ticket-detail-row">
                <span>Cliente:</span>
                <span>${currentUser.name}</span>
            </div>
        </div>
        
        <div class="qr-code-container" id="qrCode-${ticketIndex}"></div>
        <p class="qr-note">Presenta este código QR en la entrada del evento</p>
        
        <button class="btn-download-ticket" onclick="downloadTicket('${ticket.ticketId}', '${ticket.eventTitle}')">
            <i class="fas fa-download"></i>
            Descargar Entrada
        </button>
    `;
    
    // Generate QR Code
    setTimeout(() => {
        new QRCode(document.getElementById(`qrCode-${ticketIndex}`), {
            text: JSON.stringify({
                ticketId: ticket.ticketId,
                eventId: ticket.eventId,
                eventTitle: ticket.eventTitle,
                ticketType: ticket.ticketType,
                date: ticket.eventDate,
                time: ticket.eventTime,
                holder: currentUser.name,
                email: currentUser.email
            }),
            width: 200,
            height: 200,
            colorDark: "#6C5CE7",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }, 100);
    
    modal.classList.add('active');
}

// Download Ticket as Image
function downloadTicket(ticketId, eventTitle) {
    const ticketContainer = document.getElementById('ticketContainer');
    
    // Use html2canvas library if available, otherwise show notification
    if (typeof html2canvas !== 'undefined') {
        html2canvas(ticketContainer).then(canvas => {
            const link = document.createElement('a');
            link.download = `ticket-${ticketId}.png`;
            link.href = canvas.toDataURL();
            link.click();
            showNotification('Entrada descargada correctamente');
        });
    } else {
        // Fallback: copy ticket info to clipboard
        const ticketInfo = `
ENTRADA DIGITAL - PASSTO
========================
Evento: ${eventTitle}
ID: ${ticketId}
Cliente: ${currentUser.name}
Email: ${currentUser.email}
========================
        `;
        
        navigator.clipboard.writeText(ticketInfo).then(() => {
            showNotification('Información de la entrada copiada al portapapeles');
        }).catch(() => {
            showNotification('Para descargar, haz una captura de pantalla de este ticket');
        });
    }
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#6DCB5A' : type === 'error' ? '#ef4444' : '#2C8CFB';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: ${bgColor};
        color: #121212;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    notification.innerHTML = `<span style="font-size: 20px;">${icon}</span><span>${message}</span>`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Subscribe to Newsletter
function subscribeNewsletter() {
    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput.value.trim();
    
    if (!email) {
        showNotification('Por favor ingresa tu correo electrónico', 'error');
        return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Por favor ingresa un correo válido', 'error');
        return;
    }
    
    // Simular suscripción
    showNotification('¡Suscripción exitosa! Revisa tu correo.', 'success');
    emailInput.value = '';
}

// Hamburger Menu Functions
function setupHamburgerMenu() {
    const hamburgerMenuToggle = document.getElementById('hamburgerMenuToggle');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const hamburgerMenuOverlay = document.getElementById('hamburgerMenuOverlay');
    const hamburgerMenuClose = document.getElementById('hamburgerMenuClose');
    
    if (hamburgerMenuToggle) {
        hamburgerMenuToggle.addEventListener('click', openHamburgerMenu);
    }
    
    if (hamburgerMenuClose) {
        hamburgerMenuClose.addEventListener('click', closeHamburgerMenu);
    }
    
    if (hamburgerMenuOverlay) {
        hamburgerMenuOverlay.addEventListener('click', closeHamburgerMenu);
    }
    
    // Update hamburger menu UI
    updateHamburgerMenuUI();
}

function openHamburgerMenu() {
    const hamburgerMenuToggle = document.getElementById('hamburgerMenuToggle');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const hamburgerMenuOverlay = document.getElementById('hamburgerMenuOverlay');
    const body = document.body;
    
    if (hamburgerMenuToggle) hamburgerMenuToggle.classList.add('active');
    if (hamburgerMenu) hamburgerMenu.classList.add('active');
    if (hamburgerMenuOverlay) hamburgerMenuOverlay.classList.add('active');
    if (body) body.style.overflow = 'hidden';
}

function closeHamburgerMenu() {
    const hamburgerMenuToggle = document.getElementById('hamburgerMenuToggle');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const hamburgerMenuOverlay = document.getElementById('hamburgerMenuOverlay');
    const body = document.body;
    
    if (hamburgerMenuToggle) hamburgerMenuToggle.classList.remove('active');
    if (hamburgerMenu) hamburgerMenu.classList.remove('active');
    if (hamburgerMenuOverlay) hamburgerMenuOverlay.classList.remove('active');
    if (body) body.style.overflow = '';
}

function updateHamburgerMenuUI() {
    const hamburgerLoginText = document.getElementById('hamburgerLoginText');
    const hamburgerLoginItem = document.getElementById('hamburgerLoginItem');
    const hamburgerRegisterItem = document.getElementById('hamburgerRegisterItem');
    const hamburgerProfileItem = document.getElementById('hamburgerProfileItem');
    const hamburgerLogoutItem = document.getElementById('hamburgerLogoutItem');
    const hamburgerLogoutText = document.getElementById('hamburgerLogoutText');
    const hamburgerMisEventosItem = document.getElementById('hamburgerMisEventosItem');
    
    if (currentUser) {
        // Usuario logueado
        if (hamburgerLoginText) {
            hamburgerLoginText.textContent = currentUser.name || 'Mi Cuenta';
        }
        if (hamburgerLoginItem) {
            hamburgerLoginItem.style.display = 'block';
        }
        if (hamburgerRegisterItem) {
            hamburgerRegisterItem.style.display = 'none';
        }
        if (hamburgerProfileItem) {
            hamburgerProfileItem.style.display = 'block';
        }
        if (hamburgerLogoutItem) {
            hamburgerLogoutItem.style.display = 'block';
        }
        if (hamburgerLogoutText) {
            hamburgerLogoutText.textContent = 'Cerrar Sesión';
        }
        
        // Mostrar "Mis Eventos" si el usuario tiene eventos creados
        if (hamburgerMisEventosItem) {
            const myEvents = JSON.parse(localStorage.getItem('myEvents') || '[]');
            const userEvents = myEvents.filter(e => e.creatorId === currentUser.id || e.creatorId === currentUser.email);
            if (userEvents.length > 0) {
                hamburgerMisEventosItem.style.display = 'block';
            } else {
                hamburgerMisEventosItem.style.display = 'none';
            }
        }
    } else {
        // Usuario no logueado
        if (hamburgerLoginText) {
            hamburgerLoginText.textContent = 'Iniciar Sesión';
        }
        if (hamburgerLoginItem) {
            hamburgerLoginItem.style.display = 'block';
        }
        if (hamburgerRegisterItem) {
            hamburgerRegisterItem.style.display = 'block';
        }
        if (hamburgerProfileItem) {
            hamburgerProfileItem.style.display = 'none';
        }
        if (hamburgerLogoutItem) {
            hamburgerLogoutItem.style.display = 'none';
        }
        if (hamburgerMisEventosItem) {
            hamburgerMisEventosItem.style.display = 'none';
        }
    }
}

// Make hamburger menu functions available globally
window.openHamburgerMenu = openHamburgerMenu;
window.closeHamburgerMenu = closeHamburgerMenu;
window.updateHamburgerMenuUI = updateHamburgerMenuUI;

// Setup Event Listeners
function setupEventListeners() {
    // Modal Close
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalClose) modalClose.addEventListener('click', closeEventModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeEventModal);
    
    // Ticket Modal Close
    const ticketModalClose = document.getElementById('ticketModalClose');
    const ticketModalOverlay = document.getElementById('ticketModalOverlay');
    if (ticketModalClose) ticketModalClose.addEventListener('click', closeTicketModal);
    if (ticketModalOverlay) ticketModalOverlay.addEventListener('click', closeTicketModal);
    
    // Cart
    const cartBtn = document.getElementById('cartBtn');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
    if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
    
    // User Dropdown
    const userDropdownBtn = document.getElementById('userDropdownBtn');
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    if (userDropdownBtn && userDropdownMenu) {
        userDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentUser) {
                userDropdownMenu.classList.toggle('active');
            } else {
                showAuthModal('login');
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (userDropdownMenu && !userDropdownBtn.contains(e.target) && !userDropdownMenu.contains(e.target)) {
                userDropdownMenu.classList.remove('active');
            }
        });
        
        // Update logout text based on user state
        const logoutText = document.getElementById('logoutText');
        if (logoutText) {
            const updateLogoutText = () => {
                if (logoutText) {
                    logoutText.textContent = currentUser ? 'Cerrar Sesión' : 'Iniciar Sesión';
                }
            };
            updateLogoutText();
        }
    }
    
    // Notification Button
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            showNotification('No hay notificaciones nuevas', 'info');
        });
    }
    
    // Navigation Links
    const searchInput = document.getElementById('mainSearch');
    const categoryChips = document.querySelectorAll('.category-chip');
    const registerBtnElement = document.getElementById('registerBtn');
    
    if (registerBtnElement) {
        registerBtnElement.addEventListener('click', () => {
            startCreateEventFlow();
        });
    }

    // Create Event Button
    const createEventBtn = document.getElementById('createEventBtn');
    if (createEventBtn) {
        createEventBtn.addEventListener('click', startCreateEventFlow);
    }
    
    const setActiveCategoryChip = (category) => {
        categoryChips.forEach(c => c.classList.toggle('active', c.dataset.category === category));
    };
    
    // Función para obtener la página actual (hacer global)
    window.getCurrentPage = function() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        if (filename === 'index.html' || filename === '' || path.endsWith('/')) {
            return 'index';
        } else if (filename === 'historia.html') {
            return 'historia';
        } else if (filename === 'mis-eventos.html') {
            return 'mis-eventos';
        } else if (filename === 'mistickets.html' || filename === 'tickets.html') {
            return 'tickets';
        } else if (filename === 'evento.html') {
            return 'evento';
        }
        return 'index';
    };
    
    // Función para establecer el enlace activo basado en la página actual (hacer global)
    window.setActiveNavLink = function() {
        const currentPage = window.getCurrentPage();
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };
    
    // Establecer enlace activo al cargar la página
    window.setActiveNavLink();
    
    // Manejar clics en los enlaces de navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const text = link.textContent.trim();
            const href = link.getAttribute('href');
            const page = link.getAttribute('data-page');
            
            // Actualizar estado activo
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Manejar "Mis Tickets"
            if (text === 'Mis eTickets' || text === 'Mis Tickets' || page === 'tickets') {
                e.preventDefault();
                if (!currentUser) {
                    showAuthModal('login');
                } else {
                    window.location.href = 'mistickets.html';
                }
                return;
            }
            
            // Manejar "Mis Eventos"
            if (text === 'Mis Eventos' || page === 'mis-eventos') {
                e.preventDefault();
                if (!currentUser) {
                    showAuthModal('login');
                } else {
                    window.location.href = 'mis-eventos.html';
                }
                return;
            }
            
            // Manejar "Inicio"
            if (text === 'Inicio' || page === 'index') {
                // Si ya estamos en index.html, solo resetear filtros
                if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
                    e.preventDefault();
                    currentCategory = 'all';
                    currentSearchTerm = '';
                    if (searchInput) searchInput.value = '';
                    setActiveCategoryChip('all');
                    applyFilters();
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                // Si no, permitir navegación normal (href ya está configurado)
                return;
            }
            
            // Para otros enlaces con href válido, permitir navegación normal
            if (href && href !== '#' && href !== '') {
                // Permitir navegación normal
                return;
            }
            
            // Para enlaces con href="#", prevenir comportamiento por defecto
            e.preventDefault();
        });
    });
    
    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            categoryChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            
            currentCategory = chip.dataset.category;
            
            applyFilters();
            
            // Scroll to events section
            const eventsSection = document.querySelector('.events-section');
            if (eventsSection) {
                window.scrollTo({ top: eventsSection.offsetTop - 100, behavior: 'smooth' });
            }
        });
    });
    
}


// Show User Menu
function showUserMenu() {
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="event-detail-content" style="padding: 60px 40px;">
            <div style="text-align: center; margin-bottom: 32px;">
                <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: white; font-size: 48px;">
                    <i class="fas fa-user-circle"></i>
                </div>
                <h2 style="margin-bottom: 8px;">${currentUser.name}</h2>
                <p style="color: var(--text-secondary);">${currentUser.email}</p>
            </div>
            
            <div style="max-width: 400px; margin: 0 auto; display: grid; gap: 12px;">
                <button onclick="showUserProfile()" class="btn-primary" style="width: 100%; padding: 16px; justify-content: center; background: var(--text-secondary);">
                    <i class="fas fa-user-edit"></i>
                    Editar Perfil
                </button>
                
                <button onclick="logout()" style="width: 100%; padding: 16px; background: transparent; border: 2px solid var(--accent-color); border-radius: 8px; cursor: pointer; font-weight: 600; color: var(--accent-color); display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fas fa-sign-out-alt"></i>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// Show User Profile
function showUserProfile() {
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="event-detail-content" style="padding: 60px 40px;">
            <h2 style="margin-bottom: 24px; text-align: center;">Mi Perfil</h2>
            
            <form id="profileForm" onsubmit="updateProfile(event)" style="max-width: 400px; margin: 0 auto;">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Nombre Completo</label>
                    <input type="text" id="profileName" value="${currentUser.name || ''}" required style="width: 100%; padding: 14px; border: 2px solid var(--bg-color); border-radius: 8px; font-size: 16px;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Email</label>
                    <input type="email" id="profileEmail" value="${currentUser.email || ''}" required style="width: 100%; padding: 14px; border: 2px solid var(--bg-color); border-radius: 8px; font-size: 16px;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Teléfono</label>
                    <input type="tel" id="profilePhone" value="${currentUser.phone || ''}" style="width: 100%; padding: 14px; border: 2px solid var(--bg-color); border-radius: 8px; font-size: 16px;">
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 24px;">
                    <button type="button" onclick="showUserMenu()" style="padding: 16px; background: transparent; border: 2px solid var(--bg-color); border-radius: 8px; cursor: pointer; font-weight: 600; color: var(--text-secondary);">
                        Cancelar
                    </button>
                    <button type="submit" class="btn-primary" style="padding: 16px; justify-content: center;">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    `;
    
    modal.classList.add('active');
}

// Update Profile
function updateProfile(event) {
    event.preventDefault();
    
    const previousEmail = currentUser.email;
    const name = document.getElementById('profileName').value.trim();
    const email = document.getElementById('profileEmail').value.trim().toLowerCase();
    const phone = document.getElementById('profilePhone').value.trim();
    
    if (!name || !email) {
        showNotification('El nombre y el email son obligatorios', 'error');
        return;
    }
    
    const userIndex = users.findIndex(user => user.email === previousEmail);
    const emailTaken = users.some((user, index) => user.email === email && index !== userIndex);
    if (emailTaken) {
        showNotification('Ya existe una cuenta con ese email', 'error');
        return;
    }
    
    const password = userIndex !== -1 ? users[userIndex].password : (currentUser.password || '');
    
    currentUser.name = name;
    currentUser.email = email;
    currentUser.phone = phone;
    currentUser.password = password;
    
    if (userIndex !== -1) {
        users[userIndex] = {
            ...users[userIndex],
            username: name,
            email,
            phone,
            password
        };
    } else {
        users.push({ username: name, email, password, phone });
    }
    
    saveData();
    updateUserUI();
    closeEventModal();
    showNotification('Perfil actualizado correctamente');
}

// Logout
function logout() {
    setCurrentUser(null);
    setCart([]);
    // Don't clear myTickets on logout, keep them for the user
    // setMyTickets([]);
    pendingCreateEvent = false;
    saveData();
    updateUserUI();
    updateCart();
    closeEventModal();
    showNotification('Sesión cerrada correctamente');
    
    // Reset to home
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    if (document.querySelector('.nav-link')) {
        document.querySelector('.nav-link').classList.add('active');
    }
    
    // Redirect to home if on tickets page
    if (window.location.pathname.includes('mistickets.html')) {
        window.location.href = 'index.html';
    }
}

// Modal Functions
function closeEventModal() {
    const modal = document.getElementById('eventModal');
    modal.classList.remove('active');
    // Restaurar z-index por defecto
    modal.style.zIndex = '';
    
    // Si hay una entrada en el historial para el modal, reemplazarla con la entrada actual (sin modal)
    if (window.history && window.history.state && window.history.state.modalOpen) {
        window.history.replaceState({ modalOpen: false }, '', window.location.href);
    }
}

function closeTicketModal() {
    document.getElementById('ticketModal').classList.remove('active');
}

function openCart() {
    document.getElementById('cartSidebar').classList.add('active');
    document.getElementById('cartOverlay').classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scroll
}

function startCreateEventFlow() {
    if (currentUser) {
        // Redirigir a la página de creación de eventos
        window.location.href = 'evento.html';
    } else {
        pendingCreateEvent = true;
        showAuthModal('login');
    }
}

function showCreateEventPrompt() {
    pendingCreateEvent = false;
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="event-detail-content" style="padding: 60px 40px; text-align: center;">
            <div style="width: 90px; height: 90px; margin: 0 auto 24px; border-radius: 24px; background: linear-gradient(135deg, rgba(44, 140, 251, 0.2) 0%, rgba(109, 203, 90, 0.2) 100%); display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-calendar-plus" style="font-size: 42px; color: var(--secondary-color);"></i>
            </div>
            <h2 style="font-size: 32px; margin-bottom: 12px;">Crea tu evento</h2>
            <p style="color: var(--text-secondary); font-size: 16px; margin-bottom: 24px;">¡Bienvenido al sistema PassTo!</p>
            <h3 style="font-size: 20px; margin-bottom: 32px;">¿Qué tipo de evento querés crear?</h3>
            <div style="display: flex; justify-content: center;">
                <button class="btn-primary" style="padding: 16px 28px; font-size: 16px;" onclick="handleCreateEventType('presencial')">
                    <i class="fas fa-users"></i>
                    Evento presencial
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function handleCreateEventType(type) {
    if (type === 'presencial') {
        showCreateEventForm(type);
    } else {
        showNotification(`Pronto habilitaremos la creación de eventos ${type}.`, 'info');
        closeEventModal();
    }
}

function showCreateEventForm(eventType) {
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="event-detail-content" style="padding: 40px;">
            <h2 style="margin-bottom: 8px;">Crea tu evento</h2>
            <p style="color: var(--text-secondary); margin-bottom: 24px;">Completa la siguiente información para registrar tu evento presencial.</p>
            <form id="createEventForm" class="create-event-form" data-event-type="${eventType}" onsubmit="submitEventCreation(event)">
                <div class="form-group">
                    <label for="eventTitle">Título del evento <span>(máx. 35 caracteres)</span></label>
                    <input type="text" id="eventTitle" name="eventTitle" maxlength="35" required placeholder="Ej: Festival PassTo">
                </div>
                <div class="form-group">
                    <label for="eventVisibility">Tipo de evento</label>
                    <select id="eventVisibility" name="eventVisibility" required>
                        <option value="">Selecciona una opción</option>
                        <option value="public">Público</option>
                        <option value="private">Privado</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="eventInfo">Información complementaria</label>
                    <textarea id="eventInfo" name="eventInfo" rows="4" placeholder="Describe beneficios, actividades, experiencias... (opcional)"></textarea>
                </div>
                <div class="form-group">
                    <label for="eventImage">Imagen del evento <span>(800x800 · JPG o PNG · máx. 4 MB)</span></label>
                    <input type="file" id="eventImage" name="eventImage" accept="image/png, image/jpeg">
                    <p class="form-hint">*Si no agregas una imagen, el evento se creará de forma exitosa, pero no aparecerá en la página principal de la plataforma hasta que no tenga una imagen cargada. Esto podría afectar el posicionamiento y las ventas de tu evento. Siempre recomendamos cargar una.</p>
                </div>
                <div class="form-group checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="ageRestriction" onchange="toggleAgeRestriction(this)">
                        <span>Habilitar restricción de edad</span>
                    </label>
                    <div class="age-select" id="ageRestrictionSelect" style="display:none;">
                        <label for="minAge">Selecciona la edad mínima</label>
                        <select id="minAge" name="minAge">
                            ${Array.from({length: 11}, (_, i) => 10 + i).map(age => `<option value="${age}">${age} años</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-group checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="termsCheckbox" required>
                        <span>Acepto los términos y condiciones de PassTo</span>
                    </label>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="showCreateEventPrompt()">Volver</button>
                    <button type="submit" class="btn-primary">Crear evento</button>
                </div>
            </form>
        </div>
    `;
    
    modal.classList.add('active');
}

function toggleAgeRestriction(checkbox) {
    const selectWrapper = document.getElementById('ageRestrictionSelect');
    if (!selectWrapper) return;
    selectWrapper.style.display = checkbox.checked ? 'block' : 'none';
}

async function submitEventCreation(event) {
    event.preventDefault();
    const form = event.target;
    const title = form.eventTitle.value.trim();
    const visibility = form.eventVisibility.value;
    const info = form.eventInfo.value.trim();
    const imageInput = form.eventImage;
    const ageCheckbox = document.getElementById('ageRestriction');
    const minAgeSelect = document.getElementById('minAge');
    
    if (!title) {
        showNotification('El título del evento es obligatorio', 'error');
        return;
    }
    if (title.length > 35) {
        showNotification('El título no puede exceder 35 caracteres', 'error');
        return;
    }
    if (!visibility) {
        showNotification('Selecciona el tipo de evento', 'error');
        return;
    }
    
    const file = imageInput.files[0];
    if (file) {
        const validType = ['image/png', 'image/jpeg'].includes(file.type);
        if (!validType) {
            showNotification('La imagen debe ser JPG o PNG', 'error');
            return;
        }
        if (file.size > 4 * 1024 * 1024) {
            showNotification('La imagen no debe superar los 4 MB', 'error');
            return;
        }
        const validDimensions = await validateImageDimensions(file, 800, 800);
        if (!validDimensions) {
            showNotification('La imagen debe tener un tamaño de 800x800 px', 'error');
            return;
        }
    }
    
    let minAge = null;
    if (ageCheckbox && ageCheckbox.checked) {
        minAge = minAgeSelect.value;
    }
    
    if (!document.getElementById('termsCheckbox').checked) {
        showNotification('Debes aceptar los términos y condiciones', 'error');
        return;
    }
    
    // Simular creación de evento
    pendingCreateEvent = false;
    showNotification('¡Evento creado correctamente!');
    closeEventModal();
}

function validateImageDimensions(file, requiredWidth, requiredHeight) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                resolve(img.width === requiredWidth && img.height === requiredHeight);
            };
            img.onerror = () => resolve(false);
            img.src = e.target.result;
        };
        reader.onerror = () => resolve(false);
        reader.readAsDataURL(file);
    });
}

// Banner Carousel Functions
let currentBannerSlide = 0;
let bannerSlides = [];

// Render Banner Carousel with Events
function renderBannerCarousel() {
    const bannerCarousel = document.getElementById('bannerCarousel');
    if (!bannerCarousel) return;
    
    // Get featured events (first 5 events or events with badge)
    const featuredEvents = eventsData
        .filter(event => event.badge || event.id <= 5)
        .slice(0, 5);
    
    if (featuredEvents.length === 0) {
        bannerCarousel.innerHTML = '<div class="banner-slide active"><div class="banner-image" style="background-image: url(\'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=600&fit=crop\');"></div><div class="banner-overlay"></div></div>';
        bannerSlides = document.querySelectorAll('.banner-slide');
        return;
    }
    
    bannerCarousel.innerHTML = featuredEvents.map((event, index) => {
        // Format date for banner: "23 Nov. 2026"
        const formatBannerDate = (dateString) => {
            if (!dateString) return '';
            
            const months = {
                'enero': 'Ene.', 'febrero': 'Feb.', 'marzo': 'Mar.', 'abril': 'Abr.',
                'mayo': 'May.', 'junio': 'Jun.', 'julio': 'Jul.', 'agosto': 'Ago.',
                'septiembre': 'Sep.', 'octubre': 'Oct.', 'noviembre': 'Nov.', 'diciembre': 'Dic.'
            };
            
            // Parse date from string format like "25 Abril del 2026" or "14/15/16 de Noviembre del 2025"
            const parts = dateString.toLowerCase().split(' ');
            let day = null;
            let month = null;
            let year = null;
            
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i].replace(/[^\d]/g, '');
                if (part && !day && parseInt(part) <= 31) {
                    day = parseInt(part);
                }
                if (months[parts[i]] !== undefined) {
                    month = months[parts[i]];
                } else if (parts[i] === 'de' && i + 1 < parts.length && months[parts[i + 1]] !== undefined) {
                    month = months[parts[i + 1]];
                }
                if (part && part.length === 4 && parseInt(part) >= 2020) {
                    year = parseInt(part);
                }
            }
            
            // If we have multiple days (e.g., "14/15/16"), take the first one
            if (day && month && year) {
                return `${day} ${month} ${year}`;
            }
            
            // Fallback: return original date if parsing fails
            return dateString;
        };
        
        const formattedDate = formatBannerDate(event.date);
        
        return `
            <div class="banner-slide ${index === 0 ? 'active' : ''}" data-event-id="${event.id}">
                <div class="banner-image" style="background-image: url('${event.image}');"></div>
                <div class="banner-overlay"></div>
                <div class="container">
                    <div class="banner-content">
                        <div class="banner-left">
                            <div class="banner-logo">
                                ${event.badge ? `<div class="banner-badge">${event.badge}</div>` : ''}
                                <h1 class="banner-title">${event.title.toUpperCase()}</h1>
                            </div>
                            <div class="banner-artists">
                                <span>${event.description.substring(0, 80)}${event.description.length > 80 ? '...' : ''}</span>
                            </div>
                        </div>
                        <div class="banner-right">
                            <div class="banner-date-location">
                                <div class="banner-date">${formattedDate}</div>
                                <div class="banner-location">${event.location.toUpperCase()}</div>
                            </div>
                        </div>
                    </div>
                    <div class="banner-footer">
                        <button class="banner-cta-btn" onclick="openEventModal(${event.id})">
                            <i class="fas fa-ticket"></i>
                            Ver Detalles
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Update bannerSlides reference
    bannerSlides = document.querySelectorAll('.banner-slide');
    
    // Auto-rotate carousel every 5 seconds
    if (bannerSlides.length > 1) {
        setInterval(() => {
            changeBannerSlide(1);
        }, 5000);
    }
}

function changeBannerSlide(direction) {
    if (bannerSlides.length === 0) {
        bannerSlides = document.querySelectorAll('.banner-slide');
    }
    
    if (bannerSlides.length === 0) return;
    
    bannerSlides[currentBannerSlide].classList.remove('active');
    currentBannerSlide = (currentBannerSlide + direction + bannerSlides.length) % bannerSlides.length;
    bannerSlides[currentBannerSlide].classList.add('active');
}

// Search Function
function performSearch() {
    const searchInput = document.getElementById('mainSearch');
    const provinceFilter = document.getElementById('provinceFilter');
    const localityFilter = document.getElementById('localityFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    if (searchInput) {
        currentSearchTerm = searchInput.value.trim();
    }
    
    if (provinceFilter) {
        currentProvince = provinceFilter.value;
    }
    
    if (localityFilter) {
        currentLocality = localityFilter.value;
    }
    
    if (dateFilter) {
        currentDateFilter = dateFilter.value;
    }
    
    // Apply filters
    applyFilters();
    
    // Scroll to events section
    const eventsSection = document.querySelector('.events-section');
    if (eventsSection) {
        window.scrollTo({ top: eventsSection.offsetTop - 100, behavior: 'smooth' });
    }
}

// Clear Search Function
function clearSearch() {
    const searchInput = document.getElementById('mainSearch');
    const provinceFilter = document.getElementById('provinceFilter');
    const localityFilter = document.getElementById('localityFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    // Clear all filter values
    currentSearchTerm = '';
    currentProvince = '';
    currentLocality = '';
    currentDateFilter = '';
    currentCategory = 'all';
    
    // Reset form inputs
    if (searchInput) {
        searchInput.value = '';
    }
    if (provinceFilter) {
        provinceFilter.value = '';
    }
    if (localityFilter) {
        localityFilter.value = '';
    }
    if (dateFilter) {
        dateFilter.value = '';
    }
    
    // Reset category chips
    const categoryChips = document.querySelectorAll('.category-chip');
    categoryChips.forEach(chip => {
        chip.classList.remove('active');
        if (chip.dataset.category === 'all') {
            chip.classList.add('active');
        }
    });
    
    // Apply filters (will show all events)
    applyFilters();
    
    // Scroll to events section
    const eventsSection = document.querySelector('.events-section');
    if (eventsSection) {
        window.scrollTo({ top: eventsSection.offsetTop - 100, behavior: 'smooth' });
    }
}

// Apply Filters Function (moved outside to be globally accessible)
function applyFilters() {
    let filteredData = eventsData;
    
    // Filter by category
    if (currentCategory !== 'all') {
        filteredData = filteredData.filter(event => event.category === currentCategory);
    }
    
    // Filter by locality
    if (currentLocality) {
        filteredData = filteredData.filter(event => 
            event.locality && event.locality.toLowerCase() === currentLocality.toLowerCase()
        );
    }
    
    // Filter by province (if needed in the future)
    if (currentProvince) {
        // For now, all events are in Chaco, but this can be expanded
        filteredData = filteredData.filter(event => {
            // You can add a province field to events if needed
            return true; // Placeholder
        });
    }
    
    // Filter by date
    if (currentDateFilter) {
        const today = new Date();
        filteredData = filteredData.filter(event => {
            // Parse date from string format like "25 Abril del 2026"
            const eventDate = parseEventDateForFilter(event.date);
            if (!eventDate) return true; // If date can't be parsed, include it
            
            switch(currentDateFilter) {
                case 'today':
                    return eventDate.toDateString() === today.toDateString();
                case 'week':
                    const weekFromNow = new Date(today);
                    weekFromNow.setDate(today.getDate() + 7);
                    return eventDate >= today && eventDate <= weekFromNow;
                case 'month':
                    const monthFromNow = new Date(today);
                    monthFromNow.setMonth(today.getMonth() + 1);
                    return eventDate >= today && eventDate <= monthFromNow;
                default:
                    return true;
            }
        });
    }
    
    // Filter by search term
    if (currentSearchTerm) {
        const searchTermLower = currentSearchTerm.toLowerCase();
        filteredData = filteredData.filter(event =>
            event.title.toLowerCase().includes(searchTermLower) ||
            event.location.toLowerCase().includes(searchTermLower) ||
            (event.locality && event.locality.toLowerCase().includes(searchTermLower))
        );
    }
    
    renderEvents(filteredData);
    
    // Update section title
    if (currentSearchTerm) {
        setSectionTitle(`Resultados para "${currentSearchTerm}"`);
    } else if (currentLocality) {
        setSectionTitle(`Eventos en ${currentLocality}`);
    } else {
        setSectionTitle(categoryLabels[currentCategory] || categoryLabels.all);
    }
}

// Helper function to parse event dates
function parseEventDateForFilter(dateString) {
    if (!dateString) return null;
    
    // Handle formats like "25 Abril del 2026" or "14/15/16 de Noviembre del 2025"
    const months = {
        'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
        'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11,
        'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
        'jul': 6, 'ago': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
    };
    
    // Try to extract date from string
    const parts = dateString.toLowerCase().split(' ');
    let day = null;
    let month = null;
    let year = null;
    
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i].replace(/[^\d]/g, '');
        if (part && !day && parseInt(part) <= 31) {
            day = parseInt(part);
        }
        if (months[parts[i]] !== undefined) {
            month = months[parts[i]];
        }
        if (part && part.length === 4 && parseInt(part) >= 2020) {
            year = parseInt(part);
        }
    }
    
    if (day && month !== null && year) {
        return new Date(year, month, day);
    }
    
    return null;
}

// Setup filter listeners
function setupFilterListeners() {
    const localityFilter = document.getElementById('localityFilter');
    const provinceFilter = document.getElementById('provinceFilter');
    const dateFilter = document.getElementById('dateFilter');
    const searchInput = document.getElementById('mainSearch');
    
    if (localityFilter) {
        localityFilter.addEventListener('change', (e) => {
            currentLocality = e.target.value;
            applyFilters();
        });
    }
    
    if (provinceFilter) {
        provinceFilter.addEventListener('change', (e) => {
            currentProvince = e.target.value;
            applyFilters();
        });
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', (e) => {
            currentDateFilter = e.target.value;
            applyFilters();
        });
    }
    
    if (searchInput) {
        // Listen for input changes (real-time search)
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.trim();
            applyFilters();
        });
        
        // Also listen for Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                currentSearchTerm = e.target.value.trim();
                applyFilters();
            }
        });
    }
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

