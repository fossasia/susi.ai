import React from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import skillActions from '../../../redux/actions/skill';
import uiActions from '../../../redux/actions/ui';
import messagesActions from '../../../redux/actions/messages';
import generateMessage from '../../../utils/generateMessage';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { fetchSkillSlideshow } from '../../../apis/index';
import getImageSrc from '../../../utils/getImageSrc';
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
    width: 17rem;
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

class Carousel extends React.Component {
  state = {
    slideshowData: [],
    loading: true,
  };

  getSkillSlideshow = async () => {
    try {
      let payload = await fetchSkillSlideshow();
      const { slideshow } = payload;
      let slideshowData = [];
      for (const redirectLink in slideshow) {
        let slideshowObj = { redirectLink };
        let obj = slideshow[redirectLink];
        slideshowObj = { ...slideshowObj, ...obj };
        slideshowData.push(slideshowObj);
      }
      this.setState({ slideshowData, loading: false });
    } catch (error) {
      console.log('Error', error);
      this.setState({ loading: false });
    }
  };

  componentDidMount() {
    this.getSkillSlideshow();
  }

  render() {
    const { slideshowData } = this.state;
    const { actions, speechOutputAlways, mode } = this.props;
    const renderSlides = slideshowData.map(obj => {
      return obj.redirectLink.includes('testExample') ? (
        <span
          onClick={event => {
            generateMessage({
              text: obj.redirectLink.split('=')[1],
              voice: speechOutputAlways,
              createMessage: actions.createMessage,
              createSusiMessage: actions.createSusiMessage,
              mode,
              setPendingUserMessage: actions.setPendingUserMessage,
              setChatMode: actions.setChatMode,
            });
          }}
          href={obj.redirectLink}
          key={obj.redirectLink}
        >
          <SliderImage
            src={getImageSrc({ relativePath: `image=${obj.image_name}` })}
          />
        </span>
      ) : (
        <a href={obj.redirectLink} key={obj.redirectLink}>
          <SliderImage
            src={getImageSrc({ relativePath: `image=${obj.image_name}` })}
          />
        </a>
      );
    });
    return (
      <Container>
        <Slider {...settings}>{renderSlides}</Slider>
      </Container>
    );
  }
}

Carousel.propTypes = {
  history: PropTypes.object,
  actions: PropTypes.object,
  speechOutputAlways: PropTypes.bool,
  mode: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    speechOutputAlways: store.settings.speechOutputAlways,
    mode: store.ui.mode,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...skillActions, ...uiActions, ...messagesActions },
      dispatch,
    ),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Carousel),
);
