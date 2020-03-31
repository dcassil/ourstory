import React from "react";
import { Feed, Icon, Image, Modal } from "semantic-ui-react";

const ModalModalExample = props => (
  <Modal open={props.open} onClose={props.closeCallback}>
    <Modal.Header>Select a Photo</Modal.Header>
    <Modal.Content image>
      <Modal.Description>
        <Feed>{props.fragments.map(renderFragment)}</Feed>
      </Modal.Description>
    </Modal.Content>
  </Modal>
);

function renderFragment(fragment) {
  return (
    <Feed.Event key={fragment.id}>
      <Feed.Content>
        <Feed.Summary>
          <Feed.User>{fragment.author.displayName}</Feed.User>
          <Feed.Date>
            {new Date(fragment.createdDate).toLocaleDateString()}
          </Feed.Date>
        </Feed.Summary>
        <Feed.Extra text>
          <p>{fragment.fragment}</p>
        </Feed.Extra>
        <Feed.Meta className="os-flex">
          <Feed.Like>
            <Icon name="thumbs up" />
            {fragment.upVotes.length} Likes
          </Feed.Like>
          <Feed.Like>
            <Icon name="thumbs down" />
            {fragment.downVotes.length} dislike
          </Feed.Like>
        </Feed.Meta>
      </Feed.Content>
    </Feed.Event>
  );
}

export default ModalModalExample;
