const START_STOP_ID = "start-stop-button",
    TASK_BTN_ID = "task",
    TASK_POMO_COUNTER = "task-pomo-counter",
    LENGTH_OF_WEEK = 7,
    POMO_CYCLE_LENGTH = 4,
    WORK_LENGTH = 1500,
    SHORT_BREAK = 300,
    LONG_BREAK = 900,
    SLIDE_OPEN = "slide-open",
    SLIDE_CLOSE = "slide-close",
    SLIDE_ACROSS_LEFT = "slide-across-left",
    SLIDE_OPEN_SETTINGS = "slide-open-settings",
    SLIDE_CLOSE_SETTINGS = "slide-close-settings",
    RESET_BTN_TXT = "Reset",
    END_BTN_TXT = "End Session",
    BEGIN_BTN_TXT = "Begin",
    keys = { ESCAPE: "Escape", SPACE: "Space", ENTER: "Enter", T: "KeyT", Y: "KeyY", N: "KeyN", LEFT_ARROW: "ArrowLeft", RIGHT_ARROW: "ArrowRight", DOWN_ARROW: "ArrowDown" },
    timerOptions = { STOPPED: "stopped", POMO: "pomo", SHORT: "short break", LONG: "long break" },
    BEST_DAILY_POMO_ID = "best-daily-pomo-count",
    TOTAL_POMO_ID = "total-pomo-count",
    TOTAL_TASK_ID = "total-task-count",
    TODAY_TASK_ID = "today-task-count",
    WEEK_HISTORY = "week-history",
    TODAY_DATE_ID = "today",
    WEEK_START_ID = "week-start",
    TODAY_POMO_ID = "today-pomo-count",
    TOTAL_INTERRUPTION = "total-interruption",
    TODAY_INTERRUPTION = "today-interruption",
    ZEROS = [0, 0, 0, 0, 0, 0, 0];

function setCounter(t, e) { window.localStorage.setItem(t, String(e)) }

function setDate(t, e) { window.localStorage.setItem(t, e.toString()) }

function setWeekHistory(t) { window.localStorage.setItem(WEEK_HISTORY, JSON.stringify(t)) }

function getCounter(t) { return Number(window.localStorage.getItem(t)) }

function getDate(t) { return new Date(window.localStorage.getItem(t) || new Date(0)) }

function getWeekHistory() { return JSON.parse(window.localStorage.getItem(WEEK_HISTORY)) || ZEROS }

function incrTasks() { updateStorage(), setCounter(TODAY_TASK_ID, getCounter(TODAY_TASK_ID) + 1), setCounter(TOTAL_TASK_ID, getCounter(TOTAL_TASK_ID) + 1) }

function incrPomoCount() { updateStorage(); const t = getCounter(TODAY_POMO_ID) + 1;
    setCounter(TODAY_POMO_ID, t), setCounter(TOTAL_POMO_ID, getCounter(TOTAL_POMO_ID) + 1), getCounter(BEST_DAILY_POMO_ID) < t && setCounter(BEST_DAILY_POMO_ID, t); const e = ((new Date).getDay() - 1 + 7) % 7,
        o = getWeekHistory();
    o[e]++, setWeekHistory(o) }

function incrInterruptions() { updateStorage(), setCounter(TODAY_INTERRUPTION, getCounter(TODAY_INTERRUPTION) + 1), setCounter(TOTAL_INTERRUPTION, getCounter(TOTAL_INTERRUPTION) + 1) }

function updateStorage() { if (!isStorageDateToday()) { setCounter(TODAY_POMO_ID, 0), setCounter(TODAY_TASK_ID, 0), setCounter(TODAY_INTERRUPTION, 0); const t = new Date;
        setDate("today", t); const e = getRecentMonday(t);
        isSameDay(getDate("week-start"), e) || (setDate("week-start", e), setWeekHistory(ZEROS)) } }

function isStorageDateToday() { return isSameDay(new Date, getDate("today")) }

function isSameDay(t, e) { const o = t.getDate() === e.getDate(),
        n = t.getMonth() === e.getMonth(),
        s = t.getFullYear() === e.getFullYear(); return o && n && s }

function getRecentMonday(t) { const e = new Date(t); for (; 1 !== e.getDay();) e.setDate(e.getDate() - 1); return e }
const RESET_YES_ID = "reset-yes-button",
    RESET_NO_ID = "reset-no-button",
    ACCESSIBLE_CLASS = "accessible",
    root = document.documentElement;
