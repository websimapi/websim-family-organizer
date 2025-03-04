// Authentication functionality for the Family Organizer app

// Google Auth object
let googleAuth = null;

// Initialize Google authentication
function initGoogleAuth() {
  console.log('Initializing Google authentication...');
  
  // Load the Google API client
  gapi.load('client:auth2', initGoogleClient);
  
  // Set up auth-related DOM event listeners
  document.getElementById('login-button').addEventListener('click', handleLogin);
}

// Initialize Google API client
async function initGoogleClient() {
  try {
    await gapi.client.init({
      apiKey: config.googleApiKey,
      clientId: config.googleClientId,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: config.calendarScopes,
      ux_mode: 'popup',
      redirect_uri: window.location.origin
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
async function updateSignInStatus(isSignedIn, googleUser = null) {
  const loginButton = document.getElementById('login-button');
  const userProfile = document.getElementById('user-profile');
  
  if (isSignedIn) {
    // User is signed in
    loginButton.classList.add('hidden');
    userProfile.classList.remove('hidden');
    
    // Get user info - either from Google or from our bridge
    let profile;
    if (googleUser) {
      profile = googleUser.getBasicProfile ? googleUser.getBasicProfile() : googleUser;
    } else {
      googleUser = googleAuth.currentUser.get();
      profile = googleUser.getBasicProfile();
    }
    
    // Set user information in the UI
    document.getElementById('user-name').textContent = profile.getName ? profile.getName() : profile.name;
    document.getElementById('user-avatar').src = profile.getImageUrl ? profile.getImageUrl() : profile.imageUrl;
    
    // Create user object
    const user = {
      id: profile.getId ? profile.getId() : profile.id,
      name: profile.getName ? profile.getName() : profile.name,
      email: profile.getEmail ? profile.getEmail() : profile.email,
      imageUrl: profile.getImageUrl ? profile.getImageUrl() : profile.imageUrl,
      role: 'admin', // Default role for Google account
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      authProvider: 'google',
      accessToken: googleUser.getAuthResponse ? googleUser.getAuthResponse().access_token : googleUser.access_token,
      refreshToken: localStorage.getItem('googleRefreshToken') || null,
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
  // Check for local WebSocket connection to the Python bridge first
  const socket = new WebSocket('ws://localhost:8765');
  
  socket.onopen = function() {
    showNotification('Connected to local authentication bridge!', 'success');
    socket.close();
    
    // Initiate Google auth directly in the browser
    if (gapi && gapi.auth2) {
      gapi.auth2.getAuthInstance().signIn({
        ux_mode: 'popup',
        prompt: 'select_account'
      }).catch(error => {
        console.error('Error signing in:', error);
        showErrorNotification(error);
      });
    } else {
      showNotification('Google authentication is not initialized yet. Please try again in a moment.', 'error');
    }
  };
  
  socket.onerror = function() {
    showNotification('Could not connect to local authentication bridge. Using browser-only authentication.', 'warning');
    
    // Only trigger download of Python bridge script if connection failed
    downloadPythonBridge();
    
    // Fall back to direct Google auth
    if (gapi && gapi.auth2) {
      gapi.auth2.getAuthInstance().signIn({
        ux_mode: 'popup',
        prompt: 'select_account'
      }).catch(error => {
        console.error('Error signing in:', error);
        showErrorNotification(error);
      });
    } else {
      showNotification('Google authentication is not initialized yet. Please try again in a moment.', 'error');
    }
  };
  
  socket.onclose = function() {
    console.log('Connection to local bridge closed');
  };
}

// Download Python bridge script
function downloadPythonBridge() {
  const bridgeScript = createPythonBridgeScript();
  const blob = new Blob([bridgeScript], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'google_auth_bridge.py';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  showNotification('Python bridge script downloaded. Please run it on your Raspberry Pi to enable Google login.', 'info');
}

// Create Python bridge script content
function createPythonBridgeScript() {
  return `#!/usr/bin/env python3
# Google Auth Bridge for Family Organizer
# Run this script on a Raspberry Pi to enable Google authentication

import asyncio
import json
import sys
import os
import websockets
from http.server import HTTPServer, BaseHTTPRequestHandler

# Configuration
API_KEY = os.environ.get('GOOGLE_API_KEY')
CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')

# Ask for API keys if not provided
if not API_KEY:
    API_KEY = input("Enter your Google API Key: ")
if not CLIENT_ID:
    CLIENT_ID = input("Enter your Google Client ID: ")

print("Starting Google Auth Bridge for Family Organizer...")
print("API Key:", API_KEY[:5] + "..." if API_KEY else "Not provided")
print("Client ID:", CLIENT_ID[:10] + "..." if CLIENT_ID else "Not provided")

# Web socket server to communicate with the web app
async def auth_bridge(websocket, path):
    print("Web client connected")
    # The bridge now just confirms connectivity but doesn't trigger auth flow
    # Authentication happens directly in the browser

# HTTP server to handle OAuth callback
class CallbackHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/callback'):
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            # Display success message to user
            self.wfile.write(b"""
                <html>
                <body>
                    <h1>Bridge Connected</h1>
                    <p>You can close this window and return to the Family Organizer app.</p>
                </body>
                </html>
            """)

# Start both servers
async def main():
    # Start websocket server
    ws_server = await websockets.serve(auth_bridge, "localhost", 8765)
    
    # Start HTTP server for OAuth callback
    http_server = HTTPServer(('localhost', 8000), CallbackHandler)
    import threading
    threading.Thread(target=http_server.serve_forever, daemon=True).start()
    
    print("Bridge servers started!")
    print("WebSocket server running on ws://localhost:8765")
    print("HTTP callback server running on http://localhost:8000")
    
    # Keep the server running
    await asyncio.Future()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Bridge servers stopped.")
        sys.exit(0)
`;
}

// Store authentication tokens
function storeAuthTokens(accessToken, refreshToken) {
  // Store in localStorage or your preferred secure storage
  localStorage.setItem('googleAccessToken', accessToken);
  if (refreshToken) {
    localStorage.setItem('googleRefreshToken', refreshToken);
  }
}

// Create a mock GoogleUser object for compatibility with existing code
function createMockGoogleUser(accessToken) {
  return {
    getBasicProfile: () => ({
      getId: () => 'bridge_user_id',
      getName: () => 'Raspberry Pi Bridge User',
      getEmail: () => 'bridge@example.com',
      getImageUrl: () => 'https://via.placeholder.com/32x32'
    }),
    getAuthResponse: () => ({
      access_token: accessToken
    })
  };
}

// Show error notification based on error type
function showErrorNotification(error) {
  if (error.error === 'popup_blocked_by_browser') {
    showNotification('Please allow popups for this site to sign in with Google', 'warning');
  } else if (error.error === 'access_denied') {
    showNotification('Sign-in was cancelled', 'info');
  } else {
    showNotification('Failed to sign in with Google', 'error');
  }
}

// Handle logout
function handleLogout(event) {
  event.preventDefault();
  
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