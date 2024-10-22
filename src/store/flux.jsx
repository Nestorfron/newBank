const getState = ({ getStore, getActions, setStore }) => {

  // import.meta.env.VITE_API_URL;

  return {
    store: {
      users: [],
      providers: [],
      branchs: [],
      assets: [],
      usersMB: [],
      migrations: [],
      branch: [],
      provider: [],
      asset: [],
      userMB: [],
      migration: [],
      role: ["Master", "Admin", "Ingeniero de Campo"],
    },
    actions: {
      ////////////  USER SECTION //////////////////

      //REGISTER

      register: async (
        user_name,
        password,
        names,
        last_names,
        employee_number,
        subzone,
        is_active,
        role
      ) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/signup",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                user_name,
                password,
                names,
                last_names,
                employee_number,
                subzone,
                is_active,
                role,
              }),
            }
          );
          if (!response.ok) {
            return false;
          }
          const data = await response.json();
          actions.getUsers();

          return data;
        } catch (error) {
          console.log(error);
        }
      },

      //LOGIN

      login: async (user_name, password) => {
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/signin",
            {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({ user_name, password }),
            }
          );
          if (!response.ok) {
            return false;
          }
          const data = await response.json();
          localStorage.setItem("token", data.token);
          return true;
        } catch (error) {
          console.log(error);
        }
      },

      //LOGOUT

      logout: () => {
        localStorage.removeItem("token");
      },

      ////////////  GET SECTION //////////////////

      //GET ME

      getMe: async () => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(import.meta.env.VITE_API_URL + "/me", {
            method: "GET",
            headers: {
              authorization: `Bearer ${jwt}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            console.log(data);
            setStore({ me: data });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET ALL USERS

      getUsers: async () => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(import.meta.env.VITE_API_URL + "/users", {
            method: "GET",
            headers: {
              authorization: `Bearer ${jwt}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            console.log(data);
            setStore({ users: data.users });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET ALL PROVIDERS

      getProviders: async () => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/providers",
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            console.log(data);
            setStore({ providers: data.providers });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET ALL BRANCHS

      getBranchs: async () => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/branchs",
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            console.log(data);
            setStore({ branchs: data.branchs });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET ALL ASSETS

      getAssets: async () => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/assets",
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            console.log(data);
            setStore({ assets: data.assets });
          }
        } catch (error) {
          console.log(error);
        }
      },

      // GET ALL USERSMB

      getUsersMB: async () => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/usersMB",
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            console.log(data);
            setStore({ usersMB: data.usersMB });
          }
        } catch (error) {
          console.log(error);
        }
      },

      // GET ALL MIGRATIONS

      getMigrations: async () => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/migrations",
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            console.log(data);
            setStore({ migrations: data.migrations });
          }
        } catch (error) {
          console.log(error);
        }
      },

      ////////////  GET BY ID SECTION //////////////////

      //GET BRANCH BY ID

      getBranchById: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/branch/" + id,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            console.log(data);
            setStore({ branch: data.branch });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET PROVIDER BY ID

      getProviderById: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/provider/" + id,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            console.log(data);
            setStore({ provider: data.provider });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET ASSET BY ID

      getAssetById: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/asset/" + id,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            console.log(data);
            setStore({ asset: data.asset });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET USER MB BY ID

      getUserMBById: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/userMB/" + id,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            console.log(data);
            setStore({ userMB: data.userMB });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET MIGRATION BY ID

      getMigrationById: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/migration/" + id,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            console.log(data);
            setStore({ migration: data.migration });
          }
        } catch (error) {
          console.log(error);
        }
      },

      ////////////  ADD SECTION //////////////////

      //ADD BRANCH

      add_branch: async (
        branch_cr,
        branch_address,
        branch_zone,
        branch_subzone
      ) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/add_branch",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                branch_cr,
                branch_address,
                branch_zone,
                branch_subzone,
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          actions.getBranchs();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      //ADD PROVIDER

      add_provider: async (branch_id, company_name, rfc, service) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/add_provider",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                branch_id,
                company_name,
                rfc,
                service,
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          actions.getProviders();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      // ADD ASSET
      add_asset: async (
        asset_type,
        asset_brand,
        asset_model,
        asset_serial,
        asset_inventory_number,
        provider_id
      ) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/add_asset",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                asset_type,
                asset_brand,
                asset_model,
                asset_serial,
                asset_inventory_number,
                provider_id,
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          actions.getAssets();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      //ADD USERMB

      add_userMB: async (
        user_name_MB,
        is_active,
        names,
        last_names,
        employee_number,
        branch_id,
        asset_id
      ) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/add_userMB",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                user_name_MB,
                is_active,
                names,
                last_names,
                employee_number,
                branch_id,
                asset_id,
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          actions.getUsersMB();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      //ADD MIGRATION

      add_migration: async (
        installation_date,
        migration_date,
        migration_description,
        migration_status,
        provider_id,
        branch_id
      ) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/add_migration",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                installation_date,
                migration_date,
                migration_description,
                migration_status,
                provider_id,
                branch_id,
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          actions.getMigrations();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      ////////////  EDIT SECTION //////////////////

      //EDIT USER

      editUser: async (
        id,
        user_name,
        password,
        names,
        last_names,
        employee_number,
        subzone,
        is_active,
        role
      ) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/editUser",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                id,
                user_name,
                password,
                names,
                last_names,
                employee_number,
                subzone,
                is_active,
                role,
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          actions.getUsers();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      // EDIT BRANCH

      editBranch: async (
        id,
        branch_cr,
        branch_address,
        branch_zone,
        branch_subzone
      ) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/edit_branch",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                id,
                branch_cr,
                branch_address,
                branch_zone,
                branch_subzone,
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          actions.getBranchs();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      // EDIT PROVIDER

      editProvider: async (id, branch, company_name, rfc, service) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/edit_provider",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                branch,
                id,
                company_name,
                rfc,
                service,
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          actions.getProviders();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      // EDIT ASSET

      editAsset: async (
        id,
        asset_type,
        asset_brand,
        asset_model,
        asset_serial,
        asset_inventory_number
      ) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/edit_asset",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                id,
                asset_type,
                asset_brand,
                asset_model,
                asset_serial,
                asset_inventory_number,
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          actions.getAssets();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      // EDIT USER MB

      editUserMB: async (
        id,
        user_name_MB,
        is_active,
        names,
        last_names,
        employee_number,
        branch_id,
        asset_id
      ) => {
        console.log(
          id,
          user_name_MB,
          is_active,
          names,
          last_names,
          employee_number,
          branch_id,
          asset_id
        );
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/edit_userMB",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                id,
                user_name_MB,
                is_active,
                names,
                last_names,
                employee_number,
                branch_id,
                asset_id,
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          actions.getUsersMB();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      // EDIT MIGRATION

      editMigration: async (
        id,
        installation_date,
        migration_date,
        migration_description,
        migration_status
      ) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/edit_migration",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                id,
                installation_date,
                migration_date,
                migration_description,
                migration_status,
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          actions.getMigrations();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      ////////////  DELETE SECTION //////////////////

      // DELETE BRANCH

      deleteBranch: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/delete_branch",
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                id,
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          actions.getBranchs();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      //DELETE PROVIDER

      deleteProvider: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/delete_provider",
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                id,
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          actions.getProviders();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      // DELETE ASSET

      deleteAsset: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/delete_asset",
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                id,
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          actions.getAssets();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      // DELETE USER MB

      deleteUserMB: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/delete_userMB",
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                id,
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          actions.getUsersMB();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      // DELETE MIGRATION

      deleteMigration: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/delete_migration",
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                id,
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          actions.getMigrations();
          return data;
        } catch (error) {
          console.log(error);
        }
      },
    },
  };
};

export default getState;
