const supabase = require("../SupabaseServer");

const getCurrentCompanyTestSuites = async (req, res) => {
    try {
        const { company } = req.query;
        const { data, error } = await supabase
            .from("test-suite-result")
            .select("*")
            .eq("company", company);

        if (error) {
            console.log("getCurrentCompanyTestSuites Error --> ", JSON.stringify(error));
            return res.json({ err: error });
        }
        if (data) {
            console.log("Data --> ", data);
            res.json({ data });
        }
    } catch (err) {
        console.log("Error while getting test-suites of company --> ", err);
        res.json({ err });
    }
};
export default getCurrentCompanyTestSuites;
