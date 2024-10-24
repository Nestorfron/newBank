import { act } from "react";


const getState = ({ getStore, getActions, setStore }) => {
  // import.meta.env.VITE_API_URL;

  const today = new Date();

 

  return {
    store: {
      new: [],
      me: [],
      user: [],
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
      messages: [],
      history: [],
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
          actions.add_history("se ha registrado el usuario id N° " + data.new_user.id, null, null,null,null,today);
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
        const actions = getActions();
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
            setStore({ me: data });
            actions.getUserById(data.id);
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET ALL USERS

      getUsers: async () => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/users",
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

      //GET ALL MESSAGES

      getMessages: async () => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/messages",
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
            setStore({ messages: data.messages });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET ALL HISTORY

      getHistory: async () => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/history",
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
            setStore({ history: data.history });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET ALL HISTORY BY USER ID

      getHistoryByUserId: async (userId) => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/history/" + userId,
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
            setStore({ history: data.history });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET ALL HISTORY BY PROVIDER ID

      getHistoryByProviderId: async (providerId) => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/history/" + providerId,
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
            setStore({ history: data.history });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET ALL HISTORY BY BRANCH ID

      getHistoryByBranchId: async (branchId) => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/history/" + branchId,
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
            setStore({ history: data.history });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET ALL HISTORY BY MIGRATION ID

      getHistoryByMigrationId: async (migrationId) => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/history/" + migrationId,
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
            setStore({ history: data.history });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET ALL HISTORY BY ASSET ID

      getHistoryByAssetId: async (assetId) => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/history/" + assetId,
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
            setStore({ history: data.history });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET ALL HISTORY BY MESSAGE ID

      getHistoryByMessageId: async (messageId) => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/history/" + messageId,
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
            setStore({ history: data.history });
          }
        } catch (error) {
          console.log(error);
        }
      },


      //GET ALL MESSAGES BY USER ID

      getMessagesByUserId: async (userId) => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/messages/" + userId,
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
            setStore({ messages: data.messages });
          }
        } catch (error) {
          console.log(error);
        }
      },

      ////////////  GET BY ID SECTION //////////////////

      //GET USER BY ID

      getUserById: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/user/" + id,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            console.log(data.user);
            setStore({ user: data.user });
          }
        } catch (error) {
          console.log(error);
        }
      },

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

      //GET MESSAGE BY ID

      getMessageById: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/message/" + id,
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
            setStore({ message: data.message });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET HISTORY BY ID

      getHistoryById: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/history/" + id,
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
            setStore({ history: data.history });
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
          actions.add_history("se ha creado la sucursal id N° " + data.new_branch.id, null, data.new_branch.id,null,null,today);
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
          actions.add_history("se ha creado el proveedor id N° " + data.new_provider.id, data.new_provider.id, null,null,null,today);
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
          actions.add_history("se ha creado el activo id N° " + data.new_asset.id, data.new_asset.provider_id, data.new_asset.branch_id,null,data.new_asset.id,today);
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
          actions.add_history("se ha creado el usuarioMB id N° " + data.new_userMB.id, null, data.new_userMB.branch_id,null,null,today);
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
          console.log(data);
          actions.add_message(data.new_migration.migration_description, data.new_migration.provider_id, data.new_migration.branch_id, data.new_migration.id);
          actions.add_history("se ha creado la migracion id N° " + data.new_migration.id, data.new_migration.provider_id, data.new_migration.branch_id,data.new_migration.id,null,today);
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      //ADD MESSAGE

      add_message: async (message, provider_id, branch_id, migration_id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/add_message",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                message,
                provider_id,
                branch_id,
                migration_id,
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          actions.add_history("se ha creado el mensaje id N° " + data.new_message.id, data.new_message.provider_id, data.new_message.branch_id,data.new_message.migration_id,null,today);
          actions.getMessages();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      //ADD HISTORY

      add_history: async (
        message,
        provider_id,
        branch_id,
        migration_id,
        asset_id,
        date
      ) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/add_history",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                message,
                provider_id,
                branch_id,
                migration_id,
                asset_id,
                date
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          actions.getHistory();
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
        const user_id=id
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
          actions.add_history("se ha editado el usuario id N° " + user_id, null, null,null,null,today);
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
        const branch_id=id
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
          actions.add_history("se ha editado la sucursal id N° " + branch_id, null, branch_id,null,null,today);
          actions.getBranchs();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      // EDIT PROVIDER

      editProvider: async (id, branch, company_name, rfc, service) => {
        const provider_id=id
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
          actions.add_history("se ha editado el proveedor id N° " + provider_id, provider_id, null,null,null,today);
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
        const asset_id=id
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
          actions.add_history("se ha editado el activo id N° " + asset_id, null, null,null,asset_id,today);
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
        const userMB_id=id
        const userMB_branch_id=branch_id
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
          actions.add_history("se ha editado el usuarioMB id N° " + userMB_id, null, userMB_branch_id,null,null,today);
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
          console.log(data);
          actions.add_message("la migración id N° "+data.new_migration.id+" ha sido actualizada", data.new_migration.provider_id, data.new_migration.branch_id, data.new_migration.id);
          actions.add_history("se ha editado la migracion id N° " + data.new_migration.id, data.new_migration.provider_id, data.new_migration.branch_id,data.new_migration.id,null,today);
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      //EDIT MESSAGE

      editMessage: async (id, message) => {
        const message_id=id
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/edit_message",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                id,
                message,
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          actions.add_history("se ha editado el mensaje id N° " +   message_id, null, null,null,null,today);
          actions.getMessages();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      // EDIT HISTORY

      editHistory: async (id, message) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/edit_history",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                id,
                message,
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          actions.getHistory();
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

      //DELETE MESSAGE

      deleteMessage: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/delete_message",
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
          actions.getMessages();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      //DELETE HISTORY

      deleteHistory: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/delete_history",
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
          actions.getHistory();
          return data;
        } catch (error) {
          console.log(error);
        }
      },
    },
  };
};

export default getState;
