# rock-paper-scissors-simulation
A simulation of the classic "Rock, Paper, Scissors" game, built with React and Next.js. Watch as rocks, papers, and scissors battle it out in real-time, converting each other based on the game's rules until one type dominates the field!

## Installation
1. Clone the repo
```
git clone https://github.com/your-username/rps-simulation.git
cd rps-simulation
```
2. install dependencies
```
pnpm install
```
3. Start the development server:
```
pnpm dev
```
5. Open the app in your browser at
```
http://localhost:3000
```

## Project Structure
1. page.tsx: Main component containing the simulation logic and UI.
2, ui: Reusable UI components like buttons and cards.
3. globals.css: Global styles for the application.

## How It Works
1. Initialization:
- Rocks, papers, and scissors are randomly placed in the container.
- Each element is assigned a random velocity for movement.

2. Animation:
- Elements move dynamically and bounce off the container walls.
- Collisions are detected, and the losing element is converted to the winner's type.

3. Game End:

- The game ends when all elements are of the same type, and the winner is displayed.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
