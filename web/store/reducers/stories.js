import TYPES from "@store/types";

let initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPES.STORIES.ALL_REQUESTED: {
      return { ...state, stories: { loading: true } };
    }
    case TYPES.STORIES.ALL_FETCHED: {
      return { ...state, stories: { loading: false, data: action.payload } };
    }
    case TYPES.STORIES.ALL_FETCH_ERROR: {
      return { ...state, stories: { loading: false, error: action.payload } };
    }
    case TYPES.STORIES.ONE_REQUESTED: {
      return { ...state, stories: { loading: true } };
    }
    case TYPES.STORIES.ONE_FETCHED: {
      return {
        ...state,
        stories: { ...state.stories, loading: false, selected: action.payload },
      };
    }
    case TYPES.STORIES.ONE_FETCH_ERROR: {
      return {
        ...state,
        stories: { ...state.stories, loading: false, error: action.payload },
      };
    }
    default: {
      return state;
    }
  }
};
