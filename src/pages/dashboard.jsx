import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext.jsx";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import useTokenExpiration from "../hooks/useTokenExpitarion.jsx";
import "../styles/index.css";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
  Divider,
  Link,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import Map from "../components/Map.jsx";
import BranchDetails from "../components/branchDetails.jsx";

const Dashboard = () => {
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
    actions.getMe();
    actions.getBranchs();
  }, []);

  return (
    <div className="gap-2 grid grid-cols-12 grid-rows-2 px-8 mt-5 mb-5 items-center">
      <Card className="col-span-12 sm:col-span-7 h-[300px]">
        {" "}
        <Map />
      </Card>
      <Card className="bg-primary-50 col-span-12 sm:col-span-5 h-[300px]">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <h3 color="primary" className="font-medium text-2xl">
              Sucursales
            </h3>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <Listbox
            value={selectedValue}
            variant="solid"
            onChange={setSelectedKeys}
            multiple
            color="primary"
            className="w-full"
            aria-label="Branches"
          >
            {store.branchs.map((branch) => {
              return (
                <ListboxItem className="p-0 m-0" value={branch.branch_cr}>
                  <BranchDetails branch={branch} /> 
                </ListboxItem>
              );
            })}
          </Listbox>
        </CardBody>
        <Divider />
        <CardFooter>
          <Link
            className="text-tiny uppercase font-bold"
            showAnchorIcon
            href="/branches"
            color="primary"
          >
            Sucursales.
          </Link>
        </CardFooter>
      </Card>
      <Card className="col-span-12 sm:col-span-4 h-[300px]">
        <CardHeader className="absolute z-10 top-1 flex-col !items-start">
          <p className="text-tiny text-white/60 uppercase font-bold">
            Supercharged
          </p>
          <h4 className="text-white font-medium text-large">
            Creates beauty like a beast
          </h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src="https://nextui.org/images/card-example-2.jpeg"
        />
      </Card>
      <Card
        isFooterBlurred
        className="w-full h-[300px] col-span-12 sm:col-span-5"
      >
        <CardHeader className="absolute z-10 top-1 flex-col items-start">
          <p className="text-tiny text-white/60 uppercase font-bold">New</p>
          <h4 className="text-black font-medium text-2xl">Acme camera</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card example background"
          className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
          src="https://nextui.org/images/card-example-6.jpeg"
        />
        <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
          <div>
            <p className="text-black text-tiny">Available soon.</p>
            <p className="text-black text-tiny">Get notified.</p>
          </div>
          <Button className="text-tiny" color="primary" radius="full" size="sm">
            Notify Me
          </Button>
        </CardFooter>
      </Card>
      <Card
        isFooterBlurred
        className="w-full h-[300px] col-span-12 sm:col-span-7"
      >
        <CardHeader className="absolute z-10 top-1 flex-col items-start">
          <p className="text-tiny text-white/60 uppercase font-bold">
            Your day your way
          </p>
          <h4 className="text-white/90 font-medium text-xl">
            Your checklist for better sleep
          </h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Relaxing app background"
          className="z-0 w-full h-full object-cover"
          src="https://nextui.org/images/card-example-5.jpeg"
        />
        <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
          <div className="flex flex-grow gap-2 items-center">
            <Image
              alt="Breathing app icon"
              className="rounded-full w-10 h-11 bg-black"
              src="https://nextui.org/images/breathing-app-icon.jpeg"
            />
            <div className="flex flex-col">
              <p className="text-tiny text-white/60">Breathing App</p>
              <p className="text-tiny text-white/60">
                Get a good night's sleep.
              </p>
            </div>
          </div>
          <Button radius="full" size="sm">
            Get App
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;
