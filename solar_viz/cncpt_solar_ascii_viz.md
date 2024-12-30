# Solar ASCII Visualization Project

## Project Overview
This project is an interactive Solar ASCII visualization tool developed in React, designed to illustrate the solar position and twilight phases throughout the day. It provides a visual representation of astronomical, nautical, civil, and visible horizons based on the user's location, time of day, and day of the year.

## Key Features
- **Dynamic Solar Positioning:** Calculates solar altitude, azimuth, and daylight hours.
- **Twilight Zone Representation:** Displays transitions between astronomical, nautical, and civil twilight phases.
- **Customizable User Input:** Users can adjust latitude, time, and day of the year to observe changes in solar positioning.
- **Real-time Animation:** Includes time controls for play, pause, and fast-forward features.
- **Intuitive UI:** Utilizes sliders and buttons for seamless interaction.

## Technical Details
- **Framework:** Built with React and modern JavaScript.
- **UI Components:** Incorporates reusable components for sliders, buttons, and visual cards.
- **Responsive Design:** Optimized for browser-based deployment with GitHub Pages.

## Deployment
The project can be deployed using GitHub Pages:
1. Install dependencies and build the React app.
2. Push the code to a GitHub repository.
3. Deploy to GitHub Pages using `gh-pages` npm package.

## License
This project is released under the **CC0 (Public Domain Dedication)** license to encourage free use, modification, and distribution. By using this license, the project ensures:
- Open access to all source code and assets.
- No restrictions on commercial or non-commercial use.

## About the 3beam Foundation
The project is developed and maintained by Stichting 3beam based in the Netherlands. 
This mission is to create open, educational tools that foster public understanding of astronomical phenomena. By releasing this project under CC0, we aim to promote accessibility and collaboration within the global community.

## How to Contribute
Contributions are welcome! To contribute:
1. Fork the repository on GitHub.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

## Contact
For questions, feedback, or collaboration opportunities, please contact us via the GitHub repository or at our 3beam's official email address.

---
This README file serves as the public documentation for the Solar ASCII Visualization project, adhering to the transparency and accessibility goals of 3beam.


## Getting Started for Beginners
### Local Experimental Setup (Local Folders and Files)
1. **Check Pre-requisites:**
   - Ensure Node.js and npm are installed:
     ```bash
     node -v
     npm -v
     ```
     If not, install them from [Node.js Official Website](https://nodejs.org/).

2. **Set Up the Project:**
   - Create a new directory for the project:
     ```bash
     mkdir solar-ascii-viz
     cd solar-ascii-viz
     ```
   - Initialize a new React app:
     ```bash
     npx create-react-app .
     ```

3. **Add the Visualization Code:**
   - Replace the contents of `src/App.js` with the provided Solar ASCII Visualization code.

4. **Run the Project Locally:**
   - Start the development server:
     ```bash
     npm start
     ```
   - The app will open in your default browser.

### Setting Up via GitHub (Educational Fork Setup)
1. **Check Pre-requisites:**
   - Verify Git is installed:
     ```bash
     git --version
     ```
     If not, install it from [Git Official Website](https://git-scm.com/).
   - Ensure you have a GitHub account.

2. **Fork the Repository:**
   - Visit the public repository on GitHub.
   - Click the "Fork" button to create your own copy.

3. **Clone the Fork:**
   - Open Terminal and clone the repository:
     ```bash
     git clone https://github.com/your-username/solar-ascii-viz.git
     cd solar-ascii-viz
     ```

4. **Install Dependencies:**
   - Run:
     ```bash
     npm install
     ```

5. **Run Locally:**
   - Start the app with:
     ```bash
     npm start
     ```

6. **Deploy to GitHub Pages:**
   - Install `gh-pages`:
     ```bash
     npm install gh-pages --save-dev
     ```
   - Add deployment scripts to `package.json`:
     ```json
     "homepage": "https://your-username.github.io/solar-ascii-viz",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
     ```
   - Deploy:
     ```bash
     npm run deploy
     ```

7. **Access the Deployed App:**
   - Visit `https://your-username.github.io/solar-ascii-viz`.

### Hybrid Setup (Using GitHub, Visual Studio Code, and Cursor on macOS)
1. **Set Up Git and GitHub:**
   - Follow the steps in the "Fork" section above to fork and clone the repository.

2. **Install VS Code:**
   - Download and install [Visual Studio Code](https://code.visualstudio.com/) 
   - Add the "Prettier" and "ES7+ React/Redux/React-Native snippets" extensions to VS Code.

3. **Load the Project:**
   - Open the cloned repository in VS Code.

4. **Run and Test:**
   - Use the Terminal in VS Code to run:
     ```bash
     npm start
     ```





