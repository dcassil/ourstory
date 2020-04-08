import TYPES from "@store/types";
import api from "@services/api";

export const fragmentPanelOpened = (contentId) => {
  return (dispatch) => {
    dispatch(fragmentsRequested());
    return api
      .get(`${API_URL}/content/${contentId}/fragments`)
      .then((response) => {
        dispatch(fragmentsFetched({ contentId, data: response.data }));
      })
      .catch(fragmentsError());
  };
};

export const fragmentsRequested = () => ({
  type: TYPES.FRAGMENTS.REQUESTED,
});

export const fragmentsFetched = (fragments) => ({
  type: TYPES.FRAGMENTS.FETCHED,
  payload: fragments,
});

export const fragmentsError = (error) => ({
  type: TYPES.STORIES.ERRORED,
  payload: error,
});
