import React, { createContext, useContext, useReducer } from 'react';

const TransactionsContext = createContext();

const initialState = {
  transactions: [],
};

export const ACTIONS = {
  ADD: 'ADD_TRANSACTION',
  ADD_BULK: 'ADD_BULK_TRANSACTIONS',
  REMOVE: 'REMOVE_TRANSACTION',
};

const transactionsReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD:
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
    case ACTIONS.ADD_BULK:
      return {
        ...state,
        transactions: [...state.transactions, ...action.payload],
      };
    case ACTIONS.REMOVE:
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    default:
      return state;
  }
};

export const transactionsActions = {
  add: (payload) => ({ type: ACTIONS.ADD, payload}),
  addBulk: (payload) => ({ type: ACTIONS.ADD_BULK, payload}),
  remove: (payload) => ({ type: ACTIONS.REMOVE, payload}),
};

export const TransactionsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionsReducer, initialState);

  return (
    <TransactionsContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactionsContext = () => useContext(TransactionsContext);