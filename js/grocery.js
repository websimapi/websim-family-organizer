// Grocery management functionality for the Family Organizer app

// Initialize grocery list view
function initGroceryView() {
  console.log('Initializing grocery list view');
  
  // Get the grocery container
  const groceryView = document.getElementById('grocery-view');
  
  // Check if user is authenticated
  if (!appState.isAuthenticated) {
    groceryView.innerHTML = `
      <h1>Grocery List</h1>
      <div class="placeholder-message">
        <i class="material-icons">lock</i>
        <p>Please sign in to access your grocery list</p>
      </div>
    `;
    return;
  }
  
  // Show demo content if using mock API
  if (config.useMockGoogleAPI) {
    createMockGroceryList(groceryView);
    return;
  }
  
  // Placeholder content until grocery list is fully implemented
  groceryView.innerHTML = `
    <h1>Grocery List</h1>
    <div class="placeholder-message">
      <i class="material-icons">shopping_cart</i>
      <p>Grocery list feature coming soon</p>
    </div>
  `;
}

// Create mock grocery list for demo
function createMockGroceryList(container) {
  container.innerHTML = `
    <h1>Grocery List</h1>
    
    <div class="grocery-controls">
      <div class="search-box">
        <i class="material-icons">search</i>
        <input type="text" placeholder="Search grocery items">
      </div>
      
      <div class="grocery-actions">
        <button class="btn btn-outline">
          <i class="material-icons">filter_list</i>
          <span>Filter</span>
        </button>
        <button class="btn btn-primary">
          <i class="material-icons">add</i>
          <span>Add Item</span>
        </button>
      </div>
    </div>
    
    <div class="grocery-list-container">
      <div class="category-section">
        <div class="category-header">
          <h3>Produce</h3>
          <span class="item-count">6 items</span>
        </div>
        <div class="grocery-items">
          <div class="grocery-item">
            <div class="item-checkbox">
              <input type="checkbox" id="item-1">
              <label for="item-1"></label>
            </div>
            <div class="item-details">
              <div class="item-name">Apples</div>
              <div class="item-quantity">5 pcs</div>
            </div>
            <div class="item-actions">
              <button class="btn btn-icon"><i class="material-icons">edit</i></button>
              <button class="btn btn-icon"><i class="material-icons">delete</i></button>
            </div>
          </div>
          
          <div class="grocery-item">
            <div class="item-checkbox">
              <input type="checkbox" id="item-2">
              <label for="item-2"></label>
            </div>
            <div class="item-details">
              <div class="item-name">Bananas</div>
              <div class="item-quantity">1 bunch</div>
            </div>
            <div class="item-actions">
              <button class="btn btn-icon"><i class="material-icons">edit</i></button>
              <button class="btn btn-icon"><i class="material-icons">delete</i></button>
            </div>
          </div>
          
          <div class="grocery-item">
            <div class="item-checkbox">
              <input type="checkbox" id="item-3">
              <label for="item-3"></label>
            </div>
            <div class="item-details">
              <div class="item-name">Lettuce</div>
              <div class="item-quantity">1 head</div>
            </div>
            <div class="item-actions">
              <button class="btn btn-icon"><i class="material-icons">edit</i></button>
              <button class="btn btn-icon"><i class="material-icons">delete</i></button>
            </div>
          </div>
          
          <div class="grocery-item">
            <div class="item-checkbox">
              <input type="checkbox" id="item-4" checked>
              <label for="item-4"></label>
            </div>
            <div class="item-details">
              <div class="item-name completed">Tomatoes</div>
              <div class="item-quantity">4 pcs</div>
            </div>
            <div class="item-actions">
              <button class="btn btn-icon"><i class="material-icons">edit</i></button>
              <button class="btn btn-icon"><i class="material-icons">delete</i></button>
            </div>
          </div>
          
          <div class="grocery-item">
            <div class="item-checkbox">
              <input type="checkbox" id="item-5">
              <label for="item-5"></label>
            </div>
            <div class="item-details">
              <div class="item-name">Onions</div>
              <div class="item-quantity">3 pcs</div>
            </div>
            <div class="item-actions">
              <button class="btn btn-icon"><i class="material-icons">edit</i></button>
              <button class="btn btn-icon"><i class="material-icons">delete</i></button>
            </div>
          </div>
          
          <div class="grocery-item">
            <div class="item-checkbox">
              <input type="checkbox" id="item-6">
              <label for="item-6"></label>
            </div>
            <div class="item-details">
              <div class="item-name">Bell Peppers</div>
              <div class="item-quantity">2 pcs</div>
            </div>
            <div class="item-actions">
              <button class="btn btn-icon"><i class="material-icons">edit</i></button>
              <button class="btn btn-icon"><i class="material-icons">delete</i></button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="category-section">
        <div class="category-header">
          <h3>Dairy & Eggs</h3>
          <span class="item-count">3 items</span>
        </div>
        <div class="grocery-items">
          <div class="grocery-item">
            <div class="item-checkbox">
              <input type="checkbox" id="item-7" checked>
              <label for="item-7"></label>
            </div>
            <div class="item-details">
              <div class="item-name completed">Milk</div>
              <div class="item-quantity">1 gallon</div>
            </div>
            <div class="item-actions">
              <button class="btn btn-icon"><i class="material-icons">edit</i></button>
              <button class="btn btn-icon"><i class="material-icons">delete</i></button>
            </div>
          </div>
          
          <div class="grocery-item">
            <div class="item-checkbox">
              <input type="checkbox" id="item-8">
              <label for="item-8"></label>
            </div>
            <div class="item-details">
              <div class="item-name">Eggs</div>
              <div class="item-quantity">1 dozen</div>
            </div>
            <div class="item-actions">
              <button class="btn btn-icon"><i class="material-icons">edit</i></button>
              <button class="btn btn-icon"><i class="material-icons">delete</i></button>
            </div>
          </div>
          
          <div class="grocery-item">
            <div class="item-checkbox">
              <input type="checkbox" id="item-9">
              <label for="item-9"></label>
            </div>
            <div class="item-details">
              <div class="item-name">Cheese</div>
              <div class="item-quantity">200g</div>
            </div>
            <div class="item-actions">
              <button class="btn btn-icon"><i class="material-icons">edit</i></button>
              <button class="btn btn-icon"><i class="material-icons">delete</i></button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="category-section">
        <div class="category-header">
          <h3>Pantry</h3>
          <span class="item-count">4 items</span>
        </div>
        <div class="grocery-items">
          <div class="grocery-item">
            <div class="item-checkbox">
              <input type="checkbox" id="item-10">
              <label for="item-10"></label>
            </div>
            <div class="item-details">
              <div class="item-name">Pasta</div>
              <div class="item-quantity">2 boxes</div>
            </div>
            <div class="item-actions">
              <button class="btn btn-icon"><i class="material-icons">edit</i></button>
              <button class="btn btn-icon"><i class="material-icons">delete</i></button>
            </div>
          </div>
          
          <div class="grocery-item">
            <div class="item-checkbox">
              <input type="checkbox" id="item-11" checked>
              <label for="item-11"></label>
            </div>
            <div class="item-details">
              <div class="item-name completed">Rice</div>
              <div class="item-quantity">1 bag</div>
            </div>
            <div class="item-actions">
              <button class="btn btn-icon"><i class="material-icons">edit</i></button>
              <button class="btn btn-icon"><i class="material-icons">delete</i></button>
            </div>
          </div>
          
          <div class="grocery-item">
            <div class="item-checkbox">
              <input type="checkbox" id="item-12">
              <label for="item-12"></label>
            </div>
            <div class="item-details">
              <div class="item-name">Olive Oil</div>
              <div class="item-quantity">1 bottle</div>
            </div>
            <div class="item-actions">
              <button class="btn btn-icon"><i class="material-icons">edit</i></button>
              <button class="btn btn-icon"><i class="material-icons">delete</i></button>
            </div>
          </div>
          
          <div class="grocery-item">
            <div class="item-checkbox">
              <input type="checkbox" id="item-13">
              <label for="item-13"></label>
            </div>
            <div class="item-details">
              <div class="item-name">Canned Tomatoes</div>
              <div class="item-quantity">2 cans</div>
            </div>
            <div class="item-actions">
              <button class="btn btn-icon"><i class="material-icons">edit</i></button>
              <button class="btn btn-icon"><i class="material-icons">delete</i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="grocery-summary">
      <div class="summary-details">
        <div class="total-items">Total: 13 items</div>
        <div class="completed-items">Completed: 3 items</div>
      </div>
      <div class="summary-actions">
        <button class="btn btn-outline">
          <i class="material-icons">print</i>
          <span>Print List</span>
        </button>
        <button class="btn btn-outline">
          <i class="material-icons">share</i>
          <span>Share List</span>
        </button>
      </div>
    </div>
  `;
  
  // Add some basic styles for the mock grocery list
  const style = document.createElement('style');
  style.textContent = `
    .grocery-controls {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .search-box {
      display: flex;
      align-items: center;
      background-color: var(--background-light);
      border-radius: 24px;
      padding: 0 16px;
      flex-grow: 1;
      max-width: 500px;
      border: 1px solid var(--border-color);
    }
    
    .search-box input {
      border: none;
      padding: 10px;
      background: transparent;
      flex-grow: 1;
      outline: none;
    }
    
    .grocery-actions {
      display: flex;
      gap: 10px;
    }
    
    .category-section {
      background-color: var(--background-light);
      border-radius: var(--border-radius);
      margin-bottom: 20px;
      box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3);
      overflow: hidden;
    }
    
    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background-color: var(--background-off);
      border-bottom: 1px solid var(--border-color);
    }
    
    .category-header h3 {
      margin: 0;
      font-size: 16px;
    }
    
    .item-count {
      background-color: var(--primary-color);
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
    }
    
    .grocery-items {
      padding: 8px 16px;
    }
    
    .grocery-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid var(--border-color);
    }
    
    .grocery-item:last-child {
      border-bottom: none;
    }
    
    .item-checkbox {
      margin-right: 16px;
    }
    
    .item-details {
      flex-grow: 1;
    }
    
    .item-name {
      font-weight: 500;
    }
    
    .item-name.completed {
      text-decoration: line-through;
      color: var(--text-secondary);
    }
    
    .item-quantity {
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    .item-actions {
      display: flex;
    }
    
    .grocery-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: var(--background-light);
      padding: 16px;
      border-radius: var(--border-radius);
      box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3);
      margin-top: 20px;
    }
    
    .summary-actions {
      display: flex;
      gap: 10px;
    }
    
    .total-items, .completed-items {
      margin-bottom: 4px;
    }
    
    @media (max-width: 600px) {
      .grocery-controls {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-box {
        max-width: none;
      }
      
      .grocery-summary {
        flex-direction: column;
        gap: 16px;
      }
      
      .summary-details {
        text-align: center;
      }
    }
  `;
  
  document.head.appendChild(style);
  
  // Add event listeners for demo interactivity
  const checkboxes = container.querySelectorAll('.item-checkbox input');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const itemName = e.target.parentElement.nextElementSibling.querySelector('.item-name');
      if (e.target.checked) {
        itemName.classList.add('completed');
      } else {
        itemName.classList.remove('completed');
      }
      
      updateGrocerySummary(container);
    });
  });
  
  // Add event listeners for buttons
  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      showNotification('This feature is part of the demo and is not fully implemented yet', 'info');
    });
  });
  
  updateGrocerySummary(container);
}

// Update grocery list summary (for demo)
function updateGrocerySummary(container) {
  const totalItems = container.querySelectorAll('.grocery-item').length;
  const completedItems = container.querySelectorAll('.item-checkbox input:checked').length;
  
  const totalItemsElement = container.querySelector('.total-items');
  const completedItemsElement = container.querySelector('.completed-items');
  
  if (totalItemsElement && completedItemsElement) {
    totalItemsElement.textContent = `Total: ${totalItems} items`;
    completedItemsElement.textContent = `Completed: ${completedItems} items`;
  }
}