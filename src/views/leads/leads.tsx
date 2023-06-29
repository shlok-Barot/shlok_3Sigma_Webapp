import React, { useCallback, useEffect, useState } from "react";
import Header from "../../components/header";
import LeadsList from "./leadsList";
import NoContentDiv from "../../components/noContentDiv";
import LeadFilter from "./leadFilter";
import CreateLeadForm from "./createLeadForm";
import {
  addCSV,
  copyLeadToLeadList,
  createNewLeadByCsv,
  deleteLead,
  downloadCsvFile,
  getAllLeads,
  moveLeadToLeadList,
} from "../../services/leadService";
import { useDispatch, useSelector } from "react-redux";
import {
  setLeadList,
  setLeads,
  setLeadTaskList,
  leadFileList,
  setLeadName,
} from "../../actions/actions";
import LeadItem from "./leadItem";
import Loader from "../../components/loader";
import { getAllLeadList, deleteLeadList } from "../../services/leadListService";
import CreateNoteForm from "../../components/createNoteForm";
import CreateActivityForm from "../../components/createActivityForm";
// import _ from "lodash";
import CopyLeadToList from "../../components/copyLeadToList";
import MoveLeadToList from "../../components/moveLeadToList";
import toast, { Toaster } from "react-hot-toast";
import DrawerComponent from "../../components/drawer";
import LeadDrawerComponent from "../../components/leadDrawer";
import LeadDetails from "./leadDetails";
import CustomLeadForm from "./customLeadForm";
import AddEditList from "./addEditList";
import ConfirmationModal from "../../components/confirmationModal";
import { activityById } from "../../services/activityService";
import { taskById, deleteTask } from "../../services/taskService";
import SelectLeadLabel from "../../components/label";
import SelectLeadStatus from "../../components/status";
import CreateLeadDetailsTaskForm from "../../components/createLeadTaskForm";
import { uploadFiles } from "../../services/utilityService";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { API_URL } from "../../config/config";
import { getHeaderOptions } from "../../services/getHeaderOptions";
// @ts-ignore
import Papa from "papaparse";
import DrawerExistModal from "../../components/drawerExistModal";

const API_ENDPOINT = API_URL + "api/v1";
export interface LeadDataI {
  _id: string;
  name: string;
  integration: string;
  customSource: string;
  createdAt: Date;
  status: Array<string>;
  saleValue: string;
  website: string;
  phone: string;
  email: string;
  label: Array<any>;
}

