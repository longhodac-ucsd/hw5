/**
 * CRUD Operations for Project Management
 * Supports both localStorage and remote JSONBin API
 */

const JSONBIN_URL = 'https://api.jsonbin.io/v3/b/6934e229d0ea881f4017c782';
const JSONBIN_API_KEY = '$2a$10$m51VGE.ITS7NDRGjN5W0EOj/WmL68ANgPass.VmFecf0Xm9XDfDju';

// Get current storage mode
function getStorageMode() {
  return document.querySelector('input[name="storage"]:checked').value;
}

// Show status message
function showStatus(message, type = 'success') {
  const statusEl = document.getElementById('status-message');
  statusEl.textContent = message;
  statusEl.className = `status-message ${type}`;

  setTimeout(() => {
    statusEl.className = 'status-message';
  }, 5000);
}

// ===== READ Operations =====

async function loadProjects() {
  const mode = getStorageMode();

  if (mode === 'local') {
    return loadLocalProjects();
  } else {
    return await loadRemoteProjects();
  }
}

function loadLocalProjects() {
  try {
    const data = localStorage.getItem('projectsData');
    if (!data) {
      // Initialize with empty array if no data
      const emptyData = { projects: [] };
      localStorage.setItem('projectsData', JSON.stringify(emptyData));
      return [];
    }
    const projectsData = JSON.parse(data);
    return projectsData.projects || [];
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    showStatus('Error loading local projects', 'error');
    return [];
  }
}

