import React, { useContext, useState, useMemo, useEffect } from "react";
import { Context } from "../store/appContext.jsx";
import { useNavigate } from "react-router-dom";
import useTokenExpiration from "../hooks/useTokenExpitarion.jsx";
import {Card, CardHeader, CardBody, CardFooter, Image, Button} from "@nextui-org/react";
import { EyeIcon } from "../assets/icons/EyeIcon.jsx";
import AssetsListEngineer from "../components/assetsListEngineer.jsx";


export const EngenieerDashboard = () => {
  const { store, actions } = useContext(Context);
  const [branch, setBranch] = useState("");
  const navigate = useNavigate();


  useTokenExpiration();

  const me = store.engineer;
  const provider = store.provider;


  const getBranchById = (id) => {
    const Branch = store.branchs.find(
      (branch) => branch.id === id
    );
    setBranch(Branch);
  };

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
    getBranchById(store.provider.branch_id);
  }, []);


  return (
    <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8">
    <Card className="col-span-12 h-full">
      <CardHeader className="top-1 flex-col !items-Center">
        <p className="uppercase font-bold">Proveedor</p>
      </CardHeader>
      <CardBody className="flex justify-end items-start flex w-full">
        <ul>
          <li className="mb-2">Nombre: {provider.company_name}</li>
          <li className="mb-2">RFC: {provider.rfc}</li>
          <li className="mb-2">Servicio: {provider.service}</li>
          <li className="mb-2">Sucursal: {provider.branch_id}</li>
          <li className="mb-2">Activos: <AssetsListEngineer provider={provider}/></li>
        </ul>
      </CardBody>
    </Card>

    <Card className="col-span-12 h-full">
      <CardHeader className="top-1 flex-col !items-Center">
        <p className="uppercase font-bold">Proveedor</p>
      </CardHeader>
      <CardBody className="flex justify-end items-start flex w-full">
        <ul>
          <li className="mb-2">Nombre: {provider.company_name}</li>
          <li className="mb-2">RFC: {provider.rfc}</li>
          <li className="mb-2">Servicio: {provider.service}</li>
          <li className="mb-2">Sucursal: {provider.branch_id}</li>
          <li className="mb-2">Activos: <AssetsListEngineer provider={provider}/></li>
        </ul>
      </CardBody>
    </Card>
    
  </div>
  );
}



