// Estado del formulario
let ticketTypeCounter = 0;

// Función global para toggle del checkbox (debe estar disponible inmediatamente)
function toggleAgeRestrictionDisplay(checkbox) {
    const ageSelectWrapper = document.getElementById('ageSelectWrapper');
    const minAgeSelect = document.getElementById('minAge');
    
    if (!ageSelectWrapper || !minAgeSelect) {
        console.error('Elementos no encontrados:', { ageSelectWrapper, minAgeSelect });
        return;
    }
    
    if (checkbox.checked) {
        ageSelectWrapper.style.display = 'block';
        ageSelectWrapper.style.setProperty('display', 'block', 'important');
        minAgeSelect.setAttribute('required', 'required');
    } else {
        ageSelectWrapper.style.display = 'none';
        ageSelectWrapper.style.setProperty('display', 'none', 'important');
        minAgeSelect.value = '';
        minAgeSelect.removeAttribute('required');
    }
}

// Hacer función disponible globalmente inmediatamente
window.toggleAgeRestrictionDisplay = toggleAgeRestrictionDisplay;

// Delegación de eventos para el checkbox de restricción de edad (funciona incluso si se carga después)
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'ageRestriction') {
        toggleAgeRestrictionDisplay(e.target);
    }
});

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
    
    // Cargar tipos de entrada en los campos fijos
    if (event.tickets && event.tickets.length > 0) {
        event.tickets.forEach((ticket) => {
            const typeName = ticket.type;
            if (typeName && ['General', 'VIP', 'Familiar', 'Niños'].includes(typeName)) {
                const priceInput = document.getElementById(`ticketPrice_${typeName}`);
                const qtyInput = document.getElementById(`ticketQuantity_${typeName}`);
                const descTextarea = document.querySelector(`textarea[name="ticketDescription_${typeName}"]`);
                
            if (priceInput) priceInput.value = ticket.price || 0;
            if (qtyInput) qtyInput.value = ticket.quantity || 0;
                if (descTextarea) descTextarea.value = ticket.description || '';
            }
        });
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
    // Ya no necesitamos agregar tipos dinámicamente, están en el HTML
    // Configurar restricción de edad
    setupAgeRestriction();
    
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
    // Submit del formulario
    const form = document.getElementById('createEventForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Botón crear evento del header
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        // Si estamos en la página de crear evento, deshabilitar el botón
        if (window.location.pathname.includes('evento.html') || 
            window.location.href.includes('evento.html')) {
            registerBtn.style.opacity = '0.5';
            registerBtn.style.cursor = 'not-allowed';
            registerBtn.disabled = true;
        } else {
            registerBtn.addEventListener('click', function(e) {
            window.location.href = 'evento.html';
        });
    }
}
    
    // Configurar restricción de edad (asegurar que funcione)
    setupAgeRestriction();
    
    // Configurar cierre del modal
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalClose) {
        modalClose.addEventListener('click', closeEventModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeEventModal);
    }
}

// Configurar restricción de edad
function setupAgeRestriction() {
    const ageCheckbox = document.getElementById('ageRestriction');
    const ageSelectWrapper = document.getElementById('ageSelectWrapper');
    const minAgeSelect = document.getElementById('minAge');
    
    if (!ageCheckbox || !ageSelectWrapper || !minAgeSelect) {
        // Si los elementos no existen, intentar de nuevo después de un breve delay
        setTimeout(setupAgeRestriction, 200);
        return;
    }
    
    // Generar opciones de edad desde 12 a 30 años
    minAgeSelect.innerHTML = '<option value="">Selecciona una edad</option>';
    for (let age = 12; age <= 30; age++) {
        const option = document.createElement('option');
        option.value = age;
        option.textContent = `${age} años`;
        minAgeSelect.appendChild(option);
    }
    
    // Función para mostrar/ocultar el selector
    function toggleAgeSelect() {
        toggleAgeRestrictionDisplay(ageCheckbox);
    }
    
    // Agregar listeners adicionales (el onclick ya está en el HTML)
    ageCheckbox.addEventListener('change', toggleAgeSelect);
    ageCheckbox.addEventListener('click', toggleAgeSelect);
    
    // Verificar estado inicial
    if (ageCheckbox.checked) {
        ageSelectWrapper.style.display = 'block';
        minAgeSelect.setAttribute('required', 'required');
    }
}

// Hacer función disponible globalmente
window.setupAgeRestriction = setupAgeRestriction;

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

