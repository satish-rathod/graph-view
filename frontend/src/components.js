import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/theme-textmate';

// Header Component with improved styling
export const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 border-b border-indigo-300 z-50 h-16 shadow-lg">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-xl text-white tracking-tight">Graph View</span>
              <div className="text-xs text-indigo-100 opacity-90">Interactive Graph Editor</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium">
            Help
          </button>
          <button className="text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium">
            Clear
          </button>
          <button className="text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium">
            Edit
          </button>
          <button className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium border border-white/30">
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

// Input Panel Component with enhanced styling
export const InputPanel = ({ 
  inputText, 
  setInputText, 
  isDirected, 
  setIsDirected, 
  isTreeMode, 
  setIsTreeMode,
  activeTab,
  setActiveTab 
}) => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 shadow-sm">
      {/* Header Section */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9M21 9H9M21 13H9M21 17H9" />
            </svg>
          </div>
          <h3 className="font-bold text-slate-700 text-lg">Graph Input</h3>
        </div>
        <div className="text-sm text-slate-600 mb-4">
          <div className="bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-200">
            Define your graph structure below
          </div>
        </div>
      </div>
      
      {/* Editor Section */}
      <div className="flex-1 p-4">
        <div className="h-full relative rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900">
          {/* Editor Header */}
          <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-slate-400 text-sm font-medium ml-2">graph.txt</span>
            </div>
            <div className="text-xs text-slate-500">Edge List Format</div>
          </div>
          
          {/* Code Editor */}
          <AceEditor
            mode="text"
            theme="monokai"
            value={inputText}
            onChange={setInputText}
            name="graph-input"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="calc(100% - 40px)"
            fontSize={14}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
              wrap: false,
              fontFamily: 'JetBrains Mono, Monaco, Menlo, Ubuntu Mono, monospace'
            }}
          />
        </div>
      </div>
      
      {/* Footer Section */}
      <div className="p-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50">
        <div className="text-xs text-slate-600 bg-white/80 p-3 rounded-lg border border-slate-200">
          <div className="font-semibold text-slate-700 mb-1">📝 Format Guide:</div>
          <div className="space-y-1">
            <div><code className="bg-slate-100 px-1 rounded text-indigo-600">1 2</code> - Edge from node 1 to 2</div>
            <div><code className="bg-slate-100 px-1 rounded text-indigo-600">1 2 5.5</code> - Weighted edge</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Graph Editor Component with FIXED Drag Behavior - No More Coordinate Snapping!
