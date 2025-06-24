import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { GraphEditor, InputPanel, ControlPanel, Header } from './components';
import { GraphAlgorithms } from './algorithms';
import { AnimationController, VisualStateManager } from './AnimationController';

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

  // Algorithm state management
  const [algorithmState, setAlgorithmState] = useState({
    selectedAlgorithm: null,
    startNode: null,
    endNode: null,
    targetNode: null,
    isRunning: false,
    currentStep: null,
    stepIndex: -1,
    totalSteps: 0,
    result: null,
    message: '',
    selectionMode: null // 'startNode', 'endNode', 'targetNode'
  });

  // Animation controllers
  const animationController = useRef(null);
  const visualStateManager = useRef(new VisualStateManager());

  // Initialize animation controller
  useEffect(() => {
    animationController.current = new AnimationController(
      (step, stepIndex, totalSteps) => {
        setAlgorithmState(prev => ({
          ...prev,
          currentStep: step,
          stepIndex,
          totalSteps,
          message: step?.message || ''
        }));
        
        // Update visual state
        visualStateManager.current.updateFromStep(step, algorithmState.selectedAlgorithm);
      },
      () => {
        setAlgorithmState(prev => ({
          ...prev,
          isRunning: false,
          message: 'Algorithm completed!'
        }));
      }
    );
  }, [algorithmState.selectedAlgorithm]);

  // Parse input text to create graph data
  const parseGraphInput = (text) => {
    const lines = text.trim().split('\n').filter(line => line.trim());
    const edges = [];
    const nodeSet = new Set();

    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      
      if (parts.length === 1) {
        // Single node entry (like "100")
        const nodeId = parseInt(parts[0]);
        if (!isNaN(nodeId)) {
          nodeSet.add(nodeId);
        }
      } else if (parts.length >= 2) {
        // Edge entry (like "1 2" or "1 2 5.5")
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
    // Reset algorithm state when graph changes
    resetAlgorithmState();
  }, [inputText]);

  // Node selection for algorithms
  const handleNodeSelect = (nodeId) => {
    console.log('handleNodeSelect called with nodeId:', nodeId, 'selectionMode:', algorithmState.selectionMode);
    
    if (algorithmState.selectionMode) {
      console.log('Setting', algorithmState.selectionMode, 'to', nodeId);
      setAlgorithmState(prev => {
        const newState = {
          ...prev,
          [prev.selectionMode]: prev[prev.selectionMode] === nodeId ? null : nodeId,
          selectionMode: null
        };
        console.log('New algorithm state:', newState);
        return newState;
      });
    } else {
      console.log('No selection mode active, ignoring node selection');
    }
  };

  // Start node selection mode
  const startNodeSelection = (mode) => {
    console.log('Starting node selection mode:', mode);
    setAlgorithmState(prev => {
      const newState = {
        ...prev,
        selectionMode: mode
      };
      console.log('Updated algorithm state with selection mode:', newState);
      return newState;
    });
  };

  // Algorithm selection and execution functions
  const selectAlgorithm = (algorithm) => {
    setAlgorithmState(prev => ({
      ...prev,
      selectedAlgorithm: algorithm,
      message: `${algorithm.toUpperCase()} algorithm selected. Please select required nodes.`
    }));
  };

  const executeAlgorithm = (algorithm) => {
    const { nodes, edges } = graphData;
    
    console.log('Executing algorithm:', algorithm);
    console.log('Algorithm state:', algorithmState);
    console.log('Graph data:', { nodes: nodes.length, edges: edges.length });
    
    // Reset visual state
    visualStateManager.current.reset();
    
    let result;
    
    switch (algorithm) {
      case 'dijkstra':
        if (!algorithmState.startNode || !algorithmState.endNode) {
          alert('Please select both start and end nodes for shortest path');
          return;
        }
        console.log('Running Dijkstra from', algorithmState.startNode, 'to', algorithmState.endNode);
        result = GraphAlgorithms.dijkstra(nodes, edges, algorithmState.startNode, algorithmState.endNode);
        break;
        
      case 'dfs':
        if (!algorithmState.startNode) {
          alert('Please select a start node for DFS');
          return;
        }
        console.log('Running DFS from', algorithmState.startNode, 'target:', algorithmState.targetNode);
        result = GraphAlgorithms.dfs(nodes, edges, algorithmState.startNode, algorithmState.targetNode);
        break;
        
      case 'bfs':
        if (!algorithmState.startNode) {
          alert('Please select a start node for BFS');
          return;
        }
        console.log('Running BFS from', algorithmState.startNode, 'target:', algorithmState.targetNode);
        result = GraphAlgorithms.bfs(nodes, edges, algorithmState.startNode, algorithmState.targetNode);
        break;
        
      case 'topological':
        if (!isDirected) {
          alert('Topological sort requires a directed graph');
          return;
        }
        console.log('Running Topological Sort');
        result = GraphAlgorithms.topologicalSort(nodes, edges);
        if (result.hasCycle) {
          alert('Graph contains cycles - topological sort not possible');
          return;
        }
        break;
        
      default:
        console.error('Unknown algorithm:', algorithm);
        return;
    }
    
    console.log('Algorithm result:', result);
    
    if (!result || !result.steps) {
      console.error('Algorithm execution failed or returned invalid result');
      alert('Algorithm execution failed. Please check the console for details.');
      return;
    }
    
    setAlgorithmState(prev => ({
      ...prev,
      isRunning: false,
      result: result,
      stepIndex: -1,
      totalSteps: result.steps.length,
      currentStep: null,
      message: 'Algorithm loaded. Click play to start animation.'
    }));
    
    // Load steps into animation controller
    if (animationController.current) {
      animationController.current.loadSteps(result.steps);
      console.log('Steps loaded into animation controller:', result.steps.length);
    } else {
      console.error('Animation controller not available');
    }
  };

  const resetAlgorithmState = () => {
    setAlgorithmState({
      selectedAlgorithm: null,
      startNode: null,
      endNode: null,
      targetNode: null,
      isRunning: false,
      currentStep: null,
      stepIndex: -1,
      totalSteps: 0,
      result: null,
      message: '',
      selectionMode: null
    });
    
    if (animationController.current) {
      animationController.current.stop();
    }
    
    visualStateManager.current.reset();
  };

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

  // Clear input functionality
  const clearInput = () => {
    setInputText('');
  };

  // Expose clear function globally for header button
  useEffect(() => {
    window.clearGraphInput = clearInput;
    return () => {
      delete window.clearGraphInput;
    };
  }, []);

  const updateNodePosition = (nodeId, x, y) => {
    setGraphData(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, x, y } : node
      )
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-50">
      <Header />
      
      <div className="flex h-screen pt-16">
        {/* Left Panel - Input */}
        <div className="w-80 shadow-xl">
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
        <div className="flex-1 flex flex-col bg-white shadow-lg">
          {/* Enhanced Tab Navigation */}
          <div className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-200 p-4 shadow-sm">
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setIsDirected(false)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center space-x-2 ${
                  !isDirected 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform -translate-y-0.5' 
                    : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-800 border border-slate-200 hover:border-blue-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <span>Undirected</span>
              </button>
              <button
                onClick={() => setIsDirected(true)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center space-x-2 ${
                  isDirected 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg transform -translate-y-0.5' 
                    : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-800 border border-slate-200 hover:border-purple-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span>Directed</span>
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'editor' 
                    ? 'bg-indigo-500 text-white shadow-md' 
                    : 'bg-white/60 text-slate-600 hover:bg-white hover:text-slate-800 border border-slate-200'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setActiveTab('costs')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'costs' 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'bg-white/60 text-slate-600 hover:bg-white hover:text-slate-800 border border-slate-200'
                }`}
              >
                Costs
              </button>
              <button
                onClick={() => setActiveTab('colors')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'colors' 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'bg-white/60 text-slate-600 hover:bg-white hover:text-slate-800 border border-slate-200'
                }`}
              >
                Custom Colors
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <div className="h-full bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
              <GraphEditor
                graphData={graphData}
                isDirected={isDirected}
                onNodeMove={updateNodePosition}
                showComponents={showComponents}
                isTreeMode={isTreeMode}
                algorithmState={algorithmState}
                visualStates={visualStateManager.current.getCurrentStates()}
                onNodeSelect={handleNodeSelect}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Controls */}
        <div className="w-80 shadow-xl">
          <ControlPanel
            generateLayout={generateLayout}
            showComponents={showComponents}
            setShowComponents={setShowComponents}
            isTreeMode={isTreeMode}
            setIsTreeMode={setIsTreeMode}
            algorithmState={algorithmState}
            onSelectAlgorithm={selectAlgorithm}
            onExecuteAlgorithm={executeAlgorithm}
            onResetAlgorithm={resetAlgorithmState}
            onStartNodeSelection={startNodeSelection}
            animationController={animationController.current}
            graphData={graphData}
            isDirected={isDirected}
          />
        </div>
      </div>
    </div>
  );
}

export default App;