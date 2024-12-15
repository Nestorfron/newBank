import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { FormMigrations } from "./FormMigrations.jsx";
import Swal from "sweetalert2";
import { PlusCircle } from "lucide-react";
import * as XLSX from "xlsx"; // Importamos la librería xlsx para leer el archivo Excel
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalContent,
  ModalBody,
  useDisclosure,
  ModalFooter,
} from "@nextui-org/react";

export const CreateMigrations = () => {
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
        "Fecha de Instalación",
        "Fecha de Migración",
        "Descripción de Migración",
        "Estado de Migración",
        "ID de Usuario",
        "Proveedor",
        "Sucursal",
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
          installation_date,
          migration_date,
          migration_description,
          migration_status,
          user_id,
          provider_id,
          branch_id,
        ] = row;
        console.log(
          installation_date,
          migration_date,
          migration_description,
          migration_status,
          user_id,
          provider_id,
          branch_id
        );
        actions.add_migration(
          installation_date,
          migration_date,
          migration_description,
          migration_status,
          user_id,
          provider_id,
          branch_id
        );
      });

      Swal.fire({
        icon: "success",
        title: "Archivo procesado correctamente",
        text: "Las sucursales han sido agregadas.",
      });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <Button auto onClick={openModal} size="md" color="primary">
        <PlusCircle/> Agregar Migracion
      </Button>

      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="2xl">  
        <ModalContent>
          {(onClose) => (
            <>
             
                
                
                <FormMigrations btnMigration={"Crear"} />
              
            </>
          )}

          
        </ModalContent>
      
      </Modal>
    </>
  );
};
