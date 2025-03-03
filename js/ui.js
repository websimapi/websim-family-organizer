// UI-related functionality for the Family Organizer app

// Initialize UI components
function initUI() {
  console.log('Initializing UI components...');
  
  // Set up notification system
  setupNotifications();
  
  // Handle initial URL hash if present
  handleHashChange();
  
  // Initialize the view based on current hash or default to dashboard
  const hash = window.location.hash.substring(1);
  changeView(hash || 'dashboard');
}

// Set up notification system
function setupNotifications() {
  // Create notification container if it doesn't exist
  if (!document.getElementById('notification-container')) {
    const container = document.createElement('div');
    container.id = 'notification-container';
    document.body.appendChild(container);
  }
}

// Show a notification to the user
function showNotification(message, type = 'info') {
  const container = document.getElementById('notification-container');
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  // Set icon based on notification type
  let icon = 'info';
  switch (type) {
    case 'success':
      icon = 'check_circle';
      break;
    case 'error':
      icon = 'error';
      break;
    case 'warning':
      icon = 'warning';
      break;
  }
  
  notification.innerHTML = `
    <i class="material-icons">${icon}</i>
    <div class="notification-content">${message}</div>
    <div class="notification-close"><i class="material-icons">close</i></div>
  `;
  
  // Add to container
  container.appendChild(notification);
  
  // Set up auto-dismiss
  const dismissTimeout = setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.add('fade-out');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }, 5000);
  
  // Set up close button
  notification.querySelector('.notification-close').addEventListener('click', () => {
    clearTimeout(dismissTimeout);
    if (notification.parentNode) {
      notification.classList.add('fade-out');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  });
  
  return notification;
}

// Change view active view
function changeView(viewName) {
  if (!viewName || viewName === appState.currentView) return;
  
  // Update navigation items
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.dataset.view === viewName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Update view containers
  document.querySelectorAll('.view-container').forEach(container => {
    if (container.id === `${viewName}-view`) {
      container.classList.add('active-view');
    } else {
      container.classList.remove('active-view');
    }
  });
  
  // Update URL hash
  window.location.hash = viewName;
  
  // Update current view in app state
  appState.currentView = viewName;
  
  // Load view-specific data
  loadViewData(viewName);
}