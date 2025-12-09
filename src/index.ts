
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

//查詢客戶訂單狀態
server.registerTool(
    'Order-Query',
    {
        title: 'Order Query',
        description: 'Query the order status of a customer',
        inputSchema: { orderId: z.string() },
        outputSchema: { result: z.object({ orderId: z.string(), status: z.string() }) }
    },
    async ({ orderId }) => {
        const mockOrderStatus = {
            orderId,
            status: "客戶已經收到商品 刮鬍刀 30天"
        }
        return {
            content: [{ type: 'text', text: JSON.stringify(mockOrderStatus) }],
            structuredContent: {result: mockOrderStatus}
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
//     'Customer-Service-QA-Suggestion',
//     new ResourceTemplate(
//         'customer-service-qa-suggestion://{query}',
//         { 
//             list: async () => {
//                 // 返回空陣列，因為這是動態 resource，需要 query 參數才能產生具體的 resource
//                 // 這樣至少會讓這個 template 出現在 resources/list 中
//                 return { resources: [{ name: 'Customer Service QA Suggestion', uri: 'customer-service-qa-suggestion://{query}' }] };
//             }
//         }
//     ),
//     {
//         title: 'Customer Service QA Suggestion Resource',
//         description: '根據客服查詢推薦最適合的問答組合，解決客戶問題'
//     },
//     async (uri, { query }) => {
//         const queryStr = Array.isArray(query) ? query[0] : query;
//         const result = await qaService.searchQA(queryStr);
//         return {
//             contents: [{
//                 uri: uri.href,
//                 text: JSON.stringify({ result })
//             }]
//         };
//     },
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
