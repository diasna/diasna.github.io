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
        content: `You are a helpful assistant that can use tools. 

CRITICAL: When a user asks for current/live information (weather, stock prices, news, etc.), you MUST respond with ONLY a JSON tool call. No other text.

JSON Format (exact format required):
{
  "action": "tool_name",
  "parameters": {
    "key": "value"
  }
}

Available tools:
- get_weather: Use when user asks about weather. Parameters: { "city": "city_name" }
- get_stock_price: Use when user asks about stock prices. Parameters: { "symbol": "STOCK_SYMBOL" }
- search_web: Use when user asks to search for information. Parameters: { "query": "search_terms" }

Examples:
User: "What's the weather in Tokyo?"
Assistant: {"action": "get_weather", "parameters": {"city": "Tokyo"}}

User: "Get Apple stock price"
Assistant: {"action": "get_stock_price", "parameters": {"symbol": "AAPL"}}

User: "Search for latest AI news"
Assistant: {"action": "search_web", "parameters": {"query": "latest AI news"}}

Rules:
1. ONLY JSON for tool calls - no explanations, no extra text
2. For general conversation that doesn't need tools, respond normally
3. Always detect when user wants current/live data and use appropriate tool
4. Never include comments or extra formatting in JSON`,
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
