export default async function getMakes() {
  const apiUrl = `https://api-test.grs.mmsg.com.au/vehicle-info/v1/list-of-makes?ModelTypeCode=A&Year=2024`;
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'd6d942f632ce4c6c88783a70483e53f1',
    },
  };
  try {
    const response = await fetch(apiUrl, fetchOptions);
    if (response.ok) {
      return response.json();
    } else {
      const error = await response.text();
      return new Error(error);
    }
  } catch (e) {
    throw new Error(e);
  }
}
