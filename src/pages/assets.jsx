import React, { useContext, useState, useMemo, useEffect, act } from "react";
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
import {
  ArrowUp,
  ArrowDown,
  Laptop,
  Monitor,
  Printer,
  Server,
  Ticket,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
import { CreateAssets } from "../components/CreateAsset.jsx";
import { EditAssets } from "../components/EditAssets.jsx";
import useTokenExpiration from "../hooks/useTokenExpitarion.jsx";
import MigrationsList from "../components/migrationsList.jsx";
import { se } from "date-fns/locale";
import { a } from "framer-motion/client";

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

  const statusColor = {
    all: "secondary",
    active: "success",
    inactive: "danger",
  };

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

  // Obtener tipos únicos de activos para los tabs dinámicos
  const assetTypes = useMemo(() => {
    const types = store.assets.map((asset) => asset.asset_type.toLowerCase());
    return ["all", ...new Set(types)]; //
  }, [store.assets]);

  // Filtrar activos según el tipo y búsqueda
  const filteredAssets = useMemo(() => {
    let assets = [...store.assets];

    // Filtrar por tipo de tab activo
    if (activeTab !== "all") {
      assets = assets.filter(
        (asset) => asset.asset_type.toLowerCase() === activeTab.toLowerCase()
      );
    }

    // Filtrar por valor de búsqueda
    if (filterValue) {
      assets = assets.filter((asset) =>
        [asset.name, asset.type, asset.serialNumber]
          .join(" ")
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    }

    // Ordenar por instalación
    assets.sort((a, b) => {
      const dateA = new Date(a.installation_date);
      const dateB = new Date(b.installation_date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return assets;
  }, [store.assets, activeTab, filterValue, sortOrder]);

  // Calcular los activos para la página actual
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredAssets.slice(indexOfFirstCard, indexOfLastCard);

  const assetTypesIcons = {
    Servidor: <Server className="h-5 w-5" />,
    Impresora: <Printer className="h-5 w-5" />,
    Laptop: <Laptop className="h-5 w-5" />,
    Monitor: <Monitor className="h-5 w-5" />,
    Ticketera: <Ticket className="h-5 w-5" />,
  };

  const assetTypesColoes = {
    Servidor: "success",
    Impresora: "warning",
    Laptop: "danger",
    Monitor: "primary",
    Ticketera: "secondary",
  };

  const AssetIcon = ({ assetType }) => {
    return assetTypesIcons[assetType] || null;
  };

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
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
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
          aria-label="Tipo de Activos"
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          variant="bordered"
          color={statusColor[activeTab]}
        >
          {assetTypes.map((type) => (
            <Tab
              key={type}
              title={type === "all" ? "TODOS" : type.toUpperCase()}
            />
          ))}
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
                transition={{ duration: 0.2 }}
                layout
              >
                <Card className="h-[300px] w-[450px] flex flex-col overflow-hidden border-t-2 border-l-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex justify-between items-start ml-2">
                    <div>
                      <h2 className="text-xl font-bold">
                        {asset.asset_brand} - {asset.asset_model}
                      </h2>
                    </div>
                    <div
                      className={`p-2  bg-${
                        assetTypesColoes[asset.asset_type]
                      } text-white rounded-full mr-5 `}
                    >
                      <AssetIcon
                        className="h-6 w-6 text-white"
                        assetType={asset.asset_type}
                      />
                    </div>
                  </CardHeader>
                  <CardBody className="ml-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-500">
                          Modelo:
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {asset.asset_model}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-500">
                          Marca:
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {asset.asset_brand}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-500">
                          Tipo:
                        </span>
                        <p className="text-gray-600 dark:text-gray-300">
                          {asset.asset_type}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-500">
                          Serie:
                        </span>
                        <p className="text-gray-600 dark:text-gray-300">
                          {asset.asset_serial}
                        </p>
                      </div>

                      

                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-500">
                          Fecha de Migración:
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {formatDate(
                            asset.migrations.length > 0
                              ? asset.migrations[0].migration_date
                              : ""
                          )}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Chip
                          color="secondary"
                          status={asset.asset_type}
                          variant="shadow"
                          size="sm"
                          className="mr-3"
                        >
                          {asset.asset_type === "Activo"
                            ? "Activo"
                            : "Inactivo"}
                        </Chip>
                      </div>
                    </div>
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
            total={Math.ceil(filteredAssets.length / cardsPerPage)}
            page={currentPage}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};
