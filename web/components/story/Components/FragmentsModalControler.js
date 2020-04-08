import React from "react";
import { connect } from "react-redux";
import { fragmentPanelOpened } from "@store/actions/fragments";
import { fragments } from "@store/selectors";
import Loader from "@components/global/Loader";
import api from "@services/api";
// import Authenticator from "../Authenticator";
import FragmentModal from "./FragmentsModal";

class FragmentsModalControler extends React.Component {
  constructor(props) {
    super(props);
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
    this.loadModalDataAndOpen();
  };
  loadModalDataAndOpen = () => {
    let id = this.props.match.params.contentId;

    this.props.fragmentPanelOpened(id);
  };
  closeModal = () => {
    // this.setState({ open: false });
    // if (this.state.shouldRefetchStory) {
    //   this.props.shouldRefetch();
    // }
    this.props.beforeClose();
    this.props.history.push(`/story/${this.props.match.params.id}`);
  };
  render() {
    console.log(this.props);
    return (
      <FragmentModal
        fragments={this.props.fragments}
        closeCallback={this.closeModal}
        onChange={this.refetch}
      />
    );
  }
}

export default connect(fragments, { fragmentPanelOpened })(
  FragmentsModalControler
);
