import React, { Component } from 'react';
import susi from '../../images/susi-logo.svg';
import './Footer.css';

class Footer extends Component{
  constructor(props){
    super(props);
    this.state={
      video:false,
    }
  }
  render() {

    return (
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
    );
  }
}

export default Footer;
