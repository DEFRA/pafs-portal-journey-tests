export const COMMON = {
  SERVICE_TITLE_USER: 'Submit a flood risk management proposal',
  SERVICE_TITLE_ADMIN: 'PAFS Admin',
  PHASE_BANNER_TAG: 'BETA',
  PHASE_BANNER_TEXT: 'This is a new service.',
  ERROR_SUMMARY_HEADING: 'There is a problem',
  CONTINUE_BUTTON: 'Continue',
  BACK_LINK: 'Back',
  SIGN_OUT_LINK: 'Sign out',
  CHANGE_LINK: 'Change',
  MENU_BUTTON: 'Menu',
  MENU_BUTTON_ARIA: 'Show or hide service navigation menu',
  FOOTER: {
    PRIVACY: 'Privacy',
    COOKIES: 'Cookies',
    ACCESSIBILITY: 'Accessibility',
    PRIVACY_HREF: '/privacy-notice',
    COOKIES_HREF: '/cookies',
    ACCESSIBILITY_HREF: '/accessibility'
  },
  NAV: {
    USER: {
      YOUR_PROPOSALS: 'Your proposals',
      DOWNLOAD_ALL: 'Download all proposals',
      ARCHIVE: 'Archive'
    },
    ADMIN: {
      USERS: 'Users',
      PROJECTS: 'Projects',
      ORGANISATIONS: 'Organisations',
      DOWNLOAD_PROJECTS: 'Download projects',
      DOWNLOAD_RMA: 'Download RMA'
    }
  }
}

export const AUTH = {
  LOGIN: {
    PAGE_HEADING: 'Sign in',
    EMAIL_LABEL: 'Email address',
    PASSWORD_LABEL: 'Password',
    SUBMIT_BUTTON: 'Sign in',
    FORGOT_PASSWORD_LINK: 'I have forgotten my password',
    REQUEST_ACCOUNT_LINK: 'Request an account',
    NOTIFICATIONS: {
      SESSION_TIMEOUT: 'Your session has expired. Please sign in again to continue',
      SESSION_MISMATCH:
        'Your login credentials were used in another browser. Please sign in again',
      TOKEN_INVALID: 'The password reset link is invalid'
    },
    ERRORS: {
      EMAIL_REQUIRED: 'Enter your email address',
      EMAIL_INVALID:
        'Enter an email address in the correct format, like name@example.com',
      PASSWORD_REQUIRED: 'Enter your password',
      INVALID_CREDENTIALS: 'Your email address or password is incorrect',
      ACCOUNT_LOCKED:
        'Your account has been locked due to too many failed login attempts',
      ACCOUNT_PENDING:
        'Your account request is pending approval. You will be unable to sign in until your account request is approved',
      ACCOUNT_SETUP_INCOMPLETE:
        'Your account setup is not yet complete. Please check your email for further instructions',
      ACCOUNT_DISABLED:
        'Your account has been disabled. Contact the administrator'
    }
  },

  FORGOT_PASSWORD: {
    PAGE_HEADING: 'Reset your password',
    DESCRIPTION:
      "Enter your email address and we'll send you a link to reset your password.",
    EMAIL_LABEL: 'Email address',
    SUBMIT_BUTTON: 'Send reset link',
    BACK_LINK: 'Back to sign in',
    CONFIRMATION: {
      PANEL_TITLE: 'Password reset request',
      PANEL_BODY: "We've sent a password reset link to your email address",
      WHAT_HAPPENS_NEXT: 'What happens next',
      LINK_EXPIRY: 'The link will expire in 6 hours for security reasons.',
      IF_NO_EMAIL_HEADING: "If you don't receive the email",
      IF_NO_EMAIL_BULLETS: [
        'Check your spam or junk folder',
        'Make sure you entered the correct email address',
        'Wait a few minutes - it may take some time to arrive'
      ],
      NEED_HELP_HEADING: 'Need help?',
      NEED_HELP_CONTACT: '0370 8506 506',
      BACK_LINK: 'Back to sign in'
    }
  },

  RESET_PASSWORD: {
    PAGE_HEADING: 'Reset password',
    PASSWORD_LABEL: 'Password',
    CONFIRM_LABEL: 'Confirm password',
    SUBMIT_BUTTON: 'Reset password',
    REQUIREMENTS_INTRO: 'Your password must contain a minimum of:',
    REQUIREMENTS: [
      '8 characters',
      '1 capital letter',
      '1 lower-case letter',
      '1 numeric character',
      '1 special character, !@#$%^&*()_.+-=[]'
    ],
    SUCCESS: {
      PANEL_TITLE: 'Password reset successful',
      PANEL_BODY: 'You can now sign in with your new password',
      BACK_LINK: 'Back to sign in'
    },
    TOKEN_EXPIRED: {
      PAGE_HEADING: 'Reset password link expired',
      BODY: 'The link you used to reset your password has expired.',
      REASON: 'Password reset links are valid for 6 hours for security reasons.',
      WHAT_YOU_CAN_DO: 'What you can do',
      REQUEST_NEW_LINK_BUTTON: 'Request new reset link',
      BACK_LINK: 'Back to sign in'
    },
    ERRORS: {
      PASSWORD_REQUIRED: 'Enter your password',
      PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
      PASSWORD_TOO_LONG: 'Password must be maximum 128 characters',
      PASSWORD_UPPERCASE: 'Password must contain at least 1 capital letter',
      PASSWORD_LOWERCASE: 'Password must contain at least 1 lower-case letter',
      PASSWORD_NUMBER: 'Password must contain at least 1 numeric character',
      PASSWORD_SPECIAL: 'Password must contain at least 1 special character',
      PASSWORD_PREVIOUSLY_USED:
        'Password has been used previously. Choose a different password',
      CONFIRM_REQUIRED: 'Confirm your password',
      PASSWORDS_MISMATCH: 'Passwords do not match'
    },
    REQUIREMENTS: {
      INTRO: 'Your password must contain a minimum of:',
      ITEMS: [
        '8 characters',
        '1 capital letter',
        '1 lower-case letter',
        '1 numeric character',
        '1 special character, !@#$%^&*()_.+-=[]'
      ],
      COUNT: 5
    }
  },

  SET_PASSWORD: {
    PAGE_HEADING: 'Set your password',
    PASSWORD_LABEL: 'Password',
    CONFIRM_LABEL: 'Confirm password',
    SUBMIT_BUTTON: 'Set password',
    REQUIREMENTS_INTRO: 'Your password must contain a minimum of:',
    LINK_EXPIRED: {
      PAGE_HEADING: 'Set password link expired',
      BODY: 'The link you used to set your password has expired.',
      REASON: 'Set password links are valid for 30 days for security reasons.',
      WHAT_YOU_CAN_DO: 'What you can do',
      CONTACT_MESSAGE:
        'Contact the PAFS support team to request a new link to set your password.',
      BACK_LINK: 'Back to sign in'
    },
    ERRORS: {
      PASSWORD_REQUIRED: 'Enter your password',
      PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
      CONFIRM_REQUIRED: 'Confirm your password',
      PASSWORDS_MISMATCH: 'Passwords do not match'
    }
  }
}

