import React, { Component } from 'react';
import './Team.css';
import PropTypes  from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import team from './TeamList';
import {Card, CardActions, CardMedia, CardTitle} from 'material-ui/Card';
import StaticAppBar from '../StaticAppBar/StaticAppBar.react';

class Support extends Component {

    constructor(props) {
      super(props);
      this.state = {
        open: false,
        showOptions: false,
        login:false,
        signup:false,
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
    handleToggle = () => this.setState({open: !this.state.open});
    handleDrawer = () => this.setState({openDrawer: !this.state.openDrawer});
    handleDrawerClose = () => this.setState({openDrawer: false});
    handleTitle = () => {
      this.props.history.push('/');
    }
    handleLogin = () => this.setState({
      login:true,
      signup: false
    })
    handleClose = () => this.setState({
      login: false,
      signup: false,
      open: false
    })
    handleSignUp = () => this.setState({
      signup:true,
      login:false
    })
    _onReady(event) {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    }
    render() {
    const overlayStyle = {
      paddingTop : '0px',

    }

    let mentors = team[0].mentors.map((mentor,i)=>{
      return (
        <Card className='team-card' key={i}>
          <CardMedia
            overlay={<CardTitle style={overlayStyle} title={mentor.name} />}
          >
            <img src={mentor.avatar} alt={mentor.name} />
          </CardMedia>
          <CardActions>
            <FlatButton
                  href={mentor.github}
                  target="_blank"
                  label="GitHub"
                  icon={<FontIcon className="muidocs-icon-github" />}
                />
          </CardActions>
        </Card>)
    })
    let server = team[1].server.map((serv,i)=>{
      return (
        <Card className='team-card' key={i}>
          <CardMedia
            overlay={<CardTitle style={overlayStyle} title={serv.name} />}
          >
            <img src={serv.avatar} alt={serv.name} />
          </CardMedia>
          <CardActions>
            <FlatButton
                  href={serv.github}
                  target="_blank"
                  label="GitHub"
                  icon={<FontIcon className="muidocs-icon-github" />}
                />
          </CardActions>
        </Card>)
    })
    let web = team[3].web.map((webTeam,i)=>{
      return (
        <Card className='team-card' key={i}>
          <CardMedia
            overlay={<CardTitle style={overlayStyle} title={webTeam.name} />}
          >
            <img src={webTeam.avatar} alt={webTeam.name} />
          </CardMedia>
          <CardActions>
            <FlatButton
                  href={webTeam.github}
                  target="_blank"
                  label="GitHub"
                  icon={<FontIcon className="muidocs-icon-github" />}
                />
          </CardActions>
        </Card>)
    })
    let android = team[2].android.map((member,i)=>{
      return (
        <Card className='team-card' key={i}>
          <CardMedia
            overlay={<CardTitle style={overlayStyle} title={member.name} />}
          >
            <img src={member.avatar} alt={member.name} />
          </CardMedia>
          <CardActions>
            <FlatButton
                  href={member.github}
                  target="_blank"
                  label="GitHub"
                  icon={<FontIcon className="muidocs-icon-github" />}
                />
          </CardActions>
        </Card>)
    })
    let ios = team[4].ios.map((member,i)=>{
      return (
        <Card className='team-card' key={i}>
          <CardMedia
            overlay={<CardTitle style={overlayStyle} title={member.name} />}
          >
            <img src={member.avatar} alt={member.name} />
          </CardMedia>
          <CardActions>
            <FlatButton
                  href={member.github}
                  target="_blank"
                  label="GitHub"
                  icon={<FontIcon className="muidocs-icon-github" />}
                />
          </CardActions>
        </Card>)
    })
    let hardware = team[5].hardware.map((member,i)=>{
      return (
        <Card className='team-card' key={i}>
          <CardMedia
            overlay={<CardTitle style={overlayStyle} title={member.name} />}
          >
            <img src={member.avatar} alt={member.name} />
          </CardMedia>
          <CardActions>
            <FlatButton
                  href={member.github}
                  target="_blank"
                  label="GitHub"
                  icon={<FontIcon className="muidocs-icon-github" />}
                />
          </CardActions>
        </Card>)
    })
    let bots = team[6].bots.map((member,i)=>{
      return (
        <Card className='team-card' key={i}>
          <CardMedia
            overlay={<CardTitle style={overlayStyle} title={member.name} />}
          >
            <img src={member.avatar} alt={member.name} />
          </CardMedia>
          <CardActions>
            <FlatButton
                  href={member.github}
                  target="_blank"
                  label="GitHub"
                  icon={<FontIcon className="muidocs-icon-github" />}
                />
          </CardActions>
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
                paddingBottom: '240px'}}>

                <div className="team-header">
                  <div className="support__heading">Developers</div>

                </div>

                <div className='team-container'>{server}{web}
                {android}{ios}{hardware}{bots}</div>

              </div>
              <div className='footer'>
                <div className='footer-container'>
                <img src='susi.svg' alt='SUSI' className='susi-logo' />
                <ul className='alignLeft'>
                <li><a href='/about'>About</a></li>
                <li><a href='http://blog.fossasia.org/tag/susi-ai/'>Blog</a></li>
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
