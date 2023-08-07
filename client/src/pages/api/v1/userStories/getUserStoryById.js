const supabase = require("../../SupabaseServer.js");

const getUserStoryById = async (req, res) => {
    try {
        const { id } = req.query;
        const { data, error } = await supabase
        .from('user_stories')
        .select()
        .eq("id", id)
        .single()
        
        if (error) {
            console.log("getUserStoryById, Error: ", JSON.stringify(error));
            return res.json({ err: error});
        } 
        if (data) {
            console.log("getUserStoryById, Data: ", JSON.stringify(data));
            res.json({ data });
        }

    } catch (err) {
        console.log("Error While Getting Projects: ERROR => ", JSON.stringify(err));
        res.json({ err });
    }
}
export default getUserStoryById;