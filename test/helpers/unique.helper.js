// Set once per process — all test data created in a single run shares this ID
const RUN_ID = Date.now()

const pad = (n) => String(n).padStart(2, '0')

function timestamp() {
  const d = new Date()
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `-${pad(d.getHours())}${pad(d.getMinutes())}`
  )
}

/**
 * Generates a unique test email address.
 * Domain does not exist — nothing is ever delivered.
 * Clearly identifiable as test data in any database.
 *
 * @param {string} role  e.g. 'user', 'invite', 'ea', 'pso', 'rma'
 */
export function uniqueEmail(role = 'user') {
  return `test.${role}.${RUN_ID}@pafs-test.gov.uk`
}

/**
 * Generates a unique email with an auto-approved EA domain.
 * Accounts registered with this domain bypass manual admin approval.
 */
export function uniqueEaEmail() {
  return `test.ea.${RUN_ID}@environment-agency.gov.uk`
}

/**
 * Generates a unique proposal name with a readable timestamp prefix.
 * Pattern: [PREFIX]-YYYYMMDD-HHMM
 *
 * @param {string} prefix  e.g. 'TP', 'Flood-WLC', 'SMOKE'
 */
export function uniqueProposalName(prefix = 'TP') {
  return `${prefix}-${timestamp()}`
}

/**
 * Generates a unique organisation name.
 *
 * @param {string} type  e.g. 'EA', 'RMA'
 */
export function uniqueOrgName(type = 'Test') {
  return `Test Org ${type} ${RUN_ID}`
}

export { RUN_ID }
