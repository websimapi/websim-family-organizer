// Family member management for the Family Organizer app

// Initialize family members view
function initFamilyView() {
  console.log('Initializing family members view');
  
  // Get the family container
  const familyView = document.getElementById('family-view');
  
  // Check if user is authenticated
  if (!appState.isAuthenticated) {
    familyView.innerHTML = `
      <h1>Family Members</h1>
      <div class="placeholder-message">
        <i class="material-icons">lock</i>
        <p>Please sign in to manage your family</p>
      </div>
    `;
    return;
  }
  
  // Show demo content for mock API mode
  if (config.useMockGoogleAPI) {
    createMockFamilyView(familyView);
    return;
  }
  
  // Placeholder content until family management is fully implemented
  familyView.innerHTML = `
    <h1>Family Members</h1>
    <div class="placeholder-message">
      <i class="material-icons">people</i>
      <p>Family member management coming soon</p>
    </div>
  `;
}

// Create mock family view for demo
function createMockFamilyView(container) {
  container.innerHTML = `
    <h1>Family Members</h1>
    
    <div class="family-controls">
      <button id="add-family-member" class="btn btn-primary">
        <i class="material-icons">person_add</i>
        <span>Add Family Member</span>
      </button>
    </div>
    
    <div class="family-members-grid">
      <!-- Primary User (You) -->
      <div class="family-card primary-user">
        <div class="member-avatar" style="background-color: ${appState.currentUser.color}">
          ${appState.currentUser.name.charAt(0).toUpperCase()}
        </div>
        <div class="member-details">
          <h3>${appState.currentUser.name} <span class="member-tag">You</span></h3>
          <p class="member-role">Account Owner</p>
          <p class="member-email">${appState.currentUser.email}</p>
        </div>
        <div class="member-actions">
          <button class="btn btn-icon"><i class="material-icons">settings</i></button>
        </div>
      </div>
      
      ${appState.family.map(member => `
        <div class="family-card">
          <div class="member-avatar" style="background-color: ${member.color}">
            ${member.name.charAt(0).toUpperCase()}
          </div>
          <div class="member-details">
            <h3>${member.name}</h3>
            <p class="member-role">${member.role.charAt(0).toUpperCase() + member.role.slice(1)}</p>
            ${member.birthdate ? `
              <p class="member-birthdate">
                <i class="material-icons">cake</i>
                ${new Date(member.birthdate).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            ` : ''}
          </div>
          <div class="member-actions">
            <button class="btn btn-icon edit-member" data-id="${member.id}"><i class="material-icons">edit</i></button>
            <button class="btn btn-icon delete-member" data-id="${member.id}"><i class="material-icons">delete</i></button>
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="family-sharing-section">
      <h2>Family Sharing</h2>
      <div class="sharing-options">
        <div class="sharing-card">
          <div class="sharing-icon">
            <i class="material-icons">calendar_today</i>
          </div>
          <div class="sharing-details">
            <h3>Calendar Sharing</h3>
            <p>Share your calendar with family members</p>
          </div>
          <div class="sharing-toggle">
            <label class="switch">
              <input type="checkbox" checked>
              <span class="slider round"></span>
            </label>
          </div>
        </div>
        
        <div class="sharing-card">
          <div class="sharing-icon">
            <i class="material-icons">assignment</i>
          </div>
          <div class="sharing-details">
            <h3>Task Assignments</h3>
            <p>Allow tasks to be assigned to family members</p>
          </div>
          <div class="sharing-toggle">
            <label class="switch">
              <input type="checkbox" checked>
              <span class="slider round"></span>
            </label>
          </div>
        </div>
        
        <div class="sharing-card">
          <div class="sharing-icon">
            <i class="material-icons">restaurant</i>
          </div>
          <div class="sharing-details">
            <h3>Meal Plan Sharing</h3>
            <p>Share meal plans with family members</p>
          </div>
          <div class="sharing-toggle">
            <label class="switch">
              <input type="checkbox" checked>
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add some basic styles for the mock family view
  const style = document.createElement('style');
  style.textContent = `
    .family-controls {
      margin-bottom: 24px;
    }
    
    .family-members-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    
    .family-card {
      display: flex;
      align-items: center;
      background-color: var(--background-light);
      border-radius: var(--border-radius);
      padding: 16px;
      box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
    }
    
    .primary-user {
      border-left: 4px solid var(--primary-color);
    }
    
    .member-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 500;
      color: white;
      margin-right: 16px;
    }
    
    .member-details {
      flex-grow: 1;
    }
    
    .member-details h3 {
      margin: 0 0 4px 0;
      font-size: 18px;
      display: flex;
      align-items: center;
    }
    
    .member-tag {
      background-color: var(--primary-color);
      color: white;
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: normal;
      margin-left: 8px;
    }
    
    .member-role {
      color: var(--text-secondary);
      margin: 0 0 4px 0;
      font-size: 14px;
    }
    
    .member-email, .member-birthdate {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: var(--text-secondary);
      margin: 0;
    }
    
    .member-birthdate .material-icons {
      font-size: 16px;
      margin-right: 4px;
    }
    
    .member-actions {
      display: flex;
    }
    
    .family-sharing-section {
      margin-top: 32px;
    }
    
    .family-sharing-section h2 {
      font-size: 20px;
      margin-bottom: 16px;
    }
    
    .sharing-options {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .sharing-card {
      display: flex;
      align-items: center;
      background-color: var(--background-light);
      border-radius: var(--border-radius);
      padding: 16px;
      box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3);
    }
    
    .sharing-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: var(--background-off);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
    }
    
    .sharing-icon .material-icons {
      font-size: 24px;
      color: var(--primary-color);
    }
    
    .sharing-details {
      flex-grow: 1;
    }
    
    .sharing-details h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
    }
    
    .sharing-details p {
      margin: 0;
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    /* Toggle Switch */
    .switch {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 24px;
    }
    
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
    }
    
    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
    }
    
    input:checked + .slider {
      background-color: var(--primary-color);
    }
    
    input:focus + .slider {
      box-shadow: 0 0 1px var(--primary-color);
    }
    
    input:checked + .slider:before {
      transform: translateX(24px);
    }
    
    .slider.round {
      border-radius: 34px;
    }
    
    .slider.round:before {
      border-radius: 50%;
    }
  `;
  
  document.head.appendChild(style);
  
  // Add event listeners
  container.querySelector('#add-family-member').addEventListener('click', () => {
    showAddFamilyMemberModal();
  });
  
  container.querySelectorAll('.edit-member').forEach(button => {
    button.addEventListener('click', (e) => {
      const memberId = e.currentTarget.dataset.id;
      const member = appState.family.find(m => m.id === memberId);
      if (member) {
        showEditFamilyMemberModal(member);
      }
    });
  });
  
  container.querySelectorAll('.delete-member').forEach(button => {
    button.addEventListener('click', (e) => {
      const memberId = e.currentTarget.dataset.id;
      const member = appState.family.find(m => m.id === memberId);
      if (member) {
        showDeleteFamilyMemberConfirmation(member);
      }
    });
  });
  
  // Add event listeners for toggles
  container.querySelectorAll('.switch input').forEach(toggle => {
    toggle.addEventListener('change', () => {
      showNotification('Sharing settings updated', 'success');
    });
  });
}

