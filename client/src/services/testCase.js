export async function getTestCases(user_story_id) {
  try {
    const response = await fetch(
      `/api/v1/testCases/getTestCases/?user_story_id=${user_story_id}`
    );
    return await response.json();
  } catch (err) {
    console.log("getTestCases ~ err:", err);
    throw err;
  }
}

export async function getTestCaseById(testCaseId) {
  try {
    const response = await fetch(
      `/api/v1/testCases/getTestCaseById/?testCaseId=${testCaseId}`
    );
    return await response.json();
  } catch (error) {
    console.log("getTestCaseById ~ err:", err);
    throw error;
  }
}

export async function saveTestCases(requestBody) {
  try {
    const response = await fetch(`/api/v1/testCases/saveTestCases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    return await response.json();
  } catch (err) {
    console.log("saveTestCases ~ err:", err);
    throw err;
  }
}
export async function updateTestCase(id, requestBody) {
  try {
    const response = await fetch(`/api/v1/testCases/updateTestCase/?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    return await response.json();
  } catch (err) {
    console.log("updateTestCase ~ err:", err);
    throw err;
  }
}
export async function deleteTestCase(id) {
  try {
    const response = await fetch(`/api/v1/testCases/deleteTestCase/?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    return await response.json();
  } catch (err) {
    console.log("deleteTestCase ~ err:", err);
    throw err;
  }
}
export async function generateTestCases(requestBody) {
  try {
    const response = await fetch(`/api/v1/testCases/openAi/generateTestCases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    return response;
  } catch (err) {
    console.log("generateTestCases ~ err:", err);
    throw err;
  }
}
export async function generateMoreTestCases(requestBody) {
  try {
    const response = await fetch(
      `/api/v1/testCases/openAi/generateMoreTestCases`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    );
    return response;
  } catch (err) {
    console.log("generateMoreTestCases ~ err:", err);
    throw err;
  }
}
export async function generateSimilarTestCases(requestBody) {
  try {
    const response = await fetch(
      `/api/v1/testCases/openAi/generateSimilarTestCases`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    );
    return response;
  } catch (err) {
    console.log("generateSimilarTestCases ~ err:", err);
    throw err;
  }
}
