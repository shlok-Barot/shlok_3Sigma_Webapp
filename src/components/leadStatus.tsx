import React, { PropsWithChildren } from "react";

interface Props {
  status: Array<any>;
  preferences: {
    status: Array<{
      value: string;
      name: string;
      color: string;
    }>;
  };
}

const LeadStatus = ({ status, isTag = false }: any) => {
  const leadStatus = JSON.parse(
    localStorage.getItem("user_preferences") || ""
  )?.status?.filter((item: { value: any }) => status?.includes(item?.value));
  const txtColor = "#fff";

  return (
    <div className="">
      {leadStatus &&
        leadStatus?.map((status: any) =>
          isTag ? (
            <div
              style={{
                backgroundColor: status?.color,
                color: txtColor,
                borderRadius: "10px",
                fontFamily: "Gilroy-Regular",
              }}
              className="p-1 px-2 fitContant"
            >
              {status?.name}
            </div>
          ) : (
            <>{status?.name}</>
          )
        )}
    </div>
  );
};

export default LeadStatus;

{
  /* style={{ backgroundColor: status?.color, color: txtColor }} */
}
