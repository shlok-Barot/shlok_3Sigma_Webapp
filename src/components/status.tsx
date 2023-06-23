import React, { PropsWithChildren, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { updateLeadStatus } from "../services/leadService";

interface PropsT {
  showStatusPopup: boolean;
  toggleLeadStatus: () => void;
  onStatusChange: (e: any) => void;
  selectedStatus: string;
  setShowStatusPopup: React.Dispatch<React.SetStateAction<boolean>>;
  from: string;
  id: string;
  getLeads: () => void;
  setOpenWithHeader: React.Dispatch<React.SetStateAction<boolean>>;
}

interface StatusI {
  status: Array<{
    color: string;
    idDefault: boolean;
    name: string;
    value: string;
  }>;
}

const SelectLeadStatus: React.FC<PropsWithChildren<PropsT>> = ({
  showStatusPopup,
  toggleLeadStatus,
  onStatusChange,
  selectedStatus,
  setShowStatusPopup,
  from,
  id,
  getLeads,
  setOpenWithHeader,
}) => {
  const [leadStatus, setLeadStatus] = useState<StatusI>();

  const getPreferncesFromLocalStorage = async () => {
    setLeadStatus(
      await JSON.parse(localStorage.getItem("user_preferences") || "")
    );
  };

  useEffect(() => {
    getPreferncesFromLocalStorage();
  }, []);

  const renderStatus = () =>
    leadStatus?.status?.map((item) => {
      return (
        <div className="form-check">
          <input
            className="form-check-input"
            checked={item.value === selectedStatus}
            type="checkbox"
            value={item.value}
            id="flexCheckDefault"
            onChange={(e) => onStatusChange(e)}
          />
          &nbsp;
          <i className="bi-circle-fill" style={{ color: item.color }}></i>
          &nbsp;
          <label className="form-check-label">{item?.name}</label>
        </div>
      );
    });

  const onSave = async () => {
    if (from === "details") {
      let ids = [];
      ids.push(id);
      try {
        const response = await updateLeadStatus({
          leadIDs: ids,
          status: selectedStatus,
        });
        if (response && response.status) {
          toast.success(response?.data?.message);
          setOpenWithHeader(false);
          getLeads();
        }
      } catch (err) {
        toast.error("Error while updating status!");
      }
    }
    setShowStatusPopup(false);
  };

  return (
    <Modal isOpen={showStatusPopup} toggle={toggleLeadStatus}>
      <ModalHeader toggle={toggleLeadStatus}>Select Status</ModalHeader>
      <ModalBody>{renderStatus()}</ModalBody>
      <ModalFooter>
        <button
          onClick={toggleLeadStatus}
          type="button"
          className="btn btn-secondary "
        >
          Cancel
        </button>
        <button
          disabled={!selectedStatus}
          onClick={() => onSave()}
          type="button"
          className="btn btn-primary "
        >
          Save
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default SelectLeadStatus;
