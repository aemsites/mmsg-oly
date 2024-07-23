export default async function getModels(make) {
  const apiUrl =
    `https://api-test.grs.mmsg.com.au/vehicle-info/v1/list-of-models?ModelTypeCode=A&Year=2024&Make=` + make;
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
      throw new Error(error);
    }
  } catch (e) {
    throw new Error(e);
  }
}
