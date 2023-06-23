import React, { useState, useEffect } from "react";
import Header from "../../components/header";
import Chart from "react-apexcharts";
import ReactApexChart from "react-apexcharts";
import { dashboardDates } from "../../utils/globalConstants";
import {
  fetchTeamList,
  fetchOrganizationList,
  fetchDashboardLeadCount,
  fetchDashboardAllActivityCount,
  fetchDashboardSalesCount,
  fetchDashboardGraphData,
  fetchDashboardMapcheckIn,
  fetchDashboardLeadLableGraphData,
  fetchDashboardLeadSourceGraphData,
  fetchDashboardFunnelChart,
} from "../../services/dashboardService";
import _ from "lodash";
import moment from "moment";
import Mapp from "./Map/googleMap";
import { useSelector } from "react-redux";
import { FunnelChart } from "react-funnel-pipeline";
import "react-funnel-pipeline/dist/index.css";
import { Spin } from "antd";

function getTimeFormat(time: number) {
  if (time) {
    var date = new Date(0);
    date.setSeconds(time);
    var timeString = date.toISOString().substring(11, 19);

    return timeString;
  }
}
const Dashboard: React.FC = () => {
  const StoreData = useSelector((state: any) => {
    return state?.rootReducers;
  });

  const [filterFromDate, setFilterFromDate] = useState(7);
  const [fromDate, setFromDate] = useState("7d");
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");
  const [totalLeadCount, setTotalLeadCount] = useState<number>(0);
  const [totalActivityCount, setTotalActivityCount] = useState<number>(0);
  const [totalCallCount, setTotalCallCount] = useState<number>(0);
  const [totalSalesCount, setTotalSalesCount] = useState<number>(0);
  const [teamData, setTeamData] = useState<any>([]);
  const [organizationData, setOrganizationData] = useState<any>([]);
  const [activityTypes, setActivityTypes] = useState<any>([]);
  const [callingData, setCallingData] = useState<any>([]);
  const [callingDetails, setCallingDetails] = useState<any>({});
  const [LeadGraphXData, setLeadGraphXData] = useState<any>([]);
  const [LeadGraphSData, setLeadGraphSData] = useState<any>([]);
  const [leadLabelGraphX, setLeadLabelGraphX] = useState<any>([]);
  const [leadLabelGraphS, setLeadLabelGraphS] = useState<any>([]);
  const [leadSourceGraphX, setLeadSourceGraphX] = useState<any>([]);
  const [leadSourceGraphS, setLeadSourceGraphS] = useState<any>([]);
  const [saleFunnelGraphS, setSaleFunnelGraphS] = useState<any>([]);
  const [funnelColor, setFunnelColor] = useState<any>([]);
  const [mapCheckInData, setMapCheckInData] = useState<any>([]);
  const [filterUserData, setFilterUserData] = useState<any>([]);
  const [leadLabelColors, setLeadLabelColors] = useState<any>([]);
  const [isCustomDate, setIsCustomDate] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [isOrganization, setIsOrganization] = useState<boolean>(false);
  const [isPageLoad, setIsPageLoad] = useState<boolean>(false);
  const [tabName, setTabName] = useState("lead");

  useEffect(() => {
    getAllTeam();
    getAllOrganization();
  }, []);

  useEffect(() => {
    DashboardLeadCount();
    DashboardAllActivityData();
    DashboardSalesData();
    DashboardGraph(tabName);
    DashboardLeadLabelGraph();
    DashboardLeadSourceGraph();
    DashboardSaleFunnelGraph();
    DashboardMapCheckInDetails();
  }, [filterFromDate]);

  useEffect(() => {
    let Store_data = StoreData?.userData?.userDetails;
    let TempArrya = [];
    let orgTeam = Store_data?.organizationTeams;
    let orgRole = Store_data?.organizationRoles;

    let orgEmp = Store_data?.organizationEmployee;

    TempArrya = orgEmp?.filter((obj1: any) =>
      orgTeam.some((obj2: any) => obj2._id === obj1.team)
    );
    const mergedArray = TempArrya?.map((obj1: any) => {
      const matchingObjTeam = orgTeam?.find(
        (obj2: any) => obj2._id === obj1.team
      );
      const matchingObjRole = orgRole?.find(
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
    setFilterUserData(mergedArray);
  }, []);

  useEffect(() => {
    if (customFromDate && customToDate) {
      DashboardLeadCount();
      DashboardAllActivityData();
      DashboardSalesData();
      DashboardGraph(tabName);
      DashboardLeadLabelGraph();
      DashboardLeadSourceGraph();
      DashboardSaleFunnelGraph();
      DashboardMapCheckInDetails();
    }
  }, [customFromDate && customToDate]);

  useEffect(() => {
    if (selectedUserId) {
      DashboardLeadCount();
      DashboardAllActivityData();
      DashboardSalesData();
      DashboardGraph(tabName);
      DashboardLeadLabelGraph();
      DashboardLeadSourceGraph();
      DashboardSaleFunnelGraph();
      DashboardMapCheckInDetails();
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (selectedTeamId) {
      DashboardLeadCount();
      DashboardAllActivityData();
      DashboardSalesData();
      DashboardGraph(tabName);
      DashboardLeadLabelGraph();
      DashboardLeadSourceGraph();
      DashboardSaleFunnelGraph();
      DashboardMapCheckInDetails();
    }
  }, [selectedTeamId]);

  useEffect(() => {
    if (isOrganization) {
      DashboardLeadCount();
      DashboardAllActivityData();
      DashboardSalesData();
      DashboardGraph(tabName);
      DashboardLeadLabelGraph();
      DashboardLeadSourceGraph();
      DashboardSaleFunnelGraph();
      DashboardMapCheckInDetails();
    }
  }, [isOrganization]);

  const getAllTeam = async () => {
    try {
      const response = await fetchTeamList();
      if (response && response.status) {
        setTeamData(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAllOrganization = async () => {
    try {
      const response = await fetchOrganizationList();
      if (response && response.status) {
        setOrganizationData(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const DashboardLeadCount = async () => {
    try {
      setIsPageLoad(true);
      let fromDate = isCustomDate
        ? customFromDate
        : moment().subtract(filterFromDate, "d").utc().format();
      let toDate = isCustomDate
        ? customToDate
        : moment(new Date()).utc().format();
      const response = await fetchDashboardLeadCount(
        fromDate,
        toDate,
        isOrganization,
        selectedUserId,
        selectedTeamId
      );
      if (response && response.status) {
        setTotalLeadCount(response.data.data?.count?.totalLead);
        setTimeout(() => {
          setIsPageLoad(false);
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      setIsPageLoad(false);
    }
  };
  const DashboardAllActivityData = async () => {
    try {
      setIsPageLoad(true);
      let fromDate = isCustomDate
        ? customFromDate
        : moment().subtract(filterFromDate, "d").utc().format();
      let toDate = isCustomDate
        ? customToDate
        : moment(new Date()).utc().format();
      const response = await fetchDashboardAllActivityCount(
        fromDate,
        toDate,
        isOrganization,
        selectedUserId,
        selectedTeamId
      );
      if (response && response.status) {
        let resposneData = response.data.data;
        let tempCallingData = resposneData?.callingCount;
        let callCount = 0;
        tempCallingData.forEach((item: any) => {
          callCount += item.count;
        });
        setTotalCallCount(callCount);
        setTotalActivityCount(resposneData?.totalActivity);
        setActivityTypes(resposneData?.activityTypes);
        setCallingData(resposneData?.callingCount);
        setCallingDetails(resposneData?.callingDetails);
        setTimeout(() => {
          setIsPageLoad(false);
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      setIsPageLoad(false);
    }
  };
  const DashboardSalesData = async () => {
    try {
      setIsPageLoad(true);
      let fromDate = isCustomDate
        ? customFromDate
        : moment().subtract(filterFromDate, "d").utc().format();
      let toDate = isCustomDate
        ? customToDate
        : moment(new Date()).utc().format();
      const response = await fetchDashboardSalesCount(
        fromDate,
        toDate,
        isOrganization,
        selectedUserId,
        selectedTeamId
      );
      if (response && response.status) {
        let resposneData = response.data.data;
        setTotalSalesCount(resposneData?.salesValue);
        setTimeout(() => {
          setIsPageLoad(false);
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      setIsPageLoad(false);
    }
  };

  const DashboardGraph = async (tab: string) => {
    try {
      setIsPageLoad(true);
      let fromDate = isCustomDate
        ? customFromDate
        : moment().subtract(filterFromDate, "d").utc().format();
      let toDate = isCustomDate
        ? customToDate
        : moment(new Date()).utc().format();
      const response = await fetchDashboardGraphData(
        fromDate,
        toDate,
        tab,
        isOrganization,
        selectedUserId,
        selectedTeamId
      );
      if (response && response.status) {
        let resposneData = response.data.data;
        if (resposneData.length > 0) {
          let tempXData = [];
          let tempSData = [];
          for (let i = 0; i < resposneData.length; i++) {
            tempXData.push(resposneData[i].count);
            tempSData.push(moment(resposneData[i].point).format("YYYY-MM-DD"));
          }
          setLeadGraphXData(tempXData);
          setLeadGraphSData(tempSData);
          setTimeout(() => {
            setIsPageLoad(false);
          }, 1000);
        } else {
          setLeadGraphXData([]);
          setLeadGraphSData([]);
          setIsPageLoad(false);
        }
      }
    } catch (err) {
      setIsPageLoad(false);
      console.log(err);
    }
  };

  const DashboardLeadLabelGraph = async () => {
    try {
      setIsPageLoad(true);
      let fromDate = isCustomDate
        ? customFromDate
        : moment().subtract(filterFromDate, "d").utc().format();
      let toDate = isCustomDate
        ? customToDate
        : moment(new Date()).utc().format();
      const response = await fetchDashboardLeadLableGraphData(
        fromDate,
        toDate,
        isOrganization,
        selectedUserId,
        selectedTeamId
      );
      if (response && response.status) {
        let resposneData = response.data.data;
        if (resposneData.length > 0) {
          let tempXData = [];
          let tempSData = [];
          let color = [];
          let tempColorData = StoreData.user.userPreferences.labels;
          for (let j = 0; j < tempColorData.length; j++) {
            color.push(tempColorData[j].color);
          }
          for (let i = 0; i < resposneData.length; i++) {
            tempXData.push(resposneData[i].count);
            tempSData.push(resposneData[i].type);
          }
          setLeadLabelGraphX(tempXData);
          setLeadLabelGraphS(tempSData);
          setLeadLabelColors(color);
          setTimeout(() => {
            setIsPageLoad(false);
          }, 1000);
        } else {
          setLeadLabelGraphX([]);
          setLeadLabelGraphS([]);
          setIsPageLoad(false);
        }
      }
    } catch (err) {
      console.log(err);
      setIsPageLoad(false);
    }
  };
  const DashboardLeadSourceGraph = async () => {
    try {
      setIsPageLoad(true);
      let fromDate = isCustomDate
        ? customFromDate
        : moment().subtract(filterFromDate, "d").utc().format();
      let toDate = isCustomDate
        ? customToDate
        : moment(new Date()).utc().format();
      const response = await fetchDashboardLeadSourceGraphData(
        fromDate,
        toDate,
        isOrganization,
        selectedUserId,
        selectedTeamId
      );
      if (response && response.status) {
        let resposneData = response.data.data;
        if (resposneData.length > 0) {
          let tempXData = [];
          let tempSData = [];
          for (let i = 0; i < resposneData.length; i++) {
            if (resposneData[i].integration) {
              tempXData.push(resposneData[i].count);
              tempSData.push(resposneData[i].integration);
            }
          }
          setLeadSourceGraphX(tempXData);
          setLeadSourceGraphS(tempSData);
          setTimeout(() => {
            setIsPageLoad(false);
          }, 1000);
        } else {
          setLeadSourceGraphX([]);
          setLeadSourceGraphS([]);
          setIsPageLoad(false);
        }
      }
    } catch (err) {
      console.log(err);
      setIsPageLoad(false);
    }
  };

  const DashboardSaleFunnelGraph = async () => {
    try {
      setIsPageLoad(true);
      let fromDate = isCustomDate
        ? customFromDate
        : moment().subtract(filterFromDate, "d").utc().format();
      let toDate = isCustomDate
        ? customToDate
        : moment(new Date()).utc().format();
      const response = await fetchDashboardFunnelChart(
        fromDate,
        toDate,
        isOrganization,
        selectedUserId,
        selectedTeamId
      );
      if (response && response.status) {
        let resposneData = response.data.data;
        if (resposneData.length > 0) {
          let tempFunnelData = [];
          let tempFunnelColor = [];
          let tempColors = StoreData.user.userPreferences.status;
          for (let i = 0; i < resposneData.length; i++) {
            let X_label = _.capitalize(
              resposneData[i].type?.split("_")?.join(" ")
            );
            let X = `${resposneData[i].count} ${X_label}`;
            let tempObj = {
              name: X,
              value: resposneData[i].saleValue,
            };
            tempFunnelData.push(tempObj);
            for (let j = 0; j < tempColors.length; j++) {
              if (resposneData[i].type === tempColors[j].value) {
                tempFunnelColor.push(tempColors[j].color);
              }
            }
          }
          setSaleFunnelGraphS(tempFunnelData);
          setFunnelColor(tempFunnelColor);
          setTimeout(() => {
            setIsPageLoad(false);
          }, 1000);
        } else {
          setSaleFunnelGraphS([]);
          setIsPageLoad(false);
        }
      }
    } catch (err) {
      console.log(err);
      setIsPageLoad(false);
    }
  };
  const DashboardMapCheckInDetails = async () => {
    try {
      setIsPageLoad(true);
      let fromDate = isCustomDate
        ? customFromDate
        : moment().subtract(filterFromDate, "d").utc().format();
      let toDate = isCustomDate
        ? customToDate
        : moment(new Date()).utc().format();
      const response = await fetchDashboardMapcheckIn(
        fromDate,
        toDate,
        isOrganization,
        selectedUserId,
        selectedTeamId
      );
      if (response && response.status) {
        let resposneData = response.data.data;
        if (resposneData.length > 0) {
          if (Object.values(resposneData[0].extraDetails).length > 0) {
            setMapCheckInData(resposneData);
          } else {
            setMapCheckInData([]);
          }
          setTimeout(() => {
            setIsPageLoad(false);
          }, 1000);
        } else {
          setMapCheckInData([]);
          setIsPageLoad(false);
        }
      }
    } catch (err) {
      setIsPageLoad(false);
      console.log(err);
    }
  };
  const handleTabOnchange = (tab: string) => {
    setTabName(tab);
    DashboardGraph(tab);
  };

  const handleFilteronChange = (date: string) => {
    switch (date) {
      case "today":
        setFilterFromDate(0);
        setFromDate(date);
        setIsCustomDate(false);
        break;
      case "yesterday":
        setFilterFromDate(1);
        setFromDate(date);
        setIsCustomDate(false);
        break;
      case "7d":
        setFilterFromDate(7);
        setFromDate(date);
        setIsCustomDate(false);
        break;
      case "15d":
        setFilterFromDate(15);
        setFromDate(date);
        setIsCustomDate(false);
        break;
      case "30d":
        setFilterFromDate(30);
        setFromDate(date);
        setIsCustomDate(false);
        break;
      case "custom":
        setIsCustomDate(true);
        break;
      default:
        break;
    }
  };

  const selectFilterDate = (e: any) => {
    const { name, value } = e.currentTarget;
    let Form_time = new Date();
    let tempTime = moment(Form_time, "H:mm:ss").format("hh:mm:ss");
    let UtcDate = moment.parseZone(`${value}T${tempTime}`).utc(true).format();
    if (name === "from") {
      setCustomFromDate(UtcDate);
    } else {
      setCustomToDate(UtcDate);
    }
  };

  const selectFilterUser = (e: any, tab: string) => {
    const { value } = e.currentTarget;
    if (tab === "Emp") {
      setSelectedUserId(value);
    } else {
      if (value === "organization") {
        setIsOrganization(true);
      } else {
        setSelectedTeamId(value);
        setIsOrganization(false);
      }
    }
  };
  return (
    <div id="main" className="main">
      <Header />
      <div className="dashboard_header">
        <div className="header_flex">
          <label>Date : </label>
          <select
            name="type"
            className="form-select"
            value={fromDate}
            onChange={(e: any) => handleFilteronChange(e.target.value)}
          >
            {dashboardDates.map((item: any) => (
              <option value={item.value}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="header_flex">
          <label>Team: </label>
          <select
            name="type"
            className="form-select"
            onChange={(e: any) => selectFilterUser(e, "team")}
          >
            <option value="">Select</option>
            {teamData?.map((item: any, t: number) => {
              return (
                <option value={item?._id} key={t}>
                  <label>{item.name} - Team</label>
                </option>
              );
            })}
            {organizationData?.map((item: any, t: number) => {
              return (
                <option value={"organization"} key={t}>
                  <label>{item.name} - Organization</label>
                </option>
              );
            })}
          </select>
        </div>
        <div className="header_flex">
          <label>Employee: </label>
          <select
            name="type"
            className="form-select"
            onChange={(e: any) => selectFilterUser(e, "Emp")}
          >
            <option value="">Select</option>
            {filterUserData?.map((item: any, j: number) => {
              return (
                <option value={item?._id} key={j}>
                  <label>
                    {item.firstName} - {item.TeamName} - {item.RoleName}
                  </label>
                </option>
              );
            })}
          </select>
        </div>
      </div>
      {isCustomDate && (
        <>
          <div className="dashboard_header_row">
            <div className="header_flex">
              <label>From : </label>
              <input
                type="date"
                name="from"
                className="form-to-date"
                placeholder="Select Date"
                onChange={(e) => selectFilterDate(e)}
              />
            </div>
            <div className="header_flex" style={{ marginLeft: "2rem" }}>
              <label>To : </label>
              <input
                type="date"
                name="to"
                className="form-to-date"
                placeholder="Select Date"
                onChange={(e) => selectFilterDate(e)}
              />
            </div>
          </div>
        </>
      )}
      <Spin tip="Loading..." spinning={isPageLoad}>
        <div className="dashboard-section-1">
          <div className="row">
            <ul
              className="nav nav-pills mb-3 justify-content-around d-flex dashboard_cards"
              id="pills-tab"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active px-4 dashboard-section-1-sub-1"
                  id="dashboard-lead-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#dashboard-lead"
                  type="button"
                  role="tab"
                  aria-controls="dashboard-lead"
                  aria-selected="true"
                  onClick={() => handleTabOnchange("lead")}
                >
                  <h1>Leads</h1>
                  <h2>{totalLeadCount}</h2>
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link px-4 dashboard-section-1-sub-1"
                  id="dashboard-Calls-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#dashboard-Calls"
                  type="button"
                  role="tab"
                  aria-controls="dashboard-Calls"
                  aria-selected="false"
                  onClick={() => handleTabOnchange("call")}
                >
                  <h1>Calls</h1>
                  <h2>{totalCallCount}</h2>
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link px-4 dashboard-section-1-sub-1"
                  id="dashboard-Activity-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#dashboard-Activity"
                  type="button"
                  role="tab"
                  aria-controls="dashboard-Activity"
                  aria-selected="false"
                  onClick={() => handleTabOnchange("activity")}
                >
                  <h1>Activity</h1>
                  <h2>{totalActivityCount}</h2>
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link px-4 dashboard-section-1-sub-1"
                  id="dashboard-Sales-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#dashboard-Sales"
                  type="button"
                  role="tab"
                  aria-controls="dashboard-Sales"
                  aria-selected="false"
                  onClick={() => handleTabOnchange("sales")}
                >
                  <h1>Sales</h1>
                  <h2>
                    ₹{" "}
                    {totalSalesCount
                      ? totalSalesCount.toLocaleString("en-IN")
                      : 0}
                  </h2>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="dashboard-lead"
            role="tabpanel"
            aria-labelledby="Calls-tab"
          ></div>
          <div
            className="tab-pane fade"
            id="dashboard-Calls"
            role="tabpanel"
            aria-labelledby="Calls-tab"
          >
            <div className="dashboard-section-2">
              <div className="row">
                <div className="col-md-2 dashboard-section-2-sub-1">
                  <h1>All</h1>
                  <h2>{totalCallCount} Calls</h2>
                </div>
                {callingData?.map((item: any, i: number) => {
                  return (
                    <>
                      {item.type !== "unknown" && (
                        <div
                          className="col-md-2 dashboard-section-2-sub-1"
                          key={i}
                        >
                          <h1>{_.capitalize(item.type)}</h1>
                          <h2>{item.count} Calls</h2>
                        </div>
                      )}
                    </>
                  );
                })}
                <div className="col-md-2 dashboard-section-2-sub-1">
                  <h1>Total Answered</h1>
                  <h2>{callingDetails?.totalCallAnswered} Calls</h2>
                </div>
                <div className="col-md-2 dashboard-section-2-sub-1">
                  <h1>Total Outgoing Talktime</h1>
                  <h2>
                    {callingDetails?.totalOutgoingDuration
                      ? `${getTimeFormat(
                          callingDetails?.totalOutgoingDuration
                        )} Minutes`
                      : `0 Minutes`}
                  </h2>
                </div>
                <div className="col-md-2 dashboard-section-2-sub-1">
                  <h1>Total Incoming Talktime</h1>
                  <h2>
                    {callingDetails?.totalIncomingDuration
                      ? `${getTimeFormat(
                          callingDetails?.totalIncomingDuration
                        )} Minutes`
                      : `0 Minutes`}
                  </h2>
                </div>
                <div className="col-md-2 dashboard-section-2-sub-1">
                  <h1>Total Talktime</h1>
                  <h2>
                    {callingDetails?.totalTalkTime
                      ? `${getTimeFormat(
                          callingDetails?.totalTalkTime
                        )} Minutes`
                      : `0 Minutes`}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="dashboard-Activity"
            role="tabpanel"
            aria-labelledby="Activity-tab"
          >
            <div className="dashboard-section-2">
              <div className="row">
                {activityTypes?.map((item: any, j: number) => {
                  return (
                    <div className="col-md-2 dashboard-section-2-sub-1" key={j}>
                      <h1>{_.capitalize(item.type?.split("_")?.join(" "))}</h1>
                      <h2>{item.count}</h2>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade show active"
            id="dashboard-Sales"
            role="tabpanel"
            aria-labelledby="Calls-tab"
          ></div>
        </div>

        <div className="row dash_area_funnel_chart">
          <div className="col-md-6">
            <div className="dashboard-section-3">
              <div className="dashboard_chart" style={{ height: "294px" }}>
                <h3>
                  {tabName === "lead"
                    ? "Leads"
                    : tabName === "call"
                    ? "Calls"
                    : tabName === "activity"
                    ? "Activity"
                    : tabName === "sales"
                    ? "Sales"
                    : ""}
                </h3>
                {LeadGraphSData?.length > 0 ? (
                  <Chart
                    options={{
                      xaxis: {
                        categories: LeadGraphSData,
                      },
                      chart: {
                        toolbar: {
                          show: false,
                        },
                      },
                    }}
                    series={[
                      {
                        name:
                          tabName === "lead"
                            ? "Leads"
                            : tabName === "call"
                            ? "Calls"
                            : tabName === "activity"
                            ? "Activity"
                            : tabName === "sales"
                            ? "Sales"
                            : "",
                        data: LeadGraphXData,
                      },
                    ]}
                    type="area"
                  />
                ) : (
                  <h2 className="no_data_found">No data found.</h2>
                )}
              </div>
            </div>
            <div className="dashboard-section-3">
              <div className="dashboard_chart" style={{ height: "230px" }}>
                <h3>Leads by source</h3>
                {leadSourceGraphS?.length > 0 ? (
                  <>
                    <div className="chart_x_lbl">
                      {leadSourceGraphX.map((item: number, i: number) => {
                        return <label key={i}> {item} </label>;
                      })}
                    </div>
                    <ReactApexChart
                      options={{
                        chart: {
                          width: 380,
                          type: "pie",
                        },
                        labels: leadSourceGraphS,
                        responsive: [
                          {
                            breakpoint: 480,
                            options: {
                              chart: {
                                width: 200,
                              },
                              legend: {
                                position: "bottom",
                              },
                            },
                          },
                        ],
                        dataLabels: {
                          enabled: true,
                          formatter: function (val: any, opts: any) {
                            const series =
                              opts.w.config.series[opts.seriesIndex];
                            return `${series}`;
                          },
                        },
                      }}
                      series={leadSourceGraphX}
                      type="pie"
                      width={350}
                    />
                  </>
                ) : (
                  <h2 className="no_data_found">No data found.</h2>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="dashboard-section-3">
              <div className="dashboard_chart_1">
                <h3>Sales Funnels</h3>
                {saleFunnelGraphS?.length > 0 ? (
                  <FunnelChart
                    data={saleFunnelGraphS}
                    pallette={funnelColor}
                    getToolTip={(row: any) => {
                      const { value } = row;
                      return `₹ ${value.toLocaleString("en-IN")} Sale value`;
                    }}
                  />
                ) : (
                  <h2 className="no_data_found">No data found.</h2>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-section-4">
          <div className="row">
            <div className="col-md-6">
              <div
                className="dashboard-section-4-sun-1"
                style={{ height: "280px" }}
              >
                <h3>Checkins</h3>
                {mapCheckInData?.length > 0 ? (
                  <>
                    {/* @ts-ignore */}
                    <Mapp mapCheckInData={mapCheckInData} />
                  </>
                ) : (
                  <h2 className="no_data_found">No data found.</h2>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="dashboard-section-3" style={{ height: "280px" }}>
                <div className="dashboard_chart">
                  <h3>Leads by labels</h3>
                  {leadLabelGraphS?.length > 0 ? (
                    <>
                      <div className="chart_y_lbl">
                        {leadLabelGraphX.map((item: number, i: number) => {
                          return <label key={i}> {item} </label>;
                        })}
                      </div>
                      <ReactApexChart
                        options={{
                          chart: {
                            width: 380,
                            type: "pie",
                          },
                          labels: leadLabelGraphS,
                          responsive: [
                            {
                              breakpoint: 480,
                              options: {
                                chart: {
                                  width: 200,
                                },
                                legend: {
                                  position: "bottom",
                                },
                              },
                            },
                          ],
                          colors: leadLabelColors,
                          dataLabels: {
                            enabled: true,
                            formatter: function (val: any, opts: any) {
                              const series =
                                opts.w.config.series[opts.seriesIndex];
                              return `${series}`;
                            },
                          },
                        }}
                        series={leadLabelGraphX}
                        type="pie"
                        width={350}
                      />
                    </>
                  ) : (
                    <h2 className="no_data_found">No data found.</h2>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default Dashboard;
