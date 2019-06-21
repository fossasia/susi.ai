import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { scrollToTopAnimation } from '../../utils/animateScroll';
import stackoverflow from '../../images/stackoverflow.png';
import { Header } from '../shared/About';
import support from '../../images/support.png';
import question from '../../images/question.png';
import documentation from '../../images/programmer.png';
import github from '../../images/github.png';
import googleGroups from '../../images/google-groups.png';
import code from '../../images/code.png';
import uiActions from '../../redux/actions/ui';
import styled from 'styled-components';

const GrayWrapper = styled.div`
  background: #f7f7f7;
  width: 100%;

  @media (max-width: 768px) {
    display: none;
  }
`;

const WhiteGrayWrapper = styled.div`
  max-width: 85%;
  width: 935px;
  margin: 0 auto;
  max-width: none;
  padding: 50px 20px 50px 20px;
  position: relative;
  align-items: center;
  display: -ms-flexbox;
  display: -webkit-box;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;

  @media (max-width: 480px) {
    padding: 70px 20px;
  }
`;

const ConversationDescription = styled.div`
  width: 100%;

  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;

const CustomConversationDescription = styled.div`
  width: 50%;
`;

const FooterDescription = styled.div`
  width: 50%;
  margin: 0 auto;
`;

const SupportHeading = styled.div`
  color: #414141;
  font: 300 34px/40px sans-serif;
  letter-spacing: -0.01em;
  margin: 40px 0 20px;
  text-align: left;

  @media (max-width: 1000px) {
    font-size: 36px;
    margin-top: 0;
  }

  @media (max-width: 480px) {
    margin-top: 1rem;
  }
`;

const SupportDescription = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  font-family: sans-serif;
  margin-left: 30px;
  font-weight: 300;
  text-decoration: none;
`;

const SupportDescriptionContent = styled.div`
  text-align: left;
  font-size: 16px;
  line-height: 22px;
`;

const Section = styled.div`
  position: relative;
  align-items: center;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  border-bottom: 1px solid #dfdfdf;
  margin: 0 auto;
  max-width: 85%;
  width: 60%;

  @media (max-width: 1000px) {
    width: 100%;
  }

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const SupportItemIconContainer = styled.div`
  height: auto;
  width: 40px;
`;

const SupportItemIcon = styled.img`
  font-size: 40px;
  height: auto;
  margin-left: 4px;
  width: 40px;
  border: 0;
  max-width: 100%;
`;

const SupportText = styled.p`
  font-size: 20px;
  font-weight: 300;
  line-height: 32px;
  max-width: 740px;
  color: #414141;
  font-family: sans-serif;

  @media (max-width: 1000px) {
    max-width: 100%;
  }

  @media (max-width: 800px) {
    font-size: 16px;
    line-height: 24px;
  }
`;

const ImgContainer = styled.div`
  width: 30%;
  @media (max-width: 800px) {
    width: 100%;
    text-align: center;
  }
`;

const RowGroup = styled.div`
  display: flex;
  margin: 30px 0;

  @media (max-width: 1000px) {
    display: block;
  }

  @media (max-width: 480px) {
    margin: 0rem;
  }
`;

const RowDescription = styled.div`
  display: flex;
  margin: 10px 0px;
`;

const SignUpWrapper = styled.div`
  background: #4285f4;
  width: 100%;
`;

const SignUpFooter = styled.div`
  text-align: center;
  box-shadow: none;
  display: block;
  padding: 50px 20px 50px 20px;

  @media (min-width: 1400px) {
    position: relative;
    top: 100px;
    padding: 0 0 150px 0;
  }

  @media (max-width: 1000px) {
    padding: 50px 20px 50px 20px;
  }
`;

const FooterHeading = styled.div`
  text-align: center;
  margin: 0px auto;
  color: #f2f2f2;
  font: 300 34px/40px sans-serif;
  letter-spacing: -0.01em;
`;

const SupportImg = styled.img`
  align-self: center;
  margin: 0;
  max-width: 100%;

  @media (max-width: 800px) {
    display: inline-block;
    width: 40%;
    padding: 50px;
  }
`;

const Heading = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Button = styled(_Button)`
  margin-top: 25px;
  margin-bottom: 25px;
`;

const H3 = styled.h3`
  font: 400 20px/32px Roboto, sans-serif;
  margin: 0 0 12px;
  padding: 0;
  text-align: left;
  color: #039be5;
