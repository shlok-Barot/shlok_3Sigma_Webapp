import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Header = ({ onSearch }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userdata, setUserdata] = useState<any>({});

  const handleChange = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    let local: any = window.localStorage?.getItem("userData");
    setUserdata(JSON.parse(local));
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };
  return (
    <>
      <header
        id="header"
        className="header fixed-top d-flex align-items-center"
      >
        <div className="d-flex align-items-center justify-content-between">
          <a href="/dashboard" className="logo d-flex align-items-center">
            <img src="assets/img/3sigma_logo.png" alt="img" />
          </a>
          {/* <i className="bi bi-list toggle-sidebar-btn"></i> */}
        </div>

        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            <div
              style={{
                backgroundColor: "#EBF0F4",
                borderRadius: "5px",
                height: "36px",
                marginRight: "10px",
              }}
              className="d-flex justify-content-center align-items-center px-2"
            >
              {isOpen ? (
                <div className="d-flex justify-content-center align-items-center">
                  <input
                    type="text"
                    placeholder="Search Lead..."
                    className="form-control  background-transparent"
                    style={{
                      outline: "none",
                      border: "none",
                      backgroundColor: "transparent",
                    }}
                    onChange={(e) => onSearch(e)}
                  />
                  <i
                    className="fa fa-times pe-2 cursor-pointer"
                    aria-hidden="true"
                    onClick={handleChange}
                  ></i>
                </div>
              ) : (
                <i
                  className="fa fa-search cursor-pointer"
                  aria-hidden="true"
                  onClick={handleChange}
                ></i>
              )}
            </div>

            {/* <div
              style={{
                backgroundColor: "#EBF0F4",
                borderRadius: "5px",
                height: "36px",
              }}
              className="d-flex justify-content-center align-items-center px-2 mx-2"
            >
              <img src="assets/img/notification.png" height={15} width={15} />
            </div> */}

            <li
              className="nav-item dropdown pe-3 mt-0"
              style={{ backgroundColor: "#EBF0F4", borderRadius: "5px" }}
            >
              <a
                className="nav-link nav-profile d-flex align-items-center pe-0"
                href="dashboard"
                data-bs-toggle="dropdown"
              >
                <span className="d-md-block dropdown-toggle ps-2 ">
                  {userdata?.firstName}
                </span>
              </a>

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li onClick={() => handleLogout()}>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="dashboard"
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Sign Out</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <NavLink className="nav-link" to="/dashboard">
              {window.location.pathname === "/dashboard" ? (
                <img
                  alt="Dashboard"
                  src="assets/img/dashboardGIcon.png"
                  className="menu_icons"
                />
              ) : (
                <img
                  alt="Dashboard"
                  src="assets/img/dashboardIcon.png"
                  className="menu_icons"
                />
              )}
              <span>Dashboard</span>
            </NavLink>
            <NavLink className="nav-link" to="/leads">
              {/* <i className="bi bi-house-fill"></i> */}
              {window.location.pathname === "/leads" ? (
                <img
                  alt="lead"
                  src="assets/img/leadGIcon.png"
                  className="menu_icons"
                />
              ) : (
                <img
                  alt="lead"
                  src="assets/img/leadIcon.png"
                  className="menu_icons"
                />
              )}
              <span>Leads</span>
            </NavLink>
            {/* <NavLink className="nav-link" to="/products">
              <i className="bi bi-gem"></i>
              <span>Products</span>
            </NavLink>
            <NavLink className="nav-link" to="/quotations">
              <i className="bi bi-quote"></i>
              <span>Quotations</span>
            </NavLink>
            <NavLink className="nav-link" to="/categories">
              <i className="bi bi-grid"></i>
              <span>Categories</span>
            </NavLink>
            <NavLink className="nav-link" to="/content">
              <i className="bi bi-book"></i>
              <span>Content</span>
            </NavLink> */}
            <NavLink className="nav-link" to="/tasks">
              {/* <i className="bi bi-list-task"></i> */}
              {window.location.pathname === "/tasks" ? (
                <img
                  alt="task"
                  src="assets/img/taskGIcon.png"
                  className="menu_icons"
                />
              ) : (
                <img
                  alt="task"
                  src="assets/img/taskIcon.png"
                  className="menu_icons"
                />
              )}
              <span>Tasks</span>
            </NavLink>
            <NavLink className="nav-link" to="/automation">
              <span>Automation</span>
            </NavLink>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Header;
