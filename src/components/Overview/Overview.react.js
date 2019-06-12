import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import urls from '../../utils/urls';
import { scrollToTopAnimation } from '../../utils/animateScroll';
import _PlayCircle from '@material-ui/icons/PlayCircleFilled';
import Close from '@material-ui/icons/Close';
import susiGif from '../../images/susi.gif';
import GIFDemo from '../../images/gif.gif';
import WebDemo from '../../images/web.gif';
import LocationDemo from '../../images/location.gif';
import JokesDemo from '../../images/joke.gif';
import FactsDemo from '../../images/fact.gif';
import MathDemo from '../../images/math.gif';
import susiSkill from '../../images/susi_skill.png';
import susiTestGif from '../../images/susi-test.gif';
import bots from '../../images/bots.jpg';
import githubText from '../../images/github-text-logo.png';
import manyLanguages from '../../images/many_languages.png';
import allDevices from '../../images/all_devices.png';
import androidMockup from '../../images/android-mockup.jpg';
import mapAndroid from '../../images/map-android.jpg';
import shield from '../../images/shield.svg';
import openSource from '../../images/open-source.png';
import Web from '@material-ui/icons/Web';
import GIF from '@material-ui/icons/Gif';
import LocationOn from '@material-ui/icons/LocationOn';
import Action from '@material-ui/icons/ChatBubble';
import Button from '@material-ui/core/Button';
import PlusOne from '@material-ui/icons/PlusOne';
import Search from '@material-ui/icons/Search';
import googlePlay from '../../images/google-play.svg';
import appStore from '../../images/app-store.svg';
import './Overview.css';
import styled, { css } from 'styled-components';
import { withStyles } from '@material-ui/core/styles';

const commonDesc = css`
  text-align: left;
  color: #414141;
  font-family: sans-serif;
  margin-bottom: 10px;
  font-size: 43px;
  font-weight: 100;
  margin: 20px 0;

  @media (max-width: 1139px) {
    font-size: 36px;
  }

  @media (max-width: 1000px) {
    font-size: 36px;
    margin-top: 0;
    text-align: center;
    line-height: 40px;
  }
`;

const commonDeviceStore = css`
  overflow: hidden;
  text-indent: 100%;
  white-space: nowrap;
  float: left;
  height: 45px;
  width: 152px;

  @media (max-width: 1000px) {
    display: block;
    float: none;
    margin: 0 auto 10px auto;
    max-width: 100%;
    width: 50%;
    background-size: contain;
  }
`;

const commonImg = css`
  max-width: 100%;
  height: auto;
`;

const commonSection = css`
  margin: 0 auto;
  padding: 100px 60px;
  position: relative;
  max-width: 85%;
  align-items: center;
  box-shadow: inset 0 200px 200px -200px #fff, inset 0 -200px 200px -200px #fff;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  border-bottom: 1px solid #dfdfdf;
  width: 1050px;

  @media (max-width: 1080px) {
    max-width: 940px;
    padding-left: 20px;
  }

  @media (max-width: 1000px) {
    width: 90%;
  }

  @media (max-width: 480px) {
    padding: 20px 0 0 0;
    width: 90%;
    margin: 0 auto;
  }
`;

const VideoModal = styled(Modal)`
  position: absolute;
  top: 46px;
  left: 40px;
  right: 40px;
  background-color: #000;
  width: 75%;
  margin: 0 auto;
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.07);

  @media (max-width: 1000px) {
    left: 20px;
    right: 20px;
    width: 90%;
  }
`;

const VideoContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  padding-top: 30px;
  height: 0;
  overflow: hidden;
`;

const Iframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 5%;
  border: 0;
  width: 90%;
  height: 100%;
`;

const Container = styled.div`
  border-bottom: 1px solid #dfdfdf;
  margin: 0 auto;
  padding: 0px 20px;
  position: relative;
  text-align: center;
  max-width: 85%;
  width: 1050px;

  @media (max-width: 1000px) {
    margin: 0 auto;
    padding: 20px;
    width: 90%;
  }
`;

const SectionContainer = styled.div`
  margin: 0 auto;
  padding: 100px 20px 80px 20px;
  position: relative;
  text-align: center;
  max-width: 85%;
  width: 935px;
  padding-top: 80px;

  @media (max-width: 1000px) {
    padding: 60px 20px;
  }

  @media (max-width: 480px) {
    padding: 35px 0px;
  }
`;

