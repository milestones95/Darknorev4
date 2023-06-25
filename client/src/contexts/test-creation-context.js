import { createContext, useState } from 'react';

export const TestCreationData = createContext();

export const TestCreationDataProvider = ({ children }) => {
     const [testCreationData, setTestCreationData] = useState({
         userStoryName: "",
         baseURL: "",
         userStoryDescription: "",
         acceptanceCriteria: "",
         scenarios: [
           {
             scenarioType: "", createdAt: "",
             id: "",
             scenario: "",
             testSteps: [{id: "", testStep: "", webpage:""}]
           }
         ]
     })

    const addUserStory = (userStoryName, baseURL, userStoryDescription, acceptanceCriteria) => {
          console.log(userStoryName, baseURL, userStoryDescription, acceptanceCriteria)
          const updatedStestData = {
              userStoryName: userStoryName,
              baseURL: baseURL,
              userStoryDescription: userStoryDescription,
              acceptanceCriteria: acceptanceCriteria,
              scenarios: [
                {
                  scenarioType: "", createdAt: "",
                  id: "",
                  scenario: "",
                  testSteps: [{id: "", testStep: "", webpage:""}]
                }
              ]
          }
          setTestCreationData(updatedStestData);
      };;

   const updateScenarios = (newScenarios) => {
        var updatedData = {...testCreationData}
        updatedData.scenarios = newScenarios
        setTestCreationData(updatedData)
    };

  const emptyData = () => {
    setTestCreationData({
        userStoryName: "",
        baseURL: "",
        userStoryDescription: "",
        acceptanceCriteria: "",
        scenarios: [
          {
            scenarioType: "", createdAt: "",
            id: "",
            scenario: "",
            testSteps: [{id: "", testStep: "", webpage:""}]
          }
        ]
    })
  }
  return (
    <TestCreationData.Provider value={{ testCreationData, addUserStory, updateScenarios, emptyData }}>
      {children}
    </TestCreationData.Provider>
  );
};
