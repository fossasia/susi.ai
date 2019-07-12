import React from 'react';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uiActions from '../../../../redux/actions/ui';
import styled, { css } from 'styled-components';
import SLIDESHOW from './constants';
import Button from '@material-ui/core/Button';
import { fetchSkillSlideshow } from '../../../../apis/index';
import getImageSrc from '../../../../utils/getImageSrc';

const SliderImage = styled.img`
  width: 900px;
  height: 300px;
`;

const commonActionStyle = css`
  cursor: pointer;
  color: #49a9ee;
`;

const ActionSpan = styled.span`
  ${commonActionStyle};
  @media (max-width: 1340px) {
    margin-right: 0.2rem;
  }
`;

const ActionSeparator = styled.span`
  margin-left: 0.313rem;
  margin-right: 0.313rem;
  @media (max-width: 1340px) {
    display: none;
  }
`;

class Slideshow extends React.Component {
  state = {
    loading: true,
    slideshowData: [],
  };

  getSkillSlideshow = () => {
    fetchSkillSlideshow()
      .then(payload => {
        const { slideshow } = payload;
        let slideshowData = [];
        for (const redirectLink in slideshow) {
          let slideshowObj = { redirectLink };
          let obj = slideshow[redirectLink];
          slideshowObj = { ...slideshowObj, ...obj };
          slideshowData.push(slideshowObj);
        }
        this.setState({ slideshowData, loading: false });
      })
      .catch(error => {
        console.log('Error', error);
        this.setState({ loading: false });
      });
  };

  componentDidMount() {
    this.getSkillSlideshow();
  }

  handleDelete = (redirectLink, imageName) => {
    this.props.actions.openModal({
      operation: 'Delete',
      modalType: 'skillSlideshow',
      getSkillSlideshow: this.getSkillSlideshow,
      handleClose: this.props.actions.closeModal,
      redirectLink,
      imageName,
    });
  };

  handleUpdate = (redirectLink, info, imageName) => {
    this.props.actions.openModal({
      operation: 'Edit',
      modalType: 'skillSlideshow',
      getSkillSlideshow: this.getSkillSlideshow,
      handleClose: this.props.actions.closeModal,
      redirectLink,
      info,
      imageName,
    });
  };

  handleCreate = () => {
    this.props.actions.openModal({
      operation: 'Create',
      modalType: 'skillSlideshow',
      getSkillSlideshow: this.getSkillSlideshow,
      handleClose: this.props.actions.closeModal,
      handleUploadImage: this.uploadImage,
    });
  };

  render() {
    const { loading, slideshowData } = this.state;
    return (
      <React.Fragment>
        <MaterialTable
          isLoading={loading}
          options={{
            actionsColumnIndex: -1,
            pageSize: 5,
          }}
          columns={SLIDESHOW}
          data={slideshowData}
          title=""
          style={{
            padding: '1rem',
          }}
          actions={[
            {
              onEdit: (event, rowData) => {
                this.handleUpdate(
                  rowData.redirectLink,
                  rowData.info,
                  rowData.image_name,
                );
              },
              onDelete: (event, rowData) => {
                this.handleDelete(rowData.redirectLink, rowData.image_name);
              },
            },
          ]}
          components={{
            Action: props => (
              <React.Fragment>
                <ActionSpan
                  onClick={event => props.action.onEdit(event, props.data)}
                >
                  Edit
                </ActionSpan>
                <ActionSeparator> | </ActionSeparator>
                <ActionSpan
                  onClick={event => props.action.onDelete(event, props.data)}
                >
                  Delete
                </ActionSpan>
              </React.Fragment>
            ),
          }}
          detailPanel={rowData => (
            <SliderImage
              src={getImageSrc({ relativePath: `image=${rowData.image_name}` })}
            />
          )}
          onRowClick={(event, rowData, togglePanel) => togglePanel()}
        ></MaterialTable>
        <Button
          style={{ marginTop: '1rem' }}
          variant="contained"
          color="primary"
          onClick={this.handleCreate}
        >
          Add Config Key
        </Button>
      </React.Fragment>
    );
  }
}

Slideshow.propTypes = {
  actions: PropTypes.object,
};

function mapStateToDispatch(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  null,
  mapStateToDispatch,
)(Slideshow);
