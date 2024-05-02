const supabase = require("../SupabaseServer.js")

// Save Test Scenarios
const saveTestScenarios = async (req, res) => {
    console.log("body: " + JSON.stringify(req.body));  
    const { data, error } = await supabase
    .from('test_case')
    .insert(
      req.body
    )
  
    res.json({
      result: "saved"
      })
  }
export default saveTestScenarios;