import TYPES from "@store/types";

let initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPES.STORIES.ALL_FETCHED: {
      return { ...state, stories: action.payload };
    }
    case TYPES.STORIES.SELECTED: {
      return { ...state, selectedStory: action.payload };
    }
    default: {
      return state;
    }
  }
};
