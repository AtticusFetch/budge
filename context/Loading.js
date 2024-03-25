import React, { createContext, useContext, useReducer } from 'react';

const LoadingContext = createContext();

const initialState = {
  loading: false,
};

export const ACTIONS = {
  SET: 'SET_LOADING',
};

const loadingReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const LoadingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(loadingReducer, initialState);

  return (
    <LoadingContext.Provider value={{ state, dispatch }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const loadingActions = {
  set: (payload) => ({ type: ACTIONS.SET, payload }),
};

export const setLoadingAction = (dispatch, payload) =>
  dispatch(loadingActions.set(payload));

export const useLoadingContext = () => useContext(LoadingContext);
