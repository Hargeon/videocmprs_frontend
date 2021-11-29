import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).max(250).required(),
  passwordConfirmation: yup.string()
      .required('Confirm Password is required')
      .oneOf([yup.ref('password')], 'Passwords must match'),
});

export default schema;
