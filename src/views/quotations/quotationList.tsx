import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Card,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Row,
} from "reactstrap";
import Header from "../../components/header";
import {
  deleteQuotations,
  getAllQuotations,
} from "../../services/quotationService";
import AddEditQuotation from "./addQuotation";
import DrawerComponent from "../../components/drawer";
import ConfirmationModal from "../../components/confirmationModal";
import { toast } from "react-toastify";
import "./quotation.scss";
import { GoPlus } from "react-icons/go";
import { BsCurrencyRupee } from "react-icons/bs";

interface typeQ {
  _id: string;
  createdBy: string;
  lead: string;
  products: Array<{
    product: string;
    quantity: number;
  }>;
  title: string;
  total: number;
}

const QuotationList: React.FC = () => {
  const [quotationData, setQuotationData] = useState<Array<typeQ>>([]);
  const [openWithHeader, setOpenWithHeader] = React.useState<boolean>(false);
  const [mode, setMode] = useState<string>("");
  const [quotationId, setQuotationId] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  useEffect(() => {
    getQuotations();
  }, []);

  const getQuotations = async () => {
    const obj = {
      orderBy: "_id",
      page: 1,
      perPage: 15,
    };
    const res = await getAllQuotations(obj);
    setQuotationData(res?.data?.data);
  };

  const renderQuotation = () =>
    quotationData?.map((quotation) => {
      return (
        <ListGroupItem
          onClick={() => {
            setOpenWithHeader(true);
            setMode("edit");
            setQuotationId(quotation?._id);
          }}
          key={quotation?._id}
        >
          <div className="widget-content p-0">
            <div className="widget-content-wrapper">
              <div className="widget-content-left m-3">
                <div className="widget-heading">{quotation.title}</div>
                <div className="widget-subheading mt-1">Ankit Bora</div>
                <div className="widget-subheading mt-1">
                  Created by Shubham Parmar at 7th Aug 2022
                </div>
              </div>
              <div className="widget-content-right text-right mr-3 mb-1">
                <div>
                  <Badge color="success" pill>
                    Approved
                  </Badge>
                </div>
                <div className="widget-numbers text-primary">
                  <FontAwesomeIcon icon={faIndianRupeeSign} />
                  <span>{quotation?.total}</span>
                </div>
              </div>
            </div>
          </div>
        </ListGroupItem>
      );
    });

  const onDelete = (id: string) => {
    setShowConfirmation(true);
    setQuotationId(id);
  };

  const toggleModal = () => {
    setShowConfirmation(!showConfirmation);
  };

  const onConfirmation = async () => {
    try {
      const response = await deleteQuotations(quotationId);
      if (response && response.status) {
        toast.success(response?.data?.message);
        getQuotations();
        setShowConfirmation(false);
        setOpenWithHeader(false);
      }
    } catch (err) {
      toast.error("Error while deleting quotation!");
      setShowConfirmation(false);
    }
  };

  return (
    <div id="main" className="main">
      <Header />
      <Container fluid>
        <Row>
          <Col>
            {/* <Card className="main-card mb-3">
                            <ListGroup className="m-2" flush>
                                {renderQuotation()}
                            </ListGroup>
                        </Card> */}
            <div className="row">
              <div className="col-md-12">
                <ul
                  className="nav nav-pills mb-3 content-section-1-sub-1 d-flex"
                  id="pills-tab"
                  role="tablist"
                >
                  <div className="col nav-item justify-content-start">
                    <button
                      className="nav-link px-4"
                      id="pills-upcoming-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-upcoming"
                      type="button"
                      role="tab"
                      aria-controls="pills-upcoming"
                      aria-selected="false"
                    >
                      Quotation (210)
                    </button>
                  </div>
                  <div className="d-flex">
                    <li className="nav-item me-3" role="presentation">
                      <button
                        className="nav-link px-4 create_quetation"
                        id="pills-upcoming-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-upcoming"
                        type="button"
                        role="tab"
                        aria-controls="pills-upcoming"
                        aria-selected="false"
                      >
                        <GoPlus />
                        Create Quotation
                      </button>
                    </li>
                    <li className="me-3">
                      <div
                        style={{
                          backgroundColor: "#EBF0F4",
                          borderRadius: "5px",
                          height: "34px",
                        }}
                        className="p-2"
                      >
                        <img
                          alt=""
                          //   onClick={toggleLeadFilterDrawer}
                          src="assets/img/filterBlack.png"
                          title="filter"
                          id="filter-img"
                          className="cursor-pointer "
                          // sty
                        />
                      </div>
                    </li>
                    <li>
                      <div
                        style={{
                          backgroundColor: "#EBF0F4",
                          borderRadius: "5px",
                          height: "34px",
                        }}
                        className="p-2"
                      >
                        <span
                          //   onClick={() => getLeads()}
                          className="text-black fw-bold cursor-pointer bi bi-arrow-clockwise"
                          style={{ height: "37px" }}
                        ></span>
                      </div>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="pills-duetoday"
                role="tabpanel"
                aria-labelledby="duetoday-tab"
              >
                <div className="followups-section-1 Quotation">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th scope="col">Lead Name </th>
                        <th scope="col">Quotation ID </th>
                        <th scope="col">Status</th>
                        <th scope="col">Created by</th>
                        <th scope="col">Created at</th>
                        <th scope="col">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Vivek Rana</td>
                        <td>AQuote -233</td>
                        <td>
                          <button className="btn btn-info">
                            <span className="created">Created</span>
                          </button>
                        </td>
                        <td>FVivek Rana</td>
                        <td>20 Nov 2023 : 06:40</td>
                        <td>
                          <BsCurrencyRupee />
                          8,999
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <div className="row">
          <div
            className="addmessagesicon"
            onClick={() => {
              setOpenWithHeader(true);
              setMode("add");
            }}
          >
            <i className="bi bi-plus-circle-fill"></i>
          </div>
        </div>
        <DrawerComponent
          openWithHeader={openWithHeader}
          setOpenWithHeader={setOpenWithHeader}
          drawerTitle={mode === "add" ? "Create Quotation" : "Edit Quotation"}
          size="sm"
        >
          <AddEditQuotation
            getQuotations={getQuotations}
            setOpenWithHeader={setOpenWithHeader}
            mode={mode}
            quotationId={quotationId}
            onDelete={onDelete}
          />
        </DrawerComponent>
        <ConfirmationModal
          onConfirmation={onConfirmation}
          showModal={showConfirmation}
          toggleModal={toggleModal}
          message={"Are you sure you want to delete this quotation"}
        />
      </Container>
    </div>
  );
};

export default QuotationList;