// Hacer funciones disponibles globalmente para onclick
window.addTicketType = addTicketType;
window.removeTicketType = removeTicketType;

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
    
    // Verificar primero si el usuario tiene datos completos del organizador
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const organizerData = JSON.parse(localStorage.getItem('organizerData') || 'null');
    
    if (!currentUser) {
        showNotification('Debes iniciar sesión para crear un evento', 'error');
        return;
    }
    
    if (!organizerData || !organizerData.isComplete) {
        showNotification('Debes completar tus datos de organizador antes de crear un evento', 'error');
        showOrganizerDataForm();
        return;
    }
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validaciones básicas
    if (!validateForm(formData)) {
        return;
    }
    
    // Obtener datos del formulario
    const eventData = collectFormData(formData);
    
    // Validar tipos de entrada - al menos uno debe tener precio y cantidad
    const ticketTypeNames = ['General', 'VIP', 'Familiar', 'Niños'];
    let hasValidTicket = false;
    
    ticketTypeNames.forEach((typeName) => {
        const price = parseFloat(formData.get(`ticketPrice_${typeName}`)) || 0;
        const quantity = parseInt(formData.get(`ticketQuantity_${typeName}`)) || 0;
        if (price > 0 && quantity > 0) {
            hasValidTicket = true;
        }
    });
    
    if (!hasValidTicket) {
        showNotification('Debes configurar al menos un tipo de entrada con precio y cantidad', 'error');
        return;
    }
    
    // Validar que collectFormData haya generado tickets válidos
    if (eventData.tickets.length === 0) {
        showNotification('Debes configurar al menos un tipo de entrada con precio y cantidad', 'error');
        return;
    }
    
    // Verificar si estamos editando
    const createEventForm = document.getElementById('createEventForm');
    const eventId = createEventForm ? createEventForm.dataset.eventId : null;
    
    // Guardar o actualizar evento
    try {
        if (eventId) {
            await updateEvent(parseInt(eventId), eventData);
            showNotification('¡Evento actualizado exitosamente!', 'success');
            // Redirigir después de un breve delay
            setTimeout(() => {
                window.location.href = 'mis-eventos.html';
            }, 1500);
        } else {
            await saveEvent(eventData);
            showNotification('¡Evento creado exitosamente!', 'success');
            
            // Deshabilitar el formulario y el botón del header para evitar que se vuelva a enviar
            const form = document.getElementById('createEventForm');
            if (form) {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Evento Creado';
                }
                form.style.opacity = '0.6';
                form.style.pointerEvents = 'none';
            }
            
            // Deshabilitar también el botón "CREAR EVENTO" del header
            const headerBtn = document.getElementById('registerBtn');
            if (headerBtn) {
                headerBtn.disabled = true;
                headerBtn.style.opacity = '0.5';
                headerBtn.style.cursor = 'not-allowed';
            }
            
            // Redirigir a mis eventos (ya verificamos que tiene datos completos antes)
        setTimeout(() => {
            window.location.href = 'mis-eventos.html';
        }, 1500);
        }
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
    
    // Obtener tipos de entrada (General, VIP, Familiar, Niños)
    const tickets = [];
    const ticketTypeNames = ['General', 'VIP', 'Familiar', 'Niños'];
    
    ticketTypeNames.forEach((typeName) => {
        const price = parseFloat(formData.get(`ticketPrice_${typeName}`)) || 0;
        const quantity = parseInt(formData.get(`ticketQuantity_${typeName}`)) || 0;
        const description = formData.get(`ticketDescription_${typeName}`) || '';
        
        // Solo agregar si tiene precio y cantidad (al menos uno debe estar configurado)
        if (price > 0 && quantity > 0) {
            tickets.push({
                type: typeName,
                price: price,
                description: description || `Entrada tipo ${typeName}`,
                quantity: quantity,
                available: quantity,
                sold: 0,
                saleLimit: formData.get('endDate') || new Date().toISOString(),
                image: null
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
        // Fallback con el mismo estilo de la web si no hay función global disponible
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
            max-width: 400px;
        `;
        
        const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
        notification.innerHTML = `<span style="font-size: 20px;">${icon}</span><span>${message}</span>`;
        
        document.body.appendChild(notification);
        
        // Asegurar que las animaciones CSS estén disponibles
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
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
        }
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Cerrar modal de evento
function closeEventModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.remove('active');
    }
    
    // Restaurar visibilidad del formulario de creación de eventos
    const createEventForm = document.getElementById('createEventForm');
    const createEventMain = document.querySelector('.create-event-main');
    if (createEventForm) {
        createEventForm.style.display = '';
    }
    if (createEventMain) {
        createEventMain.style.display = '';
    }
    
    // Habilitar el botón "CREAR EVENTO" del header si estamos en evento.html
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn && (window.location.pathname.includes('evento.html') || 
        window.location.href.includes('evento.html'))) {
        registerBtn.disabled = false;
        registerBtn.style.opacity = '1';
        registerBtn.style.cursor = 'pointer';
    }
}

// Mostrar formulario de datos del organizador
function showOrganizerDataForm() {
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) {
        // Si no hay modal, redirigir a una página dedicada o mostrar en la misma página
        window.location.href = 'datos-organizador.html?fromEvent=true';
        return;
    }
    
    // Ocultar el formulario de creación de eventos mientras se muestra el modal
    const createEventForm = document.getElementById('createEventForm');
    const createEventMain = document.querySelector('.create-event-main');
    if (createEventForm) {
        createEventForm.style.display = 'none';
    }
    if (createEventMain) {
        createEventMain.style.display = 'none';
    }
    
    // Cargar datos existentes si hay
    const existingData = JSON.parse(localStorage.getItem('organizerData') || 'null');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    modalBody.innerHTML = `
        <div class="event-detail-content" style="padding: 40px; max-width: 800px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 32px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: white; font-size: 40px;">
                    <i class="fas fa-user-tie"></i>
                </div>
                <h2 style="margin-bottom: 8px;">Completa tus Datos de Organizador</h2>
                <p style="color: var(--text-secondary);">Para recibir pagos y gestionar tus eventos, necesitamos completar tu información</p>
            </div>
            
            <form id="organizerDataForm" onsubmit="submitOrganizerData(event)">
                <!-- Datos Personales Completos -->
                <div class="form-section" style="margin-bottom: 32px;">
                    <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 20px; color: var(--text-primary); display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-user" style="color: var(--primary-color);"></i>
                        Datos Personales
                    </h3>
                    
                    <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div class="form-group">
                            <label>Nombre Completo <span class="required">*</span></label>
                            <input type="text" name="fullName" required value="${existingData?.fullName || currentUser?.name || ''}" placeholder="Juan Pérez">
                        </div>
                        <div class="form-group">
                            <label>DNI/CUIL <span class="required">*</span></label>
                            <input type="text" name="dni" required value="${existingData?.dni || ''}" placeholder="12345678" maxlength="11">
                        </div>
                    </div>
                    
                    <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div class="form-group">
                            <label>Teléfono <span class="required">*</span></label>
                            <input type="tel" name="phone" required value="${existingData?.phone || currentUser?.phone || ''}" placeholder="+54 9 11 1234-5678">
                        </div>
                        <div class="form-group">
                            <label>Email <span class="required">*</span></label>
                            <input type="email" name="email" required value="${existingData?.email || currentUser?.email || ''}" placeholder="email@ejemplo.com" readonly style="background: var(--input-bg); opacity: 0.7;">
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 16px;">
                        <label>Dirección Completa <span class="required">*</span></label>
                        <input type="text" name="address" required value="${existingData?.address || ''}" placeholder="Calle, Número, Piso, Departamento">
                    </div>
                    
                    <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
                        <div class="form-group">
                            <label>Provincia <span class="required">*</span></label>
                            <select name="province" required>
                                <option value="">Selecciona</option>
                                <option value="Chaco" ${existingData?.province === 'Chaco' ? 'selected' : ''}>Chaco</option>

                            </select>
                        </div>
                        <div class="form-group">
                            <label>Localidad <span class="required">*</span></label>
                            <input type="text" name="locality" required value="${existingData?.locality || ''}" placeholder="Ciudad">
                        </div>
                        <div class="form-group">
                            <label>Código Postal <span class="required">*</span></label>
                            <input type="text" name="postalCode" required value="${existingData?.postalCode || ''}" placeholder="3500" maxlength="8">
                        </div>
                    </div>
                </div>
                
                <!-- Datos Bancarios -->
                <div class="form-section" style="margin-bottom: 32px;">
                    <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 20px; color: var(--text-primary); display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-university" style="color: var(--secondary-color);"></i>
                        Datos Bancarios
                    </h3>
                    
                    <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div class="form-group">
                            <label>Tipo de Cuenta <span class="required">*</span></label>
                            <select name="accountType" required>
                                <option value="">Selecciona</option>
                                <option value="Caja de Ahorro" ${existingData?.accountType === 'Caja de Ahorro' ? 'selected' : ''}>Caja de Ahorro</option>
                                <option value="Cuenta Corriente" ${existingData?.accountType === 'Cuenta Corriente' ? 'selected' : ''}>Cuenta Corriente</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Banco <span class="required">*</span></label>
                            <input type="text" name="bankName" required value="${existingData?.bankName || ''}" placeholder="Nombre del banco">
                        </div>
                    </div>
                    
                    <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div class="form-group">
                            <label>CBU/Alias <span class="required">*</span></label>
                            <input type="text" name="cbu" required value="${existingData?.cbu || ''}" placeholder="CBU o Alias" maxlength="22">
                            <small style="color: var(--text-secondary); font-size: 12px; margin-top: 4px; display: block;">Ingresa tu CBU (22 dígitos) o Alias</small>
                        </div>
                        <div class="form-group">
                            <label>Número de Cuenta</label>
                            <input type="text" name="accountNumber" value="${existingData?.accountNumber || ''}" placeholder="Opcional">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Titular de la Cuenta <span class="required">*</span></label>
                        <input type="text" name="accountHolder" required value="${existingData?.accountHolder || existingData?.fullName || currentUser?.name || ''}" placeholder="Nombre del titular">
                    </div>
                </div>
                
                <!-- Información Adicional -->
                <div class="form-section" style="margin-bottom: 32px;">
                    <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 20px; color: var(--text-primary); display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-info-circle" style="color: var(--primary-color);"></i>
                        Información Adicional
                    </h3>
                    
                    <div class="form-group">
                        <label>Tipo de Organizador</label>
                        <select name="organizerType" onchange="toggleCompanyData(this)">
                            <option value="">Selecciona</option>
                            <option value="Persona Física" ${existingData?.organizerType === 'Persona Física' ? 'selected' : ''}>Persona Física</option>
                            <option value="Persona Jurídica" ${existingData?.organizerType === 'Persona Jurídica' ? 'selected' : ''}>Persona Jurídica</option>
                        </select>
                    </div>
                    
                    <div class="form-group" id="companyDataWrapper" style="display: ${existingData?.organizerType === 'Persona Jurídica' ? 'block' : 'none'};">
                        <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div class="form-group">
                                <label>Razón Social</label>
                                <input type="text" name="companyName" value="${existingData?.companyName || ''}" placeholder="Nombre de la empresa">
                            </div>
                            <div class="form-group">
                                <label>CUIT</label>
                                <input type="text" name="cuit" value="${existingData?.cuit || ''}" placeholder="20-12345678-9" maxlength="13">
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-actions" style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 32px;">
                    <button type="submit" class="btn-primary" style="padding: 12px 32px; width: 100%;">
                        <i class="fas fa-save"></i>
                        Guardar Datos y Continuar
                    </button>
                </div>
                <p style="text-align: center; color: var(--text-secondary); font-size: 13px; margin-top: 16px;">
                    <i class="fas fa-info-circle"></i> Estos datos son obligatorios para crear eventos y recibir pagos
                </p>
            </form>
        </div>
    `;
    
    modal.classList.add('active');
}

// Toggle para mostrar/ocultar datos de empresa
function toggleCompanyData(select) {
    const companyWrapper = document.getElementById('companyDataWrapper');
    if (companyWrapper) {
        companyWrapper.style.display = select.value === 'Persona Jurídica' ? 'block' : 'none';
    }
}

// Enviar datos del organizador
function submitOrganizerData(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const organizerData = {
        fullName: formData.get('fullName'),
        dni: formData.get('dni'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address'),
        province: formData.get('province'),
        locality: formData.get('locality'),
        postalCode: formData.get('postalCode'),
        accountType: formData.get('accountType'),
        bankName: formData.get('bankName'),
        cbu: formData.get('cbu'),
        accountNumber: formData.get('accountNumber') || '',
        accountHolder: formData.get('accountHolder'),
        organizerType: formData.get('organizerType') || 'Persona Física',
        companyName: formData.get('companyName') || '',
        cuit: formData.get('cuit') || '',
        isComplete: true,
        completedAt: new Date().toISOString()
    };
    
    // Validaciones básicas
    if (!organizerData.fullName || !organizerData.dni || !organizerData.phone || !organizerData.email) {
        showNotification('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    if (!organizerData.accountType || !organizerData.bankName || !organizerData.cbu || !organizerData.accountHolder) {
        showNotification('Por favor completa todos los datos bancarios obligatorios', 'error');
        return;
    }
    
    // Guardar datos del organizador
    localStorage.setItem('organizerData', JSON.stringify(organizerData));
    
    // Actualizar datos del usuario si es necesario
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser) {
        currentUser.phone = organizerData.phone;
        currentUser.fullName = organizerData.fullName;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    showNotification('¡Datos guardados exitosamente!', 'success');
    
    // Cerrar el modal (esto restaurará el formulario automáticamente)
    closeEventModal();
    
    // Inicializar el formulario de eventos ahora que tiene los datos completos
    initializeForm();
    setupEventListeners();
    
    showNotification('Ahora puedes crear tu evento', 'success');
}

// Omitir completar datos (completar más tarde) - NO PERMITIDO
function skipOrganizerData() {
    showNotification('Debes completar tus datos de organizador para crear eventos. Es obligatorio.', 'error');
    // No permitir cerrar el modal sin completar los datos
    return;
}

// Hacer funciones disponibles globalmente
window.showOrganizerDataForm = showOrganizerDataForm;
window.submitOrganizerData = submitOrganizerData;
window.skipOrganizerData = skipOrganizerData;
window.toggleCompanyData = toggleCompanyData;

