import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/theme-textmate';

// Header Component
export const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-cs-border z-50 h-16">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-cs-blue rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <span className="font-semibold text-lg text-cs-text">CS Academy</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-cs-text-light hover:text-cs-text">Help</button>
          <button className="text-cs-text-light hover:text-cs-text">Clear</button>
          <button className="text-cs-text-light hover:text-cs-text">Edit</button>
          <button className="text-cs-text-light hover:text-cs-text">Config</button>
        </div>
      </div>
    </div>
  );
};

// Input Panel Component
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
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-cs-border">
        <h3 className="font-semibold text-cs-text mb-2">Node Color</h3>
        <div className="text-sm text-cs-text-light mb-4">
          <div>Graph Data:</div>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <div className="h-full">
          <AceEditor
            mode="text"
            theme="textmate"
            value={inputText}
            onChange={setInputText}
            name="graph-input"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="100%"
            fontSize={14}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={false}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
              wrap: false
            }}
            style={{
              fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace'
            }}
          />
        </div>
      </div>
      
      <div className="p-4 border-t border-cs-border">
        <div className="text-xs text-cs-text-light">
          Enter edges in format: u v [weight]
        </div>
      </div>
    </div>
  );
};

// Graph Editor Component with Fixed Drag Behavior
export const GraphEditor = ({ graphData, isDirected, onNodeMove, showComponents }) => {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create main group
    const g = svg.append('g');

    // Simple zoom behavior that doesn't interfere with dragging
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .filter(function(event) {
        // Only allow zoom on empty space, not on nodes
        return !event.target.closest('.node-group') && !isDragging;
      })
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Prepare nodes with current positions
    const nodes = graphData.nodes.map(d => ({
      ...d,
      x: d.x || width / 2 + (Math.random() - 0.5) * 100,
      y: d.y || height / 2 + (Math.random() - 0.5) * 100
    }));

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

    // Create links first (so they appear behind nodes)
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

    // Simple drag behavior without coordinate transformation issues
    const dragBehavior = d3.drag()
      .on('start', function(event, d) {
        setIsDragging(true);
        setSelectedNode(d.id);
        
        // Get the current transform to calculate correct starting position
        const currentTransform = d3.zoomTransform(g.node());
        
        // Store the offset between mouse and node center
        const [mouseX, mouseY] = d3.pointer(event, g.node());
        d.__offsetX = mouseX - d.x;
        d.__offsetY = mouseY - d.y;
        
        // Visual feedback
        d3.select(this).select('circle')
          .attr('cursor', 'grabbing')
          .attr('stroke-width', 4)
          .attr('stroke', '#4A90E2')
          .style('filter', 'drop-shadow(3px 3px 6px rgba(0,0,0,0.3))');
      })
      .on('drag', function(event, d) {
        // Get mouse position relative to the group (accounts for zoom/pan)
        const [mouseX, mouseY] = d3.pointer(event, g.node());
        
        // Calculate new position
        const newX = mouseX - d.__offsetX;
        const newY = mouseY - d.__offsetY;
        
        // Update node position
        d.x = newX;
        d.y = newY;
        
        // Move the visual element immediately
        d3.select(this).attr('transform', `translate(${newX},${newY})`);
        
        // Update connected edges
        updateLinks();
      })
      .on('end', function(event, d) {
        setIsDragging(false);
        
        // Clean up offset
        delete d.__offsetX;
        delete d.__offsetY;
        
        // Update parent component with final position
        onNodeMove(d.id, d.x, d.y);
        
        // Reset visual feedback
        d3.select(this).select('circle')
          .attr('cursor', 'grab')
          .attr('stroke-width', selectedNode === d.id ? 3 : 2)
          .style('filter', 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))');
      });

    nodeGroups.call(dragBehavior);

    // Initial link positioning
    updateLinks();

  }, [graphData, isDirected, selectedNode, onNodeMove, isDragging]);

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
        {isDragging ? 'Dragging...' : 'Click and drag nodes'}
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
