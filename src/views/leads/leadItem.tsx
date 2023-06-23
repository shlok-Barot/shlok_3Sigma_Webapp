import React, { PropsWithChildren } from "react";
import moment from "moment";
import ContactLinksGenerator from "../../utils/contactlinksgenerator";
import LeadStatus from "../../components/leadStatus";
import { useSelector } from "react-redux";
import LeadLabel from "../../components/leadLabel";

interface Props {
  id: string;
  name: string;
  integration_name: string;
  created_at: Date;
  status: Array<string>;
  labels: Array<string>;
  email: string;
  phone: string;
  handleLeadClick: any;
  editLead: (e: any, id: any) => void;
  removeLead: (e: any, id: any) => void;
}

interface PreferenceI {
  status: Array<any>;
  labels: Array<any>;
}
const LeadItem: React.FC<PropsWithChildren<Props>> = (props) => {
  const {
    id,
    name,
    integration_name,
    created_at,
    status,
    labels,
    email,
    phone,
    handleLeadClick,
    editLead,
    removeLead,
  } = props;
  const contactObj = new ContactLinksGenerator({
    number: phone,
    email: email,
  });
  const preferences: PreferenceI = useSelector(
    (state: { rootReducers: { user: { userPreferences: any } } }) =>
      state?.rootReducers?.user?.userPreferences
  );

  return (
    <div
      key={id}
      onClick={() => handleLeadClick(id)}
      className="leads-section-3"
    >
      <div className="row leads-section-3-1">
        <div className="col-md-3">
          <div className="leads-section-23-sub-1 text-black">
            <h5 title={name}>
              {name.length > 16 ? name.substr(0, 16).concat("...") : name}
            </h5>
            <p>
              {integration_name ? "Added via " + integration_name : "Added "}{" "}
              {moment(created_at).format("Do MMM YYYY")} at{" "}
              {moment(created_at).format("hh:mm A")}
            </p>
          </div>
        </div>
        <div className="col-md-3 ">
          <div className="leads-section-3-sub-1-2">
            <ul>
              <li>
                {phone ? (
                  <a onClick={(e) => e.stopPropagation()} href={contactObj.tel}>
                    <img alt="tel" src="assets/img/telephone.png" />
                  </a>
                ) : (
                  <a onClick={(e) => e.stopPropagation()}>
                    <img alt="tel" src="assets/img/greyPhone.png" />
                  </a>
                )}
              </li>
              <li>
                {email ? (
                  <a
                    onClick={(e) => e.stopPropagation()}
                    href={contactObj.mail}
                  >
                    <img alt="mail" src={"assets/img/email.png"} />
                  </a>
                ) : (
                  <a onClick={(e) => e.stopPropagation()}>
                    <img alt="mail" src={"assets/img/greyEmail.png"} />
                  </a>
                )}
              </li>
              <li>
                <a
                  onClick={(e) => e.stopPropagation()}
                  href={contactObj.whatsapp}
                >
                  <img alt="wp" src="assets/img/whatsapp.png" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-3 ">
          <LeadStatus preferences={preferences} status={status} isTag={true} />
        </div>
        <div className="col-md-3 ">
          <LeadLabel preferences={preferences} label={labels} isTag={true} />
        </div>
        <div className="col-md-2">
                    {/* <i onClick={(e) => editLead(e, id)} className="bi bi-pencil text-info mx-3"></i> */}
                    {/* <i onClick={(e) => removeLead(e, id)} className='bi bi-trash text-danger mx-3'></i> */}
                </div>
      </div>
    </div>
  );
};

export default LeadItem;
