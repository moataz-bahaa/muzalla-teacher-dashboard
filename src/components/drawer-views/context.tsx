import React, { useContext } from 'react'

export type DRAWER_VIEWS = 'COURSE_FILTERS'

interface State<T = unknown> {
  view: DRAWER_VIEWS | undefined
  data?: T
  isOpen: boolean
}

type Action =
  | { type: 'open'; view: DRAWER_VIEWS; payload?: unknown }
  | { type: 'close' }

const initialState: State = {
  view: undefined,
  isOpen: false,
  data: null,
}

function drawerReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'open':
      return {
        ...state,
        view: action.view,
        data: action.payload,
        isOpen: true,
      }
    case 'close':
      return {
        ...state,
        view: undefined,
        data: null,
        isOpen: false,
      }
    default:
      throw new Error('Unknown Drawer Action!')
  }
}

const DrawerStateContext = React.createContext<State>(initialState)
DrawerStateContext.displayName = 'DrawerStateContext'

const DrawerActionContext = React.createContext<React.Dispatch<Action> | undefined>(
  undefined,
)
DrawerActionContext.displayName = 'DrawerActionContext'

export const DrawerProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = React.useReducer(drawerReducer, initialState)

  return (
    <DrawerStateContext.Provider value={state}>
      <DrawerActionContext.Provider value={dispatch}>
        {children}
      </DrawerActionContext.Provider>
    </DrawerStateContext.Provider>
  )
}

export const useDrawerState = <T,>() => {
  const context = useContext(DrawerStateContext)
  if (context === undefined) {
    throw new Error('useDrawerState must be used within a DrawerProvider')
  }
  return context as State<T>
}

export const useDrawerAction = () => {
  const dispatch = useContext(DrawerActionContext)
  if (!dispatch) {
    throw new Error('useDrawerAction must be used within a DrawerProvider')
  }

  return {
    openDrawer: (view: DRAWER_VIEWS, payload?: unknown) => {
      dispatch({ type: 'open', view, payload })
    },
    closeDrawer: () => {
      dispatch({ type: 'close' })
    },
  }
}
