export async function getAllSessions(user_id) {
  const response = await fetch(`/api/v1/getSessionData/?user_id=${user_id}`);
  console.log("🚀 ~ apiresponse:", response)
  return await response.json();
}


export async function createSessionData(requestBody) {
  const response = await fetch(`/api/v1/createSessionData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });
  return response;
}

export async function updateUserSession(requestBody) {
  const response = await fetch(`/api/v1/updateUserSession`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });
  return response;
}