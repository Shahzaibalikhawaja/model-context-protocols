# Test MCP Server

A simple MCP (Model Context Protocol) server for learning purposes. This server demonstrates basic MCP functionality including tools and resources.

## What is MCP?

MCP (Model Context Protocol) is a protocol that allows AI models to interact with external tools and resources. It provides a standardized way for AI assistants to:

- Call tools (functions) to perform actions
- Read resources (files, data sources) to get information
- Provide structured responses

## Features

This test server includes:

### Tools
- `echo`: Echo back input text
- `add_numbers`: Add two numbers together
- `get_system_info`: Get basic system information

### Resources
- `file://example.txt`: A sample text file
- `file://example.json`: A sample JSON file

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

1. **Server Initialization**: The server starts and listens for MCP protocol messages
2. **Tool Registration**: Tools are registered with their schemas
3. **Resource Registration**: Resources are registered with their URIs and metadata
4. **Request Handling**: The server handles tool calls and resource requests
5. **Response Generation**: Responses are formatted according to MCP protocol

## Extending the Server

To add new tools:

1. Add a new `Tool` definition in `list_tools()`
2. Add a new case in `call_tool()` to handle the tool
3. Implement the tool's functionality

To add new resources:

1. Add a new `Resource` definition in `list_resources()`
2. Add a new case in `read_resource()` to handle the resource
3. Implement the resource's content generation

## Learning Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [MCP TypeScript/JavaScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [Node.js MCP Examples](https://github.com/modelcontextprotocol/typescript-sdk/tree/main/examples)
