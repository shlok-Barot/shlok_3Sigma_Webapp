import React, { useCallback, useEffect, useState, useMemo } from "react";
import OtpInput from "react-otp-input";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setLogId } from "../../actions/actions";
import Timer from "../../components/timer";
import { generateOtp, signIn } from "../../services/authServices";
import { getUserPreferences } from "../../services/userService";
import { useCountdown } from "../../utils/countdown";
import {
  userPreferences,
  setUserDetails,
  setCustomSource,
} from "../../actions/actions";

export const OtpVerification = () => {
  const [otp, setOTP] = useState<string>("");
  const [verifying_otp, setVerifyOtp] = useState(false);
  const [otp_verify_error, setOtpVerifyError] = useState(false);
  const logId = useSelector(
    (state: { rootReducers: { logId: { logId: string } } }) =>
      state?.rootReducers?.logId?.logId
  );
  const currentTime = new Date().getTime();
  const timeAfterOneSecond = currentTime + 1 * 60 * 1000;
  const [minutes, seconds] = useCountdown(timeAfterOneSecond);
  const [flag, setFlag] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useMemo(() => {
    if (minutes + seconds <= 0) {
      setFlag(true);
    }
  }, [minutes, seconds]);

  function makeId(length: number) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const handleClick = useCallback(async () => {
    var pattern = /^\d{6}$/;
    if (!pattern.test(otp)) {
      setOtpVerifyError(true);
    } else {
      setVerifyOtp(true);
      let data: any = {
        loginType: "phone",
        loggedFrom: "web",
        deviceToken: "abc",
        countryCode: localStorage.getItem("countryCode"),
        phone: localStorage.getItem("phone"),
        otp: otp,
      };

      try {
        const response = await signIn(data);
        if (response && response.status) {
          if (response?.data?.data?.isSubscriptionActive) {
            if (response?.data?.data?.isOnboardCompleted) {
              localStorage.setItem("auth_token", response?.data?.data?.token);
              localStorage.setItem(
                "userData",
                JSON.stringify(response?.data?.data)
              );
              localStorage.setItem(
                "user_preferences",
                JSON.stringify(response.data.data.userPreference)
              );
              dispatch(setUserDetails(response?.data?.data));
              dispatch(userPreferences(response.data.data.userPreference));
              dispatch(
                setCustomSource(response.data.data.userPreference.customSource)
              );
              // const resp = await getUserPreferences();
              // if (resp && resp.status) {
              //   localStorage.setItem(
              //     "user_preferences",
              //     JSON.stringify(resp?.data?.data)
              //   );
              //   dispatch(userPreferences(resp?.data?.data));
              // }
              toast.success("Logged In Successfully!");
              navigate("/dashboard", { replace: true });
            } else {
              navigate("/sign-up", { replace: true });
            }
          } else {
            setVerifyOtp(false);
            navigate("/", { replace: true });
            toast.error("Your subscription is inactive.");
          }
        }
      } catch (err) {
        setVerifyOtp(false);
        toast.error("Error occured while logging in!");
      }
    }
  }, [logId, navigate, otp]);

  const resendOTP = async (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    e.preventDefault();
    const data = {
      phone: localStorage.getItem("phone"),
      countryCode: localStorage.getItem("countryCode"),
      otpType: "sms",
    };
    try {
      const response = await generateOtp(data);
      if (response && response.status) {
        toast.success("OTP Sent Successfully!");
        dispatch(setLogId(response?.data?.data?.LogID));
      }
    } catch (err) {
      toast.error("Error occured while sending OTP!");
    }
  };

  const getOtpOverCall = async () => {
    const data = {
      phone: localStorage.getItem("phone"),
      countryCode: localStorage.getItem("countryCode"),
      otpType: "voice",
    };
    try {
      const response = await generateOtp(data);
      if (response && response.status) {
        toast.success(response?.data?.message);
        dispatch(setLogId(response?.data?.data?.LogID));
      }
    } catch (err) {
      toast.error("Error occured while sending OTP!");
    }
  };

  const handleChange = (otp: React.SetStateAction<string>) => {
    setOTP(otp);
  };

  useEffect(() => {
    if (otp && otp.length === 6) {
      handleClick();
    }
  }, [handleClick, otp]);

  const editPhoneNumber = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="container">
      <div className="row justify-content-center otp_section">
        <div className="col-12 col-md-6 col-lg-5 col-xl-5 mt-5 login_card">
          <div className="card login-card">
            <div className="d-flex flex-column align-items-center">
              {/* <img src="assets/logo.png" alt="logo" className="mt-3 logo" /> */}
              <h3 className="text-black Opt_h3">Enter 6 digit OTP code</h3>
              <div className="Opt_h4 d-flex text-center">
                <h4 className="align-self-center">
                  Send to
                  {localStorage.getItem("countryCode") != null &&
                    " +" +
                      localStorage.getItem("countryCode") +
                      " " +
                      localStorage.getItem("phone")}
                  .
                </h4>
                <button
                  onClick={() => editPhoneNumber()}
                  className="btn btn-default"
                >
                  {/* <i className='bi bi-pencil text-info'></i>  */}
                  Change
                </button>
              </div>
              <div className="otp-verification-header text-center mt-3">
                {/* <p>Enter Your OTP code here</p> */}
                <OtpInput
                  value={otp}
                  onChange={handleChange}
                  numInputs={6}
                  isInputNum
                  separator={<span className="ms-2"> </span>}
                  shouldAutoFocus={true}
                  inputStyle={{
                    width: "3rem",
                    height: "3rem",
                    borderTop: "0px",
                    borderRight: "0px",
                    borderLeft: "0px",
                    backgroundColor: "#EBF0F4",
                  }}
                />
                <button
                  className="btn btn-dark login-btn w-100 mt-5"
                  style={{ backgroundColor: "#3A4B86" }}
                  onClick={handleClick}
                >
                  {verifying_otp ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
              {otp_verify_error ? (
                <p className="text-danger mt-3">Invalid OTP!</p>
              ) : (
                false
              )}
              <div className="otp_footer mt-3">
                {/* <p className="text-center mt-3 mb-1">
                  Didn't receive any code?
                </p> */}
                <div className="d-flex justify-content-center">
                  {/* {minutes + seconds <= 0 ? (
                    ""
                  ) : (
                    <Timer minutes={minutes} seconds={seconds} />
                  )} */}
                </div>
                <div className="d-flex justify-content-center otp-not-received">
                  {flag ? (
                    <>
                      <p className="m-3 p_opt" onClick={(e) => resendOTP(e)}>
                        Resend OTP
                      </p>
                      <p className="my-3">|</p>
                      <p className="m-3 p_opt" onClick={() => getOtpOverCall()}>
                        Get OTP over call
                      </p>
                    </>
                  ) : (
                    <p className="m-3 p_opt">
                      <i className="bi bi-clock"></i> Resend another OTP in
                      <p className="timer_sec">
                        {" "}
                        <Timer seconds={seconds} />
                      </p>
                    </p>
                  )}
                </div>
                <div className="otp_terms_footer">
                  By continuing you agree to our <a href="#">terms of use</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
