import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { supabase } from "../pages/api/SupabaseClient";
import { useRouter } from 'next/navigation';
const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',
  SIMILAR_TEST_CASES_TO_CREATE: 'SIMILAR_TEST_CASES_TO_CREATE'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  similarTestCases: []
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    let obj = {};
    if (action && action.payload) {
      const {user, similarTestCases} = action.payload;
      obj = {
        isAuthenticated: true,
        isLoading: false,
        user,
        similarTestCases
      }
    } else {
      obj = {
        isLoading: false
      }
    }

    return {
      ...state,
      ...obj,
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  },
  [HANDLERS.SIMILAR_TEST_CASES_TO_CREATE]: (state, action) => {
    const similarTestCases = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      similarTestCases
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);
  const router = useRouter();
  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled

    console.log("auth-context initialize function called !")
    
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    let isAuthenticated = false;
    
    let user_data = null;
    try {
      const { data: supabase_session, error } = await supabase.auth.getSession();
      isAuthenticated = !!supabase_session.session;
      user_data = supabase_session.session;
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      const user = {
        id: user_data?.user?.id || '',
        avatar: '/assets/avatars/avatar-anika-visser.png',
        name: user_data?.user?.user_metadata?.name || '',
        email: user_data?.user?.email || ''
      };
      const similarTestCases = [];
      const payload = {
        user, similarTestCases
      }
      dispatch({
        type: HANDLERS.INITIALIZE,
        payload
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    []
  );

  const skip = () => {
    try {
      window.sessionStorage.setItem('authenticated', 'true');
    } catch (err) {
      console.error(err);
    }

    const user = {
      id: '5e86809283e28b96d2d38537',
      avatar: '/assets/avatars/avatar-anika-visser.png',
      name: 'Anika Visser',
      email: 'anika.visser@devias.io'
    };
    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user
    });
  };

  const signIn = async (email, password) => {
    const {data,error} = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(error.message);
    }

    try {
      window.sessionStorage.setItem('authenticated', 'true');
      window.sessionStorage.setItem('user_refresh_token', data.session.refresh_token);
    } catch (err) {
      console.error(err);
    }

    const user = {
      id: data.user.id || '5e86809283e28b96d2d38537',
      avatar: '/assets/avatars/avatar-anika-visser.png',
      name: data.user.user_metadata.name || 'Anika Visser',
      email: data.user.email || 'anika.visser@devias.io'
    };

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user
    });
    return data;
  };

  const signUp = async (email, name, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    })
    if (data) {
      return data;
    }
    
    if (error) {
      throw new Error("Something Wen wrong while creating user!")
    }
  };

  const signOut = async () => {
    window.sessionStorage.setItem('authenticated', 'false');
    const { error } = await supabase.auth.signOut();
    if (error) {
      return "error";
    }
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
    return "success";
  };

  const setSimilarTestCases = async (testCases) => {

    dispatch({
      type: HANDLERS.SIMILAR_TEST_CASES_TO_CREATE,
      payload: testCases
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signUp,
        signOut,
        setSimilarTestCases
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
