import React, { PropsWithChildren } from "react";
import { Button, Modal, ModalBody } from "reactstrap";

interface ModalI {
  showModal: boolean;
  onConfirmation: () => void;
  toggleModal: () => void;
  message: string;
  title: string;
}

const ConfirmationModal: React.FC<PropsWithChildren<ModalI>> = ({
  showModal,
  toggleModal,
  onConfirmation,
  message,
  title,
}) => {
  return (
    <Modal className="delete_modal" isOpen={showModal} toggle={toggleModal}>
      {/* <ModalHeader toggle={toggleModal}>Delete Confirmation</ModalHeader> */}
      <ModalBody>
        <div className="delete_modal_body">
          <h4>Delete {title}?</h4>
          <p> This action is irreversible.</p>
          <div className="delete_div_btn">
            <Button
              // variant="danger"
              className="btn delete_btn"
              onClick={() => onConfirmation()}
            >
              Ok
            </Button>
            <Button
              // variant="default"
              className="btn delete_btn"
              onClick={toggleModal}
            >
              No
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ConfirmationModal;
