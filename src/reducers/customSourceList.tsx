import { SET_CUSTOMSOURCE } from "../actions/actionTypes";

interface ActivityI {
  sourceList: Array<any>;
}
const initialState = {
  sourceList: [],
};

const customSource = (
  state: ActivityI = initialState,
  action: { type: string; payload: any }
): ActivityI => {
  switch (action?.type) {
    case SET_CUSTOMSOURCE:
      return {
        ...state,
        sourceList: action?.payload,
      };
    default:
      return state;
  }
};

export default customSource;