let accessibleMode = !1,
    keystrokeMode = !0,
    autostartMode = !1;

function toggleAccessibility() { accessibleMode ? root.classList.remove("accessible") : root.classList.add("accessible"), accessibleMode = !accessibleMode }

function isA11yEnabled() { return accessibleMode }

function keyControls(t) { switch (t.code) {
        case keys.ESCAPE:
            t.preventDefault(), settingsPaneIsOpen ? closeSettingsPane() : statsPaneIsOpen && closeStatsPane(); break;
        case keys.RIGHT_ARROW:
            statsButton.disabled || (t.preventDefault(), removeAll(), settingsPaneIsOpen ? closeSettingsPane() : openStatsPane()); break;
        case keys.LEFT_ARROW:
            settingsButton.disabled || (t.preventDefault(), removeAll(), statsPaneIsOpen ? closeStatsPane() : openSettingsPane()); break;
        case keys.SPACE:
            document.activeElement instanceof HTMLInputElement || (t.preventDefault(), startResetController()); break;
        case keys.Y:
            document.getElementById(RESET_YES_ID).click(); break;
        case keys.N:
            document.getElementById(RESET_NO_ID).click(); break;
        case keys.T:
        case keys.DOWN_ARROW:
            t.preventDefault(), document.getElementById("task").click() } }

function toggleKeystroke() { keystrokeMode = !keystrokeMode, document.onkeydown = keystrokeMode ? keyControls : void 0 }

function toggleAutoStart() { autostartMode = !autostartMode }

function isAutoStartEnabled() { return autostartMode }
document.onkeydown = keyControls;
const X_LABELS = ["M", "T", "W", "Th", "F", "Sa", "Su"],
    X_LABEL = "Days",
    Y_LABEL = "Pomos Completed",
    TEXT_FONT = "Roboto",
    TEXT_FONT_SIZE = "12px",
    TEXT_FONT_SIZE_ACCESSIBILITY = "15px",
    TEXT_FONT_WEIGHT = "normal",
    TEXT_FONT_WEIGHT_ACCESSIBILITY = "bold",
    BAR_COLOR = "#eb4000",
    BAR_COLOR_ACCESSIBILITY = "#B50014",
    ANIMATION_SPEED = 275,
    Y_MIN_SCALING = 3,
    Y_MAX_STEP = 6,
    ONE = 1,
    TEST_PROCESS = "test";

function findMax(t) { let e = -1; for (let o = 0; o < t.length; o++) t[o] > e && (e = t[o]); return e }

function displayGraph(t = ZEROS) { if ("object" == typeof process && "test" === process.env.NODE_ENV) return; const e = isA11yEnabled() ? "#B50014" : "#eb4000",
        o = isA11yEnabled() ? "15px" : "12px",
        n = isA11yEnabled() ? "bold" : "normal"; let s = findMax(t),
        a = null;
    s < 3 && (s = 3), s < 6 && (a = 1); const r = { type: "bar", tooltip: { "font-family": "Roboto", "font-size": o, "font-weight": n }, scaleX: { label: { text: "Days", "font-family": "Roboto", "font-size": o, "font-weight": n }, labels: X_LABELS }, scaleY: { label: { text: Y_LABEL, "font-family": "Roboto", "font-size": o, "font-weight": n }, step: a, "max-value": s }, plotarea: { margin: "dynamic" }, plot: { animation: { effect: "ANIMATION_EXPAND_BOTTOM", method: "ANIMATION_STRONG_EASE_OUT", sequence: "ANIMATION_BY_NODE", speed: 275 } }, series: [{ values: t, "background-color": e, alpha: 1 }] };
    zingchart.render({ id: "graph", data: r, height: "100%", width: "100%" }) }
const timerBlock = document.getElementsByClassName("center-container")[0],
    breakBlock = document.getElementsByClassName("break-message")[0];
document.getElementsByClassName("counters-container")[0];
const statsPane = document.getElementById("stats-container"),
    statsOpenButton = document.getElementById("stats-open-button"),
    statsCloseButton = document.getElementById("stats-close-button"),
    totalPomoElem = document.getElementById("total-pomodoros"),
    totalInterruptElem = document.getElementById("total-interruptions"),
    bestPomoElem = document.getElementById("total-best-pomo"),
    bestTimeElem = document.getElementById("total-best-time"),
    totalTasksElem = document.getElementById("total-tasks"),
    todayPomoElem = document.getElementById("today-pomodoros"),
    todayTasksElem = document.getElementById("today-tasks"),
    todayInterruptElem = document.getElementById("today-interruptions"),
    MINUTES$1 = 60,
    NUM_DECIMALS = 2;
