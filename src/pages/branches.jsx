import React, { useContext, useState, useMemo, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { DeleteIcon } from "../assets/icons/DeleteIcon.jsx";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
import { CreateBranches } from "../components/CreateBranches.jsx";
import { EditBranches } from "../components/EditBranches.jsx";
import { ArrowUp, ArrowDown } from 'lucide-react';
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
  const currentCards = filteredBranches.slice(indexOfFirstCard, indexOfLastCard);

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
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
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
                <Card className="h-full w-2/2 flex flex-col hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="flex justify-between items-start mt-2 ml-2">
                    <div>
                      <h2 className="text-xl font-bold">
                        Sucursal #{branch.id}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        {branch.branch_cr}
                      </p>
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
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      SubZona: {branch.branch_subzone}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Dirección: {branch.branch_address}
                    </p>
                    <div className="mt-2 flex-col gap-2">
                      <div className="flex items-center">
                        <span className="text-sm font-semibold mr-2">Activos:</span>
                        {branch.assets.length > 0 ? (
                          <AssetsListBranch branch={branch} />
                        ) : (
                          <span className="text-sm font-semibold mr-2 text-gray-400 cursor-not-allowed" title="Sin Activos">
                            <EyeIcon />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-semibold mr-2">Migraciones:</span>
                        {branch.migrations.length > 0 ? (
                          <MigrationsListBranch branch={branch} />
                        ) : (
                          <span className="text-sm font-semibold mr-2 text-gray-400 cursor-not-allowed" title="Sin Migraciones">
                            <EyeIcon />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-semibold mr-2">Historial:</span>
                        {branch.history.length > 0 ? (
                          <HistoryListBranch branch={branch} />
                        ) : (
                          <span className="text-sm font-semibold mr-2 text-gray-400 cursor-not-allowed" title="Sin Historial">
                            <EyeIcon />
                          </span>
                        )}
                      </div>
                    </div>
                  </CardBody>
                  <CardFooter className="mb-2">
                    <div className="flex justify-center w-full space-x-2">
                      <EditBranches branch={branch} />
                      <Button
                        color="danger"
                        variant="flat"
                        size="sm"
                        onClick={() => deleteBranch(branch.id)}
                      >
                        <DeleteIcon />
                        Eliminar
                      </Button>
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