const PlayCircleLink = styled.a`
  color: #3367d6;
  cursor: pointer;
  position: relative;
  line-height: 24px;
  display: block;
`;

const WatchSpan = styled.span`
  position: absolute;
  margin-top: 1px;
  left: 31px;
  right: 0px;
  font-weight: 600;
`;

const PlayCircle = styled(_PlayCircle)`
  fill: #3367d6;
  margin-right: 50px;
`;

const Section = styled.div`
  ${commonSection};
`;

const ConversationDescription = styled.div`
  ${commonDesc};
  width: 50%;
  @media (max-width: 1000px) {
    width: 100%;
  }
`;

const CustomDescription = styled.div`
  ${commonDesc};
  width: 100%;
`;

const DescriptionHeading = styled.div`
  ${commonDesc};

  @media (max-width: 1000px) {
    max-width: 100%;
  }
`;

const CustomDescriptionHeading = styled.div`
  ${commonDesc};
  font: 300 24px/32px sans-serif;
`;

const DescriptionText = styled.p`
  font-size: 18px;
  font-weight: 300;
  line-height: 40px;
  max-width: 440px;
  color: #414141;
  font-family: sans-serif;
  margin-left: 1%;
  max-width: 100%;

  @media (max-width: 1000px) {
    font-size: 16px;
    text-align: center;
    line-height: 24px;
  }
`;

const ImgContainer = styled.div`
  width: 50%;
  text-align: center;

  @media (max-width: 1000px) {
    max-width: 100%;
    margin: 0 auto 20px auto;
    padding: 0px;
  }

  @media (max-width: 480px) {
    margin: 0 auto 50px auto;
    width: 60%;
  }
`;

const CustomImgContainer = styled.div`
  width: 100%;
  text-align: center;

  @media (max-width: 1000px) {
    max-width: 100%;
    margin: 0 auto 20px auto;
    padding: 0px;
  }

  @media (max-width: 480px) {
    margin: 0 auto 30px auto;
    width: 90%;
  }
`;

const RowDiv = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  align-content: space-around;
  height: 9rem;
  width: 27rem;
  margin: 0 auto;

  @media (max-width: 480px) {
    width: auto;
  }
`;

const ColumnSection = styled.div`
  width: 30%;
  margin: 0 1% 0 0;
  min-height: 750px;

  @media (max-width: 480px) {
    min-height: 500px;
    width: 100%;
  }
`;

const SusiTestImg = styled.img`
  text-align: left;
  width: 60%;
  margin-left: 30%;
  max-width: 313px;

  @media (max-width: 1000px) {
    max-width: 100%;
    text-align: center;
    width: 400px;
    margin: 0rem;
  }
`;

const AndroidMockupImg = styled.img`
  max-width: 60%;
  margin-left: 30%;

  @media (max-width: 1000px) {
    max-width: 400px;
    margin-left: 0%;
    width: 100%;
  }
`;

const BotsMockupImg = styled.img`
  ${commonImg};
  padding: 10px;
`;

const PlayStore = styled.a`
  ${commonDeviceStore};
  margin: 0 10px 10px 0;
  background: url(${googlePlay}) center center no-repeat;
  background-size: contain;
`;

const AppStore = styled.a`
  ${commonDeviceStore};
  background: url(${appStore}) center center no-repeat;
  background-size: cover;
  margin-bottom: 20px;
`;

const ShieldImg = styled.img`
  width: 250px;
  padding: 10px;
  margin: 0 auto;
  display: block;

  @media (max-width: 1000px) {
    margin: 0 auto 60px auto;
    padding: 30px 0px 10px 0;
  }

  @media (max-width: 480px) {
    margin: 0 auto 50px auto;
    width: 100%;
  }
`;

const OpenSourceLogos = styled.div`
  width: 100%;
  height: 100%;

  @media (max-width: 1000px) {
    width: 480px;
    margin: 0 auto;
    text-align: center;
  }

  @media (max-width: 480px) {
    width: 170px;
  }
`;

const OpenSource = styled.span`
  height: 85px;
  display: inline-block;
  vertical-align: middle;

  @media (max-width: 480px) {
    height: 60px;
  }
`;

const GithubLogo = styled.span`
  height: 60px;
  vertical-align: middle;
  display: inline-block;

  @media (max-width: 480px) {
    height: 40px;
    margin-left: 0;
  }
