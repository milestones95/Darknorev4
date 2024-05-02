export async function getAllTestCases(user_id) {
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
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });
  return response;
}

export async function saveTestScenarios(selectedItems) {
  const response = await fetch(`/api/v1/saveTestScenarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(selectedItems)
  });
  return response;
}

export async function getCurrentTestResult(test_id) {
  console.log("🚀 ~ test_id:", test_id)
  const response = await fetch(`/api/v1/getCurrentTestResult/?test_id=${test_id}`);
  return await response.json();
}

export async function updateCompanyName(selectedItems) {
  const response = await fetch(`/api/v1/updateCompanyName`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(selectedItems)
  });
  return response;
}

export async function getCurrentUser(user_id) {
  const response = await fetch(`/api/v1/getCurrentUser?user_id=${user_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });
  return response.json();
}

export async function getCurrentCompanyTestSuites(company) {
  const response = await fetch(`/api/v1/getCurrentCompanyTestSuites?company=${company}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });
  return response.json();
}