async function loadRemoteProjects() {
  try {
    const response = await fetch(JSONBIN_URL, {
      headers: {
        'X-Master-Key': JSONBIN_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.record.projects || data.projects || [];
  } catch (error) {
    console.error('Error loading from remote:', error);
    showStatus('Error loading remote projects. Make sure JSONBin is configured.', 'error');
    return [];
  }
}

// ===== CREATE Operations =====

async function createProject(projectData) {
  const mode = getStorageMode();

  if (mode === 'local') {
    return createLocalProject(projectData);
  } else {
    return await createRemoteProject(projectData);
  }
}

function createLocalProject(projectData) {
  try {
    const projects = loadLocalProjects();
    projects.push(projectData);

    localStorage.setItem('projectsData', JSON.stringify({ projects }));
    showStatus('Project created successfully in localStorage!', 'success');
    return true;
  } catch (error) {
    console.error('Error creating project locally:', error);
    showStatus('Error creating project locally', 'error');
    return false;
  }
}

async function createRemoteProject(projectData) {
  try {
    const projects = await loadRemoteProjects();
    projects.push(projectData);

    const response = await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify({ projects })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    showStatus('Project created successfully on remote server!', 'success');
    return true;
  } catch (error) {
    console.error('Error creating project remotely:', error);
    showStatus('Error creating project remotely. Check API key and connection.', 'error');
    return false;
  }
}

// ===== UPDATE Operations =====

async function updateProject(index, projectData) {
  const mode = getStorageMode();

  if (mode === 'local') {
    return updateLocalProject(index, projectData);
  } else {
    return await updateRemoteProject(index, projectData);
  }
}

function updateLocalProject(index, projectData) {
  try {
    const projects = loadLocalProjects();

    if (index < 0 || index >= projects.length) {
      showStatus('Invalid project index', 'error');
      return false;
    }

    projects[index] = projectData;
    localStorage.setItem('projectsData', JSON.stringify({ projects }));
    showStatus('Project updated successfully in localStorage!', 'success');
    return true;
  } catch (error) {
    console.error('Error updating project locally:', error);
    showStatus('Error updating project locally', 'error');
    return false;
  }
}

async function updateRemoteProject(index, projectData) {
  try {
    const projects = await loadRemoteProjects();

    if (index < 0 || index >= projects.length) {
      showStatus('Invalid project index', 'error');
      return false;
    }

    projects[index] = projectData;

    const response = await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify({ projects })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    showStatus('Project updated successfully on remote server!', 'success');
    return true;
  } catch (error) {
    console.error('Error updating project remotely:', error);
    showStatus('Error updating project remotely. Check API key and connection.', 'error');
    return false;
  }
}

// ===== DELETE Operations =====

async function deleteProject(index) {
  const mode = getStorageMode();

  if (mode === 'local') {
    return deleteLocalProject(index);
  } else {
    return await deleteRemoteProject(index);
  }
}

function deleteLocalProject(index) {
  try {
    const projects = loadLocalProjects();

    if (index < 0 || index >= projects.length) {
      showStatus('Invalid project index', 'error');
      return false;
    }

    projects.splice(index, 1);
    localStorage.setItem('projectsData', JSON.stringify({ projects }));
    showStatus('Project deleted successfully from localStorage!', 'success');
    return true;
  } catch (error) {
    console.error('Error deleting project locally:', error);
    showStatus('Error deleting project locally', 'error');
    return false;
  }
}

async function deleteRemoteProject(index) {
  try {
    const projects = await loadRemoteProjects();

    if (index < 0 || index >= projects.length) {
      showStatus('Invalid project index', 'error');
      return false;
    }

    projects.splice(index, 1);

    const response = await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify({ projects })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    showStatus('Project deleted successfully from remote server!', 'success');
    return true;
  } catch (error) {
    console.error('Error deleting project remotely:', error);
    showStatus('Error deleting project remotely. Check API key and connection.', 'error');
    return false;
  }
}

// ===== UI Functions =====

async function refreshProjectsList() {
  const projects = await loadProjects();
  populateUpdateSelect(projects);
  populateDeleteList(projects);
}

function populateUpdateSelect(projects) {
  const select = document.getElementById('update-select');
  select.innerHTML = '<option value="">-- Select a project --</option>';

  projects.forEach((project, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${project.title} (${project.date})`;
    select.appendChild(option);
  });
}

function populateDeleteList(projects) {
  const list = document.getElementById('delete-list');

  if (projects.length === 0) {
    list.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 2rem;">No projects found. Create one above!</p>';
    return;
  }

  list.innerHTML = '';
  projects.forEach((project, index) => {
    const item = document.createElement('div');
    item.className = 'project-item';

    item.innerHTML = `
      <div class="project-info">
        <h3>${project.title}</h3>
        <p>${project.tags} • ${project.date}</p>
      </div>
      <div class="project-actions">
        <button class="btn btn-danger btn-small" data-index="${index}">Delete</button>
      </div>
    `;

    list.appendChild(item);
  });
}

// ===== Event Handlers =====

document.addEventListener('DOMContentLoaded', () => {
  // Initial load
  refreshProjectsList();

  // Storage mode change
  document.querySelectorAll('input[name="storage"]').forEach(radio => {
    radio.addEventListener('change', refreshProjectsList);
  });

  // CREATE form
  document.getElementById('create-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const projectData = {
      title: document.getElementById('create-title').value,
      image: document.getElementById('create-image').value,
      alt: document.getElementById('create-alt').value,
      description: document.getElementById('create-description').value,
      link: document.getElementById('create-link').value,
      tags: document.getElementById('create-tags').value,
      date: document.getElementById('create-date').value,
      meta: document.getElementById('create-meta').value
    };

    const success = await createProject(projectData);
    if (success) {
      e.target.reset();
      await refreshProjectsList();
    }
  });

  // UPDATE select change
  document.getElementById('update-select').addEventListener('change', async (e) => {
    const index = parseInt(e.target.value);

    if (isNaN(index)) {
      return;
    }

    const projects = await loadProjects();
    const project = projects[index];

    if (project) {
      document.getElementById('update-index').value = index;
      document.getElementById('update-title').value = project.title;
      document.getElementById('update-image').value = project.image;
      document.getElementById('update-alt').value = project.alt;
      document.getElementById('update-description').value = project.description;
      document.getElementById('update-link').value = project.link;
      document.getElementById('update-tags').value = project.tags;
      document.getElementById('update-date').value = project.date;
      document.getElementById('update-meta').value = project.meta || '';
    }
  });

  // UPDATE form
  document.getElementById('update-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const index = parseInt(document.getElementById('update-index').value);

    if (isNaN(index)) {
      showStatus('Please select a project to update', 'error');
      return;
    }

    const projectData = {
      title: document.getElementById('update-title').value,
      image: document.getElementById('update-image').value,
      alt: document.getElementById('update-alt').value,
      description: document.getElementById('update-description').value,
      link: document.getElementById('update-link').value,
      tags: document.getElementById('update-tags').value,
      date: document.getElementById('update-date').value,
      meta: document.getElementById('update-meta').value
    };

    const success = await updateProject(index, projectData);
    if (success) {
      document.getElementById('update-select').value = '';
      e.target.reset();
      await refreshProjectsList();
    }
  });

  // Cancel update
  document.getElementById('cancel-update').addEventListener('click', () => {
    document.getElementById('update-select').value = '';
    document.getElementById('update-form').reset();
  });

  // DELETE (using event delegation)
  document.getElementById('delete-list').addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-danger')) {
      const index = parseInt(e.target.dataset.index);

      if (confirm('Are you sure you want to delete this project?')) {
        const success = await deleteProject(index);
        if (success) {
          await refreshProjectsList();
        }
      }
    }
  });
});