export const GraphEditor = ({ graphData, isDirected, onNodeMove, showComponents }) => {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Store node positions locally to prevent React re-render interference
  const nodePositionsRef = useRef(new Map());
  const currentTransformRef = useRef(d3.zoomIdentity);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create main group
    const g = svg.append('g');

    // Store transform reference
    currentTransformRef.current = d3.zoomIdentity;

    // Zoom behavior with proper filtering
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .filter(function(event) {
        return !isDragging && !event.target.closest('.node-group');
      })
      .on('zoom', (event) => {
        currentTransformRef.current = event.transform;
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Initialize node positions in local cache
    const nodes = graphData.nodes.map(d => {
      const cachedPos = nodePositionsRef.current.get(d.id);
      const nodeData = {
        ...d,
        x: cachedPos?.x || d.x || width / 2 + (Math.random() - 0.5) * 100,
        y: cachedPos?.y || d.y || height / 2 + (Math.random() - 0.5) * 100
      };
      // Update cache
      nodePositionsRef.current.set(d.id, { x: nodeData.x, y: nodeData.y });
      return nodeData;
    });

    const links = graphData.edges;

    // Add arrowhead marker for directed graphs
    if (isDirected) {
      svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-5 -5 10 10')
        .attr('refX', 22)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .append('svg:path')
        .attr('d', 'M 0,0 L 10,5 L 7.5,0 L 10,-5 Z')
        .attr('fill', '#666');
    }

    // Create links
    const linkElements = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.8)
      .attr('marker-end', isDirected ? 'url(#arrowhead)' : null);

    // Create nodes
    const nodeGroups = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node-group')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    // Node circles
    nodeGroups.append('circle')
      .attr('r', 20)
      .attr('fill', d => selectedNode === d.id ? '#4A90E2' : '#fff')
      .attr('stroke', d => selectedNode === d.id ? '#357abd' : '#666')
      .attr('stroke-width', d => selectedNode === d.id ? 3 : 2)
      .attr('cursor', 'grab')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(selectedNode === d.id ? null : d.id);
      });

    // Node labels
    nodeGroups.append('text')
      .attr('class', 'graph-node-text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', d => selectedNode === d.id ? '#fff' : '#333')
      .attr('pointer-events', 'none')
      .text(d => d.id);

    // Function to update link positions
    const updateLinks = () => {
      linkElements
        .attr('x1', d => {
          const sourceNode = nodes.find(n => n.id === d.source);
          return sourceNode ? sourceNode.x : 0;
        })
        .attr('y1', d => {
          const sourceNode = nodes.find(n => n.id === d.source);
          return sourceNode ? sourceNode.y : 0;
        })
        .attr('x2', d => {
          const targetNode = nodes.find(n => n.id === d.target);
          return targetNode ? targetNode.x : 0;
        })
        .attr('y2', d => {
          const targetNode = nodes.find(n => n.id === d.target);
          return targetNode ? targetNode.y : 0;
        });
    };

    // FIXED DRAG BEHAVIOR - No coordinate transformation issues!
    const dragBehavior = d3.drag()
      .on('start', function(event, d) {
        setIsDragging(true);
        setSelectedNode(d.id);
        
        // Visual feedback
        d3.select(this).select('circle')
          .attr('cursor', 'grabbing')
          .attr('stroke-width', 4)
          .attr('stroke', '#4A90E2')
          .attr('r', 24)
          .style('filter', 'drop-shadow(3px 3px 8px rgba(0,0,0,0.4))');
      })
      .on('drag', function(event, d) {
        // Get mouse position in SVG coordinates (no transform)
        const [mouseX, mouseY] = d3.pointer(event, svg.node());
        
        // Convert to group coordinates accounting for current transform
        const transform = currentTransformRef.current;
        const newX = (mouseX - transform.x) / transform.k;
        const newY = (mouseY - transform.y) / transform.k;
        
        // Update node position immediately
        d.x = newX;
        d.y = newY;
        
        // Update visual position without re-render
        d3.select(this).attr('transform', `translate(${newX},${newY})`);
        
        // Update cache
        nodePositionsRef.current.set(d.id, { x: newX, y: newY });
        
        // Update connected edges in real-time
        updateLinks();
      })
      .on('end', function(event, d) {
        setIsDragging(false);
        
        // Final position update to React state (only once at the end)
        onNodeMove(d.id, d.x, d.y);
        
        // Reset visual feedback
        d3.select(this).select('circle')
          .attr('cursor', 'grab')
          .attr('stroke-width', selectedNode === d.id ? 3 : 2)
          .attr('r', 20)
          .style('filter', 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))');
      });

    nodeGroups.call(dragBehavior);

    // Initial link positioning
    updateLinks();

  }, [graphData.edges, graphData.nodes.length, isDirected]); // Removed problematic dependencies

  // Handle selection changes without full re-render
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('.node-group circle')
      .attr('fill', function() {
        const d = d3.select(this.parentNode).datum();
        return selectedNode === d.id ? '#4A90E2' : '#fff';
      })
      .attr('stroke', function() {
        const d = d3.select(this.parentNode).datum();
        return selectedNode === d.id ? '#357abd' : '#666';
      })
      .attr('stroke-width', function() {
        const d = d3.select(this.parentNode).datum();
        return selectedNode === d.id ? 3 : 2;
      });

    svg.selectAll('.node-group text')
      .attr('fill', function() {
        const d = d3.select(this.parentNode).datum();
        return selectedNode === d.id ? '#fff' : '#333';
      });
  }, [selectedNode]);

  return (
    <div className="w-full h-full relative">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="cursor-default"
        style={{ background: 'linear-gradient(45deg, #fafafa 0%, #f0f0f0 100%)' }}
      />
      
      <div className="absolute top-4 right-4 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
        {isDragging ? '🎯 Dragging node...' : '✨ Drag nodes freely'}
      </div>
    </div>
  );
};

// Control Panel Component
export const ControlPanel = ({ 
  generateLayout, 
  showComponents, 
  setShowComponents, 
  isTreeMode, 
  setIsTreeMode 
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-cs-border">
        <h3 className="font-semibold text-cs-text mb-4">Graph Options</h3>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isTreeMode}
              onChange={(e) => setIsTreeMode(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-cs-text">Tree mode</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showComponents}
              onChange={(e) => setShowComponents(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-cs-text">Show components</span>
          </label>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <div className="bg-cs-light-blue p-4 rounded-lg text-sm text-cs-text-light">
          <h4 className="font-semibold text-cs-text mb-2">Point-and-click</h4>
          <p className="mb-3">
            In this mode, there is a visualization tool that works in the center of
            the screen. You can click nodes and drag them as needed.
          </p>
          <p className="mb-3">
            As you edit the graph with these edges, the right panel will become
            the left panel and become.
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Nodes support drag and drop</li>
            <li>All the start of the drag, the node becomes selected</li>
            <li>You can double-click nodes by dragging click</li>
          </ul>
        </div>
      </div>
      
      <div className="p-4 border-t border-cs-border">
        <div className="flex flex-col space-y-2">
          <button
            onClick={generateLayout}
            className="w-full bg-cs-blue text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Generate Layout
          </button>
          <button
            onClick={generateLayout}
            className="w-full bg-cs-blue text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Generate Layout
          </button>
        </div>
      </div>
    </div>
  );
};
