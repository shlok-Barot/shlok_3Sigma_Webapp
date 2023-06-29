import React, { useState } from "react";
import * as yup from "yup";
import update from "immutability-helper";
// import { updateProfile } from '../../services/authServices';
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/config";
import axios from "axios";
export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  companyName: string;
  category: string;
  teamSize: string;
}

const Signup: React.FC = () => {
  const [signupData, setSignupData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: localStorage.getItem("email") || "",
    phone: localStorage.getItem("phone") || "",
    countryCode: localStorage.getItem("countryCode") || "",
    companyName: "",
    category: "",
    teamSize: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    category: "",
    teamSize: "",
  });
  console.log("errors", errors);
  const navigate = useNavigate();
  const regExp = /\b\d{10}\b/;

  let schema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    // lastName: yup.string().required("Last Name is required"),
    email: yup.string().email("Email is invalid").required("Email is required"),
    phone: yup.string().required("Mobile Number is Required").matches(regExp, {
      message: "Mobile Number is not valid",
      excludeEmptyString: true,
    }),
    companyName: yup.string().required("Company Name is required"),
    // category: yup.string().required("Category is required"),
    teamSize: yup.string().required("Team size is required"),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.currentTarget;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormValid = await schema.isValid(signupData, {
      abortEarly: false, // Prevent aborting validation after first error
    });
    if (isFormValid) {
      try {
        const API_ENDPOINT = API_URL + "api/v1";
        let data = {
          profile: {
            firstName: signupData?.firstName,
            // lastName: signupData?.lastName,
            countryCode: signupData?.countryCode,
            phone: signupData?.phone,
            email: signupData?.email,
          },
          organization: {
            name: signupData?.companyName,
            teamSize: signupData?.teamSize,
          },
        };
        let localData: any = localStorage.getItem("userData");

        let header = {
          headers: {
            Authorization: JSON.parse(localData)?.token,
          },
        };

        axios
          .post(`${API_ENDPOINT}/user/onboard`, data, header)
          .then((response) => {
            console.log("response", response);
            toast.success(response?.data?.message);
            navigate("/dashboard", { replace: true });
          })
          .catch((err) => {
            console.log("error", err);
            toast.error(err?.response?.data?.message);
          });
        // const response = await updateProfile({
        //     firstName: signupData?.firstName,
        //     lastName: signupData?.lastName,
        //     phone: signupData?.phone,
        //     email: signupData?.email
        // });
        // if (response && response.status) {
        //     toast.success(response?.data?.message);
        //     navigate("/dashboard", { replace: true });
        // }
      } catch (err) {
        toast.error("error while updating profile!");
      }
      // localStorage.removeItem('email');
    } else {
      schema.validate(signupData, { abortEarly: false }).catch((err) => {
        const errors = err.inner.reduce(
          (acc: any, error: { path: string; message: string }) => {
            return {
              ...acc,
              [error.path]: error.message,
            };
          },
          {}
        );

        setErrors((prevErrors) =>
          update(prevErrors, {
            $set: errors,
          })
        );
      });
    }
  };

  return (
    <div className="container">
      <Toaster />
      <div className="row justify-content-center login_section sign_up">
        <div className="col-12 col-md-6 col-lg-5 col-xl-5 mt-2 login_card">
          <div className="login-card card">
            <div className="d-flex flex-column align-items-center">
              {/* <img alt="logo" src="assets/img/3sigma_logo.png" className="mt-2 logo" /> */}
              <div className="login-header text-center mt-3">
                <h2>Get started with 3sigma CRM</h2>
                <p>Please complete your profile to continue</p>
              </div>
              <form onSubmit={(e) => handleSubmit(e)} className="signup_form">
                <div className="form-container w-100">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      name="firstName"
                      className="form-control"
                      type="text"
                      placeholder=""
                      onChange={(val) => handleChange(val)}
                      value={signupData?.firstName}
                    />
                    {errors.firstName && (
                      <small className="text-danger mb-3 ps-0">
                        {errors?.firstName}
                      </small>
                    )}
                  </div>
                  {/* <div className="form-group">
                    <label>Last Name</label>
                    <input
                      name="lastName"
                      className="form-control"
                      type="text"
                      placeholder="Enter last name"
                      onChange={(val) => handleChange(val)}
                      value={signupData?.lastName}
                    />
                    {errors.lastName && (
                      <small className="text-danger mb-3 ps-0">
                        {errors?.lastName}
                      </small>
                    )}
                  </div> */}
                  {localStorage.getItem("phone") && (
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        name="email"
                        className="form-control"
                        type="text"
                        placeholder="Enter Email"
                        onChange={(val) => handleChange(val)}
                        value={signupData?.email}
                      />
                      {errors.email && (
                        <small className="text-danger mb-3 ps-0">
                          {errors?.email}
                        </small>
                      )}
                    </div>
                  )}
                  {localStorage.getItem("email") && (
                    <div className="form-group">
                      <label>Mobile Number</label>
                      <input
                        name="phone"
                        className="form-control"
                        type="text"
                        placeholder="Enter Mobile Number"
                        onChange={(val) => handleChange(val)}
                        value={signupData?.phone}
                      />
                      {errors.phone && (
                        <small className="text-danger mb-3 ps-0">
                          {errors?.phone}
                        </small>
                      )}
                    </div>
                  )}
                  <div className="form-group">
                    <label>Organisation name</label>
                    <input
                      name="companyName"
                      className="form-control"
                      type="text"
                      placeholder=""
                      onChange={(val) => handleChange(val)}
                      value={signupData?.companyName}
                    />
                    {errors.companyName && (
                      <small className="text-danger mb-3 ps-0">
                        {errors?.companyName}
                      </small>
                    )}
                  </div>
                  {/* <div className="form-group">
                    <label>Category</label>
                    <select
                      name="category"
                      className="form-control"
                      onChange={(val) => handleChange(val)}
                      value={signupData?.category}
                    >
                       <option value=""></option>
                      <option value="cat 1">real estate</option>
                      <option value="cat 2">service providers</option>
                      <option value="cat 3">consulting</option>
                      <option value="cat 3">trading</option>
                      <option value="cat 3">education</option>
                      <option value="cat 3">healthcare</option>
                      <option value="cat 3">marketing agency</option>
                      <option value="cat 3">software/IT</option>
                      <option value="cat 3">Finance/IT</option>
                      <option value="cat 3">Telemarketing</option>
                      <option value="cat 3">others</option>
                    </select>
                    {errors.category && (
                      <small className="text-danger mb-3 ps-0">
                        {errors?.category}
                      </small>
                    )}
                  </div> */}
                  <div className="form-group">
                    <label>Team size</label>
                    <select
                      name="teamSize"
                      className="form-control"
                      onChange={(val) => handleChange(val)}
                      value={signupData?.teamSize}
                    >
                      <option value=""></option>
                      <option value="1">Just me</option>
                      <option value="5">2-5</option>
                      <option value="10">6-10</option>
                      <option value="20">10-20</option>
                      <option value="50">20+</option>
                    </select>
                    {errors.teamSize && (
                      <small className="text-danger mb-3 ps-0">
                        {errors?.teamSize}
                      </small>
                    )}
                  </div>
                  {/* {
                                    validationError ?
                                        <small className='text-danger mb-3 ps-0'>Mobile Number is not valid</small>
                                        : false
                                } */}

                  <button
                    style={{ backgroundColor: "#3A4B86" }}
                    type="submit"
                    className="btn btn-dark login-btn w-100 mt-3"
                  >
                    Let’s Go{" "}
                    <span className="bi bi-arrow-right-circle-fill"></span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
