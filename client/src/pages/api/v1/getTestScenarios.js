const supabase = require("../SupabaseServer.js")
// get test case scenarios
const getTestScenarios = async (req, res) => {
    console.log('getTestScenarios has been called')
      const user_id = req.query.user_id;
      const { data, error } = await supabase
      .from('test_case')
      .select('*')
      .eq('user_id', user_id)
    
    
        res.json({
          tests: data
          })
      }

export default getTestScenarios;