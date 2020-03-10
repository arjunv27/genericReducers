import React, { createContext, useReducer, useCallback, useContext } from 'react';
import axios from 'axios';

// init state
const initialState = {
  status: null,
  response: null,
};

// action types
const LOADING = "LOADING"
const SUCCESS = "SUCCESS"
const ERROR = "ERROR"

//action creators
const loading = ({ status: LOADING });
const success = res => ({ status: SUCCESS, res });
const error = res => ({ status: ERROR, res });



const store = createContext(initialState); //https://reactjs.org/docs/context.html
// Context api is used instead of Redux -- enables an easy prop drilling alternative which enables storage on context rather than global
// This approach enables a microservice architecture as the components can use the scope of their own local environment
// This can probably be implemented in redux, doing it directly in react seems cleaner

const { Provider } = store;
// createContext creates a "Provider" and "Consumer"
// Provider is used at the top level and provides the props for consumer components
// Using the Context API "Consumer" is used to bring props into scope for a given child (provides same functionality as mapStateToProps and mapDispatchToProps)

// With hooks, instead of using "Consumer" or "connect" we can use useContext(...) in the child components
//https://reactjs.org/docs/hooks-reference.html#usecontext


const ApiProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    //https://reactjs.org/docs/hooks-reference.html#usereducer
    //useReducer returns the state and dispatch -- we push them to child components in the return statement of apiProvider
    switch (action.status) { // traditional reducer, changed name from type to status in case of other generic reducers using type variable
      case LOADING:
        return { ...state, status: LOADING };
      case SUCCESS:
        return { response: action.res, status: SUCCESS };
      case ERROR:
        return { response: action.res, status: ERROR }
      default:
        throw new Error();
    };
  }, initialState);

  const makeRequest = (verb = 'get', endpoint, params = {}) => {
    return useCallback(async () => { //from https://medium.com/@audisho.sada/using-react-hooks-to-asynchronously-make-api-requests-1fdf52f797ce
      dispatch(loading);             //still getting a sense of when to use useCallback -- essentially it memoizes the function, prevents the creation of new
      try {
        const res = await axios[verb](endpoint, params); //may be inefficient in production e.g. want to handle deletes differently then requests
        dispatch(success(res));                          //can be implemented as an object where the keys are get, post, etc
      } catch (e) {
        dispatch(error(e));
      }
    });
  }


  return <Provider value={{ state, makeRequest }}>{children}</Provider>;
  //Now state and dispatch are available to any child component which apiProvider takes as argument
};
// Wrapping useReduce in the provider was found here:
// https://blog.logrocket.com/use-hooks-and-context-not-react-and-redux/

export { store, ApiProvider }
