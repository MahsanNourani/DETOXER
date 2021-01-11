export function createTimeLog(title, clickedItem, clickTime) {
  //to log components that have time element, like heatmaps and progress bar
  var logObject = {};
  logObject.title = title;
  logObject.clickedItem = clickedItem;
  logObject.timeInVideo = clickTime;
  logObject.interactionTime = new Date().getTime();
  appendLog(logObject);
}

export function createInputLog(title, info = undefined) {
  //to log inputs entry such as starting text entry and button click
  var logObject = {};
  logObject.title = title;
  if (info) logObject.info = info;
  logObject.interactionTime = new Date().getTime();
  appendLog(logObject);
}

export function createBoolLog(title, status) {
  //to log binary status - e.g., which button and what's the boolean status
  var logObject = {};
  logObject.title = title;
  logObject.status = status;
  logObject.interactionTime = new Date().getTime();
  appendLog(logObject);
}

export function initiateLogState() {
  localStorage.clear();
  createInputLog("vid_ld", "s13_d21");
  let URL = getUrlVars();
  if (URL["userID"]) localStorage.setItem("userID", URL["userID"]);
  else localStorage.setItem("userID", "ID_NOT_FOUND");
}

function logNoteContent() {
  let content = document.getElementById("notebookText").value;
  var logObject = {};
  logObject.title = "note_val";
  logObject.content = content;
  logObject.time = new Date().getTime();
  appendLog(logObject);
}

// setInterval(function(){ // logs the content of the notebook every 30 seconds
//     logNoteContent()
// }, 30000)

function appendLog(logObject) {
  var allTheLogs = JSON.parse(localStorage.getItem("logs"));
  if (allTheLogs == undefined) {
    allTheLogs = [];
  }
  allTheLogs.push(logObject);
  localStorage.setItem("logs", JSON.stringify(allTheLogs));
}

export function getLogJson() {
  let logs = localStorage.getItem("logs");
  return JSON.parse(logs);
}

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
      vars[key] = value;
    }
  );
  return vars;
}
