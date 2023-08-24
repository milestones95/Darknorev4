const supabase = require("../../SupabaseServer.js");

const saveTestCases = async (req, res) => {
  try {
    const {data, error} = await supabase
      .from("test_cases")
      .insert(req.body)
      .select();
    if (error) {
      console.log("saveTestCases ~ error:", JSON.stringify(error));
      res.json({err: error, status: 400, statusText: "OK"});
    }
    if (data) {
      res.json({data, status: 200, statusText: "OK"});
    }
  } catch (err) {
    console.log("Error wile saving test cases:", JSON.stringify(err));
    res.json({err: err, status: 500});
  }
};
export default saveTestCases;