let statsPaneIsOpen = !1;

function updateStats() { updateStorage(), displayTodayStats(), displayTotalStats(), displayGraph(getWeekHistory()) }

function openStatsPane() { updateStats(), removeAll(), settingsPane.classList.contains(SLIDE_OPEN_SETTINGS) ? (closeSettingsPane(), timerBlock.classList.add(SLIDE_ACROSS_LEFT), breakBlock.classList.add(SLIDE_ACROSS_LEFT)) : (timerBlock.classList.add(SLIDE_OPEN), breakBlock.classList.add(SLIDE_OPEN)), statsPane.classList.add(SLIDE_OPEN), statsPaneIsOpen = !0, toggleButtons$1() }

function closeStatsPane() { timerBlock.classList.remove(SLIDE_OPEN), breakBlock.classList.remove(SLIDE_OPEN), statsPane.classList.remove(SLIDE_OPEN), timerBlock.classList.remove(SLIDE_ACROSS_LEFT), breakBlock.classList.remove(SLIDE_ACROSS_LEFT), timerBlock.classList.add(SLIDE_CLOSE), breakBlock.classList.add(SLIDE_CLOSE), statsPane.classList.add(SLIDE_CLOSE), statsPaneIsOpen = !1, toggleButtons$1() }

function toggleButtons$1() { statsOpenButton.disabled = statsPaneIsOpen, statsCloseButton.disabled = !statsPaneIsOpen }

function displayTotalStats() { const t = getCounter(TOTAL_POMO_ID),
        e = getCounter(TOTAL_INTERRUPTION),
        o = getCounter(BEST_DAILY_POMO_ID),
        n = getCounter(TOTAL_TASK_ID);
    totalPomoElem.textContent = t, totalInterruptElem.textContent = (e / (t || 1)).toFixed(2), bestPomoElem.textContent = o, bestTimeElem.textContent = (25 * o).toFixed(2), totalTasksElem.textContent = n }

function displayTodayStats() { const t = getCounter(TODAY_POMO_ID),
        e = getCounter(TODAY_INTERRUPTION),
        o = getCounter(TODAY_TASK_ID);
    todayPomoElem.textContent = t, todayInterruptElem.textContent = e, todayTasksElem.textContent = o }

function statsPaneStatus() { return statsPaneIsOpen }
statsOpenButton.onclick = openStatsPane, statsCloseButton.onclick = closeStatsPane;
const settingsPane = document.getElementById("settings-container"),
    settingsOpenButton = document.getElementById("settings-open-button"),
    settingsCloseButton = document.getElementById("settings-close-button"),
    settingsColorButton = document.getElementById("colors-switch"),
    settingsKeysButton = document.getElementById("keystroke-switch"),
    settingsAutoStartButton = document.getElementById("autostart-switch"),
    backgroundOneOption = document.getElementById("background_1"),
    backgroundTwoOption = document.getElementById("background_2"),
    backgroundThreeOption = document.getElementById("background_3"),
    backgroundOneURL = "url('./images/background.svg')",
    backgroundTwoURL = "url('./images/background2.png')",
    backgroundThreeURL = "url('./images/background3.png')",
    backgroundDropDown = document.getElementById("backgroundDropDown");
backgroundOneOption.onclick = backgroundOneClicked, backgroundTwoOption.onclick = backgroundTwoClicked, backgroundThreeOption.onclick = backgroundThreeClicked, backgroundDropDown.onmouseover = enableDropdown, settingsOpenButton.onclick = openSettingsPane, settingsCloseButton.onclick = closeSettingsPane, settingsColorButton.onclick = toggleAccessibility, settingsKeysButton.onclick = toggleKeystroke, settingsAutoStartButton.onclick = toggleAutoStart;
let settingsPaneIsOpen = !1;

function openSettingsPane() { removeAll(), statsPane.classList.contains(SLIDE_OPEN) ? (closeStatsPane(), timerBlock.classList.remove(SLIDE_CLOSE), timerBlock.classList.add(SLIDE_ACROSS_LEFT), breakBlock.classList.remove(SLIDE_CLOSE), breakBlock.classList.add(SLIDE_ACROSS_LEFT)) : (timerBlock.classList.add(SLIDE_OPEN_SETTINGS), breakBlock.classList.add(SLIDE_OPEN_SETTINGS)), settingsPane.classList.add(SLIDE_OPEN_SETTINGS), settingsPaneIsOpen = !0, toggleButtons() }

