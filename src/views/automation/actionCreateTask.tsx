import React, { PropsWithChildren, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { repeatOptions } from "../../utils/globalConstants";
import ErrorText from "../../components/errorText";
import * as yup from "yup";
import update from "immutability-helper";

interface taskTypeI {
  type: string;
  repeat: string;
  assignedTo: string;
  notes: string;
}
interface Props {
  addUpdateModalValue: any;
  onSaveDrawerClose: (obj: any) => void;
}

const ActionCreateTask: React.FC<PropsWithChildren<Props>> = ({
  addUpdateModalValue,
  onSaveDrawerClose,
}) => {
  const StoreData = useSelector((state: any) => {
    return state?.rootReducers;
  });

  const [taskList, setTaskList] = useState<Array<any>>([]);
  const [taskAssignTo, setTaskAssignTo] = useState<Array<any>>([]);

  const [taskData, setTaskData] = useState<taskTypeI>({
    type: "",
    repeat: "",
    assignedTo: "",
    notes: "",
  });

  const [errors, setErrors] = useState({
    type: "",
    repeat: "",
    // assignedTo: "",
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
  }, []);

  useEffect(() => {
    if (Object.values(addUpdateModalValue).length > 0) {
      setTaskData({
        type: addUpdateModalValue.type,
        notes: addUpdateModalValue.notes,
        assignedTo: addUpdateModalValue?.assignedTo[0]?._id,
        repeat: addUpdateModalValue.repeat,
      });
    }
  }, [addUpdateModalValue]);

  let schema = yup.object().shape({
    type: yup.string().required("Task Type is required"),
    repeat: yup.string().required("Repeat is required"),
    // assignedTo: yup.string().required("Task Assigned is required"),
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
      let tempObj = {
        type: taskData.type,
        repeat: taskData.repeat,
        ...(taskData.assignedTo.length > 0 && {
          assignedTo: taskData.assignedTo,
        }),
        notes: taskData.notes,
      };
      onSaveDrawerClose(tempObj);
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
    });
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
            {/* {errors.assignedTo ? (
              <ErrorText message={errors?.assignedTo} />
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
              placeholder="Enter your note"
            ></textarea>
            {errors.notes ? <ErrorText message={errors?.notes} /> : ""}
          </div>
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
