export const userActions = {

}

const defaultUser = 'evanwills'
const initialState = {
  all: [{
    id: 'evanwills',
    firstName: 'Evan',
    lastName: 'Wills',
    contact: {
      phone: '0414604641',
      email: 'evan.wills@acu.edu.au'
    },
    created: 1621349154990,
    createdBy: 'evanwills',
    active: true,
    isSuper: true,
    permissions: {
      kiln: {
        create: true,
        update: true,
        delete: true
      },
      program: {
        create: true,
        update: true,
        delete: true
      },
      firings: {
        start: true,
        book: true,
        log: true
      },
      user: {
        create: true,
        read: true,
        update: true,
        delete: true
      },
      maintenance: {
        createIssue: true,
        verifyIssue: true,
        fixIssue: true
      }
    }
  }],
  filters: {}
}

export const usersReducer = (state = initialState, action) => {
  return state
}

export const currentUserReducer = (state = defaultUser, action) => {
  return state
}
