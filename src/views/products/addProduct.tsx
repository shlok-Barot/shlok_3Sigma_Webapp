import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
// import {fauser} from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { PropsWithChildren, useEffect } from "react";
import { toast } from "react-toastify";
import { getAllCategories } from "../../services/categoryService";
import { createNewProduct } from "../../services/productService";
import { uploadFiles } from "../../services/utilityService";
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

interface PropsI {
  fetchProducts: () => void
}

const AddProduct: React.FC<PropsWithChildren<PropsI>> = ({ fetchProducts }) => {
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
    } catch (err) { }
  };

  useEffect(() => {
    fetchCategories();
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

  function makeId(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

  const onAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let tempID = makeId(5);

    const data = {
      productId: tempID,
      name: productData?.productName,
      description: productData?.description,
      price: productData?.price,
      category: productData?.category,
      currency: 'INR',
      unitType: 'KG'
    };
    try {
      const response = await createNewProduct(data);
      if (response && response.status) {
        toast.success(response?.data?.message);
        $("#AddNewProduct").modal("hide");
        fetchProducts();
      }
    } catch (err) {
      toast.error("error while creating new content");
    }

    if (files) {
      let formData = new FormData();
      formData.append('files', files);
      formData.append('type', 'product')
      formData.append('product', tempID)
      try {
        const fileUploadResponse = await uploadFiles(formData);
        if (fileUploadResponse && fileUploadResponse.status) {
          toast.success(fileUploadResponse?.data?.message);
        }
      } catch (err) {
        toast.error('Error while uploading file!');
      }
    }
  };

  const renderCategories = () =>
    categories?.map((category) => {
      return <option value={category?._id}>{category?.name}</option>;
    });

  return (
    <form id="addProductForm" onSubmit={(evt) => onAddProduct(evt)} className="add_product">
      <div className="form-container">
        <div className="d-flex justify-content-between align-items-center">
          <div className="image-upload">
            <label htmlFor="file-input">
              <FontAwesomeIcon
                icon={faPlusSquare}
                color="#3da6f7"
                size="lg"
              />
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
            className="btn btn-primary login-btn"
            disabled={
              !productData.productName ||
              !productData.category ||
              !productData.price
            }
          >
            Add Product
          </button>
        </div>
      </div>

    </form>
  );
};

export default AddProduct;
