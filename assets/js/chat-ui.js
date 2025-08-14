/**
 * WebLLM Chat UI
 * User interface functions for the chat application
 */

import { chatState } from './webllm-chat.js';
import { executeToolCall } from './chat-tools.js';

// UI Management Class
class ChatUI {
  constructor() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      const messageInput = document.getElementById('messageInput');
      
      if (messageInput) {
        messageInput.addEventListener('input', function() {
          if (!this.disabled) {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
          }
        });
      }
      
      // Check if model is already downloaded and auto-load
      setTimeout(() => {
        this.autoLoadModel();
      }, 500);
    });
  }

  addMessage(content, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageContainer = document.createElement('div');
    messageContainer.className = `message-container ${sender}-message`;
    
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Format content for better display
    let formattedContent = this.formatMessageContent(content);
    
    if (sender === 'user') {
      messageContainer.innerHTML = `
        <div class="d-flex justify-content-end">
          <div class="message-bubble user-bubble">
            <div class="message-content">
              <div class="mb-0">${this.escapeHtml(content)}</div>
            </div>
            <div class="message-timestamp">
              <small class="text-light user-timestamp">${timestamp}</small>
            </div>
          </div>
        </div>
      `;
    } else {
      messageContainer.innerHTML = `
        <div class="d-flex align-items-start">
          <div class="agent-avatar rounded-circle bg-primary d-flex align-items-center justify-content-center mr-3">
            <i class="fas fa-robot text-white agent-icon"></i>
          </div>
          <div class="message-bubble agent-bubble">
            <div class="message-content">
              <div class="mb-0">${formattedContent}</div>
            </div>
            <div class="message-timestamp">
              <small class="text-muted">${timestamp}</small>
            </div>
          </div>
        </div>
      `;
    }
    
    chatMessages.appendChild(messageContainer);
    this.scrollToBottom();
    chatState.messageCount++;
  }

  formatMessageContent(content) {
    let formattedContent = content;
    
    // Check if content contains JSON and format it
    if (content.includes('{') && content.includes('}')) {
      try {
        // Try to extract and format JSON parts
        formattedContent = content.replace(/```json\n([\s\S]*?)\n```/g, (match, json) => {
          try {
            const parsed = JSON.parse(json);
            return `<div class="json-result">${JSON.stringify(parsed, null, 2)}</div>`;
          } catch {
            return match;
          }
        });
        
        // Also format standalone JSON objects
        formattedContent = formattedContent.replace(/(\{[\s\S]*?\})/g, (match) => {
          try {
            const parsed = JSON.parse(match);
            return `<div class="json-result">${JSON.stringify(parsed, null, 2)}</div>`;
          } catch {
            return match;
          }
        });
      } catch (error) {
        // If parsing fails, keep original content
      }
    }
    
    // Handle tool execution indicators with specific styling
    if (content.includes('🔧 Executing tool:')) {
      formattedContent = content.replace(/🔧 Executing tool: (.*?)\.\.\./, (match, toolName) => {
        return `<div class="tool-execution" data-tool="${toolName}">🔧 <strong>Executing:</strong> ${toolName}</div>`;
      });
    }
    
    if (content.includes('📊 Tool Result:')) {
      formattedContent = content.replace(/📊 Tool Result:\n([\s\S]*?)(?=\n\n|$)/, 
        '<div class="tool-result">📊 <strong>Tool Result:</strong><pre>$1</pre></div>');
    }
    
    return formattedContent;
  }

  showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'typingIndicator';
    typingIndicator.className = 'message-container agent-message';
    typingIndicator.innerHTML = `
      <div class="d-flex align-items-start">
        <div class="agent-avatar rounded-circle bg-primary d-flex align-items-center justify-content-center mr-3">
          <i class="fas fa-robot text-white agent-icon"></i>
        </div>
        <div class="message-bubble agent-bubble">
          <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
      </div>
    `;
    chatMessages.appendChild(typingIndicator);
    this.scrollToBottom();
  }

  updateTypingIndicatorWithContent(content) {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
      let formattedContent = this.formatMessageContent(content);
      
      const messageBubble = typingIndicator.querySelector('.message-bubble');
      messageBubble.innerHTML = `
        <div class="message-content">
          <div class="mb-0">${formattedContent}</div>
        </div>
      `;
    }
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, '<br>');
  }

  enableChatInput() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    
    messageInput.disabled = false;
    sendButton.disabled = false;
    messageInput.placeholder = "Type your message...";
    messageInput.focus();
  }

  // Check if model is already cached/downloaded
  async checkModelAvailability() {
    try {
      const modelDownloaded = localStorage.getItem(`webllm_model_${chatState.selectedModel}`);
      if (modelDownloaded === 'true') {
        console.log("Model found in localStorage cache tracking");
        return true;
      }
      
      if (chatState.webllmEngine.hasModelInCache) {
        const isAvailable = await chatState.webllmEngine.hasModelInCache(chatState.selectedModel);
        return isAvailable;
      }
      
      console.log("No localStorage cache found, assuming model not downloaded");
      return false;
      
    } catch (error) {
      console.log("Model availability check failed:", error);
      return false;
    }
  }

  // Auto-load model if already downloaded
  async autoLoadModel() {
    if (chatState.isAutoLoading || chatState.isModelReady) return;
    
    const webllmStatus = document.getElementById('webllmStatus');
    
    try {
      const checkPromise = this.checkModelAvailability();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Cache check timeout')), 5000)
      );
      
      const isModelCached = await Promise.race([checkPromise, timeoutPromise]);
      
      if (isModelCached) {
        console.log("Model found in cache, auto-loading...");
        chatState.isAutoLoading = true;
        
        window.downloadStartTime = Date.now();
        
        webllmStatus.innerHTML = `
          <div class="alert alert-info mb-0 py-2">
            <i class="fas fa-sync-alt fa-spin mr-2"></i>
            Loading cached model...
          </div>
        `;
        
        try {
          const config = { temperature: 1.0, top_p: 1 };
          
          const reloadPromise = chatState.webllmEngine.reload(chatState.selectedModel, config);
          const reloadTimeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Model reload timeout')), 10000)
          );
          
          await Promise.race([reloadPromise, reloadTimeoutPromise]);
          
          chatState.isModelReady = true;
          chatState.isAutoLoading = false;
          
          delete window.downloadStartTime;
          
          webllmStatus.innerHTML = `
            <div class="alert alert-success mb-0 py-2">
              <i class="fas fa-check-circle mr-2"></i>
              Model loaded from cache! You can now chat offline.
            </div>
            <button class="btn btn-outline-danger btn-sm mt-2" onclick="deleteModelAndUpdateUI()">
              <i class="fas fa-trash mr-2"></i>Delete Model
            </button>
          `;
          
          this.enableChatInput();
          
          this.addMessage("Welcome back! The WebLLM model was loaded from cache and is ready to chat.\n\n🛠️ **Available Tools:**\n🌤️ `get_weather` - Get weather by city name\n📈 `get_stock_price` - Get stock price by symbol\n🔍 `search_web` - Search the web for information\n\nTry asking: \"What's the weather in Tangerang?\", \"Get AAPL stock price\", or \"Search for latest AI news\"", 'agent');
          
        } catch (error) {
          console.error('Error auto-loading model:', error);
          chatState.isAutoLoading = false;
          
          delete window.downloadStartTime;
          localStorage.removeItem(`webllm_model_${chatState.selectedModel}`);
          
          webllmStatus.innerHTML = `
            <div class="alert alert-warning mb-0 py-2">
              <i class="fas fa-exclamation-triangle mr-2"></i>
              Failed to load cached model. 
            </div>
            <button class="btn btn-success btn-sm mt-2" id="downloadModelBtn" onclick="downloadModel()">
              <i class="fas fa-download mr-2"></i>Download Model
            </button>
          `;
        }
      } else {
        console.log("No cached model found, showing download button");
        webllmStatus.innerHTML = `
          <button class="btn btn-success btn-sm" id="downloadModelBtn" onclick="downloadModel()">
            <i class="fas fa-download mr-2"></i>Download Model
          </button>
        `;
      }
    } catch (error) {
      console.error('Error checking model availability:', error);
      webllmStatus.innerHTML = `
        <button class="btn btn-success btn-sm" id="downloadModelBtn" onclick="downloadModel()">
          <i class="fas fa-download mr-2"></i>Download Model
        </button>
      `;
    }
  }
}

// Create global UI instance
const chatUI = new ChatUI();

export { chatUI };
