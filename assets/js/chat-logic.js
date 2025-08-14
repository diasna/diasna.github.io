/**
 * WebLLM Chat Logic
 * Core chat functionality including message processing and tool execution
 */

import { chatState } from './webllm-chat.js';
import { chatUI } from './chat-ui.js';
import { executeToolCall } from './chat-tools.js';

// Chat Logic Class
class ChatLogic {
  constructor() {
    this.setupGlobalFunctions();
  }

  setupGlobalFunctions() {
    // Make functions globally available for HTML onclick handlers
    window.downloadModel = this.downloadModel.bind(this);
    window.deleteModelAndUpdateUI = this.deleteModelAndUpdateUI.bind(this);
    window.handleKeyPress = this.handleKeyPress.bind(this);
    window.sendMessage = this.sendMessage.bind(this);
  }

  handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  async sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    if (!chatState.isModelReady) {
      chatUI.addMessage("Please download the model first before chatting.", 'agent');
      return;
    }
    
    const sendButton = document.getElementById('sendButton');
    sendButton.disabled = true;
    messageInput.disabled = true;
    messageInput.placeholder = "Generating...";
    
    const userMessage = { content: message, role: "user" };
    chatState.messages.push(userMessage);
    
    chatUI.addMessage(message, 'user');
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    chatUI.showTypingIndicator();
    
    let currentResponse = "";
    
    const onUpdate = (content) => {
      currentResponse = content;
      chatUI.updateTypingIndicatorWithContent(content);
    };
    
    const onFinish = (finalMessage) => {
      chatUI.hideTypingIndicator();
      chatUI.addMessage(finalMessage, 'agent');
      
      sendButton.disabled = false;
      messageInput.disabled = false;
      messageInput.placeholder = "Type your message...";
      messageInput.focus();
      
      chatState.webllmEngine.runtimeStatsText().then((statsText) => {
        console.log("Runtime stats:", statsText);
      });
    };
    
    const onError = (error) => {
      console.error("Generation error:", error);
      chatUI.hideTypingIndicator();
      chatUI.addMessage(`Sorry, I encountered an error: ${error.message}`, 'agent');
      
      sendButton.disabled = false;
      messageInput.disabled = false;
      messageInput.placeholder = "Type your message...";
      messageInput.focus();
    };
    
