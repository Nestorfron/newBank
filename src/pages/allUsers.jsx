import React, {
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { CreateUsers } from "../components/CreateUsers.jsx";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
import { Users as Master, ShieldCheck, Wrench, Crown } from "lucide-react";
import {
  Tabs,
  Tab,
  Input,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Pagination,
} from "@nextui-org/react";
import { Context } from "../store/appContext";
import { Users } from "../components/users.jsx";
import { Admins } from "../components/admins.jsx";
import { Engineers } from "../components/engineer.jsx";
import { useNavigate } from "react-router-dom";

import useTokenExpiration from "../hooks/useTokenExpitarion.jsx";

export const AllUsers = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  useTokenExpiration();

  const user = store.me;

  const statusColor = {
    users: "success",
    admins: "warning",
    engineers: "danger",
  };

  // Filtrar y ordenar las migraciones según los filtros
  const filteredItems = useMemo(() => {
    let filteredUsers = [...store.users];

    // Filtrar por estado de la migración (si no es "todos")
    if (activeTab !== "users") {
      filteredUsers = filteredUsers.filter((user) =>
        user.is_active ? activeTab === "admins" : activeTab === "engineers"
      );
    }

    // Filtrar por descripción de migración
    if (filterValue) {
      filteredUsers = filteredUsers.filter((user) =>
        user.user_name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Ordenar por fecha
    return filteredUsers.sort((a, b) => {
      const dateA = new Date(a.installation_date);
      const dateB = new Date(b.installation_date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return filteredUsers;
  }, [store.users, activeTab, filterValue, sortOrder]);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredItems.slice(indexOfFirstCard, indexOfLastCard);

  useEffect(() => {
    if (user.role === "Ingeniero de Campo") {
      navigate("/engenieerDashboard");
      return;
    }
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");
      return;
    }
    actions.getMe();
    actions.getUsers();
    actions.getAdmins();
    actions.getEngineers();
  }, []);

  return (
    <>    
    <div className="m-4">
    <div className="container mx-auto px-4">
      
              <div className="flex justify-between items-center mb-2 w-full mt-8 mb-8">
          <h2 className="text-2xl font-bold">Gestor de Usuarios</h2>
          {/* <CreateUsers className="w-auto" /> */}
        </div>
      
        {/* <div className="w-full max-w-sm mb-3">
          <Input
            isClearable
            placeholder="Buscar por Usuario..."
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={setFilterValue}
            className="pl-2 w-full"
            startContent={<SearchIcon />}
          />
        </div> */}
        
        <div className="flex flex-grow:row-span-2 flex-col gap-4 justify-center items-center">
          <Tabs
            aria-label="Options"
            selectedKey={activeTab}
            onSelectionChange={setActiveTab}
            variant="bordered"
            color={statusColor[activeTab]}
            fullWidth
          >
            <Tab
              key="users"
              title={
                <div className="flex items-center">
                  <Crown className="mr-2 h-4 w-4" />
                  Masters
                </div>
              }
              className="w-full"
            >
              {user.role === "Master" ? <Users /> : null}
            </Tab>
            <Tab
              key="admins"
              title={
                <div className="flex items-center">
                  <ShieldCheck className="mr-2 h-4 w-4" /> Adminsistradores
                </div>
              }
              className="w-full"
            >
            
              {user.role === "Admin" || user.role === "Master" ? (
                <Admins />
              ) : null}
            </Tab>
            <Tab
              key="engineers"
              title={
                <div className="flex items-center">
                  <Wrench className="mr-2 h-4 w-4" /> Ingenieros
                </div>
              }
              className="w-full"
            >
             
              {user.role === "Admin" || user.role === "Master" ? (
                <Engineers />
              ) : null}
            </Tab>
          </Tabs>
        </div>

        </div>
        </div>
        </>

  );
};
