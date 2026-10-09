# AI StudyMate — Smart Study Assistant

A responsive front-end working prototype for the SE Website Making Task. Built with HTML, CSS, and vanilla JavaScript. No API key, package installation, or backend is required.

## Features

- Responsive single-page site with Home, Features, Study Planner, Quick Quiz, About, and Contact sections.
- Add tasks with subject, estimated duration, and optional due date.
- Mark tasks complete, delete tasks, filter tasks, and clear completed tasks.
- Progress summary updates automatically.
- Tasks and light/dark theme are saved with browser `localStorage`.
- Five-question AIML basics quiz with explanations and score.
- Accessible labels, keyboard-friendly buttons, responsive layout, and basic HTML escaping for user task names.

## Project structure

```text
AI_StudyMate_SE_Project/
├── index.html
├── style.css
├── script.js
├── README.md
└── SUBMISSION_GUIDE.md
```

## Run in Windows with VS Code

1. Extract the ZIP file.
2. Open Visual Studio Code.
3. Select **File → Open Folder...** and choose `AI_StudyMate_SE_Project`.
4. In Extensions, install **Live Server** by Ritwick Dey (if it is not already installed).
5. Right-click `index.html` and choose **Open with Live Server**.
6. Your browser opens the site. Try adding a task and refreshing the page to confirm local storage works.

You can also open `index.html` directly in a browser, but Live Server is recommended while editing.

## Data storage / database note

This prototype stores tasks in the browser using `localStorage`; it is not a shared SQL database and data stays in that browser profile on that device. For an assignment requiring a real database, extend it with a backend (for example, Node.js + Express + MySQL) and save tasks through API endpoints. Do not describe localStorage as MySQL.

## Is this really AI?

The current version is a working student productivity prototype with a fixed sample quiz and rule-based progress calculations. It does **not** call a trained AI model or an external generative AI service. The “AI StudyMate” name is the project theme; describe the current implementation honestly in presentations. A later extension could integrate a real ML study recommendation model.

## Customize before submission

- Add your name, class/division, and college to the footer or About section if required.
- Replace placeholder project screenshots with screenshots of your running website.
- Create a GitHub repository and upload these project files.
- Deploy the static site to Vercel or GitHub Pages.
- Test all features and use your actual deployed URLs in the submission form.

## Troubleshooting

- **Live Server missing:** install the Live Server extension and reload VS Code.
- **Changes do not appear:** save files and hard-refresh the browser with `Ctrl + F5`.
- **Tasks are not retained:** ensure browser local storage is enabled; storage may be separate for `file://` and Live Server URLs.
- **Page looks unstyled:** check that `style.css` is in the same folder as `index.html`.
- **Buttons do not work:** check that `script.js` is in the same folder and open browser DevTools → Console for errors.
