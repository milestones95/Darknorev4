import { createContext, useState } from 'react';

export const TestCreationData = createContext();

export const TestCreationDataProvider = ({ children }) => {

  const [testCreationData, setTestCreationData] = useState({
    userStoryName: "",
    baseURL: "",
    userStoryDescription: "",
    acceptanceCriteria: "",
    scenarios: []
  });

  const addScenario = (scenario) => {
    setTestCreationData((prevData) => ({
      ...prevData,
      scenarios: prevData.scenarios ? [...prevData.scenarios, scenario] : [scenario]
    }));
    
  };

    const addUserStory = (userStoryName, baseURL, userStoryDescription, acceptanceCriteria) => {
          console.log(userStoryName, baseURL, userStoryDescription, acceptanceCriteria)
          const updatedStestData = {
              userStoryName: userStoryName,
              baseURL: baseURL,
              userStoryDescription: userStoryDescription,
              acceptanceCriteria: acceptanceCriteria
          }
          setTestCreationData(updatedStestData);
      };;

   const updateScenarios = (newScenarios) => {
        var updatedData = {...testCreationData}
        updatedData.scenarios = newScenarios
        setTestCreationData(updatedData)

        console.log("final test creation data: ", testCreationData);
    };

  const emptyData = () => {
    setTestCreationData({
        userStoryName: "",
        baseURL: "",
        userStoryDescription: "",
        acceptanceCriteria: "",
        scenarios: [
          {
            scenarioType: "", 
            id: "",
            scenario: "",
            testSteps: [{id: "", text: "", webpage:"", html:""}],
            code: ""
          }
        ]
    })
  }
  return (
    <TestCreationData.Provider value={{ testCreationData, addUserStory, addScenario, updateScenarios, emptyData }}>
      {children}
    </TestCreationData.Provider>
  );
};
