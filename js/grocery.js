// Grocery list functionality for the Family Organizer app

// Initialize grocery view
function initGroceryView() {
  console.log('Initializing grocery view');
  
  // Get the grocery container
  const groceryView = document.getElementById('grocery-view');
  
  // Check if user is authenticated
  if (!appState.isAuthenticated) {
    groceryView.innerHTML = `
      <h1>Grocery List</h1>
      <div class="placeholder-message">
        <i class="material-icons">lock</i>
        <p>Please sign in to manage your grocery lists</p>
      </div>
    `;
    return;
  }
  
  // Load grocery interface
  loadGroceryList();
}

// Load grocery list interface
async function loadGroceryList() {
  try {
    // Get the grocery container
    const groceryView = document.getElementById('grocery-view');
    
    // Create grocery list interface
    groceryView.innerHTML = `
      <h1>Grocery List</h1>
      
      <div class="grocery-controls">
        <div class="list-controls">
          <button id="new-list-btn" class="btn btn-outline">
            <i class="material-icons">playlist_add</i>
            <span>New List</span>
          </button>
          <select id="list-filter">
            <option value="active">Current Items</option>
            <option value="completed">Completed Items</option>
            <option value="all">All Items</option>
          </select>
        </div>
        
        <div class="item-controls">
          <button id="add-item-btn" class="btn btn-primary">
            <i class="material-icons">add</i>
            <span>Add Item</span>
          </button>
          <button id="clear-completed-btn" class="btn btn-outline">
            <i class="material-icons">delete_sweep</i>
            <span>Clear Completed</span>
          </button>
        </div>
      </div>
      
      <div class="grocery-content">
        <div class="categories-sidebar">
          <div class="category-item selected" data-category="all">
            <i class="material-icons">list</i>
            <span>All Items</span>
            <span class="item-count" id="all-count">0</span>
          </div>
          <div class="category-item" data-category="produce">
            <i class="material-icons">eco</i>
            <span>Produce</span>
            <span class="item-count" id="produce-count">0</span>
          </div>
          <div class="category-item" data-category="dairy">
            <i class="material-icons">opacity</i>
            <span>Dairy</span>
            <span class="item-count" id="dairy-count">0</span>
          </div>
          <div class="category-item" data-category="meat">
            <i class="material-icons">restaurant</i>
            <span>Meat</span>
            <span class="item-count" id="meat-count">0</span>
          </div>
          <div class="category-item" data-category="bakery">
            <i class="material-icons">cake</i>
            <span>Bakery</span>
            <span class="item-count" id="bakery-count">0</span>
          </div>
          <div class="category-item" data-category="canned">
            <i class="material-icons">lunch_dining</i>
            <span>Canned & Packaged</span>
            <span class="item-count" id="canned-count">0</span>
          </div>
          <div class="category-item" data-category="frozen">
            <i class="material-icons">ac_unit</i>
            <span>Frozen</span>
            <span class="item-count" id="frozen-count">0</span>
          </div>
          <div class="category-item" data-category="beverages">
            <i class="material-icons">local_drink</i>
            <span>Beverages</span>
            <span class="item-count" id="beverages-count">0</span>
          </div>
          <div class="category-item" data-category="household">
            <i class="material-icons">home</i>
            <span>Household</span>
            <span class="item-count" id="household-count">0</span>
          </div>
          <div class="category-item" data-category="other">
            <i class="material-icons">more_horiz</i>
            <span>Other</span>
            <span class="item-count" id="other-count">0</span>
          </div>
        </div>
        
        <div class="grocery-items-container">
          <div class="grocery-header">
            <div class="search-bar">
              <i class="material-icons">search</i>
              <input type="text" id="item-search" placeholder="Search items...">
            </div>
            <div class="sort-controls">
              <label for="sort-by">Sort by:</label>
              <select id="sort-by">
                <option value="category">Category</option>
                <option value="name">Name</option>
                <option value="date">Date Added</option>
              </select>
            </div>
          </div>
          
          <div class="grocery-list" id="grocery-items">
            <!-- Grocery items will be loaded here -->
            <div class="placeholder-message">
              <i class="material-icons">shopping_cart</i>
              <p>Your grocery list is empty</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Set up event listeners
    document.getElementById('new-list-btn').addEventListener('click', createNewList);
    document.getElementById('add-item-btn').addEventListener('click', showAddItemModal);
    document.getElementById('clear-completed-btn').addEventListener('click', clearCompletedItems);
    document.getElementById('list-filter').addEventListener('change', filterItems);
    document.getElementById('sort-by').addEventListener('change', sortItems);
    document.getElementById('item-search').addEventListener('input', searchItems);
    
    // Set up category filters
    document.querySelectorAll('.category-item').forEach(category => {
      category.addEventListener('click', () => {
        // Remove selected class from all categories
        document.querySelectorAll('.category-item').forEach(c => c.classList.remove('selected'));
        // Add selected class to clicked category
        category.classList.add('selected');
        // Filter items by category
        filterItemsByCategory(category.dataset.category);
      });
    });
    
    // Load grocery items
    await refreshGroceryItems();
    
  } catch (error) {
    console.error('Error loading grocery list:', error);
    showNotification('Failed to load grocery list', 'error');
  }
}

// Refresh grocery items from database
async function refreshGroceryItems() {
  try {
    // Get items from database
    const items = await getGroceryItems();
    
    // Get filter and sort values
    const filterValue = document.getElementById('list-filter').value;
    const sortValue = document.getElementById('sort-by').value;
    const activeCategory = document.querySelector('.category-item.selected').dataset.category;
    
    // Apply filters
    let filteredItems = filterItemsByStatus(items, filterValue);
    
    // Only filter by category if not "all"
    if (activeCategory !== 'all') {
      filteredItems = filteredItems.filter(item => item.category === activeCategory);
    }
    
    // Apply sorting
    sortItemsBy(filteredItems, sortValue);
    
    // Update the UI
    updateGroceryItemsUI(filteredItems);
    
    // Update category counts
    updateCategoryCounts(items);
    
    return filteredItems;
  } catch (error) {
    console.error('Error refreshing grocery items:', error);
    showNotification('Failed to load grocery items', 'error');
    return [];
  }
}

// Filter items by status
function filterItemsByStatus(items, filterValue) {
  switch (filterValue) {
    case 'active':
      return items.filter(item => !item.completed);
    case 'completed':
      return items.filter(item => item.completed);
    case 'all':
    default:
      return items;
  }
}

// Filter items by category
function filterItemsByCategory(category) {
  // Trigger refresh with current filters
  refreshGroceryItems();
}

// Sort items by specified field
function sortItemsBy(items, sortValue) {
  switch (sortValue) {
    case 'name':
      items.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'date':
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'category':
    default:
      items.sort((a, b) => a.category.localeCompare(b.category));
      break;
  }
  return items;
}

// Update the grocery items UI
function updateGroceryItemsUI(items) {
  const container = document.getElementById('grocery-items');
  
  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="placeholder-message">
        <i class="material-icons">shopping_cart</i>
        <p>Your grocery list is empty</p>
      </div>
    `;
    return;
  }
  
  // Group items by category
  const itemsByCategory = {};
  items.forEach(item => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = [];
    }
    itemsByCategory[item.category].push(item);
  });
  
  let html = '';
  
  // Generate HTML for each category
  Object.keys(itemsByCategory).sort().forEach(category => {
    html += `
      <div class="category-group">
        <div class="category-header">
          <h3>${capitalizeFirstLetter(category)}</h3>
        </div>
        <div class="category-items">
    `;
    
    // Add items for this category
    itemsByCategory[category].forEach(item => {
      html += `
        <div class="grocery-item ${item.completed ? 'completed' : ''}" data-item-id="${item.id}">
          <div class="item-checkbox">
            <input type="checkbox" id="item-${item.id}" ${item.completed ? 'checked' : ''}>
            <label for="item-${item.id}"></label>
          </div>
          <div class="item-content">
            <div class="item-name-container">
              <div class="item-name">${item.name}</div>
              ${item.quantity ? `<div class="item-quantity">${item.quantity} ${item.unit || ''}</div>` : ''}
            </div>
            ${item.notes ? `<div class="item-notes">${item.notes}</div>` : ''}
          </div>
          <div class="item-actions">
            <button class="btn btn-icon edit-item-btn" data-item-id="${item.id}">
              <i class="material-icons">edit</i>
            </button>
            <button class="btn btn-icon delete-item-btn" data-item-id="${item.id}">
              <i class="material-icons">delete</i>
            </button>
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  // Add event listeners
  container.querySelectorAll('.item-checkbox input').forEach(checkbox => {
    checkbox.addEventListener('change', handleItemCheckboxChange);
  });
  
  container.querySelectorAll('.edit-item-btn').forEach(button => {
    button.addEventListener('click', handleEditItemClick);
  });
  
  container.querySelectorAll('.delete-item-btn').forEach(button => {
    button.addEventListener('click', handleDeleteItemClick);
  });
}

// Update category counts
function updateCategoryCounts(items) {
  // Count items in each category
  const counts = {
    all: items.length,
    produce: 0,
    dairy: 0,
    meat: 0,
    bakery: 0,
    canned: 0,
    frozen: 0,
    beverages: 0,
    household: 0,
    other: 0
  };
  
  // Count items by category
  items.forEach(item => {
    if (counts[item.category] !== undefined) {
      counts[item.category]++;
    } else {
      counts.other++;
    }
  });
  
  // Update count elements
  Object.keys(counts).forEach(category => {
    const countElement = document.getElementById(`${category}-count`);
    if (countElement) {
      countElement.textContent = counts[category];
    }
  });
}

// Handle item checkbox change
async function handleItemCheckboxChange(event) {
  const checkbox = event.target;
  const itemId = checkbox.id.replace('item-', '');
  const completed = checkbox.checked;
  
  try {
    // Get the item from database
    const item = await getGroceryItemById(itemId);
    if (!item) {
      showNotification('Item not found', 'error');
      return;
    }
    
    // Update item
    item.completed = completed;
    item.updatedAt = new Date().toISOString();
    
    // Save to database
    await updateGroceryItem(item);
    
    // Update UI
    const itemElement = checkbox.closest('.grocery-item');
    if (completed) {
      itemElement.classList.add('completed');
    } else {
      itemElement.classList.remove('completed');
    }
    
    showNotification(`Item marked as ${completed ? 'purchased' : 'needed'}`, 'success');
  } catch (error) {
    console.error('Error updating item:', error);
    showNotification('Failed to update item', 'error');
    
    // Revert checkbox state
    checkbox.checked = !completed;
  }
}

// Filter items based on selected filter
function filterItems() {
  refreshGroceryItems();
}

// Sort items based on selected sort option
function sortItems() {
  refreshGroceryItems();
}

// Search items by name
function searchItems() {
  const searchTerm = document.getElementById('item-search').value.toLowerCase();
  
  // Get all grocery items
  getGroceryItems().then(items => {
    // Filter items by search term
    const filteredItems = searchTerm 
      ? items.filter(item => item.name.toLowerCase().includes(searchTerm))
      : items;
    
    // Apply current filters
    const filterValue = document.getElementById('list-filter').value;
    let results = filterItemsByStatus(filteredItems, filterValue);
    
    // Apply current sort
    const sortValue = document.getElementById('sort-by').value;
    sortItemsBy(results, sortValue);
    
    // Update UI
    updateGroceryItemsUI(results);
  });
}

// Show add item modal
function showAddItemModal() {
  const content = `
    <form id="add-item-form" class="item-form">
      <div class="form-group">
        <label for="item-name">Item Name *</label>
        <input type="text" id="item-name" required placeholder="Enter item name">
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="item-quantity">Quantity</label>
          <input type="number" id="item-quantity" min="1" value="1">
        </div>
        
        <div class="form-group">
          <label for="item-unit">Unit</label>
          <select id="item-unit">
            <option value="">Select unit</option>
            <option value="pkg">Package</option>
            <option value="lb">Pound (lb)</option>
            <option value="oz">Ounce (oz)</option>
            <option value="g">Gram (g)</option>
            <option value="kg">Kilogram (kg)</option>
            <option value="l">Liter (l)</option>
            <option value="ml">Milliliter (ml)</option>
            <option value="ea">Each</option>
            <option value="doz">Dozen</option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label for="item-category">Category</label>
        <select id="item-category" required>
          <option value="produce">Produce</option>
          <option value="dairy">Dairy</option>
          <option value="meat">Meat</option>
          <option value="bakery">Bakery</option>
          <option value="canned">Canned & Packaged</option>
          <option value="frozen">Frozen</option>
          <option value="beverages">Beverages</option>
          <option value="household">Household</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="item-notes">Notes</label>
        <textarea id="item-notes" rows="2" placeholder="Add notes about brand, size, etc."></textarea>
      </div>
    </form>
  `;
  
  showModal('Add Grocery Item', content, handleAddItem);
}

// Handle adding a new item
async function handleAddItem() {
  const form = document.getElementById('add-item-form');
  
  // Basic validation
  if (!form.checkValidity()) {
    showNotification('Please fill out all required fields', 'error');
    return;
  }
  
  try {
    const name = document.getElementById('item-name').value;
    const quantity = document.getElementById('item-quantity').value;
    const unit = document.getElementById('item-unit').value;
    const category = document.getElementById('item-category').value;
    const notes = document.getElementById('item-notes').value;
    
    // Create item object
    const item = {
      id: 'grocery_' + Date.now(),
      name: name,
      quantity: parseInt(quantity) || 1,
      unit: unit,
      category: category,
      notes: notes,
      completed: false,
      createdBy: appState.currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save to database
    await addGroceryItem(item);
    
    showNotification('Item added successfully', 'success');
    
    // Refresh grocery items
    await refreshGroceryItems();
  } catch (error) {
    console.error('Error adding item:', error);
    showNotification('Failed to add item', 'error');
  }
}

// Handle editing an item
function handleEditItemClick(event) {
  const itemId = event.currentTarget.dataset.itemId;
  
  // Get item from database
  getGroceryItemById(itemId).then(item => {
    if (!item) {
      showNotification('Item not found', 'error');
      return;
    }
    
    showEditItemModal(item);
  }).catch(error => {
    console.error('Error loading item for edit:', error);
    showNotification('Failed to load item', 'error');
  });
}

// Show edit item modal
function showEditItemModal(item) {
  const content = `
    <form id="edit-item-form" class="item-form" data-item-id="${item.id}">
      <div class="form-group">
        <label for="item-name">Item Name *</label>
        <input type="text" id="item-name" required placeholder="Enter item name" value="${item.name}">
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="item-quantity">Quantity</label>
          <input type="number" id="item-quantity" min="1" value="${item.quantity || 1}">
        </div>
        
        <div class="form-group">
          <label for="item-unit">Unit</label>
          <select id="item-unit">
            <option value="" ${!item.unit ? 'selected' : ''}>Select unit</option>
            <option value="pkg" ${item.unit === 'pkg' ? 'selected' : ''}>Package</option>
            <option value="lb" ${item.unit === 'lb' ? 'selected' : ''}>Pound (lb)</option>
            <option value="oz" ${item.unit === 'oz' ? 'selected' : ''}>Ounce (oz)</option>
            <option value="g" ${item.unit === 'g' ? 'selected' : ''}>Gram (g)</option>
            <option value="kg" ${item.unit === 'kg' ? 'selected' : ''}>Kilogram (kg)</option>
            <option value="l" ${item.unit === 'l' ? 'selected' : ''}>Liter (l)</option>
            <option value="ml" ${item.unit === 'ml' ? 'selected' : ''}>Milliliter (ml)</option>
            <option value="ea" ${item.unit === 'ea' ? 'selected' : ''}>Each</option>
            <option value="doz" ${item.unit === 'doz' ? 'selected' : ''}>Dozen</option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label for="item-category">Category</label>
        <select id="item-category" required>
          <option value="produce" ${item.category === 'produce' ? 'selected' : ''}>Produce</option>
          <option value="dairy" ${item.category === 'dairy' ? 'selected' : ''}>Dairy</option>
          <option value="meat" ${item.category === 'meat' ? 'selected' : ''}>Meat</option>
          <option value="bakery" ${item.category === 'bakery' ? 'selected' : ''}>Bakery</option>
          <option value="canned" ${item.category === 'canned' ? 'selected' : ''}>Canned & Packaged</option>
          <option value="frozen" ${item.category === 'frozen' ? 'selected' : ''}>Frozen</option>
          <option value="beverages" ${item.category === 'beverages' ? 'selected' : ''}>Beverages</option>
          <option value="household" ${item.category === 'household' ? 'selected' : ''}>Household</option>
          <option value="other" ${item.category === 'other' ? 'selected' : ''}>Other</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="item-completed">Status</label>
        <select id="item-completed">
          <option value="false" ${!item.completed ? 'selected' : ''}>Needed</option>
          <option value="true" ${item.completed ? 'selected' : ''}>Purchased</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="item-notes">Notes</label>
        <textarea id="item-notes" rows="2" placeholder="Add notes about brand, size, etc.">${item.notes || ''}</textarea>
      </div>
    </form>
  `;
  
  showModal('Edit Grocery Item', content, () => handleUpdateItem(item));
}

// Handle updating an item
async function handleUpdateItem(originalItem) {
  const form = document.getElementById('edit-item-form');
  
  // Basic validation
  if (!form.checkValidity()) {
    showNotification('Please fill out all required fields', 'error');
    return;
  }
  
  try {
    const itemId = form.dataset.itemId;
    const name = document.getElementById('item-name').value;
    const quantity = document.getElementById('item-quantity').value;
    const unit = document.getElementById('item-unit').value;
    const category = document.getElementById('item-category').value;
    const completed = document.getElementById('item-completed').value === 'true';
    const notes = document.getElementById('item-notes').value;
    
    // Create updated item object
    const updatedItem = {
      ...originalItem,
      name: name,
      quantity: parseInt(quantity) || 1,
      unit: unit,
      category: category,
      completed: completed,
      notes: notes,
      updatedAt: new Date().toISOString()
    };
    
    // Save to database
    await updateGroceryItem(updatedItem);
    
    showNotification('Item updated successfully', 'success');
    
    // Refresh grocery items
    await refreshGroceryItems();
  } catch (error) {
    console.error('Error updating item:', error);
    showNotification('Failed to update item', 'error');
  }
}

// Handle deleting an item
function handleDeleteItemClick(event) {
  const itemId = event.currentTarget.dataset.itemId;
  
  // Show confirmation dialog
  const confirmContent = `
    <div class="confirmation-dialog">
      <p>Are you sure you want to delete this item?</p>
      <p>This action cannot be undone.</p>
    </div>
  `;
  
  showModal('Delete Item', confirmContent, () => confirmDeleteItem(itemId));
}

// Confirm item deletion
async function confirmDeleteItem(itemId) {
  try {
    await deleteGroceryItem(itemId);
    
    showNotification('Item deleted successfully', 'success');
    
    // Refresh grocery items
    await refreshGroceryItems();
  } catch (error) {
    console.error('Error deleting item:', error);
    showNotification('Failed to delete item', 'error');
  }
}

// Clear completed items
function clearCompletedItems() {
  // Show confirmation dialog
  const confirmContent = `
    <div class="confirmation-dialog">
      <p>Are you sure you want to remove all purchased items?</p>
      <p>This action cannot be undone.</p>
    </div>
  `;
  
  showModal('Clear Purchased Items', confirmContent, confirmClearCompletedItems);
}

// Confirm clearing completed items
async function confirmClearCompletedItems() {
  try {
    // Get all completed items
    const items = await getGroceryItems();
    const completedItems = items.filter(item => item.completed);
    
    if (completedItems.length === 0) {
      showNotification('No purchased items to clear', 'info');
      return;
    }
    
    // Delete each completed item
    for (const item of completedItems) {
      await deleteGroceryItem(item.id);
    }
    
    showNotification(`Removed ${completedItems.length} purchased items`, 'success');
    
    // Refresh grocery items
    await refreshGroceryItems();
  } catch (error) {
    console.error('Error clearing purchased items:', error);
    showNotification('Failed to clear purchased items', 'error');
  }
}

// Create a new grocery list
function createNewList() {
  // Show confirmation dialog
  const confirmContent = `
    <div class="confirmation-dialog">
      <p>Create a new grocery list?</p>
      <p>This will archive your current list.</p>
    </div>
  `;
  
  showModal('New Grocery List', confirmContent, confirmNewList);
}

// Confirm creating a new list
async function confirmNewList() {
  try {
    // Get all current items
    const items = await getGroceryItems();
    
    if (items.length === 0) {
      showNotification('Your grocery list is already empty', 'info');
      return;
    }
    
    // Create an archive record
    const archive = {
      id: 'archive_' + Date.now(),
      name: `Grocery List ${new Date().toLocaleDateString()}`,
      items: items,
      createdBy: appState.currentUser.id,
      createdAt: new Date().toISOString()
    };
    
    // Save archive
    await saveGroceryArchive(archive);
    
    // Delete all current items
    for (const item of items) {
      await deleteGroceryItem(item.id);
    }
    
    showNotification('Created new grocery list', 'success');
    
    // Refresh grocery items
    await refreshGroceryItems();
  } catch (error) {
    console.error('Error creating new list:', error);
    showNotification('Failed to create new list', 'error');
  }
}

// Helper function to save grocery archive
async function saveGroceryArchive(archive) {
  if (!db) throw new Error('Database not initialized');
  
  try {
    await db.put(stores.sync, {
      id: archive.id,
      entityType: 'groceryArchive',
      data: archive
    });
    return true;
  } catch (error) {
    console.error('Error saving grocery archive:', error);
    throw error;
  }
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}