export const ACCOUNT = {
  REQUEST_ACCOUNT: {
    START: {
      PAGE_HEADING: 'Request an account',
      INTRO:
        'You can request an account if you work for a Risk Management Authority or an Environment Agency team.',
      BEFORE_YOU_START: 'Before you start',
      CHECKLIST: [
        'your name and contact details',
        'your organisation and job title',
        'your area of responsibility'
      ],
      REVIEW_NOTICE:
        'Your account request will be reviewed and you will be notified by email once it has been approved.',
      START_BUTTON: 'Start now',
      BACK_LINK: 'Back to sign in'
    },
    DETAILS: {
      PAGE_HEADING: 'Request an account',
      FIRST_NAME_LABEL: 'First name',
      LAST_NAME_LABEL: 'Last name',
      EMAIL_LABEL: 'Email address',
      TELEPHONE_LABEL: 'Telephone number',
      ORGANISATION_LABEL: 'Organisation',
      JOB_TITLE_LABEL: 'Job title',
      RESPONSIBILITY_LEGEND: 'What is your responsibility?',
      RESPONSIBILITY_OPTIONS: {
        EA: {
          LABEL: 'Environment Agency – Area Programme Team',
          HINT: 'Allows you to view all records created within the boundary of your Area.'
        },
        PSO: {
          LABEL: 'Environment Agency – Partnership & Strategic Overview Team',
          HINT: 'Allows you to view and edit all records created within the boundary of your Team'
        },
        RMA: {
          LABEL: 'Risk Management Authority (RMA)',
          HINT: 'Allows you to create, edit, and view all records created within the boundary of your RMA.'
        }
      },
      SUBMIT_BUTTON: 'Continue',
      ERRORS: {
        FIRST_NAME_REQUIRED: 'Tell us your first name',
        LAST_NAME_REQUIRED: 'Tell us your last name',
        EMAIL_REQUIRED: 'Enter your email address',
        EMAIL_INVALID:
          'Enter an email address in the correct format, like name@example.com',
        EMAIL_DISPOSABLE: 'Enter a valid email address, this domain is not allowed',
        EMAIL_DUPLICATE: 'An account with this email address already exists',
        TELEPHONE_REQUIRED: 'Enter your telephone number',
        TELEPHONE_INVALID:
          'Enter a telephone number in the correct format, like 01234 567890 or +44 1234 567890',
        TELEPHONE_TOO_LONG: 'Telephone number must be 255 characters or less',
        ORGANISATION_REQUIRED: 'Enter your organisation',
        JOB_TITLE_REQUIRED: 'Enter your job title',
        RESPONSIBILITY_REQUIRED: 'Select your area of responsibility',
        MAIN_AREA_REQUIRED: 'Select your main'
      }
    },
    CHECK_ANSWERS: {
      PAGE_HEADING: 'Check your details',
      PERSONAL_DETAILS_HEADING: 'Personal details',
      AREA_SELECTION_HEADING: 'Area selection',
      SUBMIT_BUTTON: 'Confirm and send',
      CONFIRMATION_TEXT:
        'By submitting this request you are confirming that, to the best of your knowledge, the details you are providing are correct.'
    },
    AREA: {
      MAIN: {
        HINT: 'This will be your primary area',
        DEFAULT_OPTION: 'Select an area'
      },
      ADDITIONAL: {
        INTRO: 'Select any additional'
      },
      PARENT: {
        EA_HEADING: 'Select EA Areas',
        PSO_HEADING: 'Select PSO Teams'
      }
    },
    CHECK_ANSWERS: {
      PAGE_HEADING: 'Check your details',
      PERSONAL_DETAILS_HEADING: 'Personal details',
      AREA_SELECTION_HEADING: 'Area selection',
      SUBMIT_BUTTON: 'Confirm and send',
      CONFIRMATION_TEXT:
        'By submitting this request you are confirming that, to the best of your knowledge, the details you are providing are correct.'
    },
    CONFIRMATION: {
      PANEL_TITLE: 'Request submitted',
      PANEL_BODY: 'Your account request is being reviewed',
      WHAT_HAPPENS_NEXT: 'What happens next',
      APPROVAL_INSET: 'Account approval usually takes 1-2 working days',
      CHECKLIST: [
        'Wait for the approval email from the administrator',
        'Check your spam folder if you do not receive an email within 2 working days',
        'Once approved, use the link in the email to set your password',
        'Sign in to the service'
      ],
      RETURN_LINK: 'Return to sign in'
    }
  }
}

export const AREA = {
  MAIN: {
    HINT_SELF_SERVICE: 'This will be your primary area',
    HINT_ADMIN: "This will be the user's primary area",
    DEFAULT_OPTION: 'Select an area'
  },
  EA: {
    HEADING_SELF_SERVICE: 'Select your main EA Area',
    HEADING_ADMIN: "Select the user's main EA Area"
  },
  PSO: {
    HEADING_SELF_SERVICE: 'Select your main PSO Team',
    HEADING_ADMIN: "Select the user's main PSO Team"
  },
  RMA: {
    HEADING_SELF_SERVICE: 'Select your main RMA Area',
    HEADING_ADMIN: "Select the user's main RMA Area"
  },
  ADDITIONAL: {
    INTRO: 'Select any additional',
    OPTIONAL_NOTE: 'optional'
  }
}

