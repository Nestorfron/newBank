import React, { useContext, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";
import { DeleteIcon } from "../assets/icons/DeleteIcon.jsx";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
import { CreateLinks } from "../components/CreateLinks.jsx";
import { EditLinks } from "../components/EditLinks.jsx";
import { ArrowUp, ArrowDown } from 'lucide-react';
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
import useTokenExpiration from "../hooks/useTokenExpitarion.jsx";

export const Links = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  useTokenExpiration();

  const filteredLinks = useMemo(() => {
    let links = [...store.links];

    if (filterValue) {
      links = links.filter((link) =>
        link.type.toLowerCase().includes(filterValue.toLowerCase()) ||
        link.description.toLowerCase().includes(filterValue.toLowerCase()) ||
        link.speed.toLowerCase().includes(filterValue.toLowerCase()) ||
        link.status.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return links.sort((a, b) => {
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
    });
  }, [store.links, filterValue, sortOrder]);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredLinks.slice(indexOfFirstCard, indexOfLastCard);

  const deleteLink = (id) => {
    Swal.fire({
      title: "Advertencia",
      text: "¿Desea eliminar el Link?",
      icon: "warning",
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Sí",
    }).then((click) => {
      if (click.isConfirmed) {
        actions.deleteLink(id).then(() => {
          Swal.fire("Link eliminado correctamente", "", "success");
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
    actions.getLinks();
  }, []);

  const statusColor = {
    active: "success",
    inactive: "danger",
    pending: "warning",
  };

  return (
    <div className="m-5">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold ml-2">Gestor de Links</h2>
          <CreateLinks className="w-full" />
        </div>

        {/* Filtros de búsqueda y orden */}
        <Card className="mb-5">
          <CardBody>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="w-full md:w-1/3">
                <Input
                  isClearable
                  placeholder="Buscar por Link..."
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

        {/* Tarjetas de links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <AnimatePresence>
            {currentCards.map((link) => (
              <motion.div
                key={link.id}
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
                        Link #{link.id}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        {link.type}
                      </p>
                    </div>
                    <div>
                      <Chip
                        color={statusColor[link.status.toLowerCase()]}
                        variant="shadow"
                        size="sm"
                        className="mr-3"
                      >
                        {link.status}
                      </Chip>
                    </div>
                  </CardHeader>
                  <CardBody className="ml-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Descripción: {link.description}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Velocidad: {link.speed}
                    </p>
                  </CardBody>
                  <CardFooter className="mb-2">
                    <div className="flex justify-center w-full space-x-2">
                      <EditLinks link={link} />
                      <Button
                        color="danger"
                        variant="flat"
                        size="sm"
                        onClick={() => deleteLink(link.id)}
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
            total={Math.ceil(filteredLinks.length / cardsPerPage)}
            page={currentPage}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

