import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const CaptchaBox = ({ onVerify }) => {
  const handleChange = (token) => {
    onVerify(token);
  };

  return (
    <div className="mb-3 d-flex justify-content-center">
      <ReCAPTCHA
        sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
        onChange={handleChange}
      />
    </div>
  );
};

export default CaptchaBox;
