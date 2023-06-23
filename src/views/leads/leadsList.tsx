import React, { PropsWithChildren, useState } from "react";
// import DrawerComponent from "../../components/drawer";
// import EditList from "./editList";

interface Props {
  leadLists: Array<any>;
  onAddList: (mode: string) => void;
  onEditList: (mode: string, _id: string) => void;
  getLeadList: () => void;
  onDeleteClick: (id: string) => void;
  leadData: number;
  LeadNameChange: (_id: string,name:string) => void;
  selectedLeadList: any;
}

const LeadsList: React.FC<PropsWithChildren<Props>> = (props) => {
  const {
    leadLists,
    onAddList,
    getLeadList,
    onDeleteClick,
    onEditList,
    leadData,
    LeadNameChange,
    selectedLeadList,
  } = props;

  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  return (
    <div
      className="dropdown ms-3"
      style={{ backgroundColor: "#EBF0F4", borderRadius: "5px" }}
    >
      <button
        className="btn dropdown-toggle text-black fw-bold lead_icon"
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        onClick={getLeadList}
      >
        {selectedLeadList.name} ({leadData})
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
        aria-labelledby="dropdownMenuButton1"
        id="lists-dropdown"
      >
        {/* <li className="d-flex justify-content-between align-items-center mt-2">
          <span className="ms-3">My Lists </span>
          <button
            className="btn btn-primary me-2"
            onClick={() => onAddList("add")}
          >
            Add New List
          </button>
        </li> */}
        <li
          className="dropdown-item bg-silver mb-2 mt-2"
          onClick={() => {
            LeadNameChange('0',"Leads");
          }}
        >
          Leads
        </li>
        {leadLists.map((listData, i) => (
          <li
            key={i}
            className="lead dropdown-item cursor-pointer pt-2 pb-2 mb-2 d-flex justify-content-between align-items-center dropdown-list-item"
            onClick={() => {
              LeadNameChange(listData?._id,listData?.name);
            }}
          >
            {listData?.name}
            {/* <div className="fliter_btn">
              <button
                type="button"
                className="btn btn-default"
                onClick={() => {
                  onEditList("edit", listData?._id);
                }}
              >
                <i className="bi bi-pencil text-info"></i>
              </button>
              <button
                type="button"
                className="btn btn-default"
                onClick={(e) => {
                  onDeleteClick(listData?._id);
                }}
              >
                <i className="bi bi-trash text-danger"></i>
              </button>
            </div> */}
          </li>
        ))}
      </ul>
      {/* <DrawerComponent
                openWithHeader={showDrawer}
                setOpenWithHeader={setShowDrawer}
                drawerTitle="Update Lead List"
                size="xs"
            >
                <EditList />
            </DrawerComponent> */}
    </div>
  );
};

export default LeadsList;
