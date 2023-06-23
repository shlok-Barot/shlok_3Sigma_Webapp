import _ from 'lodash';
import moment from 'moment';
import React, { PropsWithChildren } from 'react';
import { TiVideoOutline, TiPhoneOutline } from 'react-icons/ti';

import { IoChatbubbleOutline, IoReload } from 'react-icons/io5';
import { MdSend } from 'react-icons/md';
import { HiOutlineMailOpen } from 'react-icons/hi';

interface TaskItemsI {
    task: {
        assignedTo: Array<string>,
        createdAt: Date,
        createdBy: string,
        lead: string,
        toBePerformAt: Date,
        type: string
    },
    // handleTaskClick: React.MouseEvent
}

const TaskItem: React.FC<PropsWithChildren<TaskItemsI>> = ({ task }) => {
    const leadTaskFormat = (taskType: string) => {
        switch (taskType) {
            case 'follow_up':
                return {
                    baseCol: '#ed66ff',
                    ltCntColor: '#fbd9ff',
                    ltCntIcon: (
                        <IoReload
                            name={'reload'}
                            color={'#ed66ff'}
                            size={40}
                        />
                    ),
                    rtCntIcon: (
                        <IoReload
                            name={'reload'}
                            color={'#000'}
                            size={40}
                        />
                    ),
                    title: 'Follow Up',
                };
            case 'send':
                return {
                    baseCol: '#599aff',
                    ltCntColor: '#d4e4ff',
                    ltCntIcon: (
                        <MdSend
                            name={'send'}
                            color={'#599aff'}
                            size={40}
                        />
                    ),
                    rtCntIcon: (
                        <MdSend
                            name={'send'}
                            color={'#000'}
                            size={40}
                        />
                    ),
                    title: 'Send',
                };
            case 'call':
                return {
                    // baseCol: theme.colors.themeCol2,
                    // ltCntColor: theme.colors.themeCol2,
                    ltCntIcon: (
                        <TiPhoneOutline
                            name={'phone-outline'}
                            color={'#fff'}
                            size={40}
                        />
                    ),
                    rtCntIcon: (
                        <TiPhoneOutline
                            name={'phone-outline'}
                            color={'#000'}
                            size={40}
                        />
                    ),
                    title: 'Call',
                };
            case 'email':
                return {
                    baseCol: '#FFAD01',
                    ltCntColor: '#FFAD01',
                    ltCntIcon: (
                        <HiOutlineMailOpen
                            name={'email-outline'}
                            color={'#fff'}
                            size={40}
                        />
                    ),
                    rtCntIcon: (
                        <HiOutlineMailOpen
                            name={'email-outline'}
                            color={'#000'}
                            size={40}
                        />
                    ),
                    title: 'Email',
                };
            case 'message':
                return {
                    baseCol: '#FF216A',
                    ltCntColor: '#FF216A',
                    ltCntIcon: (
                        <IoChatbubbleOutline
                            name={'chatbubble-outline'}
                            color={'#fff'}
                            size={40}
                        />
                    ),
                    rtCntIcon: (
                        <IoChatbubbleOutline
                            name={'chatbubble-outline'}
                            color={'#000'}
                            size={40}
                        />
                    ),
                    title: 'Message',
                };
            case 'video_call':
                return {
                    // baseCol: theme.colors.themeCol1,
                    // ltCntColor: theme.colors.themeCol1,
                    ltCntIcon: (
                        <TiVideoOutline
                            name={'video-outline'}
                            color={'#fff'}
                            size={40}
                        />
                    ),
                    rtCntIcon: (
                        <TiVideoOutline
                            name={'video-outline'}
                            color={'#000'}
                            size={40}
                        />
                    ),
                    title: 'Video Call',
                };
            default:
                return {}
        }
    };

    const formatting = leadTaskFormat(task.type);
    return (
        <div className="note-popup-section-4-right-1">
            <div className="row justify-content-between align-items-center">
                <div className='col-md-10 d-flex align-items-center'>
                    <div className="note-popup-icon-1" style={{
                        backgroundColor: formatting.ltCntColor || '#3faefd'
                    }}>
                        {/* <i className="bi bi-chat"></i> */}
                        {formatting.ltCntIcon}
                    </div>
                    <div className="ms-4 note-popup-center-text">
                        <h1>{_.capitalize(task.type)} </h1>
                        <h2>{task.assignedTo.map((dt) => dt)}</h2>
                        <h3>Owner : {task.createdBy || 'NA'}</h3>
                        <small>{moment(task.toBePerformAt,).format('DD MMMM YYYY hh:mm A')}</small>
                    </div>
                </div>
                <div className="col-md-2 note-popup-icon-2">
                    <i className="bi bi-pencil" data-bs-toggle="modal" data-bs-target="#AddNewTask" />
                </div>
            </div>
        </div>);
};

export default TaskItem;