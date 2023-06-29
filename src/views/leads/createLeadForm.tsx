import React, { PropsWithChildren, useEffect, useState } from "react";
import * as yup from "yup";
import update from "immutability-helper";
import ErrorText from "../../components/errorText";
import {
  createNewLead,
  getLeadDetail,
  updateLead,
  putUserPreferences,
} from "../../services/leadService";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Inputs from "../../components/inputs";
import { setCustomSource } from "../../actions/actions";
import InputMaps from "../../components/InputMaps";
export interface CreateLeadDataI {
  name: string;
  email: string;
  phone: string;
  notes: string;
  salesValue: number;
  integration?: string;
}

interface PropsT {
  showCreateNewLeadDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  getLeads: () => void;
  isEditMode: boolean;
  leadToBeUpdate: string;
  handleDrawerClick: () => void;
}

const CreateLeadForm: React.FC<PropsWithChildren<PropsT>> = ({
  showCreateNewLeadDrawer,
  getLeads,
  isEditMode,
  leadToBeUpdate,
  handleDrawerClick,
}) => {
  const StoreData = useSelector((state: any) => {
    return state?.rootReducers;
  });
  const dispatch = useDispatch();
  const [dynamicData, setDynamicData] = useState<any>([]);
  const [leadSourceData, setLeadSourceData] = useState([]);

  const [leadData, setLeadData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    salesValue: 0,
    notes: "",
    integration: "63026086526465189495d389",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    saleValue: "",
    notes: "",
  });
  const regExp = /\b\d{10}\b/;
  const [newSourceToggle, setNewSourceToggle] = useState(false);
  const [selectedSource, setSelectedSource] = useState("lead_form");
  const [sourceName, setSourceName] = useState("");
  const [addressName, setAddressName] = useState({});

  useEffect(() => {
    if (isEditMode) {
      fetchLeadDetails();
    }
    let form_Data = StoreData.user?.userPreferences?.customForm;
    let source_Data = StoreData.customSource?.sourceList;
    setDynamicData(form_Data);
    setLeadSourceData(source_Data);
  }, []);

  const fetchLeadDetails = async () => {
    const response = await getLeadDetail(leadToBeUpdate);
    if (response && response.status) {
      setLeadData({
        ...leadData,
        ...response?.data?.data.extraDetails,
        name: response?.data?.data?.name || "",
        email: response?.data?.data?.email || "",
        phone: Number(response?.data?.data?.phone) || "",
        saleValue: Number(response?.data?.data?.saleValue) || "",
        // notes: response?.data?.data?.note || "",
      });
      // setSelectedSource(response.data.data?.customSource);
    }
  };

  let schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    phone: yup.string().required("Phone Number is Required").matches(regExp, {
      message: "Phone Number is not valid",
      excludeEmptyString: true,
    }),
    // email: yup.string().email("Email is invalid").required("Email is required"),
    // saleValue: yup.string().required("Sale value is required"),
    // notes: yup.string().required("Note is required"),
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
    setLeadData({
      ...leadData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: null,
    });
  };
  const handleMapChange = (name: any, value: string, coords: any) => {
    const dynamic1 = name;
    const user = {
      [dynamic1]: {
        address: value,
        coords: {
          latitude: coords.lat,
          longitude: coords.lng,
        },
      },
    };

    setAddressName(user);
    setErrors({
      ...errors,
      [name]: null,
    });
  };
  const onSourceChange = (tab: string) => {
    setSelectedSource(tab);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(addressName)) {
      Object.assign(leadData, addressName);
    }
    const isFormValid = await schema.isValid(leadData, {
      abortEarly: false,
    });
    if (isFormValid) {
      let tempObjData: any = {
        name: leadData?.name,
        phone: leadData?.phone,
        email: leadData?.email,
        saleValue: Number(leadData.saleValue),
        customSource: selectedSource,
      };

      delete leadData["name"];
      delete leadData["phone"];
      delete leadData["email"];
      delete leadData["saleValue"];
      delete leadData["salesValue"];
      delete leadData["customSource"];

      if (leadData.notes === "") {
        delete leadData["notes"];
      }

      let tempLeadData = {
        name: tempObjData?.name,
        phone: tempObjData?.phone.toString(),
        ...(tempObjData?.email?.length > 0 && {
          email: tempObjData?.email,
        }),
        ...(tempObjData.saleValue > 0 && {
          saleValue: tempObjData.saleValue,
        }),
        customSource: tempObjData.selectedSource,
        extraDetails: leadData,
      };

      if (isEditMode) {
        try {
          let body: any = tempLeadData;
          delete leadData["integration"];

          const editResponse = await updateLead(leadToBeUpdate, body);
          if (editResponse && editResponse.status) {
            toast.success(editResponse?.data?.message);
            handleDrawerClick();
            clearAllLeadForm();
            getLeads();
          }
        } catch (err) {
          toast.error("error while updating the lead!");
        }
      } else {
        try {
          let body: any = tempLeadData;
          const response = await createNewLead(body);
          if (response && response.status) {
            toast.success(response?.data?.message);
            handleDrawerClick();
            clearAllLeadForm();
            getLeads();
          }
        } catch (err) {
          toast.error("error while creating new lead!");
        }
      }
    } else {
      schema.validate(leadData, { abortEarly: false }).catch((err) => {
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

  const clearAllLeadForm = () => {
    setLeadData({
      name: "",
      email: "",
      phone: "",
      salesValue: 0,
      notes: "",
    });
    setAddressName({});
    showCreateNewLeadDrawer(false);
  };

  const NewSourceToggle = () => {
    setNewSourceToggle(!newSourceToggle);
    setSourceName("");
  };

  const addNewSource = () => {
    if (sourceName) {
      let tempData: any = [...leadSourceData];
      let tempObj = {
        name: sourceName,
        value: sourceName?.split(" ")?.join("_"),
      };
      tempData.push(tempObj);
      handleAddLeadSource(tempData);
      dispatch(setCustomSource(tempData));
      setLeadSourceData(tempData);
      NewSourceToggle();
    }
  };
  const handleAddLeadSource = async (data: any) => {
    try {
      const response = await putUserPreferences({ customSource: data });
      if (response && response.status) {
        console.log(response.data.message);
      }
    } catch (err) {
      toast.error("Error while updating Source!");
    }
  };

  return (
    <form
      id="LeadsFilterForm"
      onSubmit={(e) => handleSubmit(e)}
      className="leadsform"
    >
      <div className="form-container">
        <div className="product_group lead_form">
          <h5>LeadSource</h5>

          <div className="lead_tab_scroll lead_form_tabs">
            {!newSourceToggle ? (
              <button
                className="new_lead_btn"
                type="button"
                onClick={() => NewSourceToggle()}
              >
                <i className="bi bi-plus"></i> New Source
              </button>
            ) : (
              <>
                <input
                  name="name"
                  type="text"
                  className="form-control btn-toggle-sourse"
                  autoComplete="off"
                  value={sourceName}
                  onChange={(e) => setSourceName(e?.target?.value)}
                />
                <div className="new_source_inp">
                  <img
                    src="assets/img/checked.png"
                    alt="img"
                    className="check_icn"
                    onClick={() => addNewSource()}
                  />
                  <div className="vl"></div>
                  <img
                    src="assets/img/cancel.png"
                    alt="img"
                    className="cancel_icn"
                    onClick={() => NewSourceToggle()}
                  />
                </div>
              </>
            )}

            <ul
              className="nav nav-lead lead_form_tabs justify-content-around d-flex flex_wrap"
              id="lead-tab"
              role="tablist"
            >
              {leadSourceData?.map((item: any, i: number) => {
                return (
                  <li
                    onClick={() => onSourceChange(item.value)}
                    className="nav-item"
                    role="presentation"
                    key={i}
                  >
                    <button
                      className={`nav-link ${
                        selectedSource === item.value && "active"
                      } lead_btn_tab`}
                      id="new-source-tab"
                      data-bs-toggle="pill"
                      data-bs-target={`#${item.value}`}
                      type="button"
                      role="tab"
                      aria-controls={`${item.value}`}
                      aria-selected="true"
                    >
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            {dynamicData?.map((item: any, i: number) => {
              let finalValue = isNaN(leadData?.[item?.value])
                ? leadData?.[item?.value?.toLowerCase()]
                : leadData?.[item?.value];
              return (
                <div className="form-group hide_dt select_icon" key={i}>
                  {item.type === "location" ? (
                    <InputMaps
                      type={item.type}
                      name={item?.value}
                      value={finalValue || ""}
                      onChange={(name: string, value: string, coords: any) =>
                        handleMapChange(name, value, coords)
                      }
                      className="form-control"
                      label={item.label}
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
                      className={
                        item.label === "Notes"
                          ? "form-control note_area"
                          : "form-control"
                      }
                      placeholder={`Enter ${item?.name}`}
                      value={finalValue || ""}
                      onChange={(e: any) => handleChange(e)}
                      label={item.label}
                      isRequired={item.isRequired}
                      options={item.type === "selection" && item.options}
                      id={
                        item.type === "time" || item.type === "date"
                          ? "lead_date_time"
                          : ""
                      }
                    />
                  )}
                  {errors?.name && item?.name === "Name" && item.isRequired ? (
                    <ErrorText message={errors?.name} />
                  ) : errors?.phone &&
                    item?.name === "Phone" &&
                    item.isRequired ? (
                    <ErrorText message={errors?.phone} />
                  ) : (
                    ""
                  )}
                  {/* {errors?.name && item?.name === "Name" && item.isRequired ? (
                    <ErrorText message={errors?.name} />
                  ) : errors?.phone &&
                    item?.name === "Phone" &&
                    item.isRequired ? (
                    <ErrorText message={errors?.phone} />
                  ) : errors?.email &&
                    item?.name === "Email" &&
                    item.isRequired ? (
                    <ErrorText message={errors?.email} />
                  ) : errors?.saleValue &&
                    item?.name === "saleValue" &&
                    item.isRequired ? (
                    <ErrorText message={errors?.saleValue} />
                  ) : errors?.notes &&
                    item?.name === "notes" &&
                    item.isRequired ? (
                    <ErrorText message={errors?.notes} />
                  ) :(
                    ""
                  )} */}
                </div>
              );
            })}
          </div>
        </div>
        <div className="d-flex justify-content-center Leadscreate ">
          {/* <button type="reset" className="btn LeadsFilterReset">
            Reset
          </button> */}
          <button type="submit" className="btn btn-dark w-100">
            {!isEditMode ? "Add Lead" : "UPDATE LEAD"}
          </button>
        </div>
      </div>
      <Toaster />
    </form>
  );
};

export default CreateLeadForm;
