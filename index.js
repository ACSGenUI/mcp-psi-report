import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Create an MCP server
const server = new McpServer({
  name: "acs-psi-report",
  version: "0.1.0"
});



 // Define the role and content as specified
 const role = "You are a web performance expert responsible for generating a report of the psi values for a given website.";

const PSI_CHECK_PROMPT = `
### Task

Generate a report of the psi values for a given website ${url}, crawl all the pages, all levels including nested pages of the website and perform below actions,
1. create a sitemap using mermaid format
2. generate PSI report for each page.
3. generate a report of the psi values for a given website.

### Context

* The report should be in CSV format, with the following columns:

  * Page Title
  * URL
  * PSI Value
  * LCP Score
  * LCP Impact
  * FCP Score
  * FCP Impact
  * FID Score
  * FID Impact
  * CLS Score
  * CLS Impact
  * TTFB Score
  * TTFB Impact
  * Total Blocking Time
  * Web Vitals Impact Description
  * Web Vitals Impact Score


* Avoid combining multiple items into one
 `;
// Add a greeting tool
server.registerTool("Website_Performance_(PSI)_Report_Tool",
  {
    title: "Prompt to generate a PSI report",
    description: "Generate a report of the psi values for a given website.",
    inputSchema: { url: z.string() }
  },
  async ({ url }) => ({
    content: [{ type: "text", text: `Role: ${role}\nContent: ${PSI_CHECK_PROMPT}` }]
  })
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);