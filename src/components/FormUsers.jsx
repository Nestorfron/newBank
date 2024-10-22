import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.jsx";
import {
  Input,
  Button,
  Spacer,
  Switch,
  ModalFooter,
  Select,
  SelectItem,
} from "@nextui-org/react";
import Swal from "sweetalert2";

export const FormUsers = ({ id, btnUser, user: initialUser }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    user_name: "",
    password: "",
    names: "",
    last_names: "",
    employee_number: "",
    subzone: "",
    role: "",
    is_active: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Cargando...",
      text: id
        ? "Espere mientras se actualiza el usuario"
        : "Espere mientras se crea el usuario",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = id
        ? await actions.editUser(
            id,
            user.user_name,
            user.password,
            user.names,
            user.last_names,
            user.employee_number,
            user.subzone,
            user.is_active,
            user.role
          )
        : await actions.register(
            user.user_name,
            user.password,
            user.names,
            user.last_names,
            user.employee_number,
            user.subzone,
            user.is_active,
            user.role
          );
      Swal.fire({
        position: "center",
        icon: "success",
        title: id ? "Usuario Actualizado" : "Usuario creado correctamente",
        showConfirmButton: false,
        timer: 1500,
      });
      if (!id) {
        setUser({
          user_name: "",
          password: "",
          names: "",
          last_names: "",
          employee_number: "",
          subzone: "",
          role: "",
          is_active: false,
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
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");
      return;
    }
    actions.getUsers();
    if (initialUser) {
      setUser({
        user_name: initialUser.user_name || "",
        names: initialUser.names || "",
        last_names: initialUser.last_names || "",
        employee_number: initialUser.employee_number || "",
        subzone: initialUser.subzone || "",
        role: initialUser.role || "",
        is_active: initialUser.is_active || false,
      });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <Input
          label="Nombre de Usuario"
          name="user_name"
          value={user.user_name}
          onChange={handleChange}
          required
        />
        <Input
          label="Contraseña"
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          required
        />
        <Input
          label="Nombres"
          name="names"
          value={user.names}
          onChange={handleChange}
          required
        />
        <Input
          label="Apellidos"
          name="last_names"
          value={user.last_names}
          onChange={handleChange}
          required
        />
        <Input
          label="Número de Empleado"
          name="employee_number"
          value={user.employee_number}
          onChange={handleChange}
          required
        />
        <Input
          label="Subzona"
          name="subzone"
          value={user.subzone}
          onChange={handleChange}
          required
        />
        <Select
          label="Rol"
          placeholder={user.role}
          name="role"
          required
          value={user.role}
          onChange={handleChange}
        >
          {store.role.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </Select>
        <div className="flex items-center">
          <Switch
            name="is_active"
            isSelected={user.is_active}
            onChange={(e) => setUser({ ...user, is_active: e.target.checked })}
          />
          <label className="ml-2">Activo</label>
        </div>
      </div>
      <Spacer />

      <ModalFooter>
        <Button type="submit" color="primary" disabled={loading}>
          {btnUser}
        </Button>
      </ModalFooter>
    </form>
  );
};
