// Small pure helper functions (no DOM here, so they are easy to test)

const Utils = {
  pad(n) {
    return String(n).padStart(2, "0");
  },

  // Local date as "YYYY-MM-DD"
  dateStr(d) {
    d = d || new Date();
    return d.getFullYear() + "-" + Utils.pad(d.getMonth() + 1) + "-" + Utils.pad(d.getDate());
  },

  addDays(d, n) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  },

  // Consecutive study days counting back from today
  // (if you have not studied yet today, yesterday keeps the streak alive)
  calcStreak(days, today) {
    today = today || new Date();
    const set = new Set(days);
    let cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (!set.has(Utils.dateStr(cursor))) cursor = Utils.addDays(cursor, -1);
    let streak = 0;
    while (set.has(Utils.dateStr(cursor))) {
      streak++;
      cursor = Utils.addDays(cursor, -1);
    }
    return streak;
  },

  isOverdue(task, today) {
    if (task.completed || !task.deadline) return false;
    return task.deadline < Utils.dateStr(today || new Date());
  },

  // Last n days as "YYYY-MM-DD", oldest first
  lastNDays(n, today) {
    today = today || new Date();
    const out = [];
    for (let i = n - 1; i >= 0; i--) out.push(Utils.dateStr(Utils.addDays(today, -i)));
    return out;
  },

  // Pending first, then earliest deadline, then High > Medium > Low
  sortTasks(tasks) {
    const rank = { High: 0, Medium: 1, Low: 2 };
    return tasks.slice().sort(function (a, b) {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const da = a.deadline || "9999-12-31";
      const db = b.deadline || "9999-12-31";
      if (da !== db) return da < db ? -1 : 1;
      return rank[a.priority] - rank[b.priority];
    });
  }
};

// Lets Node load this file for testing; ignored in the browser
if (typeof module !== "undefined") module.exports = Utils;
