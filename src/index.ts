
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { dataSource } from './typeorm/datasource';
import { QAService } from './service/qa';

// Create an MCP server
const server = new McpServer({
  name: "Simple Chat Search Engine",
  version: "1.0.0"
});

// Add an addition tool
server.registerTool(
    'Score-Calculator',
    {
        title: 'Score Calculator',
        description: 'Calculate the score of a student',
        inputSchema: { score: z.number() },
        outputSchema: { result: z.number() }
    },
    async ({ score }) => {
        const bonus = Math.random() * 10;
        const output = { result: score + bonus };
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        }
    }
);

// 客服員工應對查詢QA 建議
server.registerTool(
  'Customer-Service-QA-Suggestion',
  {
      title: 'Customer Service QA Suggestion',
      description: 'Suggest the best answer for the customer service query',
      inputSchema: { query: z.string() },
      outputSchema: { suggestion: z.string() }
  },
  async ({ query }) => {
     const suggestion = "撥打09338847773這支電話，由專人為他解答。"
     const output = { suggestion: suggestion }
      return {
          content: [{ type: 'text', text: JSON.stringify(output) }],
          structuredContent: output
      }
  }
);



// Add a dynamic greeting resource
server.registerResource(
    'greeting',
    new ResourceTemplate('greeting://{name}', { list: undefined }),
    {
        title: 'Greeting Resource', // Display name for UI
        description: 'Dynamic greeting generator'
    },
    async (uri, { name }) => ({
        contents: [
            {
                uri: uri.href,
                text: `Hello, ${name}!`
            }
        ]
    })
);

// Set up Express and HTTP transport
const app = express();
app.use(cors())
app.use(express.json());

// Handle GET requests for SSE stream connection
app.get('/mcp', async (req, res) => {
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true
    });

    res.on('close', () => {
        transport.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, null);
});

// Handle POST requests for MCP messages
app.post('/mcp', async (req, res) => {
    // Create a new transport for each request to prevent request ID collisions
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true
    });

    res.on('close', () => {
        transport.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
});

const qaService =  QAService.getInstance();
app.post('/qa', async (req, res) => {
    const result = await qaService.createQA(req.body);
    res.json(result);
    // res.json('ok');
});

const port = parseInt(process.env.PORT || '3000');
app.listen(port, async () => {
    await dataSource.initialize()

    console.log(`Demo MCP Server running on http://localhost:${port}/mcp`);
}).on('error', error => {
    console.error('Server error:', error);
    process.exit(1);
});
