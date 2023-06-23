/* eslint-disable react-hooks/exhaustive-deps */
import React, { PropsWithChildren, useEffect, useState } from "react";
import moment from "moment";
import ActivityItem from "../../components/activityItem";
import LeadNoteItems from "../../components/leadNoteItems";
import LeadStatus from "../../components/leadStatus";
import TaskItem from "../../components/taskItem";
import { getLeadDetail } from "../../services/leadService";
import ContactLinksGenerator from "../../utils/contactlinksgenerator";
import _ from "lodash";
import LeadLabel from "../../components/leadLabel";
import DrawerComponent from "../../components/drawer";
import FileUpload from "./FileUpload";
import { useSelector, useDispatch } from "react-redux";
import {
  setActivityList,
  setNote,
  setLeadTaskList,
  leadFileList,
} from "../../actions/actions";
import InfiniteScroll from "react-infinite-scroll-component";

interface LeadDataI {
  _id: string;
  name: string;
  integration: string;
  customSource: string;
  createdAt: Date;
  status: Array<string>;
  saleValue: string;
  website: string;
  label: Array<any>;
  deleteLeadFromDrawer: (id: string) => void;
  copyLeadToList: () => void;
  moveLeadToList: () => void;
  onLabelClick: () => void;
  onStatusClick: () => void;
  setFrom: React.Dispatch<React.SetStateAction<string>>;
  handleEditModal: (name: string, id: any, action: string) => void;
  handleLeadDetailsModalOpen: (title: string, name: string) => void;
  onLeadFileUpload: (e: any) => void;
  editLead: (e: any, id: string) => void;
}

interface SelectedLeadI {
  activities: Array<any>;
  label: Array<any>;
  notes: Array<{
    createdAt: Date;
    createdBy: Date;
    description: string;
    lead: string;
    _id: string;
  }>;
  tasks: Array<any>;
  phone: string;
  email: string;
}

