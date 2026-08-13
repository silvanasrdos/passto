// Página de administración de eventos

let myEvents = [];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    checkUserAuth();
    loadMyEvents();
    setupEventListeners();
    
    // Establecer enlace activo en la navbar
    if (typeof window.setActiveNavLink === 'function') {
        window.setActiveNavLink();
    }
});

// Verificar autenticación
function checkUserAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
        showNotification('Debes iniciar sesión para ver tus eventos', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }
    
    // Mostrar nombre de usuario
    const userNameEl = document.getElementById('userName');
    if (userNameEl) {
        userNameEl.textContent = currentUser.name || currentUser.email || 'Usuario';
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
    
    // Cerrar modal
    const closeBtn = document.getElementById('eventDetailsClose');
    const overlay = document.getElementById('eventDetailsOverlay');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeEventDetailsModal);
    }
    if (overlay) {
        overlay.addEventListener('click', closeEventDetailsModal);
    }
    
    // Escuchar cambios en localStorage
    window.addEventListener('storage', function(e) {
        if (e.key === 'myEvents' || e.key === 'currentUser') {
            loadMyEvents();
        }
    });
}

// Cargar eventos del usuario
function loadMyEvents() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) return;
    
    const allEvents = JSON.parse(localStorage.getItem('myEvents') || '[]');
    myEvents = allEvents.filter(e => 
        e.creatorId === currentUser.id || 
        e.creatorId === currentUser.email ||
        (currentUser.email && e.creatorId && e.creatorId.toString() === currentUser.email)
    );
    
    renderStats();
    renderEvents();
}

