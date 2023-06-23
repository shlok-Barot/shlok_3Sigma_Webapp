import React, { PropsWithChildren, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { repeatOptions, taskDueDates } from "../utils/globalConstants";
import moment from "moment";
import ErrorText from "./errorText";
import * as yup from "yup";
import update from "immutability-helper";
import { createNewTask, updateTaskbyId } from "../services/taskService";
import { toast } from "react-toastify";

// import _, { isEmpty } from "lodash";

interface Props {
  action: string;
  status: string;
  onTaskDelete: (id: any) => void;
  updateTaskValue: any;
  drawerClose: () => void;
  fetchTaskStatusFollowUps: () => void;
}

interface taskType {
  task: string;
  type: string;
  dueDate: string | undefined;
  toBePerformAt: string | undefined;
  time: string;
  repeat: string;
  taskAssign: string;
  notes: string;
  leadIds: string;
}

const CreateTaskForm: React.FC<PropsWithChildren<Props>> = ({
  updateTaskValue,
  action,
  status,
  drawerClose,
  onTaskDelete,
  fetchTaskStatusFollowUps,
}) => {
  const DUE_DATE_FORMAT = "YYYY-MM-DD";
  const StoreData = useSelector((state: any) => {
    return state?.rootReducers;
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [date, setDate] = useState<any>(null);
  const [isCustomDate, toggleCustomDate] = useState(false);
  const [leadList, setLeadList] = useState<Array<any>>([]);
  const [taskList, setTaskList] = useState<Array<any>>([]);
  const [taskAssignTo, setTaskAssignTo] = useState<Array<any>>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const [taskData, setTaskData] = useState<taskType>({
    task: "",
    type: "",
    dueDate: "",
    toBePerformAt: "",
    time: "",
    repeat: "",
    taskAssign: "",
    notes: "",
    leadIds: "",
  });

  const [errors, setErrors] = useState({
    task: "",
    type: "",
    dueDate: "",
    toBePerformAt: "",
    time: "",
    repeat: "",
    taskAssign: "",
    notes: "",
  });

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
    setLeadList(StoreData?.leads?.leads);
  }, []);
  useEffect(() => {
    if (action === "edit") {
      if (Object.values(updateTaskValue).length > 0) {
        let someDate = new Date(updateTaskValue.toBePerformAt);
        let date = someDate.setDate(someDate.getDate());
        let defaultValue = new Date(date).toISOString().split("T")[0];
        let time = new Date(date).toISOString().split("T")[1];
        let tempTime = moment(time, "hh:mm:ss").format("hh:mm:ss");

        setTaskData({
          task: updateTaskValue.lead[0]._id,
          type: updateTaskValue.type,
          dueDate: "custom",
          toBePerformAt: defaultValue,
          time: tempTime,
          repeat: updateTaskValue.repeat,
          taskAssign: updateTaskValue?.assignedTo[0]?._id,
          notes: updateTaskValue.notes,
          leadIds: updateTaskValue.lead[0]._id,
        });
        toggleCustomDate(true);
      }
    }
  }, [updateTaskValue]);

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
  let schema = yup.object().shape({
    task: yup.string().required("task is required"),
    type: yup.string().required("Task Type is required"),
    dueDate: yup
      .string()
      .required("due Date is required")
      .nullable()
      .notRequired(),
    toBePerformAt: yup.string().required("due Date is required"),
    // repeat: yup.string().required("Repeat is required"),
    time: yup.string().required("time is required"),
    // taskAssign: yup.string().required("task Assigned is required"),
    // notes: yup.string().required("Notes is required"),
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
        .utc()
        .format();
      let tempLeadIds = [];
      let assignData = [];
      if (taskData.taskAssign?.length > 0) {
        assignData.push(taskData.taskAssign);
      } else {
        assignData = [];
      }

      tempLeadIds.push(taskData.task);
      let tempObj: any = {};
      if (action === "add") {
        tempObj = {
          leadIds: tempLeadIds,
          type: taskData.type,
          toBePerformAt: UtcDate,
          extraDetails: {},
          ...(assignData?.length > 0 && {
            assignedTo: assignData,
          }),
          ...(taskData.repeat?.length > 0 && {
            repeat: taskData.repeat,
          }),
          ...(taskData.notes?.length > 0 && {
            notes: taskData.notes,
          }),
        };
      } else {
        tempObj = {
          type: taskData.type,
          toBePerformAt: UtcDate,
          extraDetails: {},
          ...(assignData?.length > 0 && {
            assignedTo: assignData,
          }),
          ...(taskData.repeat?.length > 0 && {
            repeat: taskData.repeat,
          }),
          ...(taskData.notes?.length > 0 && {
            notes: taskData.notes,
          }),
          isCompleted: isCompleted,
        };
      }
      try {
        let response: any = "";
        if (action === "add") {
          response = await createNewTask(tempObj);
        } else {
          response = await updateTaskbyId(updateTaskValue._id, tempObj);
        }
        if (response && response.status) {
          drawerClose();
          fetchTaskStatusFollowUps();
          toast.success(response?.data?.message);
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

  return (
    <>
      <form id="AddNewTask">
        {/* <form id="LeadsFilterForm" className="follwup_drower"> */}
        <div className="form-container">
          {action !== "add" && (
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ top: "10px", position: "absolute", right: "2rem" }}
            >
              <i
                className="fa fa-trash-o"
                style={{ color: "red", fontSize: "23px", cursor: "pointer" }}
                onClick={() => {
                  onTaskDelete(updateTaskValue?._id);
                }}
              />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Task for </label>
            <select
              onChange={(e) => handleChange(e)}
              value={taskData?.task}
              id="inputState"
              name="task"
              className="form-select"
            >
              <option value="">Select Task for</option>
              {leadList.map((lead, i) => (
                <option value={lead._id} key={i}>
                  {lead.name}
                </option>
              ))}
            </select>
            {errors.task ? <ErrorText message={errors?.task} /> : ""}
          </div>
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
              {taskList?.map((task, j) => (
                <option value={task?.value} key={j}>
                  {task?.name}
                </option>
              ))}
            </select>
            {errors.type ? <ErrorText message={errors?.type} /> : ""}
          </div>
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <select
              className="form-control"
              value={taskData?.dueDate}
              name="dueDate"
              onChange={(e) => handleSetDueDate(e.target.value)}
            >
              <option value="">Select due date</option>
              {taskDueDates.map((dueDate, d) => (
                <option value={dueDate.value} key={d}>
                  {dueDate.name}
                </option>
              ))}
            </select>
            {errors.dueDate ? <ErrorText message={errors?.dueDate} /> : ""}
          </div>
          {isCustomDate && (
            <div className="form-group">
              <label className="form-label">Custom Date</label>
              <input
                type="date"
                name="toBePerformAt"
                value={moment(taskData.toBePerformAt).format("YYYY-MM-DD")}
                onChange={(e) => handleChange(e)}
                className="form-control"
                placeholder="Enter Date"
                min={moment().format("YYYY-MM-DD")}
              ></input>
              {errors.toBePerformAt ? (
                <ErrorText message={errors?.toBePerformAt} />
              ) : (
                ""
              )}
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
              {repeatOptions.map((option, o) => (
                <option value={option.value} key={o}>
                  {option?.name}
                </option>
              ))}
            </select>
            {/* {errors.repeat ? <ErrorText message={errors?.repeat} /> : ""} */}
          </div>
          <div className="form-group">
            <label className="form-label">Task Assign to</label>
            <select
              id="inputState"
              value={taskData?.taskAssign}
              onChange={(e) => handleChange(e)}
              name="taskAssign"
              className="form-select"
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
            {/* {errors.taskAssign ? (
              <ErrorText message={errors?.taskAssign} />
            ) : (
              ""
            )} */}
          </div>
          <div className="form-group">
            <label className="form-label">Note</label>
            <textarea
              className="form-control note_area"
              value={taskData?.notes}
              onChange={(e) => handleChange(e)}
              name="notes"
              style={{ height: "120px" }}
              placeholder="Enter Note"
            ></textarea>
            {/* {errors.notes ? (
              <ErrorText message={errors?.notes} />
            ) : (
              ""
            )} */}
          </div>
          {(status === "today" || status === "overdue") && (
            <>
              {action === "edit" && (
                <div className="form-group">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    id="isCompleted"
                    name="isCompleted"
                    onChange={() => setIsCompleted(!isCompleted)}
                  />
                  &nbsp;
                  <label htmlFor="isCompleted" className="form-label">
                    Mark as Complete
                  </label>
                  <br></br>
                </div>
              )}
            </>
          )}

          <div className="d-flex justify-content-center w-100 mt-15">
            <button
              type="button"
              onClick={(e) => handleTaskSubmit(e)}
              className="btn LeadsFilterApply"
            >
              {action === "add" ? "Add Task" : "Update Task"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateTaskForm;
