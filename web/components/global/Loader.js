import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

export default function () {
  return (
    <Dimmer active>
      <Loader />
    </Dimmer>
  );
}