// Renderizar estadísticas
function renderStats() {
    const statsGrid = document.getElementById('statsGrid');
    if (!statsGrid) return;
    
    const totalEvents = myEvents.length;
    const activeEvents = myEvents.filter(e => {
        const endDate = new Date(e.endDate);
        return endDate > new Date() && e.status === 'active';
    }).length;
    
    let totalTicketsSold = 0;
    let totalRevenue = 0;
    
    myEvents.forEach(event => {
        if (event.tickets) {
            event.tickets.forEach(ticket => {
                const sold = ticket.sold || 0;
                totalTicketsSold += sold;
                totalRevenue += sold * ticket.price;
            });
        }
    });
    
    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon" style="background: rgba(44, 140, 251, 0.2); color: var(--primary-color);">
                <i class="fas fa-calendar"></i>
            </div>
            <div class="stat-content">
                <h3>${totalEvents}</h3>
                <p>Total de Eventos</p>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon" style="background: rgba(109, 203, 90, 0.2); color: var(--secondary-color);">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-content">
                <h3>${activeEvents}</h3>
                <p>Eventos Activos</p>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon" style="background: rgba(245, 185, 66, 0.2); color: var(--accent-vip);">
                <i class="fas fa-ticket-alt"></i>
            </div>
            <div class="stat-content">
                <h3>${totalTicketsSold}</h3>
                <p>Entradas Vendidas</p>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon" style="background: rgba(109, 203, 90, 0.2); color: var(--secondary-color);">
                <i class="fas fa-dollar-sign"></i>
            </div>
            <div class="stat-content">
                <h3>$${totalRevenue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                <p>Ingresos Totales</p>
            </div>
        </div>
    `;
}

// Renderizar lista de eventos
function renderEvents() {
    const eventsList = document.getElementById('myEventsList');
    const emptyState = document.getElementById('emptyEvents');
    
    if (!eventsList) return;
    
    if (myEvents.length === 0) {
        eventsList.innerHTML = '';
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        return;
    }
    
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    eventsList.innerHTML = myEvents.map(event => {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        const isActive = endDate > new Date() && event.status === 'active';
        
        // Calcular estadísticas del evento
        let totalSold = 0;
        let totalAvailable = 0;
        let totalRevenue = 0;
        
        if (event.tickets) {
            event.tickets.forEach(ticket => {
                totalSold += ticket.sold || 0;
                totalAvailable += ticket.quantity || 0;
                totalRevenue += (ticket.sold || 0) * ticket.price;
            });
        }
        
        const soldPercentage = totalAvailable > 0 ? (totalSold / totalAvailable * 100).toFixed(1) : 0;
        
        return `
            <div class="my-event-card" data-event-id="${event.id}">
                <div class="event-card-image">
                    <img src="${event.image || 'img/default-event.png'}" alt="${event.title}">
                    <span class="event-status ${isActive ? 'active' : 'inactive'}">
                        ${isActive ? 'Activo' : 'Finalizado'}
                    </span>
                </div>
                <div class="event-card-content">
                    <div class="event-card-header">
                        <h3>${event.title}</h3>
                        <div class="event-card-actions">
                            <button class="btn-icon btn-edit" onclick="editEvent(${event.id})" title="Editar evento">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon btn-delete" onclick="deleteEvent(${event.id})" title="Eliminar evento">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button class="btn-icon" onclick="viewEventDetails(${event.id})" title="Ver detalles">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div class="event-card-info">
                        <div class="info-item">
                            <i class="fas fa-calendar"></i>
                            <span>${event.date} • ${event.time}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}, ${event.locality}</span>
                        </div>
                    </div>
                    <div class="event-card-stats">
                        <div class="stat-item">
                            <span class="stat-label">Vendidas</span>
                            <span class="stat-value">${totalSold} / ${totalAvailable}</span>
                            <span class="stat-subtitle">${totalAvailable - totalSold} disponibles</span>
                        </div>
                        <div class="stat-item stat-progress">
                            <span class="stat-label">Progreso de Ventas</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${soldPercentage}%"></div>
                            </div>
                            <span class="stat-percentage">${soldPercentage}% vendido</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Ingresos Totales</span>
                            <span class="stat-value revenue">$${totalRevenue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Ver detalles del evento
function viewEventDetails(eventId) {
    const event = myEvents.find(e => e.id === eventId);
    if (!event) return;
    
    const modal = document.getElementById('eventDetailsModal');
    const modalBody = document.getElementById('eventDetailsBody');
    
    if (!modal || !modalBody) return;
    
    // Calcular estadísticas detalladas
    let totalSold = 0;
    let totalAvailable = 0;
    let totalRevenue = 0;
    const ticketStats = [];
    
    if (event.tickets) {
        event.tickets.forEach(ticket => {
            const sold = ticket.sold || 0;
            const available = ticket.quantity || 0;
            const revenue = sold * ticket.price;
            totalSold += sold;
            totalAvailable += available;
            totalRevenue += revenue;
            
            ticketStats.push({
                type: ticket.type,
                price: ticket.price,
                sold: sold,
                available: available,
                revenue: revenue
            });
        });
    }
    
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const isActive = endDate > new Date() && event.status === 'active';
    
    modalBody.innerHTML = `
        <div class="event-details-content">
            <div class="event-details-header">
                <img src="${event.image || 'img/default-event.png'}" alt="${event.title}" class="event-details-image">
                <div class="event-details-title">
                    <h2>${event.title}</h2>
                    <span class="event-status-badge ${isActive ? 'active' : 'inactive'}">
                        ${isActive ? 'Activo' : 'Finalizado'}
                    </span>
                </div>
            </div>
            
            <div class="event-details-section">
                <h3><i class="fas fa-info-circle"></i> Información del Evento</h3>
                <div class="details-grid">
                    <div class="detail-item">
                        <label>Fecha de Inicio</label>
                        <span>${formatDateTime(startDate)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Fecha de Fin</label>
                        <span>${formatDateTime(endDate)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Ubicación</label>
                        <span>${event.location}, ${event.locality}, ${event.province}</span>
                    </div>
                    <div class="detail-item">
                        <label>Categoría</label>
                        <span>${getCategoryLabel(event.category)}</span>
                    </div>
                    ${event.mainArtists ? `
                    <div class="detail-item">
                        <label>Artistas Principales</label>
                        <span>${event.mainArtists}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="detail-item full-width">
                    <label>Descripción</label>
                    <p>${event.description || 'Sin descripción'}</p>
                </div>
            </div>
            
            <div class="event-details-section">
                <h3><i class="fas fa-chart-bar"></i> Estadísticas de Ventas</h3>
                <div class="stats-summary">
                    <div class="stat-summary-item">
                        <span class="stat-label">Total Vendidas</span>
                        <span class="stat-value-large">${totalSold} / ${totalAvailable}</span>
                        <span class="stat-subtitle">${totalAvailable - totalSold} disponibles</span>
                    </div>
                    <div class="stat-summary-item">
                        <span class="stat-label">Progreso de Ventas</span>
                        <div class="progress-bar" style="margin: 8px 0;">
                            <div class="progress-fill" style="width: ${totalAvailable > 0 ? (totalSold / totalAvailable * 100) : 0}%"></div>
                        </div>
                        <span class="stat-percentage">${totalAvailable > 0 ? ((totalSold / totalAvailable * 100).toFixed(1)) : 0}% vendido</span>
                    </div>
                    <div class="stat-summary-item">
                        <span class="stat-label">Ingresos Totales</span>
                        <span class="stat-value-large revenue">$${totalRevenue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                </div>
                
                <h4 style="margin-top: 24px; margin-bottom: 16px;">Detalle por Tipo de Entrada</h4>
                <div class="ticket-stats-table">
                    ${ticketStats.map(ticket => {
                        const ticketPercentage = ticket.available > 0 ? ((ticket.sold / ticket.available) * 100).toFixed(1) : 0;
                        return `
                        <div class="ticket-stat-row">
                            <div class="ticket-stat-info">
                                <span class="ticket-type">${ticket.type}</span>
                                <span class="ticket-price">$${ticket.price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u</span>
                            </div>
                            <div class="ticket-stat-numbers">
                                <div style="margin-bottom: 8px;">
                                    <span style="font-weight: 600;">${ticket.sold} / ${ticket.available} vendidas</span>
                                    <span style="color: var(--text-secondary); font-size: 12px; margin-left: 8px;">(${ticketPercentage}%)</span>
                                </div>
                                <div class="progress-bar" style="height: 6px; margin: 4px 0;">
                                    <div class="progress-fill" style="width: ${ticketPercentage}%"></div>
                                </div>
                                <span class="ticket-revenue" style="margin-top: 4px; display: block;">$${ticket.revenue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// Cerrar modal de detalles
function closeEventDetailsModal() {
    const modal = document.getElementById('eventDetailsModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Formatear fecha y hora
function formatDateTime(date) {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} de ${month} de ${year} a las ${hours}:${minutes}`;
}

// Obtener etiqueta de categoría
function getCategoryLabel(category) {
    const labels = {
        'music': 'Música',
        'sports': 'Deportes',
        'theater': 'Teatro',
        'conference': 'Conferencias',
        'art': 'Arte'
    };
    return labels[category] || category;
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        alert(message);
    }
}

// Editar evento
function editEvent(eventId) {
    const event = myEvents.find(e => e.id === eventId);
    if (!event) {
        showNotification('Evento no encontrado', 'error');
        return;
    }
    
    // Guardar el ID del evento a editar en sessionStorage
    sessionStorage.setItem('editingEventId', eventId);
    
    // Redirigir a la página de creación/edición
    window.location.href = 'evento.html';
}

// Eliminar evento
function deleteEvent(eventId) {
    const event = myEvents.find(e => e.id === eventId);
    if (!event) {
        showNotification('Evento no encontrado', 'error');
        return;
    }
    
    // Confirmar eliminación
    const confirmMessage = `¿Estás seguro de que deseas eliminar el evento "${event.title}"?\n\nEsta acción marcará todos los tickets relacionados como cancelados.\n\nEsta acción no se puede deshacer.`;
    if (!confirm(confirmMessage)) {
        return;
    }
    
    try {
        // Marcar tickets relacionados como cancelados
        markEventTicketsAsCancelled(eventId, event.title);
        
        // Eliminar de myEvents
        const allMyEvents = JSON.parse(localStorage.getItem('myEvents') || '[]');
        const updatedMyEvents = allMyEvents.filter(e => e.id !== eventId);
        localStorage.setItem('myEvents', JSON.stringify(updatedMyEvents));
        
        // Eliminar de eventsData
        const allEvents = JSON.parse(localStorage.getItem('eventsData') || '[]');
        const updatedEvents = allEvents.filter(e => e.id !== eventId);
        localStorage.setItem('eventsData', JSON.stringify(updatedEvents));
        
        // Actualizar window.eventsData si existe
        if (window.eventsData) {
            const index = window.eventsData.findIndex(e => e.id === eventId);
            if (index !== -1) {
                window.eventsData.splice(index, 1);
            }
        }
        
        showNotification('Evento eliminado correctamente. Los tickets relacionados han sido marcados como cancelados.', 'success');
        
        // Dispatch events para actualizar la página de tickets si está abierta
        window.dispatchEvent(new Event('ticketsUpdated'));
        window.dispatchEvent(new Event('eventDeleted'));
        
        // Recargar la lista de eventos
        loadMyEvents();
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        showNotification('Error al eliminar el evento', 'error');
    }
}

// Marcar tickets de un evento como cancelados
function markEventTicketsAsCancelled(eventId, eventTitle) {
    const allTickets = JSON.parse(localStorage.getItem('myTickets') || '[]');
    let cancelledCount = 0;
    
    const updatedTickets = allTickets.map(ticket => {
        // Verificar si el ticket pertenece al evento eliminado
        if (ticket.eventId === eventId || ticket.eventId === parseInt(eventId)) {
            // Marcar como cancelado
            ticket.status = 'cancelled';
            ticket.cancelledDate = new Date().toISOString();
            ticket.cancelledReason = `Evento "${eventTitle}" fue eliminado`;
            cancelledCount++;
        }
        return ticket;
    });
    
    // Guardar tickets actualizados
    localStorage.setItem('myTickets', JSON.stringify(updatedTickets));
    
    // Actualizar window.myTickets si existe
    if (window.myTickets) {
        window.myTickets = updatedTickets;
    }
    
    // Sincronizar con script.js si existe
    if (typeof window.setMyTickets === 'function') {
        window.setMyTickets(updatedTickets);
    }
    
    console.log(`Se marcaron ${cancelledCount} tickets como cancelados para el evento ${eventTitle}`);
}

// Hacer funciones disponibles globalmente
window.viewEventDetails = viewEventDetails;
window.editEvent = editEvent;
window.deleteEvent = deleteEvent;

