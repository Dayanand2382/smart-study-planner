// Main app: tasks, filters, streak, dark mode, motivation

(function () {
  const KEY_TASKS = "ssp.tasks";
  const KEY_DAYS = "ssp.studyDays";
  const KEY_THEME = "ssp.theme";

  const QUOTES = [
    "Small steps every day lead to big achievements!",
    "Don't watch the clock; do what it does. Keep going.",
    "Discipline beats motivation when motivation runs out.",
    "One focused hour today beats five distracted hours tomorrow.",
    "You don't have to be perfect, just consistent.",
    "Every expert was once a beginner. Keep learning!",
    "Future you is cheering for the work you do today."
  ];

  let tasks = Store.load(KEY_TASKS, []);
  let studyDays = Store.load(KEY_DAYS, []);
  let filter = "all";

  const $ = function (id) { return document.getElementById(id); };

  // ---------- Saving ----------
  function saveTasks() {
    Store.save(KEY_TASKS, tasks);
  }

  function markStudyDay() {
    const today = Utils.dateStr();
    if (studyDays.indexOf(today) === -1) {
      studyDays.push(today);
      Store.save(KEY_DAYS, studyDays);
    }
    renderStreak();
  }

  // ---------- Rendering ----------
  function renderStreak() {
    const n = Utils.calcStreak(studyDays);
    $("streak").textContent = "🔥 " + n + " day streak";
  }

  function renderStats() {
    const done = tasks.filter(function (t) { return t.completed; }).length;
    const overdue = tasks.filter(function (t) { return Utils.isOverdue(t); }).length;
    $("statTotal").textContent = tasks.length;
    $("statDone").textContent = done;
    $("statPending").textContent = tasks.length - done;
    $("statOverdue").textContent = overdue;
  }

  function deadlineTag(task) {
    if (!task.deadline) return null;
    const tag = document.createElement("span");
    tag.className = "tag";
    const nice = new Date(task.deadline + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    if (Utils.isOverdue(task)) {
      tag.className += " late";
      tag.textContent = "⚠ Overdue · " + nice;
    } else if (!task.completed && task.deadline === Utils.dateStr()) {
      tag.className += " today";
      tag.textContent = "⏰ Due today";
    } else {
      tag.textContent = "📅 " + nice;
    }
    return tag;
  }

  function makeTag(text) {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = text;
    return tag;
  }

  function renderTasks() {
    const list = $("taskList");
    list.innerHTML = "";

    const visible = Utils.sortTasks(tasks).filter(function (t) {
      if (filter === "pending") return !t.completed;
      if (filter === "completed") return t.completed;
      if (filter === "overdue") return Utils.isOverdue(t);
      return true;
    });

    $("emptyState").hidden = visible.length > 0;

    visible.forEach(function (task) {
      const li = document.createElement("li");
      li.className = "task p-" + task.priority + (task.completed ? " done" : "") + (Utils.isOverdue(task) ? " overdue" : "");

      const check = document.createElement("input");
      check.type = "checkbox";
      check.checked = task.completed;
      check.setAttribute("aria-label", "Mark complete");
      check.addEventListener("change", function () { toggleTask(task.id); });

      const main = document.createElement("div");
      main.className = "task-main";
      const title = document.createElement("div");
      title.className = "task-title";
      title.textContent = task.title; // textContent keeps user text safe
      const meta = document.createElement("div");
      meta.className = "task-meta";
      meta.appendChild(makeTag("📘 " + task.subject));
      meta.appendChild(makeTag(task.priority));
      const dl = deadlineTag(task);
      if (dl) meta.appendChild(dl);
      main.appendChild(title);
      main.appendChild(meta);

      const del = document.createElement("button");
      del.className = "del";
      del.textContent = "🗑️";
      del.setAttribute("aria-label", "Delete task");
      del.addEventListener("click", function () { deleteTask(task.id); });

      li.appendChild(check);
      li.appendChild(main);
      li.appendChild(del);
      list.appendChild(li);
    });
  }

  function renderAll() {
    renderStats();
    renderTasks();
    Charts.update(tasks);
  }

  // ---------- Actions ----------
  function addTask(event) {
    event.preventDefault();
    const title = $("taskTitle").value.trim();
    if (!title) return;

    tasks.push({
      id: Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      title: title,
      subject: $("taskSubject").value.trim() || "General",
      priority: $("taskPriority").value,
      deadline: $("taskDeadline").value || "",
      completed: false,
      createdOn: Utils.dateStr(),
      completedOn: null
    });

    saveTasks();
    $("taskForm").reset();
    $("taskPriority").value = "Medium";
    renderAll();
  }

  function toggleTask(id) {
    const task = tasks.find(function (t) { return t.id === id; });
    if (!task) return;
    task.completed = !task.completed;
    task.completedOn = task.completed ? Utils.dateStr() : null;
    if (task.completed) markStudyDay();
    saveTasks();
    renderAll();
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    saveTasks();
    renderAll();
  }

  function clearCompleted() {
    tasks = tasks.filter(function (t) { return !t.completed; });
    saveTasks();
    renderAll();
  }

  function setFilter(value) {
    filter = value;
    document.querySelectorAll("#filters .chip").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.filter === value);
    });
    renderTasks();
  }

  // ---------- Theme ----------
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    $("themeToggle").textContent = theme === "dark" ? "☀️" : "🌙";
    Store.save(KEY_THEME, theme);
    Charts.refresh();
  }

  function newQuote() {
    $("quote").textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }

  // ---------- Start ----------
  function start() {
    Charts.init();
    FocusTimer.init({ onFocusDone: markStudyDay });

    $("taskForm").addEventListener("submit", addTask);
    $("clearDone").addEventListener("click", clearCompleted);
    $("newQuote").addEventListener("click", newQuote);
    $("themeToggle").addEventListener("click", function () {
      const dark = document.documentElement.getAttribute("data-theme") === "dark";
      setTheme(dark ? "light" : "dark");
    });
    document.querySelectorAll("#filters .chip").forEach(function (btn) {
      btn.addEventListener("click", function () { setFilter(btn.dataset.filter); });
    });

    let saved = Store.load(KEY_THEME, null);
    if (!saved) {
      saved = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    setTheme(saved);

    renderStreak();
    renderAll();
  }

  start();
})();
