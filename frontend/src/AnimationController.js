// Animation Controller for Graph Algorithm Visualization
// Manages step-by-step playback and visual state

export class AnimationController {
  constructor(onStepChange, onComplete) {
    this.steps = [];
    this.currentStep = -1;
    this.isPlaying = false;
    this.speed = 1000; // milliseconds per step
    this.timer = null;
    this.onStepChange = onStepChange;
    this.onComplete = onComplete;
  }
  
  // Load algorithm steps
  loadSteps(steps) {
    this.steps = steps;
    this.currentStep = -1;
    this.stop();
  }
  
  // Play animation
  play() {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.playNext();
  }
  
  // Pause animation
  pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
  
  // Stop animation and reset
  stop() {
    this.pause();
    this.currentStep = -1;
    this.onStepChange(null, -1, this.steps.length);
  }
  
  // Reset to beginning
  reset() {
    this.pause();
    this.currentStep = -1;
    this.onStepChange(null, -1, this.steps.length);
  }
  
  // Step forward
  stepForward() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      const step = this.steps[this.currentStep];
      this.onStepChange(step, this.currentStep, this.steps.length);
      
      if (this.currentStep === this.steps.length - 1) {
        this.pause();
        this.onComplete && this.onComplete();
      }
    }
  }
  
  // Step backward
  stepBackward() {
    if (this.currentStep > -1) {
      this.currentStep--;
      const step = this.currentStep >= 0 ? this.steps[this.currentStep] : null;
      this.onStepChange(step, this.currentStep, this.steps.length);
    }
  }
  
  // Jump to specific step
  jumpToStep(stepIndex) {
    if (stepIndex >= -1 && stepIndex < this.steps.length) {
      this.currentStep = stepIndex;
      const step = stepIndex >= 0 ? this.steps[stepIndex] : null;
      this.onStepChange(step, this.currentStep, this.steps.length);
    }
  }
  
  // Set animation speed
  setSpeed(speed) {
    this.speed = speed;
  }
  
  // Get current state
  getState() {
    return {
      isPlaying: this.isPlaying,
      currentStep: this.currentStep,
      totalSteps: this.steps.length,
      canStepForward: this.currentStep < this.steps.length - 1,
      canStepBackward: this.currentStep > -1,
      progress: this.steps.length > 0 ? (this.currentStep + 1) / this.steps.length : 0
    };
  }
  
  // Private method to play next step
  playNext() {
    if (!this.isPlaying) return;
    
    if (this.currentStep < this.steps.length - 1) {
      this.stepForward();
      
      if (this.isPlaying && this.currentStep < this.steps.length - 1) {
        this.timer = setTimeout(() => this.playNext(), this.speed);
      }
    } else {
      this.pause();
      this.onComplete && this.onComplete();
    }
  }
}

// Visual State Manager for Graph Visualization
export class VisualStateManager {
  constructor() {
    this.nodeStates = new Map(); // nodeId -> { color, size, stroke, highlighted }
    this.edgeStates = new Map(); // edgeId -> { color, width, highlighted, animated }
    this.globalState = {
      highlightedPath: [],
      visitedNodes: new Set(),
      currentNode: null,
      algorithm: null
    };
  }
  
  // Reset all visual states
  reset() {
    this.nodeStates.clear();
    this.edgeStates.clear();
    this.globalState = {
      highlightedPath: [],
      visitedNodes: new Set(),
      currentNode: null,
      algorithm: null
    };
  }
  
  // Set node state
  setNodeState(nodeId, state) {
    this.nodeStates.set(nodeId, {
      ...this.getNodeState(nodeId),
      ...state
    });
  }
  
  // Get node state
  getNodeState(nodeId) {
    return this.nodeStates.get(nodeId) || {
      color: '#fff',
      stroke: '#666',
      size: 20,
      highlighted: false,
      text: '#333'
    };
  }
  
  // Set edge state
  setEdgeState(edgeId, state) {
    this.edgeStates.set(edgeId, {
      ...this.getEdgeState(edgeId),
      ...state
    });
  }
  
  // Get edge state
  getEdgeState(edgeId) {
    return this.edgeStates.get(edgeId) || {
      color: '#999',
      width: 2,
      highlighted: false,
      animated: false
    };
  }
  
  // Update state based on algorithm step
  updateFromStep(step, algorithm) {
    this.globalState.algorithm = algorithm;
    
    if (!step) {
      this.reset();
      return;
    }
    
    switch (algorithm) {
      case 'dijkstra':
        this.updateDijkstraState(step);
        break;
      case 'dfs':
        this.updateDFSState(step);
        break;
      case 'bfs':
        this.updateBFSState(step);
        break;
      case 'topological':
        this.updateTopologicalState(step);
        break;
    }
  }
  
