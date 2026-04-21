const fs = require('fs');
let content = fs.readFileSync('src/constants/prompts.ts', 'utf8');
const lines = content.split('\n');

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("} else if (program === 'Aircraft Mechanics') {") && startIndex === -1) {
    startIndex = i;
  } else if (lines[i].includes("  } else if (templateType === 'Lesson Plan') {") && startIndex !== -1 && endIndex === -1) {
    endIndex = i;
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  const newBlock = `    } else if (program === 'Aircraft Mechanics' || program === 'Welding') {
      specificInstruction = \`
    # **EVIT Storyboard RDO: Module Storyboard — \${program}**

    This RDO guides AI in generating the complete Module Storyboard for EVIT \${program.toLowerCase()} modules. Part 1 covers the module structure and resources (Table of Contents, Module Overview, Instructor Guide, Readings, and Videos). Part 2 covers student-facing Assignments and Labs/Practicums. Both parts are built from the module Blueprint and cross-referenced against the Technical Standards.

    **Directions**
    To create an effective Module Storyboard, follow these steps:

    1. IMPORTANT: Do not start any sentences with "Understanding" or "Your understanding"

    2. Apply the NO AMPERSANDS rule
       - Replace every instance of "&" with the word "and" throughout all generated content — no exceptions

    3. Follow the EVIT Storyboard Template sequence
       - Generate content in this exact order: Overview → Instructor Guide → Resource Pages (Readings and Videos) → Assignments → Labs/Practicums → Assessments
       - Do not reorder or skip sections

    **PART 1: Module Overview and Structure**

    4. Build the Table of Contents
       - Group pages by category: Overview, Instructor Guide, Resources, Assignments, Labs/Practicums, Assessments
       - Create a single "Readings and Resources" page AND a single "Videos" page — do not create separate pages for each topic
       - Mark the following items as "[No template here in storyboard; template already set up in Canvas]": Video Guides, Vocabulary Journal, Bell Work, and Professionalism

    5. Build the Module Overview page
       - Paste the "Module Overview" and "Learning Objectives" directly from the Blueprint
       - Include the Vocabulary List link placeholder
       - Populate the Module Items to Be Completed table with all assignments, labs/practicums, and assessments from the Blueprint; leave the Due Date column blank

    6. Build the Instructor Guide
       - Copy topic names and durations from the Blueprint Daily Schedule into the Overview table
       - List all items from the Blueprint "Supplies/Equipment Needed" section under Materials Needed; if this section is empty or incomplete, generate a generic list of professional \${program.toLowerCase()} tools and materials based on the activity descriptions; list items only — no descriptions
       - Include Special Considerations for any schedule changes such as guest speakers, field trips, or special events; if none apply, leave the placeholder

    7. Build Resource pages
       - Create a single Readings and Resources page AND a single Videos page for the entire module
       - **Readings and Resources:** Open with the standard textbook sentence using "Day X" as placeholder; follow with every link and resource title found in the "Readings" section of the Blueprint
       - **Videos:** Open with the standard viewing sentence; list all video titles and full URLs from the "Videos / Multimedia" section of the Blueprint; include optional videos if present with the standard optional note

    **PART 2: Assignments and Labs**

    8. Build Assignment pages
       - Convert Blueprint activity codes to descriptive titles; do not include numbering in the page title
       - Write the Objective by referencing the specific Learning Objective(s) from the Blueprint directly — use student-facing language beginning with "In this assignment, you will be…"
       - Generate a Materials Needed list based on the specific activity; if the Blueprint "Module Tools" section is incomplete, generate a generic list of appropriate \${program.toLowerCase()} tools and materials; do not include laptops, tablets, or the textbook
       - Format Instructions as one primary directive sentence ending in a period, followed by sub-bullets that provide step-by-step detail
       - Use the exact Submission template: "This assignment is due at the end of class on **Day X.** You will submit your assignment **[here/in class]**."
       - For Quiz assignments, use the Quiz format with 20 points total

    9. Build Lab/Practicum pages
       - Convert Blueprint activity codes to descriptive titles; do not include numbering in the page title
       - Write the Objective in student-facing language beginning with "In this lab/practicum, you will…"
       - Generate a Materials Needed list relevant to the lab requirements; if the Blueprint "Module Tools" section is incomplete, generate a generic list of appropriate \${program.toLowerCase()} tools and materials; do not include laptops, tablets, or the textbook
       - Format Instructions as one primary directive sentence ending in a period, followed by sub-bullets that provide step-by-step detail
       - Generate Safety Precautions as needed; write as complete sentences
       - Generate Professionalism Guidelines as needed; write as complete sentences
       - Use the exact Submission template: "This lab/practicum is due at the end of class on **Day X.** You will submit your lab/practicum **[here/in class]**."

    10. Build Assessment pages
        - For Exams: use the Exam format, set up for 60 points total, include the boilerplate Canvas instructions, list objectives as bullets
        - For Projects: use the Project format, set up for 60 points total, include Materials Needed, Instructions, and Submission sections
        - Do not generate rubric content — include rubric headers only as shown in the template

    11. Apply Technical Standards cross-referencing
        - For every assignment and lab/practicum, verify that all technical terminology matches the language used in the Technical Standards file
        - Correct any terminology in activity descriptions that does not align with the Standards

    GOLD STANDARD STORYBOARD EXAMPLE:
    [IMPORTANT: Avoid phrases like "Understanding helps you to X" or "Knowing this helps you to X" — use specific, actionable language instead.]

    ---

    [Insert course code - course title]

    # **Module X: Title | X days**

    ---

    ## **Table of Contents**

    * START HERE: Module X Overview
    * Module X Instructor Guide: KEEP HIDDEN FROM STUDENTS
    * RESOURCES
      * Readings and Resources
      * Videos
    * ASSIGNMENTS
      * [Title of Assignment]
      * [Title of Assignment]
      * Video Guides [No template here in storyboard; template already set up in Canvas]
      * Vocabulary Journal [No template here in storyboard; template already set up in Canvas]
      * Bell Work [No template here in storyboard; template already set up in Canvas]
    * LABS/PRACTICUMS
      * [Title of Lab/Practicum]
      * [Title of Lab/Practicum]
      * Professionalism [No template here in storyboard; template already set up in Canvas]
    * ASSESSMENTS
      * [Title of Assessment]

    ---

    # **START HERE: Module X Overview**

    | Production Notes: Build as Page<br>Add the vocabulary document to the respective module folder in Files, then link to “Vocabulary List” |
    | :--- |

    **[Title of the Module]**

    In this module, you will TK.

    **By the end of this module, you will be able to:**
    * [Insert LOs from Blueprint]

    **Vocabulary List**

    | Module Items to Be Completed | Activity Type | Due Date |
    | --- | --- | --- |
    | [Title of Assignment, Lab/Practicum, or Assessment] | [Assignment, Lab/Practicum, or Assessment] | [Leave blank - to be completed by teacher] |
    | | | |
    | | | |
    | | | |

    ---

    # **Module X Instructor Guide: KEEP HIDDEN FROM STUDENTS**

    | Production Notes: Upload final Lesson Plans, Standards, and Answer Key docs (if applicable) to “Files” in respective module folder<br>Link to the files as follows:<br>Just “Answer Key” text is linked in the table, not the entire title<br>“Technical and Professional Standards” in the table<br>“Lesson Plans” and click “Link Options” to select Preview inline > Expand preview by Default |
    | :--- |

    ## **Overview**

    | Topic | Duration |
    | --- | :---: |
    | [Copy these from blueprint] | X days |
    | | X days |
    | | X days |
    | **Assessment:** [Title of Exam/Project], Answer Key | 1 day |
    | Technical and Professional Standards | |

    ## **Lesson Plans**
    Lesson Plans

    ## **Materials Needed**
    Below are the materials you will need to gather for this module.
    * [List items, do not include items that would be used in every module, such as laptops, notebooks, pens/pencils, etc.]

    ## **Special Considerations**
    * [Include as necessary, note reminders of prepping for guest speakers, field trips, etc.]

    ---

    # **[Topic X title] – Readings and Resources**

    | Production Notes: Build as Page<br>Upload final docs to “Files” in respective module folder, then link to document<br>Link name of website(s) |
    | :--- |

    For this module, you will need to read **chapter X** of your ***[title]*** textbook. Please be sure you have read the full chapter by the end of Day X.

    Here are the resources you'll need during this section of the module:
    * Lecture Notes - [title, if necessary]
      * [e.g., “Focus on slides 1-17.” or “This will be relevant for Days x-y of this module.”]
    * [Link to website/handout]
      * [e.g., “This will be relevant to the Historical Styling Lab/Practicum.” or “This will be relevant for Days x-y of this module.”]

    ---

    # **[Topic X title] – Videos**

    | Production Notes: Build as Page<br>Link to videos, ensuring link opens in a new window |
    | :--- |

    During this module, be sure you have viewed the following videos:
    * Link to Video #1 (time)
    * Link to Video #2 (time)

    The following videos may be **optional**, but follow your teacher’s instructions:
    * Link to Video #3 (time)
    * Link to Video #4 (time)

    ---

    # **[Title of Assignment]**

    | Production Notes: Build as Assignment<br>Use Assignment template in Canvas<br>Customize the attached EVIT Assignment Rubric - Template (see below) |
    | :--- |

    ## **Objective**
    [Copy brief description of Assignment from Blueprint; edit as needed.]

    ## **Materials Needed**
    For this assignment, you will need to access the following:
    * [List any needed handouts, resources, etc.]

    ## **Instructions**
    1. **[Step 1 in sentence case with a period at the end.]**
    * Sub-bullets to give more detail about what the step includes.

    2. **[Step X in sentence case with a period at the end.]**
    * Sub-bullets to give more detail about what the step includes.

    ## **Submission**
    This assignment is due at the end of class on **Day X.**

    You will submit your assignment **[here/in class]**.

    ---

    ## **Rubric**
    **Assignment: [Title] Rubric**

    | Understanding of Course Material | | | | |
    | :--- | :--- | :--- | :--- | :--- |
    | Related LO(s): [insert learning objective(s)] | Demonstrates thorough understanding of X and accurate use of related concepts. | Demonstrates good understanding of X with minor errors or omissions. | Demonstrates basic understanding of X; some errors or misconceptions. | Shows little understanding of X; many errors or misconceptions. |

    ---

    # **[Title of Assignment] [For Quizzes]**

    | Production Notes: Build as Quiz<br>Use Assignment - Quiz template in Canvas<br>Set up for 20 points total |
    | :--- |

    ## **Objective**
    You will complete a [X]-question quiz to show what you have learned about Y.

    This quiz assignment is worth **20 points total** (X points per question).

    ## **Instructions**
    [boilerplate in Canvas]

    ## **Submission**
    This assignment is due before the end of class on **Day X.**

    You will submit your assignment **here**.

    ---

    # **[Title of Lab/Practicum]**

    | Production Notes: Build as Assignment<br>Use Labs/Practicum template in Canvas<br>Customize the attached EVIT Labs/Practicum Rubric - Template (see below) |
    | :--- |

    ## **Objective**
    [Copy brief description of WBL Activity from Blueprint; edit as needed.]

    ## **Materials Needed**
    For this lab/practicum, you will need to access the following:
    * [List any needed handouts, resources, etc.]

    ## **Instructions**
    1. **[Step 1 in sentence case with a period at the end.]**
    * Sub-bullets to give more detail about what the step includes.

    2. **[Step X in sentence case with a period at the end.]**
    * Sub-bullets to give more detail about what the step includes.

    ## **Safety Precautions**
    * [List as needed. Should be complete sentences.]

    ## **Professionalism Guidelines**
    * [List as needed. Should be complete sentences.]

    ## **Submission**
    This lab/practicum is due at the end of class on **Day X.**

    You will submit your lab/practicum **[here/in class]**.

    ---

    ## **Rubric**
    **Lab/Practicum: [Title] Rubric**

    | Demonstrating Skills Appropriately | | | | |
    | :--- | :--- | :--- | :--- | :--- |
    | Related LO(s): [insert learning objective(s)] | Performs all required skills related to X accurately and efficiently. | Performs most skills related to X well; minor errors. | Performs some skills related to X; several errors or inefficiencies. | Struggles with skills related to X; frequent errors or incomplete tasks. |

    ---

    # **[Title of Assessment] [For Exams]**

    | Production Notes: Build as Quiz<br>Use Assessment - Exam template<br>See “Assessment Answer Key” document for this module for the questions<br>Set up for 60 points total |
    | :--- |

    ## **Objective**
    You will complete a [X]-question assessment to show what you’ve learned in this module.

    The questions will cover the following objectives:
    * [List objectives]

    This assessment is worth **60 points total** (X points per question).

    ## **Instructions**
    [text below is boilerplate in Canvas]

    1. **Take your time.**
       * Read each question carefully before answering.
       * Answer all questions. If you’re unsure, make your best guess.
    2. **If applicable, show your thinking.**
       * For short answer questions, write in complete sentences and explain your reasoning.
    3. **Stay focused and do your own work.**
       * This assessment must be completed individually and is closed book/notes unless your teacher says otherwise.
       * Keep your eyes on your own screen.
       * Do not use your phone or talk to classmates during the test.
    4. **Check your answers.**
       * If you finish early, review your answers to make sure you didn’t miss anything.
    5. **Submit your assessment.**
       * Follow your teacher’s instructions for turning in your test.

    ## **Submission**
    This assessment is due before the end of class on **Day X.**

    You will submit your assessment **here**.

    ---

    # **[Title of Assessment] [For Projects]**

    | Production Notes: Build as Assignment<br>Use Assessment - Project template in Canvas<br>Customize the attached EVIT Assessments Rubric - Template (see below) |
    | :--- |

    ## **Objective**
    You will complete a culminating project on X to show what you have learned in this module. This project will cover the following objectives:
    * [List objectives]

    This assessment is worth **60 points total**.

    ## **Materials Needed**
    For this assessment, you will need to access the following:
    * [List any needed handouts, resources, etc.]

    ## **Instructions**
    **[Step 1 in sentence case with a period at the end.]**
    * Subbullets to give more detail about what the step includes.

    **[Step X in sentence case with a period at the end.]**
    * Subbullets to give more detail about what the step includes.

    ## **Submission**
    This assessment is due at the end of class on **Day X.**

    You will submit your assessment **[here/in class]**.

    ---

    ## **Rubric**
    **Assessment: [Title]**

    | Understanding of Course Material | | | | |
    | :--- | :--- | :--- | :--- | :--- |
    | Related LO(s): [insert learning objective(s)] | Demonstrates a thorough and accurate understanding of X; integrates material insightfully. | Demonstrates good understanding of X with minor errors or omissions. | Shows basic understanding of X; some errors or misconceptions present. | Shows little understanding of X; many errors or misconceptions. |
    | **Demonstrating Skills Appropriately** | | | | |
    | Related LO(s): [insert learning objective(s)] | Performs all required skills related to X accurately and efficiently. | Performs most skills related to X well; minor errors. | Performs some skills related to X; several errors or inefficiencies. | Struggles with skills related to X; frequent errors or incomplete tasks. |
      \`;
`;
  lines.splice(startIndex, endIndex - startIndex, newBlock);
  fs.writeFileSync('src/constants/prompts.ts', lines.join('\n'), 'utf8');
  console.log('Successfully replaced block.');
} else {
  console.log('Could not find markers.');
}
