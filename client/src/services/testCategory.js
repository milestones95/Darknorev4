export async function addTestCategory(category) {
    try {
        const response = await fetch(`/api/v1/testCategory/addTestCategory`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(category)
        })
        return await response.json();
    } catch (err) {
        throw err;
    }
}
export async function getTestCategories(scenario_type) {
    try {
        const response = await fetch(`/api/v1/testCategory/getTestCategories?scenario_type=${scenario_type}`);
        return await response.json();
    } catch (err) {
        throw err;
    }
}