const supabase = require("../SupabaseServer");

const updateCompanyName = async (user_id, company_name) => {
  try {
    const { data, error } = await supabase
    .from('users')
    .insert({
      user_id : user_id,
      company_name : company_name
    }
    )
    console.log("Saved")
  } catch (err) {
    console.log("Error while saving user company:", err);
  }
};
export default updateCompanyName;