function closeSettingsPane() { timerBlock.classList.remove(SLIDE_OPEN_SETTINGS), breakBlock.classList.remove(SLIDE_OPEN_SETTINGS), settingsPane.classList.remove(SLIDE_OPEN_SETTINGS), timerBlock.classList.remove(SLIDE_ACROSS_LEFT), breakBlock.classList.remove(SLIDE_ACROSS_LEFT), timerBlock.classList.add(SLIDE_CLOSE_SETTINGS), breakBlock.classList.add(SLIDE_CLOSE_SETTINGS), settingsPane.classList.add(SLIDE_CLOSE_SETTINGS), settingsPaneIsOpen = !1, toggleButtons() }

function toggleButtons() { settingsOpenButton.disabled = settingsPaneIsOpen, settingsCloseButton.disabled = !settingsPaneIsOpen, settingsColorButton.disabled = !settingsPaneIsOpen, settingsKeysButton.disabled = !settingsPaneIsOpen, settingsAutoStartButton.disabled = !settingsPaneIsOpen }

function removeAll() { timerBlock.classList.remove(SLIDE_CLOSE), breakBlock.classList.remove(SLIDE_CLOSE), statsPane.classList.remove(SLIDE_CLOSE), timerBlock.classList.remove(SLIDE_CLOSE_SETTINGS), breakBlock.classList.remove(SLIDE_CLOSE_SETTINGS), settingsPane.classList.remove(SLIDE_CLOSE_SETTINGS) }

function settingsPaneStatus() { return settingsPaneIsOpen }
let vh = .01 * window.innerHeight;

function disableDropdown() { document.getElementById("backgrounds").style.display = "none" }

function enableDropdown() { document.getElementById("backgrounds").style.display = "" }

function backgroundOneClicked() { disableDropdown(), document.documentElement.style.backgroundImage = backgroundOneURL }

function backgroundTwoClicked() { disableDropdown(), document.documentElement.style.backgroundImage = backgroundTwoURL }

function backgroundThreeClicked() { disableDropdown(), document.documentElement.style.backgroundImage = backgroundThreeURL }
document.documentElement.style.setProperty("--vh", `${vh}px`), window.addEventListener("resize", (() => { vh = .01 * window.innerHeight, document.documentElement.style.setProperty("--vh", `${vh}px`) }));
const taskButton = document.getElementById("task");
let taskPomoCount = 0;

function increaseTaskPomo() { taskPomoCount++, document.getElementById(TASK_POMO_COUNTER).innerHTML = taskPomoCount }

function toggleTaskButtonDisabled(t) { 0 === taskPomoCount && (t = !0), taskButton.disabled = t }

function completeTask() { taskPomoCount = 0, document.getElementById(TASK_POMO_COUNTER).innerHTML = taskPomoCount, incrTasks(), toggleTaskButtonDisabled(!0), updateStats() }
taskButton && (toggleTaskButtonDisabled(!0), taskButton.addEventListener("click", (function(t) { completeTask(), t.preventDefault(), document.getElementById("animation-overlay").style.display = "flex", setTimeout((function() { document.getElementById("animation-overlay").style.display = "none" }), 3e3) })));
const STOP_TIMER_COLOR = "var(--grey)",
    WORK_TIMER_COLOR = "var(--red)",
    BREAK_TIMER_COLOR = "var(--green)",
    COLORED_POT_SOURCE = "images/honey-pot-color.svg",
    GRAY_POT_SOURCE = "images/honey-pot-gray.svg",
    DASH_STROKE_VAL = 220,
    MINUTES = 60,
    BASE_10 = 10,
    FINAL_POMO = 4,
    startStopButton = document.getElementById(START_STOP_ID),
    timerRing = document.getElementById("base-timer-path-remaining"),
    countdownText = document.getElementById("countdownText"),
    yesButton = document.getElementById("reset-yes-button"),
    noButton = document.getElementById("reset-no-button"),
    timerAudio = document.getElementById("timer-sound"),
    settingsButton = document.getElementById("settings-open-button"),
    statsButton = document.getElementById("stats-open-button"),
    workIndicator = document.getElementById("work-indicator"),
    longBreakIndicator = document.getElementById("long-break-indicator"),
    shortBreakIndicator = document.getElementById("short-break-indicator"),
    breakMessage = document.getElementById("break-message"),
    breakContainer = document.getElementById("break-container"),
    breakMessages = ["Stand up!", "Relax your mind", "Rest!", "Breathe", "Take a break!"],
    timeWorker = window.Worker && !window.Cypress ? new Worker("./scripts/timeWorker.js") : null,
    HOVER_TEXT = "hover-text",
    BREAK_BUTTON = "break-button",
    HIGHLIGHT = "highlight";
