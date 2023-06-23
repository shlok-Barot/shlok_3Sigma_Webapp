/* eslint-disable react-hooks/exhaustive-deps */
import React, { PropsWithChildren, useEffect, useState } from "react";
import {
  automationWhenTriggerData,
  automationActionData,
} from "../../utils/globalConstants";
import DrawerComponent from "./actionsDrawer";
import ActionCreateTask from "./actionCreateTask";
import ActionCommonDrawer from "./actionCommonDrawer";

interface LeadDataI {}
const AutomationRuleDrawer: React.FC<PropsWithChildren<LeadDataI>> = ({}) => {
  const [addActionForm, setAddActionForm] = useState<any>([]);
  const [actionBaseDrawer, setActionBaseDrawer] =
    React.useState<boolean>(false);
  const [actionDrawerTitle, setActionDrawerTitle] = React.useState<string>("");

  const addFormAction = () => {
    let tempArray: any = [...addActionForm];
    tempArray.push("");
    setAddActionForm(tempArray);
  };

  const removeAction = (i: number) => {
    let tempArray: any = [...addActionForm];
    tempArray.splice(i, 1);
    setAddActionForm(tempArray);
  };
  const addActionCreateUI = () => {
    return addActionForm.map((item: any, i: number) => (
      <div className="col-md-8 auto_select_action" key={i}>
        <label>Action {i + 1} :</label>
        <select
          name="type"
          className="form-select"
          onChange={(e) => handleActionChange(e)}
        >
          <option value="">Select action</option>
          {automationActionData.map((data: any, j: number) => {
            return (
              <option value={data.name} key={j}>
                {data.name}
              </option>
            );
          })}
        </select>
        <img
          alt="cancel"
          src="assets/img/cancel.png"
          className="cancel_div"
          onClick={() => removeAction(i)}
        />
      </div>
    ));
  };

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.currentTarget;
    if (value === "Wait") {
      setActionDrawerTitle("Delay");
    } else {
      setActionDrawerTitle(value);
    }
    setActionBaseDrawer(true);
  };
  return (
    <div className="row auto_rule_form">
      <div className="col-md-12">
        <label>Rule name</label>
        <input
          type="text"
          name="ruleName"
          className="form-control"
          placeholder="Enter your rule name"
          //   onChange={(e) => handleChange(e)}
        />
      </div>
      <div className="col-md-12">
        <label>Rule discription</label>
        <input
          type="text"
          name="ruleName"
          className="form-control"
          placeholder="Enter brief discription"
          //   onChange={(e) => handleChange(e)}
        />
      </div>
      <div className="col-md-12 when_then">
        <span className="auto_dot">
          <label className="dot_no">1</label>
        </span>
        <label className="when_then_label">When</label>
        <span className="when_then_trigger">
          Choose trigger to start the automation
        </span>
        <div className="col-md-4 auto_select">
          <select name="type" className="form-select">
            <option value="">Select trigger</option>
            {automationWhenTriggerData.map((data: any, i: number) => {
              return (
                <option value={data.value} key={i}>
                  {data.name}
                </option>
              );
            })}
          </select>
          <label>AND</label>
          <select name="type" className="form-select">
            <option value="">Select task type </option>
          </select>
        </div>
      </div>
      <div className="col-md-12 when_then">
        <span className="auto_dot">
          <label className="dot_no">2</label>
        </span>
        <label className="when_then_label">Then</label>
        <span className="when_then_trigger">
          Select the action that will be executed if the conditions of the
          automation are met
        </span>
        <div className="add_new_plus" onClick={addFormAction}>
          <span className="auto_dot_plus">
            <img alt="right" src="assets/img/plus.png" />
          </span>
          <label>ADD ACTION</label>
        </div>
        {addActionCreateUI()}
      </div>
      <div className="d-flex justify-content-center auto_form_btn">
        <button type="reset" className="btn btn-primary">
          Create Automation Rule
        </button>
      </div>
      <div className="automatic_rule_drawer">
        <DrawerComponent
          openWithHeader={actionBaseDrawer}
          setOpenWithHeader={setActionBaseDrawer}
          drawerTitle={actionDrawerTitle}
          size="xs"
        >
          {actionDrawerTitle === "Create task" ? (
            <ActionCreateTask
              leadIds={[{ id: "" }]}
              updateModalValue={{}}
              action={"Add"}
            />
          ) : (
            <ActionCommonDrawer actionDrawerTitle={actionDrawerTitle} />
          )}
        </DrawerComponent>
      </div>
    </div>
  );
};

export default AutomationRuleDrawer;
