import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Card, Col, Container, ListGroup, ListGroupItem, Row } from 'reactstrap';
import ConfirmationModal from '../../components/confirmationModal';
import DrawerComponent from '../../components/drawer';
import Header from '../../components/header';
import { deleteCategory, getAllCategories } from '../../services/categoryService';
import Pagination from "react-js-pagination";
import AddEditCategory from './addCategory';

interface CategoryI {
    _id: string,
    name: string,
    color: string,
    productCount: number
}

const CategoryList: React.FC = () => {

    const [categories, setCategories] = React.useState<Array<CategoryI>>([]);
    const [categoryId, setCategoryId] = React.useState<string>('');
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const [openWithHeader, setOpenWithHeader] = React.useState<boolean>(false);
    const [activePage, setActivePage] = React.useState<number>(1);
    const [totalRecords, setTotalRecords] = React.useState<number>();
    const [mode, setMode] = React.useState<string>('');

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories({
                orderBy: '_id',
                isAscending: false,
                page: activePage,
                perPage: 15
            });
            if (response && response.status) {
                setCategories(response?.data?.data);
                setTotalRecords(response?.data?.total);
            }
        } catch (err) {}
    }

    useEffect(() => {
        fetchCategories();
    }, [activePage]);

    const handlePageChange = (pageNumber: number) => {
        setActivePage(pageNumber);
    }

    const addNewCategory = () => {
        setOpenWithHeader(true);
        setMode('add');
    }

    const onEdit = (id: string) => {
        setOpenWithHeader(true);
        setMode('edit');
        setCategoryId(id);
    }

    const onDelete = (id: string) => {
        setCategoryId(id);
        setShowModal(true);
    }

    const onConfirmation = async () => {
        try {
            const resp = await deleteCategory(categoryId);
            if (resp && resp.status) {
                toast.success(resp?.data?.message);
                setOpenWithHeader(false);
                fetchCategories();
            }
        } catch (err) {
            toast.error('Error while deleting category');
        }
        setShowModal(false);
    }

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    const renderCategories = () => (
        categories?.map((category) => {
            return (
                <Card key={category?._id} onClick={() => onEdit(category?._id)} className="main-card mb-3">
                    <ListGroupItem>
                        <div className="widget-content p-0">
                            <div className="widget-content-wrapper">
                                <div className="widget-content-left m-3">
                                    <div className="widget-heading">
                                        {category?.name}
                                    </div>
                                    <div className="widget-subheading">
                                        {category?.productCount} Products
                                    </div>
                                </div>
                                <div className="widget-content-right d-flex">
                                    <div
                                        style={{ backgroundColor: category?.color, width: 25, height: 25, borderRadius: 4, border: '1px solid #111' }}
                                    />
                                    {/* <div className='widget_content_btn'>
                                        <i onClick={() => onEdit(category?._id)} className="bi bi-pencil ms-3 mt-1 cursor-pointer text-info"></i>
                                        <i onClick={() => onDelete(category?._id)} className='bi bi-trash ms-3 mt-1 text-danger cursor-pointer'></i>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </ListGroupItem>
                </Card>
            )
        })
    )

    return (
        <div id="main" className="main">
            <Header />
            <Container fluid>
                <Row>
                    <Col>
                        <ListGroup flush>
                            {renderCategories()}
                        </ListGroup>
                    </Col>
                    <Pagination
                        aria-label="Page navigation example"
                        itemClass="page-item"
                        linkClass="page-link"
                        prevPageText="Prev"
                        nextPageText="Next"
                        firstPageText="First"
                        lastPageText="Last"
                        activePage={activePage}
                        itemsCountPerPage={15}
                        totalItemsCount={totalRecords || 0}
                        pageRangeDisplayed={5}
                        onChange={handlePageChange}
                    />
                </Row>
                <div className="row">
                    <div className="addmessagesicon">
                        <i
                            className="bi bi-plus-circle-fill"
                            onClick={addNewCategory}
                        ></i>
                    </div>
                </div>
                <DrawerComponent
                    openWithHeader={openWithHeader}
                    setOpenWithHeader={setOpenWithHeader}
                    drawerTitle={mode === 'add' ? "Add Category" : "Update Category"}
                    size='xs'
                >
                    <AddEditCategory
                        id={categoryId}
                        mode={mode}
                        setOpenWithHeader={setOpenWithHeader}
                        fetchCategories={fetchCategories}
                        onDelete={onDelete}
                    />
                </DrawerComponent>
                <ConfirmationModal
                    onConfirmation={onConfirmation}
                    showModal={showModal}
                    toggleModal={toggleModal}
                    message={'Are you sure you want to delete this category'}
                />
            </Container>
        </div>
    );
}

export default CategoryList;