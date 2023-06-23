
import React, { PropsWithChildren } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

interface ModalI {
    showModal: boolean,
    onConfirmation: () => void,
    toggleModal: () => void,
    message: string
}

const ConfirmationModal: React.FC<PropsWithChildren<ModalI>> = ({ showModal, toggleModal, onConfirmation, message }) => {
    return (
        <Modal isOpen={showModal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          Delete Confirmation
        </ModalHeader>
        <ModalBody><div className="alert alert-danger">{message}</div></ModalBody>
        <ModalFooter>
          <Button variant="default" onClick={toggleModal}>
            Cancel
          </Button>
          <Button variant="danger" className='btn-danger' onClick={() => onConfirmation() }>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    )
}

export default ConfirmationModal;
