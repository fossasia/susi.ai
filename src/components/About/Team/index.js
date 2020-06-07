import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _Card from '@material-ui/core/Card';
import 'font-awesome/css/font-awesome.min.css';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import SocialLinkButtons from './SocialLinkButtons';
import { Header } from '../../shared/About';
import TEAM_MEMBERS from '../../../constants/team';
import { getContributors } from '../../../apis/index';

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
  width: 14.688rem;

  @media (max-width: 800px) {
    width: 100%;
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
  width: 100%;
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

const Team = (props) => {
  let [contributors, updataContributors] = useState([]);

  useEffect(() => {
    document.title =
      'Developer Team of SUSI.AI - Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots';

    (async function fetchContributorsList() {
      const response = await getContributors();
      let flags = [],
        output = [];
      for (let i = 0; i < response.length; i++) {
        if (flags[response[i].name]) {
          continue;
        }
        flags[response[i].name] = true;
        output.push(response[i]);
      }
      updataContributors(output);
    })();
  }, []);

  const createContributorCard = (contributor, key) => {
    return (
      <Card key={key}>
        <Container>
          <Img
            /* eslint no-undef: 0 */
            src={contributor.avatar}
            alt={contributor.name}
          />
          <OverLay>
            <Text>
              <SocialLinkButtons member={contributor} />
            </Text>
          </OverLay>
        </Container>
        <Description>
          <Typography variant="h6" gutterBottom>
            {contributor.name}
          </Typography>
        </Description>
      </Card>
    );
  };

  const createMemberCard = (member, key) => {
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

  document.body.style.setProperty('background-image', 'none');
  const contributorsToDisplay = contributors.map((contributor, i) => {
    return createContributorCard(contributor, i);
  });
  const mentors = TEAM_MEMBERS.MENTORS.map((mentor, i) => {
    return createMemberCard(mentor, i);
  });
  const managers = TEAM_MEMBERS.MANAGERS.map((manager, i) => {
    return createMemberCard(manager, i);
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
        <Heading>Contributors</Heading>
        <TeamContainer>{contributorsToDisplay}</TeamContainer>
      </Section>
    </div>
  );
};

Team.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};

export default Team;
