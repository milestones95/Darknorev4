const supabase = require("../../SupabaseServer.js");

const getAllUserStories = async (req, res) => {
    try {
        const { user_id } = req.query;
        const projectsData = await supabase
        .from('projects')
        .select('id')
        .match({ user_id });
        if(projectsData.error) {
            console.log("🚀 ~ file: getAllUserStories.js:11 ~ getAllUserStories ~ projectsData.error:", projectsData.error)
            return res.json({ err: projectsData.error, status: 400 });
        }
        console.log("===========>>>>>> projectsData =>", JSON.stringify(projectsData.data));
        const projectIds = projectsData.data.map((project) => {
            return project.id;
        })
        
        console.log("=========> projectsIds will be", projectIds);
        // console.log("===========>>>>>> projectsData =>", JSON.stringify(projectsData));
        const { data, error } = await supabase
        .from('user_stories')
        .select()
        .in('project_id', projectIds)
        // 08b2b4eb-837d-4933-b2c5-3c22d8d4cbb0
        
        if (error) {
            console.log("getAllUserStories, Error: ", JSON.stringify(error));
            return res.json({ err: error, status: 400});
        } 
        if (data) {
            console.log("getAllUserStories, Data: ", JSON.stringify(data));
            res.json({ data, status: 200, statusText: "OK" });
        }

    } catch (err) {
        console.log("🚀 ~ file: getAllUserStories.js:33 ~ getAllUserStories ~ err:", err)
        // console.log("Error While Getting Projects: ERROR => ", JSON.stringify(err));
        res.json({ err });
    }
}
export default getAllUserStories;