import React, { Component } from 'react';
import './Support.css';
import support from '../../images/support.png';
import stackoverflow from '../../images/stackoverflow.png';
import googleGroups from '../../images/google-groups.png';
import github from '../../images/github.png';
import question from '../../images/question.png';
import documentation from '../../images/programmer.png';
import code from '../../images/code.png';
import susi from '../../images/susi.svg';
import PropTypes  from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import StaticAppBar from '../StaticAppBar/StaticAppBar.react';

class Support extends Component {

    constructor(props) {
      super(props);
      this.state = {
        open: false,
        showOptions: false,
        login:false,
        signup:false
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

    handleClose = () => this.setState({open: false});

    handleTitle = () => {
      this.props.history.push('/');
    }
    handleLogin = () => this.setState({
      login:true,
      signup: false
    })
    handleClose = () => this.setState({
      login: false,
      signup: false
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

    const style ={
      marginTop: '25px',
      marginBottom: '25px'
    }

    return (
            <div>
              <StaticAppBar {...this.props} location={this.props.location}/>

              <div className="section white-grey" style={{margin:'20px 0 0 0'}}>
                <div className="conversation__description">
                  <div className="support__heading">Support</div>
                  <p className="support__text">
                  Get the help and information you need from our
                  community and team through various channels.
                  </p>
                </div>
                <div className='image-container'>
                  <img src={support} alt='support' className='support' />
                </div>
              </div>
              <div className="section">
                <div className="conversation__description">
                  <div className="support__heading">Developer Documentation</div>
                </div>
                <div className="devsite-landing-row-group">
                <div className="devsite-landing-row-item devsite-landing-row-item-with-icon devsite-landing-row-item-no-image
                    ">
                    <a href="http://dev.susi.ai/">
                    <div className="devsite-landing-row-item-icon-container">
                    <img alt='gitter' src={documentation} className="devsite-landing-row-item-icon"/></div></a>
                    <div className="devsite-landing-row-item-description
                                  devsite-landing-row-item-icon-description">
                          <a href="http://dev.susi.ai/">
                          <h3 id="stack-overflow">SUSI.AI Docs</h3>
                          </a>
                          <div className="devsite-landing-row-item-description-content">
                          Access the full Developer Documentation on <a href="http://dev.susi.ai">
                          http://dev.susi.ai</a> to begin setting up and running SUSI.AI on your machine.
                          </div>
                          </div>
                  </div>
              </div>
              </div>
              <div className="section">
                <div className="conversation__description">
                  <div className="support__heading">Ask the community</div>
                </div>
                <div className="devsite-landing-row-group">
                <div className="devsite-landing-row-item devsite-landing-row-item-with-icon devsite-landing-row-item-no-image
                    ">
                    <a href="https://stackoverflow.com/questions/tagged/susi.ai">
                    <div className="devsite-landing-row-item-icon-container">
                    <img alt='gitter' src={stackoverflow} className="devsite-landing-row-item-icon"/></div></a>
                    <div className="devsite-landing-row-item-description
                                  devsite-landing-row-item-icon-description">
                          <a href="https://stackoverflow.com/questions/tagged/susi.ai">
                          <h3 id="stack-overflow">Stack Overflow</h3>
                          </a>
                          <div className="devsite-landing-row-item-description-content">
                          Your resource for all technical questions and answers
                          </div>
                          </div>
                  </div>
                <div className="devsite-landing-row-item
                  devsite-landing-row-item-with-icon devsite-landing-row-item-no-image">
                    <a href="http://groups.google.com/forum/#!forum/susiai">
                    <div className="devsite-landing-row-item-icon-container">
                    <img alt='google groups' src={googleGroups} className="devsite-landing-row-item-icon"/></div></a>
                    <div className="devsite-landing-row-item-description
                                  devsite-landing-row-item-icon-description">
                          <a href="http://groups.google.com/forum/#!forum/susiai">
                          <h3 id="stack-overflow">SUSI.AI Forums</h3>
                          </a>
                          <div className="devsite-landing-row-item-description-content">
                         Discuss about the projects on our Google Groups Channel.
                          </div>
                          </div>
                  </div>
                <div className="devsite-landing-row-item devsite-landing-row-item-with-icon devsite-landing-row-item-no-image
                    ">
                    <a href="https://github.com/fossasia?utf8=%E2%9C%93&q=susi&type=&language=">
                    <div className="devsite-landing-row-item-icon-container">
                    <img alt='github' src={github} className="devsite-landing-row-item-icon"/></div></a>
                    <div className="devsite-landing-row-item-description
                                  devsite-landing-row-item-icon-description">
                          <a href="https://github.com/fossasia?utf8=%E2%9C%93&q=susi&type=&language=">
                          <h3 id="stack-overflow">Github</h3>
                          </a>
                          <div className="devsite-landing-row-item-description-content">
                          Visit our repositories and start contributing.
                          </div>
                          </div>
                  </div>
              </div>
              </div>
              <div className="section">
              <div className='left'>
                  <div className="conversation__description_">
                    <div className="support__heading">Chat With Us</div>
                  </div>
                  <div className="devsite-landing-row-group">
                  <div className="devsite-landing-row-item devsite-landing-row-item-with-icon devsite-landing-row-item-no-image
                    ">
                    <a href="https://gitter.im/fossasia/susi_server">
                    <div className="devsite-landing-row-item-icon-container">
                    <img alt='question' src={question} className="devsite-landing-row-item-icon"/></div></a>
                    <div className="devsite-landing-row-item-description
                                  devsite-landing-row-item-icon-description">
                          <a href="https://gitter.im/fossasia/susi_server">
                          <h3 id="stack-overflow">Get Support</h3>
                          </a>
                          <div className="devsite-landing-row-item-description-content">
                          Got a problem? We are here to help.
                          </div>
                          </div>
                  </div>
                </div>
                </div>
                <div className='right'>
                <div className="conversation__description_">
                    <div className="support__heading">Browse, Create and Edit your own Skills</div>
                  </div>
                  <div className="devsite-landing-row-group">
                  <div className="devsite-landing-row-item devsite-landing-row-item-with-icon devsite-landing-row-item-no-image
                    ">
                    <a href="http://skills.susi.ai/">
                    <div className="devsite-landing-row-item-icon-container">
                    <img alt='code' src={code} className="devsite-landing-row-item-icon"/></div></a>
                    <div className="devsite-landing-row-item-description
                                  devsite-landing-row-item-icon-description">
                          <a href="http://skills.susi.ai/">
                          <h3 id="stack-overflow">Create a SUSI Dream</h3>
                          </a>
                          <div className="devsite-landing-row-item-description-content">
                          You can easily create a SUSI.AI dream in the SUSI Etherpad at
                          <a href='http://dream.susi.ai'>&nbsp;http://dream.susi.ai</a>
                          </div>
                          </div>
                  </div>
                </div>
                </div>
              </div>
              <div className="section non-flex blue-background" style={{
                  paddingBottom: '200px'
                }}>
                <div className="conversation__description footer-desc">
                  <div className="support__heading center blue-text">Get Started Today</div>

                  <RaisedButton label="Sign Up" onTouchTap={this.handleSignUp} style={style} />
                </div>
              </div>
              <div className='footer'>
                <div className='footer-container'>
                <img src={susi} alt='SUSI' className='susi-logo' />
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
