const appendLocation = '#userContainer';

class UserManager {
  constructor(selector) {
    this.selector = selector;
    this.setupHTMLStructure();
    this.container = document.querySelector(selector);
    this.users = [];
    this.expirationTime = 1000 * 60 * 60;
    this.setupMutationObserver();
    this.init();
  }

  setupHTMLStructure() {
    document.title = 'User Management System';
    
    const metaCharset = document.createElement('meta');
    metaCharset.setAttribute('charset', 'UTF-8');
    document.head.appendChild(metaCharset);
    
    const metaViewport = document.createElement('meta');
    metaViewport.setAttribute('name', 'viewport');
    metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    document.head.appendChild(metaViewport);
    
    const style = document.createElement('style');
    style.textContent = `
      body {
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      
      h1 {
        color: #333;
        text-align: center;
      }
      
      #userContainer {
        margin-top: 30px;
      }
      
      .user-card {
        position: relative;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 15px;
        margin: 10px 0;
        background-color: #f9f9f9;
      }
      
      .delete-btn {
        position: absolute;
        top: 15px;
        right: 15px;
        background: #ff4444;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
      }
      
      .delete-btn:hover {
        background: #cc0000;
      }

      .user-card h3 {
        margin: 0 0 10px 0;
        color: #333;
        text-decoration:underline;
      }
      
      .refresh-button {
        background-color: #4caf50;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        margin: 20px 0;
        font-size: 16px;
      }
      
      .refresh-button:hover {
        background:rgb(35, 118, 37);
      }
      
      .error {
        color: red;
        padding: 10px;
        border: 1px solid red;
        background-color: #ffeeee;
        border-radius: 5px;
      }
    `;
    document.head.appendChild(style);
    
    const h1 = document.createElement('h1');
    h1.textContent = 'User Management System';
    document.body.appendChild(h1);
    
    const userContainer = document.createElement('div');
    userContainer.id = 'userContainer';
    document.body.appendChild(userContainer);
  }

  init() {
    const storedData = localStorage.getItem('userData');
    
    if (storedData) {
      const { users, timestamp } = JSON.parse(storedData);
      const now = new Date().getTime();
      
      if (now - timestamp < this.expirationTime) {
        this.users = users;
        this.renderUsers();
        return;
      } else {
        localStorage.removeItem('userData');
      }
    }
    
    this.getUsers();
  }

  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const hasUsers = this.container.querySelector('.user-card');
          const hasRefreshButton = this.container.querySelector('#refreshButton');
          
          if (!hasUsers && !hasRefreshButton) {
            this.showRefreshButton();
          }
        }
      });
    });
    
    const observerConfig = {
      childList: true,
      subtree: true
    }

    observer.observe(this.container, observerConfig);
  }

  async getUsers() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      this.users = await response.json();
      
      const dataToStore = {
        users: this.users,
        timestamp: new Date().getTime()
      };
      
      localStorage.setItem('userData', JSON.stringify(dataToStore));
      this.renderUsers();
    } catch (error) {
      console.error('Error fetching users:', error);
      this.container.innerHTML = `<div class="error">Error loading users: ${error.message}</div>`;
    }
  }

  renderUsers() {
    if (!this.container) {
      console.error(`Element with selector "${this.selector}" not found`);
      return;
    }
    
    this.container.innerHTML = '';
    
    this.users.forEach(user => {
      const userCard = document.createElement('div');
      userCard.className = 'user-card';
      userCard.dataset.userId = user.id;
      
      userCard.innerHTML = `
        <h3>${user.name}</h3>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <button class="delete-btn" data-id="${user.id}">Delete User</button>
      `;
      
      const deleteBtn = userCard.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => this.deleteUser(user.id));
      
      this.container.appendChild(userCard);
    });
  }

  deleteUser(userId) {
    this.users = this.users.filter(user => user.id !== userId);
    
    const dataToStore = {
      users: this.users,
      timestamp: new Date().getTime()
    };
    
    localStorage.setItem('userData', JSON.stringify(dataToStore));
    
    const userElement = this.container.querySelector(`[data-user-id="${userId}"]`);
    if (userElement) {
      userElement.remove();
    }
    
  }

  showRefreshButton() {
    if (sessionStorage.getItem('refreshButtonUsed')) {
      return;
    }
    
    const refreshButton = document.createElement('button');
    refreshButton.id = 'refreshButton';
    refreshButton.textContent = 'Fetch Users Again';
    refreshButton.className = 'refresh-button';
    
    refreshButton.addEventListener('click', () => {
      sessionStorage.setItem('refreshButtonUsed', 'true');
      refreshButton.remove();
      this.getUsers();
    });
    
    this.container.appendChild(refreshButton);
  }
}

(() => {
  const userManager = new UserManager(appendLocation);
})(); 