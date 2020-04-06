import React from "react";
import api from "@services/api";
// import Authenticator from "../Authenticator";
import FragmentModal from "./FragmentsModal";

export default class FragmentsModalControler extends React.Component {
  constructor(props) {
    super(props);
    console.log("fragment props", props);
    this.state = { loading: true, fragments: [], open: true };
  }
  componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params.contentId &&
      this.props.match.params.id
    ) {
      this.loadModalDataAndOpen();
    }
  }
  refetch = () => {
    this.setState(
      { loaded: false, loading: true, shouldRefetchStory: true },
      () => {
        this.loadModalDataAndOpen();
      }
    );
  };
  loadModalDataAndOpen = () => {
    let storyId = this.props.match.params.id;
    let id = this.props.match.params.contentId;

    if (this.state.loaded && this.state.loadedContentId === id) {
      return;
    }

    api
      .get(`${API_URL}/content/${id}/fragments`)
      .then((response) => {
        console.log(response);
        this.setState({
          fragments: response.data,
          loading: false,
          loaded: true,
          loadedContentId: this.props.match.params.id,
        });
      })
      .catch((error) => {
        this.setState({
          failMessage: error.response ? error.response.data : error.message,
        });
      });
    this.setState({ open: true, loading: true });
  };
  closeModal = () => {
    this.setState({ open: false });
    if (this.state.shouldRefetchStory) {
      this.props.shouldRefetch();
    }
    this.props.history.push(`/story/${this.props.match.params.id}`);
  };
  render() {
    console.log(this.props);
    return (
      <FragmentModal
        open={this.state.open}
        fragments={this.state.fragments}
        closeCallback={this.closeModal}
        error={this.state.failMessage}
        onChange={this.refetch}
      />
    );
  }
}
