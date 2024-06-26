const supabase = require("../../SupabaseServer.js");

const createNewUserStory = async (req, res) => {
  try {
    const {
      name,
      project_id,
      user_story_details,
      acceptance_criteria,
      test_steps
    } = req.body;
    const {data, error} = await supabase
      .from("user_stories")
      .insert({
        name,
        project_id,
        user_story_details,
        acceptance_criteria,
        test_steps
      })
      .select();

    if (error) {
      console.log("createNewUserStory, Error: ", JSON.stringify(error));
      return res.json({err: error, status: 400});
    }
    if (data) {
      res.json({data: data[0], status: 200});
    }
  } catch (err) {
    console.log(
      "Error While Creating New UserStory:",
      JSON.stringify(err)
    );
    res.json({err});
  }
};
export default createNewUserStory;