let legacyInterval, breakInterval, pomoCount = 0,
    pomoState = timerOptions.STOPPED,
    onBreak = !1,
    firstReset = !0,
    firstEndSession = !0;

function startResetController() { pomoState === timerOptions.STOPPED ? startTimer() : resetPrompt() }

function beginCountdown(t) { displayTime(--t); const e = onBreak ? "var(--green)" : "var(--red)"; if (settingsButton.disabled = !onBreak, statsButton.disabled = !onBreak, settingsButton.style.opacity = onBreak ? 1 : .2, statsButton.style.opacity = onBreak ? 1 : .2, timerRing.setAttribute("stroke", e), timerRing.setAttribute("stroke-dasharray", 220 * timeFraction(t, pomoState) + " 220"), timeWorker) { timeWorker.onmessage = t => { if (pomoState === timerOptions.STOPPED) return; const { timeLeft: e } = t.data;
            displayTime(e), timerRing.setAttribute("stroke-dasharray", 220 * timeFraction(e, pomoState) + " 220"), e < 0 && (stopTimer(), hidePrompt(), timeWorker.onmessage = void 0) }; const e = { start: !0, duration: t };
        timeWorker.postMessage(e) } else setCountdownInterval(t) }

function setCountdownInterval(t) { let e = t;
    legacyInterval = setInterval((() => {--e, displayTime(e), timerRing.setAttribute("stroke-dasharray", 220 * timeFraction(e, pomoState) + " 220"), e < 0 && (clearInterval(legacyInterval), stopTimer()) }), 1e3) }

function togglePomoBreak(t) { return startStopButton && startStopButton.classList.toggle(BREAK_BUTTON), !t }

function startTimer(t = onBreak, e = pomoCount) { return settingsPaneStatus() && closeSettingsPane(), statsPaneStatus() && closeStatsPane(), onBreak || (toggleTaskButtonDisabled(!0), hideBreakMessage(), settingsPaneIsOpen && closeSettingsPane(), statsPaneIsOpen && closeStatsPane()), onBreak && !isAutoStartEnabled() && showBreakMessage(), timerAudio.paused || (timerAudio.pause(), timerAudio.currentTime = 0), startStopButton && (isAutoStartEnabled() ? isAutoStartEnabled() && onBreak ? startStopButton.innerHTML = END_BTN_TXT : isAutoStartEnabled() && !onBreak && (startStopButton.innerHTML = "Reset") : startStopButton.innerHTML = "Reset", t ? 4 === e ? (e = 0, pomoCount = 0, pomoState = timerOptions.LONG, beginCountdown(900)) : (e++, pomoState = timerOptions.SHORT, beginCountdown(300)) : (pomoState = timerOptions.POMO, beginCountdown(1500))), [pomoState, e] }

function stopTimer() { pomoState = timerOptions.STOPPED, timerAudio.play(), timerRing.setAttribute("stroke", "var(--grey)"), countdownText.classList.remove(HOVER_TEXT), isAutoStartEnabled() && !onBreak ? startStopButton.innerHTML = END_BTN_TXT : isAutoStartEnabled() ? isAutoStartEnabled && onBreak && (startStopButton.innerHTML = "Reset") : startStopButton.innerHTML = "Begin", onBreak ? (displayTime(1500), timerTypeIndicator(timerOptions.POMO), isAutoStartEnabled() && setTimeout(startResetController, 1e3)) : (pomoCount++, 4 === pomoCount ? (displayTime(900), timerTypeIndicator(timerOptions.LONG)) : (displayTime(300), timerTypeIndicator(timerOptions.SHORT)), incrPomoCount(), increaseTaskPomo(), updateStats(), isAutoStartEnabled() && (showBreakMessage(), setTimeout(startResetController, 1e3))), updatePots(), toggleTaskButtonDisabled(!1), onBreak = togglePomoBreak(onBreak), onBreak || hideBreakMessage() }

