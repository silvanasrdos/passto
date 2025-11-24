// Estado del formulario
let ticketTypeCounter = 0;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    checkUserAuth();
    
    // Verificar si estamos editando un evento
    const editingEventId = sessionStorage.getItem('editingEventId');
    if (editingEventId) {
        loadEventForEditing(editingEventId);
        sessionStorage.removeItem('editingEventId');
    } else {
        initializeForm();
    }
    
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
        showNotification('Debes iniciar sesión para crear un evento', 'error');
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
    
    // Mostrar enlace "Mis Eventos" si el usuario tiene eventos
    checkAndShowMisEventos();
}

// Verificar y mostrar enlace "Mis Eventos"
function checkAndShowMisEventos() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) return;
    
    const myEvents = JSON.parse(localStorage.getItem('myEvents') || '[]');
    const userEvents = myEvents.filter(e => e.creatorId === currentUser.id);
    
    const misEventosLink = document.getElementById('misEventosLink');
    if (misEventosLink && userEvents.length > 0) {
        misEventosLink.style.display = 'block';
    }
}

// Cargar evento para edición
function loadEventForEditing(eventId) {
    const allEvents = JSON.parse(localStorage.getItem('myEvents') || '[]');
    const event = allEvents.find(e => e.id === parseInt(eventId));
    
    if (!event) {
        showNotification('Evento no encontrado', 'error');
        setTimeout(() => {
            window.location.href = 'mis-eventos.html';
        }, 2000);
        return;
    }
    
    // Cambiar título de la página
    const header = document.getElementById('formTitle');
    if (header) {
        header.innerHTML = '<i class="fas fa-edit"></i> Editar Evento';
    }
    
    const subtitle = document.getElementById('formSubtitle');
    if (subtitle) {
        subtitle.textContent = 'Modifica la información de tu evento';
    }
    
    // Llenar campos básicos del formulario
    const eventNameInput = document.getElementById('eventName');
    if (eventNameInput) eventNameInput.value = event.title || '';
    
    const eventTypeSelect = document.getElementById('eventType');
    if (eventTypeSelect) eventTypeSelect.value = event.type || '';
    
    const eventCategorySelect = document.getElementById('eventCategory');
    if (eventCategorySelect) eventCategorySelect.value = event.category || '';
    
    const mainArtistsInput = document.getElementById('mainArtists');
    if (mainArtistsInput) mainArtistsInput.value = event.mainArtists || '';
    
    const eventDescriptionTextarea = document.getElementById('eventDescription');
    if (eventDescriptionTextarea) eventDescriptionTextarea.value = event.description || '';
    
    // Fechas
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    if (event.startDate && startDateInput) {
        const startDate = new Date(event.startDate);
        startDateInput.value = formatDateTimeLocal(startDate);
    }
    if (event.endDate && endDateInput) {
        const endDate = new Date(event.endDate);
        endDateInput.value = formatDateTimeLocal(endDate);
    }
    
    // Ubicación
    const provinceSelect = document.getElementById('province');
    if (provinceSelect) provinceSelect.value = event.province || '';
    
    const localitySelect = document.getElementById('locality');
    if (localitySelect) localitySelect.value = event.locality || '';
    
    const venueInput = document.getElementById('venue');
    if (venueInput) venueInput.value = event.location || '';
    
    // Video
    const eventVideoInput = document.getElementById('eventVideo');
    if (eventVideoInput) {
        eventVideoInput.value = event.video || '';
    }
    
    // eTickets
    const eticketWebCheckbox = document.getElementById('eticketWeb');
    if (eticketWebCheckbox) {
        eticketWebCheckbox.checked = event.eticketWeb !== false;
    }
    
    const eticketEmailCheckbox = document.getElementById('eticketEmail');
    if (eticketEmailCheckbox) {
        eticketEmailCheckbox.checked = event.eticketEmail !== false;
    }
    
    // Restricción de edad
    const ageRestrictionCheckbox = document.getElementById('ageRestriction');
    const ageSelectWrapper = document.getElementById('ageSelectWrapper');
    const minAgeSelect = document.getElementById('minAge');
    
    if (event.minAge) {
        if (ageRestrictionCheckbox) {
            ageRestrictionCheckbox.checked = true;
        }
        if (ageSelectWrapper) {
            ageSelectWrapper.style.display = 'block';
        }
        if (minAgeSelect) {
            minAgeSelect.value = event.minAge;
        }
    } else {
        if (ageRestrictionCheckbox) {
            ageRestrictionCheckbox.checked = false;
        }
        if (ageSelectWrapper) {
            ageSelectWrapper.style.display = 'none';
        }
    }
    
    // Cargar fotos del evento si existen
    const photoPreview = document.getElementById('photoPreview');
    if (photoPreview && event.photos && event.photos.length > 0) {
        photoPreview.innerHTML = '';
        event.photos.forEach(photoUrl => {
            if (photoUrl) {
                const img = document.createElement('img');
                img.src = photoUrl;
                img.className = 'preview-photo';
                img.alt = 'Foto del evento';
                photoPreview.appendChild(img);
            }
        });
    }
    
    // Limpiar tipos de entrada existentes
    const container = document.getElementById('ticketTypesContainer');
    if (container) {
        container.innerHTML = '';
        ticketTypeCounter = 0;
    }
    
    // Cargar tipos de entrada
    if (event.tickets && event.tickets.length > 0) {
        event.tickets.forEach((ticket, ticketIndex) => {
            addTicketType();
            const index = ticketTypeCounter;
            
            // Llenar datos del ticket
            const typeSelect = document.querySelector(`select[name="ticketType_${index}"]`);
            const priceInput = document.querySelector(`input[name="ticketPrice_${index}"]`);
            const descTextarea = document.querySelector(`textarea[name="ticketDescription_${index}"]`);
            const qtyInput = document.querySelector(`input[name="ticketQuantity_${index}"]`);
            const limitInput = document.querySelector(`input[name="ticketSaleLimit_${index}"]`);
            const ticketImageInput = document.querySelector(`input[name="ticketImage_${index}"]`);
            const ticketPreview = document.getElementById(`ticketPreview_${index}`);
            
            if (typeSelect) typeSelect.value = ticket.type || '';
            if (priceInput) priceInput.value = ticket.price || 0;
            if (descTextarea) descTextarea.value = ticket.description || '';
            if (qtyInput) qtyInput.value = ticket.quantity || 0;
            if (limitInput && ticket.saleLimit) {
                const limitDate = new Date(ticket.saleLimit);
                limitInput.value = formatDateTimeLocal(limitDate);
            }
            
            // Cargar imagen del ticket si existe
            if (ticket.image && ticketPreview) {
                const img = document.createElement('img');
                img.src = ticket.image;
                img.className = 'preview-ticket-image';
                img.alt = `Imagen de ticket ${ticket.type}`;
                ticketPreview.innerHTML = '';
                ticketPreview.appendChild(img);
            }
        });
    } else {
        addTicketType();
    }
    
    // Guardar ID del evento para actualización
    const form = document.getElementById('createEventForm');
    if (form) {
        form.dataset.eventId = eventId;
    }
    
    // Cambiar texto del botón de submit
    const submitBtn = document.querySelector('.form-actions .btn-primary');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
    }
    
    // Inicializar el resto del formulario
    initializeForm();
}

