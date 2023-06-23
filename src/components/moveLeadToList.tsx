import React, { PropsWithChildren, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

interface PropsT {
    moveLeadToList: () => void,
    leadList: Array<any>,
    moveLeadToListModal: boolean,
    onMove: (id: string) => void
}
const MoveLeadToList: React.FC<PropsWithChildren<PropsT>> = ({ moveLeadToList, leadList, moveLeadToListModal, onMove }) => {

    const [activeId, setActiveId] = useState<string>('');

    return (
        <Modal isOpen={moveLeadToListModal} toggle={moveLeadToList}>
            <ModalHeader toggle={moveLeadToList}>
                Copy Lead to List
            </ModalHeader>
            <ModalBody>
                <ul className="list-group">
                    {leadList?.map((list: {
                        _id: string;
                        name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined;
                    }) => <li onClick={() => setActiveId(list?._id)} className={`list-group-item lead-list-name ${activeId === list?._id && 'active'}`}  key={list?._id}>{list.name}</li>)}
                </ul>
            </ModalBody>
            <ModalFooter>
                <button onClick={() => onMove(activeId)} disabled={activeId ? false : true} className="btn btn-primary">Move</button>
                <button onClick={() => {setActiveId(''); moveLeadToList()}} className="btn btn-secondary">Cancel</button>
            </ModalFooter>
        </Modal>
    )
}

export default MoveLeadToList;
