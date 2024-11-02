import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.jsx";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { EyeIcon } from "../assets/icons/EyeIcon.jsx";

export const EngineersList = ({provider}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { store, actions } = useContext(Context);

  

  return (
    <>
      <Button variant="link" color="primary" onPress={onOpen}>
        <EyeIcon />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Ingenierons de Campo</ModalHeader>
              <ModalBody>
                <Listbox textValue="id" aria-labelledby="listbox-label">
                {provider.engineers.map((engineer, index) => (
                    <ListboxItem
                      key={engineer.id}
                      className="flex flex-row gap-2 justify-between border rounded-lg p-2 m-2"
                      textValue={engineer.id}
                    > 
                      <span className="flex flex-row">
                      Nombres: {" "}
                        <p className="text-gray-500 ms-2">{engineer.names}</p>
                      </span>
                      <span className="flex flex-row">
                        Apellidos: {" "}
                        <p className="text-gray-500 ms-2">{engineer.last_names}</p>
                      </span>
                      <span className="flex flex-row">
                        Numero de Empleado: {" "}
                        <p className="text-gray-500 ms-2">{engineer.employee_number}</p>
                      </span>
                    </ListboxItem>
                  ))}
                </Listbox>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
