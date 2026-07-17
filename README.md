# you are not pizza

A small top-down pizzeria management game that runs directly in the browser.

You prepare and bake pizzas, serve dine-in and takeaway customers, clean tables, earn money, and hire temporary staff to automate parts of the restaurant.

## Play

Open `index.html` in a modern browser, or serve the folder with any static web server.

No build step or dependencies are required.

## Controls

| Control | Action |
| --- | --- |
| WASD / Arrow keys | Move |
| E / Space | Interact |
| Mouse | Select ingredients and use UI controls |
| P / Escape | Pause or resume |
| Restart button | Start a fresh game |

## Gameplay

1. Knead dough at the Prep counter.
2. Add sauce and cheese.
3. Place the pizza in an available oven slot.
4. Collect the baked pizza and deliver it to a waiting customer.
5. Clean table trash so the table can be used again.
6. Spend earnings on a waiter, fast waiter, or chef.

Customers lose patience while waiting. Staff members are temporary and leave when their work timer expires.

## Project structure

- `index.html` — game page and UI
- `styles.css` — layout and interface styling
- `main.js` — game state, simulation, input, staff AI, and Canvas rendering

## Development

The game uses plain HTML, CSS, JavaScript, the Canvas 2D API, and the Web Audio API. There is currently no build tool or package manager.

When changing game balance, the main values are near the top of `main.js`, including preparation times, baking time, staff cost, and staff duration.

## Current status

This is an early playable prototype. The core cooking, serving, staffing, customer-patience, takeaway, and cleanup loops are implemented.

Possible next steps include additional recipes, upgrades, shift objectives, mobile controls, saved progress, and automated tests.
