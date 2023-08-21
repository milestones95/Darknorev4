const supabase = require("../../SupabaseServer.js");

const getAllProjects = async (req, res) => {
  try {
    const {user_id} = req.query;
    const {data, error} = await supabase
      .from("projects")
      .select("*")
      .match({user_id});

    if (error) {
      console.log("getProjects, Error: ", JSON.stringify(error));
      return res.json({err: error, status: 400});
    }
    if (data) {
      res.json({data, status: 200, statusText: "OK"});
    }
  } catch (err) {
    console.log("Error While Getting Projects: ERROR => ", JSON.stringify(err));
    res.json({err});
  }
};
export default getAllProjects;
