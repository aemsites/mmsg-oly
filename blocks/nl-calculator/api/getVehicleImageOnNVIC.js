export default async function getVehicleImageOnNVIC(nvic) {
  const apiUrl = `https://api-test.grs.mmsg.com.au/vehicle-info/v1/image/${nvic}`;
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'image/jpeg',
      'Ocp-Apim-Subscription-Key': localStorage.getItem('visAPIKey'),
    },
  };
  try {
    const response = await fetch(apiUrl, fetchOptions);
    if (response.ok) {
      return response;
    }
    const error = await response.text();
    return new Error(error);
  } catch (e) {
    throw new Error(e);
  }
}
