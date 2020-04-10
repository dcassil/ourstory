import TYPES from "@store/types";

let initialState = { tags: [] };

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPES.TAGS.REQUESTED: {
      return {
        ...state,
        tags: { data: [], ...state.tags, loading: true },
      };
    }
    case TYPES.FRAGMENTS.FETCHED: {
      return { ...state, tags: { loading: false, ...action.payload } };
    }
    case TYPES.FRAGMENTS.ERROR: {
      return {
        ...state,
        tags: {
          data: [],
          ...state.tags,
          loading: false,
          error: action.payload,
        },
      };
    }
    default: {
      return state;
    }
  }
};