// Formatear fecha para input datetime-local
function formatDateTimeLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Inicializar formulario
function initializeForm() {
    // Solo agregar tipo de entrada si no hay ninguno
    const container = document.getElementById('ticketTypesContainer');
    if (container && container.children.length === 0) {
        addTicketType();
    }
    
    // Configurar restricción de edad
    const ageCheckbox = document.getElementById('ageRestriction');
    const ageSelectWrapper = document.getElementById('ageSelectWrapper');
    
    if (ageCheckbox && ageSelectWrapper) {
        ageCheckbox.addEventListener('change', function() {
            ageSelectWrapper.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    // Configurar preview de fotos
    const photoInput = document.getElementById('eventPhotos');
    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoPreview);
    }
    
    // Configurar validación de fechas
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    if (startDate && endDate) {
        startDate.addEventListener('change', function() {
            if (endDate.value && new Date(this.value) >= new Date(endDate.value)) {
                showNotification('La fecha de fin debe ser posterior a la fecha de inicio', 'error');
                this.value = '';
            }
        });
        
        endDate.addEventListener('change', function() {
            if (startDate.value && new Date(this.value) <= new Date(startDate.value)) {
                showNotification('La fecha de fin debe ser posterior a la fecha de inicio', 'error');
                this.value = '';
            }
        });
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Botón agregar tipo de entrada
    const addTicketTypeBtn = document.getElementById('addTicketTypeBtn');
    if (addTicketTypeBtn) {
        addTicketTypeBtn.addEventListener('click', addTicketType);
    }
    
    // Submit del formulario
    const form = document.getElementById('createEventForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Botón crear evento del header
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            window.location.href = 'evento.html';
        });
    }
}

