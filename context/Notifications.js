import { concat } from 'lodash';
import React, { createContext, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

const NotificationsContext = createContext();

const initialState = {
  notifications: [],
};

export const ACTIONS = {
  ADD: 'ADD_NOTIFICATION',
  REMOVE: 'REMOVE_NOTIFICATION',
};

const notificationsReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD:
      return {
        ...state,
        notifications: concat(state.notifications, action.payload),
      };
    case ACTIONS.REMOVE:
      return {
        ...state,
        notifications: state.notifications.filter(
          (e) => e.id !== action.payload.id,
        ),
      };
    default:
      return state;
  }
};

export const NotificationsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationsReducer, initialState);

  return (
    <NotificationsContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const notificationsActions = {
  add: (payload) => ({ type: ACTIONS.ADD, payload }),
  remove: (payload) => ({ type: ACTIONS.REMOVE, payload }),
};

export const addNotificationAction = (dispatch, payload) => {
  const uniqueNotification = {
    message: payload.message,
    code: payload.code,
    id: uuidv4(),
  };
  dispatch(notificationsActions.add(uniqueNotification));
  setTimeout(() => {
    dispatch(notificationsActions.remove(uniqueNotification));
  }, 5000);
};

export const addErrorNotificationAction = (dispatch, payload) => {
  addNotificationAction(dispatch, { ...payload, error: true });
};

export const useNotificationsContext = () => useContext(NotificationsContext);
