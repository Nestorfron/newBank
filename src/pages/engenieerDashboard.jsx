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
  Chip,
} from "@nextui-org/react";
import { EyeIcon } from "../assets/icons/EyeIcon.jsx";
import AssetsListEngineer from "../components/assetsListEngineer.jsx";
import { EditMigrations } from "../components/EditMigrations.jsx";
import HistoryListMigrations from "../components/historyListMigrations.jsx";
import { CreateMigrations } from "../components/CreateMigration.jsx";

export const EngenieerDashboard = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useTokenExpiration();

  const me = store.engineer;
  const provider = store.provider;

  const getMessages = () => {
    const messagges = [];
    if (store.me.role === "Ingeniero de Campo") {
      store.messages.forEach((message) => {
        if (message.provider_id === store.engineer.provider_id) {
          messagges.push(message);
        }
      });
    } else {
      messagges.push(...store.messages);
    }
    return messagges;
  };

  const getMigrations = () => {
    const migrations = [];
    if (store.me.role === "Ingeniero de Campo") {
      store.migrations.forEach((migration) => {
        if (migration.provider_id === store.engineer.provider_id) {
          migrations.push(migration);
        }
      });
    } else {
      migrations.push(...store.migrations);
    }
    return migrations;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const mapColor = (status) => {
    if (status === "Ordered") {
      return "success";
    } else if (status === "In_progress") {
      return "warning";
    } else if (status === "Completed") {
      return "danger";
    }
  };

  useEffect(() => {
    actions.getMe();
    actions.getProviders();
    actions.getBranchs();
    actions.getAssets();
    actions.getUsersMB();
    actions.getMigrations();
    actions.getMessages();
    actions.getHistory();
  }, []);

  return (
    <div className="max-w-[900px] m-auto">
      <Card className="flex col-span-12 justify-center h-full my-5">
        <CardHeader className="top-1 flex-col !items-Center">
          <p className="uppercase font-bold">Proveedor</p>
        </CardHeader>
        <CardBody className="flex justify-end items-start flex w-full">
          <Listbox className="list-disc pl-5" textValue="id" aria-labelledby="listbox-label">
            <ListboxItem textValue={provider.id}>
              <div className="flex m-auto p-2">
                <p className="me-2">Nombre: </p>
                <span className="text-gray-500">{provider.company_name}</span>
              </div>
              <div className="flex m-auto p-2">
                <p className="me-2">RFC:</p>
                <span className="text-gray-500">{provider.rfc}</span>
              </div>
              <div className="flex m-auto p-2">
                <p className="me-2">Servicio: </p>
                <span className="text-gray-500">{provider.service}</span>
              </div>
              <div className="flex m-auto p-2">
                <p className="me-2">Sucursal: </p>
                <span className="text-gray-500">
                  {provider.branch_id
                    ? store.branchs.find(
                        (branch) => branch.id === provider.branch_id
                      ).branch_cr
                    : "No asignado"}
                </span>
              </div>
              <div className="flex m-auto p-2">
                <p>Activos:</p>
                <AssetsListEngineer provider={provider} />
              </div>
            </ListboxItem>
          </Listbox>
        </CardBody>
      </Card>

      <Card className="flex col-span-12 justify-center h-full my-5">
        <CardHeader className="top-1 flex-col !items-Center">

          <p className="uppercase font-bold">
            Migraciones:{" "}
            <span className="text-gray-500">{getMigrations().length}</span>{" "}
          </p>
       
          
        </CardHeader>
        <CardBody className="flex justify-end items-start flex w-full">
          <Listbox className="list-disc pl-5" textValue="id" aria-labelledby="listbox-label">
            {getMigrations().map((migration, index) => (
              
              <ListboxItem key={index} className="flex justify-between" textValue={migration.id}>
                  
                <div className="flex m-auto p-2 gap-2">
                  <div className="flex justify-between w-full m-auto">
                    {index + 1} - {formatDate(migration.migration_date)} -{" "}
                    <span className="text-gray-500 m-auto">
                      {" "}
                      {migration.migration_description}{" "}
                    </span>
                    <Chip color={mapColor(migration.migration_status)}>
                      {" "}
                      {migration.migration_status === "Ordered"
                        ? "Ordenada"
                        : ""}
                      {migration.migration_status === "In_progress"
                        ? "En proceso"
                        : ""}
                      {migration.migration_status === "Completed"
                        ? "Completada"
                        : ""}
                    </Chip>
                  </div>
                  <div className="flex m-auto p-2">
                  <EditMigrations migration={migration} />
                  <HistoryListMigrations migration={migration} />
                  </div>
                </div>
              </ListboxItem>
            ))}
          </Listbox>
        </CardBody>
        <CardFooter className="justify-end">
        <div className="flex ms-auto">
            <CreateMigrations />
          </div>
        </CardFooter>
      </Card>

      <Card className="flex col-span-12 justify-center h-full my-5">
        <CardHeader className="top-1 flex-col !items-Center">
          <p className="uppercase font-bold">
            Mensajes:{" "}
            <span className="text-gray-500">{getMessages().length}</span>{" "}
          </p>
        </CardHeader>
        <CardBody className="flex justify-end items-start flex w-full">
          <Listbox className="list-disc pl-5" textValue="id" aria-labelledby="listbox-label">
            {getMessages().map((message, index) => (
              <ListboxItem key={index} className="flex justify-between" textValue={message.id}>
                <p className="me-2">
                  {index + 1} - {message.message}
                </p>
              </ListboxItem>
            ))}
          </Listbox>
        </CardBody>
      </Card>
    </div>
  );
};
