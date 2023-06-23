import { SET_LEADNAME } from "../actions/actionTypes";

interface LeadI {
  leadName: any;
}
const initialState = {
  leadName: {},
};

const leadName = (
  state: LeadI = initialState,
  action: { type: string; payload: any }
): LeadI => {
  switch (action?.type) {
    case SET_LEADNAME:
      return {
        ...state,
        leadName: action?.payload,
      };
    default:
      return state;
  }
};

export default leadName;
