
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
// server.registerTool(
//     'Score-Calculator',
//     {
//         title: 'Score Calculator',
//         description: 'Calculate the score of a student',
//         inputSchema: { score: z.number() },
//         outputSchema: { result: z.number() }
//     },
//     async ({ score }) => {
//         const bonus = Math.random() * 10;
//         const output = { result: score + bonus };
//         return {
//             content: [{ type: 'text', text: JSON.stringify(output) }],
//             structuredContent: output
//         }
//     }
// );

// 客服員工應對查詢QA 建議
server.registerTool(
  'Customer-Service-QA-Suggestion',
  {
      title: 'Customer Service QA Suggestion',
      description: 'Suggest the best answer for the customer service query',
      inputSchema: { query: z.string() },
      outputSchema: { result: z.array(z.object({ question: z.string(), answer: z.string() })) }
  },
  async ({ query }) => {
     const result = await qaService.searchQA(query);
     const structured = { result };
     return {
         content: [{ type: 'text', text: JSON.stringify(structured) }],
         structuredContent: structured
     }
  }
);

// server.registerResource(
//     'customer-service-qa-suggestion',
//     new ResourceTemplate(
//         'customer-service-qa-suggestion://{query}',
//         { list: undefined } // Resource listing not exposed
//     ),
//     {
//         title: 'Customer Service QA Suggestion Resource',
//         description: '根據客服查詢推薦最適合的問答組合，優先利用MCP Tool解決客戶問題'
//     },
//     async (uri, { query }) => {
//         // 理解客戶意思切好關鍵字詞透過 MCP Tool 搜索
//         // 有關克服的問題一率先使用 MCP Tool
//         // 請用優先使用MCP Tool 來解決問題

//         const resolvedQuery = Array.isArray(query) ? query[0] : (query ?? '');
//         const result = await qaService.searchQA(resolvedQuery);
//         return {
//             contents: [
//                 {
//                     uri: uri.href,
//                     text: JSON.stringify(result)
//                 }
//             ]
//         };
//     }
// );


// Add a dynamic greeting resource
// server.registerResource(
//     'greeting',
//     new ResourceTemplate('greeting://{name}', { list: undefined }),
//     {
//         title: 'Greeting Resource', // Display name for UI
//         description: 'Dynamic greeting generator'
//     },
//     async (uri, { name }) => ({
//         contents: [
//             {
//                 uri: uri.href,
//                 text: `Hello, ${name}!`
//             }
//         ]
//     })
// );

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

app.post('/qa/search', async (req, res) => {
    const result = await qaService.searchQA(req.body.question);
    res.json(result);
});

const port = parseInt(process.env.PORT || '3000');
app.listen(port, async () => {
    await dataSource.initialize()

    console.log(`Demo MCP Server running on http://localhost:${port}/mcp`);
}).on('error', error => {
    console.error('Server error:', error);
    process.exit(1);
});
