/**
 * Config.gs (example)
 *
 * Nothing secret and nothing institution-specific lives in code.
 * Set these in Project Settings > Script Properties:
 *
 *   CANVAS_ENV_ACTIVE          test | beta | production
 *   CANVAS_BASE_URL_TEST       https://example.test.instructure.com
 *   CANVAS_BASE_URL_BETA       https://example.beta.instructure.com
 *   CANVAS_BASE_URL_PRODUCTION https://canvas.example.edu
 *   CANVAS_API_TOKEN_TEST      (a token for that environment)
 *   CANVAS_API_TOKEN_BETA
 *   CANVAS_API_TOKEN_PRODUCTION
 *   COURSE_ACCOUNT_SIS_ID      the sub-account new courses go into
 *   COURSE_TIMEZONE            an IANA name, for example Europe/London
 *   ADMIN_EMAIL                where run summaries go
 */

var ENVIRONMENTS = ['test', 'beta', 'production'];

function prop_(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

function requireProp_(key) {
  var value = prop_(key);
  if (!value) {
    throw new Error('Missing Script Property: ' + key);
  }
  return value;
}

function activeEnv_() {
  var env = (prop_('CANVAS_ENV_ACTIVE') || 'test').toLowerCase();
  if (ENVIRONMENTS.indexOf(env) === -1) {
    throw new Error('CANVAS_ENV_ACTIVE must be one of: ' + ENVIRONMENTS.join(', '));
  }
  return env;
}

function canvasBaseUrl_() {
  return requireProp_('CANVAS_BASE_URL_' + activeEnv_().toUpperCase()).replace(/\/+$/, '');
}

/** Used only inside CanvasApi.gs. Never log or return this to a sheet. */
function canvasToken_() {
  return requireProp_('CANVAS_API_TOKEN_' + activeEnv_().toUpperCase());
}

function isProduction_() {
  return activeEnv_() === 'production';
}

/** Safe to show a person: says whether a token is set, never what it is. */
function describeEnvironment() {
  var env = activeEnv_();
  var hasToken = !!prop_('CANVAS_API_TOKEN_' + env.toUpperCase());
  return 'Environment: ' + env.toUpperCase() +
         '\nAddress: ' + canvasBaseUrl_() +
         '\nToken configured: ' + (hasToken ? 'yes' : 'NO');
}

/** Refuse to switch to an environment that has no token. */
function switchEnvironment_(env) {
  if (ENVIRONMENTS.indexOf(env) === -1) throw new Error('Unknown environment: ' + env);
  if (!prop_('CANVAS_API_TOKEN_' + env.toUpperCase())) {
    throw new Error('No token is configured for ' + env + '. Not switching.');
  }
  PropertiesService.getScriptProperties().setProperty('CANVAS_ENV_ACTIVE', env);
}
