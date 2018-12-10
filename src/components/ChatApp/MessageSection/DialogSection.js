import Dialog from 'material-ui/Dialog';
import React from 'react';
import PropTypes from 'prop-types';
import Close from 'material-ui/svg-icons/navigation/close';

const DialogSection = props => {
  const closingStyle = {
    position: 'absolute',
    zIndex: 1200,
    fill: '#444',
    width: '26px',
    height: '26px',
    right: '10px',
    top: '10px',
    cursor: 'pointer',
  };
  return (
    <div>
      <Dialog
        className="dialogStyle"
        contentStyle={{
          width: '45%',
          minWidth: '300px',
          textAlign: 'center',
        }}
        title="Welcome to SUSI.AI Web Chat"
        open={props.tour}
      >
        <iframe
          width="99%"
          height="315"
          src="https://www.youtube.com/embed/9T3iMoAUKYA"
          frameBorder="0"
          scrolling="no"
        />
        <Close style={closingStyle} onTouchTap={props.onRequestCloseTour()} />
      </Dialog>
    </div>
  );
};

DialogSection.propTypes = {
  tour: PropTypes.bool,
  onRequestCloseTour: PropTypes.func,
};

export default DialogSection;
