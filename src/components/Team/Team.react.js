import React, { Component } from 'react';
import './Team.css';
import PropTypes from 'prop-types';
import team from './TeamList';
import { Card, CardMedia, CardTitle } from 'material-ui/Card';
import StaticAppBar from '../StaticAppBar/StaticAppBar.react';
import 'font-awesome/css/font-awesome.min.css';
import FourButtons from './FourButtons.react';
import $ from 'jquery';
import Footer from '../Footer/Footer.react';

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


  componentDidMount() {
    //  Scrolling to top of page when component loads
    $('html, body').animate({ scrollTop: 0 }, 'fast');
    // Adding title tag to page
    document.title = 'Developer Team of SUSI.AI - Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots';
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
  // Open login dialog and close signup dialog
  handleLogin = () => this.setState({
    login: true,
    signup: false
  })
  // Close all dialogs
  handleClose = () => this.setState({
    login: false,
    signup: false,
    open: false
  })
  // Open Signup dialog and close login dialog
  handleSignUp = () => this.setState({
    signup: true,
    login: false
  })

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  render() {
		document.body.style.setProperty('background-image', 'none');
    let mentors = team[0].mentors.map((mentor, i) => {
      return (
        <Card className='team-card' key={i}>
          <CardMedia className="container_div">
            <img src={mentor.avatar} alt={mentor.name} className="image" />
            <div className="overlay" >
              <div className="text">
                <FourButtons member={mentor} />
              </div>
            </div>
          </CardMedia>
          <CardTitle titleStyle={{ fontSize: '20px' }} title={mentor.name} subtitle={mentor.designation} />
        </Card>)
    })
    let managers = team[2].managers.map((manager, i) => {
      return (
        <Card className='team-card' key={i}>
          <CardMedia className="container_div">
            <img src={manager.avatar} alt={manager.name} className="image" />
            <div className="overlay" >
              <div className="text">
                <FourButtons member={manager} />
              </div>
            </div>
          </CardMedia>
          <CardTitle titleStyle={{ fontSize: '20px' }} title={manager.name} subtitle={manager.designation} />

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
          <CardMedia className="container_div" >
            <img src={serv.avatar} alt={serv.name} className="image" />
            <div className="overlay" >
              <div className="text">
                <FourButtons member={serv} />
              </div>
            </div>
          </CardMedia>
          <CardTitle titleStyle={{ fontSize: '20px', lineHeight: '25px' }} title={serv.name} subtitle={serv.designation} />

        </Card>)
    })

    return (
      <div>
        <StaticAppBar {...this.props}
          location={this.props.location} />
        <div className='head_section'>
          <div className='container'>
            <div className="heading">
              <h1>Team</h1>
            </div>
          </div>
        </div>
        <div className="section-team founders">

          <div className="team-header">
            <div className="support__heading">Project Founders</div>
          </div>
          <div className='team-container'>{mentors}</div>
        </div>

        <div className="section-team managers" style={{
          paddingBottom: '240px'
        }}>
          <div className="team-header ">
            <div className="support__heading">Project Managers</div>
          </div>
          <div className='team-container'>{managers}</div>
        </div>

        <div className="section-team developers" style={{
          paddingBottom: '240px'
        }}>

          <div className="team-header ">
            <div className="support__heading">Developers</div>
          </div>
          <div className='team-container'>{server}</div>
        </div>
        <Footer />


      </div>
    );
  };
}

Support.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object

}

export default Support;
