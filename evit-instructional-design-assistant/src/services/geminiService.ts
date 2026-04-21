import Anthropic from '@anthropic-ai/sdk';
import { getSystemInstruction } from '../constants/prompts';

export const generateCourseMaterial = async (
  blueprint: string,
  templateType: "Lesson Plan" | "Storyboard" | "Assessment Key" | "Vocabulary List",
  program: string,
  moduleSelection: string,
  onChunk: (text: string) => void
) => {
  const systemInstruction = getSystemInstruction(templateType, program);
// 1. Read API key using the Vite-specific command
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;

  // 2. Check if it exists (using the new name in the error message)
  if (!apiKey) {
    throw new Error("VITE_CLAUDE_API_KEY environment variable is missing in Amplify");
  }

  const anthropic = new Anthropic({ 
    apiKey,
    dangerouslyAllowBrowser: true, 
  });

  const anthropic = new Anthropic({ 
    apiKey,
    dangerouslyAllowBrowser: true, // Required to call Anthropic directly from the browser
  });

  let moduleInstruction = "";
  if (moduleSelection && moduleSelection !== "All Modules") {
    moduleInstruction = `\n\nCRITICAL INSTRUCTION: The user has uploaded a full blueprint but requested material ONLY for ${moduleSelection}. You MUST ONLY generate the ${templateType} for ${moduleSelection}. Ignore all other modules in the blueprint.`;
  }

  const prompt = `Generate a ${templateType} based on the following blueprint data. 
    
    IMPORTANT: For any Multiple Choice Questions, you MUST ensure that each option (A, B, C, D) is on its own separate line in the raw text output. Do not combine them into a single line.${moduleInstruction}
    
    Blueprint Data:
    ${blueprint}`;

  let fullText = "";
  let currentMessages: any[] = [{ role: "user", content: prompt }];
  
  try {
    // Loop up to 3 times to handle long outputs that hit the max_tokens limit
    for (let i = 0; i < 3; i++) {
      const stream = await anthropic.messages.stream({
        model: "claude-sonnet-4-6",
        max_tokens: 8192,
        system: systemInstruction,
        messages: currentMessages,
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          const textChunk = chunk.delta.text;
          fullText += textChunk;
          onChunk(textChunk);
        }
      }

      const finalMessage = await stream.finalMessage();
      if (finalMessage.stop_reason === 'max_tokens') {
        console.log(`Hit max_tokens limit (iteration ${i + 1}). Continuing generation...`);
        currentMessages = [
          { role: "user", content: prompt },
          { role: "assistant", content: fullText },
          { role: "user", content: "Continue exactly where you left off. Output ONLY the continuation of the document, with no introductory or concluding text." }
        ];
      } else {
        break;
      }
    }
  } catch (error: any) {
    console.error("Error generating content:", error);
    throw new Error(error.message || "Failed to generate content");
  }
};
