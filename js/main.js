import { CONFIG } from './config.js';
import { Grid } from './grid.js';
import { Ant } from './ant.js';

/**
 * Main simulation class that manages the ant colony simulation
 * Handles initialization, updates, and rendering of the simulation
 */
class AntSimulation {
    /**
     * Initialize the simulation with canvas, grid, and ants
     */
    constructor() {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        
        this.ants = [];
        this.animationFrameId = null;
        
        this.grid = new Grid(
            this.canvasWidth, 
            this.canvasHeight, 
            CONFIG.sizes.grid, 
            this.canvas
        );
        
        this.initialize();
    }
    
    /**
     * Set up the initial state of the simulation
     * Creates home, ants, and food sources
     */
    initialize() {
        // Create home at center
        this.grid.addHome(
            this.canvasWidth / 2 / CONFIG.sizes.grid,
            this.canvasHeight / 2 / CONFIG.sizes.grid,
            CONFIG.sizes.home
        );
        
        // Create ants at home position
        const homeX = this.canvasWidth / 2;
        const homeY = this.canvasHeight / 2;
        
        for (let i = 0; i < CONFIG.simulation.antCount; i++) {
            this.ants.push(new Ant(
                homeX,
                homeY,
                CONFIG.sizes.ant,
                this.canvas
            ));
        }
        
        // Add food source
        this.grid.addFood(
            400 / CONFIG.sizes.grid,
            380 / CONFIG.sizes.grid,
            CONFIG.sizes.food
        );
    }
    
    /**
     * Main update loop for the simulation
     * Clears the canvas, updates the grid and all ants
     */
    update() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Update grid
        this.grid.play();
        
        // Update each ant
        this.ants.forEach(ant => this.updateAnt(ant));
        
        // Request next frame
        this.animationFrameId = requestAnimationFrame(() => this.update());
    }
    
    /**
     * Update a single ant's state
     * Handles pheromone deposits, movement, and collisions
     * @param {Ant} ant - The ant to update
     */
    updateAnt(ant) {
        if (ant.leavePoint) {
            ant.leavePoint = false;
            this.grid.addPoint(ant.x, ant.y, ant.hasFood, ant.intensity);
        }
        
        const nextPoint = this.grid.findBestPointInRadius(
            ant.x,
            ant.y,
            CONFIG.simulation.antSensitiveRadius,
            ant.hasFood
        );
        
        ant.play(nextPoint);
        
        // Check collisions
        if (this.grid.checkCollision(ant.x, ant.y, 'isHomePoint')) {
            ant.collisionWithHome();
        }
        
        if (this.grid.checkCollision(ant.x, ant.y, 'isFoodPoint')) {
            ant.collisionWithFood();
        }
    }
    
    /**
     * Start the simulation
     */
    start() {
        if (!this.animationFrameId) {
            this.update();
        }
    }
    
    /**
     * Stop the simulation
     */
    stop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    
    /**
     * Add a new food source at the specified coordinates
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    addFoodSource(x, y) {
        this.grid.addFood(
            x / CONFIG.sizes.grid,
            y / CONFIG.sizes.grid,
            CONFIG.sizes.food
        );
    }
}

// Initialize simulation when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    const simulation = new AntSimulation();
    simulation.start();
    
    // Add event listener for the toggle button
    const toggleButton = document.getElementById('toggleSimulation');
    toggleButton.addEventListener('click', () => {
        if (simulation.animationFrameId) {
            simulation.stop();
            toggleButton.textContent = 'Resume';
        } else {
            simulation.start();
            toggleButton.textContent = 'Pause';
        }
    });
    
    // Add event listener for canvas clicks to add food sources
    const canvas = document.getElementById('myCanvas');
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        simulation.addFoodSource(x, y);
    });
});
