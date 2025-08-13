// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderProjects();
    updateStats();
    setupEventListeners();
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
        </div>

        <div class="progress-bar">
            <div class="progress-fill" style="width: ${project.completion}%"></div>
        </div>
        <div style="text-align: center; margin-top: 8px; font-weight: 600; color: #495057;">
            ${project.completion}% Complete
        </div>

        ${project.notes !== 'NA' && project.notes !== '' ? `
        <div class="project-notes">
            <div class="notes-title">Current Status:</div>
            <div class="notes-content">${project.notes}</div>
        </div>
        ` : ''}

        ${project.actions !== 'NA' && project.actions !== '' ? `
        <div class="upcoming-actions">
            <div class="notes-title">Next Actions:</div>
            <div class="notes-content">${project.actions}</div>
        </div>
        ` : ''}
    `;
    
    return card;
}

function createTableRow(project) {
    const row = document.createElement('tr');
    const statusClass = `status-${project.status.toLowerCase().replace(' ', '-')}`;
    
    row.innerHTML = `
        <td>${project.name}</td>
        <td><span class="status-badge ${statusClass}">${project.status}</span></td>
        <td>${project.priority}</td>
        <td>${project.type}</td>
        <td>${project.completion}%</td>
        <td>${project.dueDate ? formatDate(project.dueDate) : 'No due date'}</td>
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
