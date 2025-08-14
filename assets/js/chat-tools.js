/**
 * WebLLM Chat Tools
 * Tool functions for weather, stock prices, and web search
 */

// Weather API function
export async function get_weather(city) {
  try {
    // Using OpenWeatherMap API (you can replace with any weather API)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=demo_key&units=metric`);
    
    if (!response.ok) {
      // Fallback to mock data for demo
      return {
        city: city,
        temperature: Math.floor(Math.random() * 30) + 10,
        condition: "Partly Cloudy",
        humidity: Math.floor(Math.random() * 40) + 40,
        wind_speed: Math.floor(Math.random() * 15) + 5,
        note: "Demo data - replace with real API key"
      };
    }
    
    const data = await response.json();
    return {
      city: data.name,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description,
      humidity: data.main.humidity,
      wind_speed: Math.round(data.wind.speed)
    };
  } catch (error) {
    console.error('Weather API error:', error);
    return {
      city: city,
      temperature: Math.floor(Math.random() * 30) + 10,
      condition: "Partly Cloudy",
      humidity: Math.floor(Math.random() * 40) + 40,
      wind_speed: Math.floor(Math.random() * 15) + 5,
      note: "Demo data - API unavailable"
    };
  }
}

// Stock price API function
export async function get_stock_price(symbol) {
  try {
    // Mock stock data for demo
    return {
      symbol: symbol.toUpperCase(),
      price: (Math.random() * 500 + 50).toFixed(2),
      change: (Math.random() * 20 - 10).toFixed(2),
      change_percent: (Math.random() * 10 - 5).toFixed(2),
      note: "Demo data - replace with real stock API"
    };
  } catch (error) {
    console.error('Stock API error:', error);
    return {
      symbol: symbol.toUpperCase(),
      price: "N/A",
      change: "N/A",
      change_percent: "N/A",
      note: "Demo data - API unavailable"
    };
  }
}

// Web search API function
export async function search_web(query) {
  try {
    // Mock search results for demo
    return {
      query: query,
      results: [
        {
          title: `Search result for "${query}"`,
          url: "https://example.com",
          snippet: `This is a demo search result for the query "${query}". In a real implementation, this would connect to a search API.`
        },
        {
          title: `Another result about ${query}`,
          url: "https://example2.com",
          snippet: `Additional information related to "${query}" would appear here from actual search results.`
        }
      ],
      note: "Demo data - replace with real search API"
    };
  } catch (error) {
    console.error('Search API error:', error);
    return {
      query: query,
      results: [],
      note: "Demo data - API unavailable"
    };
  }
}

// Execute tool calls from JSON format
export async function executeToolCall(toolCallData) {
  const functionName = toolCallData.action;
  const functionArgs = toolCallData.parameters;
  
  switch (functionName) {
    case 'get_weather':
      return await get_weather(functionArgs.city);
    case 'get_stock_price':
      return await get_stock_price(functionArgs.symbol);
    case 'search_web':
      return await search_web(functionArgs.query);
    default:
      throw new Error(`Unknown tool: ${functionName}`);
  }
}
