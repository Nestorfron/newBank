import React, { useContext, useState, useMemo, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";

export default function BranchDetails({ branch }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  return (
    <>
      <Button variant="link" onPress={onOpen} color="primary">
        {branch.branch_cr}
      </Button>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {branch.branch_cr}
              </ModalHeader>
              <ModalBody>
                <Accordion>
                  <AccordionItem
                    key="1"
                    aria-label="Dirección"
                    title="Dirección"
                  >
                    {branch.branch_address}
                  </AccordionItem>
                  <AccordionItem key="2" aria-label="Zona" title="Zona">
                    {branch.branch_zone}
                  </AccordionItem>
                  <AccordionItem key="3" aria-label="Subzona" title="Subzona">
                    {branch.branch_subzone}
                  </AccordionItem>
                  <AccordionItem
                    key="4"
                    aria-label="Cantidad de Usuarios MB"
                    title="Cantidad de Usuarios MB"
                  >
                    {branch.usersMB.length}
                  </AccordionItem>
                  <AccordionItem
                    key="5"
                    aria-label="Cantidad de Activos"
                    title="Cantidad de Activos"
                  >
                    {branch.assets.length}
                  </AccordionItem>
                  <AccordionItem
                    key="6"
                    aria-label="Cantidad de Migrationes"
                    title="Cantidad de Migrationes"
                  >
                    {branch.migrations.length}
                  </AccordionItem>
                  <AccordionItem
                    key="7"
                    aria-label="Cantidad de proveedores"
                    title="Cantidad de proveedores"
                  >
                    {branch.providers.length}
                  </AccordionItem>
                </Accordion>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Aceptar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
