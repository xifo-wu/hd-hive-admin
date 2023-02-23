import { useReducer, useCallback } from 'react';

function modalsReducer(modals: any, action: any) {
  const { type, name, ...rest } = action;

  switch (type) {
    case 'open': {
      return {
        ...modals,
        [name]: {
          open: true,
          ...rest,
        },
      };
    }
    case 'close': {
      return {
        ...modals,
        [name]: {
          open: false,
          ...rest,
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default () => {
  const [modals, dispatch] = useReducer(modalsReducer, {});

  const closeModal = useCallback((name: string, params = {}) => {
    dispatch({
      type: 'close',
      name,
      params,
    });
  }, []);

  const openModal = useCallback((name: string, params = {}) => {
    dispatch({
      type: 'open',
      name,
      params,
    });
  }, []);

  return {
    ...modals,
    closeModal,
    openModal,
  };
};
