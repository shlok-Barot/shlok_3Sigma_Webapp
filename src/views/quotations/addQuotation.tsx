/* eslint-disable react-hooks/exhaustive-deps */
import {
  faIndianRupeeSign,
  faRupeeSign,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import {
  getAllProducts,
  getProductDetails,
} from "../../services/productService";
import { useSelector } from "react-redux";
import {
  createQuotations,
  getQuotationDetails,
} from "../../services/quotationService";
import { toast } from "react-toastify";
import { Row, Col } from "reactstrap";
import "./quotation.scss";
interface Quotation {
  leadName: string;
  title: string;
  productName: number;
}

interface Servicetype {
  name: string;
  price: number;
  _id: string;
  value: string;
}

interface propT {
  getQuotations: () => void;
  setOpenWithHeader: React.Dispatch<React.SetStateAction<boolean>>;
  mode: string;
  quotationId: string;
  onDelete: (id: string) => void;
}

const AddEditQuotation: React.FC<propT> = ({
  getQuotations,
  setOpenWithHeader,
  mode,
  quotationId,
  onDelete,
}) => {
  const [quotationData, setQuotationData] = useState<Quotation>({
    leadName: "",
    title: "",
    productName: 0,
  });
  const [productId, setProductId] = useState<string>("");
  const [produtService, setProductService] = useState<Array<Servicetype>>([]);
  const leads = useSelector(
    (state: { rootReducers: { leads: { leads: Array<Servicetype> } } }) =>
      state?.rootReducers?.leads?.leads
  );
  const [price, setPrice] = useState<number>(0);
  const [addDiscountVisible, setAddDiscountVisible] = useState<boolean>(false);
  const [addTaxVisible, setAddTaxVisible] = useState<boolean>(false);
  const [discount, setDiscount] = useState<string>("");
  const [tax, setTax] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [customTax, setCustomTax] = useState<boolean>(false);
  const [discountType, setDiscountType] = useState<string>("");

  useEffect(() => {
    getProductService();
  }, []);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    fetchQuotation();
  }, [quotationId]);

  const fetchQuotation = async () => {
    const resp = await getQuotationDetails(quotationId);
    if (resp && resp.status) {
      setQuotationData({
        ...quotationData,
        leadName: resp?.data?.data?.lead,
        title: resp?.data?.data?.title,
        productName: resp?.data?.data.products[0].product,
      });
      setQuantity(resp?.data?.data?.products[0].quantity);
    }
  };

  const fetchProductDetails = async () => {
    const response = await getProductDetails(productId);
    if (response && response.status) {
      setPrice(response?.data?.data?.price);
    }
  };

  const getProductService = async () => {
    const obj = {
      orderBy: "_id",
      page: 1,
      perPage: 15,
    };
    const res = await getAllProducts(obj);
    setPrice(res?.data?.data[0]?.price);
    setQuotationData({
      ...quotationData,
      leadName: leads[0]?._id,
      productName: res?.data?.data[0]?._id,
    });
    setProductService(res?.data?.data);
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.currentTarget;
    setQuotationData({
      ...quotationData,
      [name]: value,
    });
    if (name === "productName") {
      setProductId(value);
    }
  };

  const addDiscount = () => {
    setAddDiscountVisible(true);
  };

  const onTaxTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e?.currentTarget?.value === "custom") {
      setCustomTax(true);
    } else {
      setCustomTax(false);
      setTax("12");
    }
  };

  const changeDiscountType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDiscountType(e?.currentTarget?.value);
  };

  const onAddQuotation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const obj = {
      lead: `${quotationData?.leadName}`,
      quotationId: "0",
      title: quotationData?.title,
      additionalCharges: {},
      discountType: {},
      subTotal: quantity * price,
      total:
        quantity *
        Number(
          (
            Number((price - (price * Number(discount)) / 100).toFixed(2)) +
            Number(
              (
                ((price - (price * Number(discount)) / 100) * Number(tax)) /
                100
              ).toFixed(2)
            )
          ).toFixed(2)
        ),
      products: [
        {
          product: `${quotationData?.productName}`,
          quantity: 1,
        },
      ],
    };
    try {
      const res = await createQuotations(obj);
      if (res && res.status) {
        toast.success(res?.data?.message);
        getQuotations();
        setOpenWithHeader(false);
      }
    } catch (err) {
      toast.error("Error while creating quotation !");
    }
  };

  return (
    <form
      id="addQuotationForm"
      onSubmit={(evt) => onAddQuotation(evt)}
      className="addquotation"
    >
      <div className="form-container">
        {mode === "edit" && (
          <div className="d-flex justify-content-between align-items-center">
            <i
              className="fa fa-trash-o"
              style={{ color: "red", fontSize: "23px", cursor: "pointer" }}
              onClick={() => onDelete(quotationId)}
            />
          </div>
        )}
        <div className="product_group">
          <div className="form-group">
            <label className="form-label">Lead name</label>
            <select
              name="leadName"
              className="form-control"
              placeholder="Select lead"
              onChange={(val) => handleChange(val)}
              value={quotationData?.leadName}
            >
              <option disabled value="">
                Select Lead
              </option>
              {leads?.map((item, index) => (
                <option value={item?._id} key={index}>
                  {item?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Quotation title</label>
            <input
              name="title"
              className="form-control mt-1"
              type="text"
              placeholder="Quotation"
              onChange={(val) => handleChange(val)}
              value={quotationData?.title}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Product/Service</label>
            <select
              name="productName"
              className="form-control"
              value={quotationData?.productName || "Select Product"}
              onChange={(val) => handleChange(val)}
            >
              <option disabled value="Select Product">
                Select Product
              </option>
              {produtService?.map((item, index) => (
                <option value={item?._id} key={index}>
                  {item?.name}
                </option>
              ))}
            </select>
          </div>
          <Row className="form-group">
            <Col md="4">
              <label className="form-label">Quantity</label>
              <input
                className="form-control"
                type="number"
                placeholder="Enter Unit"
                onChange={(e) => setQuantity(Number(e?.currentTarget?.value))}
                value={quantity}
              />
            </Col>
            <Col md="4">
              <label className="form-label">Unit Price</label>
              <input
                readOnly
                className="form-control"
                type="text"
                value={price}
              />
            </Col>
            <Col md="4">
              <label className="form-label">Total</label>
              <input
                readOnly
                className="form-control"
                type="text"
                value={price * quantity}
              />
            </Col>
          </Row>
        </div>
        <div className="subtotal_section">
          <div className="subtotal-div d-flex justify-content-between">
            <span className="title">Subtotal</span>
            <span className="value">
              <FontAwesomeIcon icon={faIndianRupeeSign} /> {price * quantity}
            </span>
          </div>
          <div className="subtotal-div discount">
            <div className="d-flex justify-content-between">
              <span className="title">Discount</span>
              <span onClick={addDiscount} className="value">
                {addDiscountVisible
                  ? quantity *
                    Number(((price * Number(discount)) / 100).toFixed(2) || 0)
                  : "Add Discount"}
              </span>
            </div>
            {addDiscountVisible && (
              <div className="adddiscount">
                <input
                  name="discount"
                  className="form-control title"
                  type="text"
                  placeholder="Enter Discount"
                  onChange={(e) => setDiscount(e?.currentTarget.value)}
                  value={discount}
                />
                <select
                  onChange={(e) => changeDiscountType(e)}
                  className="form-control"
                >
                  <option value="percentage">%</option>
                  <option value="amount">₹</option>
                </select>
                <span
                  onClick={() => {
                    setAddDiscountVisible(false);
                    setDiscount("");
                  }}
                  className="value delete_box"
                >
                  <FontAwesomeIcon color="red" icon={faTrashAlt} />
                </span>
              </div>
            )}
          </div>
          <div className="subtotal-div tax">
            <div className="d-flex justify-content-between">
              <span className="title">Tax</span>
              <span onClick={() => setAddTaxVisible(true)} className="value">
                {addTaxVisible
                  ? quantity *
                    Number(
                      (
                        ((price - (price * Number(discount)) / 100) *
                          Number(tax)) /
                        100
                      ).toFixed(2)
                    )
                  : "Add Tax"}
              </span>
            </div>
            {addTaxVisible && (
              <div className="tax_select">
                <select
                  className="form-control"
                  defaultValue={""}
                  onChange={(e) => onTaxTypeChange(e)}
                >
                  <option value="">Select Tax</option>
                  <option value="custom">Add Tax Rate</option>
                  <option value="12%">New tax rate (12%)</option>
                </select>
                <span
                  onClick={() => setAddTaxVisible(false)}
                  className="delete_box"
                >
                  <FontAwesomeIcon color="red" icon={faTrashAlt} />
                </span>
              </div>
            )}
            {customTax && (
              <div className="add_tax">
                <Row>
                  <Col md="8">
                    <input
                      className="form-control"
                      readOnly
                      value={"New tax rate"}
                    />
                  </Col>
                  <Col md="4">
                    <input
                      onChange={(e) => setTax(e?.currentTarget?.value)}
                      className="form-control"
                      type="text"
                      placeholder="0"
                    />
                  </Col>
                </Row>
              </div>
            )}
          </div>
          <div className="subtotal-div total-div d-flex justify-content-between">
            <span className="title">Total</span>
            <span>
              <FontAwesomeIcon icon={faIndianRupeeSign} />
              {quantity *
                Number(
                  (
                    Number(
                      (price - (price * Number(discount)) / 100).toFixed(2)
                    ) +
                    Number(
                      (
                        ((price - (price * Number(discount)) / 100) *
                          Number(tax)) /
                        100
                      ).toFixed(2)
                    )
                  ).toFixed(2) || 0
                )}
            </span>
          </div>
        </div>
        <div className="d-flex justify-content-center w-100 mb-2">
          <button type="submit" className="btn btn-dark login-btn m-2">
            {mode === "add" ? "Create Quotation" : "Update Quotation"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddEditQuotation;
