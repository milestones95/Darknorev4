const supabase = require("../../SupabaseServer.js");

const getTestCases = async (req, res) => {
  try {
    const {user_story_id} = req.query;
    const {data, error} = await supabase
      .from("test_cases")
      .select(`*, test_categories(name)`)
      .match({user_story_id});

    if (error) {
      console.log("getTestCases ~ error:", error);
      return res.json({err: error, status: 400});
    }
    if (data) {
      res.json({data, status: 200, statusText: "OK"});
    }
  } catch (err) {
    console.log("Error while getting test cases:", err);
    res.json({err, status: 500});
  }
};
export default getTestCases;
