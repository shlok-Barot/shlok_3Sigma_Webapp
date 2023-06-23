import moment from "moment";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { repeatOptions } from "../../utils/globalConstants";
import ErrorText from "../../components/errorText";
import * as yup from "yup";
import update from "immutability-helper";
import { createNewTask, updateTaskbyId } from "../../services/taskService";
import { toast } from "react-toastify";
import { setLeadTaskList } from "../../actions/actions";

interface taskTypeI {
  type: string;
  repeat: string;
  assignedTo: string;
  notes: string;
  leadIds: Array<string>;
}
interface Props {
  leadIds: Array<{ id: string }>;
  updateModalValue: any;
  action: string;
}

const ActionCreateTask: React.FC<PropsWithChildren<Props>> = ({
  leadIds,
  updateModalValue,
  action,
}) => {
  const [taskList, setTaskList] = useState<Array<any>>([]);
  const [taskAssignTo, setTaskAssignTo] = useState<Array<any>>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const [taskData, setTaskData] = useState<taskTypeI>({
    type: "",
    repeat: "",
    assignedTo: "",
    notes: "",
    leadIds: [leadIds[0]?.id],
  });

  const [errors, setErrors] = useState({
    type: "",
    repeat: "",
    assignedTo: "",
    notes: "",
  });
  const dispatch = useDispatch();
  const StoreData = useSelector((state: any) => {
    return state?.rootReducers;
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
  }, []);

  useEffect(() => {
    if (Object.values(updateModalValue).length > 0) {
      setTaskData({
        type: updateModalValue.type,
        notes: updateModalValue.notes,
        assignedTo: updateModalValue?.assignedTo[0]?._id,
        repeat: updateModalValue.repeat,
        leadIds: [leadIds[0]?.id],
      });
      setIsCompleted(updateModalValue.isCompleted);
    }
  }, [updateModalValue]);

  let schema = yup.object().shape({
    type: yup.string().required("Task Type is required"),
    repeat: yup.string().required("Repeat is required"),
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
      repeat: "",
      assignedTo: "",
      notes: "",
      leadIds: [leadIds[0]?.id],
    });
    setIsCompleted(false);
  };

  return (
    <>
      <div className="popup-section-1 popup-section-2 popup-section-3">
        <div className="">
          <div className="form-group">
            <label className="form-label">Task Type</label>
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
            <label className="form-label">Repeat</label>
            <select
              id="inputState"
              value={taskData?.repeat}
              onChange={(e) => handleChange(e)}
              name="repeat"
              className="form-select"
            >
              <option value="">Select When to Repeat</option>
              {repeatOptions?.map((option: any, i: number) => (
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
        <div className="auto_form_btn">
          <button
            type="button"
            onClick={(e) => handleTaskSubmit(e)}
            className="btn btn-primary-save"
          >
            SAVE
          </button>
        </div>
      </div>
    </>
  );
};

export default ActionCreateTask;
