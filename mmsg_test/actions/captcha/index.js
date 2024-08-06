require('dotenv').config();
const axios = require('axios');

// Function to verify the reCAPTCHA response
async function verifyRecaptcha(secretKey,recaptchaResponse) {

//   const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Your reCAPTCHA secret key from environment variables
  const url = 'https://www.google.com/recaptcha/api/siteverify';

  try {
    const response = await axios.post(url, null, {
      params: {
        secret: secretKey,
        response: recaptchaResponse
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error.message);
    return { success: false }; // Return false if there's an error
  }
}

// Function to execute the main logic
async function executeAction(params) {
  // Verify the reCAPTCHA response first
  const recaptchaVerification = await verifyRecaptcha(params.RECAPTCHA_SECRET_KEY,params['g-recaptcha-response']);

  if (recaptchaVerification.success) {
    const data = {
      "FirstName": params.FirstName,
      "LastName": params.LastName,
      "Email": params.Email,
      "BrandID": params.BrandID,
      "Channel": params.Channel,
      "SubChannel": params.SubChannel,
      "Referrer": params.Referrer,
      "ReferrerTeam": params.ReferrerTeam,
      "EmployerCode": params.EmployerCode,
      "MobilePhone": params.MobilePhone,
      "OtherPhone": params.OtherPhone,
      "EmployerName": params.EmployerName,
      "State": params.State,
      "PreferredCallBackTime": params.PreferredCallBackTime,
      "Notes": params.Notes,
      "Salary": params.Salary,
      "OriginatingTeam": params.OriginatingTeam,
      "VehicleType": params.VehicleType,
      "ConsultantTransferredTo": params.ConsultantTransferredTo,
      "SiteUrl": params.SiteUrl,
      "ExistingEmployer": params.ExistingEmployer,
      "UUID": params.UUID,
      "MarketingChannelSource": params.MarketingChannelSource,
      "MarketingAttribution": params.MarketingAttribution,
      "CampaignName": params.CampaignName,
      "g-recaptcha-response": params['g-recaptcha-response']
    };

    const url = 'https://api-uat.grs.mmsg.com.au/cmt/lead/v1/FuncCreateLead';

    try {
      console.log('Sending request to API');
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          'OCP-Apim-Subscription-Key': params.SUBSCRIPTION_KEY
        }
      });
      console.log('Success:', response.data);
      return { body: response.data }; // Return the response data in the format expected by Adobe I/O Runtime
    } catch (error) {
      console.error('Error:', error.message);
      return { error: error.message }; // Return the error message
    }
  } else {
    console.log('reCAPTCHA verification failed');
    return { error: 'reCAPTCHA verification failed' }; // Return an error message if reCAPTCHA verification fails
  }
}

// Main function to be exported for Adobe I/O Runtime
async function main(params) {
//   console.log(params);
  return executeAction(params);
}

// Export the main function for Adobe I/O Runtime
exports.main = main;
