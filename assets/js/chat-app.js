/**
 * WebLLM Chat Application
 * Main application entry point
 */

import { chatState } from './webllm-chat.js';
import { chatUI } from './chat-ui.js';
import { chatLogic } from './chat-logic.js';

// Application class to manage the entire chat application
class ChatApp {
  constructor() {
    this.init();
  }

  async init() {
    console.log('🚀 WebLLM Chat Application Starting...');
    
    // Initialize all components
    this.state = chatState;
    this.ui = chatUI;
    this.logic = chatLogic;
    
    console.log('✅ Chat application initialized successfully');
  }

  // Utility methods for external access
  getState() {
    return this.state;
  }

  getUI() {
    return this.ui;
  }

  getLogic() {
    return this.logic;
  }
}

// Initialize the application
const chatApp = new ChatApp();

// Make it globally available for debugging
window.chatApp = chatApp;

export default chatApp;
