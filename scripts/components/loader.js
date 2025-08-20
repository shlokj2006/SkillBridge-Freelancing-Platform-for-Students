// Component loader for shared HTML components
export async function loadComponent(selector, fallbackText = 'Loading...') {
  try {
    const container = document.querySelector(selector);
    if (!container) {
      console.warn(`Container not found: ${selector}`);
      return;
    }
    
    // Get file path from data-source attribute if not provided
    if (!container.dataset.source) {
      console.warn(`No data-source specified for ${selector}`);
      return;
    }
    
    // Show loading state
    container.innerHTML = `<div class="text-center p-4 text-gray-500">${fallbackText}</div>`;
    
    const filePath = container.dataset.source;
    const response = await fetch(container.dataset.source);
    
    if (!response.ok) {
      throw new Error(`Failed to load ${container.dataset.source}: ${response.status}`);
    }
    
    const html = await response.text();
    container.innerHTML = html;
    
    // Initialize Lucide icons after content is loaded
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    // Initialize chatbot if badge component was loaded
    if (filePath === 'components/badge.html' || filePath === 'components/chatbot.html') {
      const chatbotModule = await import('./chatbot.js');
      await loadComponent('#chatbot-container');
      chatbotModule.initializeChatbot();
    }
    
  } catch (error) {
    console.error(`Error loading component ${selector}:`, error);
    const errorContainer = document.querySelector(selector);
    if (errorContainer) {
      errorContainer.innerHTML = `<div class="text-red-500 p-4">Failed to load component</div>`;
    }
  }
}

// Load multiple components
export function loadComponents(selectors) {
  const promises = selectors.map(selector => {
    return loadComponent(selector);
  });
  
  return Promise.all(promises);
}