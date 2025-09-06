# Test MCP Server

A simple MCP (Model Context Protocol) server for learning purposes. This server demonstrates basic MCP functionality including tools and resources with Zod validation.

## What is MCP?

MCP (Model Context Protocol) is a protocol that allows AI models to interact with external tools and resources. It provides a standardized way for AI assistants to:

- **Call tools** (functions) to perform actions
- **Read resources** (files, data sources) to get information
- **Provide structured responses** with proper error handling

### How MCP Works

1. **AI Model** (like Cursor) wants to use a tool
2. **AI Model** sends a JSON-RPC request to the **MCP Server** via stdio
3. **MCP Server** processes the request and returns a response
4. **AI Model** uses the response to help the user

The communication happens through **JSON-RPC 2.0** over stdio - no web servers needed!

## Features

This test server includes:

### Tools (with Zod Validation)
- **`echo`**: Echo back input text with validation
- **`add_numbers`**: Add two numbers together with type checking
- **`get_system_info`**: Get basic system information (Node.js platform details)
- **`validate_email`**: Validate email addresses using Zod's built-in email validation

### Resources
- **`file://example.txt`**: A sample text file with timestamp
- **`file://example.json`**: A sample JSON file with server metadata

### Key Features
- ✅ **Zod Validation**: Runtime type checking for all tool inputs
- ✅ **Error Handling**: Clear error messages for invalid inputs
- ✅ **JSON-RPC 2.0**: Standard protocol communication
- ✅ **Type Safety**: TypeScript/JavaScript with proper schemas
- ✅ **Resource Management**: Both text and JSON resource examples

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make the server executable:
```bash
chmod +x server.js
```

## Usage

### Running the Server

The server can be run directly:
```bash
npm start
# or
node server.js
```

### Testing with the Client

Run the test client to see the server in action:
```bash
npm test
# or
node test_client.js
```

### Using with Cursor

1. **Copy the configuration** from `mcp_config.json` to your Cursor settings
2. **Update the path** to point to your local copy of this repository

**Option 1: Using absolute path**
```json
{
  "mcpServers": {
    "test-server": {
      "command": "node",
      "args": ["/path/to/your/mcp-test/server.js"],
      "env": {}
    }
  }
}
```

**Option 2: Using working directory (recommended)**
```json
{
  "mcpServers": {
    "test-server": {
      "command": "node",
      "args": ["server.js"],
      "cwd": "/path/to/your/mcp-test",
      "env": {}
    }
  }
}
```

The `mcp_config.json` file in this repository serves as a template - copy it to your `~/.cursor/mcp.json` and update the paths as needed.

## How It Works

### Server Architecture
1. **Server Initialization**: Creates MCP server with capabilities
2. **Tool Registration**: Tools are registered with Zod schemas for validation
3. **Resource Registration**: Resources are registered with URIs and metadata
4. **Request Handling**: Server processes JSON-RPC requests via stdio
5. **Response Generation**: Responses are formatted according to MCP protocol

### Communication Flow
```
Cursor → JSON-RPC Request → MCP Server → Zod Validation → Tool Execution → Response → Cursor
```

### Example JSON-RPC Communication
**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "tools/call",
  "params": {
    "name": "add_numbers",
    "arguments": {"a": 5, "b": 3}
  }
}
```

**Response:**
```json
{
  "result": {
    "content": [{"type": "text", "text": "Result: 5 + 3 = 8"}]
  },
  "jsonrpc": "2.0",
  "id": "1"
}
```

## Extending the Server

### Adding New Tools

1. **Define Zod Schema:**
   ```javascript
   const MyToolInputSchema = z.object({
     param1: z.string().describe('Description'),
     param2: z.number().optional()
   });
   ```

2. **Add Tool Definition:**
   ```javascript
   {
     name: 'my_tool',
     description: 'My new tool',
     inputSchema: { /* JSON schema */ }
   }
   ```

3. **Implement Handler:**
   ```javascript
   case 'my_tool': {
     const validatedArgs = MyToolInputSchema.parse(args);
     // Tool logic here
     return { content: [{ type: 'text', text: 'Result' }] };
   }
   ```

### Adding New Resources

1. **Add Resource Definition:**
   ```javascript
   {
     uri: 'file://my-resource',
     name: 'My Resource',
     description: 'Description',
     mimeType: 'text/plain'
   }
   ```

2. **Implement Handler:**
   ```javascript
   case 'file://my-resource': {
     return {
       contents: [{
         type: 'text',
         text: 'Resource content',
         uri: 'file://my-resource'
       }]
     };
   }
   ```

## Troubleshooting

### MCP Tools Not Appearing in Cursor
1. **Check configuration**: Ensure `~/.cursor/mcp.json` has the correct path
2. **Restart Cursor**: MCP configuration changes require a restart
3. **Test server**: Run `node server.js` to verify it starts without errors
4. **Check logs**: Look for error messages in Cursor's developer console

### Common Issues
- **Path issues**: Use absolute paths in MCP configuration
- **Permission errors**: Ensure the server file is executable (`chmod +x server.js`)
- **Dependency issues**: Run `npm install` to ensure all packages are installed
- **Port conflicts**: MCP uses stdio, so no port conflicts possible

### Testing Your Server
```bash
# Test server directly
node server.js

# Test with a simple client
echo '{"jsonrpc":"2.0","id":"1","method":"tools/list","params":{}}' | node server.js
```

## Project Structure

```
mcp-test/
├── server.js              # Main MCP server
├── package.json           # Dependencies and scripts
├── mcp_config.json        # MCP configuration template
├── README.md              # This file
└── .gitignore            # Git ignore rules
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your tools/resources
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this as a starting point for your own MCP servers!
