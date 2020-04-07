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
      .catch((error) => dispatch(storiesError(error)));
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

export const storySelected = (id) => {
  return (dispatch) => {
    dispatch(storyRequested);
    return api
      .get(`${API_URL}/story/${id}`)
      .then((response) => {
        dispatch(storyFetched(response.data));
      })
      .catch((error) => {
        dispatch(storyError(error));
      });
  };
};

export const storyRequested = () => ({
  type: TYPES.STORIES.ONE_REQUESTED,
});

export const storyFetched = (story) => ({
  type: TYPES.STORIES.ONE_FETCHED,
  payload: story,
});

export const storyError = (error) => ({
  type: TYPES.STORIES.ONE_FETCH_ERROR,
  payload: error,
});
