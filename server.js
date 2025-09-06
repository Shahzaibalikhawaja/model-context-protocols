#!/usr/bin/env node
/**
 * A simple MCP (Model Context Protocol) server for learning purposes.
 * This server provides basic tools and resources for demonstration.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// Define Zod schemas for tool inputs
const EchoInputSchema = z.object({
  text: z.string().describe('Text to echo back'),
});

const AddNumbersInputSchema = z.object({
  a: z.number().describe('First number'),
  b: z.number().describe('Second number'),
});

const GetSystemInfoInputSchema = z.object({});

const ValidateEmailInputSchema = z.object({
  email: z.string().email().describe('Email address to validate'),
});

// Create the server instance
const server = new Server(
  {
    name: 'test-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Define some example tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'echo',
        description: 'Echo back the input text',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Text to echo back',
            },
          },
          required: ['text'],
        },
      },
      {
        name: 'add_numbers',
        description: 'Add two numbers together',
        inputSchema: {
          type: 'object',
          properties: {
            a: {
              type: 'number',
              description: 'First number',
            },
            b: {
              type: 'number',
              description: 'Second number',
            },
          },
          required: ['a', 'b'],
        },
      },
      {
        name: 'get_system_info',
        description: 'Get basic system information',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'validate_email',
        description: 'Validate an email address format',
        inputSchema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address to validate',
            },
          },
          required: ['email'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'echo': {
        const validatedArgs = EchoInputSchema.parse(args);
        return {
          content: [
            {
              type: 'text',
              text: `Echo: ${validatedArgs.text}`,
            },
          ],
        };
      }

      case 'add_numbers': {
        const validatedArgs = AddNumbersInputSchema.parse(args);
        const result = validatedArgs.a + validatedArgs.b;
        return {
          content: [
            {
              type: 'text',
              text: `Result: ${validatedArgs.a} + ${validatedArgs.b} = ${result}`,
            },
          ],
        };
      }

      case 'get_system_info': {
        GetSystemInfoInputSchema.parse(args); // Validate empty object
        const info = {
          platform: process.platform,
          nodeVersion: process.version,
          architecture: process.arch,
          uptime: process.uptime(),
        };
        return {
          content: [
            {
              type: 'text',
              text: `System Info: ${JSON.stringify(info, null, 2)}`,
            },
          ],
        };
      }

      case 'validate_email': {
        const validatedArgs = ValidateEmailInputSchema.parse(args);
        return {
          content: [
            {
              type: 'text',
              text: `✅ Email "${validatedArgs.email}" is valid!`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid arguments: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    throw error;
  }
});

// Define some example resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'file://example.txt',
        name: 'Example Text File',
        description: 'A sample text file resource',
        mimeType: 'text/plain',
      },
      {
        uri: 'file://example.json',
        name: 'Example JSON File',
        description: 'A sample JSON file resource',
        mimeType: 'application/json',
      },
    ],
  };
});

// Handle resource reading
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case 'file://example.txt': {
      const content = `This is an example text file.
It contains some sample content for demonstration purposes.
Generated at: ${new Date().toISOString()}`;
      return {
        contents: [
          {
            type: 'text',
            text: content,
            uri: 'file://example.txt',
          },
        ],
      };
    }

    case 'file://example.json': {
      const data = {
        name: 'Example JSON',
        version: '1.0.0',
        features: ['tool_calling', 'resource_reading', 'basic_operations'],
        timestamp: new Date().toISOString(),
      };
      return {
        contents: [
          {
            type: 'text',
            text: JSON.stringify(data, null, 2),
            uri: 'file://example.json',
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Test MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
