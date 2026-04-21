const fs = require('fs');
let content = fs.readFileSync('src/constants/prompts.ts', 'utf8');
const lines = content.split('\n');

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("if (program === 'Aircraft Mechanics') {") && startIndex === -1) {
    startIndex = i;
  } else if (lines[i].includes("  return baseInstruction + '\\n' + specificInstruction;") && startIndex !== -1 && endIndex === -1) {
    endIndex = i;
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  const newBlock = `    if (program === 'Aircraft Mechanics' || program === 'Welding') {
      specificInstruction = \`
    # **EVIT Storyboard RDO: Vocabulary List — \${program}**

    This RDO guides AI in generating the Key Terms Vocabulary List for EVIT \${program.toLowerCase()} modules. The list is built from the module Blueprint, the course textbook, and the \${program} Technical Standards, and follows the EVIT Vocabulary Journal format.

    **Directions**
    To create an effective Vocabulary List, follow these steps:

    1. IMPORTANT: Do not start any sentences with "Understanding" or "Your understanding"

    2. Apply the NO AMPERSANDS rule
       - Replace every instance of "&" with the word "and" throughout all generated content — no exceptions

    3. Extract Key Terms
       - Review the Blueprint (specifically the "Learning Objectives" and "Daily Schedule" sections) and the Technical Standards
       - Identify 15-25 essential technical terms, tools, processes, or concepts that are critical for mastery of the module
       - Do not include basic or general vocabulary; focus strictly on industry-specific terminology

    4. Format the Vocabulary List
       - Present the list as a simple bulleted list
       - Alphabetize the terms
       - Write terms in lowercase unless they are proper nouns or acronyms
       - Do not include definitions — the students will define these terms in their Vocabulary Journal assignment

    GOLD STANDARD VOCABULARY LIST EXAMPLE:
    [IMPORTANT: Avoid phrases like "Understanding helps you to X" or "Knowing this helps you to X" — use specific, actionable language instead.]

    ---

    # Vocabulary List

    # [Module Title]

    * [term in lowercase unless proper noun]
    * [term in lowercase unless proper noun]
    * [term in lowercase unless proper noun]
    * {{Continue in alphabetical order for all extracted terms}}
      \`;
    }
  }`;
  lines.splice(startIndex, endIndex - startIndex, newBlock);
  fs.writeFileSync('src/constants/prompts.ts', lines.join('\n'), 'utf8');
  console.log('Successfully replaced block.');
} else {
  console.log('Could not find markers.');
}
