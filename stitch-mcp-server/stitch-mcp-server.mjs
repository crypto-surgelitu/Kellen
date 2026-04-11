import axios from 'axios';

const STITCH_API_KEY = "PASTE_YOUR_STITCH_API_KEY_HERE";
const TOOL_NAME = "generate_ui";

function send(jsonrpc) {
  process.stdout.write(JSON.stringify(jsonrpc) + '\n');
}

async function handleToolCall(toolName, args) {
  if (toolName === TOOL_NAME) {
    try {
      const response = await axios.post(
        'https://api.stitch.com/generate',
        { prompt: args.prompt },
        {
          headers: {
            'Authorization': `Bearer ${STITCH_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) return { error: error.response.data };
      if (error.request) return { error: 'No response from Stitch API' };
      return { error: error.message };
    }
  }
  return { error: 'Unknown tool' };
}

async function main() {
  for await (const line of process.stdin) {
    try {
      const msg = JSON.parse(line);
      const { jsonrpc, id, method, params } = msg;

      if (method === 'tools/list') {
        send({
          jsonrpc: '2.0',
          id,
          result: {
            tools: [
              {
                name: TOOL_NAME,
                description: 'Generate UI using Stitch API from a text prompt',
                inputSchema: {
                  type: 'object',
                  properties: {
                    prompt: { type: 'string', description: 'The prompt describing what to generate' },
                  },
                  required: ['prompt'],
                },
              },
            ],
          },
        });
      } else if (method === 'tools/call') {
        const { name, arguments: args } = params;
        const result = await handleToolCall(name, args);
        send({
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] },
        });
      } else if (method === 'initialize') {
        send({
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'stitch', version: '1.0.0' },
          },
        });
      }
    } catch (e) {}
  }
}

main();