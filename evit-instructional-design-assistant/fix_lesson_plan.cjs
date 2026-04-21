const fs = require('fs');
let content = fs.readFileSync('src/constants/prompts.ts', 'utf8');
const lines = content.split('\n');

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("} else if (program === 'Aircraft Mechanics') {") && startIndex === -1) {
    startIndex = i;
  } else if (lines[i].includes("  } else if (templateType === 'Vocabulary List') {") && startIndex !== -1 && endIndex === -1) {
    endIndex = i;
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  const newBlock = `    } else if (program === 'Aircraft Mechanics' || program === 'Welding') {
      specificInstruction = \`
# **EVIT Storyboard RDO: Daily Lesson Plan — \${program}**

This RDO guides AI in generating instructor-facing Daily Lesson Plans for EVIT \${program.toLowerCase()} modules. Each lesson plan is built from the module Blueprint and covers one day of a 2.5-hour class session, with structured time allocations, classroom activity ideas, and instructor tips calibrated to the hands-on learning requirements of a CTE \${program.toLowerCase()} program.

<directions>
To create an effective Daily Lesson Plan, follow these steps:

1. IMPORTANT: Do not start any sentences with "Understanding" or "Your understanding"

2. Apply the NO AMPERSANDS rule
   - Replace every instance of "&" with the word "and" throughout all generated content — no exceptions

3. Follow the EVIT Lesson Plan Template sequence
   - Generate content in this exact order: Day X Header → Objective(s) → Activities (Welcome, Instruction, Assignments/Labs, Wrap Up) → Instructor Tips
   - Do not reorder or skip sections

**PART 1: Lesson Plan Structure and Objectives**

4. Build the Lesson Plan Header
   - Start with the standard header: "# **Lesson Plans**" followed by "# **Module [X]: [Title]**"
   - Include the standard Vocabulary Journal note at the top of the document
   - For each day, create a table with the header "Day X: [Topic Title]"

5. Write the Objective(s)
   - Copy the specific Learning Objective(s) directly from the Blueprint that align with the day's topic
   - If the day covers an Assessment, write: "Demonstrate mastery of module learning objectives."

**PART 2: Activities and Time Allocation**

6. Structure the Activities Section (Total time: 150 minutes / 2.5 hours)
   - **Welcome and Introduction (10 minutes):** Include a Bell Work prompt relevant to the day's topic and a brief agenda overview
   - **Direct Instruction ([XX] minutes):** Provide specific lecture topics, demonstration ideas, or discussion points; allocate time reasonably based on the topic's complexity
   - **Assignments and Labs/Practicums ([XX] minutes total):**
     - List the specific Assignment or Lab/Practicum title from the Blueprint
     - Break down the time: Introduction/Safety Review (5-10 mins), Student Work Time, Clean-up/Review (10 mins)
     - Provide brief guidance on how the instructor should facilitate the activity
   - **Wrap Up and Closing (10 minutes):** Include 1-2 debrief questions and an optional Exit Ticket prompt

7. Write Instructor Tips
   - Provide 3-5 actionable tips for the instructor
   - Include: Subject Matter Focus, Teaching Strategy, Safety Reminders (crucial for \${program.toLowerCase()}), Common Student Challenges, and Extension Opportunities

8. Format Assessment Days
   - For days dedicated to Exams or Projects, adjust the Activities section:
     - Welcome and Introduction (10 minutes)
     - Direct Instruction: Module Review (20-30 minutes)
     - Exam Instructions and Set-Up (5 minutes)
     - ASSESSMENT: [Title] (Remaining time)
     - Wrap Up and Closing (10 minutes)

9. Apply Technical Standards cross-referencing
   - Verify that all technical terminology matches the language used in the Technical Standards file
   - Correct any terminology that does not align with the Standards

<gold_standard_example>
[IMPORTANT: Avoid phrases like "Understanding helps you to X" or "Knowing this helps you to X" — use specific, actionable language instead.]

# **Lesson Plans**
# **Module [X]: [Title]**

*At the beginning of each module, introduce the Vocabulary Journal assignment. Remind students to add new terms and definitions as they encounter them throughout the module. The completed journal will be submitted at the end of the module.*

| Day 1: [Topic Title] | |
| :--- | :--- |
| **Objective(s):** | • [Copy from Blueprint]<br>• [Copy from Blueprint] |
| **Activities:** | |
| **Welcome and Introduction** | **Welcome and Introduction (10 minutes)**<br>Bell work prompt: [Write a specific, engaging question related to the day's topic]<br>Briefly introduce today's objective and agenda. |
| **Direct Instruction** | **Direct Instruction: [Topic] ([XX] minutes)**<br>• [Specific lecture point or demonstration idea]<br>• [Specific lecture point or demonstration idea]<br>• [Specific lecture point or demonstration idea] |
| **ASSIGNMENT: [Title]** | **ASSIGNMENT: [Title] ([XX] minutes total)**<br>Introduction (5 minutes): [Briefly explain how to set up the assignment]<br>Student Work Time ([XX] minutes): [What students will do and what the instructor should monitor]<br>Review (10 minutes): [How to review the assignment] |
| **LAB/PRACTICUM: [Title]** | **LAB/PRACTICUM: [Title] ([XX] minutes total)**<br>Lab Introduction and Safety Review (10 minutes): [Specific safety points to cover]<br>Student Work Time ([XX] minutes): [What students will do and what the instructor should monitor]<br>Clean-up and Review (10 minutes): [Clean-up procedures and brief review] |
| **Wrap Up and Closing** | **Wrap Up and Closing (10 minutes)**<br>Debrief Questions:<br>• [Question 1]<br>• [Question 2]<br>Exit Ticket: [Optional prompt] |
| **Instructor Tips** | **Instructor Tips**<br>• Subject Matter Focus: [Key concept]<br>• Teaching Strategy: [Actionable tip]<br>• Safety Reminders: [Specific safety tip]<br>• Common Student Challenges: [Anticipated issue and solution]<br>• Extension Opportunities: [Idea for early finishers] |

{{Repeat table format for each day in the module}}

| Day X: Assessment | |
| :--- | :--- |
| **Objective(s):** | • Demonstrate mastery of module learning objectives. |
| **Activities:** | |
| **Welcome and Introduction** | **Welcome and Introduction (10 minutes)**<br>Bell work prompt: [Review question]<br>Briefly introduce today's objective and agenda. |
| **Direct Instruction** | **Direct Instruction: Module Review ([XX] minutes)**<br>• [Review strategy]<br>• [Review strategy] |
| **Exam Instructions and Set-Up** | **Exam Instructions and Set-Up (5 minutes)**<br>• Distribute materials and review instructions.<br>• Ensure all students have necessary materials. |
| **ASSESSMENT: [Title]** | **Assessment: [Title] ([XX] minutes)**<br>• [Administration details]<br>• [Submission details] |
| **Wrap Up and Closing** | **Wrap Up and Closing (10 minutes)**<br>Debrief Questions:<br>• [Reflection question]<br>Exit Ticket: [Optional prompt] |
| **Instructor Tips** | **Instructor Tips**<br>• Subject Matter Focus: [Key concept]<br>• Teaching Strategy: [Actionable tip]<br>• Common Student Challenges: [Anticipated issue and solution]<br>• Extension Opportunities: [Idea for early finishers] |
</gold_standard_example>
      \`;`;
  lines.splice(startIndex, endIndex - startIndex, newBlock);
  fs.writeFileSync('src/constants/prompts.ts', lines.join('\n'), 'utf8');
  console.log('Successfully replaced block.');
} else {
  console.log('Could not find markers.');
}
