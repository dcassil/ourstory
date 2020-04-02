import React from "react";
import axios from "axios";
import Authenticator from "../../Authenticator";
import FragmentForm from "../Forms/FragmentForm";
import { Modal } from "semantic-ui-react";

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
  loadModalDataAndOpen = () => {
    let storyId = this.props.match.params.id;
    let id = this.props.match.params.contentId;

    if (this.state.loaded && this.state.loadedContentId === id) {
      return;
    }

    axios
      .get(`${API_URL}/story/${storyId}/content/${id}/fragments`)
      .then(response => {
        console.log(response);
        this.setState({
          fragments: response.data,
          loading: false,
          loaded: true,
          loadedContentId: this.props.match.params.id
        });
      })
      .catch(error => {
        this.setState({
          failMessage: error.response ? error.response.data : error.message
        });
      });
    this.setState({ open: true, loading: true });
  };
  closeModal = () => {
    this.setState({ open: false });
    this.props.history.push(
      `/story/${this.props.match.params.id}/content/${this.props.match.params.contentId}/fragments`
    );
  };
  onSave = values => {
    let user = Authenticator.getAccount();
    let fragment = {
      contentId: values.contentId,
      author: { id: user.id, displayName: user.displayName },
      fragment: values.fragment,
      createdDate: new Date().getTime()
    };

    return axios
      .post(
        `${API_URL}/story/${values.storyId}/content/${values.contentId}/fragments`,
        fragment
      )
      .then(this.closeModal)
      .catch(console.warn);
  };
  render() {
    return (
      <Modal open={this.state.open} onClose={this.closeModal}>
        <Modal.Content>
          <Modal.Description>
            <FragmentForm
              contentId={this.props.match.params.contentId}
              onSave={this.onSave}
            />
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}
