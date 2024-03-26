import { concat } from 'lodash';
import React, { createContext, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ErrorsContext = createContext();

const initialState = {
  errors: [],
};

export const ACTIONS = {
  ADD: 'ADD_ERROR',
  REMOVE: 'REMOVE_ERROR',
};

const errorsReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD:
      return {
        ...state,
        errors: concat(state.errors, action.payload),
      };
    case ACTIONS.REMOVE:
      return {
        ...state,
        errors: state.errors.filter((e) => e.id !== action.payload.id),
      };
    default:
      return state;
  }
};

export const ErrorsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(errorsReducer, initialState);

  return (
    <ErrorsContext.Provider value={{ state, dispatch }}>
      {children}
    </ErrorsContext.Provider>
  );
};

export const errorsActions = {
  add: (payload) => ({ type: ACTIONS.ADD, payload }),
  remove: (payload) => ({ type: ACTIONS.REMOVE, payload }),
};

export const addErrorAction = (dispatch, payload) => {
  const uniqueError = {
    message: payload.message,
    code: payload.code,
    id: uuidv4(),
  };
  dispatch(errorsActions.add(uniqueError));
  setTimeout(() => {
    dispatch(errorsActions.remove(uniqueError));
  }, 5000);
};

export const useErrorsContext = () => useContext(ErrorsContext);
