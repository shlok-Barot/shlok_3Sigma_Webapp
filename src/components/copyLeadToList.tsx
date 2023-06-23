import React, { PropsWithChildren, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

interface PropsT {
    copyLeadToListModal: boolean,
    copyLeadToList: () => void,
    leadList: Array<any>,
    onCopy: (id: string) => void
}

const CopyLeadToList: React.FC<PropsWithChildren<PropsT>> = ({ copyLeadToListModal, copyLeadToList, leadList, onCopy }) => {

    const [activeId, setActiveId] = useState<string>('');

    return (
        <Modal isOpen={copyLeadToListModal} toggle={copyLeadToList}>
            <ModalHeader toggle={copyLeadToList}>
                Copy Lead to List
            </ModalHeader>
            <ModalBody>
                <ul className="list-group">
                    {leadList?.map((list: {
                        _id: string;
                        name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined;
                    }) => <li onClick={() => setActiveId(list?._id)} className={`list-group-item lead-list-name ${activeId === list?._id && 'active'}`} key={list?._id}>{list.name}</li>)}
                </ul>
            </ModalBody>
            <ModalFooter>
                <button onClick={() => onCopy(activeId)} disabled={activeId ? false : true} className="btn btn-primary">Copy</button>
                <button onClick={() => {setActiveId(''); copyLeadToList()}} className="btn btn-secondary">Cancel</button>
            </ModalFooter>
        </Modal>
    )
}

export default CopyLeadToList;
