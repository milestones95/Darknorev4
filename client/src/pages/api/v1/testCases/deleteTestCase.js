const supabase = require("../../SupabaseServer.js");

const deleteTestCase = async (req, res) => {
  try {
    const {id} = req.query;
    const {data, error} = await supabase
      .from("test_cases")
      .delete()
      .eq("id", id);
    if (error) {
      console.log("deleteTestCase ~ error:", error);
      return res.json({err: error, status: 400});
    }
    res.json({data, status: 200, statusText: "OK"});
  } catch (err) {
    console.log("Error while deleting test case:", err);
    res.json({err, status: 500});
  }
};
export default deleteTestCase;
