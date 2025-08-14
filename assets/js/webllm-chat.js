/**
 * WebLLM Chat Application
 * Main application logic for the WebLLM chat interface
 */

import * as webllm from "https://esm.run/@mlc-ai/web-llm";

// Application State
class ChatState {
  constructor() {
    this.messageCount = 0;
    this.isModelReady = false;
    this.webllmEngine = null;
    this.isAutoLoading = false;
    this.selectedModel = "Phi-3.5-mini-instruct-q4f16_1-MLC";
    this.messages = [];
    this.tools = [];
    this.init();
  }

  init() {
    this.setupMessages();
    this.setupTools();
    this.createEngine();
  }

  setupMessages() {
    this.messages = [
      {
        content: `You are a helpful assistant with access to real-time tools. You can actually execute tools and provide real information.

IMPORTANT: You have four available tools that you can use:
- get_weather: Get current weather for any city
- get_stock_price: Get current stock prices  
- search_web: Search the web for information
- get_current_time: Get current time and date information

When users ask for information that requires these tools, respond with ONLY a JSON object in this format:
{"action": "tool_name", "parameters": {"key": "value"}}

For general conversation that doesn't need tools, respond normally.

NEVER explain that you "cannot" do something or that you "don't have browsing capabilities". 
NEVER provide instructions on how to use tools.
ALWAYS use tools when users ask for current information.

Examples:
User: "What's the weather in Tokyo?"
Assistant: {"action": "get_weather", "parameters": {"city": "Tokyo"}}

User: "Get Apple stock price"  
Assistant: {"action": "get_stock_price", "parameters": {"symbol": "AAPL"}}

User: "Search for Dias Nurul Arifin"
Assistant: {"action": "search_web", "parameters": {"query": "Dias Nurul Arifin"}}

User: "What time is it?"
Assistant: {"action": "get_current_time", "parameters": {}}

User: "What time is it in New York?"
Assistant: {"action": "get_current_time", "parameters": {"timezone": "America/New_York"}}

User: "How are you?"
Assistant: I'm doing well, thank you! How can I help you today?`,
        role: "system"
      },
      {
        role: "user",
        content: "What's the weather like in London?"
      },
      {
        role: "assistant", 
        content: '{"action": "get_weather", "parameters": {"city": "London"}}'
      },
      {
        role: "user",
        content: "Tell me about yourself"
      },
      {
        role: "assistant",
        content: "I'm an AI assistant that can help you with various tasks including getting weather information, stock prices, and searching the web. I can also have general conversations and answer questions on many topics."
      }
    ];
  }

  setupTools() {
    this.tools = [
      {
        type: "function",
        function: {
          name: "get_weather",
          description: "Get current weather information for a specific city",
          parameters: {
            type: "object",
            properties: {
              city: {
                type: "string",
                description: "The city name, e.g. 'Tokyo', 'New York', 'London'"
              }
            },
            required: ["city"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "get_stock_price",
          description: "Get current stock price for a symbol",
          parameters: {
            type: "object",
            properties: {
              symbol: {
                type: "string",
                description: "Stock symbol, e.g. 'AAPL', 'GOOGL', 'MSFT'"
              }
            },
            required: ["symbol"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "search_web",
          description: "Search the web for information",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query string"
              }
            },
            required: ["query"]
          }
        }
      }
    ];
  }

  createEngine() {
    this.webllmEngine = new webllm.MLCEngine();
    this.webllmEngine.setInitProgressCallback(this.updateEngineInitProgressCallback.bind(this));
  }

  updateEngineInitProgressCallback(report) {
    console.log("initialize", report.progress);
    
    const progressBar = document.getElementById('progressBar');
    const downloadStatus = document.getElementById('downloadStatus');
    
    if (progressBar && downloadStatus) {
      const progress = Math.round(report.progress * 100);
      progressBar.style.width = progress + '%';
      progressBar.setAttribute('aria-valuenow', progress);
      progressBar.textContent = progress + '%';
      
      // Calculate and display ETA
      const currentTime = Date.now();
      if (!window.downloadStartTime) {
        window.downloadStartTime = currentTime;
      }
      
      if (progress > 0) {
        const elapsedTime = (currentTime - window.downloadStartTime) / 1000;
        const estimatedTotalTime = elapsedTime / (progress / 100);
        const remainingTime = estimatedTotalTime - elapsedTime;
        
        let etaText = '';
        if (remainingTime > 0 && progress < 95) {
          if (remainingTime > 60) {
            const minutes = Math.ceil(remainingTime / 60);
            etaText = ` • ETA: ~${minutes}m`;
          } else {
            const seconds = Math.ceil(remainingTime);
            etaText = ` • ETA: ~${seconds}s`;
          }
        } else if (progress >= 95) {
          etaText = ' • Almost done...';
        }
        
        downloadStatus.textContent = report.text + etaText;
      } else {
        downloadStatus.textContent = report.text;
      }
    }
  }
}

// Create global state instance
const chatState = new ChatState();

export { chatState };
