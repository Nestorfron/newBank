import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { FormUsers_MB } from "./FormUsersMB.jsx";
import Swal from "sweetalert2";
import * as XLSX from "xlsx"; // Importamos la librería xlsx para leer el archivo Excel
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";

export const CreateUsersMB = () => {
  const [file, setFile] = useState(null); // Estado para almacenar el archivo seleccionado
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
  const { actions } = useContext(Context);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = useState("blur");

  const openModal = () => onOpen();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Función para procesar el archivo Excel y agregar los datos
  const handleFileUpload = () => {
    if (!file) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se ha seleccionado ningún archivo.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Asumimos que el archivo tiene una hoja llamada 'Sheet1'
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Convertimos los datos a JSON

      // Verificamos que los datos tengan el formato correcto
      const [header, ...rows] = jsonData;
      const expectedColumns = [
        "user_name_MB",
        "is_active",
        "names",
        "last_names",
        "employee_number",
        "branch_id",
        "asset_id",
      ];

      // Comprobamos si el archivo tiene todas las columnas necesarias
      const missingColumns = expectedColumns.filter(
        (col) => !header.includes(col)
      );

      if (missingColumns.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Error en el formato",
          html: `<p>El archivo no tiene las siguientes columnas requeridas: <b>${missingColumns.join(
            ", "
          )}</b></p>
               <p>El archivo debe tener las siguientes columnas en el encabezado: ${expectedColumns.join(
                 ", "
               )}</p>`,
        });
        return;
      }

      // Si el formato es correcto, procesamos cada fila
      rows.forEach((row) => {
        const [
          user_name_MB,
          is_active,
          names,
          last_names,
          employee_number,
          branch_id,
          asset_id,
        ] = row;
        console.log(
          user_name_MB,
          is_active,
          names,
          last_names,
          employee_number,
          branch_id,
          asset_id
        );
        actions.add_userMB(
          user_name_MB,
          is_active,
          names,
          last_names,
          employee_number,
          branch_id,
          asset_id
        );
      });

      Swal.fire({
        icon: "success",
        title: "Archivo procesado correctamente",
        text: "Los usuarios MB han sido agregadas.",
      });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <Button auto color="primary" onClick={openModal} size="md">
        <span> Agregar Usuario MB</span>
      </Button>

      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Crear Usuario MB</ModalHeader>
              <ModalBody>
                <h5>Cargar Archivo Excel</h5>
                <Input
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  label="Selecciona un archivo"
                  fullWidth
                />
                <Button
                  onClick={handleFileUpload}
                  color="primary"
                  auto
                  style={{ marginTop: "10px" }}
                >
                  Cargar Archivo Excel
                </Button>
                <h5 style={{ marginTop: "20px" }}>
                  Formulario de Agregar Usuario MB
                </h5>
                <FormUsers_MB btnUserMB={"Crear"} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
