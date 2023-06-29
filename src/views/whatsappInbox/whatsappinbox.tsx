import React, { useEffect, useState } from "react";
import Header from "../../components/header";

const WhatsappInbox: React.FC = () => {
  return (
    <div id="main" className="main">
      <Header />
      <section className="auto-section-1">
        <div className="d-flex justify-content-between">
          <div className="align-items-center auto-section-1-sub-1">
            <label>Inbox </label>
          </div>
        </div>
      </section>

      <section className="auto-section-2"></section>
    </div>
  );
};

export default WhatsappInbox;
