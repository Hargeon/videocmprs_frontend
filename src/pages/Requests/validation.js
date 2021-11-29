import * as yup from "yup";

const schema = yup.object().shape({
  bitrate: yup.string(),
  resolution_x: yup.string(),
  resolution_y: yup.string(),
  ratio_x: yup.string(),
  ratio_y: yup.string()
});

export default schema;
