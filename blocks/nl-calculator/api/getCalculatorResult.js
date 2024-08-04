export default async function getCalculatorResult(
  vehicleValue,
  kmTravelled,
  leaseTermInMonths,
  vehicleTypeId,
  annualSalary,
  fuelTypeID,
) {
  debugger;
  var input = {
    brandId: 9,
    effectiveDate: new Date(),
    vehicleValue: vehicleValue,
    kMpa: kmTravelled,
    leaseTerm: leaseTermInMonths,
    vehicleTypeID: vehicleTypeId,
    annualSalary: annualSalary,
    postCode: 3000,
    fuelTypeID: fuelTypeID,
    fBTMethod: 1,
    availableGUTVForLease: 17667,
    budgetForGSTOnECM: 1,
    includeITCinSalary: 1,
    qLDGovernmentYN: 0,
    qLDGovernmentYNSpecified: 0,
  };
  const res = await getAccessToken();
  const apiUrl = `https://api-uat.grs.mmsg.com.au/cmt/maxxiacalcs/v1/api/Calcs/v1/ReadNovatedLeaseQuoteWeb`;
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'OCP-Apim-Subscription-Key': localStorage.getItem('maxxiaCalcsAPIKey'),
      Authorization: `Bearer ${res.access_token}`,
    },
    body: JSON.stringify(input),
  };
  try {
    const response = await fetch(apiUrl, fetchOptions);
    if (response.ok) {
      return response.json();
    }
    const error = await response.text();
    return new Error(error);
  } catch (e) {
    throw new Error(e);
  }
}

async function getAccessToken() {
  const apiUrl = `https://dev-mms-digi-pws-aem-api-cqfvcregdmf9dqf4.australiaeast-01.azurewebsites.net/AzureAD`;
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await fetch(apiUrl, fetchOptions);
    if (response.ok) {
      return response.json();
    }
    const error = await response.text();
    return new Error(error);
  } catch (e) {
    throw new Error(e);
  }
}
