export default async function getMakes(year) {
  const apiUrl = `https://api-test.grs.mmsg.com.au/vehicle-info/v1/list-of-makes?ModelTypeCode=A&Year=${year}`;
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': localStorage.getItem('visAPIKey'),
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
