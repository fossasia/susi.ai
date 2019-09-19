import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _Card from '@material-ui/core/Card';
import SocialLinkButtons from './SocialLinkButtons';
import { Header } from '../../shared/About';
import { scrollToTopAnimation } from '../../../utils/animateScroll';
import TEAM_MEMBERS from '../../../constants/team';
import 'font-awesome/css/font-awesome.min.css';
import Typography from '@material-ui/core/Typography';
import ToTopButton from '../../shared/ToTopButton';
import styled from 'styled-components';

const Section = styled.div`
  margin: 0 auto;
  max-width: none;
  position: relative;
  align-items: center;
  box-shadow: inset 0 12.5rem 12.5rem -12.5rem #fff,
    inset 0 -12.5rem 12.5rem -12.5rem #fff;
  display: flex;
  max-width: 100%;
  width: 65.625rem;
  padding: 3.125rem 1.25rem 8.75rem 1.25rem;
  flex-flow: row wrap;
  justify-content: space-between;
  border-bottom: 0.063rem solid #dfdfdf;

  @media (max-width: 1000px) {
    padding: 3.125rem 1.25rem 8.75rem 1.25rem;
    width: 95%;
  }

  @media (max-width: 800px) {
    padding: 3.125rem 0rem 8.75rem 0rem;
  }

  @media (max-width: 480px) {
    padding-bottom: 1.25rem;
  }
`;

const Card = styled(_Card)`
  margin: 0.625rem 0.625rem 0 0;
  max-width: 14.688rem;

  @media (max-width: 1000px) {
    max-width: 15rem;
  }

  @media (max-width: 800px) {
    max-width: 100%;
    width: 30%;
    margin: 0.625rem auto;
  }

  @media (max-width: 480px) {
    width: 70%;
  }
`;

const Img = styled.img`
  max-width: 14.688rem;

  @media (max-width: 1000px) {
    max-width: 15rem;
  }

  @media (max-width: 800px) {
    max-width: 100%;
  }
`;

const TeamContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0rem;
`;

const Heading = styled.div`
  color: #414141;
  font: 300 2.125rem/2.5rem sans-serif;
  letter-spacing: -0.01em;
  margin: 2.5rem 0 1.25rem;
  text-align: left;

  @media (max-width: 1000px) {
    font-size: 2.25rem;
    margin-top: 0;
  }

  @media (max-width: 480px) {
    margin-top: 1rem;
  }
`;

const Container = styled.div`
  position: relative;
`;

const OverLay = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background-color: #000;
  overflow: hidden;
  width: 100%;
  height: 0;
  transition: 0.3s ease;
  opacity: 0;

  ${Container}:hover & {
    bottom: 0;
    height: 100%;
    opacity: 0.7;
  }
`;

const Text = styled.div`
  opacity: 1;
  white-space: nowrap;
  color: white;
  font-size: 1.25rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media (max-width: 480px) {
    margin: 0rem -0.625rem 0.125rem 0rem;
  }
`;

const Description = styled.div`
  padding: 1rem;
`;

export default class Team extends Component {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      showScrollToTop: false,
    };
  }

  componentDidMount() {
    //  Scrolling to top of page when component loads
    scrollToTopAnimation();
    // Adding title tag to page
    document.title =
      'Developer Team of SUSI.AI - Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots';
    /* Adding scroll event Listener to window,
    to display ToTopButton only when the user has scrolled 90px*/
    window.addEventListener('scroll', this.showScrollToTop);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.showScrollToTop);
  }

  showScrollToTop = () => {
    this.setState({
      showScrollToTop: window.scrollY >= 90,
    });
  };

  createMemberCard = (member, key) => {
    return (
      <Card key={key}>
        <Container>
          <Img
            /* eslint no-undef: 0 */
            src={require(`../../../images/members/${member.avatar}`)}
            alt={member.name}
          />
          <OverLay>
            <Text>
              <SocialLinkButtons member={member} />
            </Text>
          </OverLay>
        </Container>
        <Description>
          <Typography variant="h5" gutterBottom>
            {member.name}
          </Typography>
          <Typography variant="subtitle1">{member.designation}</Typography>
        </Description>
      </Card>
    );
  };

  render() {
    const { showScrollToTop } = this.state;
    document.body.style.setProperty('background-image', 'none');
    const mentors = TEAM_MEMBERS.MENTORS.map((mentor, i) => {
      return this.createMemberCard(mentor, i);
    });
    const managers = TEAM_MEMBERS.MANAGERS.map((manager, i) => {
      return this.createMemberCard(manager, i);
    });
    const developers = TEAM_MEMBERS.DEVELOPERS.map((developer, i) => {
      return this.createMemberCard(developer, i);
    });
    const alumnis = TEAM_MEMBERS.ALUMNIS.map((alum, i) => {
      return this.createMemberCard(alum, i);
    });

    return (
      <div>
        <Header title="Team" />
        <Section>
          <Heading>Project Founders</Heading>
          <TeamContainer>{mentors}</TeamContainer>
        </Section>
        <Section>
          <Heading>Project Managers</Heading>
          <TeamContainer>{managers}</TeamContainer>
        </Section>
        <Section>
          <Heading>Developers</Heading>
          <TeamContainer>{developers}</TeamContainer>
        </Section>
        <Section>
          <Heading>Alumni</Heading>
          <TeamContainer>{alumnis}</TeamContainer>
        </Section>

        <div style={{ display: showScrollToTop ? 'inline-block' : 'none' }}>
          <ToTopButton />
        </div>
      </div>
    );
  }
}
