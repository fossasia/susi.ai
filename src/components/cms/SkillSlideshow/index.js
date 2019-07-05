import React from 'react';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import Slider from 'react-slick';
import ChevronRight from '@material-ui/icons/ChevronRight';
import PropTypes from 'prop-types';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { Link } from 'react-router-dom';
import SLIDES from './constants';
import './index.css';

const Container = styled.div`
  margin: 0 auto 0 0.5rem;
  width: 95%;
  @media (max-width: 1200px) {
    width: 90%;
  }
  @media (max-width: 768px) {
    margin: 0 auto;
  }
`;

const SliderImage = styled.img`
  cursor: pointer;
  border: 5px solid #fff;
  display: block;
  margin: 0 auto;
  width: 100%;
  @media (max-width: 520px) {
    height: 8rem;
    width: 21rem;
  }
`;

function NextArrow({ onClick }) {
  return (
    <ChevronRight
      style={{ fill: 'white' }}
      onClick={onClick}
      className="slick-next"
    />
  );
}

NextArrow.propTypes = {
  onClick: PropTypes.func,
};

function PrevArrow({ onClick }) {
  return (
    <ChevronLeft
      style={{ fill: 'white' }}
      onClick={onClick}
      className="slick-prev"
    />
  );
}

PrevArrow.propTypes = {
  onClick: PropTypes.func,
};

const settings = {
  className: 'center',
  centerMode: true,
  infinite: true,
  slidesToShow: 1,
  speed: 500,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  autoplay: true,
  autoplaySpeed: 5000,
  adaptiveHeight: true,
};

const Carousel = () => {
  const renderSlides = SLIDES.map(obj => {
    if (obj.path) {
      return (
        <Link to={obj.path} key={obj.path}>
          <SliderImage src={obj.image} />
        </Link>
      );
    }
    return (
      <a href={obj.url} key={obj.url}>
        <SliderImage src={obj.image} />
      </a>
    );
  });
  return (
    <Container>
      <Slider {...settings}>{renderSlides}</Slider>
    </Container>
  );
};

Carousel.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Carousel);
