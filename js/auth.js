// Authentication functionality for the Family Organizer app

// Initialize local authentication
function initGoogleAuth() {
  console.log('Initializing local authentication...');
  
  // Set up auth-related DOM event listeners
  document.getElementById('login-button').textContent = 'Login / Register';
  document.getElementById('login-button').addEventListener('click', showLoginModal);
  
  // Check if user is already logged in
  checkLocalStorageAuth();
}

// Check if user exists in local storage
function checkLocalStorageAuth() {
  const savedUser = localStorage.getItem('currentUser');
  
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      
      // Update app state
      appState.currentUser = user;
      appState.isAuthenticated = true;
      
      // Update UI
      updateSignInStatus(true);
      
      // Load family members
      loadFamilyMembers();
    } catch (error) {
      console.error('Error parsing saved user data:', error);
      localStorage.removeItem('currentUser');
    }
  } else {
    updateSignInStatus(false);
  }
}

// Load family members from localStorage
async function loadFamilyMembers() {
  try {
    const savedFamilyMembers = localStorage.getItem('familyMembers');
    
    if (savedFamilyMembers) {
      appState.family = JSON.parse(savedFamilyMembers);
    } else {
      appState.family = [];
    }
  } catch (error) {
    console.error('Error loading family members:', error);
    appState.family = [];
  }
}

// Show login/register modal
function showLoginModal() {
  // Create modal content
  const content = `
    <div class="login-modal">
      <div class="login-tabs">
        <button id="login-tab" class="tab-button active">Login</button>
        <button id="register-tab" class="tab-button">Register</button>
      </div>
      
      <div id="login-form-container" class="tab-content active">
        <form id="login-form">
          <div class="form-group">
            <label for="login-email">Email</label>
            <input type="email" id="login-email" required placeholder="Enter your email">
          </div>
          
          <div class="form-group">
            <label for="login-password">Password</label>
            <input type="password" id="login-password" required placeholder="Enter your password">
          </div>
        </form>
      </div>
      
      <div id="register-form-container" class="tab-content">
        <form id="register-form">
          <div class="form-group">
            <label for="register-name">Full Name</label>
            <input type="text" id="register-name" required placeholder="Enter your name">
          </div>
          
          <div class="form-group">
            <label for="register-email">Email</label>
            <input type="email" id="register-email" required placeholder="Enter your email">
          </div>
          
          <div class="form-group">
            <label for="register-password">Password</label>
            <input type="password" id="register-password" required minlength="6" placeholder="Create a password">
          </div>
          
          <div class="form-group">
            <label for="register-color">Your Color</label>
            <input type="color" id="register-color" value="#4285F4">
          </div>
        </form>
      </div>
    </div>
  `;
  
  showModal('Welcome to Family Organizer', content, handleAuthSubmit);
  
  // Set up tab switching
  document.getElementById('login-tab').addEventListener('click', () => {
    document.getElementById('login-tab').classList.add('active');
    document.getElementById('register-tab').classList.remove('active');
    document.getElementById('login-form-container').classList.add('active');
    document.getElementById('register-form-container').classList.remove('active');
    
    // Update modal button text
    document.querySelector('.modal-confirm').textContent = 'Login';
  });
  
  document.getElementById('register-tab').addEventListener('click', () => {
    document.getElementById('login-tab').classList.remove('active');
    document.getElementById('register-tab').classList.add('active');
    document.getElementById('login-form-container').classList.remove('active');
    document.getElementById('register-form-container').classList.add('active');
    
    // Update modal button text
    document.querySelector('.modal-confirm').textContent = 'Register';
  });
  
  // Set initial button text
  document.querySelector('.modal-confirm').textContent = 'Login';
}

// Handle login/register form submission
function handleAuthSubmit() {
  // Check which tab is active
  const isLoginTab = document.getElementById('login-tab').classList.contains('active');
  
  if (isLoginTab) {
    // Handle login
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    handleLogin(email, password);
  } else {
    // Handle registration
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const color = document.getElementById('register-color').value;
    
    handleRegistration(name, email, password, color);
  }
}

// Handle login process
function handleLogin(email, password) {
  // Check if email exists in localStorage
  const usersString = localStorage.getItem('users');
  
  if (!usersString) {
    showNotification('No account found with this email', 'error');
    return;
  }
  
  const users = JSON.parse(usersString);
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    showNotification('No account found with this email', 'error');
    return;
  }
  
  // Check password
  if (user.password !== password) {
    showNotification('Incorrect password', 'error');
    return;
  }
  
  // Login successful
  user.lastLogin = new Date().toISOString();
  
  // Update users array
  const updatedUsers = users.map(u => u.id === user.id ? user : u);
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  
  // Store current user
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  // Update app state
  appState.currentUser = user;
  appState.isAuthenticated = true;
  
  // Update UI
  updateSignInStatus(true);
  
  // Load family members
  loadFamilyMembers();
  
  showNotification(`Welcome back, ${user.name}!`, 'success');
}

