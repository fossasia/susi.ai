import React from 'react';
import PropTypes from 'prop-types';
import _Card from '@material-ui/core/Card';
import _CardContent from '@material-ui/core/CardContent';
import _Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import _Fab from '@material-ui/core/Fab';
import _Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uiActions from '../../../redux/actions/ui';
import getImageSrc from '../../../utils/getImageSrc';
import Cookies from 'universal-cookie';
import {
  fetchChatBots,
  fetchBotImages,
  deleteChatBot,
  readDraft,
  deleteDraft,
} from '../../../apis/index.js';
import styled, { css } from 'styled-components';

const cookies = new Cookies();

const commonHeadingStyle = css`
  color: rgba(0, 0, 0, 0.65);
  padding: 20px 0px 0px 20px;
`;

const Home = styled.div`
  margin: 0px 10px;

  @media (min-width: 769px) {
    padding: 40px 30px 30px;
  }
`;

const Paper = styled(_Paper)`
  width: 100%;
  margin-top: 20px;
  overflow: overlay;
  padding: 15px 0px;

  @media (min-width: 769px) {
    padding: 15px;
  }
`;

const CardContent = styled(_CardContent)`
  color: #ffffff;
  font-size: 16px;
  padding-top: 20px;
`;

const H1 = styled.h1`
  ${commonHeadingStyle}
`;

const H2 = styled.h2`
  ${commonHeadingStyle}
`;

const BotContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 10px;

  @media (max-width: 580px) {
    justify-content: center;
  }
`;

const DeleteBotContainer = styled.div`
  display: none;
