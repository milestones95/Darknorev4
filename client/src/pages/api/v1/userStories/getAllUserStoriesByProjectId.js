const supabase = require("../../SupabaseServer.js");

const getAllUserStoriesByProjectId = async (req, res) => {
  try {
    const {project_id} = req.query;
    const {data, error} = await supabase
      .from("user_stories")
      .select("*")
      .match({project_id});

    if (error) {
      console.log(
        "getAllUserStoriesByProjectId, Error: ",
        JSON.stringify(error)
      );
      return res.json({err: error});
    }
    if (data) {
      res.json({data});
    }
  } catch (err) {
    console.log(
      "Error while getting all user stories by project id:",
      JSON.stringify(err)
    );
    res.json({err});
  }
};
export default getAllUserStoriesByProjectId;
