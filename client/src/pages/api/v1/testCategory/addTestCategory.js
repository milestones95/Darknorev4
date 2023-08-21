const supabase = require("../../SupabaseServer.js");

const addTestCategory = async (req, res) => {
  try {
    const {name} = req.body;
    const {data, error} = await supabase
      .from("test_categories")
      .insert({name: name})
      .select();
    if (error) {
      console.log("addTestCategory ~ error:", error);
      res.json({err: error, status: 400});
    }
    if (data) {
      res.json({data, satus: 200, statusText: "OK"});
    }
  } catch (err) {
    console.log("Error while adding test categories:", err);
    res.json({err, status: 500});
  }
};
export default addTestCategory;