export const ADMIN = {
  JOURNEY_SELECTION: {
    PAGE_HEADING: 'Which journey would you like to access?',
    CONTEXT_HINT:
      'As an administrator, you can explore both the general user journey and the admin journey.',
    OPTIONS: {
      ADMIN: {
        LABEL: 'Admin journey',
        HINT: 'Explore the admin portal for managing users, proposals, and organisations'
      },
      USER: {
        LABEL: 'General user journey',
        HINT: 'Explore the user portal as an RMA, PSO or Area user'
      }
    },
    CONTINUE_BUTTON: 'Continue'
  },

  ADD_USER: {
    START: {
      PAGE_HEADING: 'Add new user',
      INTRO: 'You will create a new user account. The user will receive an email notification once their account is created.',
      BEFORE_YOU_START: 'Before you start',
      NEED_TO_PROVIDE: 'You will need to provide:',
      CHECKLIST: [
        "the user's name and email address",
        'whether they will be an administrator',
        'their area of responsibility (if not an administrator)'
      ],
      START_BUTTON: 'Start now'
    },
    IS_ADMIN: {
      PAGE_HEADING: 'Will the user be an administrator?',
      RADIO_YES: 'Yes',
      RADIO_NO: 'No',
      CONTINUE_BUTTON: 'Continue',
      ERRORS: {
        REQUIRED: 'Select whether the user will be an administrator'
      }
    },
    DETAILS: {
      HEADINGS: {
        ADD_ADMIN: 'Add new administrator',
        ADD_USER: 'Add new user',
        EDIT_ADMIN: 'Edit administrator details',
        EDIT_USER: 'Edit user details'
      },
      // Note: admin-adding-user wording differs from self-service request account
      FIRST_NAME_LABEL: 'First name',
      LAST_NAME_LABEL: 'Last name',
      EMAIL_LABEL: 'Email address',
      TELEPHONE_LABEL: 'Telephone number',
      ORGANISATION_LABEL: 'Organisation',
      JOB_TITLE_LABEL: 'Job title',
      RESPONSIBILITY_LEGEND: "What is the user's responsibility?",
      RESPONSIBILITY_OPTIONS: {
        EA: {
          LABEL: 'Environment Agency – Area Programme Team',
          HINT: 'Allows you to view all records created within the boundary of your Area.'
        },
        PSO: {
          LABEL: 'Environment Agency – Partnership & Strategic Overview Team',
          HINT: 'Allows you to view and edit all records created within the boundary of your Team'
        },
        RMA: {
          LABEL: 'Risk Management Authority (RMA)',
          HINT: 'Allows you to create, edit, and view all records created within the boundary of your RMA.'
        }
      },
      ERRORS: {
        FIRST_NAME_REQUIRED: "Enter the user's first name",
        LAST_NAME_REQUIRED: "Enter the user's last name",
        EMAIL_REQUIRED: "Enter the user's email address",
        EMAIL_INVALID:
          'Enter a valid email address in the correct format, like name@example.com',
        EMAIL_DUPLICATE: 'An account with this email address already exists',
        RESPONSIBILITY_REQUIRED: "Select the user's area of responsibility"
      }
    },
    AREA: {
      MAIN_AREA_HINT: "This will be the user's primary area",
      ADDITIONAL_INTRO: 'Select any additional',
      ERRORS: {
        EA_AREA_REQUIRED: 'Select at least one EA Area for the user',
        PSO_AREA_REQUIRED: 'Select at least one PSO Team for the user',
        MAIN_AREA_REQUIRED: "Select the user's main"
      }
    },
    CHECK_ANSWERS: {
      PAGE_HEADING: 'Check user details',
      EDIT_PAGE_HEADING: 'Review changes',
      PERSONAL_DETAILS_CARD: 'Personal details',
      ADDITIONAL_INFO_CARD: 'Additional information',
      AREA_SELECTION_CARD: 'Area selection',
      WILL_BE_ADMIN_LABEL: 'Will be an administrator',
      SUBMIT_BUTTON: 'Confirm and add user',
      EDIT_SUBMIT_BUTTON: 'Confirm and update user',
      CHANGE_LINK: 'Change'
    },
    CONFIRMATION: {
      WHAT_HAPPENS_NEXT: 'What happens next'
    }
  },

  VIEW_USER: {
    PERSONAL_DETAILS_CARD: 'Personal details',
    PERMISSIONS_CARD: 'Permissions',
    ACCOUNT_INFO_CARD: 'Account information',
    IS_ADMIN_LABEL: 'Is admin?',
    IS_ADMIN_YES: 'Yes',
    IS_ADMIN_NO: 'No',
    NOT_PROVIDED: 'Not provided',
    INVITATION_SENT_LABEL: 'Invitation sent',
    LAST_SIGN_IN_LABEL: 'Last sign in',
    LAST_SIGN_IN_NEVER: 'Never',
    ACTIONS: {
      APPROVE_USER: 'Approve user',
      DELETE_USER: 'Delete user',
      RESEND_INVITATION: 'Resend invitation',
      REACTIVATE_ACCOUNT: 'Reactivate account'
    },
    NOTIFICATIONS: {
      UPDATED: 'The account has been updated for',
      INVITATION_RESENT: 'A new invitation email has been sent to the user.'
    }
  },

  USERS: {
    PAGE_HEADING: 'Manage users',

    TABS: {
      PENDING: 'Pending',
      ACTIVE: 'Active'
    },
    TABS_ARIA_LABEL: 'User account categories',

    // ── Filter form ─────────────────────────────────────────────────────────
    FILTER: {
      FORM_ARIA_LABEL: 'Filter users',
      SEARCH_LABEL: 'Search by name or email',
      SEARCH_HINT: 'Enter a name or email address to search for users',
      AREA_LABEL: 'Filter by area',
      AREA_DEFAULT_OPTION: 'All areas',
      FILTER_BUTTON: 'Filter',
      CLEAR_FILTERS: 'Clear filters'
    },

    // ── Active users table ───────────────────────────────────────────────────
    ACTIVE_TABLE: {
      CAPTION: 'List of active user accounts',
      HEADERS: ['Name', 'Email', 'Area', 'Admin', 'Last sign in'],
      COLUMN_COUNT: 6 // includes the Actions column
    },

    // ── Pending users table ──────────────────────────────────────────────────
    PENDING_TABLE: {
      CAPTION: 'List of pending user account requests',
      HEADERS: ['Name', 'Email', 'Area', 'Requested'],
      COLUMN_COUNT: 5 // includes the Actions column
    },

    // ── Action links in table rows ───────────────────────────────────────────
    ROW_ACTIONS: {
      VIEW: 'View'
    },

    // ── Bottom page actions ──────────────────────────────────────────────────
    ACTIONS: {
      ADD_USER: 'Add new user',
      DOWNLOAD_USERS: 'Download all users'
    },

    // ── Pagination ───────────────────────────────────────────────────────────
    PAGINATION: {
      ARIA_LABEL: 'Results pagination',
      SHOWING_TEXT: 'Showing',
      PREVIOUS: 'Previous',
      NEXT: 'Next'
    },

    // ── Empty states ─────────────────────────────────────────────────────────
    EMPTY: {
      PENDING: 'No pending user requests',
      ACTIVE: 'No active users found'
    },

    // ── Suspended / inactive users ───────────────────────────────────────────
    // Suspended users appear in the Active tab with a status badge.
    // There is no separate inactive tab — disabled accounts are flagged inline.
    SUSPENDED: {
      STATUS_LABEL: 'Account Status',
      STATUS_VALUE: 'Suspended',
      REACTIVATE_LINK: 'Reactivate account'
    },

    // ── Success notifications ────────────────────────────────────────────────
    NOTIFICATIONS: {
      USER_ADDED: 'User has been added successfully',
      INVITATION_SENT: 'An invitation email has been sent',
      INVITATION_RESENT: 'A new invitation email has been sent to the user.',
      ACCOUNT_REACTIVATED: 'The account has been reactivated',
      USER_DELETED: 'User deleted'
    }
  }
}

