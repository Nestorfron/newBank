import React, { useContext, useState, useMemo, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { DeleteIcon } from "../assets/icons/DeleteIcon.jsx";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
import { CreateBranches } from "../components/CreateBranches.jsx";
import { EditBranches } from "../components/EditBranches.jsx";
import {
  ArrowUp,
  ArrowDown,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Building2,
  MapPin,
  History,
  Package,
  ArrowRightLeft,
} from "lucide-react";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Pagination,
  Chip,
} from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import useTokenExpiration from "../hooks/useTokenExpitarion.jsx";
import AssetsListBranch from "../components/assetsListBranch.jsx";
import MigrationsListBranch from "../components/migrationsListBranch.jsx";
import HistoryListBranch from "../components/historyListBranch.jsx";
import { EyeIcon } from "../assets/icons/EyeIcon.jsx";

export const Branches = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  useTokenExpiration();

  const deleteBranch = (id) => {
    Swal.fire({
      title: "Advertencia",
      text: "¿Desea eliminar la Sucursal?",
      icon: "warning",
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Sí",
    }).then((click) => {
      if (click.isConfirmed) {
        actions.deleteBranch(id).then(() => {
          Swal.fire("Sucursal eliminada correctamente", "", "success");
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
    actions.getBranchs();
  }, []);

  const filteredBranches = useMemo(() => {
    let branches = [...store.branchs];

    if (filterValue) {
      branches = branches.filter((branch) =>
        branch.branch_cr.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return branches.sort((a, b) => {
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
    });
  }, [store.branchs, filterValue, sortOrder]);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredBranches.slice(
    indexOfFirstCard,
    indexOfLastCard
  );

  return (
    <div className="m-5">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold ml-2">Gestor de Sucursales</h2>
          <CreateBranches className="w-full" />
        </div>

        {/* Filtros de búsqueda y orden */}
        <Card className="mb-5">
          <CardBody>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="w-full md:w-1/3">
                <Input
                  isClearable
                  placeholder="Buscar por Sucursal..."
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
                      <span className="ml-1">ID Ascendente</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-5 w-5 text-primary-500" />
                      <span className="ml-1">ID Descendente</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Tarjetas de sucursales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <AnimatePresence>
            {currentCards.map((branch) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <Card className="overflow-hidden border-t-2 border-l-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex justify-between items-start mt-1 ml-2">
                    <div>
                      <h2 className="text-xl font-bold">
                        Sucursal CR- {branch.branch_cr}
                      </h2>
                    </div>
                    <div>
                      <Chip
                        color="primary"
                        variant="shadow"
                        size="sm"
                        className="mr-3"
                      >
                        {branch.branch_zone}
                      </Chip>
                    </div>
                  </CardHeader>
                  <CardBody className="ml-2">
                  <div className="flex gap-2">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5 text-muted-foreground text-blue-500" />
                        <span className="text-lg font-semibold truncate ml-1">
                          {" "}
                          Dirección:
                        </span>
                      </div>
                      <div className="flex mt-1 ">
                        <p className="text-sm text-gray-600 dark:text-gray-100">
                          {branch.branch_address.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-5">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-muted-foreground text-green-500" />
                          <span className="text-md font-semibold truncate ml-1">
                            {" "}
                            Zona:{" "}
                          </span>
                        </div>
                        <div className="flex mt-1 ml-5">
                          <p className="text-xs text-gray-600 dark:text-gray-100">
                            {branch.branch_zone.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-muted-foreground text-green-500" />
                          <span className="text-md font-semibold truncate ml-1">
                            {" "}
                            SubZona:
                          </span>
                        </div>
                        <div className="flex mt-1 ml-5">
                          <p className="text-xs text-gray-600 dark:text-gray-100">
                            {branch.branch_subzone.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex justify-between items-center">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Package className="h-5 w-5 text-purple-500 mr-1" />
                          <span className="text-sm font-semibold mr-2">
                            {branch.assets.length}{" "}
                            {branch.assets.length === 1 ? "Activo" : "Activos"}
                          </span>
                        </div>
                        {branch.assets.length > 0 ? (
                          <AssetsListBranch branch={branch} />
                        ) : (
                          <span
                            className="text-sm font-semibold mr-2 text-gray-400 cursor-not-allowed"
                            title="Sin Activos"
                          >
                            <EyeIcon />
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <ArrowRightLeft className="h-4 w-4 text-orange-500 mr-1" />
                          <span className="text-sm font-semibold mr-2">
                            {branch.migrations.length}{" "}
                            {branch.migrations.length === 1
                              ? "Migración"
                              : "Migraciones"}
                          </span>
                        </div>
                        {branch.migrations.length > 0 ? (
                          <MigrationsListBranch branch={branch} />
                        ) : (
                          <span
                            className="text-sm font-semibold mr-2 text-gray-400 cursor-not-allowed"
                            title="Sin Migraciones"
                          >
                            <EyeIcon />
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <History className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-semibold mr-2">
                            {branch.history.length}{" "}
                            {branch.history.length === 1
                              ? "Historial"
                              : "Historiales"}
                          </span>
                        </div>
                        {branch.history.length > 0 ? (
                          <HistoryListBranch branch={branch} />
                        ) : (
                          <span
                            className="text-sm font-semibold mr-2 text-gray-400 cursor-not-allowed"
                            title="Sin Historial"
                          >
                            <EyeIcon />
                          </span>
                        )}
                      </div>

                    
                    </div>
                  </CardBody>
                  <CardFooter>
                    <div className="flex justify-center w-full space-x-2">
                      <EditBranches branch={branch} />
                     
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
            total={Math.ceil(filteredBranches.length / cardsPerPage)}
            page={currentPage}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};
