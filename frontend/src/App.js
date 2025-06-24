import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { GraphEditor, InputPanel, ControlPanel, Header } from './components';

function App() {
  const [graphData, setGraphData] = useState({
    nodes: [
      { id: 1, x: 300, y: 200 },
      { id: 2, x: 200, y: 300 },
      { id: 3, x: 400, y: 300 },
      { id: 4, x: 350, y: 400 },
      { id: 5, x: 250, y: 400 }
    ],
    edges: [
      { source: 1, target: 2 },
      { source: 1, target: 3 },
      { source: 2, target: 4 },
      { source: 3, target: 4 },
      { source: 4, target: 5 },
      { source: 2, target: 5 }
    ]
  });

  const [inputText, setInputText] = useState(`1 2
1 3
2 4
3 4
4 5
2 5`);

  const [isDirected, setIsDirected] = useState(false);
  const [isTreeMode, setIsTreeMode] = useState(false);
  const [showComponents, setShowComponents] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');

  // Parse input text to create graph data
  const parseGraphInput = (text) => {
    const lines = text.trim().split('\n').filter(line => line.trim());
    const edges = [];
    const nodeSet = new Set();

    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 2) {
        const source = parseInt(parts[0]);
        const target = parseInt(parts[1]);
        const weight = parts.length > 2 ? parseFloat(parts[2]) : null;
        
        if (!isNaN(source) && !isNaN(target)) {
          edges.push({ source, target, weight });
          nodeSet.add(source);
          nodeSet.add(target);
        }
      }
    });

    // Create nodes with initial positions
    const nodes = Array.from(nodeSet).map((id, index) => ({
      id,
      x: 300 + (Math.random() - 0.5) * 200,
      y: 300 + (Math.random() - 0.5) * 200
    }));

    return { nodes, edges };
  };

  // Update graph when input changes
  useEffect(() => {
    const newGraphData = parseGraphInput(inputText);
    setGraphData(newGraphData);
  }, [inputText]);

  const generateLayout = () => {
    // Enhanced force-directed layout with better physics
    const { nodes, edges } = graphData;
    
    // Create a more sophisticated layout algorithm
    const width = 800;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Apply different layout strategies based on graph structure
    const nodeCount = nodes.length;
    const edgeCount = edges.length;
    
    let newNodes;
    
    if (nodeCount <= 3) {
      // Simple linear arrangement for small graphs
      newNodes = nodes.map((node, index) => ({
        ...node,
        x: centerX + (index - (nodeCount - 1) / 2) * 100,
        y: centerY
      }));
    } else if (edgeCount === 0) {
      // Grid layout for disconnected nodes
      const cols = Math.ceil(Math.sqrt(nodeCount));
      newNodes = nodes.map((node, index) => ({
        ...node,
        x: centerX + ((index % cols) - (cols - 1) / 2) * 80,
        y: centerY + (Math.floor(index / cols) - Math.floor((nodeCount - 1) / cols) / 2) * 80
      }));
    } else if (isTreeMode || isTree(nodes, edges)) {
      // Tree layout
      newNodes = generateTreeLayout(nodes, edges, centerX, centerY);
    } else {
      // Force-directed layout with physics simulation
      newNodes = generateForceLayout(nodes, edges, centerX, centerY);
    }
    
    setGraphData({ ...graphData, nodes: newNodes });
  };
  
  // Helper function to check if graph is a tree
  const isTree = (nodes, edges) => {
    return edges.length === nodes.length - 1;
  };
  
  // Tree layout algorithm
  const generateTreeLayout = (nodes, edges, centerX, centerY) => {
    const nodeMap = new Map();
    nodes.forEach(node => nodeMap.set(node.id, { ...node, children: [] }));
    
    // Build adjacency list
    const adjList = new Map();
    nodes.forEach(node => adjList.set(node.id, []));
    edges.forEach(edge => {
      adjList.get(edge.source).push(edge.target);
      adjList.get(edge.target).push(edge.source);
    });
    
    // Find root (node with highest degree or node 1)
    let root = nodes[0].id;
    let maxDegree = 0;
    for (const [nodeId, neighbors] of adjList) {
      if (neighbors.length > maxDegree) {
        maxDegree = neighbors.length;
        root = nodeId;
      }
    }
    
    // BFS to build tree structure
    const visited = new Set();
    const queue = [{ id: root, level: 0, parent: null }];
    const levels = new Map();
    
    while (queue.length > 0) {
      const { id, level, parent } = queue.shift();
      if (visited.has(id)) continue;
      
      visited.add(id);
      if (!levels.has(level)) levels.set(level, []);
      levels.get(level).push(id);
      
      for (const neighbor of adjList.get(id)) {
        if (!visited.has(neighbor) && neighbor !== parent) {
          queue.push({ id: neighbor, level: level + 1, parent: id });
        }
      }
    }
    
    // Position nodes by level
    const newNodes = nodes.map(node => {
      const nodeLevel = [...levels.entries()].find(([level, nodeIds]) => 
        nodeIds.includes(node.id))?.[0] || 0;
      const levelNodes = levels.get(nodeLevel) || [];
      const indexInLevel = levelNodes.indexOf(node.id);
      
      return {
        ...node,
        x: centerX + (indexInLevel - (levelNodes.length - 1) / 2) * 120,
        y: centerY + (nodeLevel - (levels.size - 1) / 2) * 100
      };
    });
    
    return newNodes;
  };
  
  // Enhanced force-directed layout
  const generateForceLayout = (nodes, edges, centerX, centerY) => {
    // Use a simple spring-mass system
    const k = 200; // Spring constant
    const iterations = 50;
    
    let newNodes = nodes.map(node => ({
      ...node,
      x: centerX + (Math.random() - 0.5) * 200,
      y: centerY + (Math.random() - 0.5) * 200,
      vx: 0,
      vy: 0
    }));
    
    for (let iter = 0; iter < iterations; iter++) {
      // Reset forces
      newNodes.forEach(node => {
        node.fx = 0;
        node.fy = 0;
      });
      
      // Repulsive forces between all nodes
      for (let i = 0; i < newNodes.length; i++) {
        for (let j = i + 1; j < newNodes.length; j++) {
          const dx = newNodes[i].x - newNodes[j].x;
          const dy = newNodes[i].y - newNodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy) + 0.01;
          const force = k * k / distance;
          
          newNodes[i].fx += force * dx / distance;
          newNodes[i].fy += force * dy / distance;
          newNodes[j].fx -= force * dx / distance;
          newNodes[j].fy -= force * dy / distance;
        }
      }
      
      // Attractive forces for connected nodes
      edges.forEach(edge => {
        const source = newNodes.find(n => n.id === edge.source);
        const target = newNodes.find(n => n.id === edge.target);
        
        if (source && target) {
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const distance = Math.sqrt(dx * dx + dy * dy) + 0.01;
          const force = distance * distance / k;
          
          source.fx += force * dx / distance;
          source.fy += force * dy / distance;
          target.fx -= force * dx / distance;
          target.fy -= force * dy / distance;
        }
      });
      
      // Apply forces
      newNodes.forEach(node => {
        node.vx = (node.vx + node.fx) * 0.9;
        node.vy = (node.vy + node.fy) * 0.9;
        node.x += node.vx;
        node.y += node.vy;
      });
    }
    
    return newNodes.map(node => ({ id: node.id, x: node.x, y: node.y }));
  };

  const updateNodePosition = (nodeId, x, y) => {
    setGraphData(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, x, y } : node
      )
    }));
  };

  return (
    <div className="min-h-screen bg-cs-gray">
      <Header />
      
      <div className="flex h-screen pt-16">
        {/* Left Panel - Input */}
        <div className="w-80 bg-white border-r border-cs-border flex flex-col">
          <InputPanel 
            inputText={inputText}
            setInputText={setInputText}
            isDirected={isDirected}
            setIsDirected={setIsDirected}
            isTreeMode={isTreeMode}
            setIsTreeMode={setIsTreeMode}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Center Panel - Graph Visualization */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b border-cs-border p-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setIsDirected(false)}
                className={`px-4 py-2 rounded ${!isDirected ? 'bg-cs-blue text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Undirected
              </button>
              <button
                onClick={() => setIsDirected(true)}
                className={`px-4 py-2 rounded ${isDirected ? 'bg-cs-blue text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Directed
              </button>
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-4 py-2 rounded ${activeTab === 'editor' ? 'bg-cs-blue text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Editor
              </button>
              <button
                onClick={() => setActiveTab('costs')}
                className={`px-4 py-2 rounded ${activeTab === 'costs' ? 'bg-cs-blue text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Costs
              </button>
              <button
                onClick={() => setActiveTab('colors')}
                className={`px-4 py-2 rounded ${activeTab === 'colors' ? 'bg-cs-blue text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Custom Colors
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-4">
            <div className="h-full bg-white border border-cs-border rounded-lg">
              <GraphEditor
                graphData={graphData}
                isDirected={isDirected}
                onNodeMove={updateNodePosition}
                showComponents={showComponents}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Controls */}
        <div className="w-80 bg-white border-l border-cs-border">
          <ControlPanel
            generateLayout={generateLayout}
            showComponents={showComponents}
            setShowComponents={setShowComponents}
            isTreeMode={isTreeMode}
            setIsTreeMode={setIsTreeMode}
          />
        </div>
      </div>
    </div>
  );
}

export default App;