/**
 * Projects Data Loader
 * Handles loading project data from localStorage and remote API
 */

// JSONBin API configuration
const JSONBIN_URL = 'https://api.jsonbin.io/v3/b/6934e229d0ea881f4017c782';

// Local storage data - different from remote for demonstration
const LOCAL_PROJECTS_DATA = {
  projects: [
    {
      title: "Portfolio Website v3",
      image: "assets/linkedin.jpeg",
      alt: "Modern portfolio website with responsive design",
      description: "Redesigned personal portfolio using vanilla HTML, CSS, and JavaScript with focus on accessibility and performance. Implemented custom web components, dark mode, form validation, and responsive grid layouts. Achieved 100% accessibility score and optimized for Core Web Vitals.",
      link: "https://github.com/yourusername/portfolio-v3",
      tags: "HTML, CSS, JavaScript, Web Components",
      date: "2024-12",
      meta: "Fully accessible, performance optimized, custom components"
    },
    {
      title: "Weather Dashboard",
      image: "assets/redis.jpg",
      alt: "Real-time weather dashboard with forecast",
      description: "Created an interactive weather dashboard using OpenWeather API. Features include current conditions, 7-day forecast, location search, and weather alerts. Implemented data caching with localStorage to reduce API calls and improve loading times.",
      link: "https://github.com/yourusername/weather-dashboard",
      tags: "JavaScript, API, LocalStorage",
      date: "2024-10",
      meta: "Real-time data, geolocation support, responsive design"
    },
    {
      title: "Code Snippet Manager",
      image: "assets/task-manager.jpg",
      alt: "Code snippet manager with syntax highlighting",
      description: "Built a code snippet management tool with syntax highlighting using Prism.js. Users can save, categorize, and search code snippets with tag-based organization. Implemented export/import functionality for backup and sharing.",
      link: "https://github.com/yourusername/snippet-manager",
      tags: "JavaScript, IndexedDB, Prism.js",
      date: "2024-08",
      meta: "Offline-capable, syntax highlighting, tag-based search"
    }
  ]
};

/**
 * Initialize localStorage with project data
 */
function initializeLocalStorage() {
  if (!localStorage.getItem('projectsData')) {
    localStorage.setItem('projectsData', JSON.stringify(LOCAL_PROJECTS_DATA));
    console.log('LocalStorage initialized with project data');
  }
}

/**
 * Create a project card element from data
 */
function createProjectCard(project) {
  const card = document.createElement('project-card');
  card.setAttribute('tags', project.tags);
  card.setAttribute('date', project.date);

  const title = document.createElement('h2');
  title.textContent = project.title;

  const picture = document.createElement('picture');
  if (project.imageMobile) {
    const source = document.createElement('source');
    source.setAttribute('srcset', project.imageMobile);
    source.setAttribute('media', '(max-width: 600px)');
    picture.appendChild(source);
  }

  const img = document.createElement('img');
  img.src = project.image;
  img.alt = project.alt;
  img.width = 360;
  picture.appendChild(img);

  const description = document.createElement('p');
  description.textContent = project.description;

  const link = document.createElement('a');
  link.href = project.link;
  link.textContent = 'View on GitHub';

  card.appendChild(title);
  card.appendChild(picture);
  card.appendChild(description);
  card.appendChild(link);

  if (project.meta) {
    const meta = document.createElement('p');
    meta.className = 'meta';
    meta.textContent = project.meta;
    card.appendChild(meta);
  }

  return card;
}

/**
 * Render projects to the DOM
 */
function renderProjects(projects) {
  const container = document.getElementById('school');

  // Fade out existing cards and skeletons
  const existingCards = container.querySelectorAll('project-card, .skeleton-card');
  existingCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
  });

  // Wait for fade out, then add new cards
  setTimeout(() => {
    existingCards.forEach(card => card.remove());

    // Add new cards with staggered animation
    projects.forEach((project, index) => {
      const card = createProjectCard(project);
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      container.appendChild(card);

      // Trigger animation after a small delay
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 50 + (index * 80));
    });
  }, 200);
}

/**
 * Show skeleton loading state
 */
function showLoadingState() {
  const container = document.getElementById('school');
  const existingCards = container.querySelectorAll('project-card, .skeleton-card');
  existingCards.forEach(card => card.remove());

  // Create 3 skeleton cards
  for (let i = 0; i < 3; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton skeleton-card';
    container.appendChild(skeleton);
  }
}

/**
 * Load projects from localStorage
 */
function loadLocalProjects() {
  const btn = document.getElementById('load-local');
  btn.classList.add('loading');
  btn.disabled = true;

  showLoadingState();

  // Slight delay for smooth transition
  setTimeout(() => {
    try {
      const data = localStorage.getItem('projectsData');
      if (!data) {
        console.error('No data found in localStorage');
        alert('No local data found. Please try loading remote data first.');
        btn.classList.remove('loading');
        btn.disabled = false;
        return;
      }

      const projectsData = JSON.parse(data);
      renderProjects(projectsData.projects);
      console.log('Projects loaded from localStorage:', projectsData.projects.length);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      alert('Error loading local data. Please check the console for details.');
    } finally {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  }, 150);
}

/**
 * Load projects from remote API
 */
async function loadRemoteProjects() {
  const btn = document.getElementById('load-remote');
  btn.classList.add('loading');
  btn.disabled = true;

  showLoadingState();

  try {
    const response = await fetch(JSONBIN_URL, {
      headers: {
        'X-Master-Key': '$2a$10$m51VGE.ITS7NDRGjN5W0EOj/WmL68ANgPass.VmFecf0Xm9XDfDju'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const projects = data.record.projects || data.projects;

    renderProjects(projects);
    console.log('Projects loaded from remote API:', projects.length);
  } catch (error) {
    console.error('Error loading from remote API:', error);
    alert('Error loading remote data. Loading from local file instead...');

    // Fallback to local JSON file
    try {
      const response = await fetch('projects-data.json');
      const data = await response.json();
      renderProjects(data.projects);
      console.log('Projects loaded from local JSON file:', data.projects.length);
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      alert('Unable to load data. Please check your connection.');
    }
  } finally {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

/**
 * Initialize the page
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize localStorage with default data
  initializeLocalStorage();

  // Set up event listeners for buttons
  const loadLocalBtn = document.getElementById('load-local');
  const loadRemoteBtn = document.getElementById('load-remote');

  if (loadLocalBtn) {
    loadLocalBtn.addEventListener('click', loadLocalProjects);
  }

  if (loadRemoteBtn) {
    loadRemoteBtn.addEventListener('click', loadRemoteProjects);
  }

  console.log('Projects loader initialized. Click "Load Local" or "Load Remote" to display projects.');
});
