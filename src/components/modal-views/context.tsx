import React, { useContext } from 'react';

export type MODAL_VIEWS = 'DELETE_OBJECT';

interface State<T = unknown> {
  view: MODAL_VIEWS | undefined;
  data?: T;
  isOpen: boolean;
}

type Action =
  | { type: 'open'; view: MODAL_VIEWS; payload?: unknown }
  | { type: 'close' };

const initialState: State = {
  view: undefined,
  isOpen: false,
  data: null,
};

function modalReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'open':
      return {
        ...state,
        view: action.view,
        data: action.payload,
        isOpen: true,
      };
    case 'close':
      return {
        ...state,
        view: undefined,
        data: null,
        isOpen: false,
      };
    default:
      throw new Error('Unknown Modal Action!');
  }
}

const ModalStateContext = React.createContext<State>(initialState);
ModalStateContext.displayName = 'ModalStateContext';

const ModalActionContext = React.createContext<
  React.Dispatch<Action> | undefined
>(undefined);
ModalActionContext.displayName = 'ModalActionContext';

export const ModalProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = React.useReducer(modalReducer, initialState);

  return (
    <ModalStateContext.Provider value={state}>
      <ModalActionContext.Provider value={dispatch}>
        {children}
      </ModalActionContext.Provider>
    </ModalStateContext.Provider>
  );
};

export const useModalState = <T,>() => {
  const context = useContext(ModalStateContext);
  if (context === undefined) {
    throw new Error('useModalState must be used within a ModalProvider');
  }
  return context as State<T>;
};

export const useModalAction = () => {
  const dispatch = useContext(ModalActionContext);
  if (!dispatch) {
    throw new Error('useModalAction must be used within a ModalProvider');
  }

  return {
    openModal: (view: MODAL_VIEWS, payload?: unknown) => {
      dispatch({ type: 'open', view, payload });
    },
    closeModal: () => {
      dispatch({ type: 'close' });
    },
  };
};
