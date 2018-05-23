import {START_LOADING, STOP_LOADING} from '../actions/_common'

const init = {
  loading: false
}
const commonReducer = (state=init, action) => {
  switch(action.type){
    case START_LOADING:
      return {
        ...state,
        loading: true
      }

    case STOP_LOADING:
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}

export default commonReducer
export {commonReducer}
