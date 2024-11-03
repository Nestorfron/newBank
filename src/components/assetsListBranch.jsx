import React, { useContext, useEffect, useState, useMemo } from "react";
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


export default function AssetsListBranch({ branch }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { store, actions } = useContext(Context);

  const removeAssets = (assetId) => {
    actions.editAssetUserMB(assetId, null);
    actions.getUsersMB();
    actions.getAssets();
  };

  useEffect(() => {
    actions.getAssets();
    actions.getBranchs();
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
              <ModalHeader className="flex flex-col gap-1">Activos</ModalHeader>
              <ModalBody>
              <Listbox className="list-disc pl-5" textValue="id" aria-labelledby="listbox-label">
                  {branch.assets.map((asset, index) => (
                    <ListboxItem
                      textValue={asset.id}
                      key={asset.id}
                      className="flex justify-between border rounded-lg p-2 m-2"
                    >
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
                          Numero de Serial:{" "}
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
                        <p>
                          Asignado a : {" "}
                          <span className="text-gray-500">
                            {asset.user_mb_id ? store.usersMB.find(userMB => userMB.id === asset.user_mb_id).names + " " + store.usersMB.find(userMB => userMB.id === asset.user_mb_id).last_names : "No asignado"}
                          </span>
                        </p>
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
