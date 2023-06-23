import React, { PropsWithChildren } from "react";
import { Modal, Button, ModalBody, ModalFooter } from "reactstrap";

interface PropsT {
  showExitModal: boolean;
  toggleEditModal: () => void;
  handleDrawerClick: () => void;
}

const DrawerExistModal: React.FC<PropsWithChildren<PropsT>> = ({
  showExitModal,
  toggleEditModal,
  handleDrawerClick,
}) => {
  return (
    <Modal isOpen={showExitModal} toggle={toggleEditModal}>
      <ModalBody>
        <div className="alert alert-danger">Are you sure want to exit?</div>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="danger"
          className="btn-danger"
          onClick={handleDrawerClick}
        >
          Yes
        </Button>
        <Button variant="default" onClick={toggleEditModal}>
          No
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DrawerExistModal;
