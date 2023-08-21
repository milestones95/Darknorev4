const supabase = require("../../SupabaseServer.js");

const getTestCategories = async (req, res) => {
  try {
    const {scenario_type} = req.query;
    const {data, error} = await supabase
      .from("test_categories")
      .select()
      .eq("name", scenario_type)
      .single();
    if (error) {
      console.log("getTestCategories ~ error:", error);
      res.json({err: error, status: 400});
    }
    if (data) {
      res.json({data, satus: 200, statusText: "OK"});
    }
  } catch (err) {
    console.log("Error whilte getting test categories:", err);
    res.json({err, status: 500});
  }
};
export default getTestCategories;
