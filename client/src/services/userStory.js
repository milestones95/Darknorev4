export async function createNewUserStory(requestBody) {
    try {
        const response = await fetch(`/api/v1/userStories/createNewUserStory`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        })
        return await response.json();
    } catch (err) {
        console.log("🚀 ~ file: userStory.js:12 ~ createNewUserStory ~ err:", err);
        throw err;
    }
}

export async function getAllUserStories(user_id) {
    try {
        const response = await fetch(`/api/v1/userStories/getAllUserStories/?user_id=${user_id}`);
        return await response.json();
    } catch (err) {
        console.log("🚀 ~ file: userStory.js:22 ~ getAllUserStories ~ err:", err);
        throw err;
    }
}

export async function getAllUserStoriesByProjectId(project_id) {
    try {
        const response = await fetch(`/api/v1/userStories/getAllUserStoriesByProjectId/?project_id=${project_id}`);
        return await response.json();
    } catch (err) {
        console.log("🚀 ~ file: userStory.js:22 ~ getAllUserStoriesByProjectId ~ err:", err);
        throw err;
    }
}
export async function getUserStoryById(id) {
    try {
        const response = await fetch(`/api/v1/userStories/getUserStoryById/?id=${id}`);
        return await response.json();
    } catch (err) {
        console.log("🚀 ~ file: userStory.js:31 ~ getUserStoryById ~ ̥:", err);
        throw err;
    }
}
export async function updateUserStory(id, requestBody) {
    try {
        const response = await fetch(`/api/v1/userStories/updateUserStory?id=${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        })
        return await response.json();
    } catch (err) {
        console.log("🚀 ~ file: userStory.js:37 ~ updateUserStory ~ err:", err)
        throw err;
    }
}