// Chatbot functionality
export function initializeChatbot() {
  const chatToggle = document.getElementById('chatToggle');
  const chatWindow =document.getElementById('chatWindow');
  const chatClose = document.getElementById('chatClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');
  const quickActionBtns = document.querySelectorAll('.quick-action-btn');

  // Chat responses database
  const chatResponses = {
    'how do i find freelancers?': {
      response: 'You can find talented student freelancers by browsing our Freelancers page, using our search filters, or posting a job and letting freelancers come to you!',
      suggestions: ['Browse Freelancers', 'Post a Job', 'Search by Skills']
    },
    'how do i post a job?': {
      response: 'Posting a job is easy! Click the "Post a Job" button, fill out your project details, set your budget, and talented students will start applying within hours.',
      suggestions: ['View Job Examples', 'Pricing Guide', 'How to Write Good Job Posts']
    },
    'what are your fees?': {
      response: 'We charge a small 5-10% service fee on completed projects. This helps us maintain the platform and provide support to both freelancers and clients.',
      suggestions: ['Payment Methods', 'Refund Policy', 'Billing Questions']
    },
    'hello': {
      response: 'Hello! Welcome to StudentFreelance Hub. I\'m here to help you connect with talented student freelancers or find exciting freelance opportunities.',
      suggestions: ['Find Freelancers', 'Post a Job', 'Browse Categories']
    },
    'hi': {
      response: 'Hi there! How can I assist you today? Whether you\'re looking for freelance talent or wanting to offer your services, I\'m here to help!',
      suggestions: ['Getting Started', 'Account Help', 'Platform Features']
    },
    'help': {
      response: 'I\'d be happy to help! Here are some things I can assist you with: finding freelancers, posting jobs, understanding our fees, or navigating the platform.',
      suggestions: ['Account Issues', 'Payment Help', 'Technical Support']
    },
    'pricing': {
      response: 'Our pricing is transparent and fair. We only charge when projects are completed successfully. Freelancers keep 90-95% of their earnings.',
      suggestions: ['Fee Structure', 'Payment Protection', 'Withdrawal Methods']
    },
    'support': {
      response: 'For technical support or account issues, you can contact our support team at support@studentfreelancehub.com or use our contact form.',
      suggestions: ['Contact Form', 'FAQ', 'Report Issues']
    }
  };

  // Default responses
  const defaultResponses = [
    "I'm not sure about that specific question, but I'd be happy to connect you with our support team for more detailed assistance.",
    "That's a great question! For more specific information, please check our FAQ page or contact our support team.",
    "I'd love to help with that! You can find more detailed information in our help center or contact support for personalized assistance."
  ];

  // Toggle chat window
  function toggleChat() {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
      chatInput.focus();
    }
  }

  // Close chat window
  function closeChat() {
    chatWindow.classList.add('hidden');
  }

  // Add message to chat
  function addMessage(message, isUser = false, suggestions = []) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex items-start space-x-3';
    messageDiv.setAttribute('data-runtime', 'true');

    if (isUser) {
      messageDiv.innerHTML = `
        <div class="flex justify-end w-full">
          <div class="bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg p-3 max-w-xs">
            <p class="text-white text-sm">${message}</p>
          </div>
        </div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
          <i data-lucide="bot" class="w-4 h-4 text-white"></i>
        </div>
        <div class="bg-gray-700/50 rounded-lg p-3 max-w-xs">
          <p class="text-white text-sm">${message}</p>
          ${suggestions.length > 0 ? `
            <div class="mt-2 space-y-1">
              ${suggestions.map(suggestion => `
                <button class="suggestion-btn block w-full text-left text-xs text-cyan-400 hover:text-cyan-300 p-1 rounded transition-colors">
                  ${suggestion}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Re-initialize icons for new bot messages
    if (!isUser) {
      lucide.createIcons();
    }

    // Add click handlers for suggestions
    if (!isUser && suggestions.length > 0) {
      messageDiv.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const suggestionText = btn.textContent.trim();
          handleUserMessage(suggestionText);
        });
      });
    }
  }

  // Handle user message
  function handleUserMessage(message) {
    // Add user message
    addMessage(message, true);
    
    // Clear input
    chatInput.value = '';

    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'flex items-start space-x-3 typing-indicator';
    typingDiv.setAttribute('data-runtime', 'true');
    typingDiv.innerHTML = `
      <div class="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
        <i data-lucide="bot" class="w-4 h-4 text-white"></i>
      </div>
      <div class="bg-gray-700/50 rounded-lg p-3">
        <div class="flex space-x-1">
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    lucide.createIcons();

    // Simulate response delay
    setTimeout(() => {
      // Remove typing indicator
      typingDiv.remove();
      
      // Get response
      const response = getBotResponse(message.toLowerCase());
      addMessage(response.response, false, response.suggestions);
    }, 1000 + Math.random() * 1000);
  }

  // Get bot response
  function getBotResponse(message) {
    // Check for exact matches first
    if (chatResponses[message]) {
      return chatResponses[message];
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(chatResponses)) {
      if (message.includes(key) || key.includes(message)) {
        return value;
      }
    }

    // Check for keywords
    if (message.includes('freelancer') || message.includes('find')) {
      return chatResponses['how do i find freelancers?'];
    }
    if (message.includes('job') || message.includes('post')) {
      return chatResponses['how do i post a job?'];
    }
    if (message.includes('price') || message.includes('cost') || message.includes('fee')) {
      return chatResponses['what are your fees?'];
    }
    if (message.includes('payment') || message.includes('pay')) {
      return chatResponses['pricing'];
    }

    // Default response
    return {
      response: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
      suggestions: ['Contact Support', 'Browse FAQ', 'Get Started Guide']
    };
  }

  // Event listeners
  chatToggle.addEventListener('click', toggleChat);
  chatClose.addEventListener('click', closeChat);
  
  chatSend.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
      handleUserMessage(message);
    }
  });

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const message = chatInput.value.trim();
      if (message) {
        handleUserMessage(message);
      }
    }
  });

  // Quick action buttons
  quickActionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const message = btn.getAttribute('data-message');
      if (message) {
        handleUserMessage(message);
        if (chatWindow.classList.contains('hidden')) {
          toggleChat();
        }
      }
    });
  });

  // Close chat when clicking outside (desktop only)
  document.addEventListener('click', (e) => {
    if (window.innerWidth > 640 && !chatWindow.contains(e.target) && !chatToggle.contains(e.target)) {
      if (!chatWindow.classList.contains('hidden')) {
        closeChat();
      }
    }
  });
}