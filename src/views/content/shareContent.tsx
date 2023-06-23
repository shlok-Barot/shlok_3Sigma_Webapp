import classnames from 'classnames';
import React, { useState } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Row, Col } from 'reactstrap';

const ShareContent: React.FC = () => {

    const [activeTab, setActiveTab] = useState<number>(1);

    const toggle = (tab: number) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    }

    return (
       <div className="share_modal">
           <div className="content_tab">
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === 1 })}
                            onClick={() => { toggle(1) }}
                        >
                            Next 25
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === 2 })}
                            onClick={() => { toggle(2) }}
                        >
                            Next 50
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === 3 })}
                            onClick={() => { toggle(3) }}
                        >
                            Select All
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === 4 })}
                            onClick={() => { toggle(4) }}
                        >
                            Un-Select
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent className='m-2 share_contetnt'>
                    <TabPane>
                        <Row>
                           <Col>
                           <div className='share_box'>
                                <div className="topping">
                                    Sales Demo
                                    <input type="checkbox" name="topping" value=" Sales Demo" />
                                </div>
                                <div className="topping">
                                    Vivek rana
                                    <input type="checkbox" name="topping" value="Vivek rana" />
                                </div>
                                <div className="topping">
                                    Abdul Basith
                                    <input type="checkbox" name="topping" value="Abdul Basith" />
                                </div>
                           </div>
                           </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </div>
            <div className='d-flex justify-content-center w-100'>
                <button type='submit' className="btn btn-dark share_btn m-2">
                    Share Message
                </button>
            </div>
       </div>
    )
}

export default ShareContent;
