import React, { PropsWithChildren } from "react";
import moment from "moment";
import copy from "copy-to-clipboard";
import toast, { Toaster } from "react-hot-toast";
interface leadNoteItemI {
  activity: any;
  key: any;
}
const LeadNoteItems: React.FC<PropsWithChildren<leadNoteItemI>> = ({
  activity,
  key,
}) => {

  const full_name =
    activity?.createdBy?.firstName && activity?.createdBy?.lastName
      ? activity?.createdBy?.firstName + " " + activity?.createdBy?.lastName
      : activity?.createdBy?.firstName;

  const timeFormat = moment.utc(activity.createdAt).toDate();
const copyData =()=>{
  copy(activity?.description);
  toast.success("Notes Copied to Clipboard");
}
  return (
    <div className="popup-section-4-right-1 d-flex align-items-center">
      <h6 className="ms-4-notes" key={key}>
        <div className="icon_div_copy">
          <img alt="email" src="assets/img/copy.png" height={30} width={30} onClick={copyData} />
        </div>
        {activity?.description && (
          <h6 className="my-1">{activity?.description ?? ""}</h6>
        )}
        <div className="lead_note_name_date">
          <h6>
            {activity?.createdBy && (
              <>
                Created by :
                {full_name ? (
                  <>{" " + full_name}</>
                ) : (
                  <>{" " + activity?.createdBy}</>
                )}
                <br />
              </>
            )}
          </h6>
          <h6>
            {" " + moment(activity.createdAt).format("DD MMM YYYY")} {" - "}
            {moment(timeFormat).format("hh:mm A")}
          </h6>
        </div>
      </h6>
      <Toaster />
    </div>
  );
};

export default LeadNoteItems;
