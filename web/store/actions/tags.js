import TYPES from "@store/types";
import api from "@services/api";

export const tagsNeeded = (contentId) => {
  return (dispatch) => {
    dispatch(requested());
    return api
      .get(`${API_URL}/tags`)
      .then((response) => {
        dispatch(fetched({ data: response.data }));
      })
      .catch(errored());
  };
};

export const requested = () => ({
  type: TYPES.TAGS.REQUESTED,
});

export const fetched = (fragments) => ({
  type: TYPES.TAGS.FETCHED,
  payload: fragments,
});

export const errored = (error) => ({
  type: TYPES.TAGS.ERRORED,
  payload: error,
});
