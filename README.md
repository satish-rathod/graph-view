# CS Academy Graph Editor - Interactive Graph Visualization Tool

An interactive, modern graph visualization tool built with **React** and **Cytoscape.js**, featuring support for directed/undirected and weighted/unweighted graphs. Users can create, edit, and simulate classic graph algorithms like **DFS, BFS, Dijkstra’s, and Topological Sort**.

Designed with a sleek interface using **shadcn/ui components** and deployed on **Vercel** for instant access.

---

## 🌐 Live Demo

[👉 Click here to try it (Vercel Link)](https://your-vercel-url.vercel.app) *(Add after deployment)*

---

## 🧱 Tech Stack

| Tool/Library     | Purpose                              |
|------------------|--------------------------------------|
| React            | App framework                        |
| Cytoscape.js     | Graph rendering and interaction      |
| shadcn/ui        | Beautiful prebuilt UI components     |
| TailwindCSS      | Utility-first styling framework      |
| Vercel           | Hosting & deployment                 |
| TypeScript (opt) | Type safety (optional but recommended) |

---

## ✨ Features

### 🔧 Graph Editor
- Add and delete **nodes**
- Add and delete **edges**
- Toggle:
  - Directed / Undirected mode
  - Weighted / Unweighted mode
- Input edge weights manually
- Drag nodes freely (auto-layout support)
- Fix/unfix node positions
- Zoom & pan canvas
- Adjacency list display

### 📊 Algorithms (Visual Simulation)
- ✅ Depth First Search (DFS)
- ✅ Breadth First Search (BFS)
- ✅ Dijkstra’s Shortest Path
- ✅ Topological Sort (for DAGs)

Visual indicators:
- Highlighted traversal
- Step-by-step animation
- Optionally show visited order, distance updates

### 🎛️ UI Components
- Clean control panel using shadcn/ui
- Toggle buttons for graph types
- Select dropdowns for algorithm inputs
- Toasts/alerts for errors (e.g., “Graph contains cycle”)
- Dark/light mode

---

## 🗂️ Folder Structure

src/
├── components/
│ ├── GraphCanvas.tsx # Cytoscape graph canvas
│ ├── ControlsPanel.tsx # Graph type + algorithm controls
│ ├── NodeEdgeManager.tsx # Add/Delete nodes/edges
│ ├── AlgorithmRunner.tsx # Start/stop algorithm simulations
├── lib/
│ ├── algorithms/
│ │ ├── bfs.ts
│ │ ├── dfs.ts
│ │ ├── dijkstra.ts
│ │ └── topoSort.ts
│ └── graphUtils.ts # Adjacency list, weight handlers
├── App.tsx
├── main.tsx
└── index.css

yaml
Copy
Edit

---

## 🛠️ Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/your-username/graph-visualizer.git
cd graph-visualizer

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
🚀 Deployment (Vercel)
Push to a GitHub repo

Go to vercel.com

Import your repo and follow setup

Set framework as React and root directory if needed

Click Deploy

🧪 Development Plan
Week 1: Base Setup
Scaffold project

Setup Cytoscape canvas

Add shadcn/ui components

Week 2: Graph Creation Tools
Node/Edge creation & deletion

Graph type toggles

Edge weight input

Week 3: Algorithm Logic
Implement DFS & BFS

Add Dijkstra with weight handling

Add Topological Sort (detect cycles)

Week 4: Visual Polish & UX
Step-by-step mode

UI polish (toasts, tooltips)

Export to PNG

Dark/light toggle

Final testing + Vercel deploy

🔮 Future Improvements
Add more algorithms: Kruskal, Prim, SCC

Save/load graphs using localStorage

JSON import/export

Group nodes by tags or layers

Mobile responsive UI

📜 License
MIT License – free to use, remix, and build on.

🙌 Acknowledgments
Cytoscape.js

shadcn/ui

React