`;

const Card = styled(_Card)`
  width: 260px;
  height: 170px;
  margin: 10px;
  overflow: hidden;
  justify-content: center;
  text-align: center;
  display: inline-block;
  background-size: cover;
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid #eaeded;
  padding: 66px 10px 10px;
  position: relative;
  color: #ffffff;
  background-size: cover;
  opacity: 0.9;

  &:after {
    opacity: 0.5;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  &:hover {
    transform: scale(1.02);
  }

  &:hover ${DeleteBotContainer} {
    display: block;
    padding-left: 200px;
    padding-top: 30px;
    width: 100%;
  }
`;

const Fab = styled(_Fab)`
  boxshadow: rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px;
`;

const Add = styled(_Add)`
  height: 40px;
`;

const Text = styled.p`
  font-size: 18px;
  padding-left: 10px;
`;

class BotBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatbots: [],
      drafts: [],
      deleteAlert: null,
    };
    this.getChatbots();
    this.getDrafts();
  }

  getChatbots = () => {
    const { actions, accessToken } = this.props;
    if (accessToken) {
      fetchChatBots()
        .then(payload => {
          this.setState({ chatbots: payload.chatbots });
          this.getBotImages();
        })
        .catch(error => {
          if (error.status !== 404) {
            actions.openSnackBar({
              snackBarMessage:
                "Couldn't get your chatbots. Please reload the page.",
              snackBarDuration: 2000,
            });
          }
        });
    }
  };

  getBotImages = () => {
    const { actions } = this.props;
    let { chatbots } = this.state;
    if (chatbots) {
      chatbots.forEach((bot, index) => {
        let name = bot.name;
        let language = bot.language;
        let group = bot.group;
        fetchBotImages({ name, group, language })
          .then(payload => {
            let imageMatch = payload.text.match(/^::image\s(.*)$/m);
            if (imageMatch) {
              bot.image = imageMatch[1];
            }
            chatbots[index] = bot;
            this.setState({ chatbots });
          })
          .catch(error => {
            if (error.status !== 404) {
              actions.openSnackBar({
                snackBarMessage:
                  "Couldn't get your chatbot image. Please reload the page.",
                snackBarDuration: 2000,
              });
            }
          });
      });
    }
  };

  showChatbots = () => {
    let chatbots = [];
    let bots = this.state.chatbots;
    if (bots) {
      bots.forEach(bot => {
        let imageUrl;
        let { protocol, host } = window.location;
        if (bot.image === 'images/<image_name>') {
          imageUrl = `${protocol}//${host}/customAvatars/1.png`;
        } else if (bot.image === 'images/<image_name_event>') {
          imageUrl = `${protocol}//${host}/botTemplates/event-registration.jpg`;
        } else if (bot.image === 'images/<image_name_job>') {
          imageUrl = `${protocol}//${host}/botTemplates/job-application.jpg`;
        } else if (bot.image === 'images/<image_name_contact>') {
          imageUrl = `${protocol}//${host}/botTemplates/contact-us.png`;
        } else {
          imageUrl = bot.image
            ? getImageSrc({
                relativePath: `access_token=${cookies.get(
                  'loggedIn',
                )}&language=${bot.language}&group=${bot.group.replace(
                  / /g,
                  '%20',
                )}&image=${bot.image.replace(/ /g, '%20')}`,
              })
            : null;
        }
        chatbots.push(
          <Card
            key={bot.name}
            style={{
              backgroundImage: 'url(' + imageUrl + ')',
              opacity: '0.5',
            }}
          >
            <Link
              to={
                '/botWizard?name=' +
                bot.name +
                '&language=' +
                bot.language +
                '&group=' +
                bot.group
              }
            >
              <Button variant="contained" color="primary">
                {bot.name}
              </Button>
            </Link>
            <DeleteBotContainer>
              <Delete
                onClick={() =>
                  this.handleDeleteModal('bot', [
                    bot.name,
                    bot.language,
                    bot.group,
                  ])
                }
              />
            </DeleteBotContainer>
          </Card>,
        );
      });
    }
    return chatbots;
  };

  deleteBot = (name, language, group) => {
    const { actions } = this.props;
    deleteChatBot({ group, language, skill: name })
      .then(payload => {
        actions
          .openSnackBar({
            snackBarMessage: `Successfully ${payload.message}`,
            snackBarDuration: 2000,
          })
          .then(() => {
            this.props.actions.closeModal();
            this.getChatbots();
          });
      })
      .catch(error => {
        this.setState({
          deleteAlert: null,
        });
        actions.openSnackBar({
          snackBarMessage: 'Unable to delete your chatbot. Please try again.',
          snackBarDuration: 2000,
        });
      });
  };

  getDrafts = () => {
    const { actions } = this.props;
    readDraft()
      .then(payload => {
        const { drafts } = payload;
        this.showDrafts(drafts);
      })
      .catch(error => {
        actions.openSnackBar({
          snackBarMessage: "Couldn't get your drafts. Please reload the page.",
          snackBarDuration: 2000,
        });
      });
  };

  showDrafts = drafts => {
    if (drafts) {
      let draftsOfBots = [];
      for (let draft in drafts) {
        let imageUrl;
        let { protocol, host } = window.location;
        if (drafts[draft].image === 'images/<image_name>') {
          imageUrl = `${protocol}//${host}/customAvatars/1.png`;
        } else if (drafts[draft].image === 'images/<image_name_event>') {
          imageUrl = `${protocol}//${host}/botTemplates/event-registration.jpg`;
        } else if (drafts[draft].image === 'images/<image_name_job>') {
          imageUrl = `${protocol}//${host}/botTemplates/job-application.jpg`;
        } else if (drafts[draft].image === 'images/<image_name_contact>') {
          imageUrl = `${protocol}//${host}/botTemplates/contact-us.png`;
        } else {
          imageUrl = drafts[draft].image
            ? getImageSrc({
                relativePath: `access_token=${cookies.get(
                  'loggedIn',
                )}&language=${drafts[draft].language}&group=${drafts[
                  draft
                ].group.replace(/ /g, '%20')}&image=${drafts[
                  draft
                ].image.replace(/ /g, '%20')}`,
              })
            : null;
        }
        draftsOfBots.push(
          <Card
            key={draft}
            style={{
              backgroundImage: 'url(' + imageUrl + ')',
            }}
          >
            <Link to={'/botWizard?draftID=' + draft}>
              <Button variant="contained" color="primary">
                {drafts[draft].name === '' ? draft : drafts[draft].name}
              </Button>
            </Link>
            <DeleteBotContainer>
              <Delete
                color="rgb(255, 255, 255)"
                onClick={() => this.handleDeleteModal('draft', [draft])}
              />
            </DeleteBotContainer>
          </Card>,
        );
      }
      this.setState({ drafts: draftsOfBots });
    }
  };

  deleteDrafts = id => {
    const { actions } = this.props;
    deleteDraft({ id })
      .then(payload => {
        actions
          .openSnackBar({
            snackBarMessage: 'Draft successfully deleted.',
            snackBarDuration: 2000,
          })
          .then(() => {
            this.props.actions.closeModal();
            this.getDrafts();
          });
      })
      .catch(error => {
        actions.openSnackBar({
          snackBarMessage: 'Unable to delete your draft. Please try again.',
          snackBarDuration: 2000,
        });
        this.setState({
          deleteAlert: null,
        });
      });
  };

  handleDeleteModal = (type, params) => {
    this.setState({ deleteAlert: { type, params } });
    this.props.actions.openModal({
      modalType: 'deleteBot',
      type: type,
      handleConfirm: this.handleDelete,
      handleClose: this.props.actions.closeModal,
    });
  };

  handleDelete = () => {
    const { type, params } = this.state.deleteAlert;
    if (type === 'bot') {
      this.deleteBot(...params);
    } else if (type === 'draft') {
      this.deleteDrafts(...params);
    }
  };

  render() {
    const { drafts } = this.state;

    return (
      <div>
        <Home>
          <Paper>
            <H1>My bots</H1>
            <br />
            <H2>Saved Bots</H2>
            <BotContainer>
              <Link to="/botWizard">
                <Card
                  style={{
                    backgroundImage: 'url(/botTemplates/chat-bot.jpg)',
                  }}
                >
                  <Fab color="primary" size="small">
                    <Add />
                  </Fab>
                  <CardContent>Create a new bot</CardContent>
                </Card>
              </Link>
              {this.showChatbots()}
            </BotContainer>
            <H2>Drafts</H2>
            <BotContainer>
              {drafts.length > 0 ? drafts : <Text>No drafts to display.</Text>}
            </BotContainer>
          </Paper>
          <Paper>
            <H1>Pick a template</H1>
            <BotContainer>
              {this.props.templates.map(template => {
                return (
                  <Link
                    key={template.id}
                    to={'/botWizard?template=' + template.id}
                  >
                    <Card
                      style={{
                        backgroundImage: 'url(' + template.image + ')',
                      }}
                    >
                      <Button variant="contained" color="primary">
                        {template.name}
                      </Button>
                    </Card>
                  </Link>
                );
              })}
            </BotContainer>
          </Paper>
        </Home>
      </div>
    );
  }
}

BotBuilder.propTypes = {
  templates: PropTypes.array,
  actions: PropTypes.object,
  accessToken: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    accessToken: store.app.accessToken,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BotBuilder);
