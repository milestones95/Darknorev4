const supabase = require("../SupabaseServer.js")

// get Test automated
const getTestAutomated = async (req, res) => {

    const { data, error } = await supabase
    .from('automated_tests')
    .select('*')
    res.json([data])
    }


export default getTestAutomated;