import { FC, ReactNode, createContext, useEffect, useReducer } from 'react';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { User } from 'src/models/user';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { auth0Config } from 'src/config';

let auth0Client: Auth0Client | null = null;

interface AuthState {
  isInitialised: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

export interface AuthContextValue extends AuthState {
  method: 'Auth0';
  loginWithPopup: (options?: any) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

type InitialiseAction = {
  type: 'INITIALISE';
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type LoginAction = {
  type: 'LOGIN';
  payload: {
    user: User;
  };
};

type LogoutAction = {
  type: 'LOGOUT';
};

type RegisterAction = {
  type: 'REGISTER';
};

type Action = InitialiseAction | LoginAction | LogoutAction | RegisterAction;

const initialAuthState: AuthState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null
};

const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'INITIALISE': {
      const { isAuthenticated, user } = action.payload;

      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        user
      };
    }
    case 'LOGIN': {
      const { user } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        user
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    }
    default: {
      return { ...state };
    }
  }
};

const AuthContext = createContext<AuthContextValue>({
  ...initialAuthState,
  method: 'Auth0',
  loginWithPopup: () => Promise.resolve(),
  logout: () => {}
});

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  const loginWithPopup = async (options) => {
    await auth0Client.loginWithPopup(options);

    const isAuthenticated = await auth0Client.isAuthenticated();

    if (isAuthenticated) {
      const user = await auth0Client.getUser();

      dispatch({
        type: 'LOGIN',
        payload: {
          user: {
            id: user.sub,
            jobtitle: 'Lead Developer',
            avatar: user.picture,
            email: user.email,
            name: user.name,
            role: user.role,
            location: user.location,
            username: user.username,
            posts: user.posts,
            coverImg: user.coverImg,
            followers: user.followers,
            description: user.description
          }
        }
      });
    }
  };

  const logout = () => {
    auth0Client.logout();

    dispatch({
      type: 'LOGOUT'
    });
  };

  useEffect(() => {
    const initialise = async () => {
      try {
        auth0Client = new Auth0Client({
          redirect_uri: window.location.origin,
          ...auth0Config
        });

        await auth0Client.checkSession();

        const isAuthenticated = await auth0Client.isAuthenticated();

        if (isAuthenticated) {
          const user = await auth0Client.getUser();

          dispatch({
            type: 'INITIALISE',
            payload: {
              isAuthenticated,
              user: {
                id: user.sub,
                jobtitle: 'Lead Developer',
                avatar: user.picture,
                email: user.email,
                name: user.name,
                role: user.role,
                location: user.location,
                username: user.username,
                posts: user.posts,
                coverImg: user.coverImg,
                followers: user.followers,
                description: user.description
              }
            }
          });
        } else {
          dispatch({
            type: 'INITIALISE',
            payload: {
              isAuthenticated,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALISE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialise();
  }, []);

  if (!state.isInitialised) {
    return <SuspenseLoader />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'Auth0',
        loginWithPopup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
