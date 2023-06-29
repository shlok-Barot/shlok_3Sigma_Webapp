import React, { PropsWithChildren, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createNewNote } from "../services/noteService";
import ErrorText from "./errorText";
import { useDispatch, useSelector } from "react-redux";
import { setNote } from "../actions/actions";
interface Props {
  leadIds: Array<{ id: string | undefined }>;
  modalId: string;
}

const CreateNoteForm: React.FC<PropsWithChildren<Props>> = ({
  leadIds,
  modalId,
}) => {
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<{ note: string }>({
    note: "",
  });

  const dispatch = useDispatch();
  const StateData = useSelector((state: any) => {
    return state?.rootReducers?.note?.notes;
  });
  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setErrors({ note: "" });
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (message === "") {
      setErrors({
        note: "Note is required.",
      });
    } else {
      try {
        const response = await createNewNote({
          lead: leadIds[0]?.id,
          description: message,
        });
        if (response && response.status) {
          const responseData = response?.data;
          const tempArray = [...StateData];
          tempArray?.unshift(responseData?.data);
          dispatch(setNote(tempArray));
          setMessage("")
          toast.success(responseData?.message);
        }
      } catch (err) {
        toast.error("error while creating new note!");
      }
      $(modalId).modal("hide");
    }
  };

  return (
    <>
      <form id="LeadsFilterForm">
        <div className="modal-body">
          <div className="row">
            <div className="col-12">
              <label className="form-label">Note</label>
              <textarea
                className="form-control"
                // style={{ height: "100px" }}
                rows={4}
                cols={50}
                placeholder="Enter Your Note"
                onChange={(e) => onTextChange(e)}
                value={message}
              />
              {errors.note && errors.note ? (
                <ErrorText message={errors.note} />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn LeadsFilterApply"
            onClick={(e) => handleSubmit(e)}
          >
            Add Notes
          </button>
        </div>
      </form>
      <Toaster />
    </>
  );
};

export default CreateNoteForm;
