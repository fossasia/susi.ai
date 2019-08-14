import React from 'react';
const MESSAGE_CONFIG = [
  {
    recipients: 'User',
    trigger: 'Password Change',
    subject: 'Password Change',
    userMessage: 'Your password has been changed successfully!',
    options: 'Mail',
    email: 'Your password has been changed successfully!',
    emailText: 'Your password has been changed..',
    time: 'No dates available',
  },
  {
    recipients: 'User',
    trigger: 'Password Recovery',
    subject: 'Password Recovery',
    userMessage: 'Recovery email sent to your email ID. Please check',
    options: 'Mail',
    email: (
      <span>
        We received a request to reset the password associated with this email
        address. To initiate the password reset process for your SUSI.AI
        account, click the link below:
        <br />
        <br />
        https://susi.ai/resetpass?token=%token%
        <br />
        <br />
        If you`ve received this mail in error, it`s likely that another user
        entered your email address by mistake while trying to reset a password.
        If you didn`t initiate this request, you don`t need to take any further
        action and can safely disregard this email.
        <br />
        <br />
        Yours sincerely, The SUSI.AI Team
        <br />
        <br />
        Note: This email address cannot accept replies.
      </span>
    ),
    emailText: 'We received a request to reset..',
  },
  {
    recipients: 'User',
    trigger: 'Password Reset',
    subject: 'Password Reset',
    email: (
      <span>
        We received a request to reset the password associated with this email
        address. To initiate the password reset process for your SUSI.AI
        account, click the link below:
        <br />
        <br />
        %RESET-LINK%
        <br />
        <br />
        If you`ve received this mail in error, it`s likely that another user
        entered your email address by mistake while trying to reset a password.
        If you didn`t initiate this request, you don`t need to take any further
        action and can safely disregard this email.
        <br />
        <br />
        Yours sincerely, The SUSI.AI Team
        <br />
        <br />
        Note: This email address cannot accept replies.
      </span>
    ),
    emailText: 'We received a request to reset..',
    userMessage: 'Your password has been reset successfully!',
    options: 'Mail',
  },
  {
    recipients: 'User',
    trigger: 'Resend Account Verification Link',
    subject: 'SUSI AI verification',
    userMessage: 'SUSI AI verification',
    email: (
      <span>
        You just requested for a new verification link for your SUSI AI account.
        <br />
        <br />
        To verify, click on the following link: %VERIFICATION-LINK% If you
        <br />
        <br />
        didn`t ask for a new verification link, please ignore this email.
      </span>
    ),
    emailText: 'You just requested for a new v..',
    options: 'Mail',
  },
  {
    recipients: 'User',
    trigger: 'Sign Up',
    userMessage:
      'You successfully signed-up! An email with a verification link was sent to your address.',
    subject: 'SUSI AI verification',
    email: (
      <span>
        You just requested for a new verification link for your SUSI AI account.
        <br />
        <br />
        To verify, click on the following link:
        <br />
        <br />
        %VERIFICATION-LINK%
        <br />
        <br />
        If you didn`t ask for a new verification link, please ignore this email.
      </span>
    ),
    emailText: 'You just requested for a new v..',
    options: 'Mail',
  },
  {
    recipients: 'Admin',
    trigger: 'Modify Skill',
    userMessage: ' ',
    email: (
      <span>
        Dear Adminstrator,
        <br />
        <br />
        There are merge conflicts in Skill Data Repository. Please resolve them.
        <br />
        <br />
        %CONFLICTS%
      </span>
    ),
    emailText: 'Dear Adminstrator, There are m..',
    subject: 'SUSI Skill Data Conflicts',
    options: 'Mail',
  },
  {
    recipients: 'Admin',
    trigger: 'Test Email',
    userMessage: 'You have successfully sent a test email.',
    email: 'You have successfully sent a email',
    emailText: 'You have successfully sent a e..',
    subject: 'Testing email through Admin',
    options: 'Mail',
  },
];

export default MESSAGE_CONFIG;
