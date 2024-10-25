import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import useTokenExpiration from "../hooks/useTokenExpitarion.jsx";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
import {
  Wifi,
  Server,
  Monitor,
  Printer,
  Link as LinkIcon,
  Users,
  Building,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Link,
  useDisclosure,
  Listbox,
  ListboxItem,
  
  Input,
} from "@nextui-org/react";
import Map from "../components/Map.jsx";
import BranchDetails from "../components/branchDetails.jsx";

export const Dashboard = () => {
  const { store, actions } = useContext(Context);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  useTokenExpiration();

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");
      return;
    }
    actions.getMe();
    actions.getBranchs();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-2 items-center justify-start mt-3 ">
        <Input
          isClearable
          placeholder="Buscar por Cr..."
          // value={filterValue}
          // onClear={() => setFilterValue("")}
          // onValueChange={setFilterValue}
          className="w-[300px]"
          startContent={<SearchIcon />}
        />
      </div>
      <div className="flex w-full gap-2 mr-2 mt-3 mb-2">
        <Card className="bg-gray-800 border-gray-700 border-1  h-[180px]  w-1/4 xs:w-2/6">
          <CardHeader className="absolute z-10 top-1 flex-col">
            <div className="flex justify-between w-full">
              <p className="text-tiny text-white/60 uppercase font-bold text-xl">
                Servidores
              </p>
              <div className="p-2 rounded-full bg-primary-500">
                <Server className="h-6 w-6" />
              </div>
            </div>
          </CardHeader>
          <CardBody className="flex justify-end items-start flex w-full">
            {" "}
            <div className="ml-5 mb-5 ">
              <span className="text-white  text-3xl"> 1</span>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-gray-800 border-gray-700 border-1  h-[180px]  w-1/4 xs:w-2/6">
          <CardHeader className="absolute z-10 top-1 flex-col">
            <div className="flex justify-between w-full">
              <p className="text-tiny text-white/60 uppercase font-bold text-xl">
                Estaciones de trabajo
              </p>
              <div className="p-2 rounded-full bg-success-500 text-whie">
                <Monitor className="h-6 w-6" />
              </div>
            </div>
          </CardHeader>
          <CardBody className="flex justify-end items-start flex w-full">
            {" "}
            <div className="ml-5 mb-5 ">
              <span className="text-white  text-3xl"> 20</span>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-gray-800 border-gray-700 border-1   h-[180px]  w-1/4 xs:w-2/6">
          <CardHeader className="absolute z-10 top-1 flex-col">
            <div className="flex justify-between w-full">
              <p className="text-tiny text-white/60 uppercase font-bold text-xl">
                Impresoras
              </p>
              <div className="p-2 rounded-full bg-secondary-500">
                <Printer className="h-6 w-6" />
              </div>
            </div>
          </CardHeader>
          <CardBody className="flex justify-end items-start flex w-full">
            {" "}
            <div className="ml-5 mb-5 ">
              <span className="text-white  text-3xl"> 2</span>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-gray-800 border-gray-700 border-1   h-[180px]  w-1/4 xs:w-2/6">
          <CardHeader className="absolute z-10 top-1 flex-col">
            <div className="flex justify-between w-full">
              <p className="text-tiny text-white/60 uppercase font-bold text-xl">
                Wi-Fi
              </p>
              <div className="p-2 rounded-full bg-warning-500">
                <Wifi className="h-6 w-6" />
              </div>
            </div>
          </CardHeader>
          <CardBody className="flex justify-end items-start flex w-full">
            {" "}
            <div className="ml-5 mb-5 ">
              <span className="text-white  text-3xl"> 2</span>
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="flex w-full gap-2">
        <Card className="bg-gray-800 border-gray-700 border-1  w-1/4 h-[300px]">
          <CardHeader className="flex gap-3">
            <div className="flex justify-between w-full">
              <p className="text-tiny text-white/60 uppercase font-bold text-xl">
                Sucursales
              </p>
              <div className="p-2 rounded-full bg-warning-500">
                <Building className="h-6 w-6" />
              </div>
            </div>
          </CardHeader>

          <CardBody>
            <Listbox
              value={selectedValue}
              variant="solid"
              onChange={setSelectedKeys}
              multiple
              className="w-full text-white"
              aria-label="Branches"
            >
              {store.branchs.map((branch) => (
                <ListboxItem
                  key={branch.branch_cr}
                  className="p-0 m-0"
                  value={branch.branch_cr}
                >
                  <BranchDetails branch={branch} />
                </ListboxItem>
              ))}
            </Listbox>
          </CardBody>
          <CardFooter className="absolute bg-black/30 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100 justify-end">
            <div className="flex justify-end w-full">
              <Link
                className="text-tiny uppercase font-bold"
                showAnchorIcon
                href="/branches"
                color="primary"
              >
                Sucursales.
              </Link>
            </div>
          </CardFooter>
        </Card>
        <Card className="w-1/2 h-[300px] border-gray-700 border-1 ">
          <Map />
        </Card>
        <div className="flex-grow">
          <Card className="bg-gray-800 border-gray-700 border-1   h-[145px]  w-full mb-2">
            <CardHeader className="absolute z-10 top-1 flex-col">
              <div className="flex justify-between w-full">
                <p className="text-tiny text-white/60 uppercase font-bold text-xl">
                  Enlaces
                </p>
                <div className="p-2 rounded-full bg-secondary-500">
                  <LinkIcon className="h-6 w-6" />
                </div>
              </div>
            </CardHeader>
            <CardBody className="flex justify-end items-start flex w-full">
              {" "}
              <div className="ml-5 mb-5 ">
                <span className="text-white  text-3xl"> 2</span>
              </div>
            </CardBody>
          </Card>
          <Card className="bg-gray-800 border-gray-700 border-1   h-[145px]">
            <CardHeader className="absolute z-10 top-1 flex-col">
              <div className="flex justify-between w-full">
                <p className="text-tiny text-white/60 uppercase font-bold text-xl">
                  Responsables
                </p>
                <div className="p-2 rounded-full bg-success-500">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardHeader>
            <CardBody className="flex justify-end items-start flex w-full">
              {" "}
              <div className="ml-5 mb-5 ">
                <span className="text-white  text-3xl"> 2</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

