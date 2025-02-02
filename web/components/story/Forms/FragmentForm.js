import React from "react";
import Authenticator from "../../Authenticator";
import api from "@services/api";
import {
  Form,
  Button,
  Checkbox,
  Container,
  Card,
  TextArea,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const ContentForm = (props) => {
  const [values, setValues] = useState({
    contentId: props.contentId,
    storyId: props.storyId,
  });

  return (
    <Form>
      <Form.Field name="title">
        <label>What happens next?</label>
        <input
          maxLength="1000"
          minLength="50"
          name="fragment"
          onChange={(e) =>
            setValues({ ...values, [e.target.name]: e.target.value })
          }
          placeholder="Setting a good title can help direct the path the story takes"
        />
      </Form.Field>
      <Form.Field required>
        <Checkbox
          name="terms"
          onChange={(e) => setValues({ ...values, terms: e.target.checked })}
          label="I agree to the Terms and Conditions"
        />{" "}
        <Link className="" to="/terms">
          see them here
        </Link>
      </Form.Field>
      <Button type="submit" onClick={() => props.onSave(values)}>
        Submit
      </Button>
    </Form>
  );
};

export default ContentForm;
