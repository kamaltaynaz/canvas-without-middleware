/**
 * PauseAndResume.gs (example)
 *
 * Apps Script stops a run that takes too long. Check the limit for your
 * account type and leave a margin. This run stops itself early, saves its
 * place and schedules itself to continue.
 */

var RUN_BUDGET_MS = 20 * 60 * 1000;      // set this below your account's limit
var BOOKMARK_KEY = 'BULK_RUN_BOOKMARK';
var RESUME_HANDLER = 'resumeBulkRun';

function runAllPending() {
  startOrContinue_(SpreadsheetApp.getActiveSheet().getName(), 2);
}

function resumeBulkRun() {
  var saved = PropertiesService.getScriptProperties().getProperty(BOOKMARK_KEY);
  if (!saved) return;
  var bookmark = JSON.parse(saved);
  startOrContinue_(bookmark.tab, bookmark.nextRow);
}

function startOrContinue_(tabName, firstRow) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    Logger.log('[Run] Another run is in progress. Not starting a second one.');
    return;
  }
  try {
    clearResumeTriggers_();
    var started = Date.now();
    var sheet = SpreadsheetApp.getActive().getSheetByName(tabName);
    var lastRow = sheet.getLastRow();

    for (var r = firstRow; r <= lastRow; r++) {
      if (Date.now() - started > RUN_BUDGET_MS) {
        PropertiesService.getScriptProperties().setProperty(
          BOOKMARK_KEY, JSON.stringify({ tab: tabName, nextRow: r }));
        ScriptApp.newTrigger(RESUME_HANDLER).timeBased().after(60 * 1000).create();
        Logger.log('[Run] Paused before row ' + r + '. Resuming in about a minute.');
        return;
      }
      var status = sheet.getRange(r, 1).getValue();
      if (status === 'Ready') {
        runRow_(sheet, r, tabName, false);
        SpreadsheetApp.flush();              // make progress visible and durable
      }
    }

    PropertiesService.getScriptProperties().deleteProperty(BOOKMARK_KEY);
    Logger.log('[Run] Finished ' + tabName + '. Send one summary for the whole tab here.');
  } finally {
    lock.releaseLock();
  }
}

function clearResumeTriggers_() {
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === RESUME_HANDLER) ScriptApp.deleteTrigger(trigger);
  });
}
