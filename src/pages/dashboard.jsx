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
import { use } from "framer-motion/client";

export const Dashboard = () => {
  const { store, actions } = useContext(Context);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));
  const [selectedBranch, setSelectedBranch] = useState(null);


  const handleBranchChange = (value) => {
    console.log("Valor ingresado en el input de búsqueda:", value);
    const selected = store.branchs.find(branch => branch.branch_cr === value);
    setSelectedBranch(selected);
    console.log("Sucursal seleccionada:", selected);
  };

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  useTokenExpiration();


  useEffect(() => {
    actions.getMe();
    if (store.me.role === "Ingeniero de Campo") {
      navigate("/engenieerDashboard");
    }
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");
      return;
    }
    actions.getMe();
    actions.getBranchs();
    actions.getAssets();
  }, []);

  return (
    <div className="container-fluid mx-auto p-4">
      <div className="flex gap-2 items-center justify-center  mb-4 mt-3 ">
        <Input
          isClearable
          placeholder="Buscar por Cr..."
          onChange={(e) => handleBranchChange(e.target.value)}
          className="w-[300px]"
          startContent={<SearchIcon />}
        />
      </div>
      <div className="columns-2xs  lg:grid grid-cols-4 grid-rows-6">
        <div className="row-span-2">
          <Card className="border-1 m-2 h-[187px]">
            <CardHeader className="absolute z-10 top-1 flex-col">
              <div className="flex justify-between w-full">
                <p className="text-tiny uppercase font-bold text-xl">
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
                <span className="  text-3xl"> {selectedBranch ? store.assets.filter(asset => asset.asset_type === "Servidor" && asset.branch_id === selectedBranch.id).length : 0}</span>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="row-span-4 col-start-1 row-start-3">
          <Card className="border-1 m-2 h-[400px]">
            <CardHeader className="flex gap-3">
              <div className="flex justify-between w-full">
                <p className="text-tiny uppercase font-bold text-xl">
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
                className="w-full "
                aria-label="Branches"
              >
                {store.branchs.map((branch, index) => (
                  <ListboxItem
                    key={branch.branch_cr}
                    className="p-0 m-0"
                    value={branch.branch_cr}
                  >
                    {index+1} -<BranchDetails branch={branch} />
                  </ListboxItem>
                ))}
              </Listbox>
            </CardBody>
            <CardFooter className="absolute bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100 justify-end">
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
        </div>
        <div className="row-span-2 col-start-2 row-start-1">
          <Card className="border-1 m-2 h-[187px]">
            <CardHeader className="absolute z-10 top-1 flex-col">
              <div className="flex justify-between w-full">
                <p className="text-tiny uppercase font-bold text-xl">
                  Estaciones de trabajo
                </p>
                <div className="p-2 rounded-full bg-success-500 h-10 w-10">
                  <Monitor className="h-6 w-6" />
                </div>
              </div>
            </CardHeader>
            <CardBody className="flex justify-end items-start flex w-full">
              {" "}
              <div className="ml-5 mb-5 ">
                <span className="  text-3xl">{selectedBranch ? store.assets.filter(asset => asset.asset_type === "Estaciones de trabajo" && asset.branch_id === selectedBranch.id).length : 0}</span>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="row-span-2 col-start-3 row-start-1">
          <Card className="border-1 m-2 h-[187px]">
            <CardHeader className="absolute z-10 top-1 flex-col">
              <div className="flex justify-between w-full">
                <p className="text-tiny uppercase font-bold text-xl">
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
                <span className="  text-3xl"> {selectedBranch ? store.assets.filter(asset => asset.asset_type === "Impresora" && asset.branch_id === selectedBranch.id).length : 0}</span>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="lg:pt-0 pt-0.5 row-span-2 col-start-4 row-start-1">
          <Card className="border-1 m-2 h-[187px]">
            <CardHeader className="absolute z-10 top-1 flex-col">
              <div className="flex justify-between w-full">
                <p className="text-tiny uppercase font-bold text-xl">Wi-Fi</p>
                <div className="p-2 rounded-full bg-warning-500">
                  <Wifi className="h-6 w-6" />
                </div>
              </div>
            </CardHeader>
            <CardBody className="flex justify-end items-start flex w-full">
              {" "}
              <div className="ml-5 mb-5 ">
                <span className="  text-3xl"> {selectedBranch ? store.assets.filter(asset => asset.asset_type === "Wi-Fi" && asset.branch_id === selectedBranch.id).length : 0}</span>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="row-span-2 col-start-4 row-start-3">
          {" "}
          <Card className="border-1 m-2   h-[191px]  mb-2">
            <CardHeader className="absolute z-10 top-1 flex-col">
              <div className="flex justify-between w-full">
                <p className="text-tiny uppercase font-bold text-xl">Enlaces</p>
                <div className="p-2 rounded-full bg-secondary-500">
                  <LinkIcon className="h-6 w-6" />
                </div>
              </div>
            </CardHeader>
            <CardBody className="flex justify-end items-start flex w-full">
              {" "}
              <div className="ml-5 mb-5 ">
                <span className="  text-3xl">{selectedBranch ? store.assets.filter(asset => asset.asset_type === "Enlaces" && asset.branch_id === selectedBranch.id).length : 0}</span>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="row-span-2 col-start-4 row-start-5">
          <Card className="border-1 m-2 h-[191px] mb-2">
            <CardHeader className="absolute z-10 top-1 flex-col">
              <div className="flex justify-between w-full">
                <p className="text-tiny uppercase font-bold text-xl">
                  Responsables
                </p>
                <div className="p-2 rounded-full bg-success-500">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardHeader>
            <CardBody className="flex justify-end items-start flex w-full">
              {" "}
              <div className="">
                <span className="  text-3xl"> 2</span>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="col-span-2 row-span-4 col-start-2 row-start-3">
          {" "}
          <Card className="h-[400px] border-gray-700 border-1 m-2 ">
            <Map />
          </Card>
        </div>
      </div>
    </div>
  );
};
