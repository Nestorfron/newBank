import React, { useContext, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.jsx";
import Swal from "sweetalert2";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
import { CreateUsers } from "./CreateUsers.jsx";
import { EditUsers } from "./EditUsers.jsx";
import {
  Avatar,
  Button,
  Input,
  Chip,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Tabs,
  Tab,
  Pagination,
} from "@nextui-org/react";
import {UserSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import useTokenExpiration from "../hooks/useTokenExpitarion.jsx";
import { LucideDam } from "lucide-react";

const statusColorMap = {
  active: "success",
  inactive: "danger",
};

export const Users = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  //useTokenExpiration();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const statusColor = {
    all: "secondary",
    active: "success",
    inactive: "danger",
  };

  // Filtrar y ordenar las migraciones según los filtros
  const filteredItems = useMemo(() => {
    let filteredUsers = [...store.users];

    // Filtrar por estado de la migración (si no es "todos")
    if (activeTab !== "all") {
      filteredUsers = filteredUsers.filter((user) =>
        user.is_active ? activeTab === "active" : activeTab === "inactive"
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
    /*   const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");
      return;
    } */
  }, []);

  return (
    <div>
      {/* <div className="flex justify-center items-center mb-2">
          <h2 className="text-2xl font-bold ml-2">Masters</h2>
         
        </div> */}
      {/* Filtros de búsqueda y orden */}
      <Card className="mb-5 w-full">
        <CardBody>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="w-full md:w-1/3">
              <Input
                isClearable
                placeholder="Buscar por Usuario..."
                value={filterValue}
                onClear={() => setFilterValue("")}
                onValueChange={setFilterValue}
                className="pl-2 w-full"
                startContent={<SearchIcon />}
              />
            </div>

            <div className="flex items-center space-x-2">
              <CreateUsers className="w-full" />
            </div>
          </div>
        </CardBody>
      </Card>

      {/*Tabs */}
      <Tabs
        aria-label="Options"
        selectedKey={activeTab}
        onSelectionChange={setActiveTab}
        variant="bordered"
        color={statusColor[activeTab]}
      >
        <Tab key="all" title="Todos" />
        <Tab key="active" title="Activos" />
        <Tab key="inactive" title="Inactivos" />
      </Tabs>

      {/* Tarjetas filtradas y ordenadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        <AnimatePresence>
          {currentCards.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <Card className="h-full w-[380px] flex flex-col overflow-hidden border-t-2 border-l-2 shadow-lg black:shadow-white hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex justify-between items-start mt-2 ml-2">
                  <div className="flex items-center space-x-4">
                    <Avatar
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.names} ${user.last_names}`}
                      name={`${user.names} ${user.last_names}`}
                    />
                    <div>
                      <span className="text-xl font-bold truncate">
                        {user.names} {user.last_names}
                      </span>
                      <p className="text-sm text-gray-500">{user.user_name}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="ml-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex flex-col">
                    <div className="flex items-center">
                      <UserSquare className="h-5 w-5 text-green-500 mr-1" />
                    <span className="text-sm font-semibold truncate ml-1">
                     Empleado : 
                    </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-100 ml-7">
                      {user.employee_number}
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <Chip
                        color={
                          statusColor[user.is_active ? "active" : "inactive"]
                        }
                        status={user.is_active ? "active" : "inactive"}
                        variant="shadow"
                        size="sm"
                        className="mr-3"
                      >
                        {user.is_active ? "Activo" : "Inactivo"}
                      </Chip>
                    </div>
                  </div>

                  
                </CardBody>
                <CardFooter className="mb-2">
                  <div className="flex justify-center w-full">
                    <EditUsers user={user} />
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Paginación */}
      <div className="flex justify-center mt-4">
        <Pagination
          loop
          showControls
          color="secondary"
          total={Math.ceil(filteredItems.length / cardsPerPage)}
          page={currentPage}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};
