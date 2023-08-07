const supabase = require("../../SupabaseServer.js");

const getScenarioType = async (req, res) => {
    try {
        const { name } = req.query;
        const { data, error } = await supabase
        .from('test_categories')
        .select()
        .eq("name", name)
        .single()
        
        if (error) {
            console.log("getScenarioType, Error: ", JSON.stringify(error));
            return res.json({ err: error});
        } 
        if (data) {
            console.log("getScenarioType, Data: ", JSON.stringify(data));
            res.json({ data });
        }

    } catch (err) {
        console.log("Error While Getting Scenario Type: ERROR => ", JSON.stringify(err));
        res.json({ err });
    }
}
export default getScenarioType;