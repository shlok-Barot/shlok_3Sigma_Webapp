import React, { PropsWithChildren } from "react";

interface Props {
  label: Array<any>;
  preferences: {
    labels: Array<{
      value: string;
      name: string;
      color: string;
    }>;
  };
}

const LeadLabel = ({ label, isTag = false }: any) => {
  const leadLabelsData = JSON.parse(
    localStorage.getItem("user_preferences") || ""
  )?.labels?.filter((item: { value: any }) => label?.includes(item.value));

  return (
    <>
      <div className="d-flex">
        {isTag ? (
          <>
            {leadLabelsData &&
              leadLabelsData?.map((status: any, i: number) => (
                <>
                  {i < 1 ? (
                    <div
                      style={{
                        backgroundColor: status?.color,
                        color: "white",
                        borderRadius: "10px",
                        fontFamily: "Gilroy-Regular",
                      }}
                      key={i}
                      className="p-1 px-2 fitContant me-2"
                    >
                      {status?.name}
                    </div>
                  ) : (
                    i < 2 && (
                      <div
                        style={{
                          backgroundColor: status?.color,
                          color: "white",
                          borderRadius: "10px",
                          fontFamily: "Gilroy-Regular",
                        }}
                        key={i}
                        className="p-1 px-2 fitContant me-2"
                      >
                        {`${status?.name} ${leadLabelsData.length - 2} Others`}
                      </div>
                    )
                  )}
                </>
              ))}
          </>
        ) : (
          <div className="me-2">
            {leadLabelsData.map((data: any) => data.name).join(", ")}
          </div>
        )}
      </div>
    </>
    // <div className="leads-section-3-sub-1-4">
    //     <ul>
    //         {/* {leadLabelsData.map(labelData => <li className='mt-2' style={{ backgroundColor: labelData.color, color: getContrastYIQ(labelData.color) }}>{labelData.name}</li>)} */}
    //         {leadLabelsData?.map((labelData: { color: any; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }, index: number) => (
    //             index < 3 && (
    //                 <li className='mt-2 badge p-1 pe-2 ps-2' style={{ backgroundColor: labelData?.color, color: '#fff' }}>{labelData.name}</li>
    //             )
    //         ))
    //         }
    //         {leadLabelsData?.length > 3 ? (
    //             <li className='mt-2 badge p-1 pe-2 ps-2' style={{ backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(255, 255, 255)' }} > +{leadLabelsData.length - 3} other labels
    //             </li>
    //         ) : null}
    //     </ul>
    // </div >
  );
};

export default LeadLabel;
