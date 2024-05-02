const supabase = require("../SupabaseServer");

// get test case scenarios
const createSessionData = async (req, res) => {
  try {
    const { user_id, session } = req.body;

    const { data, error } = await supabase
      .from("lambdatest_sessions")
      .insert([{ user: user_id, session: session }])
      .select();

    if (error) {
      // Handle the error, e.g., send an error response to the client
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Send the data to the client or perform further actions
    return res.status(200).json({ data });
  } catch (error) {
    // Handle unexpected errors
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default createSessionData;
