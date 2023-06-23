import React, {useState, useEffect, PropsWithChildren} from 'react';
import ErrorText from '../../components/errorText';
import { autoComplete } from '../../utils/autocomplete';

interface CustomLeadDataI {
    name: string,
    email: string,
    phone: string,
}

interface CustomFieldsT{
    name: string,
    type: string,
    label: string,
    value: string,
    read_only: boolean,
    isRequired: boolean,
    options: Array<string>,
}

interface PropsT {
    isEditMode: boolean
}

const CustomLeadForm: React.FC<PropsWithChildren<PropsT>> = () => {

    const [customFields, setCustomFields] = useState<Array<CustomFieldsT>>([]);
    const [values, setValues] = useState({
        search_input: ''
    })
    const [leadData, setLeadData] = useState<CustomLeadDataI>({
        name: '',
        email: '',
        phone: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        phone: '',
    });

    useEffect(() => {
        let userPreferences = JSON.parse(localStorage.getItem('user_preferences') || '');
        setCustomFields(userPreferences.custom_form);
    }, []);

    const handleSelection = (val: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(val);
    }

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            search_input: e?.currentTarget?.value
        });
    }

    const getPlaces = async () => {
        let response = await autoComplete();
        console.log(response);
    }

    useEffect(() => {
        if (values?.search_input.length > 2) {
            getPlaces();
        }
    }, [values])

    const renderCustomFields = () => (
        // eslint-disable-next-line array-callback-return
        customFields?.map((fields) => {
            if (fields.type === 'selection') {
                return (
                    <div className="form-group">
                        <label className="form-label">{fields?.label}</label>
                        {fields.isRequired && <label style={{ color: "red" }}>*</label>}
                        <select
                            name={fields?.name}
                            className="form-control"
                            onChange={(val) => handleSelection(val)}
                        >
                            {fields?.options?.map((option) => (
                                <option value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                )
            } else if(fields.type === 'location') {
                return (
                    <div className="form-group">
                        <label className="form-label">{fields?.label}</label>
                        {fields.isRequired && <label style={{ color: "red" }}>*</label>}
                        <input
                            name={fields?.name}
                            type="text"
                            id='search_input'
                            onChange={(e) => handleLocationChange(e)}
                            className="form-control"
                        />
                    </div>
                )
            }
        })
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setLeadData({
            ...leadData,
            [name]: value
        });
        setErrors({
            ...errors,
            [name]: null
        });
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    return (
        <form id="customLeadsForm" onSubmit={(e) => handleSubmit(e)} className="leadsform">
            <div className="form-container">
                <div className="product_group">
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <label style={{ color: "red" }}>*</label>
                        <input
                            name='name'
                            type="text"
                            className="form-control"
                            placeholder="Enter Name"
                            onChange={(e) => handleChange(e)}
                        />
                        {errors.name ? <ErrorText message={errors?.name} /> : ''}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email ID</label>
                        <input
                            name='email'
                            type="email"
                            className="form-control"
                            placeholder="Enter email ID"
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone</label>
                        <label style={{ color: "red" }}>*</label>
                        <input
                            name='phone'
                            type="text"
                            className="form-control"
                            placeholder="Enter phone"
                            onChange={(e) => handleChange(e)}
                        />
                        {errors.phone ? <ErrorText message={errors?.phone} /> : ''}
                    </div>
                    {renderCustomFields()}
                </div>
            </div>
        </form>
    )
}

export default CustomLeadForm;
