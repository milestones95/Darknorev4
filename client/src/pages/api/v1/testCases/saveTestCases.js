const supabase = require("../../SupabaseServer.js");

const saveTestCases = async (req, res) => {
    try {
        const { data, error } = await supabase
        .from("test_cases")
        .insert(req.body)
        .select();
        if (error) {
            console.log("🚀 ~ file: saveTestCases.js:11 ~ saveTestCases ~ error:", JSON.stringify(error));
            res.json({ err: error, status: 400, statusText: "OK" });
        }
        if (data) {
            console.log("🚀 ~ file: saveTestCases.js:14 ~ saveTestCases ~ data:", data);
            res.json({ data, status: 200, statusText: "OK" });
        }
    } catch (err) {
        console.log("🚀 ~ file: saveTestCases.js:7 ~ saveTestCases ~ err:", JSON.stringify(err));
        res.json({ err: err, status: 500 });
    }
}
export default saveTestCases;