const supabase = require("../../SupabaseServer.js");

const updateTestCase = async (req, res) => {
  try {
    const {id} = req.query;
    const {data, error} = await supabase
      .from("test_cases")
      .update(req.body)
      .eq("id", id)
      .select();
    if (error) {
      console.log("updateTestCase ~ error:", error);
      res.json({err: error, status: 400});
    }
    if (data) {
      res.json({data, status: 200, statusText: "OK"});
    }
  } catch (err) {
    console.log("Error while updating test cases:", JSON.stringify(err));
    res.json({err, status: 500});
  }
};
export default updateTestCase;
