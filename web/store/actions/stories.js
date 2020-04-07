import TYPES from "@store/types";
import api from "@services/api";

export const appLoaded = () => {
  return (dispatch) => {
    dispatch(storiesRequested());
    return api
      .get(API_URL + "/story")
      .then((response) => {
        dispatch(storiesFetched(response.data));
      })
      .catch(dispatch(storiesError));
  };
};

export const storiesRequested = () => ({
  type: TYPES.STORIES.ALL_REQUESTED,
});

export const storiesFetched = (stories) => ({
  type: TYPES.STORIES.ALL_FETCHED,
  payload: stories,
});

export const storiesError = (error) => ({
  type: TYPES.STORIES.ALL_FETCH_ERROR,
  payload: error,
});

export const storySelected = (story) => ({
  type: TYPES.STORIES.SELECTED,
  payload: story,
});
