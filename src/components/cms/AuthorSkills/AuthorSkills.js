/* eslint-disable max-len */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import skillActions from '../../../redux/actions/skill';
import uiActions from '../../../redux/actions/ui';
import Img from 'react-image';
import ISO6391 from 'iso-639-1';
import CircleImage from '../../shared/CircleImage';
import { urls } from '../../../utils';
import githubLogo from '../../../images/github-logo.png';
import CloseButton from '../../shared/CloseButton';
import styled from 'styled-components';
import CircularLoader from '../../shared/CircularLoader';

const UnderlineLink = styled.a`
  text-decoration: none;
  display: inline-block;
  position: relative;
  font-family: 'Dosis', sans-serif;
  :after {
    content: '';
    position: absolute;
    left: 0;
    display: inline-block;
    height: 1em;
    width: 100%;
    border-bottom: 1px solid;
    margin-top: 10px;
    opacity: 0;
    -webkit-transition: opacity 0.35s, -webkit-transform 0.35s;
    transition: opacity 0.35s, transform 0.35s;
    -webkit-transform: scale(0, 1);
    transform: scale(0, 1);
  }

  :hover:after {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
`;

const GithubAvatarImage = styled.img`
  height: 3rem;
  width: 3rem;
  border-radius: 6rem;
  margin-left: 1rem;
`;

const Image = styled(Img)`
  margin-right: 0.625rem;
  position: relative;
  height: 2.5rem;
  width: 2.5rem;
  vertical-align: middle;
  border: 0;
`;

class AuthorSkills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const { author, actions } = this.props;
    actions
      .getAuthorSkills({ author })
      .then(() => this.setState({ loading: false }))
      .catch(error => console.log('Failed to Get Author Skills'));
  }

  loadSkillCards = () => {
    const { authorSkills } = this.props;
    const skills = authorSkills.map((skill, index) => {
      const { category, language } = skill;
      let { name } = skill;
      const image = `${
        urls.API_URL
      }/cms/getImage.png?model=general&language=${language}&group=${category}&image=${'/images/' +
        name}`;
      const pngImage = `${image}.png`;
      const jpgImage = `${image}.jpg`;
      const categoryURL = `${window.location.protocol}//${window.location.host}/skills/category/${category}/`;
      const skillURL = `${window.location.protocol}//${window.location.host}/skills/${category}/${name}/${language}`;

      name = name.charAt(0).toUpperCase() + name.slice(1);
      if (name.split('_').length > 1) {
        name = name.split('_').join(' ');
      }
      return (
        <TableRow key={index}>
          <TableCell>
            <a href={skillURL}>
              <Image
                src={[pngImage, jpgImage]}
                unloader={<CircleImage name={name} size="40" />}
              />
            </a>
          </TableCell>
          <TableCell>
            <UnderlineLink href={skillURL}>{name}</UnderlineLink>
          </TableCell>
          <TableCell>
            <UnderlineLink href={categoryURL}>{category}</UnderlineLink>
          </TableCell>
          <TableCell>{ISO6391.getNativeName(language)}</TableCell>
        </TableRow>
      );
    });
    return skills;
  };

  render() {
    const { author, authorUrl, actions } = this.props;
    const { loading } = this.state;
    let githubAvatarSrc = '';

    if (authorUrl && authorUrl !== '<author_url>') {
      githubAvatarSrc = `${urls.GITHUB_AVATAR_URL}/${
        authorUrl.split('/')[3]
      }?size=50`;
    } else {
      githubAvatarSrc = githubLogo;
    }
    let renderElement = null;
    if (loading === true) {
      renderElement = <CircularLoader size={44} height={5} />;
    } else {
      renderElement = (
        <div>
          <Table style={{ marginTop: 10 }}>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Language</TableCell>
              </TableRow>
            </TableHead>
            <TableBody displayRowCheckbox={false}>
              {this.loadSkillCards()}
            </TableBody>
          </Table>
        </div>
      );
    }

    return (
      <React.Fragment>
        <DialogTitle>
          <CloseButton onClick={actions.closeModal} />
          Skills by {author}{' '}
          <a href={authorUrl && authorUrl !== '<author_url>' ? authorUrl : '/'}>
            <GithubAvatarImage alt={'GitHub'} src={githubAvatarSrc} />
          </a>
        </DialogTitle>
        <DialogContent>{renderElement}</DialogContent>
      </React.Fragment>
    );
  }
}

AuthorSkills.propTypes = {
  open: PropTypes.bool,
  requestClose: PropTypes.func,
  author: PropTypes.string,
  authorUrl: PropTypes.string,
  loading: PropTypes.bool,
  authorSkills: PropTypes.array,
  actions: PropTypes.object,
};

function mapStateToProps(store) {
  return {
    authorSkills: store.skill.authorSkills,
    authorUrl: store.skill.metaData.authorUrl,
    author: store.skill.metaData.author,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...skillActions, ...uiActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthorSkills);
