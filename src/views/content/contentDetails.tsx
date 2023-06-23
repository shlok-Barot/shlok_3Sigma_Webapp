import React, { useCallback, useEffect, useState } from 'react';
import Header from '../../components/header';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import classnames from 'classnames';
import { faEye, faFile, faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import { getContentById } from '../../services/contentService';
import { ContentI } from './content';

const ContentDetail: React.FC = () => {

    const [activeTab, setActiveTab] = useState<number>(1);
    const [contentDetail, setContentDetail] = useState<ContentI>();
    const params = useParams();

    const getContentDetail = useCallback(async() => {
        try {
            const response = await getContentById(params?._id || '');
            if (response && response.status) {
                setContentDetail(response?.data?.data);
            }
        }catch(err) {}
    }, [params?._id])

    useEffect(() => {
        getContentDetail();
    }, [getContentDetail]);

    const toggle = (tab: number) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    }

    const MessageContentDetail = () => (
        <Col sm="8">
            <label className='my-2'>Message template</label>
            <Card className="main-card">
                <ListGroup flush>
                    <ListGroupItem>
                        <div className="widget-content p-0">
                            <div className="widget-content-wrapper">
                                <div className="widget-content-left">
                                    <div className="widget-heading">
                                        {contentDetail?.details?.title}
                                    </div>
                                    <div className="widget-subheading mt-1">
                                        <div className='d-flex justify-content-between my-2'>
                                            {contentDetail?.details?.tag?.map((itm) => {
                                                return (
                                                    <strong>
                                                        <FontAwesomeIcon icon={faTag} />{" "} {itm?.tag}
                                                    </strong>
                                                );
                                            })}
                                            {/* <strong>{contentDetail?.details?.tag}</strong> */}
                                            <span>
                                                <FontAwesomeIcon icon={faFile} />
                                            </span>
                                        </div>
                                        <p>{contentDetail?.details?.description}</p>
                                    </div>
                                    <div className="widget-subheading mt-1">
                                        <p>Insert @lead name</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ListGroupItem>
                </ListGroup>
            </Card>
        </Col>
    )

    return (
        <div id="main" className="main">
            <Header />
            <div>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === 1 })}
                            onClick={() => { toggle(1) }}
                        >
                            Messages
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === 2 })}
                            onClick={() => { toggle(2) }}
                        >
                            Files
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === 3 })}
                            onClick={() => { toggle(3) }}
                        >
                            Pages
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent className='m-2' activeTab={activeTab}>
                    <TabPane tabId={1}>
                        <Row>
                            {MessageContentDetail()}
                            <Col sm="4">
                                <label className='my-2'>Sharing history</label>
                                <Card className="main-card">
                                    <ListGroup flush>
                                        <ListGroupItem>
                                            <div className="widget-content p-0">
                                                <div className="widget-content-wrapper">
                                                    <div className="widget-content-left">
                                                        <div className="widget-heading d-flex justify-content-between">
                                                            Shared 20 times
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </ListGroupItem>
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId={2}>
                        <Row>
                            <Col sm="8">
                                <label className='my-2'>File details</label>
                                <Card className="main-card">
                                    <ListGroup flush>
                                        <ListGroupItem>
                                            <div className="widget-content p-0">
                                                <div className="widget-content-wrapper d-flex justify-content-center">
                                                    <div className="widget-content-left">
                                                        <div className="widget-heading">
                                                            <img src='assets/img/3sigma_logo.png' alt='demo' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="widget-subheading my-3 d-flex justify-content-center align-items-center">
                                                    <FontAwesomeIcon icon={faEye} />
                                                    <span className='mx-1'>{' '} preview</span>
                                                </div>
                                            </div>
                                        </ListGroupItem>
                                    </ListGroup>
                                </Card>
                            </Col>
                            <Col sm="4">
                                <label className='my-2'>Sharing history</label>
                                <Card className="main-card">
                                    <ListGroup flush>
                                        <ListGroupItem>
                                            <div className="widget-content p-0">
                                                <div className="widget-content-wrapper">
                                                    <div className="widget-content-left">
                                                        <div className="widget-heading d-flex justify-content-between">
                                                            Shared 20 times
                                                            {/* <span>
                                                                {' '}<FontAwesomeIcon icon={faArrowRight} />
                                                            </span> */}
                                                        </div>
                                                        <div className="widget-heading d-flex justify-content-between">
                                                            Opened 10 times
                                                            {/* <span>
                                                                {' '}<FontAwesomeIcon icon={faArrowRight} />
                                                            </span> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </ListGroupItem>
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId={3}>
                        <Row>
                            <Col sm="8">
                                <label className='my-2'>Page details</label>
                                <Card className="main-card">
                                    <ListGroup flush>
                                        <ListGroupItem>
                                            <div className="widget-content p-0">
                                                <div className="widget-content-wrapper">
                                                    <div className="widget-content-left">
                                                        <div className="widget-heading">
                                                            Page title
                                                        </div>
                                                        <div className="widget-subheading mt-1">
                                                            <div className='d-flex justify-content-between my-2'>
                                                                <strong>Tag</strong>
                                                            </div>
                                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                                        </div>
                                                        <div className="widget-subheading my-3 d-flex justify-content-center align-items-center">
                                                            <FontAwesomeIcon icon={faEye} />
                                                            <span className='mx-1'>{' '} preview</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </ListGroupItem>
                                    </ListGroup>
                                </Card>
                            </Col>
                            <Col sm="4">
                                <label className='my-2'>Sharing history</label>
                                <Card className="main-card">
                                    <ListGroup flush>
                                        <ListGroupItem>
                                            <div className="widget-content p-0">
                                                <div className="widget-content-wrapper">
                                                    <div className="widget-content-left">
                                                        <div className="widget-heading d-flex justify-content-between">
                                                            Shared 20 times
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </ListGroupItem>
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </div>
        </div>
    );
}

export default ContentDetail;
