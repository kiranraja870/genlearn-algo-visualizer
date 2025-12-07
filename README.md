# GEN-LEARN – AI-Based Personalized Learning Twin (Digital Avatar)

An intelligent, adaptive learning platform that creates a personalized AI learning twin for every user. GEN-LEARN helps students learn faster using interactive modules, visualizations, real-world examples, and AI-powered recommendations.

⚠️ Ownership Notice:
This project is developed solely by Kiran Raja.
Reproduction, reuse, or copying of any part of this repository is not allowed without explicit permission.
# ✨ Key Features
🔹 Algorithm Visualizer

Sorting algorithms (Bubble, Selection, Merge, Quick, etc.)

Graph traversal (BFS, DFS)

Pathfinding animations

Clear, step-by-step visual explanations

🔹 Dijkstra’s Algorithm – Real-World Demo

Maps various Ziauddin University campuses

Calculates the shortest travel route

Shows full traversal and distance breakdown

Turns graph theory into a practical, real-world example

🔹 AI-Powered CV Analyzer

Upload CVs (PDF/Text)

AI evaluates skills, experience, structure, and relevance

Generates a visual report with strengths, weak areas, and skill match

Helps users improve their CVs using AI-driven insights
## Interactive Visualizers

Includes animated visualizers for:

Sorting algorithms

Searching algorithms

Graph algorithms

Real-time step-by-step animations
# 🛠️ Tech Stack

Frontend: React, Next.js, Tailwind CSS

Backend / Logic: JavaScript, Python (AI for CV analysis)

Visualizations: Custom DOM animations, Canvas, Graph logic

Map Integration: Custom graph mapping for Ziauddin campuses

Tools: GitHub, GitHub Actions (optional), Node.js
## System Architecture

                 +------------------------------+
                 |      User Interaction        |
                 | (Website + Digital Avatar UI)|
                 +---------------+--------------+
                                 |
                                 v
      +-----------------------------------------------------+
      |            Algorithm Visualizer Module              |
      | (Sorting • Graph Traversal • Pathfinding Animations)|
      +----------------------+------------------------------+
                             |
                             v
              +------------------------------+
              |   Dijkstra Real-World Demo   |
              | (Ziauddin Campus Shortest    |
              |       Path Mapping)          |
              +---------------+--------------+
                              |
                              v
        +----------------------------------------------+
        |    AI-Powered CV Analyzer Dashboard          |
        | (Skill Check • Strengths • Weak Areas •      |
        |        Experience Summary)                   |
        +------------------+---------------------------+
                           |
                           v
               +-----------------------------+
               |      Backend / Logic        |
               | (AI Processing • Parsing    |
               |  Evaluation Algorithms)     |
               +---------------+-------------+
                               |
                               v
                +-----------------------------+
                |      Data Handling Layer    |
                | (Uploaded CVs • Algorithm   |
                |   Input Data • Graph Maps)  |
                +---------------+-------------+
                               |
                               v
                +-----------------------------+
                |      Visualization Layer    |
                | (Charts • Graphs • UI Flow) |
                +-----------------------------+

## 📂 Project Structure

gen-learn/
│── app/
│   ├── page.tsx
│   ├── visualizer/
│   ├── dijkstra/
│   └── cv-analyzer/
│
│── components/
│── public/
│── styles/
│── utils/
│── package.json
└── README.md




---

## 📦 Installation

```bash
# 1. Clone repository
git clone https://github.com/your-username/gen-learn.git

# 2. Enter folder
cd gen-learn

# 3. Install dependencies
npm install

# 4. Run development server
npm run dev



