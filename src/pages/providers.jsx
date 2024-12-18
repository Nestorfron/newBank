import React, { useContext, useMemo, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CreateProviders } from "../components/CreateProviders.jsx";
import { EditProviders } from "../components/EditProviders.jsx";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
import { EngineersList } from "../components/engineersList.jsx";
import {
  ArrowUp,
  ArrowDown,
  Users2,
  FileText,
} from "lucide-react";
import {
  Button,
  Input,
  Pagination,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Chip,
} from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { p } from "framer-motion/m";

export const Providers = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  const filteredProviders = useMemo(() => {
    let providers = [...store.providers];

    if (filterValue) {
      providers = providers.filter((provider) =>
        provider.company_name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return providers.sort((a, b) => {
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
    });
  }, [store.providers, filterValue, sortOrder]);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredProviders.slice(
    indexOfFirstCard,
    indexOfLastCard
  );

  const deleteProvider = (id) => {
    Swal.fire({
      title: "Advertencia",
      text: "¿Desea eliminar el Proveedor?",
      icon: "warning",
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Sí",
    }).then((click) => {
      if (click.isConfirmed) {
        actions.deleteProvider(id).then(() => {
          Swal.fire("Proveedor eliminado correctamente", "", "success");
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
    actions.getProviders();
    actions.getBranchs();
  }, []);

  return (
    <div className="m-5">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold ml-2">Gestor de Proveedores</h2>
          <CreateProviders className="w-full" />
        </div>

        {/* Filtros de búsqueda y orden */}
        <Card className="mb-5">
          <CardBody>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="w-full md:w-1/3">
                <Input
                  isClearable
                  placeholder="Buscar por Proveedor..."
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

        {/* Tarjetas de proveedores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <AnimatePresence>
            {currentCards.map((provider) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <Card className="overflow-hidden border-t-2 border-l-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex justify-between items-start mt-2 ml-2">
                    <div>
                      <h2 className="text-xl font-bold">
                        {provider.company_name}
                      </h2>
                    </div>
                    <div>
                      <Chip
                        color="primary"
                        variant="shadow"
                        size="sm"
                        className="mr-3"
                      >
                        {provider.service}
                      </Chip>
                    </div>
                  </CardHeader>
                  <CardBody className="ml-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-muted-foreground text-green-500" />
                          <span className="text-sm font-semibold truncate ml-1">
                            RFC:
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-100">
                          {provider.rfc}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Users2 className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-semibold truncate ml-1">
                            {provider.engineers.length} {provider.engineers.length === 1 ? 'Ingeniero' : 'Ingenieros'}
                          </span>
                        </div>
                        {provider.engineers.length > 0 ? (
                          <EngineersList provider={provider} />
                        ) : (
                          <span
                            className="text-gray-400 cursor-not-allowed"
                            title="Sin Ingenieros"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  </CardBody>
                  <CardFooter className="mb-2">
                    <div className="flex justify-center w-full space-x-2">
                      <EditProviders provider={provider} />
                     
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
            total={Math.ceil(filteredProviders.length / cardsPerPage)}
            page={currentPage}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};
