import { FC, ReactNode, createContext, useEffect, useReducer } from 'react';
import { User } from 'src/models/user';
import SuspenseLoader from 'src/components/SuspenseLoader';
import firebase from 'src/utils/firebase';

interface AuthState {
  isInitialised: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextValue extends AuthState {
  method: 'FirebaseAuth';
  createUserWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<any>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

type AuthStateChangedAction = {
  type: 'AUTH_STATE_CHANGED';
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type Action = AuthStateChangedAction;

const initialAuthState: AuthState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null
};

const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'AUTH_STATE_CHANGED': {
      const { isAuthenticated, user } = action.payload;

      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        user
      };
    }
    default: {
      return { ...state };
    }
  }
};

const AuthContext = createContext<AuthContextValue>({
  ...initialAuthState,
  method: 'FirebaseAuth',
  createUserWithEmailAndPassword: () => Promise.resolve(),
  signInWithEmailAndPassword: () => Promise.resolve(),
  signInWithGoogle: () => Promise.resolve(),
  logout: () => Promise.resolve()
});

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  const signInWithEmailAndPassword = (
    email: string,
    password: string
  ): Promise<any> => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  };

  const signInWithGoogle = (): Promise<any> => {
    const provider = new firebase.auth.GoogleAuthProvider();

    return firebase.auth().signInWithPopup(provider);
  };

  const createUserWithEmailAndPassword = async (
    email: string,
    password: string
  ): Promise<any> => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  };

  const logout = (): Promise<void> => {
    return firebase.auth().signOut();
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch({
          type: 'AUTH_STATE_CHANGED',
          payload: {
            isAuthenticated: true,
            user: {
              id: user.uid,
              jobtitle: 'Lead Developer',
              avatar: user.photoURL,
              email: user.email,
              name: user.displayName || user.email,
              role: 'admin',
              location: 'San Francisco, USA',
              username: 'admin',
              posts: '4',
              coverImg: 'http://lorempixel.com/640/480/cats',
              followers: '5684',
              description:
                'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.'
            }
          }
        });
      } else {
        dispatch({
          type: 'AUTH_STATE_CHANGED',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    });

    return unsubscribe;
  }, [dispatch]);

  if (!state.isInitialised) {
    return <SuspenseLoader />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'FirebaseAuth',
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        signInWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
