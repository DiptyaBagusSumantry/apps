export const initialAbility = [
  {
    action: 'read',
    subject: 'Auth',
  },
]

export const adminUserAbility = [
  {
    action: 'manage',
    subject: 'all',
  },
]

export const loggedInUserAbility = [
  {
    action: 'manage',
    subject: 'Account',
  },
  ...initialAbility,
]

export const verifiedUserAbility = [
  {
    action: 'read',
    subject: 'Dashboard',
  },
  ...loggedInUserAbility,
]

export const trialUserAbility = [
  {
    action: 'read',
    subject: 'Dashboard',
  },
  ...verifiedUserAbility,
]

export const subscribedUserAbility = [
  {
    action: 'filter',
    subject: 'Dashboard',
  },
  ...verifiedUserAbility,
  ...trialUserAbility,
]

export const _ = undefined
