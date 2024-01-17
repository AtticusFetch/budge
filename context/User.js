import React, { createContext, useContext, useReducer } from 'react';

const UserContext = createContext();

const initialState = {
  user: null,
};

export const ACTIONS = {
  SET: 'SET_USER',
};

const userReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const userActions = {
  set: (payload) => ({ type: ACTIONS.SET, payload}),
};

export const useUserContext = () => useContext(UserContext);