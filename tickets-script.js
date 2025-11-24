// Tickets Page Script
// Use global variables from script.js - don't redeclare them
// They will be declared in script.js or we'll use window.currentUser

// Load data from localStorage - Always load directly from localStorage for reliability
function loadTicketsData() {
    // Always load from localStorage first (most reliable)
    const savedUser = localStorage.getItem('currentUser');
    const savedTickets = localStorage.getItem('myTickets');
    
    // Use window.currentUser instead of declaring a new variable
    if (savedUser) {
        try {
            window.currentUser = JSON.parse(savedUser);
            // Sync with script.js if it's loaded
            if (typeof window.setCurrentUser === 'function') {
                window.setCurrentUser(window.currentUser);
            }
        } catch (e) {
            console.error('Error parsing currentUser:', e);
            window.currentUser = null;
        }
    } else {
        window.currentUser = null;
    }
    
    if (savedTickets) {
        try {
            window.myTickets = JSON.parse(savedTickets);
            // Sync with script.js if it's loaded
            if (typeof window.setMyTickets === 'function') {
                window.setMyTickets(window.myTickets);
            }
        } catch (e) {
            console.error('Error parsing myTickets:', e);
            window.myTickets = [];
            if (typeof window.setMyTickets === 'function') {
                window.setMyTickets([]);
            }
        }
    } else {
        window.myTickets = [];
    }
    
    // Debug: log to see what we have
    console.log('=== TICKETS PAGE DATA LOAD ===');
    console.log('Loaded user:', window.currentUser);
    console.log('Loaded tickets count:', window.myTickets.length);
    console.log('All tickets:', window.myTickets);
}

// Update User UI
function updateTicketsUserUI() {
    console.log('=== UPDATING TICKETS USER UI ===');
    
    const userNameEl = document.getElementById('userName');
    const userDropdown = document.getElementById('userDropdown');
    const loginRequired = document.getElementById('loginRequired');
    const ticketsContent = document.getElementById('ticketsContent');
    const logoutText = document.getElementById('logoutText');
    const cartBadge = document.getElementById('cartBadge');
    
    // Always reload currentUser from localStorage to ensure we have the latest
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            const parsedUser = JSON.parse(savedUser);
            window.currentUser = parsedUser;
            console.log('✓ User reloaded from localStorage:', parsedUser);
        } catch (e) {
            console.error('✗ Error parsing currentUser in updateTicketsUserUI:', e);
            window.currentUser = null;
        }
    } else {
        console.log('✗ No user in localStorage');
        window.currentUser = null;
    }
    
    const currentUser = window.currentUser;
    console.log('Current user state:', currentUser);
    
    if (currentUser && currentUser.name) {
        console.log('✓ Setting UI for logged in user:', currentUser.name);
        
        if (userNameEl) {
            const displayName = currentUser.name.length > 10 
                ? currentUser.name.substring(0, 10) + '...' 
                : currentUser.name;
            userNameEl.textContent = displayName;
            console.log('✓ User name set to:', displayName);
        }
        
        if (userDropdown) {
            userDropdown.style.display = 'block';
        }
        
        if (loginRequired) {
            loginRequired.style.display = 'none';
            console.log('✓ Login required hidden');
        }
        
        if (ticketsContent) {
            ticketsContent.style.display = 'block';
            console.log('✓ Tickets content shown');
        }
        
        if (logoutText) {
            logoutText.textContent = 'Cerrar Sesión';
        }
    } else {
        console.log('✗ Setting UI for logged out user');
        
        if (userNameEl) {
            userNameEl.textContent = 'Iniciar Sesión';
        }
        
        if (userDropdown) {
            userDropdown.style.display = 'block';
        }
        
        if (loginRequired) {
            loginRequired.style.display = 'flex';
            console.log('✓ Login required shown');
        }
        
        if (ticketsContent) {
            ticketsContent.style.display = 'none';
            console.log('✓ Tickets content hidden');
        }
        
        if (logoutText) {
            logoutText.textContent = 'Iniciar Sesión';
        }
    }
    
    // Update cart badge if available
    if (cartBadge) {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const cart = JSON.parse(savedCart);
                cartBadge.textContent = cart.length || 0;
            } catch (e) {
                cartBadge.textContent = '0';
            }
        } else {
            cartBadge.textContent = '0';
        }
    }
}