// Agregar tipo de entrada
function addTicketType() {
    ticketTypeCounter++;
    const container = document.getElementById('ticketTypesContainer');
    if (!container) return;
    
    const ticketTypeDiv = document.createElement('div');
    ticketTypeDiv.className = 'ticket-type-item';
    ticketTypeDiv.dataset.ticketIndex = ticketTypeCounter;
    
    ticketTypeDiv.innerHTML = `
        <div class="ticket-type-header">
            <h3>Tipo de Entrada ${ticketTypeCounter}</h3>
            ${ticketTypeCounter > 1 ? '<button type="button" class="btn-remove-ticket" onclick="removeTicketType(this)"><i class="fas fa-times"></i></button>' : ''}
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label>Tipo de Entrada <span class="required">*</span></label>
                <select name="ticketType_${ticketTypeCounter}" required>
                    <option value="">Selecciona un tipo</option>
                    <option value="General">General</option>
                    <option value="VIP">VIP</option>
                    <option value="Familiar">Familiar</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Precio <span class="required">*</span></label>
                <input type="number" name="ticketPrice_${ticketTypeCounter}" step="0.01" min="0" required placeholder="0.00">
            </div>
        </div>
        
        <div class="form-group">
            <label>Descripción <span class="required">*</span></label>
            <textarea name="ticketDescription_${ticketTypeCounter}" rows="3" required placeholder="Describe los beneficios de este tipo de entrada"></textarea>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label>Cantidad Disponible <span class="required">*</span></label>
                <input type="number" name="ticketQuantity_${ticketTypeCounter}" min="1" required placeholder="100">
            </div>
            
            <div class="form-group">
                <label>Fecha Límite de Venta <span class="required">*</span></label>
                <input type="datetime-local" name="ticketSaleLimit_${ticketTypeCounter}" required>
            </div>
        </div>
        
        <div class="form-group">
            <label>Foto o Diseño de la Entrada</label>
            <input type="file" name="ticketImage_${ticketTypeCounter}" accept="image/*">
            <small class="form-hint">Imagen que aparecerá en el ticket (opcional)</small>
            <div class="ticket-image-preview" id="ticketPreview_${ticketTypeCounter}"></div>
        </div>
    `;
    
    container.appendChild(ticketTypeDiv);
    
    // Agregar listener para preview de imagen del ticket
    const ticketImageInput = ticketTypeDiv.querySelector(`input[name="ticketImage_${ticketTypeCounter}"]`);
    if (ticketImageInput) {
        ticketImageInput.addEventListener('change', function(e) {
            handleTicketImagePreview(e, ticketTypeCounter);
        });
    }
}

// Remover tipo de entrada
function removeTicketType(button) {
    const ticketTypeItem = button.closest('.ticket-type-item');
    if (ticketTypeItem) {
        ticketTypeItem.remove();
        updateTicketTypeNumbers();
    }
}

// Actualizar números de tipos de entrada
function updateTicketTypeNumbers() {
    const ticketTypes = document.querySelectorAll('.ticket-type-item');
    ticketTypes.forEach((item, index) => {
        const header = item.querySelector('.ticket-type-header h3');
        if (header) {
            header.textContent = `Tipo de Entrada ${index + 1}`;
        }
        
        // Mostrar botón eliminar si hay más de uno
        const removeBtn = item.querySelector('.btn-remove-ticket');
        if (removeBtn) {
            removeBtn.style.display = ticketTypes.length > 1 ? 'block' : 'none';
        }
    });
}

