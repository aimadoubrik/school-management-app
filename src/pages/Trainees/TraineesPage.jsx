import { useEffect } from "react";
import { supabase } from "../../services/supabaseClient";

function TraineesPage() {
  async function fetchUsers() {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        name,
        email,
        role_id (
          name
        ),
        created_at,
        last_login,
        status,
        phone_number,
        bio,
        website,
        address
      `);

    if (error) {
      console.error(error);
    } else {
      console.log(data);
    }
  }


  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Trainees</h1>
    </div>
  );
}

export default TraineesPage;