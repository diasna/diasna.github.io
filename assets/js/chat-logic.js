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
      
      // Check if we have tool info to pass along
      const toolInfo = this.currentToolInfo || null;
      this.currentToolInfo = null; // Clear it after use
      
      chatUI.addMessage(finalMessage, 'agent', toolInfo);
      
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
      // First, check if the user's message needs a tool (before generating any response)
      const userMessage = messages[messages.length - 1].content;
      const intentResult = await this.detectIntent(userMessage);
      
      if (intentResult) {
        console.log("Intent detected before generation:", intentResult);
        await this.executeToolFlow(intentResult, "", messages, onUpdate, onFinish);
        return;
      }

      // If no tool detected, proceed with normal AI response
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
      
      // As a fallback, still check if the AI generated a JSON tool call
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
        console.log("JSON parsing failed, but that's okay - normal response");
      }
      
      // Regular response without tools
      const finalMessage = await chatState.webllmEngine.getMessage();
      onFinish(finalMessage);
      
    } catch (err) {
      onError(err);
    }
  }

  async detectIntent(message) {
    try {
      // Use the AI model to detect intent
      const intentPrompt = `You are a tool detection system. Analyze this user message and determine if they want to use a tool.

Available tools:
- get_weather: For weather information requests (city required)
- get_stock_price: For stock price requests (symbol required)  
- search_web: For web search requests (query required)
- get_current_time: For current time requests (timezone optional)

User message: "${message}"

Rules:
1. If the user wants a tool, respond with ONLY the JSON object (no explanation)
2. If no tool is needed, respond with ONLY the word "NONE"
3. Never explain what tools do or give instructions
4. Extract the most relevant parameter from the user's message

Examples:
- "weather in Tokyo" → {"action": "get_weather", "parameters": {"city": "Tokyo"}}
- "AAPL stock price" → {"action": "get_stock_price", "parameters": {"symbol": "AAPL"}}
- "search for cats" → {"action": "search_web", "parameters": {"query": "cats"}}
- "what time is it" → {"action": "get_current_time", "parameters": {}}
- "time in New York" → {"action": "get_current_time", "parameters": {"timezone": "America/New_York"}}
- "hello" → NONE

Response:`;

      // Create a lightweight completion for intent detection
      const completion = await chatState.webllmEngine.chat.completions.create({
        messages: [
          { role: "system", content: "You are a tool detection system. Respond with ONLY JSON or 'NONE'. Never provide explanations." },
          { role: "user", content: intentPrompt }
        ],
        temperature: 0.1, // Low temperature for consistent parsing
        max_tokens: 50    // Very short response to prevent explanations
      });

      const response = completion.choices[0].message.content.trim();
      
      // Handle "NONE" response
      if (response === "NONE" || response.toLowerCase() === "none") {
        return null;
      }

      // Try to parse JSON response
      try {
        const intentData = JSON.parse(response);
        
        // Validate the response has required fields
        if (intentData.action && intentData.parameters) {
          console.log("AI detected intent:", intentData);
          return intentData;
        }
      } catch (parseError) {
        console.log("Failed to parse AI intent response:", response);
      }

      return null;

    } catch (error) {
      console.error("AI intent detection failed:", error);
      return null;
    }
  }

  async executeToolFlow(toolCallData, originalMessage, messages, onUpdate, onFinish) {
    // Show simple status message based on tool type
    let statusMessage = "";
    switch (toolCallData.action) {
      case 'get_weather':
        const city = toolCallData.parameters.city || 'your location';
        statusMessage = `🌤️ Looking up current weather in ${city}...`;
        break;
      case 'get_stock_price':
        const symbol = toolCallData.parameters.symbol || 'stock';
        statusMessage = `📈 Getting ${symbol} stock price...`;
        break;
      case 'search_web':
        const query = toolCallData.parameters.query || 'information';
        statusMessage = `🔍 Searching the web for "${query}"...`;
        break;
      case 'get_current_time':
        const timezone = toolCallData.parameters.timezone;
        statusMessage = timezone ? `🕒 Getting current time for ${timezone}...` : `🕒 Getting current time...`;
        break;
      default:
        statusMessage = `🔧 Executing tool: ${toolCallData.action}...`;
    }
    
    onUpdate(statusMessage);
    
    try {
      const toolResult = await executeToolCall(toolCallData);
      
      // Add the tool execution to message history
      messages.push({ role: "assistant", content: originalMessage });
      messages.push({ role: "user", content: `Tool result: ${JSON.stringify(toolResult)}` });
      
      // Generate a natural response based on the tool result
      const followUpCompletion = await chatState.webllmEngine.chat.completions.create({
        stream: true,
        messages: [...messages, {
          role: "user",
          content: `Based on the tool result above, provide a helpful and concise response to the user. Present the information in a natural, conversational way without mentioning JSON or technical details.`
        }]
      });
      
      let followUpMessage = "";
      for await (const followUpChunk of followUpCompletion) {
        const followUpDelta = followUpChunk.choices[0].delta.content;
        if (followUpDelta) {
          followUpMessage += followUpDelta;
          // Show the natural response as it streams
          onUpdate(followUpMessage);
        }
      }
      
      // Store tool info for the final message
      this.currentToolInfo = toolCallData;
      onFinish(followUpMessage);
      
    } catch (error) {
      console.error('Tool execution error:', error);
      const errorMessage = `❌ Sorry, I couldn't complete that request: ${error.message}`;
      onUpdate(errorMessage);
      onFinish(errorMessage);
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
      chatUI.addMessage("Great! The WebLLM model has been downloaded and loaded. I'm now ready to chat with you offline!\n\n🛠️ **Available Tools:**\n🌤️ `get_weather` - Get weather by city name\n📈 `get_stock_price` - Get stock price by symbol\n🔍 `search_web` - Search the web for information\n🕒 `get_current_time` - Get current time and date\n\nTry asking: \"What's the weather in Tangerang?\", \"Get AAPL stock price\", \"What time is it?\", or \"Search for latest AI news\"", 'agent');
      
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
