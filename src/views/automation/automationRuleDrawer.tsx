/* eslint-disable react-hooks/exhaustive-deps */
import React, { PropsWithChildren, useEffect, useState } from "react";
import {
  automationWhenTriggerData,
  automationActionData,
} from "../../utils/globalConstants";
import DrawerComponent from "./actionsDrawer";
import ActionCreateTask from "./actionCreateTask";
import ActionCommonDrawer from "./actionCommonDrawer";
import {
  getAllIntegration,
  getFilePageContent,
  getLeadList,
  getUserOrganizationList,
  createAutomation,
  updateAutomation,
} from "../../services/automationService";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { toast } from "react-toastify";
import ErrorText from "../../components/errorText";
import update from "immutability-helper";

interface autoFormI {
  name: string;
  description: string;
  event: string;
  targetValues: string;
}
interface AutoDataI {
  autoRuleDrawerToggle: () => void;
  onAutomationDelete: (id: string) => void;
  updateAutomationDetail: any;
  isUpdateAuto: boolean;
  handleGetAutomationList: () => void;
}
const AutomationRuleDrawer: React.FC<PropsWithChildren<AutoDataI>> = ({
  autoRuleDrawerToggle,
  onAutomationDelete,
  updateAutomationDetail,
  isUpdateAuto,
  handleGetAutomationList,
}) => {
  const StoreData = useSelector((state: any) => {
    return state?.rootReducers;
  });
  const [addActionForm, setAddActionForm] = useState<any>([]);
  const [actionBaseDrawer, setActionBaseDrawer] =
    React.useState<boolean>(false);
  const [actionDrawerTitle, setActionDrawerTitle] = React.useState<string>("");
  const [selectedAction, setSelectedAction] = React.useState<string>("");
  const [delayValue, setDelayValue] = React.useState<number>(1);
  const [isShowAutoEvent, setIsShowAutoEvent] = React.useState<boolean>(false);
  const [automationData, setAutomationData] = useState<autoFormI>({
    name: "",
    description: "",
    event: "",
    targetValues: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });
  const [sourceByData, setSourceByData] = useState<any>([]);
  const [statusData, setStatusData] = useState<any>([]);
  const [labelData, setlabelData] = useState<any>([]);
  const [statusLabelData, setStatusLabelData] = useState<any>([]);
  const [taskData, setTaskData] = useState<any>([]);
  const [viewPageData, setViewPageData] = useState<any>([]);
  const [viewFileData, setViewFileData] = useState<any>([]);
  const [leadListData, setLeadListData] = useState<any>([]);
  const [activityListData, setActivityListData] = useState<any>([]);
  const [userListData, setUserListData] = useState<any>([]);
  const [delayMinMaxMsg, setDelayMinMaxMsg] = useState<string>("");
  const [actionDaysData, setActionDaysData] = useState<any>([]);
  console.log(updateAutomationDetail, "updateAutomationDetail");

  useEffect(() => {
    setStatusData(StoreData?.user?.userPreferences?.status);
    setlabelData(StoreData?.user?.userPreferences?.labels);
    setTaskData(StoreData?.user?.userPreferences?.taskType);
    setActivityListData(StoreData?.user?.userPreferences?.activityType);
  }, []);

  useEffect(() => {
    if (isUpdateAuto) {
      setAutomationData({
        name: updateAutomationDetail.name,
        description: updateAutomationDetail.description,
        event: updateAutomationDetail.event,
        targetValues: updateAutomationDetail?.condition?.targetValues[0],
      });
      let isAutoEvent = [
        "edit_lead",
        "create_incoming_activity",
        "create_outgoing_activity",
        "create_miscalled_activity",
        "create_quotation",
        "edit_quotation",
      ];
      if (
        !(
          isAutoEvent.filter((x: string) => x === updateAutomationDetail.event)
            .length > 0
        )
      ) {
        setIsShowAutoEvent(true);
      } else {
        setIsShowAutoEvent(false);
      }
    }
  }, []);

  useEffect(() => {
    if (automationData?.event === "create_lead") {
      handleGetAllIntegration();
    }
    if (
      automationData?.event === "view_page" ||
      automationData?.event === "view_file"
    ) {
      handleGetFilePageContent();
    }
    setStatusLabelData(
      automationData?.event === "label_change"
        ? StoreData.user.userPreferences.labels
        : StoreData.user.userPreferences.status
    );
  }, [automationData?.event]);

  let schema = yup.object().shape({
    name: yup.string().required("Rule name is required"),
    description: yup.string().required("Description is required"),
  });

  const addFormAction = () => {
    let tempArray: any = [...addActionForm];
    tempArray.push("");
    setAddActionForm(tempArray);
  };

  const removeAction = (i: number) => {
    let tempArray: any = [...addActionForm];
    tempArray.splice(i, 1);
    setAddActionForm(tempArray);
    setDelayValue(1);
  };

  const handlePlusMinusValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    tab: string
  ) => {
    const { value } = e.currentTarget;
    let tempArray: any = [...actionDaysData];
    let finalNo =
      tab === "plus"
        ? delayValue + 1
        : tab === "minus"
        ? delayValue - 1
        : tab === ""
        ? Number(value)
        : 1;
    let objIndex = tempArray.findIndex((x: any) => x.type === "delay");

    if (objIndex === -1) {
      let tempObj = {
        type: "delay",
        data: { ["delay"]: finalNo },
      };
      tempArray.push(tempObj);
    } else {
      tempArray[objIndex].data.delay = finalNo;
    }
    setActionDaysData(tempArray);

    if (tab === "plus") {
      if (finalNo < 366) {
        setDelayValue(finalNo);
        setDelayMinMaxMsg("");
      } else {
        setDelayMinMaxMsg("Maximum value is 365.");
      }
    } else if (tab === "minus") {
      if (finalNo > 0) {
        setDelayValue(finalNo);
        setDelayMinMaxMsg("");
      } else {
        setDelayMinMaxMsg("Minimum value is 1.");
      }
    } else if (tab === "") {
      if (Number(value) > 0) {
        setDelayValue(Number(value));
        setDelayMinMaxMsg("");
      }
    }
  };
  const SubActionSelectOnchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    let selectName =
      selectedAction === "status_change"
        ? "status"
        : selectedAction === "label_change"
        ? "label"
        : selectedAction === "move_to_list" || selectedAction === "copy_to_list"
        ? "targetListId"
        : selectedAction === "push_notification"
        ? "push_notification"
        : selectedAction === "assign_lead"
        ? "assignToUser"
        : selectedAction;
    let tempArray: any = [...actionDaysData];
    let tempObj = {
      type: name,
      data: { [selectName]: value },
    };
    tempArray.push(tempObj);
    setActionDaysData(tempArray);
  };

  const handleActionChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    i: number
  ) => {
    const { name, value } = e.currentTarget;
    let data = automationActionData.filter((x: any) => x.value === value)[0]
      .name;

    if (value === "wait") {
      setActionDrawerTitle("Delay");
    } else {
      setActionDrawerTitle(data);
    }
    setSelectedAction(value);
    let tempArray: any = [...addActionForm];
    tempArray[i] = { [name]: value };
    setAddActionForm(tempArray);

    for (let i = 0; i < tempArray.length; i++) {
      if (
        tempArray[i].actionName === "move_to_list" ||
        tempArray[i].actionName === "copy_to_list"
      ) {
        handleGetLeadList();
      }
      if (
        tempArray[i].actionName === "push_notification" ||
        tempArray[i].actionName === "assign_lead"
      ) {
        handleGetUserOrganization();
      }
    }
    setActionBaseDrawer(true);
  };

  const onSaveDrawerClose = (objData: any) => {
    if (Object.keys(objData).length > 0) {
      let tempArray: any = [...actionDaysData];
      let tempObj = {
        type: selectedAction,
        data: objData,
      };
      tempArray.push(tempObj);
      setActionDaysData(tempArray);
    }

    setActionBaseDrawer(false);
  };
  const handleAutoFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.currentTarget;
    if (name === "event") {
      let isAutoEvent = [
        "edit_lead",
        "create_incoming_activity",
        "create_outgoing_activity",
        "create_miscalled_activity",
        "create_quotation",
        "edit_quotation",
      ];
      if (!(isAutoEvent.filter((x: string) => x === value).length > 0)) {
        setIsShowAutoEvent(true);
      } else {
        setIsShowAutoEvent(false);
      }
    }
    setAutomationData({
      ...automationData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: null,
    });
  };

  const handleGetAllIntegration = async () => {
    try {
      const response = await getAllIntegration({
        isAscending: false,
        page: 1,
        perPage: 15,
      });
      if (response && response.status) {
        setSourceByData(response.data.data);
      }
    } catch (err) {
      console.log(err, "Error");
    }
  };

  const handleGetUserOrganization = async () => {
    try {
      const response = await getUserOrganizationList({
        isAscending: false,
        page: 1,
        perPage: 15,
      });
      if (response && response.status) {
        setUserListData(response.data.data);
      }
    } catch (err) {
      console.log(err, "Error");
    }
  };

  const handleGetLeadList = async () => {
    try {
      const response = await getLeadList({
        isAscending: false,
        page: 1,
        perPage: 15,
      });
      if (response && response.status) {
        setLeadListData(response.data.data);
      }
    } catch (err) {
      console.log(err, "Error");
    }
  };

  const handleGetFilePageContent = async () => {
    try {
      const response = await getFilePageContent({
        isAscending: false,
        page: 1,
        perPage: 15,
        type: automationData?.event === "view_page" ? "page" : "file",
      });
      if (response && response.status) {
        if (automationData?.event === "view_page") {
          setViewPageData(response.data.data);
        } else {
          setViewFileData(response.data.data);
        }
      }
    } catch (err) {
      console.log(err, "Error");
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const isFormValid = await schema.isValid(automationData, {
      abortEarly: false,
    });
    // debugger;
    if (isFormValid) {
      try {
        let tempDaysData: any = [];
        for (let i = 0; i < actionDaysData.length; i++) {
          let day_no;
          let index = actionDaysData.findIndex((x: any) => x.type == "delay");
          if (actionDaysData[i].type === "delay") {
            day_no = i + actionDaysData[i].data.delay;
          } else {
            day_no = i;
          }
          if (actionDaysData[i].type !== "delay") {
            let tempObj = {
              [`day_${day_no}`]: [actionDaysData[i]],
            };
            tempDaysData.push(tempObj);
          }
        }
        let Objdata: any = {
          name: automationData.name,
          description: automationData.description,
          event: automationData.event,
          condition: {
            [automationData.event === "edit_task" ? "field" : "targetValues"]:
              automationData.event === "edit_task"
                ? automationData.targetValues
                : [automationData.targetValues],
          },
          action: Object.assign({}, tempDaysData),
        };
        let response;
        if (isUpdateAuto) {
          response = await updateAutomation(
            updateAutomationDetail._id,
            Objdata
          );
        } else {
          response = await createAutomation(Objdata);
        }
        if (response && response.status) {
          toast.success(response?.data?.message);
          autoRuleDrawerToggle();
          handleGetAutomationList();
        }
      } catch (err) {
        toast.error("error while creating new lead!");
      }
    } else {
      schema.validate(automationData, { abortEarly: false }).catch((err) => {
        const errors = err.inner.reduce(
          (acc: any, error: { path: string; message: string }) => {
            return {
              ...acc,
              [error.path]: error.message,
            };
          },
          {}
        );
        setErrors((prevErrors) =>
          update(prevErrors, {
            $set: errors,
          })
        );
      });
    }
  };

  return (
    <div className="row auto_rule_form">
      {isUpdateAuto && (
        <div style={{ textAlign: "right" }}>
          <i
            className="fa fa-trash-o"
            style={{ color: "red", fontSize: "23px", cursor: "pointer" }}
            onClick={() => {
              onAutomationDelete(updateAutomationDetail._id);
            }}
          />
        </div>
      )}
      <div className="col-md-12">
        <label>Rule name</label>
        <input
          type="text"
          name="name"
          autoComplete="off"
          className={
            isUpdateAuto ? "form-control disabled_input" : "form-control"
          }
          value={automationData?.name}
          placeholder="Enter your rule name"
          onChange={(e) => handleAutoFormChange(e)}
          disabled={isUpdateAuto}
        />
        {errors.name && <ErrorText message={errors.name} />}
      </div>
      <div className="col-md-12">
        <label>Rule discription</label>
        <input
          type="text"
          name="description"
          autoComplete="off"
          className="form-control"
          value={automationData?.description}
          placeholder="Enter brief discription"
          onChange={(e) => handleAutoFormChange(e)}
        />
        {errors.description && <ErrorText message={errors.description} />}
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
          <select
            name="event"
            value={automationData?.event}
            className={
              isUpdateAuto ? "form-select disabled_input" : "form-select"
            }
            disabled={isUpdateAuto}
            onChange={(e) => handleAutoFormChange(e)}
          >
            <option value="">Select trigger</option>
            {automationWhenTriggerData.map((data: any, i: number) => {
              return (
                <option value={data.value} key={i}>
                  {data.name}
                </option>
              );
            })}
          </select>
          {isShowAutoEvent && (
            <>
              <label className="and">AND</label>
              <span className="and_source">
                {automationData?.event === "create_lead"
                  ? "Lead source is"
                  : automationData?.event === "status_change"
                  ? "Status is updated to"
                  : automationData?.event === "label_change"
                  ? "Label is updated to"
                  : automationData?.event === "view_page"
                  ? "Page is"
                  : automationData?.event === "view_file"
                  ? "File is"
                  : automationData?.event === "create_activity"
                  ? "Activity is"
                  : automationData?.event === "edit_task"
                  ? ""
                  : automationData?.event === "create_task"
                  ? "Task type is"
                  : null}
              </span>
              <select
                name="targetValues"
                className={
                  isUpdateAuto
                    ? "form-select and_select disabled_input"
                    : "form-select and_select"
                }
                disabled={isUpdateAuto}
                value={automationData?.targetValues}
                onChange={(e) => handleAutoFormChange(e)}
              >
                <option value="">Select </option>
                {automationData?.event === "create_lead" ? (
                  <>
                    {sourceByData.map((item: any, i: number) => {
                      return (
                        <>
                          {item.isDisplayable && (
                            <option value={item._id} key={i}>
                              {item.name}
                            </option>
                          )}
                        </>
                      );
                    })}
                  </>
                ) : automationData?.event === "status_change" ||
                  automationData?.event === "label_change" ? (
                  <>
                    {statusLabelData.map((item: any, i: number) => {
                      return (
                        <option value={item.value} key={i}>
                          {item.name}
                        </option>
                      );
                    })}
                  </>
                ) : automationData?.event === "view_page" ? (
                  <>
                    {viewPageData.map((item: any, i: number) => {
                      return (
                        <option value={item._id} key={i}>
                          {item.details.title}
                        </option>
                      );
                    })}
                  </>
                ) : automationData?.event === "view_file" ? (
                  <>
                    {viewFileData.map((item: any, i: number) => {
                      return (
                        <>
                          {item.files[0].fileName && (
                            <option value={item._id} key={i}>
                              {item.files[0].fileName}
                            </option>
                          )}
                        </>
                      );
                    })}
                  </>
                ) : automationData?.event === "create_task" ? (
                  <>
                    {taskData.map((item: any, i: number) => {
                      return (
                        <option value={item.value} key={i}>
                          {item.name}
                        </option>
                      );
                    })}
                  </>
                ) : automationData?.event === "edit_task" ? (
                  <>
                    <option value={"toBePerformAt"}>toBePerformAt</option>
                    <option value={"isCompleted"}>isCompleted</option>
                  </>
                ) : automationData?.event === "create_activity" ? (
                  <>
                    {activityListData.map((item: any, i: number) => {
                      return (
                        <option value={item.value} key={i}>
                          {item.name}
                        </option>
                      );
                    })}
                  </>
                ) : null}
              </select>
            </>
          )}
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
        {addActionForm?.map((el: any, i: number) => (
          <div className="col-md-8 auto_select_action" key={i}>
            <label>Action {i + 1} :</label>
            <select
              name="actionName"
              className="form-select"
              value={el?.actionName || ""}
              onChange={(e) => handleActionChange(e, i)}
            >
              <option value="">Select action</option>
              {automationActionData.map((data: any, j: number) => {
                return (
                  <option value={data.value} key={j}>
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
        ))}
      </div>
      <div className="d-flex justify-content-center auto_form_btn">
        <button type="reset" className="btn btn-primary" onClick={handleSubmit}>
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
              addUpdateModalValue={{}}
              onSaveDrawerClose={onSaveDrawerClose}
            />
          ) : (
            <ActionCommonDrawer
              actionDrawerTitle={actionDrawerTitle}
              selectedAction={selectedAction}
              handlePlusMinusValue={handlePlusMinusValue}
              SubActionSelectOnchange={SubActionSelectOnchange}
              delayValue={delayValue}
              statusData={statusData}
              labelData={labelData}
              leadListData={leadListData}
              userListData={userListData}
              delayMinMaxMsg={delayMinMaxMsg}
              onSaveDrawerClose={onSaveDrawerClose}
            />
          )}
        </DrawerComponent>
      </div>
    </div>
  );
};

export default AutomationRuleDrawer;
