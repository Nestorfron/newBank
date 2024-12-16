import React, { useContext, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";
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
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
import { CreateAssets } from "../components/CreateAsset.jsx";
import { EditAssets } from "../components/EditAssets.jsx";
import useTokenExpiration from "../hooks/useTokenExpitarion.jsx";
import MigrationsList from "../components/migrationsList.jsx";

export const Assets = () => {
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

const statusColor={
  all : "secondary",
  active: "success",
  inactive: "danger",
}

  const deleteAsset = (id) => {
    Swal.fire({
      title: "Advertencia",
      text: "¿Desea eliminar el Activo?",
      icon: "warning",
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Sí",
    }).then((click) => {
      if (click.isConfirmed) {
        actions.deleteAsset(id).then(() => {
          Swal.fire("Activo eliminado correctamente", "", "success");
        });
      }
    });
  };

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");
      return;
    }
    actions.getMe();
    actions.getAssets();
    actions.getProviders();
  }, []);


  // Filtrar y ordenar las migraciones según los filtros
  const filteredItems = useMemo(() => {
    let filteredAssets = [...store.assets];

    // Filtrar por estado de la migración (si no es "todos")
    if (activeTab !== "all") {
      filteredAssets = filteredAssets.filter(
        (asset) => asset.asset_type === activeTab
      );
    }

    // Filtrar por descripción de migración
    if (filterValue) {
      filteredAssets = filteredAssets.filter((asset) =>
        (asset.asset_type?.toLowerCase().includes(filterValue.toLowerCase()) || 
         asset.asset_brand?.toLowerCase().includes(filterValue.toLowerCase()) || 
         asset.asset_model?.toLowerCase().includes(filterValue.toLowerCase()) || 
         asset.asset_serial?.toLowerCase().includes(filterValue.toLowerCase()) || 
         asset.asset_inventory_number?.toLowerCase().includes(filterValue.toLowerCase()) || 
         asset.asset_provider?.toLowerCase().includes(filterValue.toLowerCase()))
      );
    }
 // Ordenar por fecha
    return filteredAssets.sort((a, b) => {
      const dateA = new Date(a.installation_date);
      const dateB = new Date(b.installation_date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [store.assets, activeTab, filterValue, sortOrder]);

const indexOfLastCard = currentPage * cardsPerPage;
const indexOfFirstCard = indexOfLastCard - cardsPerPage;
const currentCards = filteredItems.slice(indexOfFirstCard, indexOfLastCard);
return (
<div className="m-5">
<div className="container mx-auto px-4">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold ml-2">Gestor de Activos</h2>
    <CreateAssets className="w-full" />
  </div>

  {/* Filtros de búsqueda y orden */}
  <Card className="mb-5">
    <CardBody>
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="w-full md:w-1/3">
          <Input
            isClearable
            placeholder="Buscar por Activo..."
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
    <Tab key="active" title="Activos" />
    <Tab key="inactive" title="Inactivos" />
  </Tabs>

  {/* Tarjetas filtradas y ordenadas */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    <AnimatePresence>
      {currentCards.map((asset) => (
        <motion.div
        key={asset.id}
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
                  Activo #{asset.id}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {asset.asset_type} - {asset.asset_brand} - {asset.asset_model} - {asset.asset_serial}
                </p>
              </div>
              <div>
                <Chip
                  color={statusColor[asset.asset_type]}
                  status={asset.asset_type}
                  variant="shadow"
                  size="sm"
                  className="mr-3"
                >
                  {asset.asset_type === "Activo" ? "Activo" : "Inactivo"}
                </Chip>
              </div>
            </CardHeader>
            <CardBody className="ml-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Fecha de Instalación:{" "}
                {formatDate(asset.installation_date)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Fecha de Migración: {formatDate(asset.migrations.length > 0 ? asset.migrations[0].migration_date : "")}
              </p>
            </CardBody>
            <CardFooter className="mb-2">
              <div className="flex justify-center w-full">
                <EditAssets asset={asset} />
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
      total={Math.ceil(filteredItems.length / cardsPerPage)}
      page={currentPage}
      onChange={(page) => setCurrentPage(page)}
    />
  </div>
    </div>
    </div>
    );
};
