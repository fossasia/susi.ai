import React, { Component } from 'react';
import { Table, Button, Form } from 'antd';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uiActions from '../../../../../redux/actions/ui';
import createActions from '../../../../../redux/actions/create';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';

const EditableContext = React.createElement();
// eslint-disable-next-line
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

const styles = {
  nameField: {
    width: '272px',
    marginBottom: '16px',
  },
};

class UIView extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Website',
        dataIndex: 'name',
        width: '30%',
        editable: true,
      },
      {
        title: 'Date Added',
        dataIndex: 'date',
        width: '55%',
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div onClick={() => this.handleDelete(record.key)}>Delete</div>
          );
        },
      },
    ];
    this.state = {
      dataSource: [],
      websiteName: '',
      count: 0,
      myDevices: false, // use chatbot in your devices
      publicDevices: false, // allow chatbot to be used in other people's devices
      includeSusiSkills: true,
      limitSites: false,
    };
    this.dataSource = [];
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState(
      { dataSource: dataSource.filter(item => item.key !== key) },
      () => this.generateCode(),
    );
  };

  handleAdd = () => {
    const { actions } = this.props;
    const { count, dataSource, websiteName } = this.state;
    let date = new Date();
    if (websiteName !== '' && this.checkValidUrl(websiteName)) {
      const newData = {
        key: count,
        name: websiteName,
        date: date.toString(),
      };
      this.setState(
        {
          dataSource: [...dataSource, newData],
          count: count + 1,
          websiteName: '',
        },
        () => this.generateCode(),
      );
    } else {
      actions.openSnackBar({
        snackBarMessage: 'Please enter valid domain name of the website.',
        snackBarDuration: 2000,
      });
    }
  };

  generateCode = () => {
    let { configCode, actions } = this.props;
    const { dataSource } = this.state;
    let websites = '';
    dataSource.map(dataItem => {
      if (dataItem.name !== '') {
        websites += dataItem.name.trim();
        if (dataItem.key < dataSource.length - 1) {
          websites += ', ';
        }
      }
      return null;
    });
    configCode = configCode.replace(
      /^::allowed_sites\s(.*)$/m,
      `::allowed_sites ${websites}`,
    );
    actions.setConfigureData({ configCode });
  };

  handleAddFromCode = (websiteName, websiteCount) => {
    let date = new Date();
    const newData = {
      key: websiteCount,
      name: websiteName,
      date: date.toString(),
    };
    if (newData.name !== '') {
      this.dataSource = [...this.dataSource, newData];
    }
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  componentDidMount = () => {
    this.generateUIData();
  };

  generateUIData = () => {
    const { configCode } = this.props;
    const enableOnOwnSitesOnly = configCode.match(
      /^::allow_bot_only_on_own_sites\s(.*)$/m,
    );
    if (enableOnOwnSitesOnly) {
      let limitSites = false;
      if (enableOnOwnSitesOnly[1] === 'yes') {
        limitSites = true;
      }
      this.setState({
        limitSites,
      });
    }

    if (enableOnOwnSitesOnly[1] === 'yes') {
      const allowedSites = configCode.match(/^::allowed_sites\s(.*)$/m);
      const sites = allowedSites[1].split(',');
      for (let i = 0; i < sites.length; i++) {
        if (this.checkValidUrl(sites[i])) {
          this.handleAddFromCode(sites[i], i);
        } else {
          let { configCode, actions } = this.props;
          configCode = configCode.replace(sites[i], '');
          actions.setConfigureData({ configCode });
        }
      }
      let data = this.dataSource;
      this.setState({
        dataSource: data,
        count: sites.length,
      });
    }

    const enableDefaultSkillsMatch = configCode.match(
      /^::enable_default_skills\s(.*)$/m,
    );
    if (enableDefaultSkillsMatch) {
      let includeSusiSkills = false;
      if (enableDefaultSkillsMatch[1] === 'yes') {
        includeSusiSkills = true;
      }
      this.setState({
        includeSusiSkills,
      });
    }

    const enableOnDeviceMatch = configCode.match(
      /^::enable_bot_in_my_devices\s(.*)$/m,
    );
    if (enableOnDeviceMatch) {
      let myDevices = false;
      if (enableOnDeviceMatch[1] === 'yes') {
        myDevices = true;
      }
      this.setState({
        myDevices,
      });
    }

    const enableOtherUserDeviceMatch = configCode.match(
      /^::enable_bot_for_other_users\s(.*)$/m,
    );
    if (enableOtherUserDeviceMatch) {
      let publicDevices = false;
      if (enableOtherUserDeviceMatch[1] === 'yes') {
        publicDevices = true;
      }
      this.setState({
        publicDevices,
      });
    }
  };

  handleChangeWebsiteName = event => {
    this.setState({
      websiteName: event.target.value,
    });
  };

  handleOpenLastActiveInfo = () => {
    this.setState({ lastActiveInfo: true });
  };

  handleCloseLastActiveInfo = () => {
    this.setState({ lastActiveInfo: false });
  };

  handleChangeIncludeSusiSkills = () => {
    let value = !this.state.includeSusiSkills;
    let { configCode, actions } = this.props;
    configCode = configCode.replace(
      /^::enable_default_skills\s(.*)$/m,
      `::enable_default_skills ${value ? 'yes' : 'no'}`,
    );
    actions.setConfigureData({ configCode });
    this.setState({ includeSusiSkills: value });
  };

  handleChangeIncludeInMyDevices = () => {
    let value = !this.state.myDevices;
    let { configCode, actions } = this.props;
    configCode = configCode.replace(
      /^::enable_bot_in_my_devices\s(.*)$/m,
      `::enable_bot_in_my_devices ${value ? 'yes' : 'no'}`,
    );
    actions.setConfigureData({ configCode });
    this.setState({ myDevices: value });
  };

  handleChangeIncludeInPublicDevices = () => {
    let value = !this.state.publicDevices;
    let { configCode, actions } = this.props;
    configCode = configCode.replace(
      /^::enable_bot_for_other_users\s(.*)$/m,
      `::enable_bot_for_other_users ${value ? 'yes' : 'no'}`,
    );
    actions.setConfigureData({ configCode });
    this.setState({ publicDevices: value });
  };

  handleChangeLimitSites = () => {
    let value = !this.state.limitSites;
    let { configCode, actions } = this.props;
    configCode = configCode.replace(
      /^::allow_bot_only_on_own_sites\s(.*)$/m,
      `::allow_bot_only_on_own_sites ${value ? 'yes' : 'no'}`,
    );
    actions.setConfigureData({ configCode });
    this.setState({ limitSites: value });
  };

  checkValidUrl = url => {
    url = url.trim();
    // eslint-disable-next-line
    let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(url)) {
      return true;
      // eslint-disable-next-line
    } else {
      return false;
    }
  };

  render() {
    const { nameField } = styles;
    const {
      dataSource,
      limitSites,
      websiteName,
      includeSusiSkills,
      myDevices,
      publicDevices,
    } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <div className="table-wrap">
          <FormControlLabel
            control={
              <Checkbox
                checked={limitSites}
                onChange={this.handleChangeLimitSites}
                color="primary"
              />
            }
            label="Allow bot only on own site"
          />
          <div style={{ fontSize: '14px', padding: '0px 0px 2px 40px' }}>
            Allow the chatbot to run only on specified websites.
          </div>
          {limitSites ? (
            <div style={{ padding: '20px 0px' }}>
              <TextField
                name="Website Name"
                value={websiteName}
                onChange={this.handleChangeWebsiteName}
                style={nameField}
                placeholder="Domain Name"
                variant="outlined"
              />
              <Button
                onClick={this.handleAdd}
                type="primary"
                style={{
                  marginTop: '10px',
                  marginLeft: '15px',
                  height: '36px',
                }}
              >
                Add a website
              </Button>
              <Table
                components={components}
                rowClassName={() => 'editable-row'}
                locale={{ emptyText: 'No websites added!' }}
                bordered
                dataSource={dataSource}
                columns={columns}
                pagination={false}
              />
            </div>
          ) : null}
        </div>
        <div style={{ padding: '0px 0px 20px 0px' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={includeSusiSkills}
                onChange={this.handleChangeIncludeSusiSkills}
                color="primary"
              />
            }
            label="Include SUSI default skills"
          />
          <div style={{ fontSize: '14px', padding: '0px 0px 2px 40px' }}>
            Allow the users to use all skills of SUSI.AI on your chatbot.
            Don&apos;t worry, your bot skill will always have a higher priority
            than SUSI skills.
          </div>
          <FormControlLabel
            control={
              <Checkbox
                checked={myDevices}
                onChange={this.handleChangeIncludeInMyDevices}
                color="primary"
              />
            }
            label="(Coming Soon) Enable bot in my devices"
          />
          <div style={{ fontSize: '14px', padding: '0px 0px 2px 40px' }}>
            Allow the chatbot to run on your devices.
          </div>
          <FormControlLabel
            control={
              <Checkbox
                checked={publicDevices}
                onChange={this.handleChangeIncludeInPublicDevices}
                color="primary"
              />
            }
            label="(Coming Soon) Enable bot for other users"
          />
          <div style={{ fontSize: '14px', padding: '0px 0px 2px 40px' }}>
            List the chatbot publicly. Users won&apos;t be able to see/edit the
            code of your chatbot.
          </div>
        </div>
      </div>
    );
  }
}

UIView.propTypes = {
  actions: PropTypes.object,
  configCode: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    configCode: store.create.configCode,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...createActions, ...uiActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UIView);
