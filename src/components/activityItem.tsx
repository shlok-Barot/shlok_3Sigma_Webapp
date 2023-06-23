import React, { PropsWithChildren } from "react";
import moment from "moment";
import {
  MdDoneAll,
  MdPhoneMissed,
  MdPlace,
  MdSend,
  MdInsertLink,
} from "react-icons/md";
import { TiPhoneOutline, TiVideoOutline } from "react-icons/ti";
import { FiPhoneOutgoing, FiPhoneIncoming } from "react-icons/fi";
import { IoMdCog } from "react-icons/io";
import { IoReload, IoChatbubbleOutline } from "react-icons/io5";
import { HiOutlineMailOpen } from "react-icons/hi";

// interface Props {
//     activity: {
//         createdAt: Date,
//         createdBy: string,
//         createdTimestamp: Date,
//         extraDetails: any,
//         lead: {
//             _id: string,
//             name: string,
//             integrationId: string
//             integrationName: string
//         },
//         performedAt: Date,
//         type: string,
//         _id: string
//     }
// }
interface activityitemI {
  activity: any;
  name: string;
  key: any;
  handleEditModal: (name: string, id: any, action: string) => void;
}
const ActivityItem: React.FC<PropsWithChildren<activityitemI>> = ({
  activity,
  name,
  key,
  handleEditModal,
}) => {
  const activityFormat = (activityType: any, activityData: any) => {
    const activity_types = {
      label_update: `Lead label updated to ${
        activityData?.extraDetails?.prev_label
          ? activityData?.extraDetails?.prev_label
          : "NA"
      }`,
      status_update: `Lead status updated to ${
        activityData?.extraDetails?.prev_status
          ? activityData?.extraDetails?.prev_status
          : "NA"
      }`,
      task_create: `${activityData.extraDetails?.type} : Task created`,
      task_is_complete_update: `${activityData.extraDetails?.type} : Marked as completed`,
      task_due_date_update: `${activityData.extraDetails?.type} : Due date updated`,
      task_assign_update: `${
        activityData.extraDetails?.type
      } : Task assigned to ${
        activityData.extraDetails?.task_assigned_to_name || "NA"
      }`,
      note_create: `Added new note`,
      task_delete: `Task deleted`,
    };
    switch (activityType) {
      case "call":
        return {
          ltCntColor: "#e7efe8",
          ltCntIcon: (
            <TiPhoneOutline
              name={"phone-outline"}
              color={"#15661f"}
              size={40}
            />
          ),
          missedIcon: (
            <MdPhoneMissed name={"phone-missed"} color={"red"} size={40} />
          ),
          outGoingIcon: (
            <FiPhoneOutgoing
              name={"phone-outgoing"}
              color={"#15661f"}
              size={40}
            />
          ),
          incomingIcon: (
            <FiPhoneIncoming
              name={"phone-incoming"}
              color={"#3cb371"}
              size={40}
            />
          ),
          seenText: "was called by you.",
          seenTextClient: "called you",
          missedText: "missed you",
        };
      case "INCOMING":
        return {
          ltCntColor: "#e7efe8",
          ltCntIcon: (
            <FiPhoneOutgoing
              name={"phone-outgoing"}
              color={"#15661f"}
              size={40}
            />
          ),
          seenText: "called you",
        };
      case "checkin":
        return {
          ltCntColor: "#e7efe8",
          ltCntIcon: <MdPlace name={"place"} color={"#15661f"} size={40} />,
          seenText: "You checked in",
        };
      case "checkout":
        return {
          ltCntColor: "#e7efe8",
          ltCntIcon: <MdPlace name={"place"} color={"#15661f"} size={40} />,
          seenText: "You have checked out",
        };
      case "transfer_lead":
        return {
          ltCntColor: "#e7efe8",
          ltCntIcon: (
            <IoMdCog name={"cog-transfer"} color={"#15661f"} size={40} />
          ),
          seenText: "Lead transfered",
        };
      case "OUTGOING":
        return {
          ltCntColor: "#e7efe8",
          ltCntIcon: (
            <FiPhoneIncoming
              name={"phone-incoming"}
              color={"#3cb371"}
              size={40}
            />
          ),

          seenText: "was called by you.",
        };
      case "MISSED":
        return {
          ltCntColor: "#e7efe8",
          ltCntIcon: (
            <MdPhoneMissed name={"phone-missed"} color={"red"} size={40} />
          ),
          seenText: "missed you",
        };
      case "follow_up":
        return {
          ltCntColor: "#fbd9ff",
          ltCntIcon: <IoReload name={"reload"} color={"#ed66ff"} size={40} />,
          seenText: "was followed up by you",
          seenTextClient: "had a follow up with you",
        };
      case "send":
        return {
          ltCntColor: "#d4e4ff",
          ltCntIcon: <MdSend name={"send"} color={"#599aff"} size={40} />,
          seenText: "was send by you",
          seenTextClient: "send you",
        };
      case "email":
        return {
          ltCntColor: "#ffe8f0",
          ltCntIcon: (
            <HiOutlineMailOpen
              name={"email-open-outline"}
              color={"#ff216a"}
              size={40}
            />
          ),
          seenText: "was mailed by you",
          seenTextClient: "mailed you",
        };
      case "message":
        return {
          ltCntColor: "#ffe8f0",
          ltCntIcon: (
            <IoChatbubbleOutline
              name={"chatbubble-outline"}
              color={"#FF216A"}
              size={40}
            />
          ),
          seenText: "was messaged by you",
          seenTextClient: "messaged you",
        };
      case "video_call":
        return {
          // ltCntColor: `${theme.colors.themeCol2}2f`,
          ltCntIcon: (
            <TiVideoOutline
              name={"video-outline"}
              // color={theme.colors.themeCol2}
              size={40}
            />
          ),
          seenText: "was video called by you",
          seenTextClient: "called you",
        };
      case "view":
        return {
          ltCntColor: "#feefe8",
          ltCntIcon: (
            <MdInsertLink
              name={"insert-link"}
              color={"#f16520"}
              size={40}
              //   style={{ transform: [{ rotate: '-45deg' }] }}
            />
          ),
          seenText: "viewed your link",
          seenTextClient: "viewed your link",
        };
      default:
        return activity_types[activityType as keyof Object]
          ? {
              ltCntColor: "#feefe8",
              ltCntIcon: (
                <MdDoneAll name={"done-all"} color={"#f16520"} size={40} />
              ),
              seenText: `${activityData?.type?.replace(/_/g, " ")}`,
              seenTextClient: `${activityData?.type?.replace(/_/g, " ")}`,
            }
          : {
              ltCntColor: "#feefe8",
              ltCntIcon: (
                <MdDoneAll name={"done-all"} color={"#f16520"} size={40} />
              ),
              seenText: `Performed ${activityData?.type?.replace(/_/g, " ")}`,
              seenTextClient: `Performed ${activityData?.type?.replace(
                /_/g,
                " "
              )}`,
            };
    }
  };
  const formatting = activityFormat(activity?.type, activity);

  const TypeData = [
    "INCOMING",
    "OUTGOING",
    "MISSED",
    "checkin",
    "checkout",
    "call",
    "sms",
    "message",
    "transfer_lead",
  ];
  const ShowType =
    TypeData.filter((x: string) => x === activity.type).length > 0
      ? activity.type
      : activity.label !== null
      ? activity.label
      : activity.type;

  const timeFormat = moment.utc(activity.performedAt).toDate();
  return (
    <div className="popup-section-4-right-1 d-flex align-items-center">
      <div
        className="icon-div"
        // style={{
        //   backgroundColor:
        //       activity.type === 'MISSED'
        //         ? '#ffcccb'
        //         : formatting.ltCntColor || formatting.cntColor
        // }}
      >
        {/* {props.data.type == 'share' && formatting.iconType == 'image' && (
              <Image
                style={{
                  width: formatting.width ? formatting.width : '40%',
                  resizeMode: 'contain',
                }}
                source={formatting.icon}
              />
            )} */}
        {/* {activity.type === 'share' &&
          formatting.iconType === 'icon' &&
          formatting.icon} */}
        {[
          "INCOMING",
          "OUTGOING",
          "MISSED",
          "checkin",
          "checkout",
          "call",
          "sms",
          "message",
          "transfer_lead",
        ].includes(activity?.type)
          ? formatting?.ltCntIcon
          : activity?.type === "share"
          ? null
          : formatting?.ltCntIcon}
        {name == "task" && (
          <h6>{" " + moment(activity.performedAt).format("DD MMM")}</h6>
        )}
      </div>
      <h6 className="ms-4" key={key}>
        {/* {activity?.type === 'checkin' && `You have checked in `}
        {activity?.type === 'checkout' && `You have checked out `}
        {activity?.type === 'transfer_lead' &&
          `${activity?.extraDetails?.transfer_by_name} assigned to ${activity?.extraDetails?.transfer_to_name}`} */}
        <h5 className="text-capitalize mb-0 text-black">
          {name === "task" ? (
            <>
              {activity?.type} - {moment(timeFormat).format("hh:mm a")}
            </>
          ) : (
            <>{ShowType}</>
          )}
        </h5>
        <i
          className="bi bi-pencil text-info"
          onClick={() => handleEditModal(name, activity._id, "Edit")}
        ></i>
        {activity?.notes && (
          <h6 className="my-1">Note : {activity?.notes ?? ""}</h6>
        )}
        {/* <br /> */}
        {name === "activity" && (
          <h6 className="">
            {activity?.createdBy && (
              <>
                Created By :
                {activity?.createdBy?.firstName ? (
                  <>
                    {activity?.createdBy?.firstName &&
                    activity?.createdBy?.lastName ? (
                      <>
                        {" " +
                          activity?.createdBy?.firstName +
                          " " +
                          activity?.createdBy?.lastName}
                      </>
                    ) : (
                      <>{" " + activity?.createdBy?.firstName}</>
                    )}
                  </>
                ) : (
                  <>{" " + activity?.createdBy}</>
                )}
                <br />
              </>
            )}
          </h6>
        )}
        {/* At */}
        {name == "task" ? (
          <h6>
            {"Owner : "}
            {activity?.createdBy?.firstName ? (
              <>
                {activity?.createdBy?.firstName &&
                activity?.createdBy?.lastName ? (
                  <>
                    {" " +
                      activity?.createdBy?.firstName +
                      " " +
                      activity?.createdBy?.lastName}
                  </>
                ) : (
                  <>{" " + activity?.createdBy?.firstName}</>
                )}
              </>
            ) : (
              <>{" " + activity?.createdBy}</>
            )}
          </h6>
        ) : (
          <h6>
            {" " + moment(activity.performedAt).format("DD MMM YYYY")} {" - "}
            {moment(timeFormat).format("hh:mm a")}
          </h6>
        )}
      </h6>
      {activity?.extraDetails && activity?.extraDetails?.notes ? (
        <p>Note: {activity?.extraDetails?.notes}</p>
      ) : null}
    </div>
  );
};

export default ActivityItem;
