// Authentication functionality for the Family Organizer app

// Google Auth object
let googleAuth = null;

// Initialize Google authentication
function initGoogleAuth() {
  console.log('Initializing Google authentication...');
  
  if (config.useMockGoogleAPI) {
    // Use mock authentication instead of actual Google Auth
    initMockGoogleAuth();
    return;
  }
  
  // Load the Google API client
  gapi.load('client:auth2', initGoogleClient);
  
  // Set up auth-related DOM event listeners
  document.getElementById('login-button').addEventListener('click', handleLogin);
}

// Initialize mock Google authentication for development/demo
function initMockGoogleAuth() {
  console.log('Using mock Google authentication');
  
  // Set up the login button
  document.getElementById('login-button').addEventListener('click', handleMockLogin);
  
  // If we're in "auto-login" mode, trigger login automatically
  if (localStorage.getItem('autoLogin') === 'true') {
    setTimeout(handleMockLogin, 1000);
  }
}

// Handle mock login
function handleMockLogin() {
  const mockUser = {
    id: 'mock-user-123',
    name: 'Demo User',
    email: 'demo@example.com',
    imageUrl: 'https://ui-avatars.com/api/?name=Demo+User&background=4285F4&color=fff',
    role: 'admin',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    authProvider: 'google',
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    color: '#4285F4',
    notifications: 'all'
  };
  
  // Update app state
  appState.currentUser = mockUser;
  appState.isAuthenticated = true;
  
  // Update UI
  updateSignInStatus(true);
  
  // Store in local storage for "auto-login"
  localStorage.setItem('autoLogin', 'true');
  
  showNotification('Signed in with mock Google account', 'success');
}

// Handle mock logout
function handleMockLogout(event) {
  if (event) event.preventDefault();
  
  // Clear mock user data
  appState.currentUser = null;
  appState.isAuthenticated = false;
  appState.family = [];
  
  // Update UI
  updateSignInStatus(false);
  
  // Clear auto-login
  localStorage.removeItem('autoLogin');
  
  showNotification('You have been signed out', 'info');
}

// Initialize Google API client
async function initGoogleClient() {
  try {
    await gapi.client.init({
      apiKey: config.googleApiKey,
      clientId: config.googleClientId,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: config.calendarScopes
    });
    
    // Get the GoogleAuth instance
    googleAuth = gapi.auth2.getAuthInstance();
    
    // Listen for sign-in state changes
    googleAuth.isSignedIn.listen(updateSignInStatus);
    
    // Handle the initial sign-in state
    updateSignInStatus(googleAuth.isSignedIn.get());
    
    console.log('Google client initialized');
  } catch (error) {
    console.error('Error initializing Google client:', error);
    showNotification('Failed to initialize Google services', 'error');
  }
}

