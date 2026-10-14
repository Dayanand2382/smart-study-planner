// Pomodoro focus timer: 25 min focus / 5 min break

const FocusTimer = (function () {
  const LENGTHS = { focus: 25 * 60, break: 5 * 60 };
  let mode = "focus";
  let remaining = LENGTHS.focus;
  let handle = null;
  let endAt = 0;
  let onFocusDone = function () {};

  const KEY = "ssp.sessions"; // { "2026-10-14": 3 }

  const $ = function (id) { return document.getElementById(id); };

  function format(sec) {
    return Utils.pad(Math.floor(sec / 60)) + ":" + Utils.pad(sec % 60);
  }

  function sessionsToday() {
    const data = Store.load(KEY, {});
    return data[Utils.dateStr()] || 0;
  }

  function addSession() {
    const data = Store.load(KEY, {});
    const today = Utils.dateStr();
    data[today] = (data[today] || 0) + 1;
    Store.save(KEY, data);
  }

  function render() {
    $("timerDisplay").textContent = format(remaining);
    $("sessionsToday").textContent = sessionsToday();
    $("timerStart").textContent = handle ? "Pause" : "Start";
    $("modeFocus").classList.toggle("active", mode === "focus");
    $("modeBreak").classList.toggle("active", mode === "break");
    document.title = handle ? format(remaining) + " · Smart Study Planner" : "Smart Study Planner";
  }

  function beep() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.15;
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      // sound not available, ignore
    }
  }

  function stop() {
    clearInterval(handle);
    handle = null;
  }

  function tick() {
    remaining = Math.max(0, Math.round((endAt - Date.now()) / 1000));
    if (remaining === 0) {
      stop();
      beep();
      if (mode === "focus") {
        addSession();
        onFocusDone();
      }
      remaining = LENGTHS[mode];
    }
    render();
  }

  function toggle() {
    if (handle) {
      stop();
    } else {
      endAt = Date.now() + remaining * 1000;
      handle = setInterval(tick, 250);
    }
    render();
  }

  function reset() {
    stop();
    remaining = LENGTHS[mode];
    render();
  }

  function setMode(m) {
    mode = m;
    reset();
  }

  function init(options) {
    onFocusDone = (options && options.onFocusDone) || onFocusDone;
    $("timerStart").addEventListener("click", toggle);
    $("timerReset").addEventListener("click", reset);
    $("modeFocus").addEventListener("click", function () { setMode("focus"); });
    $("modeBreak").addEventListener("click", function () { setMode("break"); });
    render();
  }

  return { init: init };
})();
