// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, projects array:', projects);
    console.log('Projects length:', projects ? projects.length : 'undefined');
    renderProjects();
    updateStats();
    setupEventListeners();
    loadMediaFromStorage();
});

function setupEventListeners() {
    document.getElementById('statusFilter').addEventListener('change', filterProjects);
    document.getElementById('typeFilter').addEventListener('change', filterProjects);
    document.getElementById('searchFilter').addEventListener('input', filterProjects);
}

function renderProjects() {
    const grid = document.getElementById('projectGrid');
    const tableBody = document.getElementById('tableBody');
    
    grid.innerHTML = '';
    tableBody.innerHTML = '';

    projects.forEach(project => {
        // Render card view
        const card = createProjectCard(project);
        grid.appendChild(card);

        // Render table row
        const row = createTableRow(project);
        tableBody.appendChild(row);
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.position = 'relative';
    
    const statusClass = `status-${project.status.toLowerCase().replace(' ', '-')}`;
    const priorityClass = `priority-${project.priority.toLowerCase()}`;
    
    card.innerHTML = `
        <div class="priority-indicator ${priorityClass}"></div>
        <div class="project-header">
            <div>
                <div class="project-title">${project.name}</div>
                <div class="project-type">${project.type}</div>
            </div>
            <div class="status-badge ${statusClass}">${project.status}</div>
        </div>
        
        <div class="project-details">
            <div class="detail-row">
                <span class="detail-label">Priority:</span>
                <span class="detail-value">${project.priority}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Start Date:</span>
                <span class="detail-value">${formatDate(project.startDate)}</span>
            </div>
            ${project.dueDate ? `
            <div class="detail-row">
                <span class="detail-label">Due Date:</span>
                <span class="detail-value">${formatDate(project.dueDate)}</span>
            </div>
            ` : ''}
            <div class="detail-row">
                <span class="detail-label">Category:</span>
                <span class="detail-value">${project.category || ''}</span>
            </div>
        </div>

        <div class="progress-bar">
            <div class="progress-fill" style="width: ${project.completion}%"></div>
        </div>
        <div style="text-align: center; margin-top: 8px; font-weight: 600; color: #495057;">
            ${project.completion}% Complete
        </div>

        ${project.objective && project.objective !== 'NA' && project.objective !== '' ? `
        <div class="project-notes">
            <div class="notes-title">Current Objective:</div>
            <div class="notes-content">${project.objective}</div>
        </div>
        ` : ''}

        ${project.notes && project.notes !== 'NA' && project.notes !== '' ? `
        <div class="project-notes">
            <div class="notes-title">Project Notes:</div>
            <div class="notes-content">${project.notes}</div>
        </div>
        ` : ''}

        ${project.upcomingActions && project.upcomingActions !== 'NA' && project.upcomingActions !== '' ? `
        <div class="project-notes">
            <div class="notes-title">Upcoming Actions:</div>
            <div class="notes-content">${project.upcomingActions}</div>
        </div>
        ` : ''}

        <div class="project-media" data-project-id="${project.id}">
            <div class="media-header">
                <div class="media-title">📸 Project Media</div>
                <div class="media-upload-area" 
                     ondrop="handleDrop(event, ${project.id})" 
                     ondragover="handleDragOver(event)"
                     ondragenter="handleDragEnter(event)"
                     ondragleave="handleDragLeave(event)">
                    <div class="upload-text">
                        <span class="upload-icon">📁</span>
                        <span>Drop files here or click to upload</span>
                    </div>
                    <input type="file" 
                           class="file-input" 
                           multiple 
                           accept="image/*,video/*" 
                           onchange="handleFileSelect(event, ${project.id})">
                </div>
            </div>
            <div class="media-content" id="media-content-${project.id}">
                <!-- Media will be rendered here -->
            </div>
        </div>

    `;
    
    // Render existing media for this project
    renderProjectMedia(project.id);
    
    return card;
}

function renderProjectMedia(projectId) {
    const mediaContent = document.getElementById(`media-content-${projectId}`);
    if (!mediaContent) return;
    
    const projectMedia = getProjectMedia(projectId);
    
    if (projectMedia.screenshots.length === 0 && projectMedia.videos.length === 0) {
        mediaContent.innerHTML = '<div class="no-media">No media uploaded yet</div>';
        return;
    }
    
    let mediaHTML = '';
    
    if (projectMedia.screenshots.length > 0) {
        mediaHTML += `
            <div class="media-section">
                <div class="media-subtitle">📷 Screenshots</div>
                <div class="media-grid">
                    ${projectMedia.screenshots.map((screenshot, index) => `
                        <div class="media-item">
                            <img src="${screenshot.url}" alt="${screenshot.name}" class="media-image" onclick="openMediaModal('${screenshot.url}', '${screenshot.name}', '${screenshot.description || ''}')">
                            <div class="media-caption">${screenshot.name}</div>
                            <button class="media-delete" onclick="deleteMedia(${projectId}, 'screenshot', ${index})">×</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    if (projectMedia.videos.length > 0) {
        mediaHTML += `
            <div class="media-section">
                <div class="media-subtitle">🎥 Videos</div>
                <div class="media-grid">
                    ${projectMedia.videos.map((video, index) => `
                        <div class="media-item">
                            <video controls class="media-video" onclick="openMediaModal('${video.url}', '${video.name}', '${video.description || ''}')">
                                <source src="${video.url}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                            <div class="media-caption">${video.name}</div>
                            <button class="media-delete" onclick="deleteMedia(${projectId}, 'video', ${index})">×</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    mediaContent.innerHTML = mediaHTML;
}

function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
}

function handleDragEnter(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}

function handleDrop(event, projectId) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    handleFiles(files, projectId);
}

function handleFileSelect(event, projectId) {
    const files = event.target.files;
    handleFiles(files, projectId);
}

function handleFiles(files, projectId) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            addScreenshot(projectId, file);
        } else if (file.type.startsWith('video/')) {
            addVideo(projectId, file);
        }
    });
}

