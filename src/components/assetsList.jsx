import React, { useContext, useEffect, useState, useMemo } from "react";
import { Context } from "../store/appContext";
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
import { DeleteIcon } from "../assets/icons/DeleteIcon.jsx";

export default function AssetsList({ userMB }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { store, actions } = useContext(Context);

  const removeAssets = (assetId) => {
    actions.editAssetUserMB(assetId, null);
    actions.getUsersMB();
    actions.getAssets();
  };

  useEffect(() => {
    actions.getAssets();
    actions.getUsersMB();
  }, []);

  return (
    <>
      <Button variant="link" color="primary" onPress={onOpen}>
        <EyeIcon />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Activos Adjudicados
              </ModalHeader>
              <ModalBody>
                <Listbox textValue="id" aria-labelledby="listbox-label">
                  {userMB.assets.map((asset, index) => (
                    <ListboxItem
                      key={asset.id}
                      className="border rounded-lg p-2 m-2"
                      textValue={asset.id}
                    >
                      <div className="flex justify-between">
                        <div key={index}>
                          <p>
                            Tipo:{" "}
                            <span className="text-gray-500">
                              {asset.asset_type}
                            </span>
                          </p>
                          <p>
                            Marca:{" "}
                            <span className="text-gray-500">
                              {asset.asset_brand}
                            </span>
                          </p>
                          <p>
                            Modelo:{" "}
                            <span className="text-gray-500">
                              {asset.asset_model}
                            </span>
                          </p>
                          <p>
                            Serial:{" "}
                            <span className="text-gray-500">
                              {asset.asset_serial}
                            </span>
                          </p>
                          <p>
                            Numero de Inventario:{" "}
                            <span className="text-gray-500">
                              {asset.asset_inventory_number}
                            </span>
                          </p>
                        </div>
                        <Button
                          color="danger"
                          size="xs"
                          variant="link"
                          className="text-lg text-danger cursor-pointer my-auto ms-auto"
                          onClick={() => removeAssets(asset.id)}
                        >
                          <DeleteIcon />
                        </Button>
                      </div>
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
}
