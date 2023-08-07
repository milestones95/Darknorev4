const supabase = require("../../SupabaseServer.js");

const createNewScenarioType = async (req, res) => {
    try {
        const { name } = req.body;
        const { data, error } = await supabase
        .from('test_categories')
        .insert({ name })
        .select()
        
        if (error) {
            console.log("createNewScenarioType, Error: ", JSON.stringify(error));
            return res.json({ err: error});
        } 
        if (data) {
            console.log("createNewScenarioType, Data: ", JSON.stringify(data));
            res.json({ data: data[0]});
        }

    } catch (err) {
        console.log("Error While Creating New Scenario type: ERROR => ", JSON.stringify(err));
        res.json({ err });
    }
}
export default createNewScenarioType;