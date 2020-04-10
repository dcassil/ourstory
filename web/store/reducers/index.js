import { combineReducers } from "redux";
import stories from "./stories";
import fragments from "./fragments";
import tags from "./tags";

export default combineReducers({ stories, fragments, tags });
