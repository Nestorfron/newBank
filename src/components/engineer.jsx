import React, { useContext, useState, useMemo, useEffect } from "react";
import { Context } from "../store/appContext.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
import { CreateEngineers } from "./CreateEngineers.jsx";
import { EditEngineers } from "./EditEngineers.jsx";
import {
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
import { ArrowUp, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useTokenExpiration from "../hooks/useTokenExpitarion.jsx";

export const Engineers = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  useTokenExpiration();

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
    let filteredEngineers = [...store.engineers];

    // Filtrar por estado de la migración (si no es "todos")
    if (activeTab !== "all") {
      filteredEngineers = filteredEngineers.filter((engineer) =>
        engineer.is_active ? activeTab === "active" : activeTab === "inactive"
      );
    }

    // Filtrar por descripción de migración
    if (filterValue) {
      filteredEngineers = filteredEngineers.filter((engineer) =>
        engineer.user_name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    // Ordenar por fecha
    return filteredEngineers.sort((a, b) => {
      const dateA = new Date(a.installation_date);
      const dateB = new Date(b.installation_date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [store.engineers, activeTab, filterValue, sortOrder]);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredItems.slice(indexOfFirstCard, indexOfLastCard);

  useEffect(() => {}, []);

  return (
    <div className="m-5">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold ml-2">Ingenieros</h2>
        </div>

        {/* Filtros de búsqueda y orden */}
        <Card className="mb-5 w-full">
          <CardBody>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="w-full md:w-1/3">
                <Input
                  isClearable
                  placeholder="Buscar por Ingeniero..."
                  value={filterValue}
                  onClear={() => setFilterValue("")}
                  onValueChange={setFilterValue}
                  className="pl-2 w-full"
                  startContent={<SearchIcon />}
                />
              </div>

              <div className="flex items-center space-x-2">
              <CreateEngineers className="w-full" />

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
            {currentCards.map((engineer) => (
              <motion.div
                key={engineer.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <Card className="h-full w-2/2 flex flex-col hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="flex justify-between items-start mt-2 ml-2">
                    <div>
                      <h2 className="text-xl font-bold">
                        Ingeniero #{engineer.id}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        {engineer.user_name} - {engineer.names} -{" "}
                        {engineer.last_names} - {engineer.employee_number}
                      </p>
                    </div>
                    <div>
                      <Chip
                        color={
                          statusColor[
                            engineer.is_active ? "active" : "inactive"
                          ]
                        }
                        status={engineer.is_active ? "active" : "inactive"}
                        variant="shadow"
                        size="sm"
                        className="mr-3"
                      >
                        {engineer.is_active ? "Activo" : "Inactivo"}
                      </Chip>
                    </div>
                  </CardHeader>
                  <CardBody className="ml-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Fecha de Instalación:{" "}
                      {formatDate(engineer.installation_date)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Fecha de Migración:{" "}
                      {formatDate(
                        engineer.migrations && engineer.migrations.length > 0
                          ? engineer.migrations[0].migration_date
                          : ""
                      )}
                    </p>
                  </CardBody>
                  <CardFooter className="mb-2">
                    <div className="flex justify-center w-full">
                      <EditEngineers engineer={engineer} />
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
