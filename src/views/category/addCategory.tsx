import React, { useState, PropsWithChildren, useEffect } from 'react';
import { ChromePicker } from 'react-color'
import { toast } from 'react-toastify';
import { createNewCategory, getCategoryDetail, updateCategory } from '../../services/categoryService';

interface CategoryData {
    categoryName: string,
    color: string,
}

interface Props {
    fetchCategories: () => void,
    setOpenWithHeader: React.Dispatch<React.SetStateAction<boolean>>,
    mode: string,
    id: string,
    onDelete: (id: string) => void
}

const AddEditCategory: React.FC<PropsWithChildren<Props>> = ({ fetchCategories, setOpenWithHeader, mode, id, onDelete }) => {
    const [categoryData, setCategoryData] = useState<CategoryData>({
        categoryName: '',
        color: '',
    });
    const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);

    const fetchCategoryDetail = async () => {
        if (mode === 'edit') {
            const response = await getCategoryDetail(id || '');
            if (response && response.status) {
                setCategoryData({
                    ...categoryData,
                    categoryName: response?.data?.data?.name,
                    color: response?.data?.data?.color
                });
            }
        }
    }

    useEffect(() => {
        fetchCategoryDetail();
    }, [])

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

    const onAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (mode === 'add') {
            try {
                const res = await createNewCategory({
                    name: categoryData?.categoryName,
                    color: categoryData?.color
                });
                if (res && res.status) {
                    toast.success(res?.data?.message);
                    fetchCategories();
                    setOpenWithHeader(false);
                }
            } catch (err) {
                toast.error('Error while creating new category!');
            }
        } else {
            try {
                const res = await updateCategory(id || '', {
                    color: categoryData?.color
                });
                if (res && res.status) {
                    toast.success(res?.data?.message);
                    fetchCategories();
                    setOpenWithHeader(false);
                }
            } catch (err) {
                toast.error('Error while updating category');
            }
        }
    }

    return (
        <form id="addQuotationForm" onSubmit={(evt) => onAddCategory(evt)} className="addcategory">
            <div className="form-container">
                {mode === 'edit' && <div className="d-flex justify-content-between align-items-center">
                    <i
                        className="fa fa-trash-o"
                        style={{ color: "red", fontSize: "23px", cursor: "pointer" }}
                        onClick={() => onDelete(id)}
                    />
                </div>}
                <div className="product_group">
                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <input
                            name='categoryName'
                            className="form-control"
                            type="text"
                            placeholder="Enter Category Name"
                            onChange={(val) => handleChange(val)}
                            value={categoryData?.categoryName}
                            readOnly={mode === 'edit'}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Color</label>
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
                <div className='d-flex justify-content-center w-100'>
                <button type='submit' className="btn btn-dark login-btnm-2">{mode === 'add' ? 'Add' : 'Update'} Category</button>
            </div>
            </div>
        </form>
    )
}

export default AddEditCategory;
