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
                <ul className="list-disc pl-5">
                 {provider.engineers.map((engineer, index) => (
                    <li
                      key={engineer.id}
                      className="flex justify-between"
                    >
                      <span>
                        {index+1} - {engineer.names} {engineer.last_names} {engineer.employee_number} {engineer.subzone} 
                      </span>
                    </li>
                  ))}
                </ul>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
