// Graph Algorithms Implementation
// Enhanced with step-by-step tracking for visual animation

export class GraphAlgorithms {
  
  // Dijkstra's Shortest Path Algorithm
  static dijkstra(nodes, edges, startId, endId) {
    const steps = [];
    const distances = new Map();
    const previous = new Map();
    const visited = new Set();
    const unvisited = new Set();
    
    // Initialize
    nodes.forEach(node => {
      distances.set(node.id, node.id === startId ? 0 : Infinity);
      previous.set(node.id, null);
      unvisited.add(node.id);
    });
    
    steps.push({
      type: 'initialize',
      distances: new Map(distances),
      visited: new Set(visited),
      current: startId,
      message: `Starting Dijkstra's algorithm from node ${startId}`
    });
    
    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let current = null;
      let minDistance = Infinity;
      
      for (const nodeId of unvisited) {
        if (distances.get(nodeId) < minDistance) {
          minDistance = distances.get(nodeId);
          current = nodeId;
        }
      }
      
      if (current === null || minDistance === Infinity) break;
      
      unvisited.delete(current);
      visited.add(current);
      
      steps.push({
        type: 'visit',
        current,
        distances: new Map(distances),
        visited: new Set(visited),
        message: `Visiting node ${current} (distance: ${minDistance})`
      });
      
      if (current === endId) break;
      
      // Check neighbors
      const neighbors = edges.filter(edge => edge.source === current);
      
      for (const edge of neighbors) {
        const neighbor = edge.target;
        if (visited.has(neighbor)) continue;
        
        const weight = edge.weight || 1;
        const altDistance = distances.get(current) + weight;
        
        if (altDistance < distances.get(neighbor)) {
          distances.set(neighbor, altDistance);
          previous.set(neighbor, current);
          
          steps.push({
            type: 'update',
            current,
            neighbor,
            oldDistance: distances.get(neighbor),
            newDistance: altDistance,
            distances: new Map(distances),
            visited: new Set(visited),
            message: `Updated distance to node ${neighbor}: ${altDistance}`
          });
        }
      }
    }
    
    // Build path
    const path = [];
    let current = endId;
    
    while (current !== null) {
      path.unshift(current);
      current = previous.get(current);
    }
    
    steps.push({
      type: 'complete',
      path: path.length > 1 && path[0] === startId ? path : [],
      distance: distances.get(endId),
      message: path.length > 1 && path[0] === startId 
        ? `Shortest path found: ${path.join(' → ')} (distance: ${distances.get(endId)})` 
        : 'No path found'
    });
    
