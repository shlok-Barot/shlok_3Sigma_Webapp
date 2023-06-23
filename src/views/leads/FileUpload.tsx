import React, { PropsWithChildren, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";

interface leadFileUploadI {
  onLeadFileUpload: (e: any) => void;
  StateData: any;
}
const FileUpload: React.FC<PropsWithChildren<leadFileUploadI>> = ({
  onLeadFileUpload,
  StateData,
}) => {
  const [fileList, setFileList] = useState<any>([]);
  const StoreData = useSelector((state: any) => {
    return state?.rootReducers;
  });
  useEffect(() => {
    let tempArray = StoreData?.leadFile?.leadFile;
    let tempUserDetails = StoreData?.userData?.userDetails;
    const mergedArray = tempArray?.map((obj1: any) => {
      const matchingObjTeam = tempUserDetails?.organizationEmployee?.find(
        (obj2: any) => obj2._id === obj1.uploadedBy
      );

      let full_name = matchingObjTeam?.lastName
        ? matchingObjTeam?.firstName + " " + matchingObjTeam?.lastName
        : matchingObjTeam?.firstName;
      let temp_obj = {
        Fullname: full_name,
        bucketUrl: StoreData?.userData?.userDetails?.bucketUrl,
      };
      if (matchingObjTeam) {
        return { ...obj1, ...temp_obj };
      }
      return obj1;
    });

    setFileList(mergedArray);
  }, [StateData]);
  const donwloadFile = (file: any, filename: string) => {
    fetch(file)
      .then((response) => response.blob())
      .then((blob) => {
        const blobURL = window.URL.createObjectURL(new Blob([blob]));
        const aTag = document.createElement("a");
        aTag.href = blobURL;
        aTag.setAttribute("download", filename);
        document.body.appendChild(aTag);
        aTag.click();
        aTag.remove();
      });
  };
  return (
    <>
      <div className="text-end">
        <div className="d-flex w-100 d-flex justify-content-end">
          <div
            className="popup-section-file btn btn-dark LeadsFilterApply px-3 w-auto"
            style={{ background: "#3faefd" }}
          >
            {/* <i className="bi bi-upload"></i>  */}
            <span className="text-white">
              <i className="fa fa-upload me-2" aria-hidden="true"></i> Upload
              file
            </span>
            <input
              onChange={(e: any) => onLeadFileUpload(e)}
              type="file"
              name="file"
              // accept=".csv"
            />
          </div>
        </div>
      </div>

      {fileList?.map((item: any) => {
        let extension = item.fileName?.split(".")?.pop();
        return (
          <>
            <div
              className="d-flex justify-content-between align-items-center bg-white my-2 "
              style={{ borderRadius: "15px" }}
            >
              <div className="d-flex justify-content-around p-3">
                <div className="ms-2">
                  <img
                    alt="file"
                    src={
                      extension === "jpeg" ||
                      extension === "jpg" ||
                      extension === "png"
                        ? "assets/img/gallery.png"
                        : extension === "pdf"
                        ? "assets/img/pdf.png"
                        : "assets/img/files.png"
                    }
                    height={25}
                    width={30}
                    className="mt-1"
                  />
                </div>
                <div className="ms-3">
                  <h6>{item?.fileName}</h6>
                  <p>
                    {item?.fileSize} -
                    {moment(item?.uploadedAt).format("DD MMM YYYY")}
                  </p>
                  <p className="p-0 m-0">Created By : {item?.Fullname}</p>
                </div>
              </div>
              <div>
                <i
                  className="fa fa-download cursor-pointer me-4"
                  style={{ fontSize: "20px" }}
                  aria-hidden="true"
                  onClick={() =>
                    donwloadFile(item.bucketUrl + item.filePath, item?.fileName)
                  }
                ></i>
              </div>
            </div>
          </>
        );
      })}
    </>
  );
};

export default FileUpload;
