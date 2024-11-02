import React, { useContext, useState, useMemo, useEffect } from "react";
import { Context } from "../store/appContext.jsx";
import { useNavigate } from "react-router-dom";
import useTokenExpiration from "../hooks/useTokenExpitarion.jsx";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { EyeIcon } from "../assets/icons/EyeIcon.jsx";
import AssetsListEngineer from "../components/assetsListEngineer.jsx";

export const EngenieerDashboard = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useTokenExpiration();

  const me = store.engineer;
  const provider = store.provider;


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  useEffect(() => {
    actions.getMe();
    actions.getProviders();
    actions.getBranchs();
    actions.getAssets();
  }, []);

  return (
    <div className="max-w-[900px] m-auto">
      <Card className="flex col-span-12 justify-center h-full my-5">
        <CardHeader className="top-1 flex-col !items-Center">
          <p className="uppercase font-bold">Proveedor</p>
        </CardHeader>
        <CardBody className="flex justify-end items-start flex w-full">
          <Listbox>
            <ListboxItem>
              <div className="flex m-auto p-3">
                <p className="me-2">
                  Nombre:{" "}
                  
                </p>
                <span className="text-gray-500">{provider.company_name}</span>
              </div>
              <div className="flex m-auto p-3">
                <p className="me-2">
                  RFC: 
                </p>
                <span className="text-gray-500">{provider.rfc}</span>
              </div>
              <div className="flex m-auto p-3">
                <p className="me-2">
                  Servicio:{" "}
                  
                </p>
                <span className="text-gray-500">{provider.service}</span>
              </div>
              <div className="flex m-auto p-3">
                <p className="me-2">
                  Sucursal:{" "}
                 
                </p>
                <span className="text-gray-500">{provider.branch_id ? store.branchs.find(branch => branch.id === provider.branch_id).branch_cr : "No asignado"}</span>
              </div>
              <div className="flex m-auto p-3">
                <p >
                  Activos: 
                </p>
                <AssetsListEngineer provider={provider} />
              </div>
            </ListboxItem>
          </Listbox>
        </CardBody>
      </Card>

      <Card className="col-span-12 h-full">
        <CardHeader className="top-1 flex-col !items-Center">
          <p className="uppercase font-bold">Mensajes</p>
        </CardHeader>
        <CardBody className="flex justify-end items-start flex w-full">
          <ul>
            <li className="mb-2">Nombre: {provider.company_name}</li>
            <li className="mb-2">RFC: {provider.rfc}</li>
            <li className="mb-2">Servicio: {provider.service}</li>
            <li className="mb-2">Sucursal: {provider.branch_id}</li>
            <li className="mb-2">
              Activos: <AssetsListEngineer provider={provider} />
            </li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
};
