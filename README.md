# Express Local Library

Local Library website written with Express and Pug. A catalog-style web application to browse books, authors and genres — based on the classic "Local Library" tutorial pattern.

Live demo: https://express-locallibrary-tutorial-production-f3c3.up.railway.app/catalog

---

## Table of contents
- [About](#about)
- [Live demo](#live-demo)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install and run locally](#install-and-run-locally)
  - [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## About
This repository contains a Local Library web application implemented with Node.js and Express. The site demonstrates CRUD flows for books and authors, list and detail views, server-side rendering with Pug, and uses a MongoDB database for persistence.

## Live demo
https://express-locallibrary-tutorial-production-f3c3.up.railway.app/catalog

## Features
- Browse book catalog with pagination
- Book and author detail pages
- Admin CRUD for books/authors/genres (depending on included UI)
- Server-side templates with Pug
- Clean, minimal styling and responsive layout

## Tech stack
- Node.js
- Express
- Pug (templating)
- MongoDB (recommended) — Mongoose is typically used for models
- CSS (static assets)

## Getting started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or hosted, e.g., MongoDB Atlas)
- Optional: Git

### Install and run locally
1. Clone the repo: git clone https://github.com/ngurahariwhrihaspati/express-locallibrary-tutorial.git cd express-locallibrary-tutorial
2. Install dependencies
   npm install
3. Create environment variables
- Copy `.env.example` (if present) to `.env` and update values, or create `.env` with the minimal variables shown below.
4. Start the app
- Development (if `dev` script exists):
  ```
  npm run dev
  ```
- Production:
  ```
  npm start
  ```
5. Open http://localhost:3000 (or the PORT you set)

### Environment variables (example)
Create a `.env` file with: PORT=3000 MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.example.mongodb.net/local_library?retryWrites=true&w=majority

Adjust names to match what the app expects (check `config` or `app.js` to confirm variable names).

## Project structure (typical)
- app.js / server.js — application entry
- bin/www — start script (if present)
- models/ — Mongoose models (Book, Author, Genre, etc.)
- routes/ — Express routes
- views/ — Pug templates
- public/ — static assets (CSS, images, client JS)

(If your repo differs, update this section to reflect the actual layout.)

## Deployment
This project can be deployed to platforms like Railway, Heroku, or Vercel (server mode). The current live deployment is on Railway:
https://express-locallibrary-tutorial-production-f3c3.up.railway.app/catalog

When deploying, ensure your MongoDB credentials and other environment variables are set in the platform's settings.

## Contributing
Contributions and improvements are welcome. Suggested workflow:
1. Fork the repo
2. Create a branch: `git checkout -b feature/my-change`
3. Make changes and add tests if applicable
4. Push and open a pull request describing your change

## License
Include the repository license here (for example MIT). If not yet set, add a LICENSE file.

## Contact
Maintainer: ngurahariwhrihaspati  
Repo: https://github.com/ngurahariwhrihaspati/express-locallibrary-tutorial