`;

class Support extends Component {
  static propTypes = {
    history: PropTypes.object,
    openSignUp: PropTypes.func,
    accessToken: PropTypes.string,
    actions: PropTypes.object,
  };

  componentDidMount() {
    // Adding title tag to page
    document.title =
      'Support for SUSI.AI - Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots';
    //  Scrolling to top of page when component loads
    scrollToTopAnimation();
  }

  handleSignUp = () => {
    const { actions } = this.props;
    actions.openModal({ modalType: 'signUp' });
  };

  render() {
    const { openSignUp, accessToken } = this.props;

    return (
      <div>
        <Heading>
          <Header
            title="Support"
            subtitle="Get the help and information you need from our community and
        team through various channels."
          />
        </Heading>
        <GrayWrapper>
          <WhiteGrayWrapper>
            <CustomConversationDescription>
              <SupportHeading>Support</SupportHeading>
              <SupportText>
                Get the help and information you need from our community and
                team through various channels.
              </SupportText>
            </CustomConversationDescription>
            <ImgContainer>
              <SupportImg src={support} alt="support" />
            </ImgContainer>
          </WhiteGrayWrapper>
        </GrayWrapper>
        <Section>
          <ConversationDescription>
            <SupportHeading>Developer Documentation</SupportHeading>
          </ConversationDescription>
          <RowGroup>
            <RowDescription>
              <a href="http://dev.susi.ai/">
                <SupportItemIconContainer>
                  <SupportItemIcon alt="gitter" src={documentation} />
                </SupportItemIconContainer>
              </a>
              <SupportDescription>
                <a href="http://dev.susi.ai/">
                  <H3>SUSI.AI Docs</H3>
                </a>
                <SupportDescriptionContent>
                  Access the full Developer Documentation on{' '}
                  <a href="http://dev.susi.ai">dev.susi.ai</a> to begin setting
                  up and running SUSI.AI on your machine.
                </SupportDescriptionContent>
              </SupportDescription>
            </RowDescription>
          </RowGroup>
        </Section>
        <Section>
          <ConversationDescription>
            <SupportHeading>Ask the community</SupportHeading>
          </ConversationDescription>
          <RowGroup>
            <RowDescription>
              <a href="https://stackoverflow.com/questions/tagged/susi.ai">
                <SupportItemIconContainer>
                  <SupportItemIcon alt="gitter" src={stackoverflow} />
                </SupportItemIconContainer>
              </a>
              <SupportDescription>
                <a href="https://stackoverflow.com/questions/tagged/susi.ai">
                  <H3>Stack Overflow</H3>
                </a>
                <SupportDescriptionContent>
                  Your resource for all technical questions and answers
                </SupportDescriptionContent>
              </SupportDescription>
            </RowDescription>
            <RowDescription>
              <a href="http://groups.google.com/forum/#!forum/susiai">
                <SupportItemIconContainer>
                  <SupportItemIcon alt="google groups" src={googleGroups} />
                </SupportItemIconContainer>
              </a>
              <SupportDescription>
                <a href="http://groups.google.com/forum/#!forum/susiai">
                  <H3>SUSI.AI Forums</H3>
                </a>
                <SupportDescriptionContent>
                  Discuss about the projects on our Google Groups Channel.
                </SupportDescriptionContent>
              </SupportDescription>
            </RowDescription>
            <RowDescription>
              <a href="https://github.com/fossasia?utf8=%E2%9C%93&q=susi&type=&language=">
                <SupportItemIconContainer>
                  <SupportItemIcon alt="github" src={github} />
                </SupportItemIconContainer>
              </a>
              <SupportDescription>
                <a href="https://github.com/fossasia?utf8=%E2%9C%93&q=susi&type=&language=">
                  <H3>Github</H3>
                </a>
                <SupportDescriptionContent>
                  Visit our repositories and start contributing.
                </SupportDescriptionContent>
              </SupportDescription>
            </RowDescription>
          </RowGroup>
        </Section>
        <Section>
          <ConversationDescription>
            <SupportHeading>
              Browse, Create and Edit your own Skills
            </SupportHeading>
          </ConversationDescription>
          <RowGroup>
            <RowDescription>
              <a href="http://dream.susi.ai">
                <SupportItemIconContainer>
                  <SupportItemIcon alt="code" src={code} />
                </SupportItemIconContainer>
              </a>
              <SupportDescription>
                <a href="http://dream.susi.ai">
                  <H3>Test SUSI.AI Skills and Create Dreams</H3>
                </a>
                <SupportDescriptionContent>
                  You can insert your skill code and test it on the SUSI.AI
                  Etherpad at
                  <a href="http://dream.susi.ai">&nbsp;dream.susi.ai</a>
                </SupportDescriptionContent>
              </SupportDescription>
            </RowDescription>
            <RowDescription>
              <Link to="/skills" style={{ textDecoration: 'none' }}>
                <SupportItemIconContainer>
                  <SupportItemIcon alt="code" src={code} />
                </SupportItemIconContainer>
              </Link>
              <SupportDescription>
                <Link to="/skills" style={{ textDecoration: 'none' }}>
                  <H3>Create and Edit a SUSI.AI skill</H3>
                </Link>
                <SupportDescriptionContent>
                  You can easily create a skill on the SUSI.AI skills editor at{' '}
                  <Link to="/skills" style={{ textDecoration: 'none' }}>
                    susi.ai/skills
                  </Link>
                </SupportDescriptionContent>
              </SupportDescription>
            </RowDescription>
          </RowGroup>
        </Section>
        <Section>
          <ConversationDescription>
            <SupportHeading>Chat With Us</SupportHeading>
          </ConversationDescription>
          <RowGroup>
            <RowDescription>
              <a href="https://gitter.im/fossasia/susi_server">
                <SupportItemIconContainer>
                  <SupportItemIcon alt="question" src={question} />
                </SupportItemIconContainer>
              </a>
              <SupportDescription>
                <a href="https://gitter.im/fossasia/susi_server">
                  <H3>Get Support</H3>
                </a>
                <SupportDescriptionContent>
                  Facing a problem? Join us on
                  <a href="https://gitter.im/fossasia/susi_server"> gitter </a>
                  <br />
                  Found a bug? File it on{' '}
                  <a href="https://github.com/fossasia/susi_server/">
                    github
                  </a>{' '}
                  and our developers will look into it
                </SupportDescriptionContent>
              </SupportDescription>
            </RowDescription>
          </RowGroup>
        </Section>
        <SignUpWrapper>
          {!accessToken ? (
            <SignUpFooter>
              <FooterDescription>
                <FooterHeading>Get Started Today</FooterHeading>

                <Button variant="contained" onClick={openSignUp}>
                  Sign Up
                </Button>
              </FooterDescription>
            </SignUpFooter>
          ) : null}
        </SignUpWrapper>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

function mapStateToProps(store) {
  const { accessToken } = store.app;
  return {
    accessToken,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Support);
