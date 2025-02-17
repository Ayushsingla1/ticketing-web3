import React from "react";
import Slider from "react-slick";
import SliderCard from "./SliderCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./style.css"

function MainSlider({ data }) {
  const settings = {
    dots: true,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    customPaging: (i) => (
      <div className="active-one w-4 h-1 rounded-sm bg-gray-300 cursor-pointer mt-6"></div>
    ),
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {data.map((item, index) => (
          <div key={index} className="w-screen">
            <SliderCard item={item} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default MainSlider;
