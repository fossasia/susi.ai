import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uiActions from '../../../../redux/actions/ui';
import styled from 'styled-components';

const Home = styled.div`
  margin-top: 10px;
`;

const H1 = styled.h1`
  line-height: 50px;

  @media (max-width: 480px) {
    line-height: 2.5rem;
  }
`;

const Container = styled.div`
  margin-left: auto;
  margin-right: 0px;
`;

const OrderedList = styled.ol`
  list-style-type: none;

  @media (max-width: 480px) {
    padding: 0px;
  }
`;

const ListItem = styled.li`
  font-size: 16px;
  margin-bottom: 20px;
  margin-left: 20px;
  counter-increment: step-counter;
  position: relative;

  &:before {
    content: counter(step-counter);
    background-color: #ebebeb;
    color: #888;
    padding-top: 1px;
    font-size: 13px;
    border-radius: 50%;
    position: absolute;
    font-weight: bold;
    left: -28px;
    top: 2px;
    width: 22px;
    height: 22px;
    text-align: center;
    vertical-align: middle;
  }
`;

const Span = styled.span`
  font-style: italic;
  background-color: #eee;
  display: inline-block;
  padding: 0 3px;
`;

const CopyButton = styled.span`
  position: absolute;
  opacity: 0;
  transition: ease-in 0.1s;
  top: 5px;
  right: 7px;
  background-color: #4285f5;
  font-size: 15px;
  color: #fff;
  padding: 4px 9px;
  cursor: pointer;
  border-radius: 0.4em;
  box-shadow: -1px 3px 9px 0px #2222226e;

  &:hover {
    background-color: #729ce2;
  }
`;

const CodeWrap = styled.div`
  transition: all 0.3s ease-in;
  display: block;
`;

const CodeBox = styled.div`
  font-size: 13px;
  font-weight: normal;
  position: relative;
  background: #d3d3d3;
  border-radius: 0.4em;
  display: inline-block;
  padding: 10px 20px;
  box-shadow: 0 3px 2px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 5px;

  &:hover ${CopyButton} {
    opacity: 1;
  }

  @media (max-width: 425px) {
    padding: 10px;
    font-size: 9px;
  }
`;

const Section = styled.div`
  padding: 30px 10px 0 10px;
`;

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
      <Home>
        <H1>4. Deploy your bot to your own website</H1>
        <Container>
          <Section>
            <OrderedList>
              <ListItem>
                Add the code below to every page you want the Messenger to
                appear. Copy and paste it before the{' '}
                <Span>&lt;&#47;body&gt;</Span> tag on each page.
                <br />
                <br />
                <CodeWrap>
                  <CodeBox>
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
                      <CopyButton>copy</CopyButton>
                    </CopyToClipboard>
                  </CodeBox>
                </CodeWrap>
              </ListItem>
              <ListItem>
                Open your web app or website and look for the Messenger in the
                bottom right corner.
              </ListItem>
              <ListItem>Start chatting with your SUSI bot.</ListItem>
            </OrderedList>
          </Section>
        </Container>
      </Home>
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
