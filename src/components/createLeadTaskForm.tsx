import moment from "moment";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { repeatOptions, taskDueDates } from "../utils/globalConstants";
import ErrorText from "./errorText";
import * as yup from "yup";
import update from "immutability-helper";
import { createNewTask, updateTaskbyId } from "../services/taskService";
import toast, { Toaster } from "react-hot-toast";
import { setLeadTaskList } from "../actions/actions";

interface taskTypeI {
  type: string;
  toBePerformAt: string | undefined;
  dueDate: string;
  time: string;
  repeat: string;
  assignedTo: string;
  notes: string;
  leadIds: Array<string>;
}
interface Props {
  leadIds: Array<{ id: string }>;
  modalId: string;
  updateModalValue: any;
  action: string;
  formName: string;
  onTaskDelete: (id: string) => void;
}

const CreateLeadDetailsTaskForm: React.FC<PropsWithChildren<Props>> = ({
  leadIds,
  modalId,
  updateModalValue,
  action,
  formName,
  onTaskDelete,
}) => {
  const DUE_DATE_FORMAT = "YYYY-MM-DD";
  const [isCustomDate, toggleCustomDate] = useState(false);
  const [taskList, setTaskList] = useState<Array<any>>([]);
  const [taskAssignTo, setTaskAssignTo] = useState<Array<any>>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const [taskData, setTaskData] = useState<taskTypeI>({
    type: "",
    toBePerformAt: "",
    dueDate: "",
    time: "",
    repeat: "",
    assignedTo: "",
    notes: "",
    leadIds: [leadIds[0]?.id],
  });

  const [errors, setErrors] = useState({
    type: "",
    toBePerformAt: "",
    time: "",
    repeat: "",
    assignedTo: "",
    notes: "",
  });
  const dispatch = useDispatch();
  const StoreData = useSelector((state: any) => {
    return state?.rootReducers;
  });

  const handleSetDueDate = (dueDateType: string) => {
    setErrors({
      ...errors,
      toBePerformAt: "",
    });
    switch (dueDateType) {
      case "today":
        setTaskData({
          ...taskData,
          toBePerformAt: moment().format(DUE_DATE_FORMAT),
          dueDate: dueDateType,
        });
        toggleCustomDate(false);
        break;
      case "tomorrow":
        setTaskData({
          ...taskData,
          toBePerformAt: moment().add(1, "d").format(DUE_DATE_FORMAT),
          dueDate: dueDateType,
        });
        toggleCustomDate(false);
        break;
      case "3d":
        setTaskData({
          ...taskData,
          toBePerformAt: moment().add(3, "d").format(DUE_DATE_FORMAT),
          dueDate: dueDateType,
        });
        toggleCustomDate(false);
        break;
      case "1w":
        setTaskData({
          ...taskData,
          toBePerformAt: moment().add(7, "d").format(DUE_DATE_FORMAT),
          dueDate: dueDateType,
        });
        toggleCustomDate(false);
        break;
      case "1m":
        setTaskData({
          ...taskData,
          toBePerformAt: moment().add(1, "M").format(DUE_DATE_FORMAT),
          dueDate: dueDateType,
        });
        toggleCustomDate(false);
        break;
      case "custom":
        setTaskData({
          ...taskData,
          toBePerformAt: undefined,
          dueDate: dueDateType,
        });
        toggleCustomDate(true);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    let Store_data = StoreData?.userData?.userDetails;

    let TempArrya = [];
    let orgTeam = Store_data?.organizationTeams;
    let orgRole = Store_data?.organizationRoles;

    let orgEmp = Store_data?.organizationEmployee;

    TempArrya = orgEmp.filter((obj1: any) =>
      orgTeam.some((obj2: any) => obj2._id === obj1.team)
    );
    const mergedArray = TempArrya.map((obj1: any) => {
      const matchingObjTeam = orgTeam.find(
        (obj2: any) => obj2._id === obj1.team
      );
      const matchingObjRole = orgRole.find(
        (obj2: any) => obj2._id === obj1.role
      );
      let temp_obj = {
        TeamName: matchingObjTeam.name,
        RoleName: matchingObjRole.name,
      };
      if (matchingObjTeam && matchingObjRole) {
        return { ...obj1, ...temp_obj };
      }
      return obj1;
    });
    setTaskAssignTo(mergedArray);
    setTaskList(StoreData?.user?.userPreferences?.taskType);
  }, []);
  $(modalId).modal({
    backdrop: "static",
    keyboard: false,
  });
  useEffect(() => {
    if (formName === "Task") {
      if (Object.values(updateModalValue).length > 0) {
        let someDate = new Date(updateModalValue.toBePerformAt);
        let date = someDate.setDate(someDate.getDate());
        let defaultValue = new Date(date).toISOString().split("T")[0];
        let time = new Date(date).toISOString().split("T")[1];
        let tempTime = moment(time, "hh:mm:ss").format("hh:mm:ss");

        setTaskData({
          type: updateModalValue.type,
          toBePerformAt: defaultValue,
          dueDate: "custom",
          notes: updateModalValue.notes,
          time: tempTime,
          assignedTo: updateModalValue?.assignedTo[0]?._id,
          repeat: updateModalValue.repeat,
          leadIds: [leadIds[0]?.id],
        });
        setIsCompleted(updateModalValue.isCompleted);
        toggleCustomDate(true);
      }
    }
  }, [updateModalValue]);

  let schema = yup.object().shape({
    type: yup.string().required("Task Type is required"),
    toBePerformAt: yup.string().required("Due Date is required"),
    repeat: yup.string().required("Repeat is required"),
    time: yup.string().required("Time is required"),
    assignedTo: yup.string().required("Task Assigned is required"),
    notes: yup.string().max(200, "Max 200 characters are allowed"),
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.currentTarget;
    setTaskData({
      ...taskData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: null,
    });
  };

  const handleTaskSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const isFormValid = await schema.isValid(taskData, {
      abortEarly: false,
    });
    if (isFormValid) {
      let UtcDate = moment
        .parseZone(`${taskData.toBePerformAt}T${taskData.time}`)
        .utc(true)
        .format();
      let assignData = [];
      assignData.push(taskData.assignedTo);
      let tempObj: any = {};
      if (action === "Add") {
        tempObj = {
          leadIds: taskData.leadIds,
          ...(taskData.notes.length > 0 && {
            notes: taskData.notes,
          }),
          type: taskData.type,
          toBePerformAt: UtcDate,
          extraDetails: {},
          assignedTo: assignData,
          repeat: taskData.repeat !== "repeat" ? taskData.repeat : "",
        };
      } else {
        tempObj = {
          ...(taskData.notes.length > 0 && {
            notes: taskData.notes,
          }),
          type: taskData.type,
          toBePerformAt: UtcDate,
          extraDetails: {},
          assignedTo: assignData,
          repeat: taskData.repeat !== "repeat" ? taskData.repeat : "",
          isCompleted: isCompleted,
        };
      }
      try {
        let response: any = "";
        if (action === "Add") {
          response = await createNewTask(tempObj);
        } else {
          response = await updateTaskbyId(updateModalValue._id, tempObj);
        }
        if (response && response.status) {
          const responseData = response?.data;
          const tempArray = [...StoreData?.leadTask?.leadTask];
          if (action === "Add") {
            tempArray?.unshift(responseData?.data);
          } else {
            const tempData = tempArray.findIndex(
              (x) => x._id == responseData.data._id
            );
            tempArray.splice(tempData, 1, responseData.data);
          }
          dispatch(setLeadTaskList(tempArray));
          toast.success(responseData?.message);
          resetFormvalue();
          $(modalId).modal("hide");
        }
      } catch (err) {
        toast.error("Error while creating new task");
      }
    } else {
      schema.validate(taskData, { abortEarly: false }).catch((err) => {
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
  const resetFormvalue = () => {
    setTaskData({
      type: "",
      toBePerformAt: "",
      dueDate: "",
      time: "",
      repeat: "",
      assignedTo: "",
      notes: "",
      leadIds: [leadIds[0]?.id],
    });
    setIsCompleted(false);
    toggleCustomDate(false);
  };
  const handleCloseActivityModal = () => {
    resetFormvalue();
    $(modalId).modal("hide");
  };
  return (
    <>
      <div
        className="modal fade popup-section-1 popup-section-2 popup-section-3"
        data-backdrop="static"
        data-keyboard="false"
        id="AddNewTask"
        role="dialog"
        tabIndex={-1}
        style={{ zIndex: "999999999999999" }}
      >
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{action} Task</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => handleCloseActivityModal()}
              ></button>
            </div>
            <form id="AddNewTask">
              {/* <form id="LeadsFilterForm" className="follwup_drower"> */}
              <div className="form_container_body">
                {action !== "Add" && (
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ float: "right" }}
                  >
                    <i
                      className="fa fa-trash-o"
                      style={{
                        color: "red",
                        fontSize: "23px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        onTaskDelete(updateModalValue?._id);
                      }}
                    />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Task Type </label>
                  <select
                    id="inputState"
                    value={taskData?.type}
                    onChange={(e) => handleChange(e)}
                    name="type"
                    className="form-select"
                  >
                    <option value="">Select Task Type</option>
                    {taskList?.map((task) => (
                      <option value={task?.value}>{task?.name}</option>
                    ))}
                  </select>
                  {errors.type ? <ErrorText message={errors?.type} /> : ""}
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <select
                    className="form-select"
                    value={taskData?.dueDate}
                    name="dueDate"
                    onChange={(e) => handleSetDueDate(e.target.value)}
                  >
                    <option value="">Select due date</option>
                    {taskDueDates.map((dueDate) => (
                      <option value={dueDate.value}>{dueDate.name}</option>
                    ))}
                  </select>
                  {errors.toBePerformAt ? (
                    <ErrorText message={errors?.toBePerformAt} />
                  ) : (
                    ""
                  )}
                </div>
                {isCustomDate && (
                  <div className="form-group">
                    <label className="form-label">Custom Date</label>
                    <input
                      type="date"
                      id="task_date"
                      name="toBePerformAt"
                      className="form-control"
                      // defaultValue={moment().format("YYYY-MM-DD")}
                      value={moment(taskData.toBePerformAt).format(
                        "YYYY-MM-DD"
                      )}
                      min={moment().format("YYYY-MM-DD")}
                      placeholder="Enter Date"
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <div className="timepicker-element">
                    <input
                      name="time"
                      value={taskData?.time}
                      onChange={(e) => handleChange(e)}
                      className="form-control"
                      type="time"
                      id="time1"
                    />
                  </div>
                  {errors.time ? <ErrorText message={errors?.time} /> : ""}
                </div>
                <div className="form-group">
                  <label className="form-label">Repeat</label>
                  <select
                    id="inputState"
                    value={taskData?.repeat}
                    onChange={(e) => handleChange(e)}
                    name="repeat"
                    className="form-select"
                  >
                    <option value="">Select When to Repeat</option>
                    {repeatOptions?.map((option, i) => (
                      <option value={option.value} key={i}>
                        {option?.name}
                      </option>
                    ))}
                  </select>
                  {errors.repeat ? <ErrorText message={errors?.repeat} /> : ""}
                </div>
                <div className="form-group">
                  <label className="form-label">Assign to</label>
                  <select
                    id="inputState"
                    name="assignedTo"
                    value={taskData?.assignedTo}
                    className="form-select"
                    onChange={(e) => handleChange(e)}
                  >
                    <option value="">Select Task Assign to</option>
                    {taskAssignTo?.map((item: any, j: number) => {
                      return (
                        <option value={item?._id} key={j}>
                          <label>
                            {item.firstName} - {item.TeamName} - {item.RoleName}
                          </label>
                        </option>
                      );
                    })}
                  </select>
                  {errors.assignedTo ? (
                    <ErrorText message={errors?.assignedTo} />
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Note</label>
                  <textarea
                    className="form-control note_area"
                    value={taskData?.notes}
                    onChange={(e) => handleChange(e)}
                    name="notes"
                    style={{ height: "120px" }}
                    placeholder="Enter your note"
                  ></textarea>
                  {errors.notes ? <ErrorText message={errors?.notes} /> : ""}
                </div>
                {action === "Edit" && (
                  <div className="form-group">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      id="isComplete"
                      name="isComplete"
                      onChange={() => setIsCompleted(!isCompleted)}
                    />
                    &nbsp;&nbsp;
                    <label htmlFor="isComplete" className="form-label">
                      Is Completed
                    </label>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={(e) => handleTaskSubmit(e)}
                  className="btn LeadsFilterApply"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default CreateLeadDetailsTaskForm;
