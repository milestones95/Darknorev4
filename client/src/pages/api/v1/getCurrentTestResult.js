const supabase = require("../SupabaseServer");

const getCurrentTestResult = async (req, res) => {
  try {
    const {test_id} = req.query;
    const {data, error} = await supabase
      .from("test-suite-result")
      .select()
      .eq("id", test_id)
      .single();

    if (error) {
      console.log("getCurrentTestResult, Error: ", JSON.stringify(error));
      return res.json({err: error});
    }
    if (data) {
      res.json({data});
    }
  } catch (err) {
    console.log("Error while getting user result by id:", err);
    res.json({err});
  }
};
export default getCurrentTestResult;