// Handle registration process
function handleRegistration(name, email, password, color) {
  // Check if email already exists
  let users = [];
  const usersString = localStorage.getItem('users');
  
  if (usersString) {
    users = JSON.parse(usersString);
    
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      showNotification('An account with this email already exists', 'error');
      return;
    }
  }
  
  // Create new user
  const newUser = {
    id: 'user_' + Date.now(),
    name: name,
    email: email,
    password: password, // In a real app, this should be hashed
    imageUrl: null,
    role: 'admin',
    color: color,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    notifications: 'all'
  };
  
  // Add to users array
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  // Store current user
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  
  // Update app state
  appState.currentUser = newUser;
  appState.isAuthenticated = true;
  
  // Initialize empty family members array
  appState.family = [];
  localStorage.setItem('familyMembers', JSON.stringify([]));
  
  // Update UI
  updateSignInStatus(true);
  
  showNotification(`Welcome, ${newUser.name}!`, 'success');
}

// Update UI based on sign-in status
function updateSignInStatus(isSignedIn) {
  const loginButton = document.getElementById('login-button');
  const userProfile = document.getElementById('user-profile');
  
  if (isSignedIn) {
    // User is signed in
    loginButton.classList.add('hidden');
    userProfile.classList.remove('hidden');
    
    // Set user information in the UI
    document.getElementById('user-name').textContent = appState.currentUser.name;
    
    if (appState.currentUser.imageUrl) {
      document.getElementById('user-avatar').src = appState.currentUser.imageUrl;
    } else {
      // Create initial-based avatar
      const initials = appState.currentUser.name.split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);
      
      document.getElementById('user-avatar').src = createInitialsAvatar(initials, appState.currentUser.color);
    }
    
    // Update current view based on login
    loadViewData(appState.currentView);
  } else {
    // User is signed out
    loginButton.classList.remove('hidden');
    userProfile.classList.add('hidden');
    
    // Clear user state
    appState.currentUser = null;
    appState.isAuthenticated = false;
    appState.family = [];
    
    // Update UI for logged-out state
    updateUIForLoggedOut();
    
    console.log('User is signed out');
  }
}

// Create a data URL for an initials avatar
function createInitialsAvatar(initials, bgColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  
  const ctx = canvas.getContext('2d');
  
  // Draw background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, canvas.width / 2, canvas.height / 2);
  
  return canvas.toDataURL('image/png');
}

// Handle logout
function handleLogout(event) {
  event.preventDefault();
  
  // Clear localStorage
  localStorage.removeItem('currentUser');
  
  // Update state
  appState.currentUser = null;
  appState.isAuthenticated = false;
  appState.family = [];
  
  // Update UI
  updateSignInStatus(false);
  
  showNotification('You have been signed out', 'info');
}

// Add a family member
async function addFamilyMember(memberData) {
  if (!appState.isAuthenticated) {
    showNotification('You must be logged in to add family members', 'error');
    return null;
  }
  
  try {
    // Generate a unique ID for the family member
    const memberId = 'member_' + Date.now();
    
    const newMember = {
      id: memberId,
      userId: appState.currentUser.id, // Associate with current user
      name: memberData.name,
      role: memberData.role || 'member',
      color: memberData.color || getNextFamilyColor(),
      pin: memberData.pin || null,
      birthdate: memberData.birthdate || null,
      createdAt: new Date().toISOString(),
      lastActivity: null,
      accessLevel: memberData.accessLevel || 'restricted',
      notes: memberData.notes || ''
    };
    
    // Add to app state
    appState.family.push(newMember);
    
    // Save to localStorage
    localStorage.setItem('familyMembers', JSON.stringify(appState.family));
    
    showNotification(`${newMember.name} added to your family`, 'success');
    return newMember;
  } catch (error) {
    console.error('Error adding family member:', error);
    showNotification('Failed to add family member', 'error');
    return null;
  }
}

// Get the next available color for a family member
function getNextFamilyColor() {
  const colors = [
    'var(--family-color-1)',
    'var(--family-color-2)',
    'var(--family-color-3)',
    'var(--family-color-4)',
    'var(--family-color-5)',
    'var(--family-color-6)'
  ];
  
  // Find which colors are already used
  const usedColors = appState.family.map(member => member.color);
  
  // Find the first unused color
  const availableColor = colors.find(color => !usedColors.includes(color));
  
  // Return the first unused color or the first color if all are used
  return availableColor || colors[0];
}