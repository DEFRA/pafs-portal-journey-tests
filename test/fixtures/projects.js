import { readableProposalName } from 'helpers/unique.helper.js'

// Pre-existing proposal reference for update/section tests.
// Set TEST_PROJECT_REF in the environment to skip creation and use a known proposal.
export const TEST_PROJECT_REF = process.env.TEST_PROJECT_REF || null

// Default RMA for test proposals — override with TEST_RMA_NAME if your environment differs.
export const TEST_RMA_NAME = process.env.TEST_RMA_NAME || null

// Default proposal names used in each section spec.
// Each is unique per run so parallel runs don't collide.
export const proposalNames = {
  core: readableProposalName('CORE'),
  importantDates: readableProposalName('DATES'),
  riskProperties: readableProposalName('RISK'),
  fundingSources: readableProposalName('FUND'),
  envBenefits: readableProposalName('ENV'),
  nfm: readableProposalName('NFM'),
  wlc: readableProposalName('WLC'),
  wlb: readableProposalName('WLB'),
  carbon: readableProposalName('CARBON'),
  goalsConfidence: readableProposalName('GOALS'),
  overview: readableProposalName('OVW')
}

// Shared store for the reference number produced during the core creation journey.
// Spec files set this after creation; section specs read it as a fallback.
let _sharedRef = TEST_PROJECT_REF

export function getSharedRef() {
  return _sharedRef
}

export function setSharedRef(ref) {
  _sharedRef = ref
}
