import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/theme-github';

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
            theme="github"
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

// Graph Editor Component with FIXED Drag Behavior + Tree Mode + Components + Curved Edges
export const GraphEditor = ({ graphData, isDirected, onNodeMove, showComponents, isTreeMode }) => {
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

    // Process edges for curved bidirectional connections
    const processedLinks = [];
    const bidirectionalPairs = new Set();
    
    graphData.edges.forEach(edge => {
      const reverseEdge = graphData.edges.find(e => 
        e.source === edge.target && e.target === edge.source
      );
      
      if (reverseEdge && !bidirectionalPairs.has(`${edge.target}-${edge.source}`)) {
        // This is a bidirectional connection
        bidirectionalPairs.add(`${edge.source}-${edge.target}`);
        
        // Add original edge (straight)
        processedLinks.push({
          ...edge,
          weight: edge.weight || null,
          curved: false
        });
        
        // Add reverse edge (curved)
        processedLinks.push({
          ...reverseEdge,
          weight: reverseEdge.weight || null,
          curved: true
        });
      } else if (!bidirectionalPairs.has(`${edge.source}-${edge.target}`) && 
                 !bidirectionalPairs.has(`${edge.target}-${edge.source}`)) {
        // Single direction edge
        processedLinks.push({
          ...edge,
          weight: edge.weight || null,
          curved: false
        });
      }
    });

    // Detect connected components for coloring
    const components = [];
    const visited = new Set();
    
    if (showComponents) {
      nodes.forEach(node => {
        if (!visited.has(node.id)) {
          const component = [];
          const stack = [node.id];
          
          while (stack.length > 0) {
            const nodeId = stack.pop();
            if (!visited.has(nodeId)) {
              visited.add(nodeId);
              component.push(nodeId);
              
              // Find connected nodes
              processedLinks.forEach(edge => {
                if (edge.source === nodeId && !visited.has(edge.target)) {
                  stack.push(edge.target);
                }
                if (!isDirected && edge.target === nodeId && !visited.has(edge.source)) {
                  stack.push(edge.source);
                }
              });
            }
          }
          
          components.push(component);
        }
      });
    }

    // Component colors
    const componentColors = [
      '#e74c3c', '#3498db', '#2ecc71', '#f39c12', 
      '#9b59b6', '#1abc9c', '#e67e22', '#34495e'
    ];

    // Add arrowhead marker for directed graphs with better styling
    if (isDirected) {
      console.log('Creating arrowhead markers for directed graph');
      const defs = svg.append('defs');
      
      defs.append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 15) // Position closer to node
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#666')
        .attr('stroke', 'none');
    } else {
      console.log('Undirected graph - no arrows');
    }

    // Create links (both straight and curved) with tree mode styling
    const linkElements = g.append('g')
      .attr('class', 'links')
      .selectAll('path')
      .data(processedLinks)
      .enter()
      .append('path')
      .attr('stroke', isTreeMode ? '#27ae60' : '#999')
      .attr('stroke-width', d => d.weight ? Math.max(1, Math.min(5, d.weight)) : (isTreeMode ? 3 : 2))
      .attr('stroke-opacity', 0.8)
      .attr('fill', 'none')
      .attr('marker-end', isDirected ? 'url(#arrowhead)' : null);

    // Create edge weight labels for weighted edges
    const edgeLabels = g.append('g')
      .attr('class', 'edge-labels')
      .selectAll('text')
      .data(processedLinks.filter(d => d.weight !== null && d.weight !== undefined))
      .enter()
      .append('text')
      .attr('class', 'edge-weight')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', '#4A5568')
      .attr('stroke', 'white')
      .attr('stroke-width', '3')
      .attr('paint-order', 'stroke')
      .text(d => {
        console.log('Edge weight:', d.weight);
        return d.weight;
      });

    // Create nodes
    const nodeGroups = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node-group')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    // Node circles with component coloring and tree mode styling
    nodeGroups.append('circle')
      .attr('r', 20)
      .attr('fill', d => {
        if (selectedNode === d.id) return '#4A90E2';
        if (isTreeMode) return '#27ae60'; // Green for tree mode
        if (showComponents) {
          const componentIndex = components.findIndex(comp => comp.includes(d.id));
          return componentIndex >= 0 ? componentColors[componentIndex % componentColors.length] : '#fff';
        }
        return '#fff';
      })
      .attr('stroke', d => {
        if (selectedNode === d.id) return '#357abd';
        if (isTreeMode) return '#1e8449'; // Darker green for tree mode
        if (showComponents) return '#fff';
        return '#666';
      })
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
      .attr('fill', d => {
        if (selectedNode === d.id) return '#fff';
        if (showComponents) return '#fff';
        return '#333';
      })
      .attr('pointer-events', 'none')
      .text(d => d.id);

    // Function to update link and label positions
    const updateLinks = () => {
      linkElements
        .attr('d', d => {
          const sourceNode = nodes.find(n => n.id === d.source);
          const targetNode = nodes.find(n => n.id === d.target);
          
          if (!sourceNode || !targetNode) return '';
          
          if (d.curved) {
            // Create curved path for bidirectional edges
            const dx = targetNode.x - sourceNode.x;
            const dy = targetNode.y - sourceNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Calculate curve control point
            const curvature = 0.3;
            const midX = (sourceNode.x + targetNode.x) / 2;
            const midY = (sourceNode.y + targetNode.y) / 2;
            
            // Perpendicular offset for curve
            const offsetX = -dy / distance * (distance * curvature);
            const offsetY = dx / distance * (distance * curvature);
            
            const controlX = midX + offsetX;
            const controlY = midY + offsetY;
            
            return `M ${sourceNode.x} ${sourceNode.y} Q ${controlX} ${controlY} ${targetNode.x} ${targetNode.y}`;
          } else {
            // Straight line
            return `M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`;
          }
        });
      
      // Update edge weight labels positions
      edgeLabels
        .attr('x', d => {
          const sourceNode = nodes.find(n => n.id === d.source);
          const targetNode = nodes.find(n => n.id === d.target);
          if (sourceNode && targetNode) {
            if (d.curved) {
              const dx = targetNode.x - sourceNode.x;
              const dy = targetNode.y - sourceNode.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const midX = (sourceNode.x + targetNode.x) / 2;
              const offsetX = -dy / distance * (distance * 0.2);
              return midX + offsetX;
            }
            return (sourceNode.x + targetNode.x) / 2;
          }
          return 0;
        })
        .attr('y', d => {
          const sourceNode = nodes.find(n => n.id === d.source);
          const targetNode = nodes.find(n => n.id === d.target);
          if (sourceNode && targetNode) {
            if (d.curved) {
              const dx = targetNode.x - sourceNode.x;
              const dy = targetNode.y - sourceNode.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const midY = (sourceNode.y + targetNode.y) / 2;
              const offsetY = dx / distance * (distance * 0.2);
              return midY + offsetY - 5;
            }
            return (sourceNode.y + targetNode.y) / 2 - 5;
          }
          return 0;
        });

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

  }, [graphData.edges, graphData.nodes.length, isDirected, showComponents, isTreeMode]);

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

