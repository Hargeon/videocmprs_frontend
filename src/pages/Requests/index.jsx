import {useCallback, useEffect, useState} from "react";
import useAuth from "../../hooks/useAuth"
import api from "../../services/api";
import {
  Grid,
  makeStyles,
  Container, Card, CardContent, CardHeader, Typography, Table, TableBody, TableRow, TableCell
} from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { faFileDownload } from "@fortawesome/free-solid-svg-icons/faFileDownload";
import {Link} from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

let client = axios.create()
client.interceptors.request.use(
  (config) => {
    config.headers.accept = "application/vnd.api+json"

    const authToken = Cookies.get("auth-token");

    if (authToken) {
      config.headers.authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

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
  noRequests: {
    color: "#67689a",
    fontSize: "xxx-large"
  },
  addRequest: {
    display: "flex !important",
    justifyContent: "center !important",
    alignItems: "center !important",
    zIndex: "1000000 !important",
    bottom: "20px! important",
    right: "24px !important",
    position: "fixed !important",
    width: "60px !important",
    height: "60px !important",
    fontSize: "60px !important",
    cursor: "pointer !important",
  },
  statusIcon: {
    marginLeft: "5px"
  },

  downloadIcon: {
    display: "inline-block",
    marginLeft: "10px",
    cursor: "pointer"
  }
}));

