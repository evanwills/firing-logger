


const toLocal = (action, state) => {

}
const toIndexDB = (action, state) => {

}

/**
 *
 * @param store
 * @returns
 */
export const persistToLocal = store => next => action => {
  const result = next(action)

  // toLocal(action, store.getState())
  toIndexDB(action, store.getState())
  // console.log('finished persisting')

  return result
}
