// Global variables
let filteredProjects = [...projects];
let currentView = 'cards';

// DOM elements
const projectsContainer = document.getElementById('projects-container');
const tableBody = document.getElementById('table-body');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const typeFilter = document.getElementById('type-filter');
const viewToggle = document.getElementById('view-toggle');
const totalProjectsSpan = document.getElementById('total-projects');
const completedProjectsSpan = document.getElementById('completed-projects');
const ongoingProjectsSpan = document.getElementById('ongoing-projects');
const avgProgressSpan = document.getElementById('avg-progress');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    renderProjects();
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    searchInput.addEventListener('input', filterProjects);
    statusFilter.addEventListener('change', filterProjects);
    typeFilter.addEventListener('change', filterProjects);
    viewToggle.addEventListener('click', toggleView);
}

// Update statistics
function updateStats() {
    const total = projects.length;
    const completed = projects.filter(p => p.status === 'Completed').length;
    const ongoing = projects.filter(p => p.status === 'Ongoing').length;
    const avgProgress = Math.round(projects.reduce((sum, p) => sum + p.completion, 0) / total);

    totalProjectsSpan.textContent = total;
    completedProjectsSpan.textContent = completed;
    ongoingProjectsSpan.textContent = ongoing;
    avgProgressSpan.textContent = avgProgress + '%';
}

// Filter projects based on search and filters
function filterProjects() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusFilterValue = statusFilter.value;
    const typeFilterValue = typeFilter.value;

    filteredProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchTerm) ||
                            project.notes.toLowerCase().includes(searchTerm) ||
                            project.objective.toLowerCase().includes(searchTerm);
        
        const matchesStatus = statusFilterValue === '' || project.status === statusFilterValue;
        const matchesType = typeFilterValue === '' || project.type === typeFilterValue;

        return matchesSearch && matchesStatus && matchesType;
    });

    renderProjects();
}

// Toggle between card and table view
function toggleView() {
    currentView = currentView === 'cards' ? 'table' : 'cards';
    viewToggle.textContent = currentView === 'cards' ? '📋 Table View' : '📊 Card View';
    renderProjects();
}

// Render projects based on current view
function renderProjects() {
    if (currentView === 'cards') {
        renderCardView();
        document.getElementById('cards-container').style.display = 'block';
        document.getElementById('table-container').style.display = 'none';
    } else {
        renderTableView();
        document.getElementById('cards-container').style.display = 'none';
        document.getElementById('table-container').style.display = 'block';
    }
}

// Render card view
function renderCardView() {
    projectsContainer.innerHTML = '';
    
    filteredProjects.forEach(project => {
        const card = createProjectCard(project);
        projectsContainer.appendChild(card);
    });

    if (filteredProjects.length === 0) {
        projectsContainer.innerHTML = '<div class="no-results">No projects found matching your criteria.</div>';
    }
}

// Render table view
function renderTableView() {
    tableBody.innerHTML = '';
    
    filteredProjects.forEach(project => {
        const row = createTableRow(project);
        tableBody.appendChild(row);
    });

    if (filteredProjects.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="no-results">No projects found matching your criteria.</td></tr>';
    }
}

// Create project card
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const priorityClass = project.priority.toLowerCase().replace(' ', '-');
    const statusClass = project.status.toLowerCase().replace(' ', '-');
    
    card.innerHTML = `
        <div class="project-header">
            <h3 class="project-title">${project.name}</h3>
            <div class="project-badges">
                <span class="badge priority-${priorityClass}">${project.priority}</span>
                <span class="badge status-${statusClass}">${project.status}</span>
            </div>
        </div>
        
        <div class="project-type">${project.type}</div>
        
        <div class="project-details">
            <div class="detail-row">
                <span class="detail-label">Priority:</span>
                <span class="detail-value">${project.priority}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Start Date:</span>
                <span class="detail-value">${formatDate(project.startDate)}</span>
            </div>
        </div>
        
        <div class="progress-section">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${project.completion}%"></div>
            </div>
            <div class="progress-text">${project.completion}% Complete</div>
        </div>
        
        <div class="current-status">
            <div class="status-label">Current Status:</div>
            <div class="status-content">${project.notes}</div>
        </div>
    `;
    
    return card;
}

// Create table row
function createTableRow(project) {
    const row = document.createElement('tr');
    
    const priorityClass = project.priority.toLowerCase().replace(' ', '-');
    const statusClass = project.status.toLowerCase().replace(' ', '-');
    
    row.innerHTML = `
        <td class="project-name">${project.name}</td>
        <td><span class="badge status-${statusClass}">${project.status}</span></td>
        <td><span class="badge priority-${priorityClass}">${project.priority}</span></td>
        <td>${project.type}</td>
        <td>${formatDate(project.startDate)}</td>
        <td class="progress-cell">
            <div class="table-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.completion}%"></div>
                </div>
                <span class="progress-text">${project.completion}%</span>
            </div>
        </td>
        <td class="notes-cell">${project.notes}</td>
    `;
    
    return row;
}

// Format date helper
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Add new project (placeholder for future functionality)
function addProject() {
    alert('Add project functionality coming next!');
}
