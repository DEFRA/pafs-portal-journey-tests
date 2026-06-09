// Credentials are pulled from environment variables — these objects describe
// the shape and role of each test account only.
export const users = {
  regularUser: {
    email: process.env.TEST_USER_EMAIL,
    password: process.env.TEST_USER_PASSWORD,
    role: 'regular'
  },
  admin: {
    email: process.env.TEST_ADMIN_EMAIL,
    password: process.env.TEST_ADMIN_PASSWORD,
    role: 'admin'
  },
  // EA user with an environment-agency.gov.uk domain — auto-approved on request
  eaUser: {
    email: process.env.TEST_EA_USER_EMAIL || null,
    password: process.env.TEST_EA_USER_PASSWORD || null,
    role: 'ea',
    domain: 'environment-agency.gov.uk'
  }
}

// Auto-approved email domains — accounts created with these bypass manual approval
export const AUTO_APPROVED_DOMAINS = ['environment-agency.gov.uk']

// Responsibility types for account request journey
export const RESPONSIBILITY_TYPES = {
  EA: 'ea',
  PSO: 'pso',
  RMA: 'rma'
}