`;

const SectionCenter = styled.div`
  margin: 0 auto;
  padding: 100px 60px;
  position: relative;
  max-width: 1050px;
  align-items: center;
  box-shadow: inset 0 200px 200px -200px #fff, inset 0 -200px 200px -200px #fff;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  border-bottom: 1px solid #dfdfdf;
  width: 100%;

  @media (max-width: 1080px) {
    max-width: 940px;
    padding-left: 20px;
  }

  @media (max-width: 1000px) {
    padding: 60px 0px;
    width: 90%;
  }

  @media (max-width: 480px) {
    padding: 20px 0 0 0;
    width: 90%;
    margin: 0 auto;
  }
`;

const CenterDescription = styled.div`
  width: 100%;

  @media (max-width: 1000px) {
    text-align: center;
    margin-top: 0;
    max-width: 100%;
  }
`;

const SkillWikiImg = styled.img`
  ${commonImg};
  @media (max-width: 480px) {
    max-width: 400px;
    width: 100%;
  }
`;

const GithubImg = styled.img`
  margin-left: 20px;
  height: 60px;
  vertical-align: middle;
  display: inline-block;

  @media (max-width: 480px) {
    height: 40px;
    margin-left: 0;
  }
`;

const OpenSourceImg = styled.img`
  height: 85px;
  display: inline-block;
  vertical-align: middle;

  @media (max-width: 480px) {
    height: 60px;
  }
`;

const CloseIcon = styled(Close)`
  position: absolute;
  z-index: 120000;
  fill: #fff;
  width: 40px;
  height: 40px;
  right: 1.5%;
  top: 20px;
  cursor: pointer;
`;

const MeetSusiImg = styled.img`
  ${commonImg};
  margin: 20px 0px;
`;

const Heading = styled.h1`
  font-size: 42px;
  font-weight: 100;
  margin: 0 auto;
  max-width: 880px;
  font-family: sans-serif;

  @media (max-width: 1000px) {
    font-size: 36px;
    line-height: 42px;
  }
`;

const Para = styled.p`
  font-size: 20px;
  font-weight: 300;
  line-height: 32px;
  margin: 15px auto;
  max-width: 430px;
  color: #414141;
  font-family: sans-serif;

  @media (max-width: 1000px) {
    font-size: 16px;
    line-height: 24px;
  }
`;

const SafeAndSecureSection = styled.div`
  ${commonSection};
  border-bottom: none;

  @media (max-width: 1000px) {
    padding: 100px 0 100px 0px;
    width: 90%;
    margin: 0 auto;
  }

  @media (max-width: 480px) {
    padding: 20px 0 0 0;
  }
