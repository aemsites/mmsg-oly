export default async function getVehicleImageOnNVIC(nvic) {
  const apiUrl = 'https://api-test.grs.mmsg.com.au/vehicle-info/v1/image/' + nvic;
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'image/jpeg',
      'Ocp-Apim-Subscription-Key': 'd6d942f632ce4c6c88783a70483e53f1',
    },
  };
  try {
    const response = await fetch(apiUrl, fetchOptions);
    if (response.ok) {
      debugger;
      return response;
    } else {
      debugger;
      const error = await response.text();
      throw new Error(error);
    }
  } catch (e) {
    throw new Error(e);
  }
}