export const GENERAL = {
  HOME: {
    PAGE_HEADING: 'Your Proposals',
    CREATE_BUTTON: 'Create a new proposal',
    SEARCH_LABEL: 'Enter a project number or name',
    SEARCH_HINT: 'Enter a project number or name to search for proposals',
    FILTER_BUTTON: 'Filter',
    CLEAR_FILTERS: 'Clear filters'
  }
}

export const PROJECTS = {
  START: {
    PAGE_HEADING: 'Start a new proposal',
    INTRO: 'Use this service to create a new funding proposal for a flood or coastal erosion risk management project.',
    BEFORE_YOU_START: 'Before you start',
    START_BUTTON: 'Start now'
  },

  NAME: {
    PAGE_HEADING: "What is the project's name?",
    LABEL: 'Project name',
    HINT: 'The project name should be meaningful and understandable and should not include abbreviations. For example, South Chesham River Colne Flood Alleviation Scheme or Clacton-on-Sea Coastal Erosion Project Phase 4.',
    ERRORS: {
      REQUIRED: 'Enter a project name',
      INVALID_FORMAT: 'The project name must only contain letters, spaces, underscores, hyphens and numbers',
      TOO_LONG: 'Please enter no more than 200 characters',
      ALREADY_EXISTS: 'The project name already exists. Your project must have a unique name.'
    }
  },

  AREA_SELECTION: {
    PAGE_HEADING: 'Which risk management authority is leading the proposal?',
    SELECT_PLACEHOLDER: 'Select a Risk Management Authority',
    ERRORS: {
      REQUIRED: 'Select a lead risk management authority'
    }
  },

  TYPE: {
    PAGE_HEADING: 'Which project type are you proposing?',
    OPTIONS: {
      DEF: 'Defence (DEF):',
      REP: 'Asset Replacement (REP):',
      REF: 'Asset Refurbishment (REF):',
      HCR: 'Habitat Compensation and Restoration (HCR):',
      STR: 'Strategy (STR):',
      STU: 'Study (STU):',
      ELO: 'Environmental Legal Obligation (ELO):'
    },
    ERRORS: {
      REQUIRED: 'Select a project type'
    }
  },

  INTERVENTION_TYPE: {
    PAGE_HEADING: 'Which of these interventions feature in your proposed project?',
    HINT: 'Tick all that feature in your proposed project',
    OPTIONS: {
      NFM: 'Natural flood management measures',
      SUDS: 'Sustainable drainage systems',
      PFR: 'Property flood resilience',
      OTHER: 'Something else'
    },
    ERRORS: {
      REQUIRED: 'Select at least one intervention feature'
    }
  },

  PRIMARY_INTERVENTION_TYPE: {
    PAGE_HEADING: 'Which of the interventions will provide the most benefit to properties?',
    ERRORS: {
      REQUIRED: 'Select which intervention will provide the most benefit'
    }
  },

  FINANCIAL_YEAR_START: {
    PAGE_HEADING: 'In what financial year will the project first require funding?',
    ERRORS: {
      REQUIRED: 'Select the financial year when the project first requires funding',
      INVALID_FORMAT: 'Enter a financial year in the correct format',
      INVALID_RANGE: 'Your first financial year should be less than or equal to your last financial year'
    }
  },

  FINANCIAL_YEAR_START_MANUAL: {
    PAGE_HEADING: 'In what financial year will the project first require funding?',
    LABEL: 'Financial year starting April',
    HINT: 'For example, 2033',
    ERRORS: {
      REQUIRED: 'Enter a financial year',
      INVALID_FORMAT: 'Enter a financial year in the correct format',
      OUT_OF_RANGE: 'Enter a financial year less than or equal to 2100',
      SHOULD_BE_FUTURE: 'Enter a financial year that is the current year or later',
      INVALID_RANGE: 'Your first financial year should be less than or equal to your last financial year'
    }
  },

  FINANCIAL_YEAR_END: {
    PAGE_HEADING: 'In what financial year will the project stop spending funds?',
    HINT: "Don't include years which include maintenance costs.",
    ERRORS: {
      REQUIRED: 'Select the financial year when the project stops spending funds',
      INVALID_RANGE: 'Your last financial year should be greater than or equal to your first financial year'
    }
  },

  FINANCIAL_YEAR_END_MANUAL: {
    PAGE_HEADING: 'In what financial year will the project stop spending funds?',
    LABEL: 'Financial year starting April',
    HINT: "Don't include years which include maintenance costs.",
    INPUT_HINT: 'For example, 2033',
    ERRORS: {
      REQUIRED: 'Enter a financial year',
      INVALID_FORMAT: 'Enter a financial year in the correct format',
      OUT_OF_RANGE: 'Enter a financial year less than or equal to 2100',
      SHOULD_BE_FUTURE: 'Enter a financial year that is the current year or later',
      INVALID_RANGE: 'Your last financial year should be greater than or equal to your first financial year'
    }
  },

  FINANCIAL_YEAR_WARNING: {
    HEADING: 'You have changed the project date range'
  },

  IMPORTANT_DATES: {
    OBC_START: {
      PAGE_HEADING: "When do you expect to start the project's outline business case?"
    },
    OBC_COMPLETE: {
      PAGE_HEADING: "When do you expect to complete the project's outline business case?"
    },
    AWARD_CONTRACT: {
      PAGE_HEADING: "When do you expect to award the project's main contract?"
    },
    START_WORK: {
      PAGE_HEADING: 'When do you expect to start the work?',
      HINT: 'This could be construction or creating a strategy.'
    },
    START_BENEFITS: {
      PAGE_HEADING: 'When do you expect the project to start achieving its benefits?',
      HINT: 'This may occur when properties begin to benefit or when new habitats are created.'
    },
    COULD_START_EARLIER: {
      PAGE_HEADING: 'Could the project start sooner if funding was made available earlier?',
      HINT: 'Without impacting deliverability or outcomes'
    },
    EARLIEST_DATE: {
      PAGE_HEADING: 'What is the earliest date the project could start if funding was made available earlier?'
    },
    MONTH_LABEL: 'Month',
    YEAR_LABEL: 'Year',
    DATE_HINT: 'For example, 3 2025',
    ERRORS: {
      COULD_START_EARLIER_REQUIRED: 'Tell us if the project can start earlier',
      EARLIEST_DATE_REQUIRED: 'Tell us the earliest date the project can start',
      EARLIEST_DATE_INVALID: 'Enter a valid earliest date the project can start',
      EARLIEST_DATE_IN_PAST: 'You cannot enter a date in the past for the earliest date the project can start'
    }
  },

  BENEFIT_AREA: {
    PAGE_HEADING: 'What area is the project likely to benefit?',
    INTRODUCTION: 'Upload a shapefile. The shapefile should show the approximate area the project is likely to benefit. Draw as many separate areas as necessary, but make sure they don\'t overlap.',
    LABEL: 'Upload shapefile',
    HINT: 'Your shapefile files should be in a single compressed folder or zipfile (.zip) to upload successfully',
    DELETE: {
      PAGE_HEADING: 'Are you sure you want to delete this shapefile?',
      WARNING: 'This will permanently delete the shapefile from the system.',
      DELETE_BUTTON: 'Yes, delete this file'
    }
  },

  RISK_AND_PROPERTIES: {
    RISK: {
      PAGE_HEADING: 'Select which risks your project protects against',
      OPTIONS: {
        FLUVIAL: 'Fluvial flooding (river flooding)',
        TIDAL: 'Tidal flooding',
        GROUNDWATER: 'Groundwater flooding',
        SURFACE_WATER: 'Surface water flooding',
        SEA: 'Sea flooding',
        RESERVOIR: 'Reservoir flooding',
        COASTAL_EROSION: 'Coastal erosion'
      },
      ERRORS: {
        REQUIRED: 'Please select at least one risk'
      }
    },
    MAIN_RISK: {
      PAGE_HEADING: 'What is the main risk your proposed project will protect against?',
      ERRORS: {
        REQUIRED: 'Please select the main source of risk'
      }
    },
    PROPERTIES_FLOODING: {
      PAGE_HEADING: 'How many properties affected by flooding is the project likely to benefit',
      DESCRIPTION: 'These are properties that are at risk today',
      NO_PROPERTIES_CHECKBOX: 'My project does not benefit any properties at risk of flooding',
      TABLE_HEADERS: {
        MAINTAINING: 'Maintaining flood protection',
        REDUCING_50: 'Reducing flood risk (50% or more)',
        REDUCING_LESS_50: 'Reducing flood risk (less than 50%)',
        INCREASING_RESILIENCE: 'Increasing flood resilience'
      },
      ERRORS: {
        INVALID: 'Please enter a whole number up to 18 digits (0 allowed)'
      }
    },
    PROPERTIES_COASTAL: {
      PAGE_HEADING: 'How many properties affected by coastal erosion is the project likely to benefit',
      DESCRIPTION: 'These are properties that are at risk today.',
      NO_PROPERTIES_CHECKBOX: 'My project does not benefit any properties at risk of coastal erosion',
      TABLE_HEADERS: {
        MAINTAINING: 'Maintaining coastal erosion protection',
        REDUCING: 'Reducing coastal erosion risk'
      },
      ERRORS: {
        INVALID: 'Please enter a whole number up to 18 digits (0 allowed)'
      }
    },
    TWENTY_PERCENT_DEPRIVED: {
      PAGE_HEADING: 'What is the percentage of total properties benefitting in the 20% most deprived areas?',
      HINT: 'Enter a whole number from 0 to 100',
      ERRORS: {
        REQUIRED: 'Enter the percentage of properties benefitting in the 20% most deprived areas',
        INVALID: 'Please enter a whole number from 0 to 100.'
      }
    },
    FORTY_PERCENT_DEPRIVED: {
      PAGE_HEADING: 'What is the percentage of total properties benefitting in the 40% most deprived areas?',
      HINT: 'Enter a whole number from 0 to 100',
      ERRORS: {
        REQUIRED: 'Enter the percentage of properties benefitting in the 40% most deprived areas',
        INVALID: 'Please enter a whole number from 0 to 100.'
      }
    },
    FLUVIAL_RISK: {
      PAGE_HEADING: 'What is the current flood risk (fluvial and tidal) in the area the project is likely to benefit?',
      HINT: 'Select the risk category which affects most properties in the benefit area.',
      OPTIONS: {
        HIGH: 'High risk - this means that each year an area has a chance of flooding of greater than 3.3% (greater than a 1 in 30 chance of flooding)',
        MEDIUM: 'Medium risk - this means that each year an area has a chance of flooding between 3.3% and 1% (1 in 30 to a 1 in 100 chance of flooding)',
        LOW: 'Low risk - this means that each year an area has a chance of flooding of between 1% and 0.1% (1 in 100 to a 1 in 1,000 chance of flooding)',
        VERY_LOW: 'Very low risk - this means that each year an area has a chance of flooding of less than 0.1% (less than a 1 in 1,000 chance of flooding)'
      },
      ERRORS: {
        REQUIRED: 'Select a flood risk level'
      }
    },
    SURFACE_WATER_RISK: {
      PAGE_HEADING: 'What is the current flood risk (surface water) in the area the project is likely to benefit?',
      HINT: 'Select the risk category which affects most properties in the benefit area.',
      ERRORS: {
        REQUIRED: 'Select a surface water flood risk level'
      }
    },
    COASTAL_EROSION_RISK: {
      PAGE_HEADING: 'What is the current coastal erosion risk in the area the project is likely to benefit?',
      HINT: 'Select the coastal erosion risk category which affects most properties in the benefit area.',
      OPTIONS: {
        MEDIUM_TERM: 'Medium term risk: Up to the year 2055 in a no future intervention scenario',
        LONGER_TERM: 'Longer term risk: Up to the year 2105 in a no future intervention scenario'
      },
      ERRORS: {
        REQUIRED: 'Select a coastal erosion risk level'
      }
    }
  },

  FUNDING_SOURCES: {
    SELECTION: {
      PAGE_HEADING: 'What are the expected funding sources?',
      HINT: 'Select all that apply',
      OPTIONS: {
        GIA: 'Grant in aid',
        LOCAL_LEVY: 'Local levy',
        ADDITIONAL_GIA: 'Additional Grant in Aid',
        PUBLIC: 'Public sector contributions',
        PRIVATE: 'Private sector contributions',
        OTHER_EA: 'Contributions from other Environment Agency functions or sources',
        NOT_YET_IDENTIFIED: 'Funding sources not yet identified'
      },
      ERRORS: {
        REQUIRED: 'The project must have at least one funding source.'
      }
    },
    ADDITIONAL_GIA: {
      PAGE_HEADING: 'What are the expected additional Grant in Aid funding sources?',
      HINT: 'Select all that apply. Applicable for projects on the 2020 (or earlier) funding policy only.',
      OPTIONS: {
        ASSET_REPLACEMENT: 'Asset replacement allowance',
        ENV_STATUTORY: 'Environment statutory funding',
        FREQUENTLY_FLOODED: 'Frequently flooded communities',
        OTHER_ADDITIONAL: 'Other additional Grant in Aid',
        OTHER_GOVT: 'Other Government department',
        RECOVERY: 'Recovery',
        SUMMER_ECONOMIC: 'Summer economic fund'
      },
      ERRORS: {
        REQUIRED: 'The project must have at least one additional FCRM Grant in aid funding source.'
      }
    },
    PUBLIC_CONTRIBUTORS: {
      PAGE_HEADING: 'Who are the expected public sector contributors?'
    },
    PRIVATE_CONTRIBUTORS: {
      PAGE_HEADING: 'Who are the expected private sector contributors?',
      HINT: 'For example, a local business such as Llanmoor Development Company.'
    },
    OTHER_EA_CONTRIBUTORS: {
      PAGE_HEADING: 'Who are the expected contributors from Environment agency?',
      HINT: 'These are Environment Agency functions or funding streams. For example, Water Framework Directive or Water Resources.'
    },
    CONTRIBUTOR_ERRORS: {
      REQUIRED: 'Please add at least one contributor',
      INVALID: 'The contributor name must only contain valid characters',
      DUPLICATE: 'Please add each contributor only once',
      TOO_LONG: 'Please enter no more than 200 characters'
    },
    ADD_CONTRIBUTOR_BUTTON: 'Add another contributor',
    ESTIMATED_SPEND: {
      PAGE_HEADING: 'What is the estimated spend for each financial year?',
      HINT: 'Spending estimates should be in pounds (for example £50,000) and estimated at current prices. Future maintenance costs are not required.',
      ERRORS: {
        REQUIRED: 'Each funding source must have an estimated spend for at least one financial year.',
        INVALID: 'Please enter a whole number up to 18 digits (0 allowed)'
      }
    }
  },

  NFM: {
    INCLUSION: {
      PAGE_HEADING: 'Does the project include any Natural Flood Management measures?',
      ERRORS: {
        REQUIRED: 'You must select yes or no'
      }
    },
    SELECTED_MEASURES: {
      PAGE_HEADING: 'Which natural flood management measures are in your project?',
      HINT: 'Select all that apply',
      OPTIONS: {
        RIVER_RESTORATION: 'River and floodplain restoration',
        LEAKY_BARRIERS: 'Leaky barriers and in-channel storage',
        OFFLINE_STORAGE: 'Offline storage areas',
        WOODLAND: 'Woodland',
        HEADWATER_DRAINAGE: 'Headwater drainage management',
        RUNOFF_MANAGEMENT: 'Runoff attenuation or management',
        SALTMARSH: 'Saltmarsh or mudflat management',
        SAND_DUNE: 'Sand dune management'
      },
      ERRORS: {
        REQUIRED: 'Select at least one natural flood management measure'
      }
    },
    RIVER_RESTORATION: {
      PAGE_HEADING: 'Details of new river and floodplain restoration',
      AREA_LABEL: 'Area',
      VOLUME_LABEL: 'Design storage volume',
      VOLUME_HINT: 'If known',
      ERRORS: {
        AREA_REQUIRED: 'Enter the area in hectares',
        AREA_INVALID: 'Area must be a number greater than 0'
      }
    },
    LEAKY_BARRIERS: {
      PAGE_HEADING: 'Details of Leaky barriers and in-channel storage',
      VOLUME_LABEL: 'Design storage volume',
      VOLUME_HINT: 'If known',
      LENGTH_LABEL: 'Length',
      WIDTH_LABEL: 'Typical width',
      ERRORS: {
        LENGTH_REQUIRED: 'Enter the length in km',
        WIDTH_REQUIRED: 'Enter the breadth in m'
      }
    },
    LAND_USE_CHANGE: {
      PAGE_HEADING: 'Tell us which land uses are within your project area. Include existing land uses and new land uses',
      HINT: 'Select all that apply',
      OPTIONS: {
        ENCLOSED_ARABLE: 'Enclosed arable farmland',
        ENCLOSED_LIVESTOCK: 'Enclosed livestock farmland',
        ENCLOSED_DAIRYING: 'Enclosed dairying farmland',
        SEMI_NATURAL_GRASSLAND: 'Semi-natural grassland',
        WOODLAND: 'Woodland',
        MOUNTAIN_MOORS: 'Mountain moors and heath',
        PEATLAND: 'Peatland restoration',
        RIVERS_WETLANDS: 'Rivers, wetlands, and freshwater habitats',
        COASTAL_MARGINS: 'Coastal margins'
      },
      ERRORS: {
        REQUIRED: 'Select at least one land type'
      }
    },
    LANDOWNER_CONSENT: {
      PAGE_HEADING: 'Have you secured consent from the relevant landowners?',
      OPTIONS: {
        FULLY_SECURED: 'Consent fully secured',
        ENGAGED: 'Engaged but not fully secured',
        INITIAL_CONTACT: 'Initial contact made',
        NOT_ENGAGED: 'Not yet engaged'
      },
      ERRORS: {
        REQUIRED: 'Please select whether you have secured consent from the relevant landowners.'
      }
    },
    EXPERIENCE: {
      PAGE_HEADING: "What is the project team's experience of implementing natural flood management measures?",
      HINT: 'The combined experience of the project team, including both consultants and contractors.',
      OPTIONS: {
        NO_EXPERIENCE: 'No experience: not completed natural flood management measures before but have relevant land or environmental project experience',
        SOME_EXPERIENCE: 'Some experience: completed or supported one or two small natural flood management measures',
        MODERATE: 'Moderate experience: completed several natural flood management measures across one or more sites, and worked with landowners, contractors, and regulators',
        EXTENSIVE: 'Extensive experience: led multiple natural flood management measure projects across a catchment or coastal area, and have a strong record of partnership working'
      },
      ERRORS: {
        REQUIRED: 'Please select your experience of completing natural flood management measures.'
      }
    },
    PROJECT_READINESS: {
      PAGE_HEADING: 'How developed is your proposal?',
      OPTIONS: {
        EARLY_CONCEPT: 'Early concept: ideas identified but designs are at scoping stage and a team is not yet formed or roles are unclear',
        DEVELOPING: 'Developing proposal: outline designs are drafted, a core team has been identified with some relevant skills, and initial partner engagement is underway',
        WELL_DEVELOPED: 'Well-developed proposal: detailed designs are ready, team roles have been defined and capacity assessed, and partnerships have been agreed in principle',
        READY: 'Ready to deliver: detailed designs are ready, an experienced team is ready, and partners are confirmed and have clear responsibilities'
      },
      ERRORS: {
        REQUIRED: 'Please select how developed your proposal is.'
      }
    }
  },

  ENVIRONMENTAL_BENEFITS: {
    GATE: {
      PAGE_HEADING: 'Does the project include any environmental benefits?',
      ERRORS: {
        REQUIRED: 'You must select yes or no'
      }
    },
    INTERTIDAL: {
      PAGE_HEADING: 'Will the project create or enhance an intertidal wetland habitat?',
      HINT: 'Intertidal wetland habitats are found between the high and low tide marks. The habitats most associated with FCERM works are salt marshes and mud flats.',
      HECTARES_HEADING: 'How many hectares of intertidal wetland habitat will the project create or enhance?',
      SUFFIX: 'ha'
    },
    WOODLAND: {
      PAGE_HEADING: 'Will the project create or enhance a woodland habitat?',
      HECTARES_HEADING: 'How many hectares of woodland habitat will the project create or enhance?',
      SUFFIX: 'ha'
    },
    WET_WOODLAND: {
      PAGE_HEADING: 'Will the project create or enhance a wet woodlands habitat?',
      HECTARES_HEADING: 'How many hectares of wet woodlands habitat will the project create or enhance?',
      SUFFIX: 'ha'
    },
    WETLAND: {
      PAGE_HEADING: 'Will the project create or enhance a wetland or wet grassland habitat?',
      HECTARES_HEADING: 'How many hectares of wetland or wet grassland habitat will the project create or enhance?',
      SUFFIX: 'ha'
    },
    GRASSLAND: {
      PAGE_HEADING: 'Will the project create or enhance a grassland habitat?',
      HECTARES_HEADING: 'How many hectares of grassland habitat will the project create or enhance?',
      SUFFIX: 'ha'
    },
    HEATHLAND: {
      PAGE_HEADING: 'Will the project create or enhance a heathland habitat?',
      HECTARES_HEADING: 'How many hectares of heathland habitat will the project create or enhance?',
      SUFFIX: 'ha'
    },
    PONDS_LAKES: {
      PAGE_HEADING: 'Will the project create or enhance a pond and/or lake habitat?',
      HECTARES_HEADING: 'How many hectares of pond and/or lake habitat will the project create or enhance?',
      SUFFIX: 'ha'
    },
    ARABLE_LAND: {
      PAGE_HEADING: 'Will the project create or enhance an arable land habitat?',
      HECTARES_HEADING: 'How many hectares of arable land habitat will the project create or enhance?',
      SUFFIX: 'ha'
    },
    COMPREHENSIVE_RESTORATION: {
      PAGE_HEADING: 'Will the project include comprehensive restoration or creation of natural processes, habitats and/or removal of physical modifications?',
      KM_HEADING: 'How many kilometres of comprehensive river restoration will be enhanced or created?',
      SUFFIX: 'km'
    },
    PARTIAL_RESTORATION: {
      PAGE_HEADING: 'Will the project include partial restoration of natural processes, habitats and/or partial removal of physical modifications?',
      KM_HEADING: 'How many kilometres of partial restoration will be enhanced or created?',
      SUFFIX: 'km'
    },
    SINGLE_WATERCOURSE: {
      PAGE_HEADING: 'Will the project enhance or create a single major physical or habitat of watercourse?',
      KM_HEADING: 'How many kilometres of single major physical improvement the project will be enhanced or created?',
      SUFFIX: 'km'
    },
    YES_NO_ERRORS: {
      REQUIRED: 'You must select yes or no'
    },
    QUANTITY_ERRORS: {
      INVALID: 'Please enter a number with up to 16 digits before the decimal and no more than 2 digits after the decimal. (0 allowed)'
    }
  },

  WHOLE_LIFE_COST: {
    PAGE_HEADING: 'What are the estimated costs of your project?',
    HINT: 'Please enter a whole-number amount in pounds sterling (e.g. 1500)',
    TABLE_HEADERS: {
      APPRAISAL: 'What are the estimated whole life present value costs for appraisal?',
      DESIGN_CONSTRUCTION: 'What are the estimated whole life present value costs for design and construction?',
      RISK_CONTINGENCY: 'What are the estimated whole life present value costs for risk contingency?',
      FUTURE_COSTS: 'What are the estimated whole life present value costs for future costs?'
    },
    ERRORS: {
      REQUIRED: 'Please enter a whole number up to 18 digits (0 allowed)',
      INVALID: 'Please enter a whole number up to 18 digits (0 allowed)'
    }
  },

  WHOLE_LIFE_BENEFITS: {
    PAGE_HEADING: 'What are the estimated whole life benefits of your project?',
    HINT: 'Please enter a whole-number amount in pounds sterling (e.g. 1500)',
    TABLE_HEADERS: {
      WHOLE_LIFE: 'What are the estimated whole life present value benefits?',
      PROPERTY_DAMAGES: 'What are the estimated property damages avoided (if known)?',
      ENVIRONMENTAL: 'What are the estimated environmental benefits (if known)?',
      RECREATION: 'What are the estimated recreation and tourism benefits (if known)?',
      LAND_VALUE: 'What are the estimated land value uplift and regeneration benefits (if known)?'
    },
    ERRORS: {
      REQUIRED: 'Please enter a whole number up to 18 digits (0 allowed)',
      INVALID: 'Please enter a whole number up to 18 digits (0 allowed)'
    }
  },

  CARBON: {
    REQUIRED_INFO: {
      PAGE_HEADING: 'Information we require before you can complete the carbon impact section'
    },
    PREPARE: {
      PAGE_HEADING: 'What to record about your carbon impact'
    },
    CAPITAL: {
      PAGE_HEADING: 'How much capital carbon will this project produce?',
      LABEL: 'Capital emissions',
      SUFFIX: 'metric tonnes'
    },
    OPERATIONAL: {
      PAGE_HEADING: 'How much operational carbon will this project produce?',
      LABEL: 'Operational emissions',
      SUFFIX: 'metric tonnes'
    },
    SEQUESTERED: {
      PAGE_HEADING: 'How much carbon will be sequestered by this project?',
      LABEL: 'Sequestered emissions',
      SUFFIX: 'metric tonnes'
    },
    AVOIDED: {
      PAGE_HEADING: 'How much carbon will be avoided by this project?',
      LABEL: 'Avoided emissions',
      SUFFIX: 'metric tonnes'
    },
    NET_BENEFIT: {
      PAGE_HEADING: 'How much net economic benefit is generated from any net carbon savings?',
      LABEL: 'Net economic benefit'
    },
    OM_COST: {
      PAGE_HEADING: 'How much Operation and Maintenance cost is forecast for the project?',
      LABEL: 'Operation and Maintenance cost forecast'
    },
    WHOLE_LIFE: {
      PAGE_HEADING: 'This is the whole life carbon calculated for the project'
    },
    NET_CARBON: {
      PAGE_HEADING: 'This is the net carbon calculated for the project'
    },
    ASSESSMENT: {
      PAGE_HEADING: 'What we have calculated about your Carbon Impact'
    }
  },

  GOALS_URGENCY_CONFIDENCE: {
    GOALS: {
      PAGE_HEADING: 'What work does the project plan to do to achieve its benefits?',
      HINT: 'Limit your answer to 700 characters or fewer',
      ERRORS: {
        REQUIRED: 'Tell us about the work the project plans to do to achieve its benefits.',
        MAX_LENGTH: 'Limit the work the project plans to do to achieve its benefits to 700 characters or fewer'
      }
    },
    URGENCY_REASON: {
      PAGE_HEADING: 'Is the project urgent for any of the following reasons?',
      HINT: 'Urgent proposals must be agreed with your local Partnership and Strategic Overview (PSO) officer before submission.',
      OPTIONS: {
        NOT_URGENT: 'The project is not urgent',
        STATUTORY: 'There is a business-critical statutory need',
        LEGAL: 'There is a business-critical legal need',
        HEALTH_SAFETY: 'There is a health and safety issue',
        EMERGENCY: 'There is an emergency',
        TIME_LIMITED: 'There is a specific aspect of the project that has a time limit'
      },
      ERRORS: {
        REQUIRED: "If your project is urgent, select a reason. If it isn't urgent, select the first option."
      }
    },
    URGENCY_DETAIL: {
      HINT: 'Limit your answer to 700 characters or fewer',
      HEADINGS: {
        STATUTORY: 'What is the business-critical statutory need?',
        LEGAL: 'What is the business-critical legal need?',
        HEALTH_SAFETY: 'What is the health and safety issue?',
        EMERGENCY: 'What is the emergency?',
        TIME_LIMITED: 'What is the specific aspect of the project that has a time limit?'
      },
      ERRORS: {
        MAX_LENGTH: 'Limit the details about why your project is urgent to 700 characters or fewer'
      }
    },
    PROPERTY_CONFIDENCE: {
      PAGE_HEADING: 'Confidence in number of properties benefitting by this project',
      OPTIONS: {
        HIGH: 'High',
        MEDIUM_HIGH: 'Medium High',
        MEDIUM_LOW: 'Medium Low',
        LOW: 'Low',
        NA: 'N/A'
      },
      ERRORS: {
        REQUIRED: 'Select the confidence level'
      }
    },
    GATEWAY_CONFIDENCE: {
      PAGE_HEADING: "Confidence in achieving the project's forecast Gateway 4 (Readiness for Service) date",
      ERRORS: {
        REQUIRED: 'Select the confidence level'
      }
    },
    FUNDING_CONFIDENCE: {
      PAGE_HEADING: 'Confidence in securing contributions',
      ERRORS: {
        REQUIRED: 'Select the confidence level'
      }
    }
  },

  OVERVIEW: {
    PAGE_HEADING: 'Proposal overview',
    SECTION_CARDS: {
      PROPOSAL_DETAILS: 'Proposal details',
      BENEFIT_AREA: 'Project benefit area',
      IMPORTANT_DATES: 'Important dates',
      FUNDING: 'Funding sources and spending',
      RISKS_PROPERTIES: 'Risks and properties benefitting',
      GOALS: 'Project goals and approach',
      URGENCY: 'Project Urgency',
      CONFIDENCE: 'Confidence assessment',
      ENV_BENEFITS: 'Environmental benefits',
      NFM: 'Natural Flood Management',
      WLC: 'Whole life cost',
      WLB: 'Whole life benefits',
      CARBON: 'Carbon impact'
    },
    SUBMISSION: {
      NOTICE_SUMMARY: 'Standard data notice',
      SUBMIT_BUTTON: 'Submit proposal',
      SUCCESS: 'Your proposal has been submitted successfully'
    },
    ERRORS: {
      PROJECT_TYPE_INCOMPLETE: "Tell us about the project's project type, intervention types and primary benefit intervention.",
      FINANCIAL_START_INCOMPLETE: 'Tell us the financial year the project will first require funding',
      FINANCIAL_END_INCOMPLETE: 'Tell us the financial year the project will stop spending funds'
    }
  }
}
