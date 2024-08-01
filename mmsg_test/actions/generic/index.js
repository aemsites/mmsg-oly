require('dotenv').config();
// console.log(process.env.SUBSCRIPTION_KEY);
const axios = require('axios');

// Function to execute the main logic
async function executeAction(params) {
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
    "CampaignName": params.CampaignName
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
}

// Main function to be exported for Adobe I/O Runtime
async function main(params) {
  return executeAction(params);
}

// Export the main function for Adobe I/O Runtime
exports.main = main;
