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
    // Simple force-directed layout
    const { nodes, edges } = graphData;
    const newNodes = nodes.map(node => ({
      ...node,
      x: 300 + (Math.random() - 0.5) * 300,
      y: 300 + (Math.random() - 0.5) * 300
    }));
    setGraphData({ ...graphData, nodes: newNodes });
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