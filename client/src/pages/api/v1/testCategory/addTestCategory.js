const supabase = require("../../SupabaseServer.js");

const addTestCategory = async (req, res) => {
    try {
        const { category } = req.body;
        const { data, error } = await supabase
        .from("test_categories")
        .insert({ name: category })
        .select();
        if (error) {
            console.log("🚀 ~ file: addTestCategory.js:11 ~ addTestCategory ~ error:", error)
            res.json({ err: error, status: 400 });
        }
        if (data) {
            console.log("🚀 ~ file: addTestCategory.js:15 ~ addTestCategory ~ data:", data)
            res.json({ data, satus: 200, statusText: "OK" });
        }
    } catch (err) {
        console.log("🚀 ~ file: addTestCategory.js:7 ~ addTestCategory ~ err:", err)
        res.json({ err, status: 500 });
    }
}
export default addTestCategory;