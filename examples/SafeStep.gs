/**
 * SafeStep.gs (example)
 *
 * A step that can run twice without doing its work twice, and a row runner
 * that writes each step's evidence the moment that step succeeds.
 *
 * Invented layout:
 *   A status | B course code | C title | D sections | ... inputs
 *   M Canvas course ID | N section IDs | O warnings | P last completed step | Q last error
 */

var COL = { STATUS: 1, CODE: 2, TITLE: 3, SECTIONS: 4,
            COURSE_ID: 13, SECTION_IDS: 14, WARNINGS: 15, LAST_STEP: 16, LAST_ERROR: 17 };

/** Create a section, or find it if a previous run already made it. */
function ensureSection_(courseId, name, sectionSisId) {
  var existing = findSectionBySisId_(sectionSisId);
  if (existing) return existing;
  try {
    return createSection_(courseId, name, sectionSisId);
  } catch (e) {
    // Another run may have created it between our check and our call.
    if (/already in use|is already taken/i.test(e.canvasBody || '')) {
      var found = findSectionBySisId_(sectionSisId);
      if (found) return found;
    }
    throw e;
  }
}

function ensureCourse_(row) {
  var existing = findCourseBySisId_(row.courseSisId);
  if (existing) return existing;
  return createCourse_(requireProp_('COURSE_ACCOUNT_SIS_ID'), row.title, row.courseSisId, row.termSisId);
}

/**
 * Run one row. `dryRun` returns the plan and calls nothing.
 * Evidence decides what is skipped. The status word decides nothing.
 */
function runRow_(sheet, rowNumber, termCode, dryRun) {
  var values = sheet.getRange(rowNumber, 1, 1, COL.LAST_ERROR).getValues()[0];
  var sections = parseList_(values[COL.SECTIONS - 1]);
  var code = String(values[COL.CODE - 1]).trim();
  var row = {
    title: String(values[COL.TITLE - 1]).trim(),
    termSisId: 'TERM-' + termCode,
    courseSisId: termCode + '-' + code,                 // invented pattern
    courseId: values[COL.COURSE_ID - 1],
    sectionIds: values[COL.SECTION_IDS - 1]
  };
  var plan = [];
  var warnings = [];

  try {
    // Step 1: the course. Evidence: a course ID in column M.
    if (!row.courseId) {
      plan.push('Create course ' + row.courseSisId + ' "' + row.title + '"');
      if (!dryRun) {
        row.courseId = ensureCourse_(row).id;
        sheet.getRange(rowNumber, COL.COURSE_ID).setValue(row.courseId);
        sheet.getRange(rowNumber, COL.LAST_STEP).setValue(1);
      }
    }

    // Step 2: the sections. Evidence: section IDs in column N.
    if (!row.sectionIds) {
      plan.push('Create ' + sections.length + ' section(s): ' + JSON.stringify(sections));
      if (!dryRun) {
        var made = sections.map(function (letter) {
          return ensureSection_(row.courseId, code + ' ' + letter, code + '-' + letter).sis_section_id;
        });
        sheet.getRange(rowNumber, COL.SECTION_IDS).setValue(made.join(', '));
        sheet.getRange(rowNumber, COL.LAST_STEP).setValue(2);
      }
    }

    // ... further steps follow the same shape. Course settings go last.

    if (!dryRun) {
      sheet.getRange(rowNumber, COL.WARNINGS).setValue(warnings.join('; '));
      sheet.getRange(rowNumber, COL.LAST_ERROR).clearContent();
      sheet.getRange(rowNumber, COL.STATUS).setValue('Done');
    }
  } catch (e) {
    if (dryRun) throw e;
    // Record the error. Do not touch the evidence or the last completed step.
    sheet.getRange(rowNumber, COL.LAST_ERROR).setValue(String(e.message).slice(0, 500));
    sheet.getRange(rowNumber, COL.STATUS).setValue('Error');
  }
  return plan;
}
