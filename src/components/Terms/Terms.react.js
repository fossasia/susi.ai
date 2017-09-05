import './Terms.css';
import $ from 'jquery';
import Footer from '../Footer/Footer.react';
import PropTypes from 'prop-types';
import StaticAppBar from '../StaticAppBar/StaticAppBar.react';
import React, { Component } from 'react';

class Terms extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      showOptions: false,
      anchorEl: null,
      login: false,
      signup: false,
      video: false,
      openDrawer: false,
    };
  }

  componentDidMount() {
    //  Scrolling to top of page when component loads
    $('html, body').animate({ scrollTop: 0 }, 'fast');
    // Adding title tag to page
    document.title = 'Terms and Conditions - SUSI.AI, Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots';
  }


  showOptions = (event) => {
    event.preventDefault();
    this.setState({
      showOptions: true,
      anchorEl: event.currentTarget
    })
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  render() {
		document.body.style.setProperty('background-image', 'none');
    return (
      <div>
        <StaticAppBar {...this.props}
          location={this.props.location} />
          <div className='head_section'>
          <div className='container'>
            <div className="heading">
              <h1>Terms of Service</h1>
              <p>Thanks for using SUSI.AI.</p>
            </div>
          </div>
        </div>
        <div className='section'>
          <div className="section-container" >
            <div className="terms-list">
              <br /><br />
              <h2>Welcome to SUSI!</h2>
              <p>Thanks for using our products and services (“Services”).
            The Services are provided by SUSI Inc. (“SUSI”),
            located at 93 Mau Than, Can Tho City, Viet Nam.
                  By using our Services, you are agreeing to these terms.
           Please read them carefully.
           </p>
              <h2>Using our Services</h2>
              <p>You must follow any policies made available to you within the Services.
        <br /><br />
                Don’t misuse our Services. For example, don’t interfere with our
        Services or try to access them using a method other than the
        interface and the instructions that we provide. You may use
        our Services only as permitted by law, including applicable
        export and re-export control laws and regulations. We may
        suspend or stop providing our Services to you if you do not
        comply with our terms or policies or if we are investigating
        suspected misconduct.
        <br /><br />
                Using our Services does not give you ownership of any intellectual
        property rights in our Services or the content you access.
        You may not use content from our Services unless you obtain
        permission from its owner or are otherwise permitted by law.
        These terms do not grant
        you the right to use any branding or logos used in our Services.
        Don’t remove, obscure, or alter any legal notices displayed in or
        along with our Services.
        <br /><br />
                Our Services display some content that is not SUSI’s.
                  This content is the sole responsibility of the entity that
                  makes it available. We may review content to determine whether
                  it is illegal or violates our policies, and we may remove or
                  refuse to display content that we reasonably believe violates
                   our policies or the law. But that does not necessarily mean
                    that we review content, so please don’t assume that we do.
        <br /><br />
                In connection with your use of the Services, we may send
                   you service announcements, administrative messages,
                   and other information. You may opt out of some of those communications.
        <br /><br />
                Some of our Services are available on mobile devices.
                  Do not use such Services in a way that distracts you
                  and prevents you from obeying traffic or safety laws.
        <br /><br />
              </p>
              <h2>Your SUSI Account</h2>
              <p>
                You may need a SUSI Account in order to use some of our Services.
                  You may create your own SUSI Account, or your SUSI Account may be
                  assigned to you by an administrator, such as your employer or
                  educational institution. If you are using a SUSI Account assigned
                  to you by an administrator, different or additional terms
                  may apply and your administrator may be able to access or
                  disable your account.
        <br /><br />
                To protect your SUSI Account, keep your password confidential.
                  You are responsible for the activity that happens on or through your
                   SUSI Account. Try not to reuse your SUSI Account password on
                    third-party applications. If you learn of any unauthorized
                     use of your password or SUSI Account, change your password
                      and take measures to secure your account.
        <br /><br />
              </p>
              <h2>Privacy and Copyright Protection</h2>
              <p>SUSI’s privacy policies ensures that your personal data is
                   safe and protected. By using our Services, you agree that
                    SUSI can use such data in accordance with our privacy policies.
         <br /><br />
                We respond to notices of alleged copyright infringement and
                   terminate accounts of repeat infringers. If you think somebody
                    is violating your copyrights and want to notify us,
                     you can find information about submitting notices and SUSI’s
                      policy about responding to notices on our website.
        <br /><br />
              </p>
              <h2>Your Content in our Services</h2>
              <p>Some of our Services allow you to upload, submit, store, send
                   or receive content. You retain ownership of any intellectual
                    property rights that you hold in that content. In short,
                     what belongs to you stays yours.
        <br /><br />
                When you upload, submit, store, send or receive content to
                   or through our Services, you give SUSI (and those we work with)
                    a worldwide license to use, host, store, reproduce, modify,
                     create derivative works (such as those resulting from
                     translations, adaptations or other changes we make so
                      that your content works better with our Services),
                       communicate, publish, publicly perform, publicly display
                        and distribute such content. The rights you grant in this
                         license are for the limited purpose of operating, promoting,
                          and improving our Services, and to develop new ones.
                           This license continues even if you stop using our Services
                            (for example, for a business listing you have added to
                             SUSI Maps). Some Services may offer you ways to access
                              and remove content that has been provided to that Service.
                               Also, in some of our Services, there are terms or settings
                                that narrow the scope of our use of the content submitted
                    in those Services. Make sure you have the necessary rights
                                  to grant this license for any content that you submit to
                                   our Services.
        <br /><br />
                If you have a SUSI Account, we may display your Profile name,
                 Profile photo, and actions you take on SUSI or on third-party
                  applications connected to your SUSI Account in our Services,
                   including displaying in ads and other commercial contexts.
                    We will respect the choices you make to limit sharing or
                     visibility settings in your SUSI Account.
        <br /><br />
              </p>
              <h2>About Software in our Services</h2>
              <p>When a Service requires or includes downloadable software,
                 this software may update automatically on your device once
                 a new version or feature is available. Some Services may
                  let you adjust your automatic update settings.
        <br /><br />
                SUSI gives you a personal, worldwide, royalty-free,
                 non-assignable and non-exclusive license to use the
                  software provided to you by SUSI as part of the Services.
                   This license is for the sole purpose of enabling you to
                    use and enjoy the benefit of the Services as provided by
                     SUSI, in the manner permitted by these terms.
        <br /><br />
                Most of our services are offered through Free
                 Software and/or Open Source Software. You may
                  copy, modify, distribute, sell, or lease these
                   applications and share the source code of that
                    software as stated in the License agreement provided
                     with the Software.
        <br /><br />
              </p>
              <h2>Modifying and Terminating our Services</h2>
              <p>We are constantly changing and improving our Services.
                 We may add or remove functionalities or features,
                  and we may suspend or stop a Service altogether.
        <br /><br />
                You can stop using our Services at any time.
                 SUSI may also stop providing Services to you,
                  or add or create new limits to our Services at any time.
        <br /><br />
                We believe that you own your data and preserving
                 your access to such data is important. If we
                  discontinue a Service, where reasonably possible,
                   we will give you reasonable advance notice and a
                    chance to get information out of that Service.
        <br /><br />
              </p>
              <h2>Our Warranties and Disclaimers</h2>
              <p>We provide our Services using a reasonable level
                 of skill and care and we hope that you will enjoy using them.
                  But there are certain things that we don’t promise about our Services.
        <br /><br />
                Other than as expressly set out in these terms or
                 additional terms, neither SUSI nor its suppliers or
                  distributors make any specific promises about the Services.
                   For example, we don’t make any commitments about the content
                    within the Services, the specific functions of the Services,
                     or their reliability, availability, or ability to meet your
                      needs. We provide the Services “as is”.
         <br /><br />
                Some jurisdictions provide for certain warranties,
                 like the implied warranty of merchantability,
                  fitness for a particular purpose and non-infringement.
                   To the extent permitted by law, we exclude all warranties.
        <br /><br />
              </p>
              <h2>Liability for our Services</h2>
              <p>When permitted by law, SUSI, and SUSI’s
                 suppliers and distributors, will not be responsible
                  for lost profits, revenues, or data, financial losses
                   or indirect, special, consequential, exemplary, or punitive damages.
        <br /><br />
                To the extent permitted by law, the total liability of SUSI,
                 and its suppliers and distributors, for any claims under these terms,
                  including for any implied warranties, is limited to the amount
                   you paid us to use the Services (or, if we choose,
                    to supplying you the Services again).
        <br /><br />
                In all cases, SUSI, and its suppliers and distributors,
                 will not be liable for any loss or damage that is not
                  reasonably foreseeable.
        <br /><br />
                We recognize that in some countries, you might have legal
                 rights as a consumer. If you are using the Services for
                  a personal purpose, then nothing in these terms or any additional
                   terms limits any consumer legal rights which may not be waived by
                    contract.
        <br /><br />
              </p>
              <h2>Business uses of our Services</h2>
              <p>If you are using our Services on behalf of a business,
                 that business accepts these terms. It will hold harmless
                  and indemnify SUSI and its affiliates, officers, agents,
                   and employees from any claim, suit or action arising from
                    or related to the use of the Services or violation of these terms,
                     including any liability or expense arising from claims, losses
                     , damages, suits, judgments, litigation costs and attorneys’ fees.
        <br /><br /></p>
              <h2>About these Terms</h2>
              <p>We may modify these terms or any additional terms that
                 apply to a Service to,
           for example, reflect changes to the law or changes to our Services.
           You should look at the terms regularly.
           We’ll post notice of modifications to these terms on this page.
           We’ll post notice of modified additional terms in the applicable Service.
           Changes will not apply retroactively and will become effective
            no sooner than fourteen days after they are posted.
           However,changes addressing new functions for a Service or changes made
           for legal reasons will be effective immediately.
           If you do not agree to the modified terms for a Service,
           you should discontinue your use of that Service.
        <br /><br />
                If there is a conflict between these terms and the additional terms,
         the additional terms will control for that conflict.
        <br />
                These terms control the relationship between SUSI and you.
                 They do not create any third party beneficiary rights.
        <br /><br />
                If you do not comply with these terms,
                 and we don’t take action right away,
                 this doesn’t mean that we are giving up any rights that
                  we may have (such as taking action in the future).
        <br /><br />
                If it turns out that a particular term is not enforceable,
                 this will not affect any other terms.<br /><br />

                You agree that the laws of Can Tho, Viet Nam will
                 apply to any disputes arising out of or relating to
                  these terms or the Services. All claims arising out
                   of or relating to these terms or the services will be
                    litigated exclusively in the courts of Can Tho City,
                     Viet Nam, and you and SUSI consent to personal jurisdiction
                      in those courts.
        <br /><br />
                For information about how to contact SUSI, please visit our contact page.
        <br /><br />
              </p>
            </div>

          </div>
        </div>

        <Footer />


      </div>
    );
  };
}

Terms.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object
}

export default Terms;
