import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

const snackbarStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

function SnackbarContentWrapper(props) {
  const classes = snackbarStyles();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variant && variantIcon[variant];

  return (
    <SnackbarContent
      className={variant && clsx(classes[variant], className)}
      aria-describedby="snackbar"
      message={
        <span id="snackbar" className={classes.message}>
          {variant && (
            <Icon className={clsx(classes.icon, classes.iconVariant)} />
          )}
          {message}
        </span>
      }
      action={
        variant && [
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]
      }
      {...other}
    />
  );
}

SnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.string,
};

const CustomSnackbar = ({
  open,
  onClose,
  anchorOrigin,
  autoHideDuration,
  variant,
  message,
}) => {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      autoHideDuration={autoHideDuration}
    >
      {open && (
        <SnackbarContentWrapper
          onClose={onClose}
          variant={variant}
          message={message}
        />
      )}
    </Snackbar>
  );
};

CustomSnackbar.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  anchorOrigin: PropTypes.object,
  autoHideDuration: PropTypes.number,
  variant: PropTypes.string,
  message: PropTypes.string,
};

export default CustomSnackbar;
