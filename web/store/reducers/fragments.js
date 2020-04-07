import TYPES from "@store/types";

let initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPES.FRAGMENTS.REQUESTED: {
      return { ...state, fragments: { loading: true } };
    }
    case TYPES.FRAGMENTS.FETCHED: {
      return { ...state, fragments: { loading: false, data: action.payload } };
    }
    case TYPES.FRAGMENTS.ERROR: {
      return { ...state, fragments: { loading: false, error: action.payload } };
    }
    default: {
      return state;
    }
  }
};
