import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uiActions from '../../../../redux/actions/ui';
const api = window.location.protocol + '//' + window.location.host;
class Deploy extends Component {
  render() {
    const { category, language, name, actions, uuid } = this.props;
    const part =
      'data-skill=&quot;' +
      name +
      '&quot; src=&quot;' +
      api +
      '/susi-chatbot.js&quot;';
    const code =
      '&lt;script type=&quot;text/javascript&quot;' +
      'id=&quot;susi-bot-script&quot; data-userid=&quot;' +
      uuid +
      '&quot; data-group=&quot;' +
      category +
      '&quot; data-language=&quot;' +
      language +
      '&quot;' +
      part +
      '&gt;&lt;/script&gt;';

    return (
      <div className="menu-page">
        <h1 style={{ lineHeight: '50px' }}>
          4. Deploy your bot to your own website
        </h1>
        <div style={{ marginLeft: 'auto', marginRight: '0px' }}>
          <div style={{ padding: '30px 10px 0 10px' }}>
            <ol className="deploy-steps">
              <li>
                Add the code below to every page you want the Messenger to
                appear. Copy and paste it before the{' '}
                <span className="html-tag">&lt;&#47;body&gt;</span> tag on each
                page.
                <br />
                <br />
                <div className="code-wrap show">
                  <div className="code-box">
                    <code dangerouslySetInnerHTML={{ __html: code }} />
                    <CopyToClipboard
                      text={
                        "<script type='text/javascript' id='susi-bot-script' data-userid='" +
                        uuid +
                        "' data-group='" +
                        category +
                        "' data-language='" +
                        language +
                        "' data-skill='" +
                        name +
                        "' src='" +
                        api +
                        "/susi-chatbot.js'></script>"
                      }
                      onCopy={() =>
                        actions.openSnackBar({
                          snackBarMessage: 'Copied to clipboard!',
                          snackBarDuration: 2000,
                        })
                      }
                    >
                      <span className="copy-button">copy</span>
                    </CopyToClipboard>
                  </div>
                </div>
              </li>
              <li>
                Open your web app or website and look for the Messenger in the
                bottom right corner.
              </li>
              <li>Start chatting with your SUSI bot.</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }
}

Deploy.propTypes = {
  category: PropTypes.string,
  language: PropTypes.string,
  actions: PropTypes.object,
  uuid: PropTypes.string,
  name: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

function mapStateToProps(store) {
  return {
    uuid: store.app.uuid,
    name: store.create.skill.name,
    language: store.create.skill.language,
    category: store.create.skill.category,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Deploy);
