const supabase = require("../../SupabaseServer.js");

const getAllUserStories = async (req, res) => {
    try {
        const { project_id } = req.query;
        const { data, error } = await supabase
        .from('user_stories')
        .select('*')
        
        if (error) {
            console.log("getAllUserStories, Error: ", JSON.stringify(error));
            return res.json({ err: error});
        } 
        if (data) {
            console.log("getAllUserStories, Data: ", JSON.stringify(data));
            res.json({ data });
        }

    } catch (err) {
        console.log("Error While Getting Projects: ERROR => ", JSON.stringify(err));
        res.json({ err });
    }
}
export default getAllUserStories;