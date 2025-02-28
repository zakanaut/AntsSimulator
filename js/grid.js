import { CONFIG } from './config.js';

export class Grid {
    constructor(canvasWidth, canvasHeight, cellSize, canvas) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.cellSize = cellSize;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        
        this.columns = Math.floor(canvasWidth / cellSize);
        this.rows = Math.floor(canvasHeight / cellSize);
        this.intensityFall = -1;
        
        // Initialize the grid matrix
        this.initializeMatrix();
    }
    
    initializeMatrix() {
        this.matrix = new Array(this.columns);
        
        // Each cell point has foodIntensity, homeIntensity and optionally isHomePoint or isFoodPoint
        for (let i = 0; i < this.columns; i++) {
            this.matrix[i] = new Array(this.rows);
            
            for (let j = 0; j < this.rows; j++) {
                this.matrix[i][j] = { foodIntensity: 0, homeIntensity: 0 };
            }
        }
    }
    
    // Main update/draw method
    play() {
        this.matrix.forEach((column, columnIndex) => {
            column.forEach((cell, rowIndex) => {
                if (cell.isHomePoint) {
                    this.drawCell(columnIndex, rowIndex, CONFIG.colors.home);
                } else if (cell.isFoodPoint) {
                    this.drawCell(columnIndex, rowIndex, CONFIG.colors.food);
                } else if (cell.homeIntensity > 0) {
                    cell.homeIntensity += this.intensityFall;
                    this.drawCell(columnIndex, rowIndex, 'rgba(250, 250, 250)');
                } else if (cell.foodIntensity > 0) {
                    cell.foodIntensity += this.intensityFall;
                    this.drawCell(columnIndex, rowIndex, 'rgba(250, 250, 0)');
                }
            });
        });
    }
    
    // Add home area to the grid
    addHome(column, row, homeRadius) {
        this.getPointsInRadius(column, row, homeRadius).forEach(point => {
            this.matrix[point.column][point.row].isHomePoint = true;
        });
    }
    
    // Add food area to the grid
    addFood(column, row, foodRadius) {
        this.getPointsInRadius(column, row, foodRadius).forEach(point => {
            this.matrix[point.column][point.row].isFoodPoint = true;
        });
    }
    
    // Add pheromone point to the grid
    addPoint(x, y, isFood, intensity) {
        const position = this.findPosition(x, y);
        
        if (!this.isValidColumnAndRow(position.column, position.row)) {
            return;
        }
        
        if (isFood) {
            this.matrix[position.column][position.row].foodIntensity = intensity;
        } else {
            this.matrix[position.column][position.row].homeIntensity = intensity;
        }
    }
    
    // Find the best point for an ant to move towards within a radius
    findBestPointInRadius(antX, antY, radius, hasFood) {
        // Find ant's position in grid
        const antGridPosition = this.findPosition(antX, antY);
        
        // Find all points within radius of ant
        const points = this.getPointsInRadius(
            antGridPosition.column, 
            antGridPosition.row, 
            radius
        );
        
        // First priority: find direct food or home
        if (hasFood) {
            // Ant has food, look for home
            for (const point of points) {
                if (this.matrix[point.column][point.row]?.isHomePoint) {
                    return this.findCoordsOfPixelsCenter(point.column, point.row);
                }
            }
        } else {
            // Ant doesn't have food, look for food
            for (const point of points) {
                if (this.matrix[point.column][point.row]?.isFoodPoint) {
                    return this.findCoordsOfPixelsCenter(point.column, point.row);
                }
            }
        }
        
        // Second priority: follow pheromone trails
        const bestPointsToGoTo = this.findBestPoints(points, hasFood);
        
        if (bestPointsToGoTo.length) {
            const bestPointToGoTo = bestPointsToGoTo.reduce((max, current) => {
                return current.intensity > max.intensity ? current : max;
            }, bestPointsToGoTo[0]);
            
            return this.findCoordsOfPixelsCenter(bestPointToGoTo.column, bestPointToGoTo.row);
        }
        
        return undefined;
    }
    
    // Check if ant is colliding with a specific type of cell
    checkCollision(x, y, type) {
        const position = this.findPosition(x, y);
        
        if (this.isValidColumnAndRow(position.column, position.row)) {
            return this.matrix[position.column][position.row][type] ?? false;
        }
        
        return false;
    }
    
    // Find the center coordinates of a cell
    findCoordsOfPixelsCenter(x, y) {
        const distanceToCenter = Math.floor(this.cellSize / 2);
        return {
            x: x * this.cellSize + distanceToCenter, 
            y: y * this.cellSize + distanceToCenter
        };
    }
    
    // Check if column and row are valid
    isValidColumnAndRow(column, row) {
        return Number.isInteger(column) && Number.isInteger(row) && 
               column >= 0 && row >= 0 && 
               column < this.columns && row < this.rows;
    }
    
    // Draw a cell on canvas
    drawCell(columnIndex, rowIndex, color) {
        this.ctx.beginPath();
        this.ctx.rect(
            columnIndex * this.cellSize, 
            rowIndex * this.cellSize, 
            this.cellSize, 
            this.cellSize
        );
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.closePath();
    }
    
    // Find cells with pheromones within points
    findBestPoints(points, hasFood = false) {
        const result = [];
        
        points.forEach(point => {
            const { column, row } = point;
            const cell = this.matrix[column][row];
            
            // For ants with food, look for home pheromones
            if (hasFood && cell.homeIntensity >= 1) {
                result.push({
                    column,
                    row,
                    intensity: cell.homeIntensity
                });
            }
            // For ants without food, look for food pheromones
            else if (!hasFood && cell.foodIntensity >= 1) {
                result.push({
                    column,
                    row,
                    intensity: cell.foodIntensity
                });
            }
        });
        
        return result;
    }
    
    // Get all points in a circular radius
    getPointsInRadius(centerX, centerY, radius) {
        const points = [];
        
        for (let x = centerX - radius; x <= centerX + radius; x++) {
            for (let y = centerY - radius; y <= centerY + radius; y++) {
                if (this.isValidColumnAndRow(x, y)) {
                    // Calculate the distance from the center to the current point
                    const distance = Math.sqrt(
                        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
                    );
                    
                    if (distance <= radius) {
                        points.push({ column: x, row: y });
                    }
                }
            }
        }
        
        return points;
    }
    
    // Find grid position from canvas coordinates
    findPosition(x, y) {
        return {
            column: Math.floor(x / this.cellSize),
            row: Math.floor(y / this.cellSize)
        };
    }
}
