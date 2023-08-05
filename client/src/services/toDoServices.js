export async function getAllTestCases(user_id) {
    console.log('user_id::' ,user_id )
    const response = await fetch(`/api/v1/getTestScenarios/?user_id=${user_id}`);
    return await response.json();
}


export async function getTestAutomatedTests() {
    const response = await fetch(`/api/v1/getTestAutomatedTests`);
    return await response.json();
}


export async function createTestScenarios(requestBody) {
    const response = await fetch(`/api/v1/createTestScenarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    })
    return response;
}

export async function saveTestScenarios(selectedItems) {
    const response = await fetch(`/api/v1/saveTestScenarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedItems),
    })
    return response;
}


