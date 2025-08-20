// Helper utilities for the StudentFreelance Hub platform

export class Helpers {
  // Format currency
  static formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Format dates
  static formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
  }

  // Time ago formatter
  static timeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return Helpers.formatDate(date);
  }

  // Truncate text
  static truncateText(text, maxLength = 150) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }

  // Generate random ID
  static generateId(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Debounce function
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Validate email
  static validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Get base URL for API calls
  static getBaseUrl() {
    return window.location.origin + '/api/preview-68a1f11dde341e25e92740ef/';
  }

  // Local storage helpers
  static storage = {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }
    },
    
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.warn('Failed to read from localStorage:', e);
        return defaultValue;
      }
    },
    
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('Failed to remove from localStorage:', e);
      }
    },
    
    clear() {
      try {
        localStorage.clear();
      } catch (e) {
        console.warn('Failed to clear localStorage:', e);
      }
    }
  };

  // URL helpers
  static url = {
    getParam(name) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    },
    
    setParam(name, value) {
      const url = new URL(window.location);
      url.searchParams.set(name, value);
      window.history.pushState({}, '', url);
    },
    
    removeParam(name) {
      const url = new URL(window.location);
      url.searchParams.delete(name);
      window.history.pushState({}, '', url);
    }
  };

  // Form helpers
  static form = {
    serialize(form) {
      const formData = new FormData(form);
      const data = {};
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }
      return data;
    },
    
    validate(form) {
      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
      let isValid = true;
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('border-red-500');
        } else {
          input.classList.remove('border-red-500');
        }
        
        // Email validation
        if (input.type === 'email' && input.value && !Helpers.validateEmail(input.value)) {
          isValid = false;
          input.classList.add('border-red-500');
        }
      });
      
      return isValid;
    },
    
    reset(form) {
      form.reset();
      form.querySelectorAll('.border-red-500').forEach(input => {
        input.classList.remove('border-red-500');
      });
    }
  };

  // Notification system
  static notify = {
    show(message, type = 'info', duration = 5000) {
      const notification = document.createElement('div');
      const id = Helpers.generateId('notification');
      
      const colors = {
        info: 'bg-cyber-blue text-white',
        success: 'bg-neon-green text-white',
        warning: 'bg-yellow-500 text-white',
        error: 'bg-red-500 text-white'
      };
      
      notification.id = id;
      notification.className = `fixed top-4 right-4 z-50 ${colors[type]} px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`;
      notification.innerHTML = `
        <div class="flex items-center justify-between">
          <span>${message}</span>
          <button onclick="Helpers.notify.hide('${id}')" class="ml-4 text-white hover:text-gray-200">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      // Initialize Lucide icons for the notification
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
      
      // Show animation
      setTimeout(() => {
        notification.classList.remove('translate-x-full');
      }, 100);
      
      // Auto hide
      if (duration > 0) {
        setTimeout(() => {
          Helpers.notify.hide(id);
        }, duration);
      }
      
      return id;
    },
    
    hide(id) {
      const notification = document.getElementById(id);
      if (notification) {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
          notification.remove();
        }, 300);
      }
    }
  };

  // Loading states
  static loading = {
    show(element, text = 'Loading...') {
      const originalContent = element.innerHTML;
      element.dataset.originalContent = originalContent;
      element.disabled = true;
      element.innerHTML = `
        <i data-lucide="loader" class="w-5 h-5 inline-block mr-2 animate-spin"></i>
        ${text}
      `;
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    },
    
    hide(element) {
      element.disabled = false;
      element.innerHTML = element.dataset.originalContent || element.innerHTML;
      delete element.dataset.originalContent;
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }
  };
}

export default Helpers;