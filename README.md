# 🎯 Graph View - Interactive Graph Visualization Tool

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_App-blue?style=for-the-badge)](https://graph-view-black.vercel.app/)
[![Video Demo](https://img.shields.io/badge/🎥_Video_Demo-Watch_Now-red?style=for-the-badge)](https://www.loom.com/share/c89988cf6f9644aeb83515972764f641?sid=bbd4d1ec-c0c6-4da1-ab74-0e98dd8a5aa1)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![D3.js](https://img.shields.io/badge/D3.js-7.8.5-F7931E?style=for-the-badge&logo=d3.js)](https://d3js.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.3.2-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

A modern, interactive graph visualization tool inspired by CS Academy's Graph Editor. Built with React and D3.js, featuring a beautiful gradient UI, smooth drag-and-drop interactions, and powerful graph manipulation capabilities.

---

## 🚀 **Live Demo & Video**

### 🌐 **[Live Application](https://graph-view-black.vercel.app/)**
Experience the full functionality of Graph View in your browser.

### 🎥 **[Video Demonstration](https://www.loom.com/share/c89988cf6f9644aeb83515972764f641?sid=bbd4d1ec-c0c6-4da1-ab74-0e98dd8a5aa1)**
Watch a complete walkthrough of all features and capabilities.

---

## ✨ **Key Features**

### 🎨 **Beautiful User Interface**
- **Modern Gradient Design** - Professional purple-to-blue gradient theme
- **Three-Panel Layout** - Input editor, graph canvas, and control panel
- **Responsive Design** - Works seamlessly across different screen sizes
- **Interactive Elements** - Smooth hover effects and transitions

### 🔧 **Graph Editing Capabilities**
- **Drag & Drop Nodes** - Smooth, precise node movement without coordinate snapping
- **Real-time Updates** - Graph renders instantly as you modify input data
- **Interactive Canvas** - Zoom, pan, and navigate large graphs effortlessly
- **Node Selection** - Click nodes to select and highlight them

### 📊 **Graph Modes & Visualization**
- **Directed/Undirected Graphs** - Switch between graph types with proper arrow rendering
- **Weighted Edges** - Support for edge weights with visual thickness variation
- **Tree Mode** - Special green styling for tree structures
- **Component Analysis** - Color-coded connected components visualization
- **Bidirectional Edges** - Curved edges for two-way connections

### 📝 **Professional Input System**
- **ACE Code Editor** - Syntax highlighting and professional editing experience
- **Flexible Input Format** - Support for edge lists, weighted edges, and standalone nodes
- **Real-time Parsing** - Graph updates as you type
- **Format Examples** - Built-in guide for input formatting

### 🎯 **Advanced Features**
- **Single Node Support** - Create standalone nodes (e.g., "100")
- **Mixed Input** - Combine edges and standalone nodes in one input
- **Clear Functionality** - Reset input with header Clear button
- **State Management** - Persistent node positions during interactions

---

## 🛠️ **Technology Stack**

### **Frontend Framework**
- ![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react) **React 18.2.0** - Modern React with hooks and functional components
- ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript) **JavaScript ES6+** - Modern JavaScript features and syntax

### **Visualization & Graphics**
- ![D3.js](https://img.shields.io/badge/D3.js-7.8.5-F7931E?style=flat-square&logo=d3.js) **D3.js 7.8.5** - Powerful data visualization and DOM manipulation
- ![SVG](https://img.shields.io/badge/SVG-Graphics-FF6B6B?style=flat-square) **SVG** - Scalable vector graphics for crisp rendering

### **Styling & Design**
- ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.3.2-06B6D4?style=flat-square&logo=tailwindcss) **TailwindCSS 3.3.2** - Utility-first CSS framework
- ![PostCSS](https://img.shields.io/badge/PostCSS-8.4.24-DD3A0A?style=flat-square&logo=postcss) **PostCSS 8.4.24** - CSS processing and optimization
- ![Google Fonts](https://img.shields.io/badge/Google_Fonts-Inter-4285F4?style=flat-square&logo=google) **Inter Font** - Modern, professional typography

### **Code Editor Integration**
- ![ACE](https://img.shields.io/badge/ACE_Editor-1.23.4-2ECC71?style=flat-square) **ACE Editor 1.23.4** - Professional code editor with syntax highlighting
- ![React ACE](https://img.shields.io/badge/React_ACE-10.1.0-2ECC71?style=flat-square) **React-ACE 10.1.0** - React integration for ACE Editor

### **Development Tools**
- ![Create React App](https://img.shields.io/badge/Create_React_App-5.0.1-09D3AC?style=flat-square&logo=createreactapp) **Create React App 5.0.1** - Development environment and build tools
- ![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat-square&logo=node.js) **Node.js 16+** - JavaScript runtime environment
- ![Yarn](https://img.shields.io/badge/Yarn-Package_Manager-2C8EBB?style=flat-square&logo=yarn) **Yarn** - Fast, reliable package manager

### **Deployment & Hosting**
- ![Vercel](https://img.shields.io/badge/Vercel-Hosting-000000?style=flat-square&logo=vercel) **Vercel** - Modern deployment platform with automatic CI/CD

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v16.0.0 or higher)
- Yarn or npm package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### **Installation & Setup**

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd graph-view
   ```

2. **Install Dependencies**
   ```bash
   cd frontend
   yarn install
   # or using npm
   npm install
   ```

3. **Start Development Server**
   ```bash
   yarn start
   # or using npm
   npm start
   ```

4. **Open Application**
   ```
   http://localhost:3000
   ```

### **Production Build**
```bash
yarn build
# or using npm
npm run build
```

---

## 📖 **How to Use Graph View**

### **1. Input Graph Data**
In the left panel code editor, enter your graph using edge list format:

#### **Basic Edges**
```
1 2
1 3
2 4
3 4
```

#### **Weighted Edges**
```
1 2 5.5
1 3 2.0
2 4 3.5
```

#### **Standalone Nodes**
```
100
200
1 2
3 4
```

### **2. Choose Graph Type**
- **Undirected**: Standard graph with bidirectional edges
- **Directed**: Graph with arrows showing edge direction

### **3. Visualization Options**
- **Tree Mode**: Green styling for tree structures
- **Show Components**: Color-coded connected components

### **4. Interactive Features**
- **Drag Nodes**: Click and drag to reposition nodes
- **Select Nodes**: Click to highlight individual nodes
- **Zoom & Pan**: Mouse wheel to zoom, drag background to pan
- **Clear Input**: Use header Clear button to reset

---

## 🏗️ **Project Architecture**

```
graph-view/
├── frontend/
│   ├── public/
│   │   ├── index.html              # Main HTML template
│   │   └── favicon.ico             # Application icon
│   ├── src/
│   │   ├── App.js                  # Main application component
│   │   ├── App.css                 # Application-specific styles
│   │   ├── components.js           # All React components
│   │   ├── index.js                # Application entry point
│   │   └── index.css               # Global styles and Tailwind imports
│   ├── package.json                # Dependencies and scripts
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   └── postcss.config.js           # PostCSS configuration
├── .gitignore                      # Git ignore rules
└── README.md                       # Project documentation
```

### **Component Structure**
- **`App.js`** - Main application logic, state management, graph parsing
- **`Header`** - Navigation bar with branding and Clear button
- **`InputPanel`** - Left panel with ACE code editor and format guide
- **`GraphEditor`** - Center canvas with D3.js visualization and interactions
- **`ControlPanel`** - Right panel with options and interactive guide

---

## 🌟 **Features Showcase**

### **Interactive Graph Manipulation**
- Smooth drag-and-drop functionality
- Real-time edge updates during node movement
- Collision detection and natural positioning

### **Visual Excellence**
- Professional gradient backgrounds
- Smooth animations and transitions
- Responsive design for all screen sizes

### **Developer Experience**
- Hot reload for rapid development
- Modern React patterns and hooks
- Clean, maintainable code structure

---

## 🐛 **Troubleshooting**

### **Common Issues**

**Port Already in Use**
```bash
lsof -ti:3000 | xargs kill -9
yarn start
```

**Dependencies Not Installing**
```bash
yarn cache clean
rm -rf node_modules
yarn install
```

**Build Errors**
```bash
# Check Node.js version (should be 16+)
node --version
```

### **Performance Tips**
- Limit graph size for optimal performance (< 1000 nodes)
- Use Chrome DevTools for debugging
- Close unnecessary browser tabs when working with large graphs
---
