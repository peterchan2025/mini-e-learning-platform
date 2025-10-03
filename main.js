import './style.css';

const courses = [
  {
    id: 1,
    title: 'Intro to HTML',
    shortDescription: 'Learn the basics of HTML, including tags, attributes, and document structure.',
    fullDescription: 'This course covers HTML fundamentals: headings, paragraphs, links, images, forms, and semantic structure.',
    completed: false
  },
  {
    id: 2,
    title: 'JavaScript Basics',
    shortDescription: 'Discover how to make web pages interactive with variables, functions, and events.',
    fullDescription: 'This course introduces data types, variables, loops, functions, and DOM manipulation.',
    completed: false
  },
  {
    id: 3,
    title: 'CSS Design',
    shortDescription: 'Explore how to style websites with colors, layouts, and responsive design.',
    fullDescription: 'This course explores styling with colors, typography, layouts (flexbox/grid), transitions, and responsive media queries.',
    completed: false
  }
];

let currentUser = null;

function init() {
  checkAuth();
  renderApp();
}

function checkAuth() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
  }
}

function renderApp() {
  const app = document.querySelector('#app');

  app.innerHTML = `
    <header>
      <div class="header-content">
        <h1>Mini E-Learning Platform</h1>
        <nav>
          <a href="#" id="home-link">Home</a>
          <a href="#" id="courses-link">My Courses</a>
        </nav>
        ${currentUser ? `
          <div class="user-greeting">
            Welcome, ${currentUser.name}! <a href="#" id="logout-link" style="color: white; text-decoration: underline;">Logout</a>
          </div>
        ` : `
          <div class="auth-links">
            <a href="#" id="login-link">Login</a>
            <a href="#" id="signup-link">Signup</a>
          </div>
        `}
      </div>
    </header>
    <main>
      <div id="content"></div>
    </main>
    <div class="modal-overlay" id="modal-overlay"></div>
  `;

  attachHeaderEvents();
  renderCourses();
}

function attachHeaderEvents() {
  document.getElementById('home-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    renderCourses();
  });

  document.getElementById('courses-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    renderCourses();
  });

  document.getElementById('login-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginModal();
  });

  document.getElementById('signup-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    showSignupModal();
  });

  document.getElementById('logout-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}

function renderCourses() {
  const content = document.getElementById('content');

  const coursesHTML = courses.map(course => `
    <div class="course-card ${course.completed ? 'completed' : ''}" data-course-id="${course.id}">
      ${course.completed ? '<div class="completed-badge">Completed</div>' : ''}
      <h3>${course.title}</h3>
      <p>${course.shortDescription}</p>
      <button class="btn view-details-btn" data-course-id="${course.id}">View Details</button>
    </div>
  `).join('');

  content.innerHTML = `
    <div class="courses-grid">
      ${coursesHTML}
    </div>
  `;

  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const courseId = parseInt(e.target.dataset.courseId);
      showCourseModal(courseId);
    });
  });
}

function showCourseModal(courseId) {
  const course = courses.find(c => c.id === courseId);
  if (!course) return;

  const modalOverlay = document.getElementById('modal-overlay');

  modalOverlay.innerHTML = `
    <div class="modal">
      <h2>${course.title}</h2>
      <p>${course.fullDescription}</p>
      <div class="modal-buttons">
        ${!course.completed ? `
          <button class="btn btn-success" id="mark-completed-btn" data-course-id="${course.id}">
            Mark as Completed
          </button>
        ` : `
          <p style="color: #10b981; font-weight: 600;">Course Completed!</p>
        `}
        <button class="btn btn-secondary" id="close-modal-btn">Close</button>
      </div>
    </div>
  `;

  modalOverlay.classList.add('active');

  document.getElementById('close-modal-btn')?.addEventListener('click', closeModal);

  document.getElementById('mark-completed-btn')?.addEventListener('click', (e) => {
    const id = parseInt(e.target.dataset.courseId);
    markCourseCompleted(id);
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
}

function markCourseCompleted(courseId) {
  const course = courses.find(c => c.id === courseId);
  if (course) {
    course.completed = true;
    closeModal();
    renderCourses();
  }
}

function closeModal() {
  const modalOverlay = document.getElementById('modal-overlay');
  modalOverlay.classList.remove('active');
}

function showLoginModal() {
  const modalOverlay = document.getElementById('modal-overlay');

  modalOverlay.innerHTML = `
    <div class="modal">
      <h2>Login</h2>
      <form id="login-form">
        <div class="form-group">
          <label for="login-email">Email</label>
          <input type="email" id="login-email" required>
        </div>
        <div class="form-group">
          <label for="login-password">Password</label>
          <input type="password" id="login-password" required>
        </div>
        <div id="login-message"></div>
        <div class="modal-buttons">
          <button type="submit" class="btn">Login</button>
          <button type="button" class="btn btn-secondary" id="close-modal-btn">Close</button>
        </div>
      </form>
    </div>
  `;

  modalOverlay.classList.add('active');

  document.getElementById('login-form')?.addEventListener('submit', handleLogin);
  document.getElementById('close-modal-btn')?.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
}

function showSignupModal() {
  const modalOverlay = document.getElementById('modal-overlay');

  modalOverlay.innerHTML = `
    <div class="modal">
      <h2>Signup</h2>
      <form id="signup-form">
        <div class="form-group">
          <label for="signup-name">Name</label>
          <input type="text" id="signup-name" required>
        </div>
        <div class="form-group">
          <label for="signup-email">Email</label>
          <input type="email" id="signup-email" required>
        </div>
        <div class="form-group">
          <label for="signup-password">Password</label>
          <input type="password" id="signup-password" required>
        </div>
        <div id="signup-message"></div>
        <div class="modal-buttons">
          <button type="submit" class="btn">Signup</button>
          <button type="button" class="btn btn-secondary" id="close-modal-btn">Close</button>
        </div>
      </form>
    </div>
  `;

  modalOverlay.classList.add('active');

  document.getElementById('signup-form')?.addEventListener('submit', handleSignup);
  document.getElementById('close-modal-btn')?.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
}

function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const messageEl = document.getElementById('login-message');

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    currentUser = { name: user.name, email: user.email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    messageEl.innerHTML = '<p class="success-message">Login successful!</p>';
    setTimeout(() => {
      closeModal();
      renderApp();
    }, 1000);
  } else {
    messageEl.innerHTML = '<p class="error-message">Invalid email or password</p>';
  }
}

function handleSignup(e) {
  e.preventDefault();

  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const messageEl = document.getElementById('signup-message');

  const users = JSON.parse(localStorage.getItem('users') || '[]');

  if (users.find(u => u.email === email)) {
    messageEl.innerHTML = '<p class="error-message">Email already exists</p>';
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem('users', JSON.stringify(users));

  currentUser = { name, email };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));

  messageEl.innerHTML = '<p class="success-message">Signup successful!</p>';
  setTimeout(() => {
    closeModal();
    renderApp();
  }, 1000);
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  renderApp();
}

init();
