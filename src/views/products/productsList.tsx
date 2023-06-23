import React, { useEffect, useState } from 'react';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Card, Col, Container, ListGroup, ListGroupItem, Row } from 'reactstrap';
import './productList.scss';
import Header from '../../components/header';
import AddProduct from './addProduct';
import { deleteProduct, getAllProducts } from '../../services/productService';
import ConfirmationModal from '../../components/confirmationModal';
import { toast } from 'react-toastify';
import DrawerComponent from '../../components/drawer';
import EditProduct from './editProduct';
import fallback_image from '../../assets/images/no-product.png';

interface ProductI {
    name: string,
    createdBy: string,
    currency: string,
    description: string,
    images: Array<string>,
    category: {
        name: string,
        _id: string
    },
    price: number,
    productId: string,
    unitType: string,
    _id: string
}

const ProductList: React.FC = () => {

    const [productsList, setProducts] = useState<Array<ProductI>>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [openWithHeader, setOpenWithHeader] = React.useState<boolean>(false);
    const [showDrawer, setShowDrawer] = React.useState<boolean>(false);

    const fetchProducts = async () => {
        try {
            const response = await getAllProducts({
                orderBy: '_id',
                isAscending: false,
                page: 1,
                perPage: 15
            });
            if (response && response.status) {
                setProducts(response?.data?.data);
            }
        } catch (err) {}
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const addNewProduct = () => {
        setOpenWithHeader(true);
    }

    const onDelete = (id: string) => {
        setShowModal(true);
        setSelectedProduct(id);
    }

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    const onConfirmation = async () => {
        try {
            const response = await deleteProduct(selectedProduct);
            if (response && response.status) {
                toast.success(response?.data?.message);
                setOpenWithHeader(false);
                fetchProducts();
            }
        } catch (err) {
            toast.error('Error while deleting product');
        }
        setShowModal(false);
    }

    const onProductClick = (id: string) => {
        setSelectedProduct(id);
        setShowDrawer(true);
    }

    const renderProductList = () => (
        productsList?.map(product => (
            <ListGroupItem onClick={() => onProductClick(product?._id)} key={product?._id}>
                <div className="widget-content p-0">
                    <div className="widget-content-wrapper">
                        <div className="widget-content-left mr-3">
                            <img width={80} height={80} className="rounded-circle" src={product?.images[0] || fallback_image}
                                alt="" />
                        </div>
                        <div className="widget-content-left m-3">
                            <div className="widget-heading">
                                {product?.name}
                            </div>
                            <div className="widget-subheading">
                                <Badge pill color='primary'>
                                    {product?.category?.name}
                                </Badge>
                            </div>
                            <div className="widget-subheading mt-1">
                                {product?.description}
                            </div>
                            <div className="widget-subheading mt-1">
                                Created by Shubham Parmar
                            </div>
                        </div>
                        <div className="widget-content-right d-flex">
                            <div className="widget-numbers text-primary">
                                <FontAwesomeIcon icon={faIndianRupeeSign} />
                                {' '}<span>{product?.price}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </ListGroupItem>
        ))
    );

    return (
        <div id="main" className="main">
            <Header />
            <Container fluid>
                <Row>
                    <Col>
                        <Card className="main-card mb-3">
                            <ListGroup flush>
                                {renderProductList()}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
                <div className="row">
                    <div className="addmessagesicon">
                        <i
                            className="bi bi-plus-circle-fill"
                            onClick={addNewProduct}
                        ></i>
                    </div>
                </div>
                <DrawerComponent
                    openWithHeader={openWithHeader}
                    setOpenWithHeader={setOpenWithHeader}
                    drawerTitle="Add Product"
                    size='xs'
                >
                    <AddProduct fetchProducts={fetchProducts} />
                </DrawerComponent>
                <DrawerComponent
                    openWithHeader={showDrawer}
                    setOpenWithHeader={setShowDrawer}
                    drawerTitle="Edit Product"
                    size="xs"
                >
                    <EditProduct
                        onDelete={onDelete}
                        setShowDrawer={setShowDrawer}
                        selectedProduct={selectedProduct}
                        fetchProducts={fetchProducts}
                    />
                </DrawerComponent>
                <ConfirmationModal
                    message="Are you sure you want to delete this product?"
                    onConfirmation={onConfirmation}
                    showModal={showModal}
                    toggleModal={toggleModal}
                />
            </Container>
        </div>
    )
}

export default ProductList;
