# AntsSimulator

A simple simulator of ants colony. 
The ants are moving randomly and they are looking for food. 
When they find food, they go back to the nest. 
The ants leave a pheromone trail behind them. 
The ants are attracted by the pheromone trail. 
The pheromone trail evaporates over time.

I took the idea from this video: https://youtu.be/81GQNPJip2Y

## Demo
https://antssimulator-production.up.railway.app/

## How to run

To run the project locally, you need to have node.js installed. 
Then install all dependencies and run the project.

```
npm i
npm run start
```


For changes run Gulp, it will recompile the project, each time you make a change in /js folder. 
It will watch for changes and merge all js files in /js folder into one all.min.js file.

```
gulp
```