    return { steps, path: path.length > 1 && path[0] === startId ? path : [], distance: distances.get(endId) };
  }
  
  // Depth-First Search
  static dfs(nodes, edges, startId, targetId = null) {
    const steps = [];
    const visited = new Set();
    const stack = [startId];
    const path = [];
    
    steps.push({
      type: 'initialize',
      visited: new Set(visited),
      stack: [...stack],
      message: `Starting DFS from node ${startId}${targetId ? ` searching for ${targetId}` : ''}`
    });
    
    while (stack.length > 0) {
      const current = stack.pop();
      
      if (visited.has(current)) continue;
      
      visited.add(current);
      path.push(current);
      
      steps.push({
        type: 'visit',
        current,
        visited: new Set(visited),
        stack: [...stack],
        path: [...path],
        message: `Visiting node ${current}`
      });
      
      if (targetId && current === targetId) {
        steps.push({
          type: 'found',
          target: targetId,
          path: [...path],
          message: `Target node ${targetId} found!`
        });
        break;
      }
      
      // Add neighbors to stack (in reverse order for consistent traversal)
      const neighbors = edges.filter(edge => edge.source === current)
                           .map(edge => edge.target)
                           .filter(neighbor => !visited.has(neighbor))
                           .reverse();
      
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
      
      steps.push({
        type: 'expand',
        current,
        neighbors,
        stack: [...stack],
        visited: new Set(visited),
        message: `Added neighbors of ${current} to stack: ${neighbors.join(', ')}`
      });
    }
    
    steps.push({
      type: 'complete',
      path,
      found: targetId ? visited.has(targetId) : true,
      message: targetId 
        ? (visited.has(targetId) ? `DFS completed - Target ${targetId} found!` : `DFS completed - Target ${targetId} not found`)
        : 'DFS traversal completed'
    });
    
    return { steps, path, found: targetId ? visited.has(targetId) : true };
  }
  
  // Breadth-First Search
  static bfs(nodes, edges, startId, targetId = null) {
    const steps = [];
    const visited = new Set();
    const queue = [startId];
    const path = [];
    
    steps.push({
      type: 'initialize',
      visited: new Set(visited),
      queue: [...queue],
      message: `Starting BFS from node ${startId}${targetId ? ` searching for ${targetId}` : ''}`
    });
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      if (visited.has(current)) continue;
      
      visited.add(current);
      path.push(current);
      
      steps.push({
        type: 'visit',
        current,
        visited: new Set(visited),
        queue: [...queue],
        path: [...path],
        message: `Visiting node ${current}`
      });
      
      if (targetId && current === targetId) {
        steps.push({
          type: 'found',
          target: targetId,
          path: [...path],
          message: `Target node ${targetId} found!`
        });
        break;
      }
      
      // Add neighbors to queue
      const neighbors = edges.filter(edge => edge.source === current)
                           .map(edge => edge.target)
                           .filter(neighbor => !visited.has(neighbor) && !queue.includes(neighbor));
      
      for (const neighbor of neighbors) {
        queue.push(neighbor);
      }
      
      steps.push({
        type: 'expand',
        current,
        neighbors,
        queue: [...queue],
        visited: new Set(visited),
        message: `Added neighbors of ${current} to queue: ${neighbors.join(', ')}`
      });
    }
    
    steps.push({
      type: 'complete',
      path,
      found: targetId ? visited.has(targetId) : true,
      message: targetId 
        ? (visited.has(targetId) ? `BFS completed - Target ${targetId} found!` : `BFS completed - Target ${targetId} not found`)
        : 'BFS traversal completed'
    });
    
    return { steps, path, found: targetId ? visited.has(targetId) : true };
  }
  
  // Topological Sort (using DFS approach)
  static topologicalSort(nodes, edges) {
    const steps = [];
    const visited = new Set();
    const stack = [];
    const visiting = new Set(); // For cycle detection
    
    const visit = (nodeId) => {
      if (visiting.has(nodeId)) {
        steps.push({
          type: 'cycle',
          node: nodeId,
          message: `Cycle detected at node ${nodeId} - Topological sort not possible`
        });
        return false; // Cycle detected
      }
      
      if (visited.has(nodeId)) return true;
      
      visiting.add(nodeId);
      visited.add(nodeId);
      
      steps.push({
        type: 'visit',
        current: nodeId,
        visited: new Set(visited),
        visiting: new Set(visiting),
        message: `Visiting node ${nodeId}`
      });
      
      // Visit all neighbors first
      const neighbors = edges.filter(edge => edge.source === nodeId)
                           .map(edge => edge.target);
      
      for (const neighbor of neighbors) {
        if (!visit(neighbor)) return false;
      }
      
      visiting.delete(nodeId);
      stack.push(nodeId);
      
      steps.push({
        type: 'finish',
        current: nodeId,
        stack: [...stack],
        message: `Finished processing node ${nodeId}`
      });
      
      return true;
    };
    
    steps.push({
      type: 'initialize',
      message: 'Starting topological sort'
    });
    
    // Visit all nodes
    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (!visit(node.id)) {
          return { steps, result: [], hasCycle: true };
        }
      }
    }
    
    const result = stack.reverse();
    
    steps.push({
      type: 'complete',
      result,
      message: `Topological sort completed: ${result.join(' → ')}`
    });
    
    return { steps, result, hasCycle: false };
  }
  
  // Utility function to check if graph is DAG (for topological sort)
  static isDAG(nodes, edges) {
    const visited = new Set();
    const visiting = new Set();
    
    const hasCycle = (nodeId) => {
      if (visiting.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;
      
      visiting.add(nodeId);
      visited.add(nodeId);
      
      const neighbors = edges.filter(edge => edge.source === nodeId)
                           .map(edge => edge.target);
      
      for (const neighbor of neighbors) {
        if (hasCycle(neighbor)) return true;
      }
      
      visiting.delete(nodeId);
      return false;
    };
    
    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (hasCycle(node.id)) return false;
      }
    }
    
    return true;
  }
}