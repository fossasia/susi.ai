import React, { Component } from 'react';
import './Team.css';
import PropTypes from 'prop-types';
import team from './TeamList';
import susi from '../../images/susi.svg';
import { Card, CardMedia, CardTitle } from 'material-ui/Card';
import StaticAppBar from '../StaticAppBar/StaticAppBar.react';
import 'font-awesome/css/font-awesome.min.css';
import FourButtons from './FourButtons.react';

class Support extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      showOptions: false,
      login: false,
      signup: false,
      openDrawer: false,
      baseUrl: window.location.protocol + '//' + window.location.host + '/',
      team: team
    };
  }
  showOptions = (event) => {
    event.preventDefault();
    this.setState({
      showOptions: true,
      anchorEl: event.currentTarget
    })
  }

  closeOptions = () => {
    this.setState({
      showOptions: false,
    });
  };
  handleToggle = () => this.setState({ open: !this.state.open });
  handleDrawer = () => this.setState({ openDrawer: !this.state.openDrawer });
  handleDrawerClose = () => this.setState({ openDrawer: false });
  handleTitle = () => {
    this.props.history.push('/');
  }
  handleLogin = () => this.setState({
    login: true,
    signup: false
  })
  handleClose = () => this.setState({
    login: false,
    signup: false,
    open: false
  })
  handleSignUp = () => this.setState({
    signup: true,
    login: false
  })
  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
  render() {

    let mentors = team[0].mentors.map((mentor, i) => {
      return (
        <Card className='team-card' key={i}>
          <CardMedia className="container">
            <img src={mentor.avatar} alt={mentor.name} className="image" />
            <div className="overlay" >
              <div className="text">
                <FourButtons member={mentor} />
              </div>
            </div>
          </CardMedia>
          <CardTitle title={mentor.name} subtitle={mentor.designation} />
        </Card>)
    })
    let managers = team[2].managers.map((manager, i) => {
      return (
        <Card className='team-card' key={i}>
          <CardMedia className="container">
            <img src={manager.avatar} alt={manager.name} className="image" />
            <div className="overlay" >
              <div className="text">
                <FourButtons member={manager} />
              </div>
            </div>
          </CardMedia>
          <CardTitle title={manager.name} subtitle={manager.designation} />

        </Card>)
    })
    function compare(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name)
      { return 1; }
      return 0;
    }

    team[1].server.sort(compare);
    let server = team[1].server.map((serv, i) => {
      return (
        <Card className='team-card' key={i}>
          <CardMedia className="container" >
            <img src={serv.avatar} alt={serv.name} className="image" />
            <div className="overlay" >
              <div className="text">
                <FourButtons member={serv} />
              </div>
            </div>
          </CardMedia>
          <CardTitle title={serv.name} subtitle={serv.designation} />

        </Card>)
    })

    return (
      <div>
        <StaticAppBar {...this.props}
          location={this.props.location} />
        <div className="section-team grey-background">
          <div className='section-container-team'>
            <div className="team-header">
              <div className="support__heading center">Team <b>SUSI.AI</b></div>
            </div>
          </div>
        </div>
        <div className="section-team">

          <div className="team-header">
            <div className="support__heading">Project Founders</div>
          </div>
          <div className='team-container'>{mentors}</div>
        </div>

        <div className="section-team" style={{
          paddingBottom: '240px'
        }}>
          <div className="team-header">
            <div className="support__heading">Project Managers</div>
          </div>
          <div className='team-container'>{managers}</div>
        </div>

         <div className="section-team" style={{
          paddingBottom: '240px'
        }}>

          <div className="team-header">
            <div className="support__heading">Developers</div>
          </div>
          <div className='team-container'>{server}</div>
        </div>
        <div className='footer'>
                <div className='footer-container'>
                <a href='/overview'>
                <img src={susi} alt='SUSI' className='susi-logo' />
                </a>
                <ul className='alignLeft'>
                <li><a href='/overview'>Overview</a></li>
                <li><a href='/blog'>Blog</a></li>
                <li><a href='https://github.com/fossasia?utf8=%E2%9C%93&q=susi'>Code</a></li>
                </ul>
                <ul className='alignRight'>
                <li><a href='/settings'>Settings</a></li>
                <li><a href='/terms'>Terms</a></li>
                <li><a href='/contact'>Contact</a></li>
                </ul>
                </div>
        </div>

      </div>
    );
  };
}

Support.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object

}

export default Support;
