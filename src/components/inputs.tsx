type PropsType = {
  name: string;
  className: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: any) => void;
  label: string;
  autoComplete: string;
  isRequired: boolean;
  options: any;
  id: string;
};

export default function Inputs(Props: PropsType) {
  const { label, isRequired, ...rest } = Props;

  return (
    <>
      <div>
        <label className="form-label">
          {label} <span className="text-danger">{isRequired && "*"}</span>
        </label>
        {Props.label === "Client Name" ? (
          <img src={"assets/img/person.png"} alt="img" className="form-icons" />
        ) : Props.label === "Email ID" ? (
          <img src={"assets/img/mail.png"} alt="img" className="form-icons" />
        ) : Props.label === "Phone Number" ? (
          <img src={"assets/img/call.png"} alt="img" className="form-icons" />
        ) : Props.label === "Sale Value" ? (
          <img src={"assets/img/rupees.png"} alt="img" className="form-icons" />
        ) : (
          ""
        )}

        {label !== "Notes" ? (
          <>
            {Props.type !== "selection" ? (
              <input {...rest} />
            ) : (
              <select {...rest}>
                <option value="">Select {label}</option>
                {Props.options?.map((type: any, i: number) => (
                  <option value={type} key={i}>
                    {type}
                  </option>
                ))}
              </select>
            )}
          </>
        ) : (
          <textarea style={{ height: "120px" }} {...rest} />
        )}
      </div>
    </>
  );
}
