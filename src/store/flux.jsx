const getState = ({ getStore, getActions, setStore }) => {
  const today = new Date();

  return {
    store: {
      new: [],
      me: [],
      user: [],
      engineer: [],
      admin: [],
      users: [],
      admins: [],
      engineers: [],
      providers: [],
      branchs: [],
      links: [],
      assets: [],
      usersMB: [],
      migrations: [],
      migrationsByUserId: [],
      migrationByProviderId: [],
      migrationByBranchId: [],
      providerMigrations: [],
      branch: [],
      provider: [],
      link: [],
      asset: [],
      userMB: [],
      migration: [],
      messages: [],
      history: [],
      role: ["Master", "Admin", "Ingeniero de Campo"],
    },
    actions: {
      ////////////  USER SECTION //////////////////

      //SCRYPT

      start_master: async (
        user_name,
        password,
        names,
        last_names,
        employee_number,
        subzone,
        role,
        is_active
      ) => {
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/start_master",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_name,
                password,
                names,
                last_names,
                employee_number,
                subzone,
                role,
                is_active,
              }),
            }
          );
          if (!response.ok) {
            return false;
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

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
        const store = getStore();
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
          actions.add_history(
            "El usuario " +
              store.me.role +
              " " +
              store.me.user_name +
              " ha creado el usuario id N° " +
              data.new_user.id
          );
          actions.getUsers();

          return data;
        } catch (error) {
          console.log(error);
        }
      },

      //CREATE ADMINS

      create_admins: async (
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
        const store = getStore();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/create_admins",
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
            return true;
          }
          const data = await response.json();
          actions.add_history(
            "El usuario " +
              store.me.role +
              " " +
              store.me.user_name +
              " ha creado el Admins id N° " +
              data.new_admins.id
          );
          actions.getAdmins();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      //CREATE ENGINEER

      create_engineer: async (
        user_name,
        password,
        names,
        last_names,
        employee_number,
        subzone,
        provider_id,
        is_active,
        role,
        user_id,
        admins_id
      ) => {
        console.log(
          user_name,
          password,
          names,
          last_names,
          employee_number,
          subzone,
          provider_id,
          is_active,
          role,
          user_id,
          admins_id
        );
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        const store = getStore();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/create_engineer",
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
                provider_id,
                is_active,
                role,
                user_id,
                admins_id,
              }),
            }
          );
          if (!response.ok) {
            return true;
          }
          const data = await response.json();
          actions.add_history(
            "El usuario " +
              store.me.role +
              " " +
              store.me.user_name +
              " ha creado el Engineer id N° " +
              data.new_engineer.id
          );
          actions.getEngineers();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      //LOGIN

      login: async (user_name, password) => {
        const actions = getActions();
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
          actions.getMe();
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
          }

          if (data.role === "Master") {
            actions.getUserById(data.id);
          } else if (data.role === "Admin") {
            actions.getAdminsById(data.id);
          } else if (data.role === "Ingeniero de Campo") {
            actions.getEngineersById(data.id);
          }
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      //GET ALL USERS

      getUsers: async () => {
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/users",
            {
              method: "GET",
            }
          );
          const data = await response.json();
          if (response.ok) {
            setStore({ users: data.users });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET ALL ADMINS

      getAdmins: async () => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/admins",
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setStore({ admins: data.admins });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET ALL ENGINEERS

      getEngineers: async () => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/engineers",
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setStore({ engineers: data.engineers });
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
            setStore({ branchs: data.branchs });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET ALL LINKS

      getLinks: async () => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/links",
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setStore({ links: data.links });
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
            setStore({ history: data.history });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET MIGRATION BY PROVIDER ID

      getMigrationByProviderId: async (providerId) => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/migration/" + providerId,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setStore({ migrationsByProviderId: data.migration });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET MIGRATION BY BRANCH ID

      getMigrationByBranchId: async (branchId) => {
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/migration/" + branchId,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setStore({ migrationByProviderId: data.migration });
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

      //GET ADMIN BY ID

      getAdminById: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/admins/" + id,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setStore({ admin: data.admin });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET ADMINS BY ID

      getAdminsById: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/admins/" + id,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setStore({ admin: data.admin });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET ENGINEERS BY ID

      getEngineersById: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/engineer/" + id,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setStore({ engineer: data.engineer });
          }
          actions.getProviderById(data.engineer.provider_id);
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
            setStore({ provider: data.provider });
          }
        } catch (error) {
          console.log(error);
        }
      },

      //GET LINK BY ID

      getLinkById: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/link/" + id,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setStore({ link: data.link });
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
        branch_subzone,
        branch_work_stations,
        branch_category,
        branch_saturday,
        user_id,
        admins_id,
        engineer_id
      ) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        const store = getStore();
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
              branch_work_stations,
              branch_category,
              branch_saturday,
              user_id,
              admins_id,
              engineer_id,
            }),
          }
        );
        if (!response.ok) {
          return true;
        }
        const data = await response.json();
        actions.add_history(
          "El usuario " +
            store.me.role +
            " " +
            store.me.user_name +
            " se ha creado la sucursal id N° " +
            data.new_branch.id,
          null,
          data.new_branch.id,
          null,
          null,
          today
        );
        actions.getBranchs();
        return data;
      },

      //ADD PROVIDER

      add_provider: async (
        branch_id,
        company_name,
        rfc,
        service,
        user_id,
        admins_id
      ) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        const store = getStore();
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
              user_id,
              admins_id,
            }),
          }
        );
        if (!response.ok) {
          return true;
        }
        const data = await response.json();
        actions.add_history(
          "El usuario " +
            store.me.role +
            " " +
            store.me.user_name +
            " se ha creado el proveedor id N° " +
            data.new_provider.id,
          data.new_provider.id,
          null,
          null,
          null,
          today,
          null
        );
        actions.getProviders();
        return data;
      },

      //ADD LINK

      add_link: async (
        type,
        description,
        speed,
        status,
        user_id,
        admins_id,
        engineer_id,
        provider_id,
        branch_id
      ) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        const store = getStore();
        const response = await fetch(
          import.meta.env.VITE_API_URL + "/add_link",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({
              type,
              description,
              speed,
              status,
              user_id,
              admins_id,
              engineer_id,
              provider_id,
              branch_id,
            }),
          }
        );
        if (!response.ok) {
          return true;
        }
        const data = await response.json();
        actions.getLinks();
        actions.add_history(
          "El usuario " +
            store.me.role +
            " " +
            store.me.user_name +
            " se ha creado el link id N° " +
            data.new_link.id,
          null,
          null,
          null,
          null,
          today,
          data.new_link.id
        );
        return data;
      },

      //ADD ASSET

      add_asset: async (
        asset_type,
        asset_brand,
        asset_model,
        asset_serial,
        asset_inventory_number,
        provider_id,
        branch_id,
        user_id,
        admins_id,
        engineer_id,
        user_mb_id
      ) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        const store = getStore();
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
              branch_id,
              user_id,
              admins_id,
              engineer_id,
              user_mb_id,
            }),
          }
        );
        if (!response.ok) {
          return true;
          return false;
        }
        const data = await response.json();
        actions.add_history(
          "El usuario " +
            store.me.role +
            " " +
            store.me.user_name +
            " se ha creado el activo id N° " +
            data.new_asset.id,
          data.new_asset.provider_id,
          data.new_asset.branch_id,
          null,
          data.new_asset.id,
          today,
          null
        );
        actions.getAssets();
        return data;
      },

      //ADD USERMB

      add_userMB: async (
        role,
        is_active,
        names,
        last_names,
        employee_number,
        extension_phone,
        user_id,
        branch_id,
        admins_id,
        engineer_id
      ) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        const store = getStore();
        const response = await fetch(
          import.meta.env.VITE_API_URL + "/add_userMB",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({
              role,
              is_active,
              names,
              last_names,
              employee_number,
              extension_phone,
              user_id,
              branch_id,
              admins_id,
              engineer_id,
            }),
          }
        );
        if (!response.ok) {
          return true;
        }
        const data = await response.json();
        actions.add_history(
          "El usuario " +
            store.me.role +
            " " +
            store.me.user_name +
            " se ha creado el usuarioMB id N° " +
            data.new_userMB.id,
          null,
          data.new_userMB.branch_id,
          null,
          null,
          today,
          null
        );
        actions.getUsersMB();
        return data;
      },

      //ADD MIGRATION

      add_migration: async (
        installation_date,
        migration_date,
        migration_description,
        migration_status,
        provider_id,
        branch_id,
        asset_id,
        user_id,
        admins_id,
        engineer_id
      ) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        const store = getStore();
        const migration_provider_id = provider_id;
        const migration_branch_id = branch_id;
        const migration_user_id = user_id;
        const migration_admins_id = admins_id;
        const migration_engineer_id = engineer_id;
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
              asset_id,
              user_id,
              admins_id,
              engineer_id,
            }),
          }
        );
        if (!response.ok) {
          return true;
        }
        const data = await response.json();
        actions.getMigrations();

        actions.add_message(
          "El usuario " +
            store.me.role +
            " " +
            store.me.user_name +
            " ha creado" +
            " la migración id N° " +
            data.new_migration.id,
          migration_provider_id,
          migration_branch_id,
          data.new_migration.id,
          migration_user_id,
          migration_admins_id,
          migration_engineer_id
        );
        actions.add_history(
          "El usuario " +
            store.me.role +
            " " +
            store.me.user_name +
            " ha creado" +
            " la migración id N° " +
            data.new_migration.id,
          migration_provider_id,
          migration_branch_id,
          data.new_migration.id,
          migration_user_id,
          migration_admins_id,
          migration_engineer_id
        );
        return data;
      },

      //ADD MESSAGE

      add_message: async (
        message,
        provider_id,
        branch_id,
        migration_id,
        user_id,
        admins_id,
        engineer_id
      ) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        const store = getStore();
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
              user_id,
              admins_id,
              engineer_id,
            }),
          }
        );
        if (!response.ok) {
          return true;
        }
        const data = await response.json();
        actions.add_history(
          "El usuario " +
            store.me.role +
            " " +
            store.me.user_name +
            " se ha creado el mensaje id N° " +
            data.new_message.id,
          provider_id,
          branch_id,
          migration_id,
          user_id,
          admins_id,
          today,
          null
        );
        actions.getMessages();
        return data;
      },

      //ADD HISTORY

      add_history: async (
        message,
        provider_id,
        branch_id,
        migration_id,
        asset_id,
        date,
        link_id
      ) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
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
              date,
              link_id,
            }),
          }
        );
        if (!response.ok) {
          return true;
        }
        const data = await response.json();
        actions.getHistory();
        return data;
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
        const user_id = id;
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
            return true;
          }
          const data = await response.json();
          actions.add_history(
            "se ha editado el usuario id N° " + user_id,
            null,
            null,
            null,
            null,
            today,
            null
          );
          actions.getUsers();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      //EDIT ADMINS

      editAdmins: async (
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
        const admin_id = id;
        const jwt = localStorage.getItem("token");
        const store = getStore();
        const actions = getActions();
        const response = await fetch(
          import.meta.env.VITE_API_URL + "/edit_admins",
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
          return true;
        }
        const data = await response.json();
        actions.add_history(
          "El usuario " +
            store.me.role +
            " " +
            store.me.user_name +
            " ha editado el Admins id N° " +
            admin_id,
          null,
          null,
          null,
          null,
          today,
          null
        );
        actions.getAdmins();
        return data;
      },

      //EDIT ENGINEER

      editEngineer: async (
        id,
        user_name,
        password,
        names,
        last_names,
        employee_number,
        subzone,
        provider_id,
        is_active,
        role
      ) => {
        const engineer_id = id;
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        const store = getStore();
        const response = await fetch(
          import.meta.env.VITE_API_URL + "/edit_engineer",
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
              provider_id,
              is_active,
              role,
            }),
          }
        );
        if (!response.ok) {
          return true;
        }
        const data = await response.json();
        actions.add_history(
          "El usuario " +
            store.me.role +
            " " +
            store.me.user_name +
            " ha editado el Engineer id N° " +
            engineer_id,
          null,
          null,
          null,
          null,
          today,
          null
        );
        actions.getEngineers();
        return data;
      },

      // EDIT BRANCH

      editBranch: async (
        id,
        branch_cr,
        branch_address,
        branch_zone,
        branch_subzone,
        branch_work_stations,
        branch_category,
        branch_saturday,
        user_id,
        admins_id,
        engineer_id
      ) => {
        const branch_id = id;
        const store = getStore();
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
                branch_work_stations,
                branch_category,
                branch_saturday,
                user_id,
                admins_id,
                engineer_id,
              }),
            }
          );
          if (!response.ok) {
            return true;
          }
          const data = await response.json();
          actions.add_history(
            "El usuario " +
              store.me.role +
              " " +
              store.me.user_name +
              " se ha editado la sucursal id N° " +
              branch_id,
            null,
            branch_id,
            null,
            null,
            today,
            null
          );
          actions.getBranchs();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      // EDIT PROVIDER

      editProvider: async (id, branch, company_name, rfc, service) => {
        const provider_id = id;
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        const store = getStore();
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
            return true;
          }
          const data = await response.json();
          actions.add_history(
            "El usuario " +
              store.me.role +
              " " +
              store.me.user_name +
              " ha editado el proveedor id N° " +
              provider_id,
            provider_id,
            null,
            null,
            null,
            today,
            null
          );
          actions.getProviders();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      // EDIT LINK

      editLink: async (id, type, description, speed, status) => {
        const link_id = id;
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        const store = getStore();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/edit_link",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                id,
                type,
                description,
                speed,
                status,
              }),
            }
          );
          if (!response.ok) {
            return true;
          }
          const data = await response.json();
          actions.add_history(
            "El usuario " +
              store.me.role +
              " " +
              store.me.user_name +
              " se ha editado el link id N° " +
              link_id,
            null,
            null,
            null,
            null,
            today,
            link_id
          );
          actions.getLinks();
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
        asset_inventory_number,
        provider_id,
        branch_id,
        user_id,
        admins_id,
        engineer_id,
        user_mb_id
      ) => {
        const asset_id = id;
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        const store = getStore();
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
                provider_id,
                branch_id,
                user_id,
                admins_id,
                engineer_id,
                user_mb_id,
              }),
            }
          );
          if (!response.ok) {
            return true;
          }
          const data = await response.json();
          actions.add_history(
            "El usuario " +
              store.me.role +
              " " +
              store.me.user_name +
              " se ha editado el activo id N° " +
              asset_id,
            null,
            null,
            null,
            asset_id,
            today,
            null
          );
          actions.getAssets();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      // EDIT ASSET USER MB

      editAssetUserMB: async (id, userMB_id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        const store = getStore();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/edit_asset_userMB",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                id,
                userMB_id,
              }),
            }
          );
          if (!response.ok) {
            return true;
          }
          const data = await response.json();
          actions.add_history(
            "El usuario " +
              store.me.role +
              " " +
              store.me.user_name +
              " se ha editado el activo id N° " +
              id,
            null,
            null,
            null,
            null,
            today,
            null
          );
          actions.getAssets();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      // EDIT USER MB

      editUserMB: async (
        id,
        role,
        is_active,
        names,
        last_names,
        employee_number,
        extension_phone,
        branch_id,
        user_id,
        admins_id,
        engineer_id
      ) => {
        const userMB_id = id;
        const userMB_branch_id = branch_id;
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        const store = getStore();
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
                role,
                is_active,
                names,
                last_names,
                employee_number,
                extension_phone,
                branch_id,
                user_id,
                admins_id,
                engineer_id,
              }),
            }
          );
          if (!response.ok) {
            return true;
          }
          const data = await response.json();
          actions.add_history(
            "El usuario " +
              store.me.role +
              " " +
              store.me.user_name +
              " se ha editado el usuarioMB id N° " +
              userMB_id,
            null,
            userMB_branch_id,
            null,
            null,
            today,
            null
          );
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
        migration_status,
        provider_id,
        branch_id,
        asset_id,
        user_id,
        admins_id,
        engineer_id
      ) => {
        const migration_id = id;
        const new_provider_id = provider_id;
        const new_branch_id = branch_id;
        const new_user_id = user_id;
        const new_admins_id = admins_id;
        const new_engineer_id = engineer_id;
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        const store = getStore();
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
                provider_id,
                branch_id,
                asset_id,
                user_id,
                admins_id,
                engineer_id,
              }),
            }
          );
          if (!response.ok) {
            return true;
          }
          const data = await response.json();
          actions.getMigrations();

          actions.add_message(
            "El usuario " +
              store.me.role +
              " " +
              store.me.user_name +
              " ha actualizado" +
              " la migración id N° " +
              migration_id,
            new_provider_id,
            new_branch_id,
            migration_id,
            new_user_id,
            new_admins_id,
            new_engineer_id
          );
          actions.add_history(
            "El usuario " +
              store.me.role +
              " " +
              store.me.user_name +
              " se ha editado la migracion id N° " +
              migration_id,
            new_provider_id,
            new_branch_id,
            migration_id,
            null,
            null,
            null,
            null,
            today,
            null
          );
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      //EDIT MIGRATION STATUS

      editMigrationStatus: async (id, status) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/edit_migration_status",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({ id, status }),
            }
          );
          if (!response.ok) {
            return console.log(
              "No se pudo actualizar el estado de la migración"
            );
          }
          const data = await response.json();
          actions.getMigrations(); // Si es necesario, actualiza la lista de migraciones
          return data;
        } catch (error) {
          console.log(error);
        }
      },
      //EDIT MESSAGE

      editMessage: async (id, message) => {
        const message_id = id;
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        const store = getStore();
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
            return true;
          }
          const data = await response.json();
          actions.add_history(
            "El usuario " +
              store.me.role +
              " " +
              store.me.user_name +
              " ha editado el mensaje id N° " +
              message_id,
            null,
            null,
            null,
            null,
            today,
            null
          );
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
        const store = getStore();
        const history_id = id;
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
            return true;
          }
          const data = await response.json();
          actions.add_history(
            "El usuario " +
              store.me.role +
              " " +
              store.me.user_name +
              " ha editado el mensaje id N° " +
              history_id,
            null,
            null,
            null,
            null,
            today,
            null
          );
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
        const branch_id = id;
        const store = getStore();
        actions.add_history(
          "El usuario " +
            store.me.role +
            " " +
            store.me.user_name +
            " ha eliminado o ha intentado eliminar la sucursal id N° " +
            branch_id,
          null,
          null,
          null,
          null,
          today,
          null
        );
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
            return true;
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
        const provider_id = id;
        const store = getStore();
        actions.add_history(
          "El usuario " +
            store.me.role +
            " " +
            store.me.user_name +
            " ha eliminado o ha intentado eliminar el proveedor id N° " +
            provider_id,
          null,
          null,
          null,
          null,
          today,
          null
        );
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
            return true;
          }
          const data = await response.json();
          actions.getProviders();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      // DELETE LINK

      deleteLink: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        const link_id = id;
        const store = getStore();
        actions.add_history(
          "El usuario " +
            store.me.role +
            " " +
            store.me.user_name +
            " ha eliminado o ha intentado eliminar el link id N° " +
            link_id,
          null,
          null,
          null,
          null,
          today,
          null
        );
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/delete_link",
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
            return true;
          }
          const data = await response.json();
          actions.getLinks();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      // DELETE ASSET

      deleteAsset: async (id) => {
        const jwt = localStorage.getItem("token");
        const actions = getActions();
        const asset_id = id;
        const store = getStore();
        actions.add_history(
          "El usuario " +
            store.me.role +
            " " +
            store.me.user_name +
            " ha eliminado o ha intentado eliminar el activo id N° " +
            asset_id,
          null,
          null,
          null,
          null,
          today,
          null
        );
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
            return true;
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
        const userMB_id = id;
        const store = getStore();
        actions.add_history(
          "El usuario " +
            store.me.role +
            " " +
            store.me.user_name +
            " ha eliminado o ha intentado eliminar el usuarioMB id N° " +
            userMB_id,
          null,
          null,
          null,
          null,
          today,
          null
        );
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
            return true;
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
        const migration_id = id;
        const store = getStore();
        actions.add_history(
          "El usuario " +
            store.me.role +
            " " +
            store.me.user_name +
            " ha eliminado o ha intentado eliminar la migración id N° " +
            migration_id,
          null,
          null,
          null,
          null,
          today,
          null
        );
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
            return true;
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
        const message_id = id;
        const store = getStore();
        actions.add_history(
          "El usuario " +
            store.me.role +
            " " +
            store.me.user_name +
            " ha eliminado o ha intentado eliminar el mensaje id N° " +
            message_id,
          null,
          null,
          null,
          null,
          today,
          null
        );
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
            return true;
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
        const history_id = id;
        const store = getStore();
        actions.add_history(
          "El usuario " +
            store.me.role +
            " " +
            store.me.user_name +
            " ha eliminado o ha intentado eliminar el mensaje id N° " +
            history_id,
          null,
          null,
          null,
          null,
          today,
          null
        );
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
            return true;
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
