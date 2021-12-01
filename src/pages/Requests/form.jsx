import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Grid,
  makeStyles,
  Container,
  Button,
  Typography, Checkbox, FormControlLabel,
} from "@material-ui/core";
import {yupResolver} from "@hookform/resolvers/yup";
import validationSchema from "./validation";
import api from "../../services/api";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons/faFileUpload";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHistory } from "react-router-dom";
import {useState} from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  buttonSpacing: {
    marginLeft: theme.spacing(1),
  },
  errorGrid: {
    color: "#721c24",
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    borderRadius: "5px"
  },
  fileUpload: {
    display: "none",
  },
  fileUploadLabel: {
    border: "1px solid #ccc",
    padding: "6px 12px",
    cursor: "pointer"
  },
  fileUploadLabelText: {
    marginLeft: "21px"
  }
}));

const Form = function (props) {
  const classes = useStyles();
  const history = useHistory();
  const [err, setErr] = useState(null)
  const [fileName, setFileName] = useState("No file chosen")
  const [isLoading, setIsLoading] = useState(false);

  const [bitrateSelected, setBitrateSelected] = useState(false)
  const [resolutionSelected, setResolutionSelected] = useState(false)
  const [ratioSelected, setRatioSelected] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    const ok = validateData(data)
    if(!ok) {
      return
    }

    let formData = new FormData()
    let reqData = combineData(data)
    let jsonReqData = JSON.stringify(reqData)

    formData.append("video", data.video[0])
    formData.append("requests", jsonReqData)

    try {
      setIsLoading(true)
      let response = await api.request.create(formData)
      history.push("/requests")
    } catch (e) {
      switch (e.response.status) {
        case 500:
          setErr("Something went wrong")
          break
        case 400:
          let errors = e.response.data.errors.map(err => err.title).join(". ")
          setErr(errors)
          break
      }
    } finally {
      setIsLoading(false)
    }
  }

  const combineData = (data) => {
    let reqData = {
      data: {
        type: "requests",
        attributes: {}
      }
    }

    if(bitrateSelected) {
      reqData.data.attributes.bitrate = Number(data.bitrate)
    }

    if(resolutionSelected) {
      reqData.data.attributes.resolution_x = Number(data.resolution_x)
      reqData.data.attributes.resolution_y = Number(data.resolution_y)
    }

    if(ratioSelected) {
      reqData.data.attributes.ratio_x = Number(data.ratio_x)
      reqData.data.attributes.ratio_y = Number(data.ratio_y)
    }
    return reqData
  }

  const validateData = (data) => {
    let ok = true

    if (data.video.length === 0) {
      setErr("No file selected")
      return false
    }

    const selected = bitrateSelected || resolutionSelected || ratioSelected
    if (!selected) {
      setErr("At least one parameter must be selected")
      return false
    }

    return ok
  }

  const handleBitrateSelected = (event) => {
    setBitrateSelected(event.target.checked)
  }

  const handleResolutionSelected = (event) => {
    setResolutionSelected(event.target.checked)
  }

  const handleRatioSelected = (event) => {
    setRatioSelected(event.target.checked)
  }

  const errorGrid = () => {
    if(err) {
      return (
        <Grid container spacing={3}>
          <Grid item className={classes.errorGrid} xs={12}>
            <Typography variant="h6">{err}</Typography>
          </Grid>
        </Grid>
      )
    } else {
      return (
        <></>
      )
    }
  }

  const handleFileName = (event) => {
    if(!event) return

    const name =  event.target.value.split(/[\\\\|/]/).pop()
    setFileName(name)
  }

  return (
      <Container maxWidth="xs" className={classes.root}>
        {errorGrid()}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bitrateSelected}
                    onChange={handleBitrateSelected}
                  />
                }
                label="Bitrate"
              />
              {bitrateSelected ? (
                <Controller
                  name="bitrate"
                  control={control}
                  defaultValue="64000"
                  render={({field}) => (
                    <TextField
                      {...field}
                      fullWidth={true}
                      type="text"
                      label="Bitrate"
                      variant="filled"
                    />
                  )}
                />
              ) : (
                <></>
              )}
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={resolutionSelected}
                    onChange={handleResolutionSelected}
                  />
                }
                label="Resolution"
              />
              {resolutionSelected ? (
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Controller
                      name="resolution_x"
                      control={control}
                      defaultValue="800"
                      render={({field}) => (
                        <TextField
                          {...field}
                          name="resolution_x"
                          fullWidth={true}
                          label="ResolutionX"
                          variant="filled"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Controller
                      name="resolution_y"
                      control={control}
                      defaultValue="600"
                      render={({field}) => (
                        <TextField
                          {...field}
                          name="resolution_y"
                          fullWidth={true}
                          label="ResolutionY"
                          variant="filled"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              ) : (
                <></>
              )}
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={ratioSelected}
                    onChange={handleRatioSelected}
                  />
                }
                label="Ratio"
              />
              {ratioSelected ? (
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Controller
                      name="ratio_x"
                      control={control}
                      defaultValue="4"
                      render={({field}) => (
                        <TextField
                          {...field}
                          name="ratio_x"
                          fullWidth={true}
                          label="RatioX"
                          variant="filled"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Controller
                      name="ratio_y"
                      control={control}
                      defaultValue="3"
                      render={({field}) => (
                        <TextField
                          {...field}
                          name="ratio_y"
                          fullWidth={true}
                          label="RatioY"
                          variant="filled"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              ) : (
                <></>
              )}
            </Grid>

            <Grid item xs={12}>
              <label htmlFor="file_upload" className={classes.fileUploadLabel}>
                <FontAwesomeIcon icon={faFileUpload} size="lg"/>
                <span className={classes.fileUploadLabelText}>{fileName}</span>
              </label>
              <input
                className={classes.fileUpload}
                id="file_upload"
                name="video"
                type="file"
                {...register('video', {
                  onChange: (e) => handleFileName(e)
                })}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoading}
              >
                Upload
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    )
}

export default Form