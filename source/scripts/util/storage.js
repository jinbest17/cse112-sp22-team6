import * as Constants from '../constants.js';

export const BEST_DAILY_POMO_ID = 'best-daily-pomo-count';
export const TOTAL_POMO_ID = 'total-pomo-count';
export const TOTAL_TASK_ID = 'total-task-count';
export const TODAY_TASK_ID = 'today-task-count';
export const WEEK_HISTORY = 'week-history';
export const TODAY_DATE_ID = 'today';
export const WEEK_START_ID = 'week-start';
export const TODAY_POMO_ID = 'today-pomo-count';
export const TOTAL_CYCLE_ID = 'total-cycle-count';
export const TOTAL_DISTRACTION = 'total-distraction';
export const TODAY_DISTRACTION = 'today-distraction';

/**
 * Update local storage with finished task information
 */
export function incrTasks () {
  let todaysTasks = getTasksCount();

  if (todayEqualsStorage()) {
    todaysTasks++;
  } else { // same day, same week
    todaysTasks = 1;
    setTodayStorageDate();
  }

  // Update today's task count
  window.localStorage.setItem(TODAY_TASK_ID, String(todaysTasks));

  // Update total task count
  const totalTasks = Number(window.localStorage.getItem(TOTAL_TASK_ID)) + 1;
  window.localStorage.setItem(TOTAL_TASK_ID, String(totalTasks));
}

export function getTasksCount() {
  return Number(window.localStorage.getItem(TODAY_TASK_ID));
}

/**
 * 
 * @returns Total tasks completed
 */
export function getTotalTasksCount () {
  return Number(window.localStorage.getItem(TOTAL_TASK_ID));
}

/**
 * Increments completed Pomodoros for today, the current week, and total in
 * local storage.
 * @return number of pomos completed today
 */
export function incrPomoCount () {
  let todayPomos = getPomoCount();

  // Update today's pomo count
  if (todayEqualsStorage()) {
    todayPomos++;
  } else {
    todayPomos = 1;
    setTodayStorageDate();
  }
  window.localStorage.setItem(TODAY_POMO_ID, String(todayPomos));

  // Update total pomo count
  window.localStorage.setItem(TOTAL_POMO_ID, String(Number(window.localStorage.getItem(TOTAL_POMO_ID)) + 1));
  if (Number(window.localStorage.getItem(BEST_DAILY_POMO_ID)) < todayPomos) {
    window.localStorage.setItem(BEST_DAILY_POMO_ID, todayPomos);
  }

  // Update weekly history
  const today = new Date();
  if (!isSameWeek(getTodayStorageDate(), today)) clearWeeklyHistory();
  const dayIdx = (today.getDay() - 1) % Constants.LENGTH_OF_WEEK;
  const weekHistory = JSON.parse(window.localStorage.getItem(WEEK_HISTORY)) || [0, 0, 0, 0, 0, 0, 0];
  weekHistory[dayIdx]++;
  window.localStorage.setItem(WEEK_HISTORY, JSON.stringify(weekHistory));

  return todayPomos;
}

export function getPomoCount () {
  return Number(window.localStorage.getItem(TODAY_POMO_ID));
}

export function getTotalPomoCount () {
  return Number(window.localStorage.getItem(TOTAL_POMO_ID));
}

export function getBestDailyPomoCount() {
  return Number(window.localStorage.getItem(BEST_DAILY_POMO_ID));
}

/**
 * Updates the pomo count for the current day of the week in local storage.
 */
export function getWeeklyHistory () {
  return JSON.parse(window.localStorage.getItem(WEEK_HISTORY)) || [0, 0, 0, 0, 0, 0, 0];
}

/**
 * Reset week history array to zeros
 */
export function clearWeeklyHistory () {
  const zeros = [0, 0, 0, 0, 0, 0, 0];
  window.localStorage.setItem(WEEK_HISTORY, JSON.stringify(zeros));
}

/**
 * Updates distractions in local storage
 * @param {Number} amount The number of distractions today
 * @return The updated number of distractions
 */
export function incrDistractions () {
  let todayDistractions = getDistractions();

  // Update today's distractions
  if (todayEqualsStorage()) {
    todayDistractions++;
  } else {
    todayDistractions = 1;
    setTodayStorageDate();
  }
  window.localStorage.setItem(TODAY_DISTRACTION, String(todayDistractions));

  // Update total distractions
  const distractions = Number(window.localStorage.getItem(TOTAL_DISTRACTION));
  window.localStorage.setItem(TOTAL_DISTRACTION, String(distractions + 1));
}

/**
 * Updates distractions in local storage
 * @return Today's distractions
 */
export function getDistractions () {
  return Number(window.localStorage.getItem(TODAY_DISTRACTION));
}

/**
 * Updates distractions in local storage
 * @return Today's distractions
 */
 export function getTotalDistractions () {
  return Number(window.localStorage.getItem(TOTAL_DISTRACTION));
}

export function getTodayStorageDate () {
  return new Date(window.localStorage.getItem(TODAY_DATE_ID) || new Date(0));
}

export function setTodayStorageDate () {
  const today = new Date();
  window.localStorage.setItem(TODAY_DATE_ID, today.toString());
}

export function todayEqualsStorage () {
  return isSameDay(new Date(), getTodayStorageDate());
}

/**
 * 
 * @param {Date} date1 
 * @param {Date} date2 
 */
export function isSameDay (date1, date2) {
  const isSameDate = date1.getDate() === date2.getDate();
  const isSameMonth = date1.getMonth() === date2.getMonth();
  const isSameYear = date1.getFullYear() === date2.getFullYear();
  return isSameDate && isSameMonth && isSameYear;
}

/**
 * Check if today is in the same week as week start
 * @param {Date} date1 The earlier date
 * @param {Date} date2 The later date
 * @returns boolean is it the same week
 */
function isSameWeek (date1, date2) {
  const checkDate = new Date(date2);

  // iterate until previous week start is reached
  while (!isSameDay(date1, date2)) {
    checkDate.setDate(checkDate.getDate() - 1);
    if (checkDate.getDay() === 1) {
      window.localStorage.setItem(WEEK_START_ID, checkDate.toString());
      return false;
    }
  }
  return true;
}