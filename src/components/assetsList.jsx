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
} from "@nextui-org/react";
import { EyeIcon } from "../assets/icons/EyeIcon.jsx";
import { DeleteIcon } from "../assets/icons/DeleteIcon.jsx";

export default function AssetsList({ userMB }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { store, actions } = useContext(Context);

  const removeAssets = (assetId) => {
    actions.editAssetUserMB(assetId, null);
    actions.getUsersMB();
  };

  return (
    <>
      <Button variant="link" color="primary" onPress={onOpen}>
        <EyeIcon />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Activos</ModalHeader>
              <ModalBody>
                <ul className="list-disc pl-5">
                  {userMB.assets.map((asset, index) => (
                    <li
                      key={asset.id}
                      className="flex justify-between"
                    >
                      <span>
                        {index + 1} - {asset.asset_type} - {asset.asset_brand} -{" "}
                        {asset.asset_model} - {asset.asset_serial} -{" "}
                        {asset.asset_inventory_number}
                      </span>{" "}
                      <Button
                        color="danger"
                        size="xs"
                        variant="link"
                        className="text-lg text-danger cursor-pointer"
                        onClick={() => removeAssets(asset.id)}
                      ><DeleteIcon /></Button>
                      <Button color="danger" size="xs" variant="link">
                        <span
                          className="text-lg text-danger cursor-pointer"
                          onClick={() => onClose()}
                        ></span>
                      </Button>
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
}
