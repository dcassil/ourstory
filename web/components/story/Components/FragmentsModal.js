import React from "react";
import { Feed, Icon, Image, Modal } from "semantic-ui-react";
import Likes from "@components/story/Components/UpVote";
import Dislikes from "@components/story/Components/DownVote";
import Loader from "@components/global/Loader";

const FragmentModal = ({ fragments, closeCallback, onChange }) => (
  <Modal open={true} onClose={closeCallback}>
    <Modal.Content image>
      <Modal.Description>
        <Feed>
          {!fragments ? (
            <Loader />
          ) : (
            <React.Fragment>
              {fragments.loading ? <Loader /> : null}
              {fragments.data.map((fragment) =>
                renderFragment(fragment, onChange)
              )}
            </React.Fragment>
          )}
        </Feed>
      </Modal.Description>
    </Modal.Content>
  </Modal>
);

function renderFragment(fragment, onChange) {
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
          <Likes
            contentId={fragment.storyContentId}
            fragmentId={fragment.id}
            count={fragment.upVotes.length}
            onChange={onChange}
          />
          <Dislikes
            contentId={fragment.storyContentId}
            fragmentId={fragment.id}
            count={fragment.downVotes.length}
            onChange={onChange}
          />
        </Feed.Meta>
      </Feed.Content>
    </Feed.Event>
  );
}

export default FragmentModal;
