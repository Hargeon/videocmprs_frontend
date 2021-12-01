import { Container } from "@material-ui/core";
import {Carousel} from "react-responsive-carousel";
import {useEffect} from "react";
import useAuth from "../../hooks/useAuth";
import {useHistory} from "react-router-dom";

import Man from "./man.jpg"
import Girls from "./girls.jpg"
import Dog from "./dog.jpg"
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import "./style.css"

const imagesWithText = [
  {src: Man, text: "Do video files take up all the memory?"},
  {src: Dog, text: "Change bitrate, resolution and aspect ratio to compress video"},
  {src: Girls, text: "Feel more free space on your device"},
]

function Home() {
  const auth = useAuth();
  const history = useHistory();

  useEffect(() => {
    if(auth.user) {
      history.push("/requests");
    }
  }, [auth.user])

  return (
    <div>
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
      >
        {imagesWithText.map((image, index) => (
          <div key={index} className={"carousel-item"}>
            <div style={{backgroundImage: 'url(' + image.src + ')' }} className={"carousel-image"}/>
            <Container>
              <div className={"carousel-text"}>
                {image.text}
              </div>
            </Container>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default Home;
