import React, { useEffect, useCallback, useState, PropsWithChildren } from 'react';
import Switch from '../../components/switch';
import { getAllTeams } from '../../services/teamsService';
import ErrorText from '../../components/errorText';
import { createLeadList } from '../../services/leadListService';
import { toast } from 'react-toastify';

interface TeamMembersT {
    _id: string,
    name: string,
    organization: string
}

interface Props {
    mode: string,
    getLeadList: () => void,
    setShowAddListDrawer: React.Dispatch<React.SetStateAction<boolean>>
}

const AddEditList: React.FC<PropsWithChildren<Props>> = ({ mode, getLeadList, setShowAddListDrawer }) => {

    const [teamMembers, setTeamMembers] = useState<Array<TeamMembersT>>([]);
    const [enableLeadDistribution, setEnableLeadDistribution] = useState<boolean>(false);
    const [roundRobin, setRoundRobin] = useState<boolean>(false);
    const [distributionType, setDistributionType] = useState<string>('');
    const [weighted, setWeighted] = useState<boolean>(false);
    const [listName, setListName] = useState<string>("");
    const [checkedState, setCheckedState] = useState<Array<boolean>>([]);
    const [weightedState, setWeightedState] = useState<Array<number>>([]);
    const [recipients, setRecipients] = useState<Array<string>>([]);
    const [error, setError] = useState({
        listName: ''
    });

    const fetchTeams = useCallback(async () => {
        try {
            const response = await getAllTeams();
            if (response && response.status) {
                setTeamMembers(response?.data?.data);
                setCheckedState(new Array(response.data.data.length).fill(false));
                setWeightedState(new Array(response.data.data.length).fill(0));
            }
        } catch (err) {}
    }, []);

    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    const onEnterListName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setListName(e?.currentTarget?.value);
        setError({ ...error, listName: '' });
    }

    const toggleLeadDistribution = () => { setEnableLeadDistribution(!enableLeadDistribution)};

    const toggleRoundRobin = () => {
        setRoundRobin(!roundRobin);
        setDistributionType('round robin');
        setWeighted(false);
    };

    const toggleWeighted = () => {
        setWeighted(!weighted);
        setDistributionType('weighted');
        setRoundRobin(false);
    };

    const handleChange = (name: string,position: number) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
        updatedCheckedState.map((checked) => {
            if(checked) {
                setRecipients([
                    ...recipients,
                    name
                ]);
            }
        });
    };

    const renderTeamMembers = () => (
        teamMembers?.map((member, index) => (
            <div className="form-group2">
                <div className='d-flex justify-content-between'>
                    <p>{member?.name}</p>
                    {roundRobin && <Switch
                        checked={checkedState[index]}
                        value={member?._id}
                        onChange={(e)=> handleChange(member._id, index)}
                        name="weighted" offstyle={''} onstyle={''} />}

                    {weighted && <div className="countincrement">
                        <button type='button' className='count_btn' onClick={() => incrementCount(member?._id, index)}>+</button>
                        <div className='countvalue'>{weightedState[index]}</div>
                        <button type='button' className='count_btn' onClick={() => decrementCount(member?._id, index)}>-</button>
                    </div>}
                </div>
            </div>
        ))
    );

    const onAddListClick = async () => {
        let obj: {};
        if (distributionType === 'round robin') {
            obj = recipients.reduce((accumulator, value) => {
                return {...accumulator, [value]: {
                    status: true
                }};
            }, {});
        } else {
            obj = recipients.reduce((accumulator, value) => {
                return {...accumulator, [value]: {
                    weighted: 1
                }};
            }, {});
        }
        if (listName) {
            const data = {
                name: listName,
                isDistributionActive: enableLeadDistribution,
                distributionType: distributionType,
                recipients: {
                    ids: obj
                }
            }
            try {
                const response = await createLeadList(data);
                if (response && response.status) {
                    getLeadList();
                    toast.success(response?.data?.message);
                    setShowAddListDrawer(false);
                }
            } catch (err) {
                toast.error('Error while adding lead list !');
            }
        } else {
            setError({
                ...error,
                listName: 'List Name is required'
            })
        }
    }

    function incrementCount(id: string, position: number) {
        const copyCounter = [...weightedState];
        const updatedWeightedState = checkedState.map((item, index) => {
            if (index === position) {
                copyCounter[index] += 1;
                return copyCounter[index];
            } else {
                return copyCounter[index];
            }
        });
        setWeightedState(updatedWeightedState);
        updatedWeightedState.map((weighted) => {
            if(weighted) {
                setRecipients([
                    ...recipients,
                    id
                ]);
            }
        });
    }

    function decrementCount(id: string, position: number) {
        const copyCounter = [...weightedState];
        const updatedWeightedState = checkedState.map((item, index) => {
            if (index === position && copyCounter[index] !== 0) {
                copyCounter[index] -= 1;
                return copyCounter[index];
            } else {
                return copyCounter[index];
            }
        });
        setWeightedState(updatedWeightedState);
        updatedWeightedState.map((weighted) => {
            if(weighted) {
                setRecipients([
                    ...recipients,
                    id
                ]);
            }
        });
    }

    return (
        <>
         <form className="addleadsform">
         <div className="form-container">
                <div className="product_group">
                    <div className="form-group">
                        <label className="form-label">List Name</label>
                        <label style={{ color: "red" }}>*</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter list name"
                            value={listName}
                            onChange={(e)=> onEnterListName(e)}
                        />
                        {error.listName ? <ErrorText message={error?.listName} /> : ''}
                    </div>
                    <div className="form-group2">
                        <div className='d-flex justify-content-between '>
                            <h4>Enable lead distribution</h4>
                            <div className='custom_switch'>
                            <Switch
                                checked={enableLeadDistribution}
                                onChange={() => toggleLeadDistribution()}
                                name="lead_distribution" offstyle={''} onstyle={''} value={undefined} />
                            </div>
                        </div>
                    </div>
                    {enableLeadDistribution &&
                        <>
                            <div className="form-group2">
                                <div className='d-flex justify-content-between'>
                                    <p>Round Robin</p>
                                    <div className='custom_switch'>
                                    <Switch
                                        checked={roundRobin}
                                        onChange={() => toggleRoundRobin()}
                                        name="round_robin" offstyle={''} onstyle={''} value={undefined} />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group2">
                                <div className='d-flex justify-content-between'>
                                    <p>Weighted</p>
                                    <div className='custom_switch'>
                                    <Switch
                                        checked={weighted}
                                        onChange={() => toggleWeighted()}
                                        name="weighted" offstyle={''} onstyle={''} value={undefined} />
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    {enableLeadDistribution && <h3>Team Members:</h3>}
                    {enableLeadDistribution && renderTeamMembers()}
                </div>
                <div className='d-flex justify-content-center w-100'>
                    <button
                        type="button"
                        onClick={() => onAddListClick()}
                        className="btn LeadsFilterApply"
                    >
                        {mode === 'add' ? 'Add List' : 'Update List'}
                    </button>
                </div>
            </div>
         </form>
        </>
    )
}

export default AddEditList;
