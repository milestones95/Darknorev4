const supabase = require("../SupabaseServer");

const getCurrentUser = async (req, res) => {
  try {
    const {user_id} = req.query;
    const {data, error} = await supabase
      .from("users")
      .select()
      .eq("user_id", user_id)
      .single();

    if (error) {
      console.log("getCurrentUser Error: ", JSON.stringify(error));
      return res?.json({err: error});
    }
    if (data) {
        console.log("getCurrentUser Data --> ", data);
      res?.json({data});
    }
  } catch (err) {
    console.log("Error while getting user ", err);
    res?.json({err});
  }
};
export default getCurrentUser;
