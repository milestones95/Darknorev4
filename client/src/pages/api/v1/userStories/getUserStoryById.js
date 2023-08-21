const supabase = require("../../SupabaseServer.js");

const getUserStoryById = async (req, res) => {
  try {
    const {id} = req.query;
    const {data, error} = await supabase
      .from("user_stories")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      console.log("getUserStoryById, Error: ", JSON.stringify(error));
      return res.json({err: error});
    }
    if (data) {
      res.json({data});
    }
  } catch (err) {
    console.log("Error while getting user story by id:", err);
    res.json({err});
  }
};
export default getUserStoryById;
