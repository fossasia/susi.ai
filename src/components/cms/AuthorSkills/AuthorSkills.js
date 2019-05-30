import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import CircularProgress from 'material-ui/CircularProgress';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import skillActions from '../../../redux/actions/skill';
import Img from 'react-image';
import ISO6391 from 'iso-639-1';
import CircleImage from '../../CircleImage/CircleImage';
import { urls } from '../../../utils';
import './AuthorSkills.css';
import githubLogo from '../../../images/github-logo.png';
import Close from 'material-ui/svg-icons/navigation/close';

const styles = {
  imageStyle: {
    marginRight: 10,
    position: 'relative',
    height: '40px',
    width: '40px',
    verticalAlign: 'middle',
    border: 0,
  },
  githubAvatarStyle: {
    height: 50,
    width: 50,
    verticalAlign: 'middle',
    borderRadius: 100,
    marginLeft: 16,
  },
  closingStyle: {
    position: 'absolute',
    zIndex: 1200,
    fill: '#444',
    width: '26px',
    height: '26px',
    right: '10px',
    top: '10px',
    cursor: 'pointer',
  },
  headingStyle: {
    fill: '#000',
    width: '100%',
    textTransform: 'capitalize',
  },
};

const { imageStyle, githubAvatarStyle, closingStyle, headingStyle } = styles;

class AuthorSkills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const { author, actions } = this.props;
    actions.getAuthorSkills({ author });
  }

  componentDidUpdate(prevProps) {
    const { author, actions } = this.props;
    if (author !== prevProps.author) {
      actions
        .getAuthorSkills({ author })
        .then(() => this.setState({ loading: false }))
        .catch(error => console.log('Failed to Get Author Skills'));
    }
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

      const skillURL = `${window.location.protocol}//${
        window.location.host
      }/skills/${category}/${name}/${language}`;
      name = name.charAt(0).toUpperCase() + name.slice(1);
      if (name.split('_').length > 1) {
        name = name.split('_').join(' ');
      }
      return (
        <TableRow key={index}>
          <TableRowColumn>
            <a href={skillURL}>
              <Img
                style={imageStyle}
                src={[pngImage, jpgImage]}
                unloader={<CircleImage name={name} size="40" />}
              />
            </a>
          </TableRowColumn>
          <TableRowColumn>
            <div>
              <a href={skillURL} className="effect-underline">
                {name}
              </a>
            </div>
          </TableRowColumn>
          <TableRowColumn>{category}</TableRowColumn>
          <TableRowColumn>{ISO6391.getNativeName(language)}</TableRowColumn>
        </TableRow>
      );
    });
    return skills;
  };

  render() {
    const { author, authorUrl, open, requestClose } = this.props;
    const { loading } = this.state;
    let githubAvatarSrc = '';

    if (authorUrl) {
      githubAvatarSrc = `${urls.GITHUB_AVATAR_URL}/${
        authorUrl.split('/')[3]
      }?size=50`;
    } else {
      githubAvatarSrc = githubLogo;
    }
    let renderElement = null;
    if (loading === true) {
      renderElement = (
        <div style={{ textAlign: 'center' }}>
          <CircularProgress size={44} />
        </div>
      );
    } else {
      renderElement = (
        <div>
          <Table
            selectable={false}
            multiSelectable={false}
            style={{ marginTop: 10 }}
          >
            <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}
              enableSelectAll={false}
            >
              <TableRow>
                <TableHeaderColumn>Image</TableHeaderColumn>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Category</TableHeaderColumn>
                <TableHeaderColumn>Language</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {this.loadSkillCards()}
            </TableBody>
          </Table>
        </div>
      );
    }

    return (
      <div>
        <Dialog
          modal={false}
          open={open}
          autoScrollBodyContent={true}
          contentStyle={{ width: '50%', minWidth: '300px' }}
          onRequestClose={requestClose}
        >
          <div style={headingStyle}>
            <h3>
              Skills by {author}{' '}
              <a href={authorUrl}>
                <img
                  alt={'GitHub'}
                  style={githubAvatarStyle}
                  src={githubAvatarSrc}
                />
              </a>
            </h3>
          </div>
          {renderElement}
          <Close style={closingStyle} onClick={requestClose} />
        </Dialog>
      </div>
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
    actions: bindActionCreators(skillActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthorSkills);