const LeadDetails: React.FC<PropsWithChildren<LeadDataI>> = ({
  _id,
  name,
  integration,
  customSource,
  createdAt,
  status,
  saleValue,
  website,
  label,
  deleteLeadFromDrawer,
  copyLeadToList,
  moveLeadToList,
  onLabelClick,
  onStatusClick,
  setFrom,
  handleEditModal,
  handleLeadDetailsModalOpen,
  onLeadFileUpload,
  editLead,
}) => {
  const [selectedLeadData, setSelectedLeadData] = useState<SelectedLeadI>({
    activities: [],
    label: [],
    notes: [],
    tasks: [],
    phone: "",
    email: "",
  });
  const dispatch = useDispatch();
  const StateData = useSelector((state: any) => {
    return state?.rootReducers;
  });
  const [openFileDrawer, setOpenFileDrawer] = useState<any>(false);
  const [leadOwnerName, setLeadOwnerName] = useState<any>("");
  const [extraDetails, setExtraDetails] = useState<any>({});
  // const [activityData, setActivityData] = useState<any>(StateData);
  const selectedLeadContactDetailsGenerator = new ContactLinksGenerator({
    number:
      selectedLeadData.phone?.length >= 10
        ? "+91" + selectedLeadData.phone
        : selectedLeadData.phone,
    email: selectedLeadData?.email || "",
  });
  useEffect(() => {
    fetchLeadDetails();
  }, [_id]);

  const fetchLeadDetails = async () => {
    try {
      const response = await getLeadDetail(_id);
      if (response && response.status) {
        let responseData = response?.data?.data;
        let leadOwnerName =
          StateData?.userData?.userDetails?.organizationEmployee?.find(
            (x: any) => x._id == responseData.createdBy
          );
        let first_name = leadOwnerName?.firstName;
        let last_name = leadOwnerName?.lastName ? leadOwnerName?.lastName : "";
        dispatch(setActivityList(responseData?.activities));
        dispatch(setLeadTaskList(responseData?.tasks));
        dispatch(setNote(responseData?.notes));
        dispatch(leadFileList(responseData?.files));
        setExtraDetails(responseData.extraDetails);
        setLeadOwnerName(first_name + " " + last_name);
        setSelectedLeadData({
          ...selectedLeadData,
          activities: responseData?.activities,
          label: responseData?.label,
          notes: responseData?.notes,
          tasks: responseData?.tasks,
          phone: responseData?.phone,
          email: responseData?.email,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // const onScrollLeadMore = () => {
  //   // 20 more records in .5 secs
  //   // setTimeout(() => {
  //   //   setActivityData(StateData.concat(Array.from({ length: 3 })));
  //   // }, 500);
  // };

  return (
    <div className="row">
      <div className="col-md-5">
        <div className="popup-section-4-left">
          <img
            alt="edit"
            src="assets/img/edit.png"
            className="edit_lead"
            onClick={(e) => editLead(e, _id)}
          />
          <div className="d-flex justify-content-center flex-column align-items-center">
            <h3 className="text-capitalize text-black">{name || ""}</h3>
            {saleValue && <h5 className="text-black">₹ {saleValue}</h5>}
            {/* <div className="dropdown">
                            <button className="btn btn-sm btn-secondary ms-2 pt-1 pb-0 pe-2 ps-2 mt-1 dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><p className="dropdown-item">Assign Lead</p></li>
                                <li><p className="dropdown-item" onClick={() => copyLeadToList()}>Copy Lead to List</p></li>
                                <li><p className="dropdown-item" onClick={() => moveLeadToList()}>Move Lead to List</p></li>
                                <li><p className="dropdown-item" onClick={() => deleteLeadFromDrawer(_id)}>Delete Lead</p></li>
                            </ul>
                        </div> */}
          </div>
          <ul className="popup-section-4-left-1 mt-3 text-center">
            <li>
              <a href={selectedLeadContactDetailsGenerator?.tel}>
                <img
                  alt="tel"
                  src="assets/img/telephone.png"
                  height={30}
                  width={30}
                />
              </a>
            </li>
            <li>
              {selectedLeadContactDetailsGenerator?.mail ? (
                <a href={selectedLeadContactDetailsGenerator?.mail}>
                  <img
                    alt="email"
                    src="assets/img/email.png"
                    height={30}
                    width={30}
                  />
                </a>
              ) : (
                <img
                  alt="email"
                  src="assets/img/greyEmail.png"
                  height={30}
                  width={30}
                />
              )}
            </li>
            <li>
              <a
                href={selectedLeadContactDetailsGenerator?.whatsapp}
                target="_blank"
              >
                <img
                  alt="wp"
                  src="assets/img/whatsapp.png"
                  height={30}
                  width={30}
                />
              </a>
            </li>
            <li>
              <a onClick={() => setOpenFileDrawer(true)}>
                <img
                  alt="file"
                  src="assets/img/CircleClip.png"
                  height={30}
                  width={30}
                />
              </a>
            </li>
            <DrawerComponent
              openWithHeader={openFileDrawer}
              setOpenWithHeader={setOpenFileDrawer}
              drawerTitle={`Files ${StateData?.leadFile?.leadFile?.length}`}
              size="sm"
            >
              <FileUpload
                onLeadFileUpload={onLeadFileUpload}
                StateData={StateData}
              />
            </DrawerComponent>
          </ul>
          <ul className="popup-section-4-left-2">
            <li>
              <span>Phone</span>
              <br />
              {selectedLeadData?.phone}
            </li>
            <li>
              <span>Email</span>
              <br />
              {selectedLeadData?.email}
            </li>
            {status?.length > 0 && (
              <li className="mt-2">
                <div className="d-flex mb-2">
                  <span>Status</span>
                  <br />
                  <i
                    className="bi bi-pencil ms-3 mt-1 cursor-pointer"
                    onClick={() => {
                      onStatusClick();
                      setFrom("details");
                    }}
                  ></i>
                </div>

                {!_.isEmpty(_id) && (
                  <LeadStatus
                    status={status}
                    preferences={{
                      status: [],
                    }}
                  />
                )}
              </li>
            )}
            {label?.length > 0 && (
              <li>
                <div className="d-flex mb-2">
                  <span>Label</span>
                  <br />
                  <i
                    className="bi bi-pencil ms-3 cursor-pointer"
                    onClick={() => {
                      onLabelClick();
                      setFrom("details");
                    }}
                  ></i>
                </div>
                {!_.isEmpty(_id) && (
                  <LeadLabel
                    label={label}
                    preferences={{
                      labels: [],
                    }}
                  />
                )}
              </li>
            )}
            {/* <li><span>Sale Value</span><br />&#8377; {saleValue}</li>
                       
                        {website ? <li><span>Webiste</span><br />{website}</li> : ''} */}
            <li>
              <span>Date added </span>
              <br />
              {createdAt && moment(createdAt).format("DD MMM YYYY")}
            </li>

            <li>
              <span>Lead Source</span>
              <br />
              {customSource !== ""
                ? _.capitalize(customSource?.split("_")?.join(" "))
                : _.capitalize(integration)}
            </li>
          </ul>
        </div>
      </div>
      <div className="col-md-7">
        <div className="popup-section-4-right">
          <ul className="nav nav-pills d-flex" id="pills-tab" role="tablist">
            <li className="nav-item flex-fill" role="presentation">
              <button
                className="nav-link active"
                id="pills-activites-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-activites"
                type="button"
                role="tab"
                aria-controls="pills-activites"
                aria-selected="true"
              >
                Activities
              </button>
            </li>
            <li className="nav-item flex-fill" role="presentation">
              <button
                className="nav-link"
                id="pills-task-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-task"
                type="button"
                role="tab"
                aria-controls="pills-task"
                aria-selected="false"
              >
                Tasks
              </button>
            </li>
            <li className="nav-item flex-fill" role="presentation">
              <button
                className="nav-link"
                id="pills-notes-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-notes"
                type="button"
                role="tab"
                aria-controls="pills-notes"
                aria-selected="false"
              >
                Notes
              </button>
            </li>
            <li className="nav-item flex-fill" role="presentation">
              <button
                className="nav-link"
                id="pills-Info-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-Info"
                type="button"
                role="tab"
                aria-controls="pills-Info"
                aria-selected="false"
              >
                Info
              </button>
            </li>
          </ul>
          <div className="tab-content pt-2" id="myTabContent">
            <div
              className="tab-pane fade show active"
              id="pills-activites"
              role="tabpanel"
              aria-labelledby="activites-tab"
            >
              <div className="row popup-section-4-add-11">
                <button
                  className="btn align-items-center"
                  onClick={() => handleLeadDetailsModalOpen("Add", "Activity")}
                >
                  <i className="bi bi-plus-square-fill"></i> Add a Activity
                </button>
              </div>
              <div
                className={
                  StateData.activity?.activities?.length > 3
                    ? "row activity-scroll"
                    : "row"
                }
              >
                {/* <InfiniteScroll
                  dataLength={StateData?.length}
                  next={onScrollLeadMore}
                  hasMore={true}
                  loader={<h4>Loading...</h4>}
                  scrollableTarget="scrollableDiv"
                > */}
                {StateData.activity?.activities?.map(
                  (activity: any, i: number) => (
                    <ActivityItem
                      activity={activity}
                      name="activity"
                      key={i}
                      handleEditModal={handleEditModal}
                    />
                  )
                )}
                {/* </InfiniteScroll> */}
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-task"
              role="tabpanel"
              aria-labelledby="task-tab"
            >
              <div className="row popup-section-4-add-11">
                <button
                  className="btn align-items-center"
                  onClick={() => handleLeadDetailsModalOpen("Add", "Task")}
                >
                  <i className="bi bi-plus-square-fill"></i> Add a Task
                </button>
              </div>
              <div
                className={
                  StateData?.leadTask?.leadTask?.length > 3
                    ? "row activity-scroll"
                    : "row"
                }
              >
                {StateData?.leadTask?.leadTask?.map(
                  (activity: any, i: number) => (
                    <ActivityItem
                      activity={activity}
                      name="task"
                      key={i}
                      handleEditModal={handleEditModal}
                    />
                  )
                )}
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-notes"
              role="tabpanel"
              aria-labelledby="notes-tab"
            >
              <div className="row popup-section-4-add-11">
                <button
                  className="btn align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#AddNewNotes"
                >
                  <i className="bi bi-plus-square-fill"></i> Add a Notes
                </button>
              </div>
              <div
                className={
                  StateData?.note?.notes?.length > 3
                    ? "row activity-scroll"
                    : "row"
                }
              >
                {StateData?.note?.notes?.map((activity: any, i: number) => (
                  <LeadNoteItems activity={activity} key={i} />
                ))}
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-Info"
              role="tabpanel"
              aria-labelledby="Info-tab"
            >
              <ul className="popup-section-4-left-2 mt-5 info-scroll">
                {selectedLeadData?.phone && (
                  <li>
                    <span>Phone</span>
                    <br />
                    {selectedLeadData?.phone?.replace(/['‘’"“”]/g, "")}
                  </li>
                )}
                {extraDetails?.alternate_phone && (
                  <li>
                    <span>Alternate Phone</span>
                    <br />
                    {extraDetails.alternate_phone?.replace(/['‘’"“”]/g, "")}
                  </li>
                )}
                {extraDetails?.opt && (
                  <li>
                    <span>OTP</span>
                    <br />
                    {extraDetails.opt}
                  </li>
                )}

                <li>
                  <span>Lead Source</span>
                  <br />
                  {customSource !== ""
                    ? _.capitalize(customSource?.split("_")?.join(" "))
                    : _.capitalize(integration)}
                </li>

                {extraDetails?.id && (
                  <li>
                    <span>Id</span>
                    <br />
                    {extraDetails.id}
                  </li>
                )}
                {extraDetails?.comments && (
                  <li>
                    <span>Comments</span>
                    <br />
                    {extraDetails.comments?.replace(/['‘’"“”]/g, "")}
                  </li>
                )}
                {extraDetails?.formName && (
                  <li>
                    <span>Form name</span>
                    <br />
                    {extraDetails?.formName}
                  </li>
                )}
                {extraDetails?.formId && (
                  <li>
                    <span>Form id</span>
                    <br />
                    {extraDetails?.formId}
                  </li>
                )}
                {leadOwnerName && (
                  <li>
                    <span>Lead Owner</span>
                    <br />
                    {leadOwnerName}
                  </li>
                )}
                {extraDetails &&
                  extraDetails !== "null" &&
                  extraDetails !== "undefined" && (
                    <>
                      {Object.keys(extraDetails)?.map((item: any) => {
                        return (
                          <>
                            {item.field_data?.length < 0 && (
                              <li>
                                <span>
                                  {_.capitalize(item?.split("_")?.join(" ")) +
                                    ""}
                                </span>
                                <br />
                                {"" + extraDetails[item]}
                              </li>
                            )}
                          </>
                        );
                      })}
                    </>
                  )}
                {extraDetails?.forms && (
                  <li>
                    <span>Form Name :- {extraDetails?.forms?.name} </span>
                    <br />
                    Form Id :- {extraDetails?.forms?.id}
                  </li>
                )}
                {extraDetails?.page && (
                  <li>
                    <span>Page Name :- {extraDetails?.page?.name} </span>
                    <br />
                    Page Id :- {extraDetails?.page?.id}
                  </li>
                )}
                {extraDetails?.created_at && (
                  <li>
                    <span>Date added </span>
                    <br />
                    {extraDetails?.created_at &&
                      moment(extraDetails.created_at).format("DD MMM YYYY")}
                  </li>
                )}
                {extraDetails?.created_time && (
                  <li>
                    <span>Created time </span>
                    <br />
                    {extraDetails?.created_time &&
                      moment(extraDetails.created_time).format("DD MMM YYYY")}
                  </li>
                )}
                {extraDetails?.onboarding_status && (
                  <li>
                    <span>Onboarding status </span>
                    <br />
                    {extraDetails.onboarding_status}
                  </li>
                )}
                {extraDetails?.sub_active && (
                  <li>
                    <span>Sub active </span>
                    <br />
                    {extraDetails.sub_active}
                  </li>
                )}
                {extraDetails?.trial_taken && (
                  <li>
                    <span>Trial taken </span>
                    <br />
                    {extraDetails.trial_taken}
                  </li>
                )}
                {extraDetails?.last_login && (
                  <li>
                    <span>Last login </span>
                    <br />
                    {extraDetails.last_login}
                  </li>
                )}
                {extraDetails?.field_data?.length > 0 && (
                  <>
                    {extraDetails?.field_data?.map((item: any, i: number) => {
                      return (
                        <li key={i}>
                          <span>
                            {_.capitalize(item?.name?.split("_")?.join(" "))}
                          </span>
                          <br />
                          {item.values}
                        </li>
                      );
                    })}
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