// Manejar preview de fotos del evento
function handlePhotoPreview(e) {
    const files = Array.from(e.target.files);
    const preview = document.getElementById('photoPreview');
    if (!preview) return;
    
    preview.innerHTML = '';
    
    files.forEach(file => {
        if (!file.type.startsWith('image/')) {
            showNotification('Solo se permiten archivos de imagen', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            showNotification(`La imagen ${file.name} excede 5MB`, 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-photo';
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

// Manejar preview de imagen del ticket
function handleTicketImagePreview(e, ticketIndex) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showNotification('Solo se permiten archivos de imagen', 'error');
        e.target.value = '';
        return;
    }
    
    const preview = document.getElementById(`ticketPreview_${ticketIndex}`);
    if (!preview) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        preview.innerHTML = `<img src="${e.target.result}" class="preview-ticket-image">`;
    };
    reader.readAsDataURL(file);
}

// Manejar envío del formulario
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validaciones básicas
    if (!validateForm(formData)) {
        return;
    }
    
    // Obtener datos del formulario
    const eventData = collectFormData(formData);
    
    // Validar tipos de entrada
    if (eventData.tickets.length === 0) {
        showNotification('Debes agregar al menos un tipo de entrada', 'error');
        return;
    }
    
    // Verificar si estamos editando
    const form = document.getElementById('createEventForm');
    const eventId = form ? form.dataset.eventId : null;
    
    // Guardar o actualizar evento
    try {
        if (eventId) {
            await updateEvent(parseInt(eventId), eventData);
            showNotification('¡Evento actualizado exitosamente!', 'success');
        } else {
            await saveEvent(eventData);
            showNotification('¡Evento creado exitosamente!', 'success');
        }
        
        // Redirigir después de un breve delay
        setTimeout(() => {
            window.location.href = 'mis-eventos.html';
        }, 1500);
    } catch (error) {
        console.error('Error al guardar evento:', error);
        showNotification('Error al guardar el evento. Por favor, intenta nuevamente.', 'error');
    }
}

// Validar formulario
function validateForm(formData) {
    const eventName = formData.get('eventName');
    if (!eventName || eventName.trim().length === 0) {
        showNotification('El nombre del evento es obligatorio', 'error');
        return false;
    }
    
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');
    if (!startDate || !endDate) {
        showNotification('Las fechas de inicio y fin son obligatorias', 'error');
        return false;
    }
    
    if (new Date(startDate) >= new Date(endDate)) {
        showNotification('La fecha de fin debe ser posterior a la fecha de inicio', 'error');
        return false;
    }
    
    const termsCheckbox = document.getElementById('termsCheckbox');
    if (!termsCheckbox || !termsCheckbox.checked) {
        showNotification('Debes aceptar los términos y condiciones', 'error');
        return false;
    }
    
    return true;
}

// Recolectar datos del formulario
function collectFormData(formData) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    // Obtener tipos de entrada
    const tickets = [];
    const ticketTypes = document.querySelectorAll('.ticket-type-item');
    
    ticketTypes.forEach((item, index) => {
        const ticketIndex = index + 1;
        const type = formData.get(`ticketType_${ticketIndex}`);
        const price = parseFloat(formData.get(`ticketPrice_${ticketIndex}`));
        const description = formData.get(`ticketDescription_${ticketIndex}`);
        const quantity = parseInt(formData.get(`ticketQuantity_${ticketIndex}`));
        const saleLimit = formData.get(`ticketSaleLimit_${ticketIndex}`);
        const ticketImage = formData.get(`ticketImage_${ticketIndex}`);
        
        if (type && !isNaN(price) && description && quantity && saleLimit) {
            tickets.push({
                type: type,
                price: price,
                description: description,
                quantity: quantity,
                available: quantity,
                sold: 0,
                saleLimit: saleLimit,
                image: ticketImage ? URL.createObjectURL(ticketImage) : null
            });
        }
    });
    
    // Obtener fotos
    const photos = [];
    const photoFiles = formData.getAll('eventPhotos');
    photoFiles.forEach(file => {
        if (file && file.size > 0) {
            photos.push(URL.createObjectURL(file));
        }
    });
    
    // Formatear fechas
    const startDate = new Date(formData.get('startDate'));
    const endDate = new Date(formData.get('endDate'));
    
    // Obtener edad mínima
    const ageRestriction = document.getElementById('ageRestriction').checked;
    const minAge = ageRestriction ? parseInt(document.getElementById('minAge').value) || null : null;
    
    // Obtener ID del usuario (puede ser id o email)
    let creatorId = null;
    if (currentUser) {
        creatorId = currentUser.id || currentUser.email;
    }
    
    return {
        id: Date.now(), // ID temporal
        title: formData.get('eventName'),
        type: formData.get('eventType'),
        category: formData.get('eventCategory'),
        mainArtists: formData.get('mainArtists') || '',
        description: formData.get('eventDescription'),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        date: formatDate(startDate),
        time: formatTime(startDate),
        province: formData.get('province'),
        locality: formData.get('locality'),
        location: formData.get('venue'),
        video: formData.get('eventVideo') || '',
        photos: photos,
        image: photos.length > 0 ? photos[0] : 'img/default-event.png',
        eticketWeb: formData.get('eticketWeb') === 'on',
        eticketEmail: formData.get('eticketEmail') === 'on',
        tickets: tickets,
        price: tickets.length > 0 ? Math.min(...tickets.map(t => t.price)) : 0,
        minAge: minAge,
        badge: '',
        creatorId: creatorId,
        createdAt: new Date().toISOString(),
        status: 'active'
    };
}

// Guardar evento
async function saveEvent(eventData) {
    // Obtener eventos existentes
    const myEvents = JSON.parse(localStorage.getItem('myEvents') || '[]');
    
    // Agregar nuevo evento
    myEvents.push(eventData);
    
    // Guardar en localStorage
    localStorage.setItem('myEvents', JSON.stringify(myEvents));
    
    // También agregar a eventsData global si existe
    if (window.eventsData) {
        // Verificar que no exista ya
        const exists = window.eventsData.some(e => e.id === eventData.id);
        if (!exists) {
            window.eventsData.push(eventData);
        }
    }
    
    // Guardar en el array global de eventos
    const allEvents = JSON.parse(localStorage.getItem('eventsData') || '[]');
    // Verificar que no exista ya
    const existsInStorage = allEvents.some(e => e.id === eventData.id);
    if (!existsInStorage) {
        allEvents.push(eventData);
        localStorage.setItem('eventsData', JSON.stringify(allEvents));
    }
    
    return eventData;
}

// Actualizar evento existente
async function updateEvent(eventId, eventData) {
    // Mantener el ID original y datos de ventas
    const myEvents = JSON.parse(localStorage.getItem('myEvents') || '[]');
    const eventIndex = myEvents.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
        throw new Error('Evento no encontrado');
    }
    
    // Preservar datos de ventas del evento original
    const originalEvent = myEvents[eventIndex];
    if (originalEvent.tickets && eventData.tickets) {
        // Mantener contadores de ventas
        eventData.tickets.forEach((newTicket, index) => {
            const originalTicket = originalEvent.tickets[index];
            if (originalTicket) {
                newTicket.sold = originalTicket.sold || 0;
                // Ajustar available basado en quantity y sold
                newTicket.available = newTicket.quantity - newTicket.sold;
            }
        });
    }
    
    // Preservar otros datos importantes
    eventData.id = eventId;
    eventData.creatorId = originalEvent.creatorId;
    eventData.createdAt = originalEvent.createdAt;
    
    // Actualizar evento
    myEvents[eventIndex] = eventData;
    localStorage.setItem('myEvents', JSON.stringify(myEvents));
    
    // Actualizar en eventsData global
    if (window.eventsData) {
        const globalIndex = window.eventsData.findIndex(e => e.id === eventId);
        if (globalIndex !== -1) {
            window.eventsData[globalIndex] = eventData;
        }
    }
    
    // Actualizar en eventsData de localStorage
    const allEvents = JSON.parse(localStorage.getItem('eventsData') || '[]');
    const allEventsIndex = allEvents.findIndex(e => e.id === eventId);
    if (allEventsIndex !== -1) {
        allEvents[allEventsIndex] = eventData;
        localStorage.setItem('eventsData', JSON.stringify(allEvents));
    }
    
    return eventData;
}

// Formatear fecha
function formatDate(date) {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} del ${year}`;
}

// Formatear hora
function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Función para mostrar notificaciones (compatible con script.js)
// Usar directamente window.showNotification si existe, evitando recursión
function showNotification(message, type = 'info') {
    // Verificar si existe la función global de script.js
    // IMPORTANTE: No usar window.showNotification directamente aquí para evitar recursión
    // En su lugar, verificar si existe y llamarla de forma segura
    if (typeof window !== 'undefined' && 
        window.showNotification && 
        typeof window.showNotification === 'function' &&
        window.showNotification !== showNotification) {
        // Llamar a la función global original
        window.showNotification(message, type);
    } else {
        // Fallback a alert si no hay función global disponible
        alert(message);
    }
}

