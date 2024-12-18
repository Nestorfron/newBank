import React, { useContext, useMemo, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CreateUsersMB } from "../components/CreateUsersMB.jsx";
import { EditUsersMB } from "../components/EditUsersMB.jsx";
import { DeleteIcon } from "../assets/icons/DeleteIcon.jsx";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
import { EyeIcon } from "../assets/icons/EyeIcon.jsx";
import AssetsListUserMB from "../components/assetsListUserMB.jsx";
import useTokenExpiration from "../hooks/useTokenExpitarion.jsx";
import { ArrowUp, ArrowDown, UserSquare, Phone, MapPin, Package   } from "lucide-react";
import {
  Avatar,
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

export const UsersMB = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  useTokenExpiration();

  const filteredUsersMB = useMemo(() => {
    let usersMB = [...store.usersMB];

    if (filterValue) {
      usersMB = usersMB.filter((userMB) =>
        userMB.names.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return usersMB.sort((a, b) => {
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
    });
  }, [store.usersMB, filterValue, sortOrder]);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredUsersMB.slice(indexOfFirstCard, indexOfLastCard);

  const deleteUserMB = (id) => {
    Swal.fire({
      title: "Advertencia",
      text: "¿Desea eliminar el Usuario?",
      icon: "warning",
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Sí",
    }).then((click) => {
      if (click.isConfirmed) {
        actions.deleteUserMB(id).then(() => {
          Swal.fire("Usuario eliminado correctamente", "", "success");
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
    actions.getUsersMB();
    console.log(store.usersMB);
  }, []);

  return (
    <div className="m-5">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold ml-2">Gestor de Usuarios</h2>
          <CreateUsersMB className="w-full" />
        </div>

        {/* Filtros de búsqueda y orden */}
        <Card className="mb-5">
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
            {currentCards.map((userMB) => (
              <motion.div
                key={userMB.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <Card className="h-full w-2/2 flex flex-col overflow-hidden border-t-2 border-l-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex justify-between items-start mt-2 ml-2">
                    <div className="flex items-center space-x-4">
                      <Avatar
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${userMB.names} ${userMB.last_names}`}
                        name={`${userMB.names} ${userMB.last_names}`}
                      />
                    <div>
                    <span className="text-xl font-bold truncate">
                      {userMB.names} {userMB.last_names}
                    </span>
                    <p className="text-gray-600 dark:text-gray-300">
                      {userMB.role}
                      </p>
                      </div>
                      </div>
                    <div>
                      <Chip
                        color="primary"
                        variant="shadow"
                        size="sm"
                        className="mr-3"
                      >
                        {userMB.is_active ? "Activo" : "Inactivo"}
                      </Chip>
                    </div>
                
                  </CardHeader>
                  <CardBody className="ml-2 ">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <UserSquare className="h-5 w-5 text-green-500 mr-1" />
                      <span className="text-sm font-semibold mr-2">
                        Empleado:
                      </span>
                      </div>
                      <p
                        className="text-gray-600 dark:text-gray-100 ml-6"
                        title="Número de Empleado"
                      >
                        {userMB.employee_number.toUpperCase()}
                      </p>
                    </div>
                  
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-sm font-semibold mr-2">
                        Teléfono:
                      </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-100 ml-7" title="Extension Phone">
                        {userMB.extension_phone}
                      </p>
                    </div>
                    <div className="flex flex-col mt-2">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-orange-500 mr-1" />
                      <span className="text-sm font-semibold mr-2">
                        Sucursal :
                      </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-100 ml-7" title="Branch ID">
                        {userMB.branch_id ? store.branchs.find(branch => branch.id === userMB.branch_id).branch_cr : "Sucursal no encontrada"}
                      </p>
                    </div>
                    <div className="flex flex-col mt-2">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-purple-500 mr-1" />
                      <span className="text-sm font-semibold mr-2">
                        Activos:
                      </span>
                      </div>
                      {userMB.assets.length > 0 ? (
                        <AssetsListUserMB userMB={userMB}/>
                      ) : (
                        <span
                          className="text-sm font-semibold text-gray-400 cursor-not-allowed ml-7"
                          title="Sin Activos"
                        >
                          <EyeIcon className/>
                        </span>
                      )}
                    </div>
                    </div>
                  </CardBody>
                  <CardFooter className="mb-2">
                    <div className="flex justify-center w-full space-x-2">
                      <EditUsersMB userMB={userMB} />
                      
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
            total={Math.ceil(filteredUsersMB.length / cardsPerPage)}
            page={currentPage}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};
