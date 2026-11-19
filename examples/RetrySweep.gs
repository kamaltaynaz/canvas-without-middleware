/**
 * RetrySweep.gs (example)
 *
 * For the live form. A timed trigger looks for requests that failed and tries
 * them again. Because each step is safe to repeat and evidence is kept, a
 * retry continues from where the row stopped.
 *
 * Invented columns, continuing SafeStep.gs:  R = retry count
 */

var MAX_RETRIES = 3;
var COL_RETRIES = 18;

/** Run once by hand to install the trigger. */
function installRetrySweep() {
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === 'retrySweep') ScriptApp.deleteTrigger(trigger);
  });
  ScriptApp.newTrigger('retrySweep').timeBased().everyMinutes(15).create();
}

function retrySweep() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;          // a submission or another sweep is working
  try {
    var sheet = responseSheet_();
    var lastRow = sheet.getLastRow();
    for (var r = 2; r <= lastRow; r++) {
      if (sheet.getRange(r, COL.STATUS).getValue() !== 'Error') continue;

      var attempts = Number(sheet.getRange(r, COL_RETRIES).getValue()) || 0;
      if (attempts >= MAX_RETRIES) continue;

      sheet.getRange(r, COL_RETRIES).setValue(attempts + 1);
      runRow_(sheet, r, termCodeForRow_(sheet, r), false);

      var stillFailing = sheet.getRange(r, COL.STATUS).getValue() === 'Error';
      if (stillFailing && attempts + 1 >= MAX_RETRIES) {
        MailApp.sendEmail(requireProp_('ADMIN_EMAIL'),
          'Course request needs attention (row ' + r + ')',
          'Row ' + r + ' failed ' + MAX_RETRIES + ' times.\n\nLast error:\n' +
          sheet.getRange(r, COL.LAST_ERROR).getValue());
      }
    }
  } finally {
    lock.releaseLock();
  }
}

/** Find the tab that receives the form's responses by its link to a form, not by position. */
function responseSheet_() {
  var sheets = SpreadsheetApp.getActive().getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getFormUrl()) return sheets[i];
  }
  throw new Error('No tab in this spreadsheet is linked to a form.');
}

/** Your build decides how a request maps to a term. This is a placeholder. */
function termCodeForRow_(sheet, rowNumber) {
  return requireProp_('DEFAULT_TERM_CODE');
}
