import React, { useCallback, useEffect, useState } from 'react';
import Header from '../../components/header';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { deleteContent, getAllContent } from '../../services/contentService';
import { toast } from 'react-toastify';
import DrawerComponent from '../../components/drawer';
import './content.scss';
import AddEditContent from './addContent';
import ShareContent from './shareContent';
import ConfirmationModal from '../../components/confirmationModal';

export interface ContentI {
    details: {
        title: string,
        tag: Array<any>,
        description: string,
    }
    _id: string,
};

const Content: React.FC = () => {

    const [activeTab, setActiveTab] = useState<number>(1);
    const [content, setContent] = useState<Array<ContentI>>([]);
    const [openWithHeader, setOpenWithHeader] = React.useState<boolean>(false);
    const [openShareDrawer, setOpenShareDrawer] = React.useState<boolean>(false);
    const [mode, setMode] = React.useState<string>('');
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const [contentId, setContentId] = React.useState<string>('');

    const fetchContent = useCallback(async () => {
        const data = {
            isAscending: false,
            page: 1,
            perPage: 15,
            type: activeTab === 1 ? 'message' : activeTab === 2 ? 'file' : 'page'
        };
        const response = await getAllContent(data);
        
        if (response && response.status) {
            setContent(response?.data?.data);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    const addNewContent = () => {
        setOpenWithHeader(true);
        setMode('add');
    }

    const onContentDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
        setShowModal(true);
        e.stopPropagation();
        setContentId(id);
    }

    const onConfirmation = async () => {
        try {
            const res = await deleteContent(contentId);
            if (res && res.status) {
                toast.success(res?.data?.message);
                fetchContent();
            }
        } catch (err) {
            toast.error('error while deleting content');
        }
        setShowModal(false);
    }

    const MessageContent = () => {
        return content?.map((item) => (
            <Col key={item?._id} sm="12" md="6">
                <Card className='main_card'>
                    <div className='card_header'>
                        <h4>{item?.details?.title}</h4>
                        {/* {item?.details?.tag.map((tagline) => (
                            <span>{tagline?.tag}</span>
                        ))} */}
                    </div>
                    <div className='card_footer'>
                        <p>{item?.details?.description}</p>
                        <div className='button_section'>
                            <button onClick={() => onShare()} className="btn btn-default m-2"><i className="bi bi-share text-info"></i></button>
                            <button onClick={() => onEdit(item?._id)} className="btn btn-default m-2"><i className='bi bi-pencil text-info'></i></button>
                            <button onClick={(e) => onContentDelete(e, item?._id)} type='submit' className="btn delete btn-default m-2"><i className='bi bi-trash text-danger'></i></button>
                        </div>
                    </div>
                </Card>
            </Col>
        ))
    };

    const PageContent = () => {
        return content?.map((page) => (
            <Col key={page?._id} sm="12" md="6">
                 <Card className='main_card'>
                    <div className='card_header'>
                        <h4>{page?.details?.title}</h4>
                        {/* {page?.details?.tag.map((tagline) => {
                            return <span>{tagline?.tag}</span>
                        })} */}
                    </div>
                    <div className='card_footer'>
                        <p>{page?.details?.description}</p>
                        <div className='button_section'>
                            <button onClick={() => onShare()} className="btn btn-default m-2"><i className="bi bi-share text-info"></i></button>
                            <button onClick={() => onEdit(page?._id)} className="btn btn-default m-2"><i className='bi bi-pencil text-info'></i></button>
                            <button onClick={(e) => onContentDelete(e, page?._id)} className="btn delete btn-default m-2"><i className='bi bi-trash text-danger'></i></button>
                        </div>
                    </div>
                </Card>
            </Col>
        ))
    };

    const fileContent = () => (
        content?.map((file) => (
            <Col sm="12" md="6">
                 <Card className='main_card'>
                    <div className='card_header'>
                        <h4>{file?.details?.title}</h4>
                        {/* {file?.details?.tag.map((tagline) => {
                            return <span>{tagline?.tag}</span>
                        })} */}
                    </div>
                    <div className='card_footer'>
                        <p>{file?.details?.description}</p>
                        <div className='button_section'>
                            <button onClick={() => onShare()} className="btn btn-default m-2"><i className="bi bi-share text-info"></i></button>
                            <button onClick={() => onEdit(file?._id)} className="btn btn-default m-2"><i className='bi bi-pencil text-info'></i></button>
                            <button onClick={(e) => onContentDelete(e, file?._id)} className="btn delete btn-default m-2"><i className='bi bi-trash text-danger'></i></button>
                        </div>
                    </div>
                </Card>
            </Col>
        ))
    )

    const toggle = (tab: number) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
            setContent([]);
        }
    }

    const onEdit = (id: string) => {
        setOpenWithHeader(true);
        setMode('edit');
        setContentId(id);
    }

    const onShare = () => {
        setOpenShareDrawer(true);
    }

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    return (
        <div id="main" className="main content_page">
            <Header />
            <div className='content_tab'>
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
                            {MessageContent()}
                        </Row>
                    </TabPane>
                    <TabPane tabId={2}>
                        <Row>
                            {fileContent()}
                        </Row>
                    </TabPane>
                    <TabPane tabId={3}>
                        <Row>
                            {PageContent()}
                        </Row>
                    </TabPane>
                </TabContent>
            </div>
            <div className="row">
                <div className="addmessagesicon">
                    <i
                        className="bi bi-plus-circle-fill"
                        onClick={() => addNewContent()}
                    ></i>
                </div>
            </div>
            <DrawerComponent
                openWithHeader={openWithHeader}
                setOpenWithHeader={setOpenWithHeader}
                drawerTitle={ activeTab === 1 ?
                    `${mode === 'add' ? 'Add' : 'Update'} Message` : activeTab === 2 ?
                    `${mode === 'add' ? 'Add' : 'Update'} File` :
                    `${mode === 'add' ? 'Add' : 'Update'} Page` }
                size="xs"
            >
                <AddEditContent contentId={contentId} mode={mode} activeTab={activeTab} fetchContent={fetchContent} setOpenWithHeader={setOpenWithHeader} />
            </DrawerComponent>

            <DrawerComponent
                openWithHeader={openShareDrawer}
                setOpenWithHeader={setOpenShareDrawer}
                drawerTitle={activeTab === 1 ? 'Share Message' : activeTab === 2 ? 'Share File' : 'Share Page'}
                size='xs'
            >
                <ShareContent />
            </DrawerComponent>
            <ConfirmationModal
                onConfirmation={onConfirmation}
                showModal={showModal}
                toggleModal={toggleModal}
                message={'Are you sure you want to delete this content'}
            />
        </div>
    );
}

export default Content;
