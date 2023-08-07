const supabase = require("../../SupabaseServer.js");

const createNewProject = async (req, res) => {
    try {
        console.log(req.body);
        const { name, user_id } = req.body;
        const { data, error } = await supabase
        .from('projects')
        .insert({ name, user_id })
        .select()
        
        if (error) {
            console.log("createProject, Error: ", JSON.stringify(error));
            return res.json({ err: error, status: 400 });
        } 
        if (data) {
            console.log("createProject, Data: ", JSON.stringify(data));
            res.json({ data: data[0], status: 200, statusText: "OK" });
        }

    } catch (err) {
        console.log("Error While Creating New Project: ERROR => ", JSON.stringify(err));
        res.json({ err, status: 500 });
    }
}
export default createNewProject;