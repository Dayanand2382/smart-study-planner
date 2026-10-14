// Chart.js charts: tasks completed per day + tasks by subject

const Charts = (function () {
  let weekly = null;
  let subjects = null;
  const palette = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7", "#ec4899", "#84cc16"];

  function available() {
    return typeof Chart !== "undefined";
  }

  function applyTheme() {
    if (!available()) return;
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    Chart.defaults.color = dark ? "#cbd5e1" : "#475569";
    Chart.defaults.borderColor = dark ? "#334155" : "#e2e8f0";
  }

  function init() {
    if (!available()) {
      document.getElementById("chartsNote").hidden = false;
      return;
    }
    applyTheme();

    weekly = new Chart(document.getElementById("weeklyChart"), {
      type: "bar",
      data: {
        labels: [],
        datasets: [{ label: "Tasks completed", data: [], backgroundColor: "#6366f1", borderRadius: 6 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });

    subjects = new Chart(document.getElementById("subjectChart"), {
      type: "doughnut",
      data: { labels: [], datasets: [{ data: [], backgroundColor: palette }] },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  function update(tasks) {
    if (!weekly || !subjects) return;

    // Last 7 days
    const days = Utils.lastNDays(7);
    weekly.data.labels = days.map(function (d) {
      return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short" });
    });
    weekly.data.datasets[0].data = days.map(function (d) {
      return tasks.filter(function (t) { return t.completed && t.completedOn === d; }).length;
    });
    weekly.update();

    // By subject
    const counts = {};
    tasks.forEach(function (t) {
      counts[t.subject] = (counts[t.subject] || 0) + 1;
    });
    subjects.data.labels = Object.keys(counts);
    subjects.data.datasets[0].data = Object.values(counts);
    subjects.update();
  }

  // Called after switching dark / light mode
  function refresh() {
    if (!weekly || !subjects) return;
    applyTheme();
    weekly.update();
    subjects.update();
  }

  return { init: init, update: update, refresh: refresh };
})();
