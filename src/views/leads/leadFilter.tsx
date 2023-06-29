import React, { PropsWithChildren, useEffect, useState } from "react";
// import { Typeahead } from "react-bootstrap-typeahead";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { DatePicker } from "antd";
import { getAllTeams } from "../../services/teamsService";
import { filterLeads } from "../../services/leadService";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setLeads } from "../../actions/actions";
import Select from "react-select";
import moment from "moment";
interface PropsT {
  onLabelClick: () => void;
  onStatusClick: () => void;
  selectedStatus: string;
  selectedLabel: Array<string>;
  setShowFilterDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  LeadDataList: (data: any) => void;
}

const sortLeadBy = [
  { value: "createdDate", label: "Created Date" },
  { value: "name", label: "Name" },
  { value: "saleValue", label: "Sale Value" },
  { value: "followupDate", label: "Followup Date" },
  { value: "activityDate", label: "Activity Date" },
];

const DateLeadAdded = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "3DayBefore", label: "3 Days Before Now" },
  { value: "1WeekBefore", label: "1 Week Before Now" },
  { value: "1MonthBefore", label: "1 Month Before Now" },
  { value: "custom", label: "Custom Date" },
];

const LeadFilter: React.FC<PropsWithChildren<PropsT>> = ({
  onLabelClick,
  onStatusClick,
  selectedStatus,
  selectedLabel,
  setShowFilterDrawer,
  LeadDataList
}) => {
  const [teamMembers, setTeamMembers] = useState<Array<{}>>([]);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [multiSelections, setMultiSelections] = useState([]);
  const [isAscending, setIsAscending] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<any>([]);
  const [labels, setLabels] = useState<any>([]);
  const [status, setStatus] = useState<any>([]);
  const [leadSource, setLeadSource] = useState<any>([]);
  const [employee, setEmployee] = useState<any>([]);
  const [filterData, setFilterData] = useState<any>({});
  const [isOrganization, setIsOrganization] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let local: any = localStorage.getItem("user_preferences");
    let userData: any = localStorage.getItem("userData");
    setLabels(JSON.parse(local)?.labels);
    setStatus(JSON.parse(local)?.status);
    setLeadSource(JSON.parse(local)?.customSource);
    setEmployee(JSON.parse(userData)?.organizationEmployee);
  }, []);

  const fetchTeams = async () => {
    const response = await getAllTeams();
    if (response && response.status) {
      let responseData = response?.data?.data;
      let tempArray: any = [];

      responseData.forEach((item: any, index: any) => {
        tempArray.splice(index, 0, { name: item.name, id: item._id });
        let contains = tempArray.find(
          (outputItem: any) => outputItem.name === item.organization
        );
        if (!contains) {
          tempArray.push({ name: item.organization, id: "organization" });
        }
      });
      setTeamMembers(tempArray);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleFilter = (e: any, name: any) => {
    if (name === "team") {
      if (e[0].value === "organization") {
        setIsOrganization(true);
      } else {
        setIsOrganization(false);
      }
    }
    setFilterData({ ...filterData, [name]: e });
  };
  const DateFilteronChange = (date: string, name: string) => {
    setFilterData({ ...filterData, [name]: date });
    switch (date) {
      case "today":
        setStartDate(moment().subtract(0, "d").utc().format());
        setShowDatePicker(false);
        break;
      case "yesterday":
        setStartDate(moment().subtract(1, "d").utc().format());
        setShowDatePicker(false);
        break;
      case "3DayBefore":
        setStartDate(moment().subtract(3, "d").utc().format());
        setShowDatePicker(false);
        break;
      case "1WeekBefore":
        setStartDate(moment().subtract(1, "w").utc().format());
        setShowDatePicker(false);
        break;
      case "1MonthBefore":
        setStartDate(moment().subtract(30, "d").utc().format());
        setShowDatePicker(false);
        break;
      case "custom":
        setShowDatePicker(true);
        break;
      default:
        break;
    }
  };

  const selectTeamMember = (val: any) => {
    setMultiSelections(val);
  };

  const selectOrderBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderBy(e?.currentTarget?.value);
  };

  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isAsc = e?.currentTarget?.value === "true" ? true : false;
    setIsAscending(isAsc);
  };

  const resetFilter = () => {
    console.log("filter reset");
  };

  const applyFilter = async () => {
    // let arr = [];
    // if (selectedStatus !== "") {
    //   arr.push(selectedStatus);
    // }
    // let obj = {};
    // if (arr.length > 0) {
    //   Object.assign(obj, { status: arr });
    // }
    // if (selectedLabel.length > 0) {
    //   Object.assign(obj, { label: selectedLabel });
    // }
    // if (multiSelections.length > 0) {
    //   Object.assign(obj, {
    //     teamMembers: multiSelections?.map((member: any) => member?._id),
    //   });
    // }
    // if (startDate && endDate) {
    //   Object.assign(obj, {
    //     followup: {
    //       isFollowup: true,
    //       single: {
    //         start: startDate,
    //         end: endDate,
    //       },
    //     },
    //   });
    // }
    // Object.assign(obj, {
    //   sort: {
    //     orderBy: orderBy,
    //     isAscending: isAscending,
    //   },
    // });
    var tempLabel = filterData?.labels;
    var filterLabel = [];
    for (let i = 0; i < tempLabel?.length; i++) {
      filterLabel.push(tempLabel[i].value);
    }
    var tempStatus = filterData?.status;
    var filterStatus = [];
    for (let i = 0; i < tempStatus?.length; i++) {
      filterStatus.push(tempStatus[i].value);
    }
    var tempSource = filterData?.sources;
    var filterSource = [];
    for (let i = 0; i < tempSource?.length; i++) {
      filterSource.push(tempSource[i].value);
    }
    var tempEmp = filterData?.employee;
    var filterEmp = [];
    for (let i = 0; i < tempEmp?.length; i++) {
      filterEmp.push(tempEmp[i].value);
    }

    var tempTeam = filterData?.team;
    var filterTeame = [];
    if (filterData?.team) {
      if (tempTeam[0]?.value !== "organization") {
        for (let i = 0; i < tempTeam?.length; i++) {
          filterTeame.push(tempTeam[i].value);
        }
      }
    }

    let obj = {
      ...(filterData.sortLeadBy && {
        sort: {
          orderBy: filterData?.sortLeadBy?.value,
          isAscending: true,
        },
      }),
      ...(filterData.dateLead && {
        date: {
          startedAt: showDatePicker
            ? moment(endDate).utc().format()
            : startDate,
          endedAt: showDatePicker
            ? moment(startDate).utc().format()
            : moment(new Date()).utc().format(),
        },
      }),
      ...(filterLabel.length && { label: filterLabel }),
      ...(isOrganization && { byOrganization: isOrganization }),
      ...(filterStatus.length && { status: filterStatus }),
      ...(filterSource.length && { source: filterSource }),
      ...(filterEmp.length && { teamMembers: filterEmp }),
      ...(filterTeame.length && { teams: filterTeame }),
    };

    try {
      const response = await filterLeads(obj);
      if (response && response.status) {
        toast.success(response?.data?.message);
        LeadDataList(response?.data?.data);
        dispatch(setLeads(response?.data?.data));
        setShowFilterDrawer(false);
      }
    } catch (err) {
      toast.error("Error while filtering leads");
    }
  };

  return (
    <form id="LeadsFilterForm" className="leadsform">
      <div className="form-container">
        <div className="product_group">
          <div className="form-group">
            <label htmlFor="lead-date" className="form-label">
              Sort lead by
            </label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              isDisabled={false}
              isLoading={false}
              isClearable={true}
              isRtl={false}
              isSearchable={true}
              name="sortLeadBy"
              options={sortLeadBy}
              onChange={(e: any) => handleFilter(e, "sortLeadBy")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lead-date" className="form-label">
              Date lead added
            </label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              isDisabled={false}
              isLoading={false}
              isClearable={true}
              isRtl={false}
              isSearchable={true}
              name="dateLead"
              options={DateLeadAdded}
              onChange={(e: any) => DateFilteronChange(e.value, "dateLead")}
            />
          </div>
          {showDatePicker && (
            <div className="form-group">
              <label className="form-label">Custom Dates</label>
              <div className="custom_date_picker">
                <DatePicker
                  format={"DD MMM YYYY"}
                  showToday={false}
                  // value={startDate}
                  onChange={(date: any) => setStartDate(date)}
                />
                <DatePicker
                  format={"DD MMM YYYY"}
                  showToday={false}
                  // value={endDate}
                  onChange={(date: any) => setEndDate(date)}
                />
              </div>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="lead-date" className="form-label">
              Lead labels
            </label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              isDisabled={false}
              isLoading={false}
              isClearable={true}
              isRtl={false}
              isMulti
              isSearchable={true}
              name="color"
              options={labels?.map((v: any) => {
                return { value: v?.value, label: v?.name };
              })}
              onChange={(e: any) => handleFilter(e, "labels")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lead-date" className="form-label">
              Lead Status
            </label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              isDisabled={false}
              isLoading={false}
              isClearable={true}
              isRtl={false}
              isMulti
              isSearchable={true}
              name="color"
              options={status?.map((v: any) => {
                return { value: v?.value, label: v?.name };
              })}
              onChange={(e: any) => handleFilter(e, "status")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lead-date" className="form-label">
              Lead Sources
            </label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              isDisabled={false}
              isLoading={false}
              isClearable={true}
              isRtl={false}
              isMulti
              isSearchable={true}
              name="color"
              options={leadSource?.map((v: any) => {
                return { value: v?.value, label: v?.name };
              })}
              onChange={(e: any) => handleFilter(e, "sources")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lead-date" className="form-label">
              Team
            </label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              isDisabled={false}
              isLoading={false}
              isClearable={true}
              isRtl={false}
              isMulti
              isSearchable={true}
              name="color"
              options={teamMembers?.map((v: any) => {
                return { value: v?.id, label: v?.name };
              })}
              onChange={(e: any) => handleFilter(e, "team")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lead-date" className="form-label">
              Employee
            </label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              isDisabled={false}
              isLoading={false}
              isClearable={true}
              isRtl={false}
              isMulti
              isSearchable={true}
              name="color"
              options={employee?.map((v: any) => {
                return {
                  value: v?._id,
                  label:
                    v?.firstName && v?.lastName
                      ? v?.firstName + " " + v?.lastName
                      : v?.firstName,
                };
              })}
              onChange={(e: any) => handleFilter(e, "employee")}
            />
          </div>
        </div>
        <div className="d-flex justify-content-center w-100">
          <button
            type="reset"
            className="btn LeadsFilterReset"
            onClick={resetFilter}
          >
            Reset
          </button>
          <button
            type="button"
            className="btn btn-dark LeadsFilterApply"
            onClick={applyFilter}
          >
            Apply
          </button>
        </div>
      </div>
      <Toaster />
    </form>
  );
};

export default LeadFilter;
