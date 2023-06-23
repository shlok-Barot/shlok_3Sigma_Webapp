/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { useNavigate } from "react-router-dom";
import { generateOtp, signIn } from "../../services/authServices";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLogId } from "../../actions/actions";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { gapi } from "gapi-script";

import googleIcon from "../../assets/images/google-logo.svg";
import facebookIcon from "../../assets/images/facebook-logo.svg";

const Login: React.FC = () => {
  const [validationError, setValidationError] = useState<boolean>(false);
  const [logging_in, setLoggingIn] = useState<boolean>(false);
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkUser = async () => {
    let isToken: any = localStorage.getItem("auth_token");
    if (isToken) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };
  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId:
          "322938904388-00e53rkapuk0mc3b51l4ihc4upio7tvm.apps.googleusercontent.com",
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
  });

  const handleChange = (
    val: string,
    _country: CountryData,
    e: React.ChangeEvent<HTMLInputElement>,
    _formattedValue: string
  ) => {
    setValue(val);
    setMobileNumber(val.slice(_country.dialCode.length));
    setCountryCode(_country?.dialCode);
    setValidationError(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!mobileNumber || !mobileNumber.match(/^\d{10}$/)) {
      setValidationError(true);
    } else if (!countryCode) {
      setValidationError(true);
    } else {
      setValidationError(false);
      setLoggingIn(true);
      const data = {
        phone: mobileNumber,
        countryCode: countryCode,
        otpType: "sms",
      };
      try {
        const response = await generateOtp(data);
        if (response && response.status) {
          localStorage.setItem("phone", mobileNumber);
          localStorage.setItem("countryCode", countryCode);
          toast.success("OTP Sent Successfully!");
          dispatch(setLogId(response?.data?.data?.LogID));
          setLoggingIn(false);
          navigate("./otp-verify");
        }
      } catch (err) {
        setLoggingIn(false);
        toast.error("Error occured while sending OTP!");
      }
    }
  };

  const responseGoogle = async (response: any) => {
    console.log("responseGoogle", response);

    localStorage.setItem("email", response?.profileObj?.email);
    localStorage.setItem("auth_token", response?.tokenId);
    const data = {
      loginType: "google",
      // email: response?.profileObj?.email,
      loggedFrom: "mobile",
      // googleId: response?.googleId,
      // deviceToken :"abc",
      identityToken: localStorage.getItem("auth_token"),
    };
    try {
      const resp = await signIn(data);
      if (resp && resp.status) {
        localStorage.setItem("auth_token", resp?.data?.data?.token);
        navigate("./sign-up");
      }
    } catch (err) {
      toast.error("Error occured while logging in!");
    }
  };

  const responseFacebook = (response: any) => {
    console.log(response);
    if (response.accessToken) {
      // setLogin(true);
      console.log("here");
    } else {
      // setLogin(false);
      console.log("else");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center login_section">
        <div className="col-12 col-md-6 col-lg-5 col-xl-5 login_card">
          <div className="card login-card">
            <div className="d-flex flex-column align-items-center">
              <img
                src="assets/img/3sigma_logo.png"
                alt="logo"
                className="mt-2 logo"
              />
              <div className="login-header text-center margin30">
                <h2>Login via phone number</h2>
                <p>We will send you OTP on this Phone number.</p>
              </div>
              <form onSubmit={(e) => handleSubmit(e)} className="login_form">
                <div className="form_container_login">
                  <PhoneInput
                    value={value}
                    inputClass="phone_input_left"
                    country="in"
                    masks={{ fr: "(...) ..-..-..", at: "(....) ...-...." }}
                    onChange={(val, country, e, formattedValue) =>
                      handleChange(
                        val,
                        country as CountryData,
                        e,
                        formattedValue
                      )
                    }
                    preferredCountries={["in"]}
                    buttonStyle={{
                      backgroundColor: "#FFF",
                      borderRightWidth: 0,
                      borderTopLeftRadius: 10,
                      borderBottomLeftRadius: 10,
                    }}
                  />
                  {validationError && (
                    <small className="text-danger mb-3 ps-0">
                      Mobile Number is not valid
                    </small>
                  )}

                  <button
                    type="submit"
                    className="btn btn-dark login-btn w-100"
                    style={{
                      backgroundColor: "#3A4B86",
                      fontFamily: "Gilroy-bold",
                    }}
                  >
                    {logging_in ? "Sending Otp..." : "Send OTP"}
                  </button>
                </div>
              </form>

              <div className="login-footer">
                <p
                  className="text-center"
                  style={{ fontFamily: "Gilroy-bold" }}
                >
                  or login using
                </p>
                <div className="circle-container d-flex justify-content-center">
                  <FacebookLogin
                    appId="776734700302578"
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={responseFacebook}
                    render={(renderProps) => (
                      <div
                        className="social-combobox cursor-pointer"
                        onClick={renderProps.onClick}
                      >
                        <img
                          src={facebookIcon}
                          alt="facebook"
                          className="social-log"
                        />
                      </div>
                      // <a onClick={renderProps.onClick} href="#" className="fa fa-facebook d-flex bg-white"></a>
                    )}
                  />
                  <GoogleLogin
                    clientId="322938904388-00e53rkapuk0mc3b51l4ihc4upio7tvm.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={"single_host_origin"}
                    render={(renderProps) => (
                      <div
                        className="social-combobox cursor-pointer"
                        onClick={renderProps.onClick}
                      >
                        <img
                          src={googleIcon}
                          alt="google"
                          className="social-log"
                        />
                      </div>
                      // <a onClick={renderProps.onClick} href="#" className="fa fa-google d-flex bg-white"></a>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
