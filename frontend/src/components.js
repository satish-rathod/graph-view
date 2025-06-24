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

// Graph Editor Component
export const GraphEditor = ({ graphData, isDirected, onNodeMove, showComponents }) => {
  const svgRef = useRef();
  const simulationRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create main group
    const g = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Prepare data for D3 force simulation
    const nodes = graphData.nodes.map(d => ({
      ...d,
      x: d.x || width / 2 + (Math.random() - 0.5) * 100,
      y: d.y || height / 2 + (Math.random() - 0.5) * 100
    }));

    const links = graphData.edges.map(d => ({
      source: d.source,
      target: d.target,
      weight: d.weight || 1
    }));

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id(d => d.id)
        .distance(d => 80 + (d.weight || 1) * 20)
        .strength(0.3))
      .force('charge', d3.forceManyBody()
        .strength(-400)
        .distanceMax(300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30))
      .alphaTarget(0.1)
      .alphaDecay(0.05);

    simulationRef.current = simulation;

    // Add arrowhead marker for directed graphs
    if (isDirected) {
      svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 28)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 8)
        .attr('markerHeight', 8)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#666')
        .style('stroke', 'none');
    }

    // Create links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'edge graph-edge')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.8)
      .attr('stroke-width', d => Math.sqrt(d.weight || 1) * 2)
      .attr('marker-end', isDirected ? 'url(#arrowhead)' : null);

    // Create nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node-group graph-node');

    // Node circles with better styling
    node.append('circle')
      .attr('r', 22)
      .attr('fill', d => selectedNode === d.id ? '#4A90E2' : '#fff')
      .attr('stroke', d => selectedNode === d.id ? '#357abd' : '#666')
      .attr('stroke-width', d => selectedNode === d.id ? 3 : 2)
      .attr('filter', 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(selectedNode === d.id ? null : d.id);
      })
      .on('mouseenter', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 25)
          .attr('stroke-width', 3);
      })
      .on('mouseleave', function(event, d) {
        if (selectedNode !== d.id) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', 22)
            .attr('stroke-width', 2);
        }
      });

    // Node labels with better positioning
    node.append('text')
      .attr('class', 'graph-node-text')
      .text(d => d.id)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', d => selectedNode === d.id ? '#fff' : '#333')
      .attr('pointer-events', 'none');

    // Enhanced drag behavior with proper coordinate handling
    const dragBehavior = d3.drag()
      .on('start', function(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        
        // Store the initial position relative to the node
        const [mouseX, mouseY] = d3.pointer(event, svg.node());
        const transform = d3.zoomTransform(svg.node());
        const [worldX, worldY] = transform.invert([mouseX, mouseY]);
        
        d.fx = d.x;
        d.fy = d.y;
        
        // Store offset for smooth dragging
        d.__dragOffsetX = worldX - d.x;
        d.__dragOffsetY = worldY - d.y;
        
        setSelectedNode(d.id);
        setIsSimulationRunning(true);
        
        // Visual feedback
        d3.select(this).select('circle')
          .attr('stroke-width', 4)
          .attr('stroke', '#4A90E2')
          .attr('r', 25);
      })
      .on('drag', function(event, d) {
        // Get mouse position relative to SVG
        const [mouseX, mouseY] = d3.pointer(event, svg.node());
        const transform = d3.zoomTransform(svg.node());
        const [worldX, worldY] = transform.invert([mouseX, mouseY]);
        
        // Apply the drag offset to maintain smooth movement
        d.fx = worldX - d.__dragOffsetX;
        d.fy = worldY - d.__dragOffsetY;
        
        // Restart simulation with low alpha to update immediately
        simulation.alpha(0.1).restart();
      })
      .on('end', function(event, d) {
        if (!event.active) simulation.alphaTarget(0.1);
        
        // Clean up
        delete d.__dragOffsetX;
        delete d.__dragOffsetY;
        
        // Release fixed position but keep current position
        const finalX = d.x;
        const finalY = d.y;
        d.fx = null;
        d.fy = null;
        
        setIsSimulationRunning(false);
        
        // Update parent component with new position
        onNodeMove(d.id, finalX, finalY);
        
        // Reset visual feedback
        if (selectedNode !== d.id) {
          d3.select(this).select('circle')
            .attr('stroke-width', 2)
            .attr('stroke', '#666')
            .attr('r', 22);
        }
      });

    node.call(dragBehavior);

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Stop simulation after some time to prevent excessive CPU usage
    setTimeout(() => {
      simulation.alphaTarget(0);
    }, 5000);

    // Cleanup
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };

  }, [graphData, isDirected, selectedNode, onNodeMove]);

  // Method to restart physics simulation
  const restartSimulation = () => {
    if (simulationRef.current) {
      simulationRef.current.alphaTarget(0.3).restart();
      setIsSimulationRunning(true);
      setTimeout(() => {
        simulationRef.current.alphaTarget(0.1);
        setIsSimulationRunning(false);
      }, 3000);
    }
  };

  return (
    <div className="w-full h-full relative">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="cursor-grab"
        style={{ background: 'radial-gradient(circle at 50% 50%, #fefefe 0%, #f8f9fa 100%)' }}
      />
      
      {/* Physics control button */}
      <button
        onClick={restartSimulation}
        className={`absolute top-4 right-4 px-3 py-2 text-sm rounded-lg shadow-md transition-all ${
          isSimulationRunning 
            ? 'bg-orange-500 text-white animate-pulse' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        title="Restart Physics Simulation"
      >
        {isSimulationRunning ? '⚡ Running' : '🔄 Physics'}
      </button>
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
