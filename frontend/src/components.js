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
  const [selectedNode, setSelectedNode] = useState(null);

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

    // Draw edges
    const edges = g.selectAll('.edge')
      .data(graphData.edges)
      .enter()
      .append('line')
      .attr('class', 'edge graph-edge')
      .attr('x1', d => {
        const sourceNode = graphData.nodes.find(n => n.id === d.source);
        return sourceNode ? sourceNode.x : 0;
      })
      .attr('y1', d => {
        const sourceNode = graphData.nodes.find(n => n.id === d.source);
        return sourceNode ? sourceNode.y : 0;
      })
      .attr('x2', d => {
        const targetNode = graphData.nodes.find(n => n.id === d.target);
        return targetNode ? targetNode.x : 0;
      })
      .attr('y2', d => {
        const targetNode = graphData.nodes.find(n => n.id === d.target);
        return targetNode ? targetNode.y : 0;
      })
      .attr('stroke', '#333')
      .attr('stroke-width', 2);

    // Add arrowheads for directed graphs
    if (isDirected) {
      svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 25)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 8)
        .attr('markerHeight', 8)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#333')
        .style('stroke', 'none');

      edges.attr('marker-end', 'url(#arrowhead)');
    }

    // Draw nodes
    const nodeGroups = g.selectAll('.node-group')
      .data(graphData.nodes)
      .enter()
      .append('g')
      .attr('class', 'node-group graph-node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // Node circles
    nodeGroups.append('circle')
      .attr('r', 20)
      .attr('fill', d => selectedNode === d.id ? '#4A90E2' : '#fff')
      .attr('stroke', '#333')
      .attr('stroke-width', 2)
      .on('click', (event, d) => {
        setSelectedNode(selectedNode === d.id ? null : d.id);
      });

    // Node labels
    nodeGroups.append('text')
      .attr('class', 'graph-node-text')
      .text(d => d.id)
      .attr('fill', d => selectedNode === d.id ? '#fff' : '#333');

    // Add drag behavior
    const drag = d3.drag()
      .on('start', function(event, d) {
        d3.select(this).raise();
        setSelectedNode(d.id);
      })
      .on('drag', function(event, d) {
        const newX = event.x;
        const newY = event.y;
        
        d3.select(this).attr('transform', `translate(${newX}, ${newY})`);
        
        // Update edges
        g.selectAll('.edge')
          .attr('x1', edge => {
            const sourceNode = graphData.nodes.find(n => n.id === edge.source);
            return sourceNode && sourceNode.id === d.id ? newX : sourceNode ? sourceNode.x : 0;
          })
          .attr('y1', edge => {
            const sourceNode = graphData.nodes.find(n => n.id === edge.source);
            return sourceNode && sourceNode.id === d.id ? newY : sourceNode ? sourceNode.y : 0;
          })
          .attr('x2', edge => {
            const targetNode = graphData.nodes.find(n => n.id === edge.target);
            return targetNode && targetNode.id === d.id ? newX : targetNode ? targetNode.x : 0;
          })
          .attr('y2', edge => {
            const targetNode = graphData.nodes.find(n => n.id === edge.target);
            return targetNode && targetNode.id === d.id ? newY : targetNode ? targetNode.y : 0;
          });
      })
      .on('end', function(event, d) {
        onNodeMove(d.id, event.x, event.y);
      });

    nodeGroups.call(drag);

  }, [graphData, isDirected, selectedNode, onNodeMove]);

  return (
    <div className="w-full h-full">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="cursor-move"
      />
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