// Parse date from event date string (format: "15 Mar 2025")
function parseEventDate(dateString) {
    const months = {
        'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
        'jul': 6, 'ago': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
    };
    
    const parts = dateString.trim().split(' ');
    if (parts.length >= 3) {
        const day = parseInt(parts[0]);
        const month = months[parts[1].toLowerCase()];
        const year = parseInt(parts[2]);
        
        if (month !== undefined && !isNaN(day) && !isNaN(year)) {
            return new Date(year, month, day);
        }
    }
    
    return null;
}

// Check if event is past
function isEventPast(eventDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventDateObj = parseEventDate(eventDate);
    if (!eventDateObj) return false;
    
    eventDateObj.setHours(0, 0, 0, 0);
    return eventDateObj < today;
}

// Filter tickets by user
function getUserTickets() {
    const currentUser = window.currentUser;
    const myTickets = window.myTickets || [];
    
    if (!currentUser) {
        console.log('No currentUser in getUserTickets');
        return [];
    }
    
    console.log('Filtering tickets for user:', currentUser.email);
    console.log('Total tickets:', myTickets.length);
    
    // Filter by email if available, otherwise by userName
    const filtered = myTickets.filter(ticket => {
        if (ticket.email) {
            const matches = ticket.email.toLowerCase() === currentUser.email.toLowerCase();
            if (matches) {
                console.log('Found matching ticket:', ticket.eventTitle, 'by email');
            }
            return matches;
        }
        // Fallback: check if ticket has userName and matches
        if (ticket.userName) {
            const matches = ticket.userName.toLowerCase() === currentUser.name.toLowerCase();
            if (matches) {
                console.log('Found matching ticket:', ticket.eventTitle, 'by userName');
            }
            return matches;
        }
        // If no email or userName, include it (for backwards compatibility)
        console.log('Ticket without email/userName:', ticket.eventTitle);
        return true;
    });
    
    console.log('Filtered tickets count:', filtered.length);
    return filtered;
}

// Render Tickets
function renderTickets() {
    const userTickets = getUserTickets();
    
    // Separate tickets by status: cancelled, past, and upcoming
    const cancelledTickets = [];
    const upcomingTickets = [];
    const pastTickets = [];
    
    userTickets.forEach(ticket => {
        // Primero verificar si está cancelado
        if (ticket.status === 'cancelled') {
            cancelledTickets.push(ticket);
        } else {
            // Si no está cancelado, verificar si es pasado o futuro
            const isPast = isEventPast(ticket.eventDate);
            if (isPast) {
                pastTickets.push(ticket);
            } else {
                upcomingTickets.push(ticket);
            }
        }
    });
    
    // Update counts
    const upcomingCount = document.getElementById('upcomingCount');
    const pastCount = document.getElementById('pastCount');
    const cancelledCount = document.getElementById('cancelledCount');
    
    if (upcomingCount) upcomingCount.textContent = upcomingTickets.length;
    if (pastCount) pastCount.textContent = pastTickets.length;
    if (cancelledCount) cancelledCount.textContent = cancelledTickets.length;
    
    // Render sections
    renderTicketSection('upcomingTickets', upcomingTickets, false, false);
    renderTicketSection('pastTickets', pastTickets, true, false);
    renderTicketSection('cancelledTickets', cancelledTickets, false, true);
    
    // Show/hide empty states
    const emptyUpcoming = document.getElementById('emptyUpcoming');
    const emptyPast = document.getElementById('emptyPast');
    const emptyCancelled = document.getElementById('emptyCancelled');
    
    if (emptyUpcoming) {
        emptyUpcoming.style.display = upcomingTickets.length === 0 ? 'block' : 'none';
    }
    if (emptyPast) {
        emptyPast.style.display = pastTickets.length === 0 ? 'block' : 'none';
    }
    if (emptyCancelled) {
        emptyCancelled.style.display = cancelledTickets.length === 0 ? 'block' : 'none';
    }
    
    // Show/hide cancelled section
    const cancelledSection = document.getElementById('cancelledSection');
    if (cancelledSection) {
        cancelledSection.style.display = cancelledTickets.length > 0 ? 'block' : 'none';
    }
}