function updatePots() { for (let t = 1; t < pomoCount + 1; t++) document.getElementById("pot" + t).src = COLORED_POT_SOURCE; for (let t = pomoCount + 1; t <= 4; t++) document.getElementById("pot" + t).src = GRAY_POT_SOURCE }

function resetTimer() { return pomoState = timerOptions.STOPPED, toggleTaskButtonDisabled(!0), settingsButton.disabled = !1, statsButton.disabled = !1, settingsButton.style.opacity = 1, statsButton.style.opacity = 1, isAutoStartEnabled() && onBreak || (incrInterruptions(), updateStats()), startStopButton && (startStopButton.innerHTML = "Begin", timeWorker && timeWorker.postMessage({ start: !1 }), legacyInterval && clearInterval(legacyInterval), onBreak && (onBreak = togglePomoBreak(onBreak)), countdownText.classList.remove(HOVER_TEXT), timerRing.setAttribute("stroke", "var(--grey)"), timerRing.setAttribute("stroke-dasharray", "220 220"), displayTime(1500), timerTypeIndicator(1500)), onBreak || hideBreakMessage(), [pomoState, "Begin"] }

function resetPrompt() {!firstEndSession && isAutoStartEnabled() && onBreak ? resetTimer() : firstReset || isAutoStartEnabled() && onBreak ? (startStopButton.style.display = "none", isAutoStartEnabled() && onBreak ? document.getElementById("prompt-text").innerHTML = "End this pomo session? <br> This will not count as an interruption." : document.getElementById("prompt-text").innerHTML = "This will count as an interruption.<br> Are you sure?", document.getElementById("prompt").style.display = "flex", yesButton.disabled = !1, noButton.disabled = !1) : resetTimer() }

function hidePrompt() { startStopButton.style.display = "", document.getElementById("prompt").style.display = "none", yesButton.disabled = !0, noButton.disabled = !0 }

function resetConfirm(t) { hidePrompt(), t && isAutoStartEnabled() && onBreak && (firstEndSession = !1), !t || isAutoStartEnabled() && onBreak || (firstReset = !1), t && resetTimer() }

function displayTime(t) { let e, o; return e = parseInt(t / 60, 10), o = parseInt(t % 60, 10), e = e < 10 ? "0" + e : e, o = o < 10 ? "0" + o : o, countdownText.textContent = e + ":" + o, window.document.title = onBreak ? "Break: " + countdownText.textContent : "Work: " + countdownText.textContent, countdownText.textContent }

function timeFraction(t, e) { return e === timerOptions.POMO ? t / 1500 : e === timerOptions.LONG ? t / 900 : t / 300 }

function timerTypeIndicator(t) { workIndicator.classList.remove(HIGHLIGHT), longBreakIndicator.classList.remove(HIGHLIGHT), shortBreakIndicator.classList.remove(HIGHLIGHT), t === timerOptions.LONG ? longBreakIndicator.classList.add(HIGHLIGHT) : t === timerOptions.SHORT ? shortBreakIndicator.classList.add(HIGHLIGHT) : workIndicator.classList.add(HIGHLIGHT) }

function showBreakMessage() { breakMessage.style.visibility = "visible", breakContainer.style.display = "inline-block"; let t = 0;
    breakInterval = setInterval((e => { t = (t + breakMessages.length) % breakMessages.length, breakMessage.innerText = breakMessages[t], t++ }), 1e4) }

function hideBreakMessage() { breakMessage.style.visibility = "hidden", breakContainer.style.display = "none", clearInterval(breakInterval) }
hideBreakMessage(), startStopButton && (startStopButton.classList.toggle(BREAK_BUTTON), startStopButton.addEventListener("click", startResetController)), countdownText && countdownText.addEventListener("click", (() => { pomoState !== timerOptions.STOPPED && (countdownText.classList.contains(HOVER_TEXT) ? countdownText.classList.remove(HOVER_TEXT) : countdownText.classList.add(HOVER_TEXT)) })), yesButton.addEventListener("click", (() => { resetConfirm(!0) })), noButton.addEventListener("click", (() => { resetConfirm(!1) }));
export { beginCountdown, displayTime, hidePrompt, resetConfirm, resetPrompt, resetTimer, setCountdownInterval, settingsButton, startResetController, startTimer, statsButton, timeFraction, timerTypeIndicator, togglePomoBreak, updatePots };