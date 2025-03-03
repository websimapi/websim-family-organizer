// Meal planning functionality for the Family Organizer app

// Initialize meal planner view
function initMealsView() {
  console.log('Initializing meal planner view');
  
  // Get the meals container
  const mealsView = document.getElementById('meals-view');
  
  // Check if user is authenticated
  if (!appState.isAuthenticated) {
    mealsView.innerHTML = `
      <h1>Meal Planning</h1>
      <div class="placeholder-message">
        <i class="material-icons">lock</i>
        <p>Please sign in to access your meal plan</p>
      </div>
    `;
    return;
  }
  
  // Create detailed demo content instead of a simple placeholder
  if (config.useMockGoogleAPI) {
    createMockMealPlannerContent(mealsView);
    return;
  }
  
  // Placeholder content until meal planning is fully implemented
  mealsView.innerHTML = `
    <h1>Meal Planning</h1>
    <div class="placeholder-message">
      <i class="material-icons">restaurant</i>
      <p>Meal planning feature coming soon</p>
    </div>
  `;
}

// Create mock meal planner content for demo
function createMockMealPlannerContent(container) {
  container.innerHTML = `
    <h1>Meal Planning</h1>
    
    <div class="meal-planning-controls">
      <div class="week-navigation">
        <button class="btn btn-icon"><i class="material-icons">chevron_left</i></button>
        <h3>This Week (May 15 - May 21)</h3>
        <button class="btn btn-icon"><i class="material-icons">chevron_right</i></button>
      </div>
      
      <div class="meal-actions">
        <button class="btn btn-outline">
          <i class="material-icons">restaurant_menu</i>
          <span>Recipes</span>
        </button>
        <button class="btn btn-primary">
          <i class="material-icons">add</i>
          <span>Add Meal</span>
        </button>
      </div>
    </div>
    
    <div class="meal-planner-grid">
      <!-- Day columns -->
      <div class="meal-day-column">
        <div class="day-header">Monday</div>
        <div class="meal-slot breakfast">
          <h4>Breakfast</h4>
          <div class="meal-item">
            <div class="meal-name">Oatmeal with Fruit</div>
            <div class="meal-time">7:30 AM</div>
          </div>
        </div>
        <div class="meal-slot lunch">
          <h4>Lunch</h4>
          <div class="meal-item">
            <div class="meal-name">Chicken Salad Sandwich</div>
            <div class="meal-time">12:30 PM</div>
          </div>
        </div>
        <div class="meal-slot dinner">
          <h4>Dinner</h4>
          <div class="meal-item">
            <div class="meal-name">Spaghetti Bolognese</div>
            <div class="meal-time">6:00 PM</div>
          </div>
        </div>
      </div>
      
      <div class="meal-day-column">
        <div class="day-header">Tuesday</div>
        <div class="meal-slot breakfast">
          <h4>Breakfast</h4>
          <div class="meal-item">
            <div class="meal-name">Scrambled Eggs & Toast</div>
            <div class="meal-time">7:30 AM</div>
          </div>
        </div>
        <div class="meal-slot lunch">
          <h4>Lunch</h4>
          <div class="meal-item">
            <div class="meal-name">Leftover Spaghetti</div>
            <div class="meal-time">12:30 PM</div>
          </div>
        </div>
        <div class="meal-slot dinner">
          <h4>Dinner</h4>
          <div class="meal-item">
            <div class="meal-name">Grilled Chicken & Vegetables</div>
            <div class="meal-time">6:00 PM</div>
          </div>
        </div>
      </div>
      
      <div class="meal-day-column">
        <div class="day-header">Wednesday</div>
        <div class="meal-slot breakfast">
          <h4>Breakfast</h4>
          <div class="meal-item">
            <div class="meal-name">Yogurt Parfait</div>
            <div class="meal-time">7:30 AM</div>
          </div>
        </div>
        <div class="meal-slot lunch">
          <h4>Lunch</h4>
          <div class="meal-item">
            <div class="meal-name">Turkey Wrap</div>
            <div class="meal-time">12:30 PM</div>
          </div>
        </div>
        <div class="meal-slot dinner">
          <h4>Dinner</h4>
          <div class="meal-item">
            <div class="meal-name">Homemade Pizza</div>
            <div class="meal-time">6:00 PM</div>
          </div>
        </div>
      </div>
      
      <div class="meal-day-column">
        <div class="day-header">Thursday</div>
        <div class="meal-slot breakfast">
          <h4>Breakfast</h4>
          <div class="meal-item">
            <div class="meal-name">Smoothie Bowl</div>
            <div class="meal-time">7:30 AM</div>
          </div>
        </div>
        <div class="meal-slot lunch">
          <h4>Lunch</h4>
          <div class="meal-item">
            <div class="meal-name">Grilled Cheese & Soup</div>
            <div class="meal-time">12:30 PM</div>
          </div>
        </div>
        <div class="meal-slot dinner">
          <h4>Dinner</h4>
          <div class="meal-item">
            <div class="meal-name">Stir Fry</div>
            <div class="meal-time">6:00 PM</div>
          </div>
        </div>
      </div>
      
      <div class="meal-day-column">
        <div class="day-header">Friday</div>
        <div class="meal-slot breakfast">
          <h4>Breakfast</h4>
          <div class="meal-item">
            <div class="meal-name">Bagel with Cream Cheese</div>
            <div class="meal-time">7:30 AM</div>
          </div>
        </div>
        <div class="meal-slot lunch">
          <h4>Lunch</h4>
          <div class="meal-item">
            <div class="meal-name">Tuna Salad</div>
            <div class="meal-time">12:30 PM</div>
          </div>
        </div>
        <div class="meal-slot dinner">
          <h4>Dinner</h4>
          <div class="meal-item">
            <div class="meal-name">Takeout Night</div>
            <div class="meal-time">6:30 PM</div>
          </div>
        </div>
      </div>
      
      <div class="meal-day-column">
        <div class="day-header">Saturday</div>
        <div class="meal-slot breakfast">
          <h4>Breakfast</h4>
          <div class="meal-item">
            <div class="meal-name">Pancakes</div>
            <div class="meal-time">9:00 AM</div>
          </div>
        </div>
        <div class="meal-slot lunch">
          <h4>Lunch</h4>
          <div class="meal-item">
            <div class="meal-name">Quesadillas</div>
            <div class="meal-time">1:00 PM</div>
          </div>
        </div>
        <div class="meal-slot dinner">
          <h4>Dinner</h4>
          <div class="meal-item">
            <div class="meal-name">Grilled Steaks</div>
            <div class="meal-time">7:00 PM</div>
          </div>
        </div>
      </div>
      
      <div class="meal-day-column">
        <div class="day-header">Sunday</div>
        <div class="meal-slot breakfast">
          <h4>Breakfast</h4>
          <div class="meal-item">
            <div class="meal-name">French Toast</div>
            <div class="meal-time">9:00 AM</div>
          </div>
        </div>
        <div class="meal-slot lunch">
          <h4>Lunch</h4>
          <div class="meal-item">
            <div class="meal-name">Cobb Salad</div>
            <div class="meal-time">1:00 PM</div>
          </div>
        </div>
        <div class="meal-slot dinner">
          <h4>Dinner</h4>
          <div class="meal-item">
            <div class="meal-name">Roast Chicken</div>
            <div class="meal-time">6:00 PM</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="meal-planning-footer">
      <button class="btn btn-primary">
        <i class="material-icons">shopping_cart</i>
        <span>Generate Grocery List</span>
      </button>
    </div>
  `;
  
  // Add some basic styles for the mock meal planner
  const style = document.createElement('style');
  style.textContent = `
    .meal-planning-controls {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      align-items: center;
    }
    
    .week-navigation {
      display: flex;
      align-items: center;
    }
    
    .week-navigation h3 {
      margin: 0 16px;
    }
    
    .meal-actions {
      display: flex;
      gap: 10px;
    }
    
    .meal-planner-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .meal-day-column {
      background-color: var(--background-light);
      border-radius: var(--border-radius);
      box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3);
      overflow: hidden;
    }
    
    .day-header {
      background-color: var(--primary-color);
      color: white;
      padding: 8px;
      text-align: center;
      font-weight: 500;
    }
    
    .meal-slot {
      padding: 8px;
      border-bottom: 1px solid var(--border-color);
    }
    
    .meal-slot h4 {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    .meal-item {
      background-color: var(--background-off);
      border-radius: 4px;
      padding: 8px;
      margin-bottom: 5px;
    }
    
    .meal-name {
      font-weight: 500;
      font-size: 14px;
    }
    
    .meal-time {
      font-size: 12px;
      color: var(--text-secondary);
    }
    
    .meal-planning-footer {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
    
    @media (max-width: 900px) {
      .meal-planner-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    
    @media (max-width: 600px) {
      .meal-planner-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .meal-planning-controls {
        flex-direction: column;
        gap: 16px;
      }
    }
  `;
  
  document.head.appendChild(style);
  
  // Add event listeners
  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      showNotification('This feature is part of the demo and is not fully implemented yet', 'info');
    });
  });
}

// Get meals for a specific day
async function getMealsForDay(date) {
  if (config.useMockGoogleAPI) {
    // Return some mock meal data for demo
    const mockMeals = [
      {
        id: 'meal_1',
        name: 'Oatmeal with Fruit',
        type: 'Breakfast',
        time: '7:30 AM',
        preparationTime: 15,
        date: date.toISOString().split('T')[0]
      },
      {
        id: 'meal_2',
        name: 'Chicken Salad Sandwich',
        type: 'Lunch',
        time: '12:30 PM',
        preparationTime: 20,
        date: date.toISOString().split('T')[0]
      },
      {
        id: 'meal_3',
        name: 'Spaghetti Bolognese',
        type: 'Dinner',
        time: '6:00 PM',
        preparationTime: 45,
        date: date.toISOString().split('T')[0]
      }
    ];
    
    return mockMeals;
  }
  
  // Original empty implementation
  return [];
}