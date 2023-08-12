const supabase = require("../../SupabaseServer.js");

const createNewUserStory = async (req, res) => {
    try {
        const { name, project_id, user_story_details, acceptance_criteria } = req.body;
        const { data, error } = await supabase
        .from('user_stories')
        .insert({ name, project_id, user_story_details, acceptance_criteria })
        .select()
        
        if (error) {
            console.log("createNewUserStory, Error: ", JSON.stringify(error));
            return res.json({ err: error, status: 400});
        } 
        if (data) {
            console.log("createNewUserStory, Data: ", JSON.stringify(data));
            res.json({ data: data[0], status: 200});
        }

    } catch (err) {
        console.log("Error While Creating New UserStory: ERROR => ", JSON.stringify(err));
        res.json({ err });
    }
}
export default createNewUserStory;