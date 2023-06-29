/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";
import { Row, Col, Container } from 'reactstrap';
import Header from '../../components/header';
import { getCategoryDetail, updateCategory } from '../../services/categoryService';

interface CategoryData {
    categoryName: string,
    color: string,
}

const EditCategory: React.FC = () => {

    const [categoryData, setCategoryData] = useState<CategoryData>({
        categoryName: '',
        color: '',
    });
    const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
    const params = useParams();
    const navigate = useNavigate();

    const fetchCategoryDetail = async () => {
        const response = await getCategoryDetail(params?.id || '');
        if (response && response.status) {
            setCategoryData({
                ...categoryData,
                categoryName: response?.data?.data?.name,
                color: response?.data?.data?.color
            });
        }
    }

    useEffect(() => {
        fetchCategoryDetail();
    }, [params?.id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setCategoryData({
            ...categoryData,
            [name]: value
        });
    }

    const handleClick = () => {
        setDisplayColorPicker(true);
    }

    const handleChangeComplete = (color: { hex: string; }) => {
        setCategoryData({
            ...categoryData,
            color: color?.hex
        })
        setDisplayColorPicker(false);
    }

    const onUpdate =async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            const res = await updateCategory(params?.id || '', {
                color: categoryData?.color
            });
            if (res && res.status) {
                toast.success(res?.data?.message);
                navigate('/categories');
            }
        } catch (err) {
            toast.error('Error while updating category');
        }
    }

    return (
        <div id="main" className="main">
            <Header />
            <Container fluid>
                <Row>
                    <Col md="6">

                        <form>
                            <div className="row form-container mt-1 p-3">
                                <div className="form-group">
                                    <label>Category</label>
                                    <input
                                        name='categoryName'
                                        className="form-control mt-1"
                                        type="text"
                                        readOnly
                                        placeholder="Enter Category Name"
                                        onChange={(val) => handleChange(val)}
                                        value={categoryData?.categoryName}
                                    />
                                </div>
                                <div className="form-group mt-1 w-50">
                                    <label>Color</label>
                                    <button className='form-control mt-1' type="button" onClick={() => handleClick()}>Choose color</button>
                                    {displayColorPicker ?
                                        <ChromePicker
                                            onChangeComplete={handleChangeComplete}
                                            color={categoryData?.color}
                                        />
                                        : ''}
                                    {categoryData?.color && <div className='mt-2' style={{ width: 25, height: 25, borderRadius: 4, backgroundColor: categoryData?.color }} />}
                                </div>
                            </div>
                            <div className='d-flex justify-content-center w-100 mb-2'>
                                <button type='submit' onClick={(e) => onUpdate(e)} className="btn btn-dark login-btnm-2">Update Category</button>
                            </div>
                        </form>
                    </Col>
                </Row>
            </Container>
            <Toaster />
        </div>
    );
}

export default EditCategory;
