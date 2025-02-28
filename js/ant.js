import { CONFIG } from './config.js';

export class Ant {
    constructor(x, y, size, canvas) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.hasFood = false;
        this.intensity = 0;
        this.leavePoint = false;
        
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.size = size;
        
        // Movement parameters
        this.timeUntilDirectionChange = 10;
        this.currentTime = 0;
        this.angle = this.getRandomInt(0, 360);
        this.speed = 1.5;
        this.lastNextPoint = null;
        this.skipNextPoint = false;
        
        // Constants
        this.INTENSITY_FALL = -11;
        this.DIRECTION_CHANGE = 25;
    }
    
    play(nextPoint) {
        this.draw();
        this.updateMovement(nextPoint);
        this.updatePosition(nextPoint);
    }
    
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        if (this.hasFood) {
            this.ctx.fillStyle = CONFIG.colors.food;
        } else if (this.intensity > 0) {
            this.ctx.fillStyle = CONFIG.colors.home;
        } else {
            this.ctx.fillStyle = CONFIG.colors.ant;
        }
        
        this.ctx.fill();
        this.ctx.closePath();
    }
    
    updateMovement(nextPoint) {
        if (this.currentTime === this.timeUntilDirectionChange) {
            this.currentTime = 0;
            
            if (this.intensity > 0) {
                this.leavePoint = true;
                this.intensity += this.INTENSITY_FALL;
            }
            
            this.skipNextPoint = this.lastNextPoint?.intensity < nextPoint?.intensity;
            
            if (nextPoint === undefined || this.skipNextPoint) {
                const rand = Math.random();
                if (rand < 0.25) {
                    this.angle += this.DIRECTION_CHANGE;
                } else if (rand > 0.75) {
                    this.angle -= this.DIRECTION_CHANGE;
                }
            }
        }
        
        this.currentTime++;
    }
    
    updatePosition(nextPoint) {
        this.handleBoundaryCollision();
        
        const radians = (nextPoint !== undefined && !this.skipNextPoint)
            ? this.calcAngleDegrees(nextPoint.x, nextPoint.y)
            : this.degreesToRadians(this.angle);
            
        this.x = this.speed * Math.cos(radians) + this.x;
        this.y = this.speed * Math.sin(radians) + this.y;
        
        this.skipNextPoint = false;
    }
    
    handleBoundaryCollision() {
        if (this.x + this.dx < this.size) {
            this.x = this.canvas.width - this.size - 10;
        } else if (this.x + this.dx > this.canvas.width - this.size) {
            this.x = this.size;
        }
        
        if (this.y + this.dy > this.canvas.height - this.size + 2) {
            this.y = this.size;
        } else if (this.y + this.dy < this.size - 2) {
            this.y = this.canvas.height - this.size;
        }
    }
    
    calcAngleDegrees(nextX, nextY) {
        return Math.atan2(nextY - this.y, nextX - this.x);
    }
    
    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    collisionWithHome() {
        this.intensity = 1000;
        this.hasFood = false;
    }
    
    collisionWithFood() {
        this.intensity = 1000;
        this.hasFood = true;
    }
}
