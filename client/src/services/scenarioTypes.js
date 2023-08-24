export async function getScenarioType(name) {
  try {
    const response = await fetch(
      `/api/v1/scenarioTypes/getScenarioType/?name=${name}`
    );
    return await response.json();
  } catch (err) {
    console.log("getScenarioType ~ ̥:", err);
    throw err;
  }
}

export async function createNewScenarioType(requestBody) {
  try {
    const response = await fetch(
      `/api/v1/scenarioTypes/createNewScenarioType`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    );
    return await response.json();
  } catch (err) {
    console.log("createNewScenarioType ~ err:", err);
    throw err;
  }
}
