# 📚 Smart Study Planner

A study-planning web app that helps students organise tasks, stay focused and build a daily study streak.
Built with plain **HTML, CSS and JavaScript** (no framework), with charts powered by Chart.js.

## ✨ Features

- Add study tasks with **subject, priority and deadline**
- **Overdue** tasks highlighted in red, "Due today" warnings
- Filter by All / Pending / Done / Overdue
- **Pomodoro focus timer** (25 min focus, 5 min break) with a sound and a daily session count
- **Study streak** 🔥 that grows each day you complete a task or a focus session
- **Charts**: tasks completed in the last 7 days, and tasks by subject
- **Dark mode** (remembers your choice)
- Data saved in the browser with `localStorage`
- Works on phones and laptops

## 🗂️ Project structure

```
SmartStudyPlanner/
├── index.html
├── css/style.css
├── js/
│   ├── utils.js      helper functions (dates, streak, sorting)
│   ├── storage.js    save / load with localStorage
│   ├── charts.js     Chart.js charts
│   ├── timer.js      focus timer
│   └── app.js        tasks, filters, theme, startup
├── assets/           put screenshots here
└── README.md
```

## ▶️ How to run

1. Download or clone this folder.
2. Open `index.html` in your browser (or use the VS Code **Live Server** extension).
3. An internet connection is needed once to load Chart.js from the CDN.

## 🌐 Deploy free with GitHub Pages

1. Create a GitHub repository and upload all files.
2. Go to **Settings → Pages**.
3. Under **Branch**, choose `main` and `/ (root)`, then **Save**.
4. Your site goes live at `https://<your-username>.github.io/<repo-name>/`.

## 🚀 Roadmap

- [ ] Python (Flask or Django) backend with SQLite database
- [ ] User login
- [ ] AI study recommendations (suggest the subject you study least)
- [ ] Weekly study report

## 🛠️ Tech stack

HTML5 · CSS3 · JavaScript (ES6) · Chart.js · localStorage

## 👤 Author

Your Name · B.Tech AI & Data Science
