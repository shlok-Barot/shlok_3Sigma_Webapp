import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ConfirmationModal from "../../components/confirmationModal";
import CreateTaskForm from "../../components/createTaskForm";
import DrawerComponent from "../../components/drawer";
import Header from "../../components/header";
import TasksTable from "../../components/tasksTable";
import { getAllFollowUps, taskById } from "../../services/followupService";
import { deleteTask } from "../../services/taskService";
import InfiniteScroll from "react-infinite-scroll-component";
import "./follwups.scss";

const FollowUps: React.FC = () => {
  const [todayTask, setTodayTask] = useState([]);
  const [overdueTask, setOverdueTask] = useState([]);
  const [upcomingTask, setUpcomingTask] = useState([]);
  const [completedTask, setCompletedTask] = useState([]);
  const [status, setStatus] = useState("today");
  const [openWithHeader, setOpenWithHeader] = React.useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [action, setAction] = React.useState<string>("");
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [updateTaskValue, setUpdateTaskValue] = useState<any>({});
  const [taskTabCount, setTaskTabCount] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const fetchTaskStatusFollowUps = async () => {
    let params = {
      orderBy: "_id",
      isAscending: false,
      page: 1,
      perPage: 10,
      status: status,
    };
    const response = await getAllFollowUps(params);
    if (response && response.status) {
      let responseData = response?.data;
      setTotalTasks(responseData.data?.length);
      setCurrentPage(1);
      setTaskTabCount(responseData.aggregation);
      if (status === "today") {
        setTodayTask(responseData.data);
      } else if (status === "upcoming") {
        setUpcomingTask(responseData.data);
      } else if (status === "overdue") {
        setOverdueTask(responseData.data);
      } else {
        setCompletedTask(responseData.data);
      }
    }
  };
  const fetchTaskStatusOnScroll = async (tab: string) => {
    if (tab === status) {
      setIsLoading(true);
      let increasePage = currentPage;
      if (increasePage === currentPage) {
        increasePage = increasePage + 1;
      }
      let params = {
        orderBy: "_id",
        isAscending: false,
        page: increasePage,
        perPage: 10,
        status: status,
      };
      const response = await getAllFollowUps(params);
      if (response && response.status) {
        let responseData = response?.data;
        let tempArray: any = [];
        if (status === "today") {
          tempArray = [...todayTask];
          tempArray.push.apply(tempArray, responseData.data);
          setTodayTask(tempArray);
        } else if (status === "upcoming") {
          tempArray = [...upcomingTask];
          tempArray.push.apply(tempArray, responseData.data);
          setUpcomingTask(tempArray);
        } else if (status === "overdue") {
          tempArray = [...overdueTask];
          tempArray.push.apply(tempArray, responseData.data);
          setOverdueTask(tempArray);
        } else {
          tempArray = [...completedTask];
          tempArray.push.apply(tempArray, responseData.data);
          setCompletedTask(tempArray);
        }
        setCurrentPage(increasePage);
        setIsLoading(false);
        setTotalTasks(tempArray?.length);
        setTaskTabCount(responseData.aggregation);
      }
    }
  };

  useEffect(() => {
    fetchTaskStatusFollowUps();
  }, [status]);

  const onStatusChange = (status: string) => {
    setStatus(status);
  };

  const toggleDrawer = (action: React.SetStateAction<string>) => {
    setOpenWithHeader(true);
    setAction(action);
  };

  const onTaskDelete = (id: any) => {
    setShowConfirmationModal(true);
    setSelectedTask(id);
  };

  const toggleModal = () => {
    setShowConfirmationModal(!showConfirmationModal);
  };

  const onConfirmation = async () => {
    try {
      const response = await deleteTask(selectedTask);
      if (response && response.status) {
        toast.success(response?.data?.message);
        fetchTaskStatusFollowUps();
      }
    } catch (err) {
      toast.error("Error while deleting task!");
    }
    setShowConfirmationModal(false);
    setOpenWithHeader(false);
  };
  const handleEditTask = async (_id: any) => {
    try {
      const response = await taskById(_id);
      if (response && response.status) {
        setUpdateTaskValue(response.data.data);
        toggleDrawer("edit");
      }
    } catch (err) {
      toast.error("error while fetching activity data.");
    }
  };

  return (
    <div id="main" className="main">
      <Header />
      <section className="content-section-1">
        <div className="row">
          <div className="col-md-12">
            <ul
              className="nav nav-pills mb-3 content-section-1-sub-1 justify-content-around d-flex"
              id="pills-tab"
              role="tablist"
            >
              <li
                onClick={() => onStatusChange("today")}
                className="nav-item"
                role="presentation"
              >
                <button
                  className="nav-link active px-4"
                  id="pills-duetoday-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-duetoday"
                  type="button"
                  role="tab"
                  aria-controls="pills-duetoday"
                  aria-selected="true"
                >
                  Today ({taskTabCount.today})
                </button>
              </li>
              <li
                onClick={() => onStatusChange("upcoming")}
                className="nav-item"
                role="presentation"
              >
                <button
                  className="nav-link px-4"
                  id="pills-upcoming-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-upcoming"
                  type="button"
                  role="tab"
                  aria-controls="pills-upcoming"
                  aria-selected="false"
                >
                  Upcoming ({taskTabCount.upcoming})
                </button>
              </li>
              <li
                onClick={() => onStatusChange("overdue")}
                className="nav-item"
                role="presentation"
              >
                <button
                  className="nav-link px-4"
                  id="pills-overdue-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-overdue"
                  type="button"
                  role="tab"
                  aria-controls="pills-overdue"
                  aria-selected="false"
                >
                  Overdue ({taskTabCount.overdue})
                </button>
              </li>
              <li
                onClick={() => onStatusChange("completed")}
                className="nav-item"
                role="presentation"
              >
                <button
                  className="nav-link px-4"
                  id="pills-completed-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-completed"
                  type="button"
                  role="tab"
                  aria-controls="pills-completed"
                  aria-selected="false"
                >
                  Done ({taskTabCount.completed})
                </button>
              </li>
              {/* <div className="d-flex">
                <li className="me-3">
                  <div
                    style={{
                      backgroundColor: "#EBF0F4",
                      borderRadius: "5px",
                      height: "34px",
                    }}
                    className="p-2"
                  >
                    <img
                      alt="img"
                      //   onClick={toggleLeadFilterDrawer}
                      src="assets/img/filterBlack.png"
                      title="filter"
                      id="filter-img"
                      className="cursor-pointer "
                    />
                  </div>
                </li>
                <li>
                  <div
                    style={{
                      backgroundColor: "#EBF0F4",
                      borderRadius: "5px",
                      height: "34px",
                    }}
                    className="p-2"
                  >
                    <span
                      //   onClick={() => getLeads()}
                      className="text-black fw-bold cursor-pointer bi bi-arrow-clockwise"
                      style={{ height: "37px" }}
                    ></span>
                  </div>
                </li>
              </div> */}
            </ul>
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="pills-duetoday"
                role="tabpanel"
                aria-labelledby="duetoday-tab"
              >
                {/* @ts-ignore */}
                <InfiniteScroll
                  dataLength={totalTasks}
                  next={() => fetchTaskStatusOnScroll("today")}
                  hasMore={true}
                  loader={isLoading ? <h4>Loading...</h4> : null}
                >
                  <div className="followups-section-1">
                    <TasksTable
                      data={todayTask}
                      handleEditTask={handleEditTask}
                    />
                  </div>
                </InfiniteScroll>
              </div>
              <div
                className="tab-pane fade"
                id="pills-upcoming"
                role="tabpanel"
                aria-labelledby="upcoming-tab"
              >
                {/* @ts-ignore */}
                <InfiniteScroll
                  dataLength={totalTasks}
                  next={() => fetchTaskStatusOnScroll("upcoming")}
                  hasMore={true}
                  loader={isLoading ? <h4>Loading...</h4> : null}
                >
                  <div className="followups-section-1">
                    <TasksTable
                      data={upcomingTask}
                      handleEditTask={handleEditTask}
                    />
                  </div>
                </InfiniteScroll>
              </div>
              <div
                className="tab-pane fade"
                id="pills-overdue"
                role="tabpanel"
                aria-labelledby="overdue-tab"
              >
                {/* @ts-ignore */}
                <InfiniteScroll
                  dataLength={totalTasks}
                  next={() => fetchTaskStatusOnScroll("overdue")}
                  hasMore={true}
                  loader={isLoading ? <h4>Loading...</h4> : null}
                >
                  <div className="followups-section-1">
                    <TasksTable
                      data={overdueTask}
                      handleEditTask={handleEditTask}
                    />
                  </div>
                </InfiniteScroll>
              </div>
              <div
                className="tab-pane fade"
                id="pills-completed"
                role="tabpanel"
                aria-labelledby="completed-tab"
              >
                {/* @ts-ignore */}
                <InfiniteScroll
                  dataLength={totalTasks}
                  next={() => fetchTaskStatusOnScroll("completed")}
                  hasMore={true}
                  loader={isLoading ? <h4>Loading...</h4> : null}
                >
                  <div className="followups-section-1">
                    <TasksTable
                      data={completedTask}
                      handleEditTask={handleEditTask}
                    />
                  </div>
                </InfiniteScroll>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="addmessagesicon">
            <i
              className="bi bi-plus-circle-fill"
              onClick={() => toggleDrawer("add")}
            ></i>
          </div>
        </div>
        <DrawerComponent
          openWithHeader={openWithHeader}
          setOpenWithHeader={setOpenWithHeader}
          drawerTitle={action === "add" ? "Add Task" : "Edit Task"}
          size="sm"
        >
          <CreateTaskForm
            updateTaskValue={updateTaskValue}
            action={action}
            status={status}
            drawerClose={() => setOpenWithHeader(false)}
            onTaskDelete={onTaskDelete}
            fetchTaskStatusFollowUps={fetchTaskStatusFollowUps}
          />
        </DrawerComponent>
        <ConfirmationModal
          message="Are you sure you want to delete this task?"
          onConfirmation={onConfirmation}
          showModal={showConfirmationModal}
          toggleModal={toggleModal}
          title="Task"
        />
      </section>
      <Toaster />
    </div>
  );
};

export default FollowUps;
