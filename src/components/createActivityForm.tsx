import React, { PropsWithChildren, useState, useEffect } from "react";
import moment from "moment";
import ErrorText from "./errorText";
import * as yup from "yup";
import update from "immutability-helper";
import {
  createActivity,
  updateActivitybyId,
} from "../services/activityService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setActivityList } from "../actions/actions";
import Inputs from "./inputs";
import InputMaps from "./InputMaps";

interface Props {
  leadIds: Array<{ id: string }>;
  modalId: string;
  updateModalValue: any;
  action: string;
  formName: string;
}

const CreateActivityForm: React.FC<PropsWithChildren<Props>> = ({
  leadIds,
  modalId,
  updateModalValue,
  action,
  formName,
}) => {
  const [activity, setActivity] = useState<any>({
    type: "",
    performedAt: new Date(),
    createdTimestamp: 0,
    notes: "",
    leadIds: [leadIds[0]?.id],
  });
  const [errors, setErrors] = useState({
    type: "",
    performedAt: "",
    createdTimestamp: "",
    notes: "",
  });
  const [activityType, setActivityType] = useState<any>([]);
  const [showformData, setShowformData] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>([]);
  const [formTime, setFormTime] = useState<string>("");
  const [addressName, setAddressName] = useState({});
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });

  const dispatch = useDispatch();
  const StoreData = useSelector((state: any) => {
    return state?.rootReducers;
  });
  $(modalId).modal({
    backdrop: "static",
    keyboard: false,
  });
  useEffect(() => {
    if (action === "Add") {
      resetFormvalue();
    }
  }, [modalId]);
  useEffect(() => {
    let userPreferences = JSON.parse(
      localStorage.getItem("user_preferences") || ""
    );
    setActivityType(userPreferences?.activityType);
  }, []);

  useEffect(() => {
    if (formName === "Activity") {
      if (Object.values(updateModalValue).length > 0) {
        let someDate = new Date(updateModalValue.performedAt);
        let date = someDate.setDate(someDate.getDate());
        let defaultValue = new Date(date)?.toISOString()?.split("T")[0];
        setActivity({
          type: updateModalValue.type,
          performedAt: new Date(defaultValue),
          createdTimestamp: updateModalValue.performedAt,
          notes: updateModalValue.notes ? updateModalValue.notes : "",
          leadIds: [leadIds[0]?.id],
        });
        let filterData = activityType.filter(
          (x: any) => x.value === updateModalValue.type
        );
        if (filterData?.length > 0) {
          if (filterData[0]?.customFields) {
            let tempArrya = filterData[0]?.customFields;
            let updateData = updateModalValue.customFields;
            tempArrya = tempArrya.map((item: any) => {
              const item2 = updateData.find(
                (i2: any) => i2.label === item.name
              );
              return item2 ? { ...item, ...item2 } : item;
            });

            setFormData(tempArrya);
          } 
          // else {
          //   setFormData(filterData);
          // }
          setShowformData(true);
        } else {
          setFormData([]);
          setShowformData(false);
        }
      } else {
        resetFormvalue();
      }
    } 
  }, [updateModalValue]);

  let schema = yup.object().shape({
    type: yup.string().required("Activit Type is required"),
    performedAt: yup.date().required("Activity Date is required"),
    createdTimestamp: yup.string().required("Activity Time is required"),
    notes: yup.string().max(200, "Max 200 characters are allowed"),
  });
  const resetFormvalue = () => {
    setActivity({
      type: "",
      performedAt: new Date(),
      createdTimestamp: 0,
      notes: "",
      leadIds: [leadIds[0]?.id],
    });
    setFormTime("");
    setFormData([]);
    setShowformData(false);
  };
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
    let date_a = moment(`${value}`, "hh:mm").format("YYYY-MM-DD H:mm:ss");
    if (name === "createdTimestamp") {
      setActivity({
        ...activity,
        [name]: new Date(date_a).getTime(),
      });
      setFormTime(value);
    } else {
      setActivity({
        ...activity,
        [name]: value,
      });
    }
    setErrors({
      ...errors,
      [name]: null,
    });
  };
  const handleSelectOnchange = (e: any, check: string) => {
    const { name, value } = e.currentTarget;
    if (check === "type") {
      setActivity({
        ...activity,
        [name]: value,
      });
      let filterData = activityType.filter((x: any) => x.value === value);
      if (filterData?.length > 0) {
        setFormData([]);
        if (filterData[0]?.customFields) {
          let tempArrya = filterData[0]?.customFields;
          tempArrya.forEach((item: any) => {
            item.Values = "";
          });
          setFormData(tempArrya);
        } 
        // else {
        //   setFormData(filterData);
        // }
        setShowformData(true);
      } else {
        setFormData([]);
        setShowformData(false);
      }
    }

    setErrors({
      ...errors,
      [name]: null,
    });
  };
  console.log(activityType, "activityType");

  const handleCustomChange = (
    i: number,
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
    let tempArray = [...formData];

    let obj = tempArray[i];
    obj.Values = value;
    obj.value = value;
    tempArray[i] = obj;
    setFormData([...formData]);

    setActivity({
      ...activity,
      [name]: value,
    });
  };

  const handleMapChange = (i: number, value: string, coords: any) => {
    const user = {
      address: value,
      coords: {
        latitude: coords.lat,
        longitude: coords.lng,
      },
    };
    let tempArray = [...formData];

    let obj = tempArray[i];
    obj.Values = user;
    tempArray[i] = obj;
    setFormData([...formData]);

    setAddressName(user);
    setCoordinates(coords);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const isFormValid = await schema.isValid(activity, {
      abortEarly: false, // Prevent aborting validation after first error
    });
    if (isFormValid) {
      try {
        let Objdata: any = {};
        let time_stamp = 0;
        if (action === "Add") {
          time_stamp = activity.createdTimestamp;
        } else {
          if (new Date(activity.createdTimestamp).getDate()) {
            time_stamp = new Date(activity.createdTimestamp).getTime();
          } else {
            time_stamp = activity.createdTimestamp;
          }
        }
        let someDate = new Date(activity.performedAt);
        let date = someDate.setDate(someDate.getDate());
        let defaultValue = new Date(date)?.toISOString()?.split("T")[0];
        let Form_time: any = "";
        if (formTime) {
          Form_time = formTime;
        } else {
          Form_time = new Date();
        }
        let tempTime = moment(Form_time, "H:mm:ss").format("hh:mm:ss");
        let UtcDate = moment
          .parseZone(`${defaultValue}T${tempTime}`)
          .utc(true)
          .format();
        let editObjData: any = {
          type: activity.type,
          performedAt: UtcDate,
          createdTimestamp: time_stamp,
          ...(activity.notes?.length > 0 && {
            notes: activity.notes,
          }),
        };
        let activityObj: any = {
          leadIds: [leadIds[0]?.id],
          type: activity.type,
          performedAt: UtcDate,
          createdTimestamp: time_stamp,
          ...(activity.notes?.length > 0 && {
            notes: activity.notes,
          }),
        };
        let customFields: any = [];
        for (let i = 0; i < formData.length; i++) {
          let tempObj = {
            field: formData[i].value,
            label: formData[i].name,
            value: formData[i].Values,
          };

          customFields.push(tempObj);
        }

        if (showformData) {
          if (action === "Add") {
            Objdata = {
              ...activityObj,
              customFields,
            };
          } else {
            Objdata = {
              ...editObjData,
              customFields,
            };
          }
        } else {
          if (action === "Add") {
            Objdata = activityObj;
          } else {
            Objdata = editObjData;
          }
        }
        let response: any = "";
        if (action === "Add") {
          response = await createActivity(Objdata);
        } else {
          response = await updateActivitybyId(updateModalValue._id, Objdata);
        }
        if (response && response.status) {
          const responseData = response?.data;
          const tempArray = [...StoreData?.activity?.activities];
          if (action === "Add") {
            tempArray?.unshift(responseData?.data);
          } else {
            const tempData = tempArray.findIndex(
              (x) => x._id == responseData.data._id
            );
            tempArray.splice(tempData, 1, responseData.data);
          }
          dispatch(setActivityList(tempArray));
          toast.success(responseData?.message);
          resetFormvalue();
          $(modalId).modal("hide");
        }
      } catch (err) {
        console.log("error while creating activity!");
        // toast.error("error while creating activity!");
      }
    } else {
      schema.validate(activity, { abortEarly: false }).catch((err) => {
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

  const handleCloseActivityModal = () => {
    resetFormvalue();
    $(modalId).modal("hide");
  };

  console.log(formData, "FormData");

  return (
    <div
      className="modal fade popup-section-1 popup-section-2 popup-section-3"
      id="AddNewActivites"
      role="dialog"
      tabIndex={-1}
    >
      <div className="modal-dialog modal-md modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{action} Activites</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => handleCloseActivityModal()}
            ></button>
          </div>
          <form id="createActivityForm">
            <div className="modal-body">
              <div className="row">
                {action === "Add" && (
                  <div className="col-12">
                    <label className="form-label">Activity Type </label>
                    <select
                      value={activity?.type}
                      name="type"
                      className="form-select"
                      onChange={(e: any) => handleSelectOnchange(e, "type")}
                    >
                      <option value="">Select type</option>
                      {activityType.map((type: any) => (
                        <option value={type.value}>{type.name}</option>
                      ))}
                    </select>
                    {errors.type && (
                      <ErrorText message="Activity type required" />
                    )}
                  </div>
                )}
                <div className="col-12">
                  <label className="form-label">Activity Date</label>
                  <input
                    type="date"
                    name="performedAt"
                    className="form-control"
                    // defaultValue={moment().format(
                    //   "YYYY-MM-DD"
                    // )}
                    value={moment(activity.performedAt).format("YYYY-MM-DD")}
                    min={moment().format("YYYY-MM-DD")}
                    placeholder="Enter Date"
                    onChange={(e) => handleChange(e)}
                  />
                  {errors.performedAt && (
                    <ErrorText message="Activity date required" />
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label">Activity Time</label>
                  <input
                    type="time"
                    name="createdTimestamp"
                    value={moment(
                      new Date(activity.createdTimestamp),
                      "hh:mm"
                    ).format("HH:mm")}
                    // defaultValue={moment().format("HH:mm")}
                    className="form-control"
                    placeholder="Enter Time"
                    onChange={(e) => handleChange(e)}
                  />
                  {errors.createdTimestamp && (
                    <ErrorText message="Activity time required" />
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label">Note</label>
                  <textarea
                    onChange={(e) => handleChange(e)}
                    name="notes"
                    className="form-control note_area"
                    style={{ height: "120px" }}
                    placeholder="Enter Note"
                    value={activity.notes}
                  />
                  {errors.notes && (
                    <ErrorText message="Activity note required" />
                  )}
                </div>

                {formData?.map((item: any, i: number) => {
                  // let finalValue = isNaN(activity?.[item?.value])
                  //   ? activity?.[item?.value?.toLowerCase()]
                  //   : activity?.[item?.value];

                  return (
                    <div
                      className="form-group hide_dt select_icon activity_form"
                      key={i}
                    >
                      {item.type === "location" ? (
                        <InputMaps
                          type={item.type}
                          name={item?.value}
                          value={item?.value || ""}
                          onChange={(
                            name: string,
                            value: string,
                            coords: any
                          ) => handleMapChange(i, value, coords)}
                          className="form-control"
                          label={item.name}
                          isRequired={item.isRequired}
                        />
                      ) : (
                        <Inputs
                          name={item?.value}
                          type={
                            item.type === "phone" || item.type === "amount"
                              ? "number"
                              : item.type
                          }
                          autoComplete="off"
                          className={"form-control"}
                          placeholder={`Enter ${item?.name}`}
                          value={item?.value || ""}
                          onChange={(e: any) => handleCustomChange(i, e)}
                          label={item.name}
                          isRequired={item.isRequired}
                          options={item.type === "selection" && item.options}
                          id={
                            item.type === "time" || item.type === "date"
                              ? "lead_date_time"
                              : ""
                          }
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={(e) => handleSubmit(e)}
                className="btn LeadsFilterApply"
              >
                {action} Activity
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateActivityForm;
