import React, { useContext, useEffect, useState, useMemo } from "react";
import { Context } from "../store/appContext";
import {
  Listbox,
  ListboxItem,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Select,
} from "@nextui-org/react";
import { PlusIcon } from "@heroicons/react/24/outline";


export default function AddAsset({userMB}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { store, actions } = useContext(Context);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  const assets = store.assets


  const addAssets = () => {
    selectedKeys.forEach((assetId) => {
      actions.editAssetUserMB(assetId, userMB.id);
    });
    actions.getUsersMB();
  };

  useEffect(() => {
    actions.getAssets();
  }, []);

  return (
    <>
      <Button variant="link" color="primary" onPress={onOpen}>
        <PlusIcon />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                 
                    <Listbox
                      aria-label="Multiple selection example"
                      variant="flat"
                      disallowEmptySelection
                      selectionMode="multiple"
                      selectedKeys={selectedKeys}
                      onSelectionChange={setSelectedKeys}
                    >
                       {store.assets.map((asset) => (
                      <ListboxItem key={asset.id} value={asset.id}>
                        {asset.asset_type} - {asset.asset_brand} - {asset.asset_model} - {asset.asset_serial} - {asset.asset_inventory_number}
                      </ListboxItem>
                    ))} 
                    </Listbox>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={() => addAssets(selectedValue)}>
                  Agregar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