    await this.streamingGenerating(chatState.messages, onUpdate, onFinish, onError);
  }

  async streamingGenerating(messages, onUpdate, onFinish, onError) {
    try {
      let curMessage = "";
      
      const completion = await chatState.webllmEngine.chat.completions.create({
        stream: true,
        messages
      });
      
      for await (const chunk of completion) {
        const delta = chunk.choices[0].delta;
        
        if (delta.content) {
          curMessage += delta.content;
          onUpdate(curMessage);
        }
      }
      
      // Try to parse as JSON tool call
      let toolCallData = null;
      try {
        const trimmedMessage = curMessage.trim();
        if (trimmedMessage.startsWith('{') && trimmedMessage.endsWith('}')) {
          toolCallData = JSON.parse(trimmedMessage);
          
          if (toolCallData.action && toolCallData.parameters) {
            await this.executeToolFlow(toolCallData, curMessage, messages, onUpdate, onFinish);
            return;
          }
        }
      } catch (jsonError) {
        console.log("JSON parsing failed, trying intent detection...");
      }
      
      // Fallback: Intent detection for common patterns
      const intentResult = this.detectIntent(curMessage);
      if (intentResult) {
        console.log("Intent detected:", intentResult);
        await this.executeToolFlow(intentResult, curMessage, messages, onUpdate, onFinish);
        return;
      }
      
      // Regular response without tools
      const finalMessage = await chatState.webllmEngine.getMessage();
      onFinish(finalMessage);
      
    } catch (err) {
      onError(err);
    }
  }

  detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Weather patterns
    if (lowerMessage.includes('weather') || lowerMessage.includes('temperature') || lowerMessage.includes('forecast')) {
      const weatherPatterns = [
        /weather.*?(?:in|for|at)\s+([a-zA-Z\s]+?)(?:\?|$|\.)/i,
        /(?:in|for|at)\s+([a-zA-Z\s]+?).*?weather/i,
        /([a-zA-Z\s]+?)\s+weather/i
      ];
      
      for (const pattern of weatherPatterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
          const city = match[1].trim();
          if (city.length > 1 && city.length < 50) {
            return { action: "get_weather", parameters: { city: city } };
          }
        }
      }
      
      return { action: "get_weather", parameters: { city: "London" } };
    }
    
    // Stock patterns
    if (lowerMessage.includes('stock') || lowerMessage.includes('price') || lowerMessage.includes('ticker')) {
      const stockPatterns = [
        /(?:stock|price|ticker).*?([A-Z]{2,5})/i,
        /([A-Z]{2,5}).*?(?:stock|price)/i,
        /(apple|microsoft|google|tesla|amazon)/i
      ];
      
      for (const pattern of stockPatterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
          let symbol = match[1].toUpperCase();
          
          const companyMap = {
            'APPLE': 'AAPL', 'MICROSOFT': 'MSFT', 'GOOGLE': 'GOOGL',
            'TESLA': 'TSLA', 'AMAZON': 'AMZN'
          };
          
          symbol = companyMap[symbol] || symbol;
          return { action: "get_stock_price", parameters: { symbol: symbol } };
        }
      }
    }
    
    // Search patterns
    if (lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('look up')) {
      const searchPatterns = [
        /(?:search|find|look up).*?(?:for|about)\s+(.+?)(?:\?|$|\.)/i,
        /(?:search|find)\s+(.+?)(?:\?|$|\.)/i
      ];
      
      for (const pattern of searchPatterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
          return { action: "search_web", parameters: { query: match[1].trim() } };
        }
      }
    }
    
    return null;
  }

  async executeToolFlow(toolCallData, originalMessage, messages, onUpdate, onFinish) {
    onUpdate(originalMessage + `\n\n🔧 Executing tool: ${toolCallData.action}...`);
    
    try {
      const toolResult = await executeToolCall(toolCallData);
      
      messages.push({ role: "assistant", content: originalMessage });
      messages.push({ role: "user", content: `Tool result: ${JSON.stringify(toolResult)}` });
      
      const followUpCompletion = await chatState.webllmEngine.chat.completions.create({
        stream: true,
        messages: [...messages, {
          role: "user",
          content: "Based on the tool result above, provide a helpful response to the user in plain text."
        }]
      });
      
      let followUpMessage = "";
      for await (const followUpChunk of followUpCompletion) {
        const followUpDelta = followUpChunk.choices[0].delta.content;
        if (followUpDelta) {
          followUpMessage += followUpDelta;
          onUpdate(originalMessage + `\n\n📊 Tool Result:\n${JSON.stringify(toolResult, null, 2)}\n\n` + followUpMessage);
        }
      }
      
      const finalMessage = originalMessage + `\n\n📊 Tool Result:\n${JSON.stringify(toolResult, null, 2)}\n\n` + followUpMessage;
      onFinish(finalMessage);
      
    } catch (error) {
      console.error('Tool execution error:', error);
      onUpdate(originalMessage + `\n\n❌ Tool execution failed: ${error.message}`);
      onFinish(originalMessage + `\n\n❌ Tool execution failed: ${error.message}`);
    }
  }

  async downloadModel() {
    if (chatState.isAutoLoading || chatState.isModelReady) {
      console.log("Auto-loading in progress or model already ready, skipping download");
      return;
    }
    
    const downloadBtn = document.getElementById('downloadModelBtn');
    const progressContainer = document.getElementById('downloadProgress');
    const webllmStatus = document.getElementById('webllmStatus');
    
    downloadBtn.style.display = 'none';
    progressContainer.style.display = 'block';
    
    window.downloadStartTime = Date.now();
    
    try {
      const config = { temperature: 1.0, top_p: 1 };
      await chatState.webllmEngine.reload(chatState.selectedModel, config);
      
      chatState.isModelReady = true;
      localStorage.setItem(`webllm_model_${chatState.selectedModel}`, 'true');
      
      delete window.downloadStartTime;
      
      progressContainer.style.display = 'none';
      webllmStatus.innerHTML = `
        <div class="alert alert-success mb-0 py-2">
          <i class="fas fa-check-circle mr-2"></i>
          Model loaded successfully! You can now chat offline.
        </div>
        <button class="btn btn-outline-danger btn-sm mt-2" onclick="deleteModelAndUpdateUI()">
          <i class="fas fa-trash mr-2"></i>Delete Model
        </button>
      `;
      
      chatUI.enableChatInput();
      chatUI.addMessage("Great! The WebLLM model has been downloaded and loaded. I'm now ready to chat with you offline!\n\n🛠️ **Available Tools:**\n🌤️ `get_weather` - Get weather by city name\n📈 `get_stock_price` - Get stock price by symbol\n🔍 `search_web` - Search the web for information\n\nTry asking: \"What's the weather in Tangerang?\", \"Get AAPL stock price\", or \"Search for latest AI news\"", 'agent');
      
    } catch (error) {
      console.error('Error downloading model:', error);
      
      delete window.downloadStartTime;
      
      progressContainer.style.display = 'none';
      webllmStatus.innerHTML = `
        <div class="alert alert-danger mb-0 py-2">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          Failed to download model: ${error.message}
          <button class="btn btn-link btn-sm p-0 ml-2" onclick="downloadModel()">Retry</button>
        </div>
      `;
    }
  }

  async deleteModel() {
    try {
      localStorage.removeItem(`webllm_model_${chatState.selectedModel}`);
      
      if (chatState.webllmEngine && typeof chatState.webllmEngine.unload === 'function') {
        await chatState.webllmEngine.unload();
      }
      
      chatState.isModelReady = false;
      chatState.isAutoLoading = false;
      
      const messageInput = document.getElementById('messageInput');
      const sendButton = document.getElementById('sendButton');
      messageInput.disabled = true;
      sendButton.disabled = true;
      messageInput.placeholder = "Download the model first to start chatting...";
      
      const webllmStatus = document.getElementById('webllmStatus');
      webllmStatus.innerHTML = `
        <div class="alert alert-warning mb-0 py-2">
          <i class="fas fa-trash mr-2"></i>
          Model deleted from cache.
        </div>
        <button class="btn btn-success btn-sm mt-2" id="downloadModelBtn" onclick="downloadModel()">
          <i class="fas fa-download mr-2"></i>Download Model
        </button>
      `;
      
      return {
        success: true,
        message: "Model cache cleared successfully. You'll need to download the model again to chat."
      };
      
    } catch (error) {
      console.error('Error deleting model:', error);
      return {
        success: false,
        message: `Error deleting model: ${error.message}`
      };
    }
  }

  async deleteModelAndUpdateUI() {
    const result = await this.deleteModel();
    
    if (result.success) {
      chatUI.addMessage(result.message, 'agent');
    } else {
      chatUI.addMessage(`Failed to delete model: ${result.message}`, 'agent');
    }
  }
}

// Create global logic instance
const chatLogic = new ChatLogic();

export { chatLogic };
