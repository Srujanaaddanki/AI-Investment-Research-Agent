const fs = require("fs");
const path = require("path");

const LOG_FILE = "C:\\Users\\hp\\.gemini\\antigravity\\brain\\5f137edc-35f7-4b76-9939-6f7b4601fd5e\\.system_generated\\logs\\transcript.jsonl";
const OUTPUT_FILE = path.join(__dirname, "chat_transcript.md");

function parseLog() {
  if (!fs.existsSync(LOG_FILE)) {
    console.error("Log file not found at " + LOG_FILE);
    return;
  }

  const lines = fs.readFileSync(LOG_FILE, "utf-8").split("\n");
  let mdContent = "# LLM Pair Programming Chat Transcript & Logs\n\n";
  mdContent += "This document contains the complete step-by-step chat history and agent action logs during the collaborative development of the AI Investment Research Agent.\n\n---\n\n";

  let lastRole = "";

  lines.forEach((line) => {
    if (!line.trim()) return;
    try {
      const step = JSON.parse(line);
      
      // Determine the speaker/action
      if (step.source === "USER_EXPLICIT" && step.type === "USER_INPUT") {
        const rawContent = step.content;
        // Clean up metadata tags if any
        let userRequest = rawContent;
        const match = rawContent.match(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/);
        if (match && match[1]) {
          userRequest = match[1].trim();
        }
        mdContent += `### 👤 User Request (${new Date(step.created_at).toLocaleTimeString()})\n\n`;
        mdContent += `${userRequest}\n\n---\n\n`;
        lastRole = "USER";
      } else if (step.source === "MODEL" && step.type === "PLANNER_RESPONSE") {
        const text = step.content || "";
        const toolCalls = step.tool_calls || [];
        
        mdContent += `### 🤖 Antigravity (AI Assistant) (${new Date(step.created_at).toLocaleTimeString()})\n\n`;
        if (text) {
          mdContent += `${text}\n\n`;
        }
        if (toolCalls.length > 0) {
          mdContent += `**Executed Actions / Tool Calls:**\n`;
          toolCalls.forEach((call) => {
            mdContent += `- **Tool**: \`${call.name}\` \n  - **Purpose**: ${call.args.toolAction || call.args.toolSummary || "Execute process"}\n`;
          });
          mdContent += `\n`;
        }
        mdContent += `---\n\n`;
        lastRole = "MODEL";
      }
    } catch (e) {
      // Skip malformed lines
    }
  });

  fs.writeFileSync(OUTPUT_FILE, mdContent, "utf-8");
  console.log("Chat transcript successfully exported to " + OUTPUT_FILE);
}

parseLog();
