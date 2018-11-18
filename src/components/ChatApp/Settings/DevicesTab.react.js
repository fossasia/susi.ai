import React from 'react';
import Translate from '../../Translate/Translate.react';
import TableComplex from '../../TableComplex/TableComplex.react';
import SwipeableViews from 'react-swipeable-views';
import MapContainer from '../../MapContainer/MapContainer.react';
import PropTypes from 'prop-types';

const DevicesTab = props => {
  return (
    <span style={{ right: '40px' }}>
      <div style={props.containerStyle}>
        <span>
          <div
            style={{
              marginTop: '10px',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            <Translate text="Devices" />
          </div>
        </span>
        {props.themeVal === 'light' ? (
          <hr
            className="break-line-light"
            style={{ height: '2px', marginBottom: '10px' }}
          />
        ) : (
          <hr
            className="break-line-dark"
            style={{ height: '2px', marginBottom: '10px' }}
          />
        )}
        {props.deviceData ? (
          <div>
            <SwipeableViews>
              <div>
                <div style={{ overflowX: 'auto' }}>
                  <div
                    className="table"
                    style={{
                      left: '0px',
                      marginTop: '0px',
                      width: '550px',
                    }}
                  >
                    <TableComplex
                      handleRemove={props.handleRemove}
                      handleRemoveConfirmation={props.handleRemoveConfirmation}
                      startEditing={props.startEditing}
                      editIdx={props.editIdx}
                      stopEditing={props.stopEditing}
                      handleChange={props.handleChange}
                      tableData={props.tableData}
                    />
                  </div>
                  <div>
                    <div style={{ maxHeight: '300px', marginTop: '10px' }}>
                      <MapContainer
                        google={props.google}
                        mapData={props.mapObj}
                        centerLat={props.centerLat}
                        centerLng={props.centerLng}
                        deviceNames={props.deviceNames}
                        rooms={props.rooms}
                        macIds={props.macIds}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SwipeableViews>
            {props.slideIndex && props.devicesNotAvailable ? (
              <div style={{ marginTop: '10px' }}>
                <b>NOTE: </b>Location info of one or more devices could not be
                retrieved.
              </div>
            ) : null}
          </div>
        ) : (
          <div id="subheading">You do not have any devices connected yet!</div>
        )}
      </div>
    </span>
  );
};

DevicesTab.propTypes = {
  centerLat: PropTypes.number,
  centerLng: PropTypes.number,
  deviceData: PropTypes.bool,
  deviceNames: PropTypes.array,
  devicesNotAvailable: PropTypes.number,
  containerStyle: PropTypes.object,
  editIdx: PropTypes.number,
  google: PropTypes.object,
  handleChange: PropTypes.func,
  handleRemove: PropTypes.func,
  handleRemoveConfirmation: PropTypes.func,
  macIds: PropTypes.array,
  mapObj: PropTypes.array,
  tableData: PropTypes.array,
  rooms: PropTypes.array,
  slideIndex: PropTypes.number,
  startEditing: PropTypes.func,
  stopEditing: PropTypes.func,
  themeVal: PropTypes.string,
};

export default DevicesTab;
