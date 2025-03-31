import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import {
  Input,
  Button,
  Spacer,
  ModalFooter,
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react";
import Swal from "sweetalert2";

export const FormAdmins = ({ id, btnAdmins, admin: initialAdmin }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    user_name: "",
    password: "",
    names: "",
    last_names: "",
    employee_number: "",
    subzone: "",
    is_active: "",
    role: "Admin",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
    console.log(admin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Cargando...",
      text: id
        ? "Espere mientras se actualiza el Admins"
        : "Espere mientras se crea el Admins",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = id
        ? await actions.editAdmins(
            id,
            admin.user_name,
            admin.password,
            admin.names,
            admin.last_names,
            admin.employee_number,
            admin.subzone,
            admin.is_active,
            admin.role
          )
        : await actions.create_admins(
            admin.user_name,
            admin.password,
            admin.names,
            admin.last_names,
            admin.employee_number,
            admin.subzone,
            admin.is_active,
            admin.role
          );
      Swal.fire({
        position: "center",
        icon: "success",
        title: id ? "Admins Actualizado" : "Admins creado correctamente",
        showConfirmButton: false,
        timer: 1500,
      });
      if (!id) {
        setAdmin({
          user_name: "",
          password: "",
          names: "",
          last_names: "",
          employee_number: "",
          subzone: "",
          is_active: "",
          role: "",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Hubo un problema: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // const jwt = localStorage.getItem("token");
    // if (!jwt) {
    //   navigate("/");
    //   return;
    // }
    actions.getAdmins();
    if (initialAdmin) {
      setAdmin({
        user_name: initialAdmin.user_name || "",
        names: initialAdmin.names || "",
        last_names: initialAdmin.last_names || "",
        employee_number: initialAdmin.employee_number || "",
        subzone: initialAdmin.subzone || "",
        is_active: initialAdmin.is_active || false,
        role: initialAdmin.role || "",
      });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <Input
          label="Nombre de Usuario"
          name="user_name"
          value={admin.user_name}
          onChange={handleChange}
          required
        />
        <Input
          label="Contraseña"
          type="password"
          name="password"
          value={admin.password}
          onChange={handleChange}
          required
        />
        <Input
          label="Nombres"
          name="names"
          value={admin.names}
          onChange={handleChange}
          required
        />
        <Input
          label="Apellidos"
          name="last_names"
          value={admin.last_names}
          onChange={handleChange}
          required
        />
        <Input
          label="Número de Empleado"
          name="employee_number"
          value={admin.employee_number}
          onChange={handleChange}
          required
        />
        <Input
          label="Subzona"
          name="subzone"
          value={admin.subzone}
          onChange={handleChange}
          required
        />
        <div className="flex items-center">
          <Switch
            name="is_active"
            isSelected={admin.is_active}
            onChange={(e) => setAdmin({ ...admin, is_active: e.target.checked })}
          />
          <label className="ml-2">Activo</label>
        </div>
      </div>
      <Spacer />
      <ModalFooter>
        <Button type="submit" color="primary" disabled={loading}>
          {btnAdmins}
        </Button>
      </ModalFooter>
    </form>
  );
};