const Index = function (props) {
  const classes = useStyles();
  const [page, setPage] = useState(1)
  const auth = useAuth();

  useEffect(() => {
    loadData(page)
    setInterval(() => { loadData(page) }, 5000)
  }, [page])

  const loadData = useCallback(async (page) => {
    const {data} = await api.request.getList(page)
    let includedVideo = data.included
    let requests = data.data.map((request) => {
      if(request.relationships) {
        // find origin video data
        let originVideo = request.relationships.original_video
        if(originVideo) {
          request.originVideo = findVideoData(originVideo, includedVideo)
        }

        // find converted video data
        let convertedVideo = request.relationships.converted_video
        if(convertedVideo) {
          request.convertedVideo = findVideoData(convertedVideo, includedVideo)
        }
      }

      return request
    })

    auth.setRequestData(requests)
  }, [page])

  const findVideoData = (res, includedVideo) => {
    let data = null
    for(let i = 0; i < includedVideo.length; i++) {
      if(includedVideo[i].type === res.data.type && includedVideo[i].id === res.data.id) {
        data = includedVideo[i]
        break
      }
    }
    return data
  }

  const displayRequest = (resource) => {
    return (
      <>
        {resource.attributes.bitrate > 0 ? (
          <div>
            <Typography color="secondary">
              Bitrate: {resource.attributes.bitrate}
            </Typography>
          </div>
        ) : (
          <></>
        )}

        {resource.attributes.resolution_x > 0 || resource.attributes.resolution_y > 0 ? (
          <div>
            <Typography color="secondary">
              Resolution: {resource.attributes.resolution_x}X{resource.attributes.resolution_y}
            </Typography>
          </div>
        ) : (
          <></>
        )}

        {resource.attributes.ratio_x > 0 || resource.attributes.ratio_y > 0 ? (
          <div>
            <Typography color="secondary">
              Ratio: {resource.attributes.ratio_x}:{resource.attributes.ratio_y}
            </Typography>
          </div>
        ) : (
          <></>
        )}

        {resource.attributes.status == "failed" ? (
          <div>
            { resource.attributes.details }
          </div>
        ) : (
          <></>
        )}
      </>
    )
  }

  const displayVideo = (request, resource) => {
    return (
      <>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell padding={"none"}>
                <Typography>
                  Name
                </Typography>
              </TableCell>
              <TableCell padding={"none"}>
                {resource.attributes.name ? (
                  <Typography>
                    {resource.attributes.name.slice(0,20)}
                  </Typography>
                ) : request.attributes.status === "failed" ? (
                  <Typography>
                    failed
                  </Typography>
                ) : (
                  <Typography>
                    <FontAwesomeIcon icon={faClock} color={"#edfb17"}/>
                    <span className={classes.statusIcon}>processing</span>
                  </Typography>
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell padding={"none"}>
                <Typography>
                  Size
                </Typography>
              </TableCell>
              <TableCell padding={"none"}>
                {resource.attributes.size ? (
                  <Typography>
                    {resource.attributes.size}
                  </Typography>
                ) : request.attributes.status === "failed" ? (
                  <Typography>
                    failed
                  </Typography>
                ) : (
                  <Typography>
                    <FontAwesomeIcon icon={faClock} color={"#edfb17"}/>
                    <span className={classes.statusIcon}>processing</span>
                  </Typography>
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell padding={"none"}>
                <Typography>
                  Bitrate
                </Typography>
              </TableCell>
              <TableCell padding={"none"}>
                {resource.attributes.bitrate ? (
                  <Typography>
                    {resource.attributes.bitrate}
                  </Typography>
                ) : request.attributes.status === "failed" ? (
                  <Typography>
                    failed
                  </Typography>
                ) : (
                  <Typography>
                    <FontAwesomeIcon icon={faClock} color={"#edfb17"}/>
                    <span className={classes.statusIcon}>processing</span>
                  </Typography>
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell padding={"none"}>
                <Typography>
                  Resolution
                </Typography>
              </TableCell>
              <TableCell padding={"none"}>
                {resource.attributes.resolution_x || resource.attributes.resolution_y ? (
                  <Typography>
                    {resource.attributes.resolution_x}X{resource.attributes.resolution_y}
                  </Typography>
                ) : request.attributes.status === "failed" ? (
                  <Typography>
                    failed
                  </Typography>
                ) : (
                  <Typography>
                    <FontAwesomeIcon icon={faClock} color={"#edfb17"}/>
                    <span className={classes.statusIcon}>processing</span>
                  </Typography>
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell padding={"none"}>
                <Typography>
                  Ratio
                </Typography>
              </TableCell>
              <TableCell padding={"none"}>
                {resource.attributes.ratio_x || resource.attributes.ratio_y ? (
                  <Typography>
                    {resource.attributes.ratio_x}X{resource.attributes.ratio_y}
                  </Typography>
                ) : request.attributes.status === "failed" ? (
                  <Typography>
                    failed
                  </Typography>
                ) : (
                  <Typography>
                    <FontAwesomeIcon icon={faClock} color={"#edfb17"}/>
                    <span className={classes.statusIcon}>processing</span>
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>
    )
  }

  const downloadVideo = async (url) => {
    // window.open(url, '_blank').focus();
    try {
      const { data } = await client.get(url)
      window.open(data.data.id, '_blank').focus();
    } catch (e) {
      console.log(e)
    }
  }

  const displayDownloadIcon = (video) => {
    console.log(video)
    if(video && video.links && video.links.download) {
      return (
        <div className={classes.downloadIcon} onClick={() => downloadVideo(video.links.download)}>
          <FontAwesomeIcon icon={faFileDownload} color={"#3f51b5"} />
        </div>
      )
    } else {
      return <></>
    }
  }

    return (
      <Container maxWidth="xl" className={classes.root}>
        <Container maxWidth="xs">
          {auth.requests.length === 0 ? (
            <div className={classes.noRequests}>No requests yet</div>
          ) : (
            <></>
          )}
        </Container>
        <Grid container spacing={6}>
          {auth.requests.map((request) => {
            return (
              <Grid item xs={12} md={6} key={request.id}>
                <Card>
                  <CardHeader
                    title={request.attributes.video_name.slice(0,30)}
                  />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography gutterBottom variant="h5" component="div">
                          Requested
                        </Typography>

                        {displayRequest(request)}
                      </Grid>
                      <Grid item xs={12}>
                        <Typography gutterBottom variant="h5" component="div">
                          Original
                          {displayDownloadIcon(request.originVideo)}
                        </Typography>

                        {request.originVideo ? (
                          <>
                            {displayVideo(request, request.originVideo)}
                          </>
                        ) : request.attributes.status === "failed" ? (
                          <Typography>
                            Failed
                          </Typography>
                        ) : (
                          <Typography>
                            <FontAwesomeIcon icon={faClock} color={"#edfb17"}/>
                            <span className={classes.statusIcon}>Processing</span>
                          </Typography>
                        )}
                      </Grid>

                      <Grid item xs={12}>
                        <Typography gutterBottom variant="h5" component="div">
                          Converted {displayDownloadIcon(request.convertedVideo)}
                        </Typography>

                        {request.convertedVideo ? (
                          <>
                            {displayVideo(request, request.convertedVideo)}
                          </>
                        ) : request.attributes.status === "failed" ? (
                          <Typography>
                            Failed
                          </Typography>
                        ) : (
                          <Typography>
                            <FontAwesomeIcon icon={faClock} color={"#edfb17"}/>
                            <span className={classes.statusIcon}>Processing</span>
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
        <div className={classes.addRequest}>
          <Link to="/new_request">
            <FontAwesomeIcon icon={faPlusCircle} color="#3f51b5" />
          </Link>
        </div>
      </Container>
    )
}

export default Index