// Render Ticket Section
function renderTicketSection(containerId, tickets, isPast, isCancelled) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (tickets.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    // Get event image from eventsData
    const eventsData = window.eventsData || [];
    
    container.innerHTML = tickets.map(ticket => {
        const event = eventsData.find(e => e.id === ticket.eventId);
        const eventImage = event ? event.image : 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop';
        
        // Determinar el estado del ticket
        const ticketStatus = isCancelled ? 'cancelled' : (isPast ? 'past' : 'upcoming');
        const statusText = isCancelled ? 'Cancelado' : (isPast ? 'Finalizado' : 'Próximo');
        const statusReason = ticket.cancelledReason || '';
        
        return `
            <div class="ticket-card ${ticketStatus}" onclick="viewTicketDetail('${ticket.ticketId}')">
                <div class="ticket-image-wrapper">
                    <img src="${eventImage}" alt="${ticket.eventTitle}" class="ticket-image ${isCancelled ? 'cancelled-overlay' : ''}">
                    <span class="ticket-status-badge ${ticketStatus}">
                        ${statusText}
                    </span>
                </div>
                <div class="ticket-info">
                    <h3 class="ticket-event-title">${ticket.eventTitle}</h3>
                    ${isCancelled && statusReason ? `
                    <div class="ticket-cancelled-notice">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>${statusReason}</span>
                    </div>
                    ` : ''}
                    <div class="ticket-details">
                        <div class="ticket-detail-item">
                            <i class="far fa-calendar"></i>
                            <span>${ticket.eventDate}</span>
                        </div>
                        <div class="ticket-detail-item">
                            <i class="far fa-clock"></i>
                            <span>${ticket.eventTime}</span>
                        </div>
                        <div class="ticket-detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${ticket.eventLocation}</span>
                        </div>
                    </div>
                    <div class="ticket-footer">
                        <span class="ticket-type">${ticket.ticketType}</span>
                        <span class="ticket-price">$${ticket.price.toFixed(2)}</span>
                    </div>
                    <div class="ticket-actions">
                        <button class="btn-view-ticket ${ticketStatus}" onclick="event.stopPropagation(); viewTicketDetail('${ticket.ticketId}')" ${isCancelled ? 'disabled' : ''}>
                            <i class="fas fa-qrcode"></i>
                            ${isCancelled ? 'Ticket Cancelado' : 'Ver Ticket'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// View Ticket Detail
function viewTicketDetail(ticketId) {
    const myTickets = window.myTickets || [];
    const ticket = myTickets.find(t => t.ticketId === ticketId);
    if (!ticket) {
        // Store ticket ID to view and redirect to index
        sessionStorage.setItem('viewTicketId', ticketId);
        window.location.href = 'index.html';
        return;
    }
    
    // Show ticket modal
    showTicketModal(ticket);
}

// Show Ticket Modal
function showTicketModal(ticket) {
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) {
        console.error('Modal elements not found');
        return;
    }
    
    // Format date and time
    const eventDate = ticket.eventDate || 'Fecha no disponible';
    const eventTime = ticket.eventTime || 'Hora no disponible';
    const isCancelled = ticket.status === 'cancelled';
    const cancelledReason = ticket.cancelledReason || '';
    
    modalBody.innerHTML = `
        <div class="ticket-modal-wrapper">
            <div class="ticket-modal-header" style="${isCancelled ? 'background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);' : ''}">
                <div class="ticket-modal-logo">
                    <img src="logoopassto.svg" alt="PassTo Logo" class="ticket-logo-img">
                    <span class="ticket-logo-text">PassTo<sup></sup></span>
                </div>
                ${isCancelled ? `
                <div style="margin-top: 16px; padding: 12px; background: rgba(255, 255, 255, 0.2); border-radius: 8px; text-align: center;">
                    <i class="fas fa-ban" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                    <span style="font-weight: 700; font-size: 16px;">TICKET CANCELADO</span>
                </div>
                ` : ''}
            </div>
            
            <div class="ticket-modal-content">
                <div class="ticket-info-section">
                    <h2 class="ticket-event-title-modal">${ticket.eventTitle}</h2>
                    ${isCancelled && cancelledReason ? `
                    <div class="ticket-cancelled-notice" style="margin-bottom: 20px; max-width: 100%;">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>${cancelledReason}</span>
                    </div>
                    ` : ''}
                    <div class="ticket-details-modal">
                        <div class="ticket-detail-row-modal">
                            <i class="far fa-calendar"></i>
                            <span>${eventDate}</span>
                        </div>
                        <div class="ticket-detail-row-modal">
                            <i class="far fa-clock"></i>
                            <span>${eventTime}</span>
                        </div>
                        <div class="ticket-detail-row-modal">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${ticket.eventLocation}</span>
                        </div>
                        <div class="ticket-detail-row-modal">
                            <i class="fas fa-ticket"></i>
                            <span>${ticket.ticketType}</span>
                        </div>
                    </div>
                </div>
                
                <div class="ticket-qr-section" style="${isCancelled ? 'opacity: 0.5; pointer-events: none;' : ''}">
                    ${isCancelled ? `
                    <div style="text-align: center; padding: 40px; background: rgba(255, 68, 68, 0.1); border-radius: 12px; border: 2px dashed #ff4444;">
                        <i class="fas fa-ban" style="font-size: 64px; color: #ff4444; margin-bottom: 16px;"></i>
                        <h3 style="color: #ff4444; margin-bottom: 8px;">Ticket Cancelado</h3>
                        <p style="color: var(--text-secondary);">Este ticket ya no es válido</p>
                    </div>
                    ` : `
                    <div class="qr-container">
                        <img src="img/QR.png" alt="Código QR" class="qr-image">
                    </div>
                    <p class="qr-message">
                        <i class="fas fa-info-circle"></i>
                        La entrada estará disponible hasta la fecha y hora del evento
                    </p>
                    `}
                </div>
            </div>
            
            <div class="ticket-modal-footer">
                <button class="btn-close-ticket-modal" onclick="closeTicketModal()">
                    <i class="fas fa-times"></i>
                    Cerrar
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// Close Ticket Modal
function closeTicketModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Function to initialize tickets page
    function initializeTicketsPage() {
        console.log('=== INITIALIZING TICKETS PAGE ===');
        
        // Load data from localStorage
        loadTicketsData();
        
        // Update UI immediately with loaded data
        updateTicketsUserUI();
        
        // Also update the main UI if script.js functions are available
        if (typeof window.updateUserUI === 'function') {
            window.updateUserUI();
        }
        
        if (typeof window.updateCart === 'function') {
            window.updateCart();
        }
        
        // Render tickets if user is logged in
        if (window.currentUser) {
            console.log('✓ User is logged in, rendering tickets...');
            renderTickets();
        } else {
            console.log('✗ No user found - showing login required');
        }
    }
    
    // Initialize immediately - don't wait for script.js
    // We load directly from localStorage which is the source of truth
    initializeTicketsPage();
    
    // Setup mobile menu (if function is available from script.js)
    if (typeof window.setupMobileMenu === 'function') {
        window.setupMobileMenu();
    } else if (typeof setupMobileMenu === 'function') {
        setupMobileMenu();
    }
    
    // Setup event listeners
    const userDropdownBtn = document.getElementById('userDropdownBtn');
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    
    // Modal close handlers
    if (modalClose) {
        modalClose.addEventListener('click', closeTicketModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeTicketModal);
    }
    
    if (userDropdownBtn && userDropdownMenu) {
        userDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.currentUser) {
                userDropdownMenu.classList.toggle('active');
            } else {
                if (typeof showAuthModal !== 'undefined') {
                    showAuthModal('login');
                } else {
                    // Redirect to index.html if functions not available
                    window.location.href = 'index.html';
                }
            }
        });
        
        document.addEventListener('click', (e) => {
            if (userDropdownMenu && !userDropdownBtn.contains(e.target) && !userDropdownMenu.contains(e.target)) {
                userDropdownMenu.classList.remove('active');
            }
        });
    }
    
    // Listen for storage changes (when user logs in from another tab or same tab)
    window.addEventListener('storage', (e) => {
        if (e.key === 'currentUser' || e.key === 'myTickets') {
            console.log('Storage changed:', e.key);
            loadTicketsData();
            updateTicketsUserUI();
            if (window.currentUser) {
                renderTickets();
            }
        }
    });
    
    // Also listen for custom events (for same-tab updates)
    window.addEventListener('userLoggedIn', () => {
        console.log('User logged in event received');
        loadTicketsData();
        updateTicketsUserUI();
        if (window.currentUser) {
            renderTickets();
        }
    });
    
    window.addEventListener('ticketsUpdated', () => {
        console.log('Tickets updated event received');
        loadTicketsData();
        if (window.currentUser) {
            renderTickets();
        }
    });
    
    // Escuchar cuando se elimina un evento
    window.addEventListener('eventDeleted', () => {
        console.log('Event deleted event received');
        loadTicketsData();
        if (window.currentUser) {
            renderTickets();
        }
    });
});

// Make functions available globally
window.viewTicketDetail = viewTicketDetail;
window.showTicketModal = showTicketModal;
window.closeTicketModal = closeTicketModal;

