// import {
//   Form,
//   Button,
//   Checkbox,
//   Container,
//   Card,
//   TextArea,
//   Dimmer,
//   Loader
// } from "semantic-ui-react";
// import { useState } from "react";

// const ContentForm = props => {
//   const [values, setValues] = useState({});

//   retun(
//     <Form>
//       <Form.Field name="title">
//         <label>What happens next?</label>
//         <input
//           name="fragment"
//           onChange={e =>
//             setValues({ ...values, [e.target.name]: e.target.value })
//           }
//           placeholder="Setting a good title can help direct the path the story takes"
//         />
//       </Form.Field>
//       <Form.Field>
//         <label>Seed</label>
//         <input
//           name="seed"
//           onChange={e =>
//             setValues({ ...values, [e.target.name]: e.target.value })
//           }
//           placeholder="What are the opening few lines of the story?"
//         />
//       </Form.Field>
//       <Form.Field required>
//         <Checkbox
//           name="terms"
//           onChange={e => setValues({ ...values, terms: e.target.checked })}
//           label="I agree to the Terms and Conditions"
//         />{" "}
//         <Link className="" to="/terms">
//           see them here
//         </Link>
//       </Form.Field>
//       <Button type="submit" onClick={() => props.onFormSubmit(values)}>
//         Next
//       </Button>
//     </Form>
//   );
// };

// return ContentForm;
