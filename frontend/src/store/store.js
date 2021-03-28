import {createStore} from 'redux';
// import ReduxThunk from 'redux-thunk'
import reducer from './reducers/reducer';
// export const middlewares = [ReduxThunk];
// export const createStoreWithMiddleWare = applyMiddleware(...middlewares)(createStore)

export const store = createStore(reducer);