// Show add family member modal
function showAddFamilyMemberModal() {
  const colorOptions = [
    'var(--family-color-1)',
    'var(--family-color-2)',
    'var(--family-color-3)',
    'var(--family-color-4)',
    'var(--family-color-5)',
    'var(--family-color-6)'
  ];
  
  let colorOptionsHtml = '';
  colorOptions.forEach((color, index) => {
    colorOptionsHtml += `
      <label class="color-option">
        <input type="radio" name="member-color" value="${color}" ${index === 0 ? 'checked' : ''}>
        <span class="color-swatch" style="background-color: ${color}"></span>
      </label>
    `;
  });
  
  const content = `
    <form id="add-family-form" class="family-form">
      <div class="form-group">
        <label for="member-name">Name *</label>
        <input type="text" id="member-name" required placeholder="Enter name">
      </div>
      
      <div class="form-group">
        <label for="member-role">Role</label>
        <select id="member-role">
          <option value="spouse">Spouse/Partner</option>
          <option value="child">Child</option>
          <option value="parent">Parent</option>
          <option value="relative">Relative</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="member-birthdate">Birthdate</label>
        <input type="date" id="member-birthdate">
      </div>
      
      <div class="form-group">
        <label>Color</label>
        <div class="color-options">
          ${colorOptionsHtml}
        </div>
      </div>
      
      <div class="form-group">
        <label for="member-access">Access Level</label>
        <select id="member-access">
          <option value="full">Full Access</option>
          <option value="limited">Limited Access</option>
          <option value="view-only">View Only</option>
        </select>
      </div>
    </form>
    
    <style>
      .color-options {
        display: flex;
        gap: 10px;
        margin-top: 8px;
      }
      
      .color-option {
        cursor: pointer;
      }
      
      .color-option input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .color-swatch {
        display: block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        transition: all 0.2s;
      }
      
      .color-option input:checked + .color-swatch {
        box-shadow: 0 0 0 2px white, 0 0 0 4px var(--primary-color);
      }
    </style>
  `;
  
  showModal('Add Family Member', content, handleAddFamilyMember);
}

// Handle adding a family member
function handleAddFamilyMember() {
  const form = document.getElementById('add-family-form');
  
  // Basic validation
  if (!form.checkValidity()) {
    showNotification('Please fill out all required fields', 'error');
    return;
  }
  
  const name = document.getElementById('member-name').value;
  const role = document.getElementById('member-role').value;
  const birthdate = document.getElementById('member-birthdate').value;
  const accessLevel = document.getElementById('member-access').value;
  
  // Get selected color
  const colorInput = document.querySelector('input[name="member-color"]:checked');
  const color = colorInput ? colorInput.value : 'var(--family-color-1)';
  
  // Create new family member
  const newMember = {
    id: 'member_' + Date.now(),
    userId: appState.currentUser.id,
    name: name,
    role: role,
    color: color,
    birthdate: birthdate || null,
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    accessLevel: accessLevel
  };
  
  // Add to app state
  appState.family.push(newMember);
  
  showNotification(`${name} added to your family`, 'success');
  
  // Refresh family view
  initFamilyView();
}

