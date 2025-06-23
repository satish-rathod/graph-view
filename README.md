# CS Academy Graph Editor - Interactive Graph Visualization Tool

A pixel-perfect replica of the CS Academy Graph Editor with full interactive functionality for graph visualization, editing, and analysis. Built with React and D3.js for educational purposes and competitive programming practice.

![CS Academy Graph Editor](https://img.shields.io/badge/Status-Complete-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![D3.js](https://img.shields.io/badge/D3.js-7.8.5-orange)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.2-blueviolet)

## 🎯 **Features**

### **Interactive Graph Visualization**
- ✅ **Drag & Drop Nodes** - Move nodes around the canvas with smooth interactions
- ✅ **Real-time Rendering** - Graph updates instantly as you modify input data
- ✅ **Zoom & Pan** - Navigate large graphs with mouse wheel and drag
- ✅ **Node Selection** - Click nodes to select and highlight them

### **Graph Modes**
- ✅ **Undirected Graphs** - Standard graph visualization
- ✅ **Directed Graphs** - Arrows show edge direction
- ✅ **Tree Mode** - Specialized tree visualization
- ✅ **Component Analysis** - Highlight connected components

### **Professional Input System**
- ✅ **ACE Code Editor** - Professional code editor with syntax highlighting
- ✅ **Edge List Format** - Support for `u v [weight]` format
- ✅ **Real-time Parsing** - Graph updates as you type
- ✅ **Line Numbers** - Easy navigation through large datasets

### **Layout & Visualization**
- ✅ **Auto Layout Generation** - Automatic graph positioning
- ✅ **Custom Positioning** - Manual node placement
- ✅ **Responsive Design** - Works on different screen sizes
- ✅ **Professional UI** - Clean, modern interface

## 🚀 **Quick Start**

### **Prerequisites**
- **Node.js** (v16.0.0 or higher)
- **npm** or **yarn** package manager
- Modern web browser

### **Installation**

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd cs-academy-graph-editor
   ```

2. **Install Dependencies**
   ```bash
   cd frontend
   yarn install
   # or
   npm install
   ```

3. **Start the Development Server**
   ```bash
   yarn start
   # or
   npm start
   ```

4. **Open in Browser**
   Navigate to `http://localhost:3000`

### **Production Build**
```bash
yarn build
# or
npm run build
```

## 📖 **How to Use**

### **1. Input Graph Data**
In the left panel, enter your graph data using edge list format:
```
1 2
1 3
2 4
3 4
4 5
2 5
```

### **2. Choose Graph Mode**
- Click **"Undirected"** for standard graphs
- Click **"Directed"** for directed graphs with arrows
- Toggle **"Tree mode"** for tree structures

### **3. Interact with the Graph**
- **Drag nodes** to reposition them
- **Click nodes** to select/deselect
- **Scroll** to zoom in/out
- **Drag background** to pan around

### **4. Generate Layouts**
- Click **"Generate Layout"** to automatically position nodes
- Use the layout algorithm for better visualization

### **5. Advanced Features**
- Toggle **"Show components"** to highlight connected components
- Switch between **Editor**, **Costs**, and **Custom Colors** tabs
- Use the help panel for additional guidance

## 🏗️ **Project Structure**

```
cs-academy-graph-editor/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js              # Main application component
│   │   ├── App.css             # Application styles
│   │   ├── index.js            # Entry point
│   │   ├── index.css           # Global styles
│   │   └── components.js       # All React components
│   ├── package.json            # Dependencies and scripts
│   ├── tailwind.config.js      # Tailwind configuration
│   └── postcss.config.js       # PostCSS configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🛠️ **Technologies Used**

### **Frontend Framework**
- **React 18.2.0** - Modern React with hooks
- **JavaScript ES6+** - Modern JavaScript features

### **Visualization**
- **D3.js 7.8.5** - Powerful data visualization library
- **SVG** - Scalable vector graphics for crisp rendering

### **Styling**
- **TailwindCSS 3.3.2** - Utility-first CSS framework
- **Inter Font** - Professional typography
- **Custom CSS** - Specialized graph styling

### **Code Editor**
- **ACE Editor** - Professional code editor
- **React-ACE** - React integration for ACE

### **Development Tools**
- **Create React App** - Development environment
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📝 **Input Format**

### **Basic Edge List**
```
1 2
1 3
2 4
3 4
```

### **Weighted Edges**
```
1 2 5.5
1 3 2.0
2 4 1.5
3 4 3.0
```

### **Complex Graphs**
```
1 2 10
1 3 15
2 4 20
2 5 25
3 6 30
4 7 35
5 7 40
6 7 45
```

## 🎨 **Customization**

### **Colors**
Modify the color scheme in `tailwind.config.js`:
```javascript
colors: {
  'cs-blue': '#4A90E2',
  'cs-light-blue': '#E8F4FD',
  'cs-gray': '#F8F9FA',
  // Add your custom colors
}
```

### **Graph Styling**
Update graph appearance in `index.css`:
```css
.graph-node {
  /* Node styling */
}

.graph-edge {
  /* Edge styling */
}
```

## 🔧 **Available Scripts**

In the `frontend` directory:

- **`yarn start`** - Start development server
- **`yarn build`** - Create production build
- **`yarn test`** - Run test suite
- **`yarn eject`** - Eject from Create React App

## 🌟 **Key Features Comparison**

| Feature | Original CS Academy | This Replica |
|---------|-------------------|--------------|
| Interactive Nodes | ✅ | ✅ |
| Drag & Drop | ✅ | ✅ |
| Directed/Undirected | ✅ | ✅ |
| ACE Editor | ✅ | ✅ |
| Auto Layout | ✅ | ✅ |
| Zoom & Pan | ✅ | ✅ |
| Professional UI | ✅ | ✅ |
| Real-time Updates | ✅ | ✅ |

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **Dependencies Not Installing**
   ```bash
   # Clear cache and reinstall
   yarn cache clean
   rm -rf node_modules
   yarn install
   ```

3. **Build Errors**
   ```bash
   # Check Node.js version
   node --version
   # Should be v16.0.0 or higher
   ```

### **Performance Tips**
- Use Chrome DevTools for debugging
- Limit graph size for better performance (< 1000 nodes)
- Close other browser tabs when working with large graphs

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **CS Academy** - Original graph editor inspiration
- **D3.js Community** - Powerful visualization library
- **React Team** - Excellent frontend framework
- **TailwindCSS** - Beautiful utility-first CSS

## 📞 **Support**

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Review the documentation

---

**Made with ❤️ for the competitive programming and graph theory community**

*Happy Graph Visualization! 🎯*
