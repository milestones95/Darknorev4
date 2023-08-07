const supabase = require("../../SupabaseServer.js");

const updateUserStory = async (req, res) => {
    try {
        const { id } = req.query;
        const dataToUpdate  = req.body;
        const { data, error } = await supabase
        .from('user_stories')
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        if (error) {
            console.log("updateUserStory, Error: ", JSON.stringify(error));
            res.json({ err: error });
        }
        if (data) {
            console.log("updateUserStory, data: ", JSON.stringify(data));
            res.json({ data: data, status: 200, statusText: 'OK' });
        }
    } catch (err) {
        console.log("Error while Updating User Story Error: ", JSON.stringify(err));
        res.json({ err: err, status: 500});
    }
}
export default updateUserStory;