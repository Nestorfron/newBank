import React, { useContext, useState, useMemo, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { MigrationsDetails } from "../components/MigrationsDetails.jsx";
import Swal from "sweetalert2";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
import { CreateMigrations } from "../components/CreateMigration.jsx";
import { ArrowUp, ArrowDown } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import useTokenExpiration from "../hooks/useTokenExpitarion.jsx";

export const Migrations = () => {
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

  const deleteMigration = (id) => {
    Swal.fire({
      title: "Advertencia",
      text: "¿Desea eliminar la Migración?",
      icon: "warning",
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Sí",
    }).then((click) => {
      if (click.isConfirmed) {
        actions.deleteMigration(id).then(() => {
          Swal.fire("Migración eliminada correctamente", "", "success");
        });
      }
    });
  };

  const statusColor = {
    all : "secondary",
    Ordered: "primary",
    In_progress: "warning",
    Completed: "success",
  };

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");
      return;
    }
    actions.getMe();
    actions.getMigrations();
    actions.getBranchs();
    actions.getProviders();
  }, []);

  // Filtrar y ordenar las migraciones según los filtros
  const filteredMigrations = useMemo(() => {
    let migrations = [...store.migrations];

    // Filtrar por estado de la migración (si no es "todos")
    if (activeTab !== "all") {
      migrations = migrations.filter(
        (migration) => migration.migration_status === activeTab
      );
    }

    // Filtrar por descripción de migración
    if (filterValue) {
      migrations = migrations.filter((migration) =>
        migration.migration_description
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    }

    // Ordenar por fecha
    return migrations.sort((a, b) => {
      const dateA = new Date(a.installation_date);
      const dateB = new Date(b.installation_date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [store.migrations, activeTab, filterValue, sortOrder]);

  
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredMigrations.slice(indexOfFirstCard, indexOfLastCard);

  return (
    <div className="m-5">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold ml-2">Gestor de Migraciones</h2>
          <CreateMigrations className="w-full" />
        </div>

        {/* Filtros de búsqueda y orden */}
        <Card className="mb-5">
          <CardBody>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="w-full md:w-1/3">
                <Input
                  isClearable
                  placeholder="Buscar por Migración..."
                  value={filterValue}
                  onClear={() => setFilterValue("")}
                  onValueChange={setFilterValue}
                  className="pl-2 w-full"
                  startContent={<SearchIcon />}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="flex items-center space-x-2 border border-transparent hover:border-gray-300 px-3 py-2 rounded-full"
                >
                  {sortOrder === "asc" ? (
                    <>
                      <ArrowUp className="h-5 w-5 text-primary-500" />
                      <span className="ml-1">Más antiguo</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-5 w-5 text-primary-500" />
                      <span className="ml-1">Más reciente</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Tabs */}
        <Tabs
          aria-label="Options"
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          variant="bordered"
          color={statusColor[activeTab]}
        >
          <Tab key="all" title="Todos" />
          <Tab key="Ordered" title="Ordenadas" />
          <Tab key="In_progress" title="En progreso" />
          <Tab key="Completed" title="Completadas" />
        </Tabs>

        {/* Tarjetas filtradas y ordenadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    <AnimatePresence>
            {currentCards.map((migration) => (
              <motion.div
              key={migration.id}
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
                        Migración #{migration.id}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        {migration.migration_description}
                      </p>
                    </div>
                    <div>
                      <Chip
                        color={statusColor[migration.migration_status]}
                        status={migration.migration_status}
                        variant="shadow"
                        size="sm"
                        className="mr-3"
                      >
                        {migration.migration_status === "Ordered" ? "Ordenada" : migration.migration_status === "In_progress" ? "En Progreso" : "Completada"}
                      </Chip>
                    </div>
                  </CardHeader>
                  <CardBody className="ml-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Fecha de Instalación:{" "}
                      {formatDate(migration.installation_date)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Fecha de Migración: {formatDate(migration.migration_date)}
                    </p>
                  </CardBody>
                  <CardFooter className="mb-2">
                    <div className="flex justify-center w-full">
                      <MigrationsDetails migration={migration} id={migration.id} />
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Paginación */}
        <div className="flex justify-center mt-6">
          <Pagination
            loop
            showControls
            color="primary"
            total={Math.ceil(filteredMigrations.length / cardsPerPage)}
            page={currentPage}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};