// Control Panel Component with enhanced styling
export const ControlPanel = ({ 
  generateLayout, 
  showComponents, 
  setShowComponents, 
  isTreeMode, 
  setIsTreeMode 
}) => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white border-l border-slate-200 shadow-sm">
      {/* Header Section */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <h3 className="font-bold text-slate-700 text-lg">Graph Options</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-slate-700 mb-3 text-sm">Display Settings</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 group cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isTreeMode}
                    onChange={(e) => setIsTreeMode(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 ${
                    isTreeMode 
                      ? 'bg-indigo-500 border-indigo-500' 
                      : 'border-slate-300 group-hover:border-indigo-400'
                  }`}>
                    {isTreeMode && (
                      <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-700 font-medium">Tree mode</span>
              </label>
              
              <label className="flex items-center space-x-3 group cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showComponents}
                    onChange={(e) => setShowComponents(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 ${
                    showComponents 
                      ? 'bg-purple-500 border-purple-500' 
                      : 'border-slate-300 group-hover:border-purple-400'
                  }`}>
                    {showComponents && (
                      <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-700 font-medium">Show components</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Info Panel */}
      <div className="flex-1 p-6">
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-200 shadow-sm h-full overflow-auto">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-slate-700">Interactive Guide</h4>
          </div>
          
          <div className="space-y-4 text-sm text-slate-600">
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
              <p className="font-medium text-slate-700 mb-2">🎯 Point-and-click</p>
              <p className="leading-relaxed">
                Use the interactive visualization tool in the center of the screen. 
                Click and drag nodes to reposition them as needed.
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
              <p className="font-medium text-slate-700 mb-2">✨ Interactive Features</p>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Nodes support smooth drag and drop</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>Click nodes to select and highlight them</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Zoom and pan for better navigation</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Real-time edge updates during movement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="p-6 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-purple-50">
        <div className="space-y-3">
          <button
            onClick={generateLayout}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Generate Layout</span>
          </button>
          
          <button
            onClick={generateLayout}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Smart Layout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