  // Update visual state for Dijkstra's algorithm
  updateDijkstraState(step) {
    // Reset previous highlighting
    for (const [nodeId] of this.nodeStates) {
      this.setNodeState(nodeId, { 
        color: '#fff', 
        stroke: '#666',
        highlighted: false 
      });
    }
    
    // Mark visited nodes
    if (step.visited) {
      for (const nodeId of step.visited) {
        this.setNodeState(nodeId, {
          color: '#e8f5e8',
          stroke: '#4caf50',
          highlighted: true
        });
      }
    }
    
    // Highlight current node
    if (step.current) {
      this.setNodeState(step.current, {
        color: '#2196f3',
        stroke: '#1976d2',
        highlighted: true,
        text: '#fff'
      });
      this.globalState.currentNode = step.current;
    }
    
    // Highlight final path
    if (step.type === 'complete' && step.path && step.path.length > 0) {
      step.path.forEach((nodeId, index) => {
        this.setNodeState(nodeId, {
          color: '#ff9800',
          stroke: '#f57c00',
          highlighted: true,
          text: '#fff'
        });
      });
      this.globalState.highlightedPath = step.path;
    }
  }
  
  // Update visual state for DFS
  updateDFSState(step) {
    // Reset previous highlighting
    for (const [nodeId] of this.nodeStates) {
      this.setNodeState(nodeId, { 
        color: '#fff', 
        stroke: '#666',
        highlighted: false 
      });
    }
    
    // Mark visited nodes
    if (step.visited) {
      for (const nodeId of step.visited) {
        this.setNodeState(nodeId, {
          color: '#e3f2fd',
          stroke: '#2196f3',
          highlighted: true
        });
      }
    }
    
    // Highlight current node
    if (step.current) {
      this.setNodeState(step.current, {
        color: '#2196f3',
        stroke: '#1976d2',
        highlighted: true,
        text: '#fff'
      });
      this.globalState.currentNode = step.current;
    }
    
    // Highlight path
    if (step.path) {
      this.globalState.highlightedPath = step.path;
    }
    
    // Special highlighting for found target
    if (step.type === 'found' && step.target) {
      this.setNodeState(step.target, {
        color: '#4caf50',
        stroke: '#388e3c',
        highlighted: true,
        text: '#fff'
      });
    }
  }
  
  // Update visual state for BFS
  updateBFSState(step) {
    // Reset previous highlighting
    for (const [nodeId] of this.nodeStates) {
      this.setNodeState(nodeId, { 
        color: '#fff', 
        stroke: '#666',
        highlighted: false 
      });
    }
    
    // Mark visited nodes
    if (step.visited) {
      for (const nodeId of step.visited) {
        this.setNodeState(nodeId, {
          color: '#f3e5f5',
          stroke: '#9c27b0',
          highlighted: true
        });
      }
    }
    
    // Highlight current node
    if (step.current) {
      this.setNodeState(step.current, {
        color: '#9c27b0',
        stroke: '#7b1fa2',
        highlighted: true,
        text: '#fff'
      });
      this.globalState.currentNode = step.current;
    }
    
    // Highlight path
    if (step.path) {
      this.globalState.highlightedPath = step.path;
    }
    
    // Special highlighting for found target
    if (step.type === 'found' && step.target) {
      this.setNodeState(step.target, {
        color: '#4caf50',
        stroke: '#388e3c',
        highlighted: true,
        text: '#fff'
      });
    }
  }
  
  // Update visual state for Topological Sort
  updateTopologicalState(step) {
    // Reset previous highlighting
    for (const [nodeId] of this.nodeStates) {
      this.setNodeState(nodeId, { 
        color: '#fff', 
        stroke: '#666',
        highlighted: false 
      });
    }
    
    // Mark visited nodes
    if (step.visited) {
      for (const nodeId of step.visited) {
        this.setNodeState(nodeId, {
          color: '#fff3e0',
          stroke: '#ff9800',
          highlighted: true
        });
      }
    }
    
    // Highlight current node
    if (step.current) {
      this.setNodeState(step.current, {
        color: '#ff9800',
        stroke: '#f57c00',
        highlighted: true,
        text: '#fff'
      });
      this.globalState.currentNode = step.current;
    }
    
    // Show final ordering
    if (step.type === 'complete' && step.result) {
      step.result.forEach((nodeId, index) => {
        this.setNodeState(nodeId, {
          color: '#4caf50',
          stroke: '#388e3c',
          highlighted: true,
          text: '#fff'
        });
      });
    }
    
    // Highlight cycle if detected
    if (step.type === 'cycle') {
      this.setNodeState(step.node, {
        color: '#f44336',
        stroke: '#d32f2f',
        highlighted: true,
        text: '#fff'
      });
    }
  }
  
  // Get all current states for rendering
  getCurrentStates() {
    return {
      nodes: this.nodeStates,
      edges: this.edgeStates,
      global: this.globalState
    };
  }
}