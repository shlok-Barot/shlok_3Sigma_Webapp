import React from 'react';
import Switch from '../../components/switch';

const EditList: React.FC = () => {

    const handleChange = (e: React.SyntheticEvent<Element, Event>) => {}

    return (
        <>
         <form className="addleadsform">
         <div className="form-container">
                <div className="product_group">
                    <div className="form-group">
                        <label className="form-label">List Name</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter list name" />
                        {/*{errors.name ? <ErrorText message={errors?.name} /> : ''} */}
                    </div>
                    <h3>List lead distribution</h3>
                    <div className="form-group2">
                        <div className='d-flex justify-content-between'>
                            <p>Round Robin</p>
                            <Switch
                                checked={true}
                                onChange={(e) => handleChange(e)}
                                name="round_robin" offstyle={''} onstyle={''} value={undefined} />
                        </div>
                    </div>
                    <div className="form-group2">
                        <div className='d-flex justify-content-between'>
                            <p>Weighted</p>
                            <Switch
                                checked={false}
                                onChange={(e) => handleChange(e)}
                                name="weighted" offstyle={''} onstyle={''} value={undefined} />
                        </div>
                    </div>
                    <div className="form-group2">
                        <div className='d-flex justify-content-between'>
                            <p>Employee1</p>
                            <Switch
                                checked={false}
                                onChange={(e) => handleChange(e)}
                                name="weighted" offstyle={''} onstyle={''} value={undefined} />
                        </div>
                    </div>
                    <div className="form-group2">
                        <div className='d-flex justify-content-between'>
                            <p>Employee2</p>
                            <Switch
                                checked={false}
                                onChange={(e) => handleChange(e)}
                                name="weighted" offstyle={''} onstyle={''} value={undefined} />
                        </div>
                    </div>
                    <div className="form-group2">
                        <div className='d-flex justify-content-between'>
                            <p>Employee3</p>
                            <Switch
                                checked={false}
                                onChange={(e) => handleChange(e)}
                                name="weighted" offstyle={''} onstyle={''} value={undefined} />
                        </div>
                    </div>
                    <h3>Accessibility settings:</h3>
                    <div className="form-group2">
                        <div className='d-flex justify-content-between'>
                            <p>Employee1</p>
                            <Switch
                                checked={false}
                                onChange={(e) => handleChange(e)}
                                name="weighted" offstyle={''} onstyle={''} value={undefined} />
                        </div>
                    </div>
                    <div className="form-group2">
                        <div className='d-flex justify-content-between'>
                            <p>Employee2</p>
                            <Switch
                                checked={false}
                                onChange={(e) => handleChange(e)}
                                name="weighted" offstyle={''} onstyle={''} value={undefined} />
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-center w-100'>
                    <button type="reset" className="btn LeadsFilterApply">Update List</button>
                </div>
            </div>
         </form>
        </>
    )
}

export default EditList;
