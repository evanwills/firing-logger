const initialState = {
  studio = {
    kilns: [],
    firingPrograms: [],
    firingLogs: [],
    maintenance: [],
    issues: [],
    users: [],
    diary: []
  },
  currentUser: 'evanWills',
  reports: [],
  view: 'login',
  stateSlice: {}
}


export const store = createStore(
  combineReducers({
  }),
  initialState,
  compose(
    applyMiddleware(
      crashReporter,
      logger,
      userSettings.middleware,
      mainAppMW,
      oneOff.middleware,
      repeatable.middleware
    )

  )
  //  && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
