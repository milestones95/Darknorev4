const supabase = require('../../SupabaseServer.js');

const getTestCaseById = async (req, res) => {
  try {
      const { testCaseId } = req.query;
      const { data, error } = await supabase
      .from("test_cases")
      .select('*')
      .eq("id", testCaseId)
      .single();
      if (error) {
          console.log("🚀 ~ file: getTestCases.js:35 ~ getTestCaseById ~ error:", error)
      }
      if (data) {
          console.log("🚀 ~ file: getTestCases.js:37 ~ getTestCaseById ~ data:", data)
          res.json({ data, status: 200, statusText: "OK" });
      }
  } catch (error) {
      console.log("🚀 ~ file: getTestCases.js:42 ~ getTestCaseById ~ error:", error)
      res.json({ error, status: 500 });
      
  }
}

export default getTestCaseById;