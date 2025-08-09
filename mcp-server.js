#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { 
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  ReadPromptRequestSchema
} = require('@modelcontextprotocol/sdk/types.js');

// Import Supabase utilities
const { createClient } = require('@supabase/supabase-js');

// Configurare Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://zugwcilkqqkyzloekddp.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Server MCP
const server = new Server(
  {
    name: 'parking-app-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {
        resourcePatterns: [
          {
            pattern: 'supabase://tables/*',
            name: 'Supabase Tables',
            description: 'Access to Supabase database tables'
          },
          {
            pattern: 'files://**/*.{ts,tsx,js,jsx,json}',
            name: 'Project Files',
            description: 'Access to project source files'
          }
        ]
      },
      prompts: {}
    }
  }
);

// Tool: Get Parking Statistics
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_parking_stats',
        description: 'Get statistics about reported parking spots',
        inputSchema: {
          type: 'object',
          properties: {
            timeRange: {
              type: 'string',
              enum: ['today', 'week', 'month', 'all'],
              description: 'Time range for statistics'
            }
          }
        }
      },
      {
        name: 'analyze_parking_data',
        description: 'Analyze parking data for insights',
        inputSchema: {
          type: 'object',
          properties: {
            analysisType: {
              type: 'string',
              enum: ['popular_areas', 'price_analysis', 'availability_trends'],
              description: 'Type of analysis to perform'
            }
          }
        }
      },
      {
        name: 'optimize_database',
        description: 'Analyze and suggest database optimizations',
        inputSchema: {
          type: 'object',
          properties: {
            tableName: {
              type: 'string',
              description: 'Specific table to analyze (optional)'
            }
          }
        }
      },
      {
        name: 'test_api_endpoints',
        description: 'Test API endpoints for functionality',
        inputSchema: {
          type: 'object',
          properties: {
            endpoint: {
              type: 'string',
              description: 'Specific endpoint to test (optional)'
            }
          }
        }
      }
    ]
  };
});

// Tool: Get Parking Statistics Implementation
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_parking_stats':
        return await getParkingStats(args.timeRange || 'all');
      
      case 'analyze_parking_data':
        return await analyzeParkingData(args.analysisType || 'popular_areas');
      
      case 'optimize_database':
        return await optimizeDatabase(args.tableName);
      
      case 'test_api_endpoints':
        return await testApiEndpoints(args.endpoint);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error executing tool ${name}: ${error.message}`
        }
      ]
    };
  }
});

// Resource: List Supabase Tables
server.setRequestHandler(ListResourcesRequestSchema, async (request) => {
  const { resourcePatterns } = request.params;
  
  if (resourcePatterns.includes('supabase://tables/*')) {
    return {
      resources: [
        {
          uri: 'supabase://tables/parcari_raportate',
          name: 'Parcări Raportate',
          description: 'Table containing user-reported parking spots',
          mimeType: 'application/json'
        },
        {
          uri: 'supabase://tables/parking_spots',
          name: 'Parking Spots',
          description: 'Table containing predefined parking spots',
          mimeType: 'application/json'
        },
        {
          uri: 'supabase://tables/users',
          name: 'Users',
          description: 'Table containing user information',
          mimeType: 'application/json'
        }
      ]
    };
  }
  
  return { resources: [] };
});

// Resource: Read Table Data
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  if (uri.startsWith('supabase://tables/')) {
    const tableName = uri.split('/').pop();
    return await readTableData(tableName);
  }
  
  throw new Error(`Unknown resource: ${uri}`);
});

// Helper Functions
async function getParkingStats(timeRange) {
  let query = supabase.from('parcari_raportate').select('*');
  
  if (timeRange !== 'all') {
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
    }
    
    query = query.gte('created_at', startDate.toISOString());
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  const stats = {
    totalSpots: data.length,
    averagePrice: data.reduce((sum, spot) => sum + parseFloat(spot.pret_pe_ora || 0), 0) / data.length,
    availableSpots: data.filter(spot => spot.disponibilitate).length,
    popularAreas: getPopularAreas(data),
    averageRating: data.reduce((sum, spot) => sum + parseFloat(spot.rating || 0), 0) / data.length
  };
  
  return {
    content: [
      {
        type: 'text',
        text: `📊 Parking Statistics (${timeRange}):\n\n` +
              `• Total Spots: ${stats.totalSpots}\n` +
              `• Available Spots: ${stats.availableSpots}\n` +
              `• Average Price: ${stats.averagePrice.toFixed(2)} RON/hour\n` +
              `• Average Rating: ${stats.averageRating.toFixed(1)}/5\n` +
              `• Popular Areas: ${stats.popularAreas.join(', ')}`
      }
    ]
  };
}

async function analyzeParkingData(analysisType) {
  const { data, error } = await supabase.from('parcari_raportate').select('*');
  if (error) throw error;
  
  let analysis = '';
  
  switch (analysisType) {
    case 'popular_areas':
      const areas = getPopularAreas(data);
      analysis = `🏙️ Popular Areas Analysis:\n\n${areas.map((area, i) => `${i + 1}. ${area}`).join('\n')}`;
      break;
      
    case 'price_analysis':
      const prices = data.map(spot => parseFloat(spot.pret_pe_ora || 0)).filter(p => p > 0);
      const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      analysis = `💰 Price Analysis:\n\n` +
                 `• Average Price: ${avgPrice.toFixed(2)} RON/hour\n` +
                 `• Price Range: ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)} RON/hour\n` +
                 `• Total Priced Spots: ${prices.length}`;
      break;
      
    case 'availability_trends':
      const available = data.filter(spot => spot.disponibilitate).length;
      const unavailable = data.length - available;
      
      analysis = `📈 Availability Trends:\n\n` +
                 `• Available Spots: ${available} (${((available / data.length) * 100).toFixed(1)}%)\n` +
                 `• Unavailable Spots: ${unavailable} (${((unavailable / data.length) * 100).toFixed(1)}%)\n` +
                 `• Total Spots: ${data.length}`;
      break;
  }
  
  return {
    content: [
      {
        type: 'text',
        text: analysis
      }
    ]
  };
}

async function optimizeDatabase(tableName) {
  const tables = tableName ? [tableName] : ['parcari_raportate', 'parking_spots', 'users'];
  let recommendations = [];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      recommendations.push(`❌ Error accessing ${table}: ${error.message}`);
      continue;
    }
    
    recommendations.push(`✅ ${table}: Table accessible`);
    
    // Basic optimization suggestions
    if (table === 'parcari_raportate') {
      recommendations.push(`💡 ${table}: Consider adding indexes on (lat, lng) for location queries`);
      recommendations.push(`💡 ${table}: Consider partitioning by created_at for large datasets`);
    }
  }
  
  return {
    content: [
      {
        type: 'text',
        text: `🔧 Database Optimization Analysis:\n\n${recommendations.join('\n')}`
      }
    ]
  };
}

async function testApiEndpoints(endpoint) {
  const endpoints = endpoint ? [endpoint] : [
    '/api/parking-spots',
    '/api/report-parking',
    '/api/auth'
  ];
  
  let results = [];
  
  for (const ep of endpoints) {
    try {
      const response = await fetch(`http://localhost:3000${ep}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      results.push(`✅ ${ep}: ${response.status} ${response.statusText}`);
    } catch (error) {
      results.push(`❌ ${ep}: ${error.message}`);
    }
  }
  
  return {
    content: [
      {
        type: 'text',
        text: `🧪 API Endpoint Testing:\n\n${results.join('\n')}`
      }
    ]
  };
}

async function readTableData(tableName) {
  const { data, error } = await supabase.from(tableName).select('*').limit(10);
  
  if (error) throw error;
  
  return {
    contents: [
      {
        uri: `supabase://tables/${tableName}`,
        mimeType: 'application/json',
        text: JSON.stringify(data, null, 2)
      }
    ]
  };
}

function getPopularAreas(data) {
  const areas = {};
  data.forEach(spot => {
    const area = spot.adresa.split(',')[0] || 'Unknown';
    areas[area] = (areas[area] || 0) + 1;
  });
  
  return Object.entries(areas)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([area]) => area);
}

// Start the server
const transport = new StdioServerTransport();
server.connect(transport);

console.error('Parking App MCP Server started'); 