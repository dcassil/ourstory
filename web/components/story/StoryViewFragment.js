import React from "react";
import styles from "./Story.css";
import { Link, Route } from "react-router-dom";
import { Label, Dropdown, Rail, Segment, Icon } from "semantic-ui-react";
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
        <Segment basic className={styles.storyContentSegment}>
          <StoryViewContent {...this.props} {...data.topFragment} />
          <Rail position="left" close>
            <Dropdown icon={<Icon name="dot circle" color="teal" />}>
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
                  <React.Fragment>
                    <Dropdown.Item name="Add">
                      <Link
                        to={`${this.props.match.url}/content/${data.id}/fragments/new`}
                      >
                        Add Alternates
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item name="indent">
                      <Link
                        to={`${this.props.match.url}/content/${data.id}/fragments/new`}
                      >
                        Sugest Indenting this paragrah
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item name="endChapter">
                      <Link
                        to={`${this.props.match.url}/content/${data.id}/fragments/new`}
                      >
                        Sugest Chapter End
                      </Link>
                    </Dropdown.Item>
                  </React.Fragment>
                ) : null}
              </Dropdown.Menu>
            </Dropdown>
          </Rail>
        </Segment>
      </div>
    );
  };
}
