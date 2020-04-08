import React from "react";
import styles from "./Story.css";
import { Link, Route } from "react-router-dom";
import { Label, Dropdown } from "semantic-ui-react";
import StoryViewContent from "./StoryViewContent";

export default class StoryViewFragment extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.match.params.id;
  }
  render = () => {
    let data = this.props;

    return (
      <div key={data.id} className={styles.flexRow}>
        <StoryViewContent {...this.props} {...data.topFragment} />
        <Dropdown icon="bars">
          <Dropdown.Menu>
            <Dropdown.Header content="something" />
            <Dropdown.Item
              name="inbox"
              onClick={() => {
                this.props.history.push(
                  `${this.props.match.url}/content/${data.id}/fragments`
                );
              }}
            >
              See Alternates
              <Label className={styles.rightHandLabel} color="teal">
                {data.totalFragments ? data.totalFragments + 1 : 1}
              </Label>
            </Dropdown.Item>
            {data.isLoggedIn ? (
              <Dropdown.Item name="spam">
                <Link
                  to={`${this.props.match.url}/content/${data.id}/fragments/new`}
                >
                  Add Alternates
                </Link>
              </Dropdown.Item>
            ) : null}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };
}
