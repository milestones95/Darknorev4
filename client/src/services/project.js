export async function createNewProject(requestBody) {
    try {
        const response = await fetch(`/api/v1/projects/createNewProject`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        })
        return await response.json();
    } catch (err) {
        console.log("🚀 ~ file: project.js:12 ~ createNewProject ~ err:", err);
        throw err;
    }
}

export async function getAllProjects(user_id) {
    try {
        const response = await fetch(`/api/v1/projects/getAllProjects/?user_id=${user_id}`);
        return await response.json();
    } catch (err) {
        console.log("🚀 ~ file: project.js:22 ~ getAllProjects ~ err:", err)
        throw err;
    }
}
