const supabase = require("../../SupabaseServer.js");

const getTestCaseById = async (req, res) => {
  try {
    const {testCaseId} = req.query;
    const {data, error} = await supabase
      .from("test_cases")
      .select("*, test_categories(name)")
      .eq("id", testCaseId)
      .single();
    if (error) {
      console.log("getTestCaseById ~ error:", error);
    }
    if (data) {
      res.json({data, status: 200, statusText: "OK"});
    }
  } catch (error) {
    console.log("Error while getting test case by id:", error);
    res.json({error, status: 500});
  }
};

export default getTestCaseById;