const Leads: React.FC = () => {
  const StoreData = useSelector((state: any) => {
    return state?.rootReducers;
  });
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [createNewLeadDrawer, showCreateNewLeadDrawer] =
    useState<boolean>(false);
  const [copyLeadToListModal, setShowCopyLeadToList] = useState<boolean>(false);
  const [moveLeadToListModal, setShowMoveLeadToList] = useState<boolean>(false);
  const [showAddListDrawer, setShowAddListDrawer] = useState<boolean>(false);
  const [openWithHeader, setOpenWithHeader] = React.useState<boolean>(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);
  const [csvImportDrawer, setShowImportDrawer] = useState<boolean>(false);
  const [secondDrawer, setSecondDrawer] = useState<boolean>(false);
  const [thirdDrawer, setThirdDrawer] = useState<boolean>(false);
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);
  const [showLabelPopup, setShowLabelPopup] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [leadToBeUpdate, setLeadToBeUpdate] = useState<string>("");
  const [selectedLabel, setSelectedLabel] = useState<Array<string>>([]);
  const [selectedLead, setSelectedLead] = useState<LeadDataI>();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [leadListId, setLeadListId] = useState<string>("");
  const [csvFile, setCsvFile] = useState<any>(null);
  const [from, setFrom] = useState<string>("");
  const [mode, setMode] = useState<string>("");
  const [csvHeader, setCsvHeader] = useState<any>([]);
  const [toBeRemoved, setToBeRemoved] = useState<string>("");
  const [dynamicData, setDynamicData] = useState<any>(null);
  const [selectingValue, setSelectingValue] = useState<any>({});
  const [selectedField, setSelectField] = useState<any>([]);
  const [updateModalValue, setUpdateModalValue] = useState<any>({});
  const [activityformTitle, setActivityFormTitle] = useState<string>("Add");
  const [activityformName, setActivityFormName] = useState<string>("");
  const [leadLabelData, setLeadLabelData] = useState<Array<string>>([]);
  const [leadListData, setLeadListData] = useState<Array<string>>([]);
  const [taskShowConfirmationModal, setTaskShowConfirmationModal] =
    useState<boolean>(false);
  const [taskDeteleId, setTaskDeleteId] = useState<string>("");
  const [leadCounts, setLeadCounts] = useState<number>(0);
  const [leadId, setLeadId] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLead, setTotalLead] = useState<number>(0);
  const [progressValue, setProgressValue] = useState<number>(0);
  const [isFilterData, setIsFilterData] = useState<boolean>(false);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [selectedLeadList, setSelectedLeadList] = useState<any>({});

  const fileReader = new FileReader();
  const dispatch = useDispatch();

  let userPreferences = JSON.parse(
    localStorage.getItem("user_preferences") || ""
  );
  const hasKey = userPreferences.hasOwnProperty("custom_form");

  useEffect(() => {
    let form_Data = StoreData.user?.userPreferences?.customForm;
    setDynamicData(form_Data);

    let updatedArray: any = {};
    form_Data.forEach((item: any) => {
      updatedArray[item.name] = "";
    });
    setSelectingValue({ ...updatedArray });
    let lead_name = StoreData.leadName.leadName;
    if (!("id" in lead_name)) {
      dispatch(setLeadName({ id: "0", name: "Lead list" }));
    }
    lead_name = StoreData.leadName.leadName;

    setSelectedLeadList(
      Object.keys(lead_name).length > 0
        ? lead_name
        : { id: "0", name: "Lead list" }
    );
  }, []);

  useEffect(() => {
    // update the fieldvalue object with similar names from csv header file
    const values = Object.keys(selectingValue);
    values.forEach((item) => {
      let data = dynamicData.find((el: any) => {
        return el.name === item;
      });
      let returnMatch = findMatch(data);
      if (returnMatch) {
        setSelectingValue((prevState: any) => ({
          ...prevState,
          [item]: returnMatch,
        }));
        let tempArr = selectedField;
        tempArr.push(returnMatch);
        setSelectField([...tempArr]);
      }
    });
  }, [csvHeader]);

  const onAddList = (mode: React.SetStateAction<string>) => {
    setShowAddListDrawer(true);
    setMode(mode);
  };

  const onEditList = (mode: React.SetStateAction<string>, id: any) => {
    setShowAddListDrawer(true);
    setMode(mode);
    setLeadListId(id);
  };

  const handleLeadNameChange = (id: any, name: string) => {
    let tempObj = {
      id: id,
      name: name,
    };
    dispatch(setLeadName(tempObj));
    setSelectedLeadList(tempObj);
    getLeadbyId(tempObj);
  };

  const getLeadbyId = async (tempObj: any) => {
    try {
      let lead_name = tempObj;
      if (Object.values(lead_name)) {
        setIsLoading(true);
        let params = {};

        if (lead_name.id !== "0") {
          params = {
            isAscending: false,
            page: 1,
            perPage: 10,
            list: lead_name.id,
          };
        } else {
          params = {
            isAscending: false,
            page: 1,
            perPage: 10,
          };
        }
        const response = await getAllLeads(params);
        if (response && response.status) {
          let responseData = response?.data;
          setLeadCounts(responseData.total);
          setTotalLead(responseData.data?.length);
          setCurrentPage(1);
          setLeadListData(responseData?.data);
          dispatch(setLeads(responseData?.data));
          setIsLoading(false);
          setIsFilterData(false);
        }
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  const getLeads = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllLeads({
        isAscending: false,
        page: 1,
        perPage: 10,
      });
      if (response && response.status) {
        let responseData = response?.data;
        setLeadCounts(responseData.total);
        setTotalLead(responseData.data?.length);
        setCurrentPage(1);
        setLeadListData(responseData?.data);
        dispatch(setLeads(responseData?.data));
        setIsLoading(false);
        setIsFilterData(false);
      }
    } catch (err) {
      setIsLoading(false);
    }
  }, [dispatch]);

  const fetchLeadListOnScroll = async () => {
    try {
      let increasePage = currentPage;
      if (increasePage === currentPage) {
        increasePage = increasePage + 1;
      }
      let params = {};
      let lead_name = StoreData.leadName.leadName;
      if (Object.keys(lead_name).length > 0) {
        if (lead_name.id !== "0") {
          params = {
            isAscending: false,
            page: increasePage,
            perPage: 10,
            list: lead_name.id,
          };
        } else {
          params = {
            isAscending: false,
            page: increasePage,
            perPage: 10,
          };
        }
      }

      const response = await getAllLeads(params);
      if (response && response.status) {
        let responseData = response?.data;
        let tempArray: any = [...leadListData];
        tempArray.push.apply(tempArray, responseData.data);
        setLeadCounts(responseData.total);
        setLeadListData(tempArray);
        setTotalLead(tempArray?.length);
        setCurrentPage(increasePage);
        dispatch(setLeads(tempArray));
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  const getLeadList = useCallback(async () => {
    try {
      const resp = await getAllLeadList({
        isAscending: false,
        page: 1,
        perPage: 10,
      });
      if (resp && resp.status) {
        dispatch(setLeadList(resp?.data?.data));
      }
    } catch (err) {}
  }, [dispatch]);

  useEffect(() => {
    let lead_name = StoreData.leadName.leadName;
    if (lead_name.id === "0") {
      getLeads();
    } else {
      getLeadbyId(lead_name);
    }
  }, [getLeads || selectedLeadList]);

  const FetchLeadListData = () => {
    let lead_name = StoreData.leadName.leadName;
    if (lead_name.id === "0") {
      getLeads();
    } else {
      getLeadbyId(lead_name);
    }
  };
  const handleLeadClick = (leadId: string) => {
    let selected = StoreData?.leads?.leads?.find(
      (lead: any) => lead._id === leadId
    );
    let tempArray = [];
    tempArray = StoreData?.user?.userPreferences?.labels
      ? StoreData?.user?.userPreferences?.labels
      : userPreferences?.labels;

    const mergedArray = tempArray.map((obj1: any) => {
      const matchingObjTeam = selected?.label.find(
        (obj2: any) => obj2 === obj1.value
      );
      let temp_obj = {};
      if (selected?.label.includes(obj1.value)) {
        temp_obj = {
          ...obj1,
          isLabelChecked: true,
        };
      } else {
        temp_obj = {
          ...obj1,
          isLabelChecked: false,
        };
      }

      if (matchingObjTeam) {
        return { ...temp_obj };
      }
      return obj1;
    });
    setSelectedLead(selected);
    setLeadId(selected?._id);
    setLeadLabelData(mergedArray);
    setOpenWithHeader(true);
  };

  let formData = new FormData();

  const onCsvFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      Papa.parse(e.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: function (results: any) {
          const rowsArray: any = [];
          results.data.map((d: any) => {
            rowsArray.push(Object.keys(d));
          });

          rowsArray[0].push("Don’t import");
          setCsvHeader(rowsArray[0]);
        },
      });

      fileReader.readAsText(e.target.files?.[0]);
      setCsvFile(e.target.files[0]);
      setSecondDrawer(true);
      setShowImportDrawer(false);
    }
  };
  const findMatch = (data: any) => {
    if (data.similarNames) {
      let tempData = data.similarNames;
      for (let i = 0; i < tempData.length; i++) {
        let tempObj = csvHeader?.find(
          (header: any) =>
            tempData[i].toLowerCase().trim() === header.toLowerCase().trim()
        );
        if (tempObj) {
          return tempObj;
        }
      }
      // if no similar names are found return empty string.
      return "";
    }
  };

  const handleChange = (e: any) => {
    let currValue = selectingValue[e.target.name];
    let tempArr = selectedField;
    const index = tempArr.indexOf(currValue);
    if (index > -1) {
      // only splice array when item is found
      tempArr.splice(index, 1);
      // 2nd parameter means remove one item only
    }
    tempArr.push(e.target.value);
    setSelectField(tempArr);
    setSelectingValue((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onDownloadCsv = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const response = await downloadCsvFile("62c048cfb4f7fe9f267107bb");
      if (response && response.status) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "template.csv");
        document.body.appendChild(link);
        link.click();
        toast.success("file downloaded successfully");
        $("#ImportleadsPopup").modal("hide");
      }
    } catch (err) {
      toast.error("error while download csv file!");
    }
  };

  const toggleLeadFilterDrawer = () => {
    setShowFilterDrawer(true);
  };

  const handleDrawerClick = () => {
    setShowExitModal(!showExitModal);
    showCreateNewLeadDrawer(false);
  };
  const handleDrawerModalClose = () => {
    setShowExitModal(false);
    showCreateNewLeadDrawer(false);
  };
  const toggleEditModal = () => {
    setShowExitModal(!showExitModal);
  };
  const openCreateLeadDrawer = () => {
    showCreateNewLeadDrawer(true);
    setIsEditMode(false);
  };

  const importCSVDrawer = () => {
    setShowImportDrawer(true);
  };

  const editLead = (e: { stopPropagation: () => void }, id: any) => {
    e.stopPropagation();
    showCreateNewLeadDrawer(true);
    setOpenWithHeader(false);
    setIsEditMode(true);
    setLeadToBeUpdate(id);
  };

  const removeLead = (e: { stopPropagation: () => void }, id: any) => {
    e.stopPropagation();
    setLeadToBeUpdate(id);
    setShowConfirmationModal(true);
    setToBeRemoved("lead");
  };

  const deleteLeadFromDrawer = (id: string) => {
    setLeadToBeUpdate(id);
    setShowConfirmationModal(true);
    setToBeRemoved("lead");
    setOpenWithHeader(false);
  };

  const toggleModal = () => {
    setShowConfirmationModal(!showConfirmationModal);
  };

  const onConfirmation = async () => {
    if (toBeRemoved === "lead") {
      try {
        const deleteResponse = await deleteLead(leadToBeUpdate);
        if (deleteResponse && deleteResponse.status) {
          toast.success(deleteResponse?.data?.message);
          getLeads();
        }
      } catch (err) {
        toast.error("Error while deleting the lead");
      }
    } else {
      try {
        const response = await deleteLeadList(leadListId);
        if (response && response.status) {
          toast.success(response?.data?.message);
          getLeadList();
        }
      } catch (err) {
        toast.error("error while deleting lead-list");
      }
    }
    setShowConfirmationModal(false);
  };

  const onDeleteClick = (id: string) => {
    setShowConfirmationModal(true);
    setToBeRemoved("leadlist");
    setLeadListId(id);
  };

  const copyLeadToList = () => {
    // setShowCopyLeadToList(!copyLeadToListModal);
  };

  const onCopy = async (id: string) => {
    let leadIds = [];
    leadIds.push(selectedLead?._id);
    try {
      const response = await copyLeadToLeadList({
        leadIDs: leadIds,
        listID: id,
      });
      if (response && response.status) {
        toast.success(response?.data?.message);
        copyLeadToList();
      }
    } catch (err) {
      toast.error("Error while copying lead to list");
      copyLeadToList();
    }
  };

  const moveLeadToList = () => {
    setShowMoveLeadToList(!moveLeadToListModal);
  };

  const onMove = async (id: string) => {
    let leads = [];
    leads.push(selectedLead?._id);
    try {
      const response = await moveLeadToLeadList({
        leadIDs: leads,
        toListID: id,
      });
      if (response && response.status) {
        toast.success(response?.data?.message);
        moveLeadToList();
      }
    } catch (err) {
      toast.error("Error while copying lead to list");
      moveLeadToList();
    }
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e?.currentTarget?.value);
    if (e.currentTarget.value.length > 1) {
      const updatedList = StoreData?.leads?.leads?.filter((lead: any) => {
        return (
          lead?.name
            ?.toLowerCase()
            .search(e?.currentTarget?.value?.toLowerCase()) !== -1
        );
      });
      dispatch(setLeads(updatedList));
    } else {
      getLeads();
    }
  };

  const onLabelClick = () => {
    setShowLabelPopup(true);
  };

  const toggleLeadLabel = () => {
    setShowLabelPopup(!showLabelPopup);
  };

  const onStatusClick = () => {
    setShowStatusPopup(true);
  };

  const toggleLeadStatus = () => {
    setShowStatusPopup(!showStatusPopup);
    setSelectedStatus("");
  };

  const onLabelChange = async (e: any) => {
    let Value = e.target.value;
    let newArray: any = [...selectedLabel];
    let labelArray: any = [...leadLabelData];
    let tempObj: any = {};
    tempObj = labelArray.find((x: any) => x.value === Value);
    if (tempObj?.isLabelChecked) {
      tempObj.isLabelChecked = false;
    } else {
      tempObj.isLabelChecked = true;
    }
    if (selectedLabel.includes(Value)) {
      let index = newArray.findIndex((d: string) => d === Value);
      newArray.splice(index, 1);
    } else {
      newArray = newArray.filter((d: string) => d !== Value);
      newArray.push(Value);
    }
    setLeadLabelData(await labelArray);
    setSelectedLabel(newArray);
  };

  const onStatusChange = (e: any) => {
    setSelectedStatus(e.target.value);
  };

  const uploadLeads = async () => {
    try {
      formData.append("csv", csvFile);

      let body = dynamicData?.map((v: any) => {
        if (
          v?.similarNames?.map((g: any) =>
            csvHeader?.find(
              (h: any) => g.toLowerCase()?.trim() == h.toLowerCase()?.trim()
            )
          )?.[0]
        ) {
          formData.append(
            v?.name,
            v?.similarNames?.map((g: any) =>
              csvHeader?.find(
                (h: any) => g.toLowerCase()?.trim() == h.toLowerCase()?.trim()
              )
            )
          );
        }
      });
      const keys = Object.keys(selectingValue);
      keys.forEach((key, index) => {
        formData.append(key, selectingValue[key]);
      });
      let obj_header = {
        ...getHeaderOptions,
        Authorization: localStorage.getItem("auth_token") || "",
      };
      axios({
        method: "post",
        url: `${API_ENDPOINT}/lead/csv`,
        headers: obj_header,
        data: formData,
        onUploadProgress: (ev = ProgressEvent) => {
          const progress = (ev.loaded / ev.total) * 100;
          updateUploadProgress(Math.round(progress));
        },
      })
        .then(function (response) {
          if (response && response?.status) {
            getLeads();
            toast.success(response?.data?.message);
            setThirdDrawer(true);
            setSecondDrawer(false);
            //   moveLeadToList();
          }
        })
        .catch((data) => {
          console.log("Error", data);
        });
    } catch (err) {
      toast.error("Error while uploading csv");
      // moveLeadToList();
    }
    // setThirdDrawer(true);
    // setSecondDrawer(false);
  };
  const updateUploadProgress = (value: number) => {
    setProgressValue(value);
  };
  const handleEditActivityModal = async (
    name: string,
    _id: any,
    action: string
  ) => {
    if (name === "activity") {
      try {
        const response = await activityById(_id);
        if (response && response.status) {
          let modalId = "#AddNewActivites";
          handleActivityModal(action, "Activity");
          setUpdateModalValue(response.data.data);
          $(modalId).modal("show");
        }
      } catch (err) {
        toast.error("error while fetching activity data.");
      }
    }
    if (name === "task") {
      try {
        const response = await taskById(_id);
        if (response && response.status) {
          let modalId = "#AddNewTask";
          handleActivityModal(action, "Task");
          setUpdateModalValue(response.data.data);
          $(modalId).modal("show");
        }
      } catch (err) {
        toast.error("error while fetching activity data.");
      }
    }
  };

  const handleActivityModal = (title: string, name: string) => {
    let modalId = "";
    if (name === "Activity") {
      modalId = "#AddNewActivites";
      setActivityFormTitle(title);
    } else {
      modalId = "#AddNewTask";
      setActivityFormTitle(title);
    }
    $(modalId).modal("show");
    setActivityFormName(name);
  };
  const taskToggleModal = () => {
    let modalId = "#AddNewTask";
    setActivityFormTitle("Edit");
    $(modalId).modal("show");
    setTaskShowConfirmationModal(!taskShowConfirmationModal);
  };

  const onTaskDelete = (id: string) => {
    let modalId = "#AddNewTask";
    setActivityFormTitle("Add");
    $(modalId).modal("hide");
    setTaskDeleteId(id);
    setTaskShowConfirmationModal(true);
  };
  const leadTaskDelete = async () => {
    try {
      const response = await deleteTask(taskDeteleId);
      if (response && response.status) {
        const tempArray = [...StoreData?.leadTask?.leadTask];
        const tempData = tempArray.findIndex((x) => x._id == taskDeteleId);
        tempArray.splice(tempData, 1);
        dispatch(setLeadTaskList(tempArray));
        toast.success(response?.data?.message);
      }
    } catch (err) {
      toast.error("Error while deleting task!");
    }
    setTaskShowConfirmationModal(false);
  };
  const onLeadFileUpload = async (e: any) => {
    let formData = new FormData();
    formData.append("files", e.target.files[0]);
    formData.append("type", "lead");
    formData.append("lead", leadId);
    try {
      const response = await uploadFiles(formData);
      if (response && response.status) {
        const tempArray = [...StoreData?.leadFile?.leadFile];
        tempArray?.unshift(response?.data?.data[0]);
        dispatch(leadFileList(tempArray));
        toast.success(response?.data?.message);
      }
    } catch (err) {
      toast.error("Error while uploading file!");
    }
  };
  const LeadDataList = (data: any) => {
    setLeadListData(data);
    setLeadCounts(data?.length);
    setIsFilterData(true);
  };
  return (
    <div id="main" className="main">
      <Header onSearch={(e: any) => onSearch(e)} />
      {/* <input
        type="text"
        placeholder="Search Lead..."
        className="form-control mb-4"
        onChange={(e) => onSearch(e)}
      /> */}
      <section className="leads-section-1 ">
        <div className="d-flex justify-content-between leads-section-1-1">
          <div className="align-items-center leads-section-1-sub-1">
            <div
              style={{ backgroundColor: "#EBF0F4", borderRadius: "5px" }}
              className="p-2"
            >
              <img
                alt=""
                onClick={toggleLeadFilterDrawer}
                src="assets/img/filter.png"
                title="filter"
                id="filter-img"
                className="cursor-pointer "
              />
            </div>
            <LeadsList
              onDeleteClick={onDeleteClick}
              leadLists={StoreData.leadList.leadList}
              getLeadList={getLeadList}
              onEditList={onEditList}
              onAddList={onAddList}
              leadData={leadCounts}
              LeadNameChange={handleLeadNameChange}
              selectedLeadList={selectedLeadList}
            />
          </div>

          <div className="dropdown d-flex align-items-center">
            <div
              style={{ backgroundColor: "#EBF0F4", borderRadius: "5px" }}
              className="p-2"
            >
              <span
                onClick={() => FetchLeadListData()}
                className="text-black fw-bold cursor-pointer bi bi-arrow-clockwise"
                style={{ height: "37px" }}
              ></span>
            </div>
            <div
              className="dropdown ms-3"
              style={{ backgroundColor: "#EBF0F4", borderRadius: "5px" }}
            >
              <button
                className="btn dropdown-toggle text-black fw-bold lead_icon"
                type="button"
                id="dropdownMenuButton2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Create new lead
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-play-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                </svg>
              </button>
              <ul
                className="leads_dropdown dropdown-menu pt-0 pb-0"
                aria-labelledby="dropdownMenuButton2"
                id="lists-dropdown"
              >
                <li className="dropdown-item" onClick={openCreateLeadDrawer}>
                  Enter Details
                </li>
                <li className="dropdown-item" onClick={importCSVDrawer}>
                  Upload CSV File
                </li>
              </ul>
            </div>
            {/* <div
              style={{
                backgroundColor: "#EBF0F4",
                borderRadius: "5px",
                height: "37px",
              }}
              className="dropdown ms-3"
            >
              <button
                className="btn dropdown-toggle px-1 px-md-2 fw-bold lead_icon"
                type="button"
                id="dropdownMenuButton2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Create new lead
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-play-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                </svg>
              </button>
            </div>
            <ul
              className="leads_dropdown dropdown-menu pt-0 pb-0"
              aria-labelledby="dropdownMenuButton2"
              id="lists-dropdown"
            >
              <li className="dropdown-item" 
              onClick={openCreateLeadDrawer}>
                Enter Details
              </li>
              <li className="dropdown-item"
               onClick={importCSVDrawer}>
                Import leads
              </li>
            </ul> */}
          </div>
        </div>
      </section>
      <section className="leads-section-2">
        <div className="row leads-section-2-1 p-3">
          <div className="col-md-3 col-3 text-start text-black d-flex align-items-center">
            {/* <div className="leads-section-2-sub-1"> */}
            <h5>Lead Name </h5>
            {/* </div> */}
          </div>
          <div className="col-md-3 col-3 text-start text-black d-flex align-items-center p-l-40">
            {/* <div className="leads-section-2-sub-1"> */}
            <h5>Contact</h5>
            {/* </div> */}
          </div>
          <div className="col-md-3 col-3 text-start text-black d-flex align-items-center">
            {/* <div className="leads-section-2-sub-1"> */}
            <h5>Status </h5>
            {/* </div> */}
          </div>
          <div className="col-md-3 col-3 text-start text-black d-flex align-items-center">
            {/* <div className="leads-section-2-sub-1"> */}
            <h5>Labels</h5>
            {/* </div> */}
          </div>
          {/* <div className="col-md-2 col-3">
            <div className="leads-section-2-sub-1">
              <h2>Actions</h2>
            </div>
          </div> */}
        </div>
      </section>

      {!isFilterData ? (
        <>
          {/* @ts-ignore */}
          <InfiniteScroll
            dataLength={totalLead}
            next={fetchLeadListOnScroll}
            hasMore={true}
            loader={isLoading ? <h4>Loading...</h4> : null}
          >
            <section className="leads-section-3-main">
              {isLoading ? (
                <Loader height={50} width={50} />
              ) : leadListData.length ? (
                leadListData.map((lead: any) => {
                  let component = [];
                  component.push(
                    <LeadItem
                      id={lead?._id}
                      name={lead?.name || ""}
                      integration_name={lead?.integration || ""}
                      created_at={lead?.createdAt}
                      handleLeadClick={handleLeadClick}
                      phone={
                        lead?.phone?.length >= 10
                          ? "+91" + lead?.phone
                          : lead?.phone
                      }
                      email={lead?.email}
                      status={lead?.status}
                      labels={lead?.label}
                      editLead={editLead}
                      removeLead={removeLead}
                    />
                  );
                  return component;
                })
              ) : (
                <NoContentDiv message={""} />
              )}
            </section>
          </InfiniteScroll>
        </>
      ) : (
        <section className="leads-section-3-main">
          {isLoading ? (
            <Loader height={50} width={50} />
          ) : leadListData.length ? (
            leadListData.map((lead: any) => {
              let component = [];
              component.push(
                <LeadItem
                  id={lead?._id}
                  name={lead?.name || ""}
                  integration_name={lead?.integration || ""}
                  created_at={lead?.createdAt}
                  handleLeadClick={handleLeadClick}
                  phone={
                    lead?.phone?.length >= 10
                      ? "+91" + lead?.phone
                      : lead?.phone
                  }
                  email={lead?.email}
                  status={lead?.status}
                  labels={lead?.label}
                  editLead={editLead}
                  removeLead={removeLead}
                />
              );
              return component;
            })
          ) : (
            <NoContentDiv message={""} />
          )}
        </section>
      )}

      <DrawerComponent
        openWithHeader={showFilterDrawer}
        setOpenWithHeader={setShowFilterDrawer}
        drawerTitle="Leads Filter"
        size="xs"
      >
        <LeadFilter
          onLabelClick={onLabelClick}
          onStatusClick={onStatusClick}
          selectedStatus={selectedStatus}
          selectedLabel={selectedLabel}
          setShowFilterDrawer={setShowFilterDrawer}
          LeadDataList={LeadDataList}
        />
      </DrawerComponent>

      <DrawerComponent
        openWithHeader={showAddListDrawer}
        setOpenWithHeader={setShowAddListDrawer}
        drawerTitle={mode === "add" ? "Add List" : "Edit List"}
        size="xs"
      >
        <AddEditList
          mode={mode}
          getLeadList={getLeadList}
          setShowAddListDrawer={setShowAddListDrawer}
        />
      </DrawerComponent>
      <LeadDrawerComponent
        openWithHeader={createNewLeadDrawer}
        setOpenWithHeader={toggleEditModal}
        drawerTitle={!isEditMode ? "Add New lead" : "Update lead"}
        size="xs"
      >
        {hasKey ? (
          <CustomLeadForm isEditMode={isEditMode} />
        ) : (
          <CreateLeadForm
            isEditMode={isEditMode}
            showCreateNewLeadDrawer={showCreateNewLeadDrawer}
            getLeads={getLeads}
            leadToBeUpdate={leadToBeUpdate}
            handleDrawerClick={handleDrawerModalClose}
          />
        )}
      </LeadDrawerComponent>

      <DrawerComponent
        openWithHeader={csvImportDrawer}
        setOpenWithHeader={setShowImportDrawer}
        drawerTitle="CSV Import"
        size="xs"
      >
        <form id="LeadsFilterForm" className="addleadsform lead_pop">
          <div className="form-container">
            <div className="product_group">
              <div className="form-group">
                <h5
                  className="text-center text-black mb-3"
                  style={{ fontSize: "20px" }}
                >
                  Bulk import leads
                </h5>
                <p>
                  You can bulk import leads by uploading data in CSV/Excel file.
                  You will be able to map CRM fields with file columns on next
                  screen.
                </p>
              </div>

              <div className="form-group2">
                {/* <div className='d-flex w-100 pb-3'>
                      <div className="popup-section-download w-100">
                          <button onClick={(e) => onDownloadCsv(e)} className="btn w-100"><i className="bi bi-download"></i> Download File Template</button>
                      </div>
                   </div> */}
                <div
                  className="d-flex w-100 d-flex justify-content-center btn_bottom"
                  style={{ marginLeft: "-2rem" }}
                >
                  <div className="popup-section-file btn border-5">
                    <span>Upload file</span>
                    <input
                      type="file"
                      name="file"
                      accept=".csv"
                      // accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={(e) => onCsvFileUpload(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </DrawerComponent>
      <DrawerComponent
        openWithHeader={secondDrawer}
        setOpenWithHeader={setSecondDrawer}
        drawerTitle=""
        size="xs"
      >
        <form
          id="LeadsFilterForm"
          className="addleadsform lead_pop"
          style={{ margin: "0 -15px" }}
        >
          <div className="form-container">
            <div className="product_group">
              <div className="form-group">
                <h5
                  className="text-center text-black mb-3"
                  style={{ fontSize: "20px" }}
                >
                  Bulk import leads
                </h5>
                <p style={{ fontSize: "16px" }}>
                  Please map CSV field with CRM lead Form fields
                </p>
              </div>
              <div>
                <div className="d-flex justify-content-around align-items-center w-100 font-bold">
                  <p style={{ marginLeft: "-20px" }}>CRM fields</p>
                  <p>File fields </p>
                </div>
                {dynamicData?.map((v: any, i: any) => {
                  let field = v.name;
                  return (
                    <div
                      className="d-flex justify-content-around align-items-center w-100"
                      style={{ marginBottom: "10px" }}
                      key={i}
                    >
                      <div
                        className="d-flex align-center bg-white p-2 mt-2"
                        style={{
                          borderRadius: "10px",
                          width: "130px",
                          height: "41px",
                        }}
                      >
                        <p
                          className="my-auto ms-2"
                          title={v?.name}
                          style={{ display: "contents" }}
                        >
                          {v?.name.length > 15
                            ? v?.name.substr(0, 15).concat("...")
                            : v?.name}
                        </p>
                      </div>
                      <div>
                        <img
                          alt="right"
                          src="assets/img/right.png"
                          height={19}
                          width={17}
                          style={{ marginTop: "6px" }}
                        />
                      </div>
                      <div
                        className="d-flex align-center bg-white p-2 mt-2"
                        style={{
                          borderRadius: "10px",
                          width: "130px",
                          height: "41px",
                        }}
                      >
                        <p className="my-auto ms-2 w-100">
                          <select
                            name={v?.name}
                            value={selectingValue[field]}
                            onChange={handleChange}
                            className="border-0  w-100"
                            style={{ outline: "none" }}
                          >
                            <option value={""}>Select</option>
                            {csvHeader?.map((c: any, i: any) => {
                              let x = selectedField?.includes(c);
                              if (x) {
                                return (
                                  <option hidden value={c} key={i}>
                                    {c}
                                  </option>
                                );
                              } else {
                                return (
                                  <option value={c} key={i}>
                                    {c}
                                  </option>
                                );
                              }
                            })}
                          </select>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="form-group2 mt-5">
                <div className="d-flex w-100 d-flex justify-content-center">
                  <div className="popup-section-file btn  border-5 text_small">
                    {/* <i className="bi bi-upload"></i>  */}
                    <span onClick={uploadLeads}>Upload leads</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </DrawerComponent>
      <DrawerComponent
        openWithHeader={thirdDrawer}
        setOpenWithHeader={setThirdDrawer}
        drawerTitle=""
        size="xs"
      >
        <form id="LeadsFilterForm" className="addleadsform lead_pop">
          <div className="form-container">
            <div className="product_group">
              <div className="form-group">
                <h5
                  className="text-center text-black mb-3"
                  style={{ fontSize: "20px" }}
                >
                  Bulk import leads
                </h5>
                <p>Please wait while we import leads.</p>
              </div>
              <div className="file_upload">
                <p>
                  <i className="bi bi-clock-history"></i> Uploading leads ..
                  {progressValue}%
                </p>
              </div>
              <div className="form-group2">
                <div className="d-flex w-100 d-flex justify-content-center btn_bottom">
                  <div
                    className="popup-section-file btn text_small border-5"
                    onClick={() => setThirdDrawer(false)}
                  >
                    {/* <i className="bi bi-upload"></i>  */}
                    <span>Take me to leads</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </DrawerComponent>

      {selectedLead && (
        <CreateActivityForm
          leadIds={[{ id: selectedLead._id }]}
          updateModalValue={updateModalValue}
          modalId="#AddNewActivites"
          action={activityformTitle}
          formName={activityformName}
        />
      )}

      <div
        className="modal fade popup-section-1 popup-section-2 popup-section-3"
        id="AddNewNotes"
        role="dialog"
        tabIndex={-1}
        style={{ zIndex: "999999999999999" }}
      >
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Notes</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <CreateNoteForm
              leadIds={[{ id: selectedLead?._id }]}
              modalId="#AddNewNotes"
            />
          </div>
        </div>
      </div>

      {selectedLead && (
        <CreateLeadDetailsTaskForm
          leadIds={[{ id: selectedLead?._id }]}
          modalId="#AddNewTask"
          updateModalValue={updateModalValue}
          action={activityformTitle}
          formName={activityformName}
          onTaskDelete={onTaskDelete}
        />
      )}
      <div className="leadDetail_drawer">
        <DrawerComponent
          openWithHeader={openWithHeader}
          setOpenWithHeader={setOpenWithHeader}
          drawerTitle="Lead Details"
          size="lg"
        >
          <LeadDetails
            _id={selectedLead?._id || ""}
            name={selectedLead?.name || ""}
            integration={selectedLead?.integration || ""}
            customSource={selectedLead?.customSource || ""}
            createdAt={selectedLead?.createdAt || new Date()}
            status={selectedLead?.status || []}
            saleValue={selectedLead?.saleValue || ""}
            website={selectedLead?.website || ""}
            label={selectedLead?.label || []}
            deleteLeadFromDrawer={deleteLeadFromDrawer}
            copyLeadToList={copyLeadToList}
            moveLeadToList={moveLeadToList}
            onLabelClick={onLabelClick}
            onStatusClick={onStatusClick}
            setFrom={setFrom}
            handleEditModal={handleEditActivityModal}
            handleLeadDetailsModalOpen={handleActivityModal}
            onLeadFileUpload={onLeadFileUpload}
            editLead={editLead}
          />
        </DrawerComponent>
      </div>
      <ConfirmationModal
        onConfirmation={onConfirmation}
        showModal={showConfirmationModal}
        toggleModal={toggleModal}
        message={`Are you sure you want to delete this ${
          toBeRemoved === "lead" ? "lead" : "lead list"
        }`}
        title="Lead"
      />
      <ConfirmationModal
        onConfirmation={leadTaskDelete}
        showModal={taskShowConfirmationModal}
        toggleModal={taskToggleModal}
        message="Are you sure you want to delete this task?"
        title="Task"
      />
      <CopyLeadToList
        copyLeadToListModal={copyLeadToListModal}
        copyLeadToList={copyLeadToList}
        leadList={StoreData.leadList.leadList}
        onCopy={onCopy}
      />
      <MoveLeadToList
        moveLeadToList={moveLeadToList}
        leadList={StoreData.leadList.leadList}
        moveLeadToListModal={moveLeadToListModal}
        onMove={onMove}
      />
      <SelectLeadLabel
        showLabelPopup={showLabelPopup}
        toggleLeadLabel={toggleLeadLabel}
        onLabelChange={onLabelChange}
        selectedLabel={selectedLabel}
        setShowLabelPopup={setShowLabelPopup}
        from={from}
        id={selectedLead?._id || ""}
        getLeads={getLeads}
        setOpenWithHeader={setOpenWithHeader}
        LabelData={leadLabelData}
      />
      <SelectLeadStatus
        showStatusPopup={showStatusPopup}
        toggleLeadStatus={toggleLeadStatus}
        onStatusChange={onStatusChange}
        selectedStatus={selectedStatus}
        setShowStatusPopup={setShowStatusPopup}
        from={from}
        id={selectedLead?._id || ""}
        getLeads={getLeads}
        setOpenWithHeader={setOpenWithHeader}
      />
      <DrawerExistModal
        showExitModal={showExitModal}
        toggleEditModal={toggleEditModal}
        handleDrawerClick={handleDrawerClick}
      />
      <Toaster />
    </div>
  );
};

export default Leads;
