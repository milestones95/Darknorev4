const supabase = require("../../SupabaseServer.js");

const getTestCategories = async (req, res) => {
    try {
        const { scenario_type } = req.query;
        const { data, error } = await supabase
        .from("test_categories")
        .select()
        .eq("name", scenario_type)
        .single();
        if (error) {
            console.log("🚀 ~ file: getTestCategories.js:9 ~ getTestCategories ~ error:", error)
            res.json({ err: error, status: 400 });
        }
        if (data) {
            console.log("🚀 ~ file: getTestCategories.js:12 ~ getTestCategories ~ data:", data)
            res.json({ data, satus: 200, statusText: "OK" });
        }
    } catch (err) {
        console.log("🚀 ~ file: getTestCategories.js:15 ~ getTestCategories ~ err:", err)
        res.json({ err, status: 500 });
    }
}
export default getTestCategories;