import React, { PropsWithChildren } from "react";
import _ from "lodash";
import moment from "moment";
interface Props {
  data: Array<{
    _id: string;
    leadname: string;
    createdBy: string;
    assignedTo: Array<string>;
    type: string;
    extra_details: {
      description: string;
    };
  }>;
  handleEditTask: (id: string) => void;
}

const TasksTable: React.FC<PropsWithChildren<Props>> = ({
  data,
  handleEditTask,
}) => {
  return (
    <>
      {data?.length > 0 ? (
        <table className="table table-borderless">
          <thead>
            <tr>
              <th scope="col">Lead Name </th>
              <th scope="col">Task owner </th>
              <th scope="col">Due time</th>
              <th scope="col">Type</th>
              <th scope="col">Assigned to </th>
              <th scope="col">Note </th>
            </tr>
          </thead>
          <tbody>
            {data.map((task: any) => {
              var startTime = new Date(task.toBePerformAt);
              var time1 = task.toBePerformAt;
              let start_time = time1?.split("T")[1]?.split(".")[0];
              let startTimeHour = start_time?.split(":")[0];
              let startTimeMinute = start_time?.split(":")[1];
              startTime?.setHours(startTimeHour);
              startTime?.setMinutes(startTimeMinute);
              return (
                <tr onClick={() => handleEditTask(task?._id)}>
                  <td title={task?.lead[0]?.name}>
                    {task?.lead[0]?.name.length > 20
                      ? task?.lead[0]?.name.substr(0, 20).concat("...")
                      : task?.lead[0]?.name}
                  </td>
                  <td>{task?.createdBy}</td>
                  <td>
                    {moment(task.toBePerformAt).format("DD MMM YYYY")} {" : "}
                    {moment(startTime).format("hh:mm a")}
                  </td>
                  <td>{_.capitalize(task?.type)}</td>
                  <td>{task?.assignedTo[0]?.name || "N/A"}</td>
                  <td title={task.notes}>
                    {task.notes?.length > 35
                      ? task.notes?.substr(0, 35).concat("...")
                      : task.notes}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <h4 style={{ textAlign: "center", margin: "60px",fontFamily:'Gilroy-Regular' }}>No record found</h4>
      )}
    </>
  );
};

export default TasksTable;
