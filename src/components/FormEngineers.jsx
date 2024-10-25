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

export const FormEngineers = ({ id, btnEngineer, engineer: initialEngineer }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [engineer, setEngineer] = useState({
    user_name: "",
    password: "",
    names: "",
    last_names: "",
    employee_number: "",
    subzone: "",
    is_active: "",
    role: "",
  });

  const role = ["Engineer"]

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEngineer({ ...engineer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Cargando...",
      text: id
        ? "Espere mientras se actualiza el Engineer"
        : "Espere mientras se crea el Engineer",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = id
        ? await actions.editEngineer(
            id,
            engineer.user_name,
            engineer.password,
            engineer.names,
            engineer.last_names,
            engineer.employee_number,
            engineer.subzone,
            engineer.is_active,
            engineer.role
          )
        : await actions.create_engineer(
            engineer.user_name,
            engineer.password,
            engineer.names,
            engineer.last_names,
            engineer.employee_number,
            engineer.subzone,
            engineer.is_active,
            engineer.role
          );
      Swal.fire({
        position: "center",
        icon: "success",
        title: id ? "Engineer Actualizado" : "Engineer creado correctamente",
        showConfirmButton: false,
        timer: 1500,
      });
      if (!id) {
        setEngineer({
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
    actions.getEngineers();
    if (initialEngineer) {
      setEngineer({
        user_name: initialEngineer.user_name || "",
        names: initialEngineer.names || "",
        last_names: initialEngineer.last_names || "",
        employee_number: initialEngineer.employee_number || "",
        subzone: initialEngineer.subzone || "",
        is_active: initialEngineer.is_active || false,
        role: initialEngineer.role || "",
      });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <Input
          label="Nombre de Usuario"
          name="user_name"
          value={engineer.user_name}
          onChange={handleChange}
          required
        />
        <Input
          label="Contraseña"
          type="password"
          name="password"
          value={engineer.password}
          onChange={handleChange}
          required
        />
        <Input
          label="Nombres"
          name="names"
          value={engineer.names}
          onChange={handleChange}
          required
        />
        <Input
          label="Apellidos"
          name="last_names"
          value={engineer.last_names}
          onChange={handleChange}
          required
        />
        <Input
          label="Número de Empleado"
          name="employee_number"
          value={engineer.employee_number}
          onChange={handleChange}
          required
        />
        <Input
          label="Subzona"
          name="subzone"
          value={engineer.subzone}
          onChange={handleChange}
          required
        />
        <Select
          label="Rol"
          placeholder={engineer.role}
          name="role"
          required
          value={engineer.role}
          onChange={handleChange}
        >
          {role.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </Select>
        <div className="flex items-center">
          <Switch
            name="is_active"
            isSelected={engineer.is_active}
            onChange={(e) => setEngineer({ ...engineer, is_active: e.target.checked })}
          />
          <label className="ml-2">Activo</label>
        </div>
      </div>
      <Spacer />
      <ModalFooter>
        <Button type="submit" color="primary" disabled={loading}>
          {btnEngineer}
        </Button>
      </ModalFooter>
    </form>
  );
};