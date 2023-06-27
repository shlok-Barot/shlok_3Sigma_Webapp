import React, { PropsWithChildren, useState } from "react";

interface Props {
  actionDrawerTitle: string;
  selectedAction: string;
  handlePlusMinusValue: (e: any, tab: string) => void;
  SubActionSelectOnchange: (e: any) => void;
  delayValue: number;
  statusData: any;
  labelData: any;
  leadListData: any;
  userListData: any;
  delayMinMaxMsg: string;
  onSaveDrawerClose: (obj: any) => void;
}
const ActionCommonDrawer: React.FC<PropsWithChildren<Props>> = ({
  actionDrawerTitle,
  selectedAction,
  handlePlusMinusValue,
  SubActionSelectOnchange,
  delayValue,
  statusData,
  labelData,
  leadListData,
  userListData,
  delayMinMaxMsg,
  onSaveDrawerClose,
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
        {actionDrawerTitle === "Delay" ? (
          <>
            <div className="delay_plus_minus">
              <i
                className="bi bi-dash-circle-fill"
                onClick={(e: any) => handlePlusMinusValue(e, "minus")}
              ></i>
              <input
                type="number"
                min="1"
                max="366"
                name="delay"
                className="form-control plus_minus"
                value={delayValue}
                onChange={(e: any) => handlePlusMinusValue(e, "")}
              />
              <i
                className="bi bi-plus-circle-fill"
                onClick={(e: any) => handlePlusMinusValue(e, "plus")}
              ></i>
            </div>
            {delayMinMaxMsg && (
              <p style={{ color: "red" }}> {delayMinMaxMsg}</p>
            )}
          </>
        ) : (
          <>
            <label>{selectLabel}</label>
            <select
              name={selectedAction}
              className="form-select"
              onChange={(e: any) => SubActionSelectOnchange(e)}
            >
              <option value="">{selectOption}</option>
              {actionDrawerTitle === "Change status" ? (
                <>
                  {statusData.map((data: any, j: number) => {
                    return (
                      <option value={data.value} key={j}>
                        {data.name}
                      </option>
                    );
                  })}
                </>
              ) : actionDrawerTitle === "Change Label" ? (
                <>
                  {labelData.map((data: any, j: number) => {
                    return (
                      <option value={data.value} key={j}>
                        {data.name}
                      </option>
                    );
                  })}
                </>
              ) : actionDrawerTitle === "Move to list" ||
                actionDrawerTitle === "Copy to list" ? (
                <>
                  {leadListData.map((data: any, j: number) => {
                    return (
                      <option value={data._id} key={j}>
                        {data.name}
                      </option>
                    );
                  })}
                </>
              ) : actionDrawerTitle === "Send notification" ||
                actionDrawerTitle === "Assign lead" ? (
                <>
                  {userListData.map((data: any, j: number) => {
                    return (
                      <option value={data._id} key={j}>
                        {data.name}
                      </option>
                    );
                  })}
                </>
              ) : null}
            </select>
          </>
        )}
      </div>
      <div className="auto_action_form_btn">
        <button
          type="button"
          className="btn btn-primary-save"
          onClick={() => onSaveDrawerClose({})}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ActionCommonDrawer;
