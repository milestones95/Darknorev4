const supabase = require("../../SupabaseServer.js");

const getAllUserStories = async (req, res) => {
  try {
    const {user_id} = req.query;
    const projectsData = await supabase
      .from("projects")
      .select("id")
      .match({user_id});
    if (projectsData.error) {
      console.log("getAllProjects ~ projectsData.error:", projectsData.error);
      return res.json({err: projectsData.error, status: 400});
    }
    const projectIds = projectsData.data.map(project => {
      return project.id;
    });

    const {data, error} = await supabase
      .from("user_stories")
      .select()
      .in("project_id", projectIds);

    if (error) {
      console.log("getAllUserStories, Error: ", JSON.stringify(error));
      return res.json({err: error, status: 400});
    }
    if (data) {
      res.json({data, status: 200, statusText: "OK"});
    }
  } catch (err) {
    console.log("Error while getting all user stories:", err);
    res.json({err});
  }
};
export default getAllUserStories;
