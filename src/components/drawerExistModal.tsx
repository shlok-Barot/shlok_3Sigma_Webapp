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
    <Modal
      className="delete_modal"
      isOpen={showExitModal}
      toggle={toggleEditModal}
    >
      <ModalBody>
        <div className="delete_modal_body">
          <h4>Are you sure you want to exit ?</h4>
          <div className="delete_div_btn">
            <Button
              // variant="default"
              className="btn delete_btn"
              onClick={handleDrawerClick}
            >
              Ok
            </Button>
            <Button // variant="default"
              className="btn delete_btn"
              onClick={toggleEditModal}
            >
              No
            </Button>
          </div>
        </div>
      </ModalBody>
      {/* <ModalFooter>
        <Button
          variant="danger"
          className="btn-danger"
          onClick={handleDrawerClick}
        >
          Ok
        </Button>
        <Button variant="default" onClick={toggleEditModal}>
          No
        </Button>
      </ModalFooter> */}
    </Modal>
  );
};

export default DrawerExistModal;
