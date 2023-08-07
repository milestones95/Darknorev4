export async function getTestCases(user_story_id) {
    try {
        const response = await fetch(`/api/v1/testCases/getTestCases/?user_story_id=${user_story_id}`);
        return await response.json();
    } catch (err) {
        throw err;
    }
};

export async function getTestCaseById(testCaseId) {
    console.log("🚀 ~ file: testCase.js:11 ~ getTestCaseById ~ testCaseId:", testCaseId)
    try {
        const response = await fetch(`/api/v1/testCases/getTestCaseById/?testCaseId=${testCaseId}`);
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function saveTestCases(requestBody) {
    try {
        const response = await fetch(`/api/v1/testCases/saveTestCases`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody)
        })
        return await response.json();
    } catch (err) {
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
        })
        return await response.json();
    } catch (err) {
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
        })
        return response;
    } catch (err) {
        throw err;
    }
}
export async function generateMoreTestCases(requestBody) {
    try {
        const response = await fetch(`/api/v1/testCases/openAi/generateMoreTestCases`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        })
        return response;
    } catch (err) {
        throw err;
    }
}
export async function generateSimilarTestCases(requestBody) {
    console.log("🚀 ~ file: testCase.js:90 ~ generateSimilarTestCases ~ requestBody:", requestBody)
    try {
        const response = await fetch(`/api/v1/testCases/openAi/generateSimilarTestCases`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        })
        return response;
    } catch (err) {
        throw err;
    }
}