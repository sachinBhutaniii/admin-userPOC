import React from "react";
import { Carousel } from "react-bootstrap";

import team from "../images/team.jpg";
import athletico from "../images/athleticoo.jpg";
import madrid from "../images/madrid.jpg";

const Home = () => {
  // return <div><h1>Welcome Page</h1></div>;
  return (
    <div>
      <h1>Welcome Page</h1>
      <Carousel>
        <Carousel.Item>
          <img className="d-block w-100 club" src={team} alt="First slide" />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 club"
            src={athletico}
            alt="Second slide"
          />

          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100 club" src={madrid} alt="Third slide" />

          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Home;
