import React, { PropsWithChildren, useState } from "react";

interface Props {
  actionDrawerTitle: string;
}
const ActionCommonDrawer: React.FC<PropsWithChildren<Props>> = ({
  actionDrawerTitle,
}) => {
  const selectLabel =
    actionDrawerTitle === "Change status"
      ? "Select Status"
      : actionDrawerTitle === "Change Label"
      ? "Select Label"
      : actionDrawerTitle === "Move to list" ||
        actionDrawerTitle === "Copy to list"
      ? "Select Lead list"
      : actionDrawerTitle === "Send notification" ||
        actionDrawerTitle === "Assign lead"
      ? "Select user"
      : actionDrawerTitle === "Delay"
      ? "Select delay"
      : "";
  const selectOption =
    actionDrawerTitle === "Change status"
      ? "Select Status"
      : actionDrawerTitle === "Change Label"
      ? "Select Label"
      : actionDrawerTitle === "Move to list" ||
        actionDrawerTitle === "Copy to list"
      ? "Select Lead list"
      : actionDrawerTitle === "Send notification"
      ? "Select user"
      : actionDrawerTitle === "Assign lead"
      ? "Select user to assign lead to"
      : actionDrawerTitle === "Delay"
      ? "Select days"
      : "";
  return (
    <div className="row">
      <div className="form-group action_select">
        <label>{selectLabel}</label>
        <select name="type" className="form-select">
          <option value="">{selectOption}</option>
          <option value="">Select</option>
        </select>
      </div>
      <div className="auto_action_form_btn">
        <button type="button" className="btn btn-primary-save">
          Save
        </button>
      </div>
    </div>
  );
};

export default ActionCommonDrawer;
