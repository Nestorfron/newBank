import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.jsx";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Button } from "@nextui-org/button";
import { MoonIcon, SunIcon, UserIcon} from "@heroicons/react/24/outline";
import { User, Menu, X, Home, Users, Building2, Truck, Link as Enlaces, Box, UserPlus, ArrowRightLeft} from "lucide-react";
import img from "../assets/drapp_logo.png";

import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Tooltip,
} from "@nextui-org/react";
import BellNotifications from "./bellNotifications.jsx";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const { setTheme, theme } = useTheme();
  const [isDark, setIsDark] = useState(theme === "dark");

  const logout = (e) => {
    e.preventDefault();
    actions.logout();
    navigate("/");
  };

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    setIsDark(!isDark);
  };

  const jwt = localStorage.getItem("token");
  const user = store.me;

  return (
    <NextUINavbar isBordered maxWidth="xl" position="sticky">
      <NavbarBrand className="gap-3 max-w-fit">
        <button
          disabled={!jwt}
          className="flex justify-start items-center gap-1 "
          color="foreground"
          onClick={() =>
            navigate(
              user.role === "Ingeniero de Campo"
                ? "/engenieerDashboard"
                : "/dashboard"
            )
          }
        >
          <Avatar src={img} alt="DR-App" />
        </button>
      </NavbarBrand>
      <NavbarContent className="" justify="start">
        <NavbarMenuToggle size="lg" className="sm:hidden" />
        <div className="hidden sm:flex gap-4 justify-center ml-2">
          <NavbarContent className="flex flex-row justify-center">
            <NavbarItem>
              <Button
                className={
                  !jwt || user.role === "Ingeniero de Campo" ? "hidden" : ""
                }
                onClick={() => navigate("/users")}
                variant="light"
                size="sm"
              >
              <UserPlus/>
                Usuarios
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                className={
                  !jwt || user.role === "Ingeniero de Campo" ? "hidden" : ""
                }
                onClick={() => navigate("/branches")}
                variant="light"
                size="sm"
              >
                <Building2/>
                Sucursales
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                className={
                  !jwt || user.role === "Ingeniero de Campo" ? "hidden" : ""
                }
                onClick={() => navigate("/providers")}
                variant="light"
                size="sm"
              >
                <Truck/>
                Proveedores
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                className={
                  !jwt || user.role === "Ingeniero de Campo" ? "hidden" : ""
                }
                onClick={() => navigate("/links")}
                variant="light"
                size="sm"
              >
                <Enlaces/>
                Enlaces
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                className={
                  !jwt || user.role === "Ingeniero de Campo" ? "hidden" : ""
                }
                onClick={() => navigate("/assets")}
                variant="light"
                size="sm"
              >
                <Box/>
                Activos
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                className={
                  !jwt || user.role === "Ingeniero de Campo" ? "hidden" : ""
                }
                onClick={() => navigate("/usersMb")}
                variant="light"
                size="sm"
              >
                <Users/>
                Usuarios MB
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                className={
                  !jwt || user.role === "Ingeniero de Campo" ? "hidden" : ""
                }
                onClick={() => navigate("/migrations")}
                variant="light"
                size="sm"
              >
                <ArrowRightLeft/>
                Migraciones
              </Button>
            </NavbarItem>
          </NavbarContent>
        </div>
      </NavbarContent>
      <NavbarItem className="flex items-center">
        <button onClick={toggleTheme}>
          {isDark ? (
            <SunIcon className="h-6 w-6" color="primary" variant="shadow" />
          ) : (
            <MoonIcon className="h-6 w-6" color="primary" variant="light" />
          )}
        </button>
      </NavbarItem>
      <NavbarMenu className="flex flex-row justify-center">
        <ul>
          <li>
            <Button
              className={
                !jwt || user.role === "Ingeniero de Campo" ? "hidden" : ""
              }
              onClick={() => navigate("/users")}
              variant="link"
            >
              Usuarios
            </Button>
          </li>
          <li>
            <Button
              className={
                !jwt || user.role === "Ingeniero de Campo" ? "hidden" : ""
              }
              onClick={() => navigate("/branches")}
              variant="link"
            >
              Sucursales
            </Button>
          </li>
          <li>
            <Button
              className={
                !jwt || user.role === "Ingeniero de Campo" ? "hidden" : ""
              }
              onClick={() => navigate("/providers")}
              variant="link"
            >
              Proveedores
            </Button>
          </li>
          <li>
            <Button
              className={
                !jwt || user.role === "Ingeniero de Campo" ? "hidden" : ""
              }
              onClick={() => navigate("/links")}
              variant="link"
            >
              Enlaces
            </Button>
          </li>
          <li>
            <Button
              className={
                !jwt || user.role === "Ingeniero de Campo" ? "hidden" : ""
              }
              onClick={() => navigate("/assets")}
              variant="link"
            >
              Activos
            </Button>
          </li>
          <li>
            <Button
              className={
                !jwt || user.role === "Ingeniero de Campo" ? "hidden" : ""
              }
              onClick={() => navigate("/usersMb")}
              variant="link"
            >
              Usuarios MB
            </Button>
          </li>
          <li>
            <Button
              className={
                !jwt || user.role === "Ingeniero de Campo" ? "hidden" : ""
              }
              onClick={() => navigate("/migrations")}
              variant="link"
            >
              Migraciones
            </Button>
          </li>
        </ul>
      </NavbarMenu>
      <NavbarItem className={!jwt || user.role === "Ingeniero de Campo" ?   "hidden" : ""}>
        <BellNotifications userId={user.id} />
      </NavbarItem>
      <NavbarItem>
        <Dropdown placement="bottom-end">
          <DropdownTrigger isDisabled={!jwt}>
            <UserIcon className="h-6 w-6" color="primary" variant="light" />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Iniciaste sesión como</p>
              <p>
                {user && user.user_name} - {user && user.role}
              </p>
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={logout}>
              Cerrar Sesión
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarItem>
    </NextUINavbar>
  );
};
