import React, { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

const Drawer: React.FC = () => {

    const [teamMembers, setTeamMembers] = useState<Array<{}>>([]);
    const [leadsView, setLeadsView] = useState<Array<{}>>([]);
    const options = [
        { label: 'Disable the input', name: 'disabled' },
        { label: 'Dropup menu', name: 'dropup' },
        { label: 'Flip the menu position when it reaches the viewport bounds', name: 'flip' },
        { label: 'Require minimum input before showing results (2 chars)', name: 'minLength' },
        { label: 'Highlight the only result', name: 'highlightOnlyResult' },
        { label: 'Force the menu to stay open', name: 'open' },
    ];
    const members = [
        { label: 'Disable the input', name: 'disabled' },
        { label: 'Dropup menu', name: 'dropup' },
        { label: 'Flip the menu position when it reaches the viewport bounds', name: 'flip' },
        { label: 'Require minimum input before showing results (2 chars)', name: 'minLength' },
        { label: 'Highlight the only result', name: 'highlightOnlyResult' },
        { label: 'Force the menu to stay open', name: 'open' },
    ];

    const resetFilter = () => {
        console.log("filter reset");
    }

    const applyFilter = () => {
        console.log("filter applied");
    }

    return (
        <div className="offcanvas offcanvas-end w-50 " tabIndex={-1} id={'LeadsFilter'} aria-labelledby="offcanvasRightLabel">
            <div className="offcanvas-header">
                <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <div className="row">
                    <div className="col-md-12">
                        <form id="LeadsFilterForm">
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-12 form-group mt-1">
                                    <label htmlFor="lead-date" className="form-label">Sort</label>
                                    <select className='form-control' defaultValue={"Select"}>
                                        <option  disabled value="Select">Select sorting</option>
                                        <option value="1">test1</option>
                                        <option value="2">test2</option>
                                    </select>
                                </div>
                                <div className="col-12 form-group mt-1">
                                    <label className="form-label">Date</label>
                                    <select className='form-control'>
                                        <option value="7 day">Last 7 days</option>
                                        <option value="2 week">Last 2 weeks</option>
                                        <option value="1 month">Last 1 month</option>
                                    </select>
                                </div>
                                <div className="col-12 form-group mt-1">
                                    <label className="form-label">Label</label>
                                    <select className='form-control' defaultValue={"7 day"}>
                                        <option value="7 day">Last 7 days</option>
                                        <option value="2 week">Last 2 weeks</option>
                                        <option value="1 month">Last 1 month</option>
                                    </select>
                                </div>
                                <div className="col-12 form-group mt-1">
                                    <label className="form-label">Status</label>
                                    <select className='form-control' defaultValue={"4"}>
                                        <option value="4">test4</option>
                                        <option value="5">test5</option>
                                        <option value="6">test6</option>
                                    </select>
                                </div>
                                <div className="col-12 form-group mt-1">
                                    <label className="form-label">Label</label>
                                    <select className='form-control' defaultValue={"7 day"}>
                                        <option value="7 day">Last 7 days</option>
                                        <option value="2 week">Last 2 weeks</option>
                                        <option value="1 month">Last 1 month</option>
                                    </select>
                                </div>
                                <div className="col-12 form-group mt-1">
                                    <label className="form-label">Facebook page</label>
                                    <select className='form-control' defaultValue={"test11"}>
                                        <option value="test11">test11</option>
                                        <option value="test22">test22</option>
                                        <option value="test33">test33</option>
                                    </select>
                                </div>
                                <div className="col-12 form-group mt-1">
                                    <label>Team members</label>
                                    <Typeahead
                                        id="basic-typeahead-multiple"
                                        labelKey="name"
                                        multiple
                                        onChange={setTeamMembers}
                                        options={options}
                                        placeholder="Select team members"
                                        selected={teamMembers}
                                    />
                                </div>
                                <div className="col-12 form-group mt-1">
                                    <label>Leads view</label>
                                    <Typeahead
                                        id="basic-typeahead-multiple"
                                        labelKey="name"
                                        multiple
                                        onChange={setLeadsView}
                                        options={members}
                                        placeholder="Select team members"
                                        selected={leadsView}
                                    />
                                </div>
                                <div className="col-12 form-group mt-1">
                                    <label className="form-label">Follow-ups</label>
                                    <select className='form-control' defaultValue={"test111"}>
                                        <option value="test111">test111</option>
                                        <option value="test222">test222</option>
                                        <option value="test333">test333</option>
                                    </select>
                                </div>
                                <div className="col-12 form-group mt-1">
                                    <label className="form-label">Custom fields</label>
                                    <select className='form-control' defaultValue={"testData111"}>
                                        <option value="testData111">testData111</option>
                                        <option value="testData222">testData222</option>
                                        <option value="testData333">testData333</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="reset" className="btn LeadsFilterReset" onClick={resetFilter}>Reset</button>
                            <button type="button" className="btn LeadsFilterApply" onClick={applyFilter}>Apply</button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Drawer;
