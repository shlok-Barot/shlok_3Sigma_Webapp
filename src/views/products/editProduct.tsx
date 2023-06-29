import React, { useEffect, PropsWithChildren } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { getAllCategories } from "../../services/categoryService";
import {
  getProductDetails,
  updateProduct,
} from "../../services/productService";
import toast, { Toaster } from "react-hot-toast";

interface Product {
  productName: string;
  description: string;
  price: string;
  category: string;
}

interface CategoryI {
  _id: string;
  name: string;
}

interface Props {
  selectedProduct: string;
  fetchProducts: () => void;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: any;
}

const EditProduct: React.FC<PropsWithChildren<Props>> = ({
  selectedProduct,
  onDelete,
  fetchProducts,
  setShowDrawer,
}) => {
  const [productData, setProductData] = React.useState<Product>({
    productName: "",
    description: "",
    price: "",
    category: "",
  });
  const [categories, setCategories] = React.useState<Array<CategoryI>>([]);
  const [files, setFiles] = React.useState<File>();

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories({
        orderBy: "_id",
        isAscending: false,
        page: 1,
        perPage: 15,
      });
      if (response && response.status) {
        setCategories(response?.data?.data);
      }
    } catch (err) {}
  };

  const fetchProductById = async () => {
    try {
      const res = await getProductDetails(selectedProduct);
      if (res && res.status) {
        console.log(res?.data?.data);
        setProductData({
          ...productData,
          productName: res?.data?.data?.name,
          description: res?.data?.data?.description,
          price: res?.data?.data?.price,
          category: res?.data?.data?.category,
        });
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchCategories();
    fetchProductById();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.currentTarget;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;

    if (!fileList) return;

    setFiles(fileList[0]);
  };

  const renderCategories = () =>
    categories?.map((category) => {
      return <option value={category?._id}>{category?.name}</option>;
    });

  const onEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      description: productData?.description,
      price: productData?.price,
      currency: "INR",
      unitType: "KG",
    };
    try {
      const response = await updateProduct(data, selectedProduct);
      if (response && response.status) {
        toast.success(response?.data?.message);
        setShowDrawer(false);
        fetchProducts();
      }
    } catch (err) {
      toast.error("Error while updating product!");
    }
  };

  return (
    <form
      id="addProductForm"
      onSubmit={(evt) => onEditProduct(evt)}
      className="add_product"
    >
      <div className="form-container">
        <div className="d-flex justify-content-between align-items-center">
          <div className="image-upload">
            <label htmlFor="file-input">
              <FontAwesomeIcon icon={faPlusSquare} color="#3da6f7" size="lg" />
            </label>
            <input
              onChange={(evt) => handleImageUpload(evt)}
              id="file-input"
              type="file"
              accept="image/*"
              name="image"
            />
            &nbsp;
            <label className="form-label">Upload Product image</label>
          </div>

          <i
            className="fa fa-trash-o"
            style={{ color: "red", fontSize: "23px", cursor: "pointer" }}
            onClick={() => onDelete(selectedProduct)}
          />
        </div>
        <div className="product_group">
          <div className="form-group">
            <label className="form-label">Product name</label>
            <label style={{ color: "red" }}>*</label>
            <div className="icon_add">
              <i className="bi bi-person ficon"></i>
              <input
                name="productName"
                className="form-control"
                type="text"
                placeholder="Enter product name"
                readOnly
                onChange={(val) => handleChange(val)}
                value={productData?.productName}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Product Category</label>
            <label style={{ color: "red" }}>*</label>
            <select
              name="category"
              className="form-control"
              disabled
              onChange={(val) => handleChange(val)}
              value={productData?.category}
            >
              {renderCategories()}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Price</label>
            <label style={{ color: "red" }}>*</label>
            <input
              name="price"
              className="form-control mt-1"
              type="number"
              placeholder="Enter product price"
              onChange={(val) => handleChange(val)}
              value={productData?.price}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Product description</label>
            <input
              name="description"
              className="form-control mt-1"
              type="text"
              placeholder="Enter product description"
              onChange={(val) => handleChange(val)}
              value={productData?.description}
            />
          </div>
        </div>
        <div className="d-flex justify-content-center w-100">
          <button
            type="submit"
            className="btn btn-dark login-btn"
            disabled={
              !productData.productName ||
              !productData.category ||
              !productData.price
            }
          >
            Update
          </button>
        </div>
      </div>
      <Toaster />
    </form>
  );
};

export default EditProduct;
