# Food Order App

This project is a React-based food ordering application with a small Express backend. It lets a user browse meals, add items to a cart, choose a display currency, complete checkout details, and submit an order.

The app includes:

- A sticky header with cart access and currency selection
- Meal cards loaded from the backend
- A shopping cart and checkout flow shown in modal dialogs
- Currency conversion based on ECB reference rates
- Visual feedback animations for adding items and successful order submission
- Unit and integration tests for the main user flows

## Project Structure

- `src/` contains the React frontend
- `backend/` contains the Express server and meal/order data
- `public/` contains frontend static assets

## What You Need Before Running It


- An IDE or code editor such as VS Code
- Node.js installed on your machine
- Internet access the first time you install dependencies

To check whether Node.js is installed, open the IDE terminal and run:

node -v

If you see a version number, Node.js is installed.

## How To Download The Project

If you are downloading this project from GitHub:

1. Open the GitHub repository page.
2. Click the green `Code` button.
3. Choose one of these:
   - `Download ZIP` if you just want the files
   - Copy the repository URL if you want to clone it with Git
4. If you downloaded a ZIP file, extract it to a folder on your computer.
5. Open that folder in your IDE.

## How To Run The Project Locally

This project has two parts that need to run at the same time:

- The backend server
- The frontend React app

### 1. Install frontend dependencies

Open a terminal in the project root folder and run:

npm install


### 2. Install backend dependencies

Open a second terminal and run:

cd backend
npm install

### 3. Start the backend

In the terminal inside the `backend` folder, run:

npm start

This starts the backend on:

http://localhost:3000


### 4. Start the frontend

In a terminal in the main project folder, run:


npm run dev

Vite will display a local address, usually:

http://localhost:5173

Open that address in your browser.

## How To Use The App

1. Browse the available meals
2. Click `Add to cart` on any item
3. Open the cart from the header
4. Click `Go to checkout`
5. Enter your delivery details
6. Submit the order

## Running The Tests

If you want to run the automated tests, use:

npm test

## Common Problems

### The page opens but no meals appear

Make sure the backend server is running in the `backend` folder with:

npm start

### Currency conversion is not working

The backend needs internet access so it can fetch ECB exchange rates.

### `npm` command is not recognized

Node.js is probably not installed, or your machine needs to be restarted after installing it.

## Summary

This project is a small full-stack food ordering demo built with React and Express. To run it locally, install dependencies, start the backend, start the frontend, and then open the local Vite URL in your browser.