function addScreenshot(projectId, file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const screenshot = {
            name: file.name,
            url: e.target.result,
            description: '',
            timestamp: Date.now()
        };
        
        addProjectMedia(projectId, 'screenshot', screenshot);
        renderProjectMedia(projectId);
    };
    reader.readAsDataURL(file);
}

function addVideo(projectId, file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const video = {
            name: file.name,
            url: e.target.result,
            description: '',
            timestamp: Date.now()
        };
        
        addProjectMedia(projectId, 'video', video);
        renderProjectMedia(projectId);
    };
    reader.readAsDataURL(file);
}

function addProjectMedia(projectId, type, media) {
    const projectMedia = getProjectMedia(projectId);
    projectMedia[type + 's'].push(media);
    saveProjectMedia(projectId, projectMedia);
}

function deleteMedia(projectId, type, index) {
    const projectMedia = getProjectMedia(projectId);
    projectMedia[type + 's'].splice(index, 1);
    saveProjectMedia(projectId, projectMedia);
    renderProjectMedia(projectId);
}

function getProjectMedia(projectId) {
    const stored = localStorage.getItem(`project-media-${projectId}`);
    if (stored) {
        return JSON.parse(stored);
    }
    return { screenshots: [], videos: [] };
}

function saveProjectMedia(projectId, media) {
    localStorage.setItem(`project-media-${projectId}`, JSON.stringify(media));
}

function loadMediaFromStorage() {
    // This will be called when the page loads to restore any saved media
    projects.forEach(project => {
        const media = getProjectMedia(project.id);
        if (media.screenshots.length > 0 || media.videos.length > 0) {
            // Media exists, it will be rendered when the card is created
        }
    });
}

function createTableRow(project) {
    const row = document.createElement('tr');
    const statusClass = `status-${project.status.toLowerCase().replace(' ', '-')}`;
    
    row.innerHTML = `
        <td>${project.name}</td>
        <td><span class="status-badge ${statusClass}">${project.status}</span></td>
        <td>${project.priority}</td>
        <td>${project.type}</td>
        <td>${formatDate(project.startDate)}</td>
        <td>${project.dueDate ? formatDate(project.dueDate) : 'No due date'}</td>
        <td>${project.category || ''}</td>
        <td>${project.objective || ''}</td>
        <td>${project.notes || ''}</td>
        <td>${project.upcomingActions || ''}</td>
        <td>${project.completion}%</td>
    `;
    
    return row;
}

function formatDate(dateString) {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function filterProjects() {
    const statusFilter = document.getElementById('statusFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();

    const cards = document.querySelectorAll('.project-card');
    const rows = document.querySelectorAll('#tableBody tr');

    projects.forEach((project, index) => {
        let show = true;

        if (statusFilter !== 'all' && project.status !== statusFilter) {
            show = false;
        }

        if (typeFilter !== 'all' && project.type !== typeFilter) {
            show = false;
        }

        if (searchFilter && !project.name.toLowerCase().includes(searchFilter)) {
            show = false;
        }

        cards[index].style.display = show ? 'block' : 'none';
        rows[index].style.display = show ? 'table-row' : 'none';
    });

    updateStats();
}

function updateStats() {
    const visibleProjects = projects.filter((project, index) => {
        const card = document.querySelectorAll('.project-card')[index];
        return card && card.style.display !== 'none';
    });

    const total = visibleProjects.length;
    const completed = visibleProjects.filter(p => p.status === 'Completed').length;
    const ongoing = visibleProjects.filter(p => p.status === 'Ongoing').length;
    const avgProgress = total > 0 ? Math.round(visibleProjects.reduce((sum, p) => sum + p.completion, 0) / total) : 0;

    document.getElementById('totalProjects').textContent = total;
    document.getElementById('completedProjects').textContent = completed;
    document.getElementById('ongoingProjects').textContent = ongoing;
    document.getElementById('avgProgress').textContent = avgProgress + '%';
}

function toggleView(view) {
    const cardView = document.getElementById('projectGrid');
    const tableView = document.getElementById('tableView');
    const buttons = document.querySelectorAll('.view-btn');

    buttons.forEach(btn => btn.classList.remove('active'));

    if (view === 'cards') {
        cardView.style.display = 'grid';
        tableView.style.display = 'none';
        buttons[0].classList.add('active');
    } else {
        cardView.style.display = 'none';
        tableView.style.display = 'block';
        buttons[1].classList.add('active');
    }
}

function addProject() {
    // For now, just alert - we'll implement this properly next
    alert('Add project functionality coming next! This will open a form to add new projects.');
}

function openMediaModal(src, title, description) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'media-modal-overlay';
    modal.onclick = () => modal.remove();
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'media-modal-content';
    modalContent.onclick = (e) => e.stopPropagation();
    
    // Determine if it's a video or image
    const isVideo = src.includes('.mp4') || src.includes('.mov') || src.includes('.avi');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>${title}</h3>
            <button class="modal-close" onclick="this.closest('.media-modal-overlay').remove()">&times;</button>
        </div>
        <div class="modal-body">
            ${isVideo ? 
                `<video controls autoplay class="modal-video">
                    <source src="${src}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>` :
                `<img src="${src}" alt="${title}" class="modal-image">`
            }
            <p class="modal-description">${description}</p>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}