// Show edit family member modal
function showEditFamilyMemberModal(member) {
  const colorOptions = [
    'var(--family-color-1)',
    'var(--family-color-2)',
    'var(--family-color-3)',
    'var(--family-color-4)',
    'var(--family-color-5)',
    'var(--family-color-6)'
  ];
  
  let colorOptionsHtml = '';
  colorOptions.forEach(color => {
    const isChecked = color === member.color;
    colorOptionsHtml += `
      <label class="color-option">
        <input type="radio" name="member-color" value="${color}" ${isChecked ? 'checked' : ''}>
        <span class="color-swatch" style="background-color: ${color}"></span>
      </label>
    `;
  });
  
  const content = `
    <form id="edit-family-form" class="family-form" data-id="${member.id}">
      <div class="form-group">
        <label for="member-name">Name *</label>
        <input type="text" id="member-name" required placeholder="Enter name" value="${member.name}">
      </div>
      
      <div class="form-group">
        <label for="member-role">Role</label>
        <select id="member-role">
          <option value="spouse" ${member.role === 'spouse' ? 'selected' : ''}>Spouse/Partner</option>
          <option value="child" ${member.role === 'child' ? 'selected' : ''}>Child</option>
          <option value="parent" ${member.role === 'parent' ? 'selected' : ''}>Parent</option>
          <option value="relative" ${member.role === 'relative' ? 'selected' : ''}>Relative</option>
          <option value="other" ${member.role === 'other' ? 'selected' : ''}>Other</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="member-birthdate">Birthdate</label>
        <input type="date" id="member-birthdate" value="${member.birthdate || ''}">
      </div>
      
      <div class="form-group">
        <label>Color</label>
        <div class="color-options">
          ${colorOptionsHtml}
        </div>
      </div>
      
      <div class="form-group">
        <label for="member-access">Access Level</label>
        <select id="member-access">
          <option value="full" ${member.accessLevel === 'full' ? 'selected' : ''}>Full Access</option>
          <option value="limited" ${member.accessLevel === 'limited' ? 'selected' : ''}>Limited Access</option>
          <option value="view-only" ${member.accessLevel === 'view-only' ? 'selected' : ''}>View Only</option>
        </select>
      </div>
    </form>
    
    <style>
      .color-options {
        display: flex;
        gap: 10px;
        margin-top: 8px;
      }
      
      .color-option {
        cursor: pointer;
      }
      
      .color-option input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .color-swatch {
        display: block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        transition: all 0.2s;
      }
      
      .color-option input:checked + .color-swatch {
        box-shadow: 0 0 0 2px white, 0 0 0 4px var(--primary-color);
      }
    </style>
  `;
  
  showModal('Edit Family Member', content, () => handleUpdateFamilyMember(member));
}

// Handle updating a family member
function handleUpdateFamilyMember(member) {
  const form = document.getElementById('edit-family-form');
  
  // Basic validation
  if (!form.checkValidity()) {
    showNotification('Please fill out all required fields', 'error');
    return;
  }
  
  const memberId = form.dataset.id;
  const name = document.getElementById('member-name').value;
  const role = document.getElementById('member-role').value;
  const birthdate = document.getElementById('member-birthdate').value;
  const accessLevel = document.getElementById('member-access').value;
  
  // Get selected color
  const colorInput = document.querySelector('input[name="member-color"]:checked');
  const color = colorInput ? colorInput.value : member.color;
  
  // Find and update member in appState
  const memberIndex = appState.family.findIndex(m => m.id === memberId);
  if (memberIndex !== -1) {
    // Update member
    appState.family[memberIndex] = {
      ...appState.family[memberIndex],
      name,
      role,
      color,
      birthdate: birthdate || null,
      accessLevel,
      lastActivity: new Date().toISOString()
    };
    
    showNotification(`${name} updated successfully`, 'success');
    
    // Refresh family view
    initFamilyView();
  }
}

// Show delete family member confirmation
function showDeleteFamilyMemberConfirmation(member) {
  const content = `
    <div class="confirmation-dialog">
      <p>Are you sure you want to remove ${member.name} from your family?</p>
      <p>This action cannot be undone.</p>
    </div>
  `;
  
  showModal('Remove Family Member', content, () => handleDeleteFamilyMember(member));
}

// Handle deleting a family member
function handleDeleteFamilyMember(member) {
  // Find and remove member from appState
  const memberIndex = appState.family.findIndex(m => m.id === member.id);
  if (memberIndex !== -1) {
    appState.family.splice(memberIndex, 1);
    
    showNotification(`${member.name} removed from your family`, 'success');
    
    // Refresh family view
    initFamilyView();
  }
}

// Get family members 
async function getFamilyMembers() {
  if (appState.family) {
    return appState.family;
  }
  return [];
}