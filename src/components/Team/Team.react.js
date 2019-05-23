import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import StaticAppBar from '../StaticAppBar/StaticAppBar.react';
import SocialLinkButtons from './SocialLinkButtons';
import Footer from '../Footer/Footer.react';
import { Header } from '../shared/About';
import { scrollToTopAnimation } from '../../utils/animateScroll';
import TEAM_MEMBERS from './constants';
import 'font-awesome/css/font-awesome.min.css';
import './Team.css';
import Typography from '@material-ui/core/Typography';
import ToTopButton from '../Button/ToTopButton.react';

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
      <Card className="team-card" key={key}>
        <div className="container_div">
          <img
            /* eslint no-undef: 0 */
            src={require(`../../images/members/${member.avatar}`)}
            alt={member.name}
            className="image"
          />
          <div className="overlay">
            <div className="text">
              <SocialLinkButtons member={member} />
            </div>
          </div>
        </div>
        <div style={{ padding: '1rem' }}>
          <Typography variant="h5" gutterBottom>
            {member.name}
          </Typography>
          <Typography variant="subtitle1">{member.designation}</Typography>
        </div>
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
        <StaticAppBar {...this.props} location={this.props.location} />
        <Header title="Team" />
        <div className="section-team founders">
          <div className="team-header">
            <div className="support__heading">Project Founders</div>
          </div>
          <div className="team-container">{mentors}</div>
        </div>
        <div className="section-team managers">
          <div className="team-header ">
            <div className="support__heading">Project Managers</div>
          </div>
          <div className="team-container">{managers}</div>
        </div>

        <div className="section-team developers">
          <div className="team-header ">
            <div className="support__heading">Developers</div>
          </div>
          <div className="team-container">{developers}</div>
        </div>

        <div className="section-team developers">
          <div className="team-header ">
            <div className="support__heading">Alumni</div>
          </div>
          <div className="team-container">{alumnis}</div>
        </div>

        <div style={{ display: showScrollToTop ? 'inline-block' : 'none' }}>
          <ToTopButton />
        </div>
        <Footer />
      </div>
    );
  }
}
