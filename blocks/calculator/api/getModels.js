export default async function getModels(make) {
  const apiUrl = `https://api-test.grs.mmsg.com.au/vehicle-info/v1/list-of-models?ModelTypeCode=A&Year=2024&Make=${make}`;
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': localStorage.getItem('calculatorAPIKey'),
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
