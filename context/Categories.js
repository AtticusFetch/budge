import React, { createContext, useContext, useReducer } from 'react';

const CategoriesContext = createContext();

const initialState = {
  categories: [],
};

export const ACTIONS = {
  SET: 'SET_CATEGORIES',
};

const categoriesReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return {
        ...state,
        categories: action.payload,
      };
    default:
      return state;
  }
};

export const CategoriesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(categoriesReducer, initialState);

  return (
    <CategoriesContext.Provider value={{ state, dispatch }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const categoriesActions = {
  set: (payload) => ({ type: ACTIONS.SET, payload }),
};

export const useCategoriesContext = () => useContext(CategoriesContext);
