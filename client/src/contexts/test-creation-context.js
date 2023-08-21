import {createContext, useState} from "react";

export const TestCreationData = createContext();

export const TestCreationDataProvider = ({children}) => {
  const [testCreationData, setTestCreationData] = useState({
    projectName: "",
    userStoryName: "",
    userStoryDescription: "",
    acceptanceCriteria: "",
    scenarios: [
      {
        scenarioType: "",
        createdAt: "",
        id: "",
        scenario: "",
        testSteps: [{id: "", testStep: "", webpage: ""}]
      }
    ]
  });

  const addProjectName = projectName => {
    const updateStateData = {
      projectName: projectName,
      userStoryName: "",
      userStoryDescription: "",
      acceptanceCriteria: "",
      scenarios: [
        {
          scenarioType: "",
          createdAt: "",
          id: "",
          scenario: "",
          testSteps: [{id: "", testStep: "", webpage: ""}]
        }
      ]
    };
    setTestCreationData(updateStateData);
  };

  const addUserStory = (
    projectName,
    userStoryName,
    userStoryDescription,
    acceptanceCriteria,
    scenarios
  ) => {
    console.log(
      projectName,
      userStoryName,
      userStoryDescription,
      acceptanceCriteria
    );
    const updatedStestData = {
      projectName: projectName,
      userStoryName: userStoryName,
      userStoryDescription: userStoryDescription,
      acceptanceCriteria: acceptanceCriteria,
      scenarios: scenarios
        ? scenarios
        : [
            {
              scenarioType: "",
              createdAt: "",
              id: "",
              scenario: "",
              testSteps: [{id: "", testStep: "", webpage: ""}]
            }
          ]
    };
    setTestCreationData(updatedStestData);
  };

  const addTestCases = newScenarios => {
    var updatedData = {...testCreationData};
    updatedData.scenarios = newScenarios;
    setTestCreationData(updatedData);
  };

  const emptyData = () => {
    setTestCreationData({
      userStoryName: "",
      userStoryDescription: "",
      acceptanceCriteria: "",
      scenarios: [
        {
          scenarioType: "",
          createdAt: "",
          id: "",
          scenario: "",
          testSteps: [{id: "", testStep: "", webpage: ""}]
        }
      ]
    });
  };
  return (
    <TestCreationData.Provider
      value={{
        testCreationData,
        addProjectName,
        addUserStory,
        addTestCases,
        emptyData
      }}
    >
      {children}
    </TestCreationData.Provider>
  );
};