`;

const classes = {
  button: {
    backgroundColor: '#ffffff',
    '&:focus': {
      backgroundColor: '#4285f4',
      color: '#ffffff',
    },
  },
};

const buttonAttributes = [
  { label: 'Search', icon: <Search />, gif: WebDemo },
  { label: 'Location', icon: <LocationOn />, gif: LocationDemo },
  { label: 'GIFs', icon: <GIF />, gif: GIFDemo },
  { label: 'Jokes', icon: <Action />, gif: JokesDemo },
  { label: 'Facts', icon: <Web />, gif: FactsDemo },
  { label: 'Math', icon: <PlusOne />, gif: MathDemo },
];

class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gifIndex: 0,
      isVideoModalOpen: false,
    };
  }
  // Toggle Video dialog

  toggleVideoModal = () => {
    this.setState(prevState => ({
      isVideoModalOpen: !prevState.isVideoModalOpen,
    }));
  };

  componentDidMount() {
    document.body.style.backgroundColor = '#fff';
    // Adding title tag to page
    document.title =
      'SUSI.AI - Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots.';
    //  Scrolling to top of page when component loads
    scrollToTopAnimation();

    this.exampleTime = setInterval(() => {
      const { gifIndex } = this.state;
      const newGifIndex = (gifIndex + 1) % 6;
      this.setState({ gifIndex: newGifIndex });
      this.changeGIF(newGifIndex);
    }, 7000);
  }

  componentWillUnmount() {
    clearInterval(this.exampleTime);
  }

  changeGIF(index) {
    this.setState({
      gifIndex: index,
    });
  }

  handleGIFChange = index => {
    this.changeGIF(index);
    clearInterval(this.exampleTime);
  };

  render() {
    const { gifIndex } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Container>
          <SectionContainer>
            <div>
              <MeetSusiImg src={susiGif} alt="Meet SUSI" />
              <Heading>
                Meet SUSI.AI, Your Artificial Intelligence for Personal
                Assistants, Robots, Help Desks and Chatbots.
              </Heading>
              <Para>
                Ask it questions. Tell it to do things. Always ready to help.
              </Para>
              <PlayCircleLink onClick={this.toggleVideoModal}>
                <PlayCircle />
                <WatchSpan>Watch</WatchSpan>
              </PlayCircleLink>
            </div>
          </SectionContainer>
        </Container>
        <Section>
          <ConversationDescription>
            <DescriptionHeading>Ask it anything.</DescriptionHeading>
            <DescriptionText>
              Search for the capital of Vietnam or find translations in
              different languages. Ask SUSI for your location, and what the
              weather’s like when you get there.
            </DescriptionText>
          </ConversationDescription>
          <ImgContainer>
            <SusiTestImg src={susiTestGif} alt="susi-test" />
          </ImgContainer>
        </Section>
        <Section>
          <ConversationDescription>
            <DescriptionHeading>Explore What it can do.</DescriptionHeading>
            <DescriptionText>
              From finding GIF of your favorite cartoon to exploring new things
              that you never thought of before. Susi can do a lot of things that
              you might not expect. Here are some examples of what SUSI can do.
              <br />
              Don&apos;t forget, these are only a few 😊
            </DescriptionText>
            <RowDiv>
              {buttonAttributes.map((button, index) => (
                <Button
                  key={index}
                  className={classes.button}
                  variant="contained"
                  onClick={e => this.handleGIFChange(index)}
                >
                  {button.icon}
                  {button.label}
                </Button>
              ))}
            </RowDiv>
          </ConversationDescription>
          <ImgContainer>
            {buttonAttributes.map((img, index) => (
              <SusiTestImg
                key={index}
                src={buttonAttributes[gifIndex].gif}
                style={gifIndex === index ? {} : { display: 'none' }}
                alt="susi-web"
              />
            ))}
          </ImgContainer>
        </Section>
        <Section>
          <ConversationDescription>
            <DescriptionHeading>Tell it to do things.</DescriptionHeading>
            <DescriptionText>
              SUSI can listen to you through the Mic and answer back on your
              Speaker. You can activate the assistant saying
              <b> &quot;Hi SUSI&quot;</b> already on many clients and devices.
              The more you talk with SUSI the better it gets. You can even tell
              SUSI to remember things.
            </DescriptionText>
          </ConversationDescription>
          <ImgContainer>
            <AndroidMockupImg src={mapAndroid} alt="Map" />
          </ImgContainer>
        </Section>
        <Section>
          <ConversationDescription>
            <DescriptionHeading>For your Smartphone</DescriptionHeading>
            <DescriptionText>
              SUSI is available for <b>Android</b>
              &nbsp;and <b>iOS devices</b>. Download the App to have access to
              SUSI on the go.
            </DescriptionText>
            <DescriptionText>
              <PlayStore
                rel="noopener noreferrer"
                target="_blank"
                href="https://play.google.com/store/apps/details?id=ai.susi"
              >
                {' '}
                Get it on Google Play
              </PlayStore>
              <AppStore
                rel="noopener noreferrer"
                target="_blank"
                href="https://github.com/fossasia/susi_iOS"
              >
                {' '}
                Download on the App Store
              </AppStore>
            </DescriptionText>
          </ConversationDescription>
          <ImgContainer>
            <AndroidMockupImg src={androidMockup} alt="Android Mockup" />
          </ImgContainer>
        </Section>
        <Section style={{ alignItems: 'unset' }}>
          <ColumnSection>
            <CustomDescription>
              <CustomImgContainer>
                <BotsMockupImg src={bots} alt="Android Mockup" />
              </CustomImgContainer>
              <CustomDescriptionHeading>
                On many Platforms
              </CustomDescriptionHeading>
              <DescriptionText>
                <b>SUSI.AI</b> already runs on many chat services and social
                networks. We are developing plugins for all major services
                including &nbsp;
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/fossasia/susi_tweetbot"
                >
                  Twitter
                </a>
                , &nbsp;
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/fossasia/susi_fbbot"
                >
                  Facebook
                </a>
                , &nbsp;
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/fossasia/susi_linebot"
                >
                  Line
                </a>
                , &nbsp;
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/fossasia/susi_slackbot"
                >
                  Slack
                </a>
                , &nbsp;
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/fossasia/susi_wechatbot"
                >
                  We Chat
                </a>
                , &nbsp;
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/fossasia/susi_viberbot"
                >
                  Viber
                </a>
                , &nbsp;
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/fossasia/susi_gitterbot"
                >
                  Gitter
                </a>
                . Just set up SUSI on your channel and add &nbsp;<b>@susi</b> in
                your conversations and SUSI is ready to help.
              </DescriptionText>
            </CustomDescription>
          </ColumnSection>
          <ColumnSection>
            <CustomDescription>
              <CustomImgContainer>
                <BotsMockupImg src={allDevices} alt="Android Mockup" />
              </CustomImgContainer>
              <CustomDescriptionHeading>
                For all Devices
              </CustomDescriptionHeading>
              <DescriptionText>
                <b>SUSI.AI</b> is available for any android, iOS device and also
                you can access the web chat application from this URL{' '}
                <a href={urls.CHAT_URL}>{urls.CHAT_URL}</a>
              </DescriptionText>
            </CustomDescription>
          </ColumnSection>
          <ColumnSection>
            <CustomDescription>
              <CustomImgContainer>
                <BotsMockupImg src={manyLanguages} alt="Android Mockup" />
              </CustomImgContainer>
              <CustomDescriptionHeading>
                Use it in many Languages
              </CustomDescriptionHeading>
              <DescriptionText>
                You can use <b>SUSI.AI</b> in different languages. You can ask
                questions in many languages. SUSI is intelligent to identify and
                answer your question in your language.
              </DescriptionText>
            </CustomDescription>
          </ColumnSection>
        </Section>
        <SectionCenter>
          <CenterDescription>
            <DescriptionHeading style={{ textAlign: 'center' }}>
              SUSI Skills
            </DescriptionHeading>
            <DescriptionText>
              SUSI is having many skills. You can look at the collection of
              skills at{' '}
              <Link
                to="/skills"
                style={{ textDecoration: 'none' }}
                target="_blank"
              >
                susi.ai/skills
              </Link>{' '}
              SUSI skills are divided into groups like knowledge, assistant,
              problem solving, entertainment, shopping and small talks. SUSI
              Skill development is easy and fun.{' '}
            </DescriptionText>
          </CenterDescription>
          <CustomImgContainer>
            <SkillWikiImg src={susiSkill} alt="Skills" />
          </CustomImgContainer>
        </SectionCenter>
        <SafeAndSecureSection>
          <ConversationDescription>
            <DescriptionHeading>Safe and secure.</DescriptionHeading>
            <DescriptionText>
              <b>SUSI.AI</b> is{' '}
              <b>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: '#000' }}
                  href="https://github.com/fossasia?utf8=%E2%9C%93&q=susi"
                >
                  Open Source
                </a>
              </b>
              . The code is always available for security reviews and can be
              improved by anyone with the knowledge and understanding online.
            </DescriptionText>
            <OpenSourceLogos>
              <OpenSource>
                <a
                  rel="noopener noreferrer"
                  href="https://opensource.org/"
                  target="_blank"
                >
                  <OpenSourceImg src={openSource} alt="osi" />
                </a>
              </OpenSource>
              <GithubLogo>
                <a
                  rel="noopener noreferrer"
                  href="https://github.com/fossasia?utf8=✓&q=susi"
                  target="_blank"
                >
                  <GithubImg src={githubText} alt="ghlogo" />
                </a>
              </GithubLogo>
            </OpenSourceLogos>
          </ConversationDescription>
          <ImgContainer>
            <ShieldImg src={shield} alt="Android Mockup" />
          </ImgContainer>
        </SafeAndSecureSection>
        {/* Video */}
        <VideoModal
          isOpen={this.state.isVideoModalOpen}
          onRequestClose={this.toggleVideoModal}
          contentLabel="Assistant Video"
          overlayClassName="Video-Overlay"
        >
          <VideoContainer>
            <Iframe
              id="player"
              title="SUSI features Video"
              type="text/html"
              frameBorder="0"
              allowFullScreen
              src="https://www.youtube.com/embed/tIG5griC-G0?enablejsapi=1&autoplay=1"
            />
            <CloseIcon onClick={this.toggleVideoModal} />
          </VideoContainer>
        </VideoModal>
      </div>
    );
  }
}
Overview.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  classes: PropTypes.object,
};
export default withStyles(classes)(Overview);