// Update UI based on sign-in status
async function updateSignInStatus(isSignedIn) {
  const loginButton = document.getElementById('login-button');
  const userProfile = document.getElementById('user-profile');
  
  if (isSignedIn) {
    // User is signed in
    loginButton.classList.add('hidden');
    userProfile.classList.remove('hidden');
    
    if (config.useMockGoogleAPI) {
      // Using mock data
      const profile = appState.currentUser;
      
      // Set user information in the UI
      document.getElementById('user-name').textContent = profile.name;
      document.getElementById('user-avatar').src = profile.imageUrl;
      
      // Create mock family members
      const mockFamily = [
        {
          id: 'member_1',
          userId: profile.id,
          name: 'Alex Smith',
          role: 'spouse',
          color: 'var(--family-color-2)',
          birthdate: '1985-06-15',
          createdAt: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        },
        {
          id: 'member_2',
          userId: profile.id,
          name: 'Emma Smith',
          role: 'child',
          color: 'var(--family-color-3)',
          birthdate: '2010-03-22',
          createdAt: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        },
        {
          id: 'member_3',
          userId: profile.id,
          name: 'Liam Smith',
          role: 'child',
          color: 'var(--family-color-4)',
          birthdate: '2013-11-08',
          createdAt: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        }
      ];
      
      appState.family = mockFamily;
      
      // Load view data
      loadViewData(appState.currentView);
      
      // Create mock calendar data
      initMockCalendarData();
      
      showNotification(`Welcome, ${profile.name}!`, 'success');
    } else {
      // User is signed in
      // Get user info
      const googleUser = googleAuth.currentUser.get();
      const profile = googleUser.getBasicProfile();
      
      // Set user information in the UI
      document.getElementById('user-name').textContent = profile.getName();
      document.getElementById('user-avatar').src = profile.getImageUrl();
      
      // Create user object
      const user = {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        imageUrl: profile.getImageUrl(),
        role: 'admin', // Default role for Google account
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        authProvider: 'google',
        accessToken: googleUser.getAuthResponse().access_token,
        refreshToken: null, // Not available in client-side flow
        color: '#4285F4', // Default color
        notifications: 'all', // Default notification setting
      };
      
      // Update app state
      appState.currentUser = user;
      appState.isAuthenticated = true;
      
      // Store/update user in the database
      try {
        // Check if user already exists
        const existingUser = await getUserById(user.id);
        
        if (existingUser) {
          // Update existing user
          user.color = existingUser.color;
          user.notifications = existingUser.notifications;
          user.role = existingUser.role;
          user.createdAt = existingUser.createdAt;
          await updateUser(user);
        } else {
          // Create new user
          await addUser(user);
        }
        
        // Load family members associated with this user
        const familyMembers = await getFamilyMembersByUserId(user.id);
        appState.family = familyMembers;
        
        // Update current view based on login
        loadViewData(appState.currentView);
        
        // Start syncing with Google Calendar
        initCalendarSync();
        
        showNotification(`Welcome, ${user.name}!`, 'success');
      } catch (error) {
        console.error('Error updating user data:', error);
        showNotification('Error updating user profile', 'error');
      }
    }
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

// Handle login button click
function handleLogin() {
  if (!googleAuth) {
    showNotification('Google authentication is not initialized yet. Please try again in a moment.', 'error');
    return;
  }
  
  googleAuth.signIn().catch(error => {
    console.error('Error signing in:', error);
    
    if (error.error === 'popup_blocked_by_browser') {
      showNotification('Please allow popups for this site to sign in with Google', 'warning');
    } else if (error.error === 'access_denied') {
      showNotification('Sign-in was cancelled', 'info');
    } else {
      showNotification('Failed to sign in with Google', 'error');
    }
  });
}

// Handle logout button click
function handleLogout(event) {
  event.preventDefault();
  
  if (config.useMockGoogleAPI) {
    handleMockLogout();
    return;
  }
  
  if (!googleAuth) {
    showNotification('Google authentication is not initialized', 'error');
    return;
  }
  
  googleAuth.signOut().then(() => {
    showNotification('You have been signed out', 'info');
  }).catch(error => {
    console.error('Error signing out:', error);
    showNotification('Failed to sign out', 'error');
  });
}

// Update UI for logged-out state
function updateUIForLoggedOut() {
  // Clear any personal data from the UI
  document.querySelectorAll('.placeholder-message').forEach(placeholder => {
    if (placeholder.parentElement.id === 'today-events') {
      placeholder.querySelector('p').textContent = 'Please sign in to view your events';
    } else if (placeholder.parentElement.id === 'today-tasks') {
      placeholder.querySelector('p').textContent = 'Please sign in to view your tasks';
    } else if (placeholder.parentElement.id === 'today-meals') {
      placeholder.querySelector('p').textContent = 'Please sign in to view your meal plan';
    } else if (placeholder.parentElement.id === 'family-members') {
      placeholder.querySelector('p').textContent = 'Please sign in to view your family';
    }
  });
  
  // Clear calendar if visible
  const calendarContainer = document.getElementById('calendar-container');
  if (calendarContainer) {
    calendarContainer.innerHTML = `
      <div class="placeholder-message">
        <i class="material-icons">lock</i>
        <p>Please sign in to access your calendar</p>
      </div>
    `;
  }
}

// Check if current auth token is valid
async function isAuthTokenValid() {
  if (config.useMockGoogleAPI) {
    return true; // Mock token is always valid
  }
  
  if (!appState.isAuthenticated || !appState.currentUser || !appState.currentUser.accessToken) {
    return false;
  }
  
  try {
    // Make a test API call to check token validity
    await gapi.client.calendar.calendarList.list({
      maxResults: 1
    });
    return true;
  } catch (error) {
    console.error('Auth token validation failed:', error);
    return false;
  }
}

// Refresh the access token if needed
async function refreshAuthToken() {
  if (config.useMockGoogleAPI) {
    return true; // Mock token refresh always succeeds
  }
  
  if (!googleAuth) return false;
  
  try {
    const currentUser = googleAuth.currentUser.get();
    const authResponse = await currentUser.reloadAuthResponse();
    
    // Update the token in appState
    if (appState.currentUser) {
      appState.currentUser.accessToken = authResponse.access_token;
      await updateUser(appState.currentUser);
    }
    
    return true;
  } catch (error) {
    console.error('Error refreshing auth token:', error);
    return false;
  }
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
      accessLevel: memberData.accessLevel || 'restricted'
    };
    
    await addFamilyMember(newMember);
    
    // Add to app state
    appState.family.push(newMember);
    
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

// Create mock calendar data
function initMockCalendarData() {
  // Implement mock calendar data creation
}