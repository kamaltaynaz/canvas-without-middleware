/**
 * CanvasApi.gs (example)
 *
 * One function owns every request. Everything else calls it.
 * The sheet and the menu only ever reach the named actions at the bottom.
 */

var CANVAS_MAX_ATTEMPTS = 4;

/**
 * @param {string} method   get | post | put | delete
 * @param {string} pathOrUrl  '/api/v1/...' or a full URL from a paging link
 * @param {Object=} body    sent as JSON unless options.form is true
 * @param {Object=} options {form: true} sends the body form-encoded
 */
function canvasRequest_(method, pathOrUrl, body, options) {
  var url = pathOrUrl.indexOf('http') === 0 ? pathOrUrl : canvasBaseUrl_() + pathOrUrl;
  var params = {
    method: method,
    headers: { Authorization: 'Bearer ' + canvasToken_() },
    muteHttpExceptions: true
  };
  if (body) {
    if (options && options.form) {
      params.payload = body;                    // an object is sent form-encoded
    } else {
      params.contentType = 'application/json';
      params.payload = JSON.stringify(body);
    }
  }

  for (var attempt = 1; attempt <= CANVAS_MAX_ATTEMPTS; attempt++) {
    var response = UrlFetchApp.fetch(url, params);
    var code = response.getResponseCode();
    if (code >= 200 && code < 300) return response;

    var text = response.getContentText() || '';
    var throttled = code === 429 || (code === 403 && /rate limit/i.test(text));
    var temporary = throttled || code >= 500;
    if (temporary && attempt < CANVAS_MAX_ATTEMPTS) {
      Utilities.sleep(1000 * Math.pow(2, attempt));   // 2 s, 4 s, 8 s
      continue;
    }
    // The message names the call and the status. It never includes headers.
    var error = new Error('Canvas ' + method.toUpperCase() + ' ' + stripHost_(url) +
                          ' returned ' + code + ': ' + text.slice(0, 300));
    error.canvasStatus = code;
    error.canvasBody = text;
    throw error;
  }
}

function stripHost_(url) {
  return url.replace(/^https?:\/\/[^\/]+/, '');
}

/** Follow paging until there is no next page. */
function canvasGetAll_(path) {
  var results = [];
  var url = path + (path.indexOf('?') === -1 ? '?' : '&') + 'per_page=100';
  while (url) {
    var response = canvasRequest_('get', url);
    results = results.concat(JSON.parse(response.getContentText()));
    url = nextPageUrl_(response.getHeaders());
  }
  return results;
}

function nextPageUrl_(headers) {
  var link = headers['Link'] || headers['link'];
  if (!link) return null;
  var parts = link.split(',');
  for (var i = 0; i < parts.length; i++) {
    var match = parts[i].match(/<([^>]+)>\s*;\s*rel="next"/);
    if (match) return match[1];
  }
  return null;
}

function canvasJson_(method, path, body, options) {
  return JSON.parse(canvasRequest_(method, path, body, options).getContentText());
}

// ---------------------------------------------------------------------------
// The allowed actions. Add one only when the spec names it.
// ---------------------------------------------------------------------------

function createCourse_(accountSisId, name, courseSisId, termSisId) {
  return canvasJson_('post',
    '/api/v1/accounts/sis_account_id:' + encodeURIComponent(accountSisId) + '/courses',
    { course: { name: name, course_code: name, sis_course_id: courseSisId,
                term_id: 'sis_term_id:' + termSisId } });
}

function findCourseBySisId_(courseSisId) {
  try {
    return canvasJson_('get', '/api/v1/courses/sis_course_id:' + encodeURIComponent(courseSisId));
  } catch (e) {
    if (e.canvasStatus === 404) return null;
    throw e;
  }
}

function createSection_(courseId, name, sectionSisId) {
  return canvasJson_('post', '/api/v1/courses/' + courseId + '/sections',
    { course_section: { name: name, sis_section_id: sectionSisId } });
}

function findSectionBySisId_(sectionSisId) {
  try {
    return canvasJson_('get', '/api/v1/sections/sis_section_id:' + encodeURIComponent(sectionSisId));
  } catch (e) {
    if (e.canvasStatus === 404) return null;
    throw e;
  }
}

/** Enrol without sending Canvas's own notification email. */
function enrolTeacher_(courseId, userId) {
  return canvasJson_('post', '/api/v1/courses/' + courseId + '/enrollments',
    { enrollment: { user_id: userId, type: 'TeacherEnrollment',
                    enrollment_state: 'active', notify: false } });
}

/**
 * Hide a navigation item. This call is sent form-encoded: in one real build,
 * the same request with a JSON body changed nothing and reported no error.
 * Read the value back afterwards to confirm it took.
 */
function hideNavigationItem_(courseId, tabId) {
  var result = canvasJson_('put', '/api/v1/courses/' + courseId + '/tabs/' + tabId,
                           { hidden: 'true' }, { form: true });
  if (result.hidden !== true) {
    throw new Error('Navigation item ' + tabId + ' is still visible after the update.');
  }
  return result;
}
