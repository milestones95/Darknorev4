const supabase = require("../SupabaseClient.js").supabase

// get Test automated
const getTestAutomated = async (req, res) => {

    const { data, error } = await supabase
    .from('automated_tests')
    .select('*')
    res.json([data])
    }


export default getTestAutomated;