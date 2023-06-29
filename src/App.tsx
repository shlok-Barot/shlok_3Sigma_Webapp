import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "antd/dist/antd.css";
import "./App.css";
import CategoryList from "./views/category/categoryList";
import Content from "./views/content/content";
import ContentDetail from "./views/content/contentDetails";
import Dashboard from "./views/dashboard/dashboard";
import FollowUps from "./views/followUps/followUps";
import Leads from "./views/leads/leads";
import Login from "./views/login";
import { OtpVerification } from "./views/otpVerification";
import ProductList from "./views/products/productsList";
import QuotationList from "./views/quotations/quotationList";
import Signup from "./views/signup/signup";
import PrivateRoute from "./routes/privateRoute";
import axios from "axios";
import { API_URL } from "../src/config/config";
import Automation from "./views/automation/automation";
import WhatsappInbox from "./views/whatsappInbox/whatsappinbox";

function App() {
  const checkUser = async () => {
    let localData: any = localStorage.getItem("userData");

    const API_ENDPOINT = API_URL + "api/v1";
    let header = {
      headers: {
        Authorization: JSON.parse(localData)?.token,
      },
    };

    await axios
      .get(`${API_ENDPOINT}/user/profile`, header)
      .then((response) => {
        if (response.status === 401) {
          window.location.replace("/");
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };
  useEffect(() => {
    checkUser();
  }, []);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/otp-verify" element={<OtpVerification />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/leads"
            element={
              <PrivateRoute>
                <Leads />
              </PrivateRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <FollowUps />
              </PrivateRoute>
            }
          />

          <Route
            path="/products"
            element={
              <PrivateRoute>
                <ProductList />
              </PrivateRoute>
            }
          />

          <Route
            path="/quotations"
            element={
              <PrivateRoute>
                <QuotationList />
              </PrivateRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <PrivateRoute>
                <CategoryList />
              </PrivateRoute>
            }
          />

          <Route
            path="/content"
            element={
              <PrivateRoute>
                <Content />
              </PrivateRoute>
            }
          />

          <Route
            path="/automation"
            element={
              <PrivateRoute>
                <Automation />
              </PrivateRoute>
            }
          />

          <Route
            path="/get-details/:_id"
            element={
              <PrivateRoute>
                <ContentDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/whatsappInbox"
            element={
              <PrivateRoute>
                <WhatsappInbox />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
