import React, { PropsWithChildren, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { updateLeadLabel } from "../services/leadService";

interface LabelI {
  labels: Array<{
    color: string;
    idDefault: boolean;
    name: string;
    value: string;
  }>;
}

interface PropsT {
  showLabelPopup: boolean;
  toggleLeadLabel: () => void;
  onLabelChange: (e: any) => void;
  selectedLabel: Array<string>;
  setShowLabelPopup: React.Dispatch<React.SetStateAction<boolean>>;
  from: string;
  id: string;
  getLeads: () => void;
  setOpenWithHeader: React.Dispatch<React.SetStateAction<boolean>>;
  LabelData: Array<any>;
}

const SelectLeadLabel: React.FC<PropsWithChildren<PropsT>> = ({
  showLabelPopup,
  toggleLeadLabel,
  onLabelChange,
  setShowLabelPopup,
  from,
  selectedLabel,
  id,
  getLeads,
  setOpenWithHeader,
  LabelData,
}) => {
  const onSave = async () => {
    if (from === "details") {
      let tempArray = [];
      for (let i = 0; i < LabelData.length; i++) {
        if (LabelData[i].isLabelChecked) {
          tempArray.push(LabelData[i].value);
        }
      }
      let ids = [];
      ids.push(id);
      try {
        const response = await updateLeadLabel({
          leadIDs: ids,
          label: tempArray,
        });
        if (response && response.status) {
          toast.success(response?.data?.message);
          setOpenWithHeader(false);
          getLeads();
        }
      } catch (err) {
        toast.error("Error while updating labels!");
      }
    }
    setShowLabelPopup(false);
  };

  return (
    <Modal isOpen={showLabelPopup} toggle={toggleLeadLabel}>
      <ModalHeader toggle={toggleLeadLabel}>Select Label</ModalHeader>
      <ModalBody>
        {LabelData?.map((item) => {
          return (
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={item.value}
                checked={item?.isLabelChecked ? true : false}
                id="flexCheckDefault"
                onChange={(e) => onLabelChange(e)}
              />
              &nbsp;
              <i className="bi-circle-fill" style={{ color: item.color }}></i>
              &nbsp;
              <label className="form-check-label">{item?.name}</label>
            </div>
          );
        })}
      </ModalBody>
      <ModalFooter>
        <button
          onClick={toggleLeadLabel}
          type="button"
          className="btn btn-secondary "
        >
          Cancel
        </button>
        <button
          onClick={() => onSave()}
          type="button"
          className="btn btn-primary "
        >
          Save
        </button>
      </ModalFooter>
      <Toaster />
    </Modal>
  );
};

export default SelectLeadLabel;
