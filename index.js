import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Create an MCP server
const server = new McpServer({
  name: "mcp-psi-report",
  version: "0.1.0"
});

// Define the role and content as specified
const role =
  "You are a web performance expert responsible for generating a report of the psi values for a given website.";

const PSI_CHECK_PROMPT = `
### Task

Generate a report of the psi values for a given website, crawl all the pages, all levels including nested pages of the website and perform below actions,
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

// --------------------
// (1) Register the main PSI report tool
// --------------------
server.registerTool(
  "Website Performance (PSI) Report Tool",
  {
    title: "Generate PSI Report",
    description: "Generate a comprehensive PSI report for a given website with crawling and analysis. This tool provides the complete analysis framework and instructions."
  },
  async (args) => {
    return {
      content: [
        { 
          type: "text", 
          text: `Role: ${role}\n\n${PSI_CHECK_PROMPT}\n\nIMPORTANT: Use these instructions to generate a comprehensive PSI report. The analysis should include crawling, sitemap generation, and detailed performance metrics for each page.` 
        }
      ]
    };
  }
);

// --------------------
// (2) Add a setup tool that provides the analysis framework
// --------------------
server.registerTool(
  "PSI Analysis Setup",
  {
    title: "Setup PSI Analysis Session",
    description: "Initialize a PSI analysis session with complete instructions and framework for website performance analysis."
  },
  async (args) => {
    return {
      content: [
        {
          type: "text",
          text: `PSI Analysis Session Setup Complete!\n\nRequired Framework:\n- Role: ${role}\n\nAnalysis Requirements:\n${PSI_CHECK_PROMPT}\n\nThis setup provides all necessary instructions for proper PSI analysis. Use the PSI Report Tool to begin your analysis.`
        }
      ]
    };
  }
);

// --------------------
// (3) Add a resource discovery tool
// --------------------
server.registerTool(
  "List Available Tools",
  {
    title: "Discover Available Tools",
    description: "List all available tools and their importance for PSI analysis"
  },
  async (args) => {
    return {
      content: [
        {
          type: "text",
          text: `Available Tools for PSI Analysis:\n\n1. Website Performance (PSI) Report Tool\n   - Description: Generate comprehensive PSI reports\n   - Contains: Complete analysis framework and instructions\n   - Status: PRIMARY TOOL for PSI analysis\n\n2. PSI Analysis Setup\n   - Description: Initialize analysis session\n   - Contains: Framework and requirements overview\n   - Status: RECOMMENDED for session initialization\n\n3. List Available Tools\n   - Description: Tool discovery and information\n   - Contains: Tool overview and usage guidance\n   - Status: HELPER TOOL\n\nThese tools provide everything needed for comprehensive PSI analysis. Start with PSI Analysis Setup, then use the main PSI Report Tool.`
        }
      ]
    };
  }
);

// --------------------
// (4) Start the server
// --------------------
// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);