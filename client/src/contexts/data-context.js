import {createContext, useReducer} from "react";

const initialState = {
  testSteps: {},
  userStoryDetails: {}
}

const SET_USER_STORY_DETAILS = "SET_USER_STORY_DETAILS";
const SET_TEST_STEPS = "SET_TEST_STEPS";
const SET_TEST_CASES = "SET_TEST_CASES";
const SET_PROJECT_NAME = "SET_PROJECT_NAME";

const reducer = (state, action) => {
  switch(action.type) {
    case SET_PROJECT_NAME:
      return {
        ...state,
        projectName: action.payload
      }
    case SET_USER_STORY_DETAILS:
      return {
        ...state,
        userStoryDetails: action.payload
      }
    case SET_TEST_STEPS:
      return {
        ...state,
        testSteps: action.payload
      }
    case SET_TEST_CASES:
      return {
        ...state,
        testCases: action.payload
      }
    default:
      return {
        ...state 
      }
  }
}

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setProjectName = (name) => {
    dispatch({
      type: SET_PROJECT_NAME,
      payload: name
    })
  }

  const setUserStoryDetails = (details) => {
    dispatch({
      type: SET_USER_STORY_DETAILS,
      payload: details
    })
  }

  const setTestSteps = (testSteps) => {
    dispatch({
      type: SET_TEST_STEPS,
      payload: testSteps
    })
  }

  const setTestCases = (testCases) => {
    dispatch({
      type: SET_TEST_CASES,
      payload: testCases
    })
  }

  return (
    <DataContext.Provider
      value={{
        ...state,
        setProjectName,
        setUserStoryDetails,
        setTestSteps,
        setTestCases
      }}
    >
      { children }
    </DataContext.Provider>
  )
}