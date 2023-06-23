import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import { useDispatch, useSelector } from "react-redux";
import DrawerComponent from "../../components/drawer";
import { Toggle } from "rsuite";
import AutomationRuleDrawer from "./automationRuleDrawer";
import DrawerExistModal from "../../components/drawerExistModal";

const Automation: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [autoRuleDrawer, setAutoRuleDrawer] = React.useState<boolean>(false);
  const [showExitDrawer, setShowExitDrawer] = React.useState<boolean>(false);
  const StoreData = useSelector((state: any) => {
    return state?.rootReducers;
  });

  const dispatch = useDispatch();

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e?.currentTarget?.value);
    if (e.currentTarget.value.length > 1) {
      // const updatedList = StoreData?.leads?.leads?.filter((lead: any) => {
      //   return (
      //     lead?.name
      //       ?.toLowerCase()
      //       .search(e?.currentTarget?.value?.toLowerCase()) !== -1
      //   );
      // });
    }
  };
  const autoRuleDrawerToggle = () => {
    setAutoRuleDrawer(!autoRuleDrawer);
  };
  const toggleExitModal = () => {
    setShowExitDrawer(!showExitDrawer);
  };
  const handleCloseDrawerClick = () => {
    setShowExitDrawer(!showExitDrawer);
    setAutoRuleDrawer(false);
  };
  return (
    <div id="main" className="main">
      <Header onSearch={(e: any) => onSearch(e)} />
      <section className="auto-section-1">
        <div className="d-flex justify-content-between">
          <div className="align-items-center auto-section-1-sub-1">
            <label>Automation Rules (23)</label>
          </div>
          <div className="dropdown d-flex align-items-center">
            <div
              className="dropdown ms-3"
              style={{ backgroundColor: "#EBF0F4", borderRadius: "5px" }}
            >
              <button
                className="btn fw-bold auto_btn"
                type="button"
                onClick={() => autoRuleDrawerToggle()}
              >
                <i className="bi bi-plus-lg"></i> New rule
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="auto-section-2">
        <div className="auto-section-3">
          <Toggle defaultChecked />
          <div className="auto-section-23-sub-1">
            <h5>Rule name </h5>
            <p>Sample discriptions ....</p>
          </div>
          <label className="auto_label">
            <img alt="right" src="assets/img/auto_rule.png" />
            Ran 227 times <span>Last ran 23 hours ago </span>
          </label>
        </div>
        <div className="auto-section-3">
          <Toggle defaultChecked />
          <div className="auto-section-23-sub-1">
            <h5>Rule name </h5>
            <p>Sample discriptions ....</p>
          </div>
          <label className="auto_label">
            <img alt="right" src="assets/img/auto_rule.png" />
            Ran 227 times <span>Last ran 23 hours ago </span>
          </label>
        </div>
        <div className="auto-section-3">
          <Toggle defaultChecked />
          <div className="auto-section-23-sub-1">
            <h5>Rule name </h5>
            <p>Sample discriptions ....</p>
          </div>
          <label className="auto_label">
            <img alt="right" src="assets/img/auto_rule.png" />
            Ran 227 times <span>Last ran 23 hours ago </span>
          </label>
        </div>
        <div className="auto-section-3">
          <Toggle defaultChecked />
          <div className="auto-section-23-sub-1">
            <h5>Rule name </h5>
            <p>Sample discriptions ....</p>
          </div>
          <label className="auto_label">
            <img alt="right" src="assets/img/auto_rule.png" />
            Ran 227 times <span>Last ran 23 hours ago </span>
          </label>
        </div>
      </section>
      <div className="automatic_rule_drawer">
        <DrawerComponent
          openWithHeader={autoRuleDrawer}
          setOpenWithHeader={toggleExitModal}
          drawerTitle="Automation Rules"
          size="lg"
        >
          <AutomationRuleDrawer />
        </DrawerComponent>
        <DrawerExistModal
          showExitModal={showExitDrawer}
          toggleEditModal={toggleExitModal}
          handleDrawerClick={handleCloseDrawerClick}
        />
      </div>
    </div>
  );
};

export default Automation;
