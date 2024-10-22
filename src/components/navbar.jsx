import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.jsx";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Button } from "@nextui-org/button";
import { MoonIcon, SunIcon, UserIcon } from "@heroicons/react/24/outline";
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
} from "@nextui-org/react";

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
          className="flex justify-start items-center gap-1 "
          color="foreground"
          onClick={() => navigate("/dashboard")}
        >
          <Avatar src={img} alt="DR-App" />
        </button>
      </NavbarBrand>
      <NavbarContent className="" justify="start">
        <NavbarMenuToggle size="lg" className="sm:hidden" />
        <div className="hidden sm:flex gap-4 justify- ml-2">
          <NavbarContent>
            <NavbarItem>
              <Button
                isDisabled={!jwt}
                onClick={() => navigate("/users")}
                variant="link"
              >
                Usuarios
              </Button>
            </NavbarItem>
            <NavbarItem className="gap-2">
              <Button
                isDisabled={!jwt}
                onClick={() => navigate("/branches")}
                variant="link"
              >
                Sucursales
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                isDisabled={!jwt}
                onClick={() => navigate("/providers")}
                variant="link"
              >
                Proveedores
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                isDisabled={!jwt}
                onClick={() => navigate("/assets")}
                variant="link"
              >
                Activos
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                isDisabled={!jwt}
                onClick={() => navigate("/usersMb")}
                variant="link"
              >
                Usuarios MB
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                isDisabled={!jwt}
                onClick={() => navigate("/migrations")}
                variant="link"
              >
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
      <NavbarMenu>
        <ul>
          <li>
            <Button
              disabled={!jwt}
              onClick={() => navigate("/users")}
              variant="link"
            >
              Usuarios
            </Button>
          </li>
          <li className="gap-2">
            <Button
              disabled={!jwt}
              onClick={() => navigate("/branches")}
              variant="link"
            >
              Sucursales
            </Button>
          </li>
          <li>
            <Button
              disabled={!jwt}
              onClick={() => navigate("/providers")}
              variant="link"
            >
              Proveedores
            </Button>
          </li>
          <li>
            <Button
              disabled={!jwt}
              onClick={() => navigate("/assets")}
              variant="link"
            >
              Activos
            </Button>
          </li>
          <li>
            <Button
              disabled={!jwt}
              onClick={() => navigate("/usersMb")}
              variant="link"
            >
              Usuarios MB
            </Button>
          </li>
          <li>
            <Button
              disabled={!jwt}
              onClick={() => navigate("/migrations")}
              variant="link"
            >
              Migraciones
            </Button>
          </li>
        </ul>
      </NavbarMenu>
      <NavbarItem>
        <Dropdown placement="bottom-end">
          <DropdownTrigger isDisabled={!jwt}>
            <UserIcon
              className="h-6 w-6"
              color="primary"
              variant="light"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Iniciaste sesión como</p>
              <p>{user && user.user_name}</p>
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
