const supabase = require("../../SupabaseServer.js");

const updateTestCase = async (req, res) => {
    try {
        const { id } = req.query;
        const { data, error } = await supabase
        .from('test_cases')
        .update(req.body)
        .eq('id', id)
        .select();
        if (error) {
            console.log("🚀 ~ file: upateTestCase.js:12 ~ updateTestCase ~ error:", error);
            res.json({ err: error, status: 400 });
        }
        if (data) {
            console.log("🚀 ~ file: upateTestCase.js:16 ~ updateTestCase ~ data:", data)
            res.json({ data, status: 200, statusText: "OK" });
        }
    } catch (err) {
        console.log("🚀 ~ file: upateTestCase.js:7 ~ updateTestCase ~ err:", JSON.stringify(err));
        res.json({ err, status: 500 });
    }
}
export default updateTestCase;