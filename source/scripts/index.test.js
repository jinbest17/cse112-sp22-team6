/**
 * @jest-environment jsdom
 */
require('../../__mocks__/WebAnim.mock');
let { 
  togglePomoBreak, 
  startTimer, 
  resetTimer, 
  beginBreak, 
  currentTime, 
  timerOptions, 
  beginCountdown, 
  timeFraction,
  format_date, 
  updateLocalStorage,
  testDom
} = require("./index");

test('checks break toggle', () => {
  expect(togglePomoBreak(true)).toBe(false);
  expect(togglePomoBreak(false)).toBe(true);
});
  
test('checks start state', () => {
  expect(startTimer(false, 0)).toStrictEqual(["pomo", 0]);
  expect(startTimer(true, 0)).toStrictEqual(["short break", 1]);
  expect(startTimer(false, 1)).toStrictEqual(["pomo", 1]);
  expect(startTimer(true, 1)).toStrictEqual(["short break", 2]);
  expect(startTimer(false, 2)).toStrictEqual(["pomo", 2]);
  expect(startTimer(true, 2)).toStrictEqual(["short break", 3]);
  expect(startTimer(false, 3)).toStrictEqual(["pomo",3]);
  expect(startTimer(true, 3)).toStrictEqual(["long break", 0]);
  expect(startTimer(false, 0)).toStrictEqual(["pomo", 0]);
});
  
test('checks reset state', () => {
  expect(resetTimer()).toStrictEqual(["stopped", 0, "▶ Begin"]);
});

test('Check current time display', ()=>{
    currentTime(1500, document.querySelector('#countdownText'));
    expect(document.querySelector('#countdownText').textContent).toStrictEqual("25:00");
  
    currentTime(319, document.querySelector('#countdownText'));
    expect(document.querySelector('#countdownText').textContent).toStrictEqual("05:19");
  
    currentTime(23, document.querySelector('#countdownText'));
    expect(document.querySelector('#countdownText').textContent).toStrictEqual("00:23");
});

test('Test timer fraction', () => {
    expect(timeFraction(150, timerOptions.POMO)).toStrictEqual(0.1);
    expect(timeFraction(1500, timerOptions.POMO)).toStrictEqual(1);
    expect(timeFraction(150, timerOptions.SHORT)).toStrictEqual(0.5);
    expect(timeFraction(60, timerOptions.SHORT)).toStrictEqual(0.2);
    expect(timeFraction(810, timerOptions.LONG)).toStrictEqual(0.9);
    expect(timeFraction(450, timerOptions.LONG)).toStrictEqual(0.5);
});
  
test('checks test', () => {
  testDom();
  expect(document.querySelector("title").innerText).toStrictEqual("Test Text");
});

test('checks format date', () => {
  let check = new Date();
  let dd = String(check.getDate()).padStart(2, "0"); // date
  let mm = String(check.getMonth() + 1).padStart(2, "0"); // month
  let yyyy = check.getFullYear(); // year
  let check_format = mm + "/" + dd + "/" + yyyy;
  
  expect(format_date(check)).toStrictEqual(check_format);
});

test('checks local storage test 0', () => { // test empty storage
  let check1 = new Date(2021, 1, 18); // 2-18-2021 (month is 0-indexed)
  let check2 = new Date(2021, 1, 18);
  let check3 = new Date(2021, 1, 18);
  let storage = updateLocalStorage(true, check1, check2, check3);
  expect(storage.getItem("total-task-count")).toStrictEqual("1");
  expect(storage.getItem("today-task-count")).toStrictEqual("1");
  expect(storage.getItem("week-task-count")).toStrictEqual("1");
  expect(storage.getItem("today")).toStrictEqual("02/18/2021");
  expect(storage.getItem("week-start")).toStrictEqual("02/15/2021");
});

test('checks local storage test 1', () => { // test case 1
  let check1 = new Date(2021, 1, 10); // 2-10-2021 (month is 0-indexed)
  let check2 = new Date(2021, 1, 10);
  let check3 = new Date(2021, 1, 10);
  let storage = updateLocalStorage(true, check1, check2, check3);
  let check4 = new Date(2021, 1, 16); // 2-16-2021 (month is 0-indexed)
  let check5 = new Date(2021, 1, 16);
  let check6 = new Date(2021, 1, 16);
  storage = updateLocalStorage(false, check4, check5, check6);
  expect(storage.getItem("total-task-count")).toStrictEqual("2");
  expect(storage.getItem("today-task-count")).toStrictEqual("1");
  expect(storage.getItem("week-task-count")).toStrictEqual("1");
  expect(storage.getItem("today")).toStrictEqual("02/16/2021");
  expect(storage.getItem("week-start")).toStrictEqual("02/15/2021"); // should update to new week start
});

test('checks local storage test 2', () => { // test case 2
  let check1 = new Date(2021, 1, 17); // 2-17-2021 (month is 0-indexed)
  let check2 = new Date(2021, 1, 17);
  let check3 = new Date(2021, 1, 17);
  let storage = updateLocalStorage(true, check1, check2, check3);
  let check4 = new Date(2021, 1, 18); // 2-18-2021 (month is 0-indexed)
  let check5 = new Date(2021, 1, 18);
  let check6 = new Date(2021, 1, 18);
  storage = updateLocalStorage(false, check4, check5, check6);
  expect(storage.getItem("total-task-count")).toStrictEqual("2");
  expect(storage.getItem("today-task-count")).toStrictEqual("1");
  expect(storage.getItem("week-task-count")).toStrictEqual("2");
  expect(storage.getItem("today")).toStrictEqual("02/18/2021");
  expect(storage.getItem("week-start")).toStrictEqual("02/15/2021");
});

test('checks local storage test 3', () => { // test case 3
  let check1 = new Date(2021, 1, 18); // 2-18-2021 (month is 0-indexed)
  let check2 = new Date(2021, 1, 18);
  let check3 = new Date(2021, 1, 18);
  let storage = updateLocalStorage(true, check1, check2, check3);
  let check4 = new Date(2021, 1, 18); // 2-18-2021 (month is 0-indexed)
  let check5 = new Date(2021, 1, 18);
  let check6 = new Date(2021, 1, 18);
  storage = updateLocalStorage(false, check4, check5, check6);
  expect(storage.getItem("total-task-count")).toStrictEqual("2");
  expect(storage.getItem("today-task-count")).toStrictEqual("2");
  expect(storage.getItem("week-task-count")).toStrictEqual("2");
  expect(storage.getItem("today")).toStrictEqual("02/18/2021");
  expect(storage.getItem("week-start")).toStrictEqual("02/15/2021");
});

describe('statistics', () => {
  test.todo('if open-button opens stats-pane');
  test.todo('if close-button closes stats-pane, after opening');
  test.todo('if open-button opens stats-pane, after closing');
});

describe('Timer Countdown Functions', () =>{
  test.todo('Check beginCountdown() method for work cycles');
  test.todo('Check beginBreak() method for breaks');
});

// test('Checking begin break', () => {
//     beginBreak(300, document.querySelector('#countdownText'));
//     expect(document.querySelector('#countdownText').textContent).toStrictEqual("25:00");
// });

// test('Checking begin countdown', () => {
//     pomoCount = 0;
//     beginCountdown(1500, document.querySelector('#countdownText'));
//     expect(pomoState).toStrictEqual("stopped");
//     expect(document.querySelector('#countdownText').textContent).toStrictEqual("5:00");

//     pomoCount = 3;
//     beginCountdown(1500, document.querySelector('#countdownText'));
//     expect(document.querySelector('#countdownText').textContent).toStrictEqual("15:00");

//     pomoCount = 1;
//     beginCountdown(1500, document.querySelector('#countdownText'));
//     expect(document.querySelector('#countdownText').textContent).toStrictEqual("5:00");
// });