import { CONTACTUS_SUCCESS_MESSAGE, getFormInputs, errorResponseHandler } from './helper.js';

function requestCallbackPayload(payload) {
  const transformedObject = {
    Context: 'Contact Us',
    From: payload.email,
    FromName: `${payload.firstName} ${payload.lastName}`,
    MessageHtml: `Name: ${payload.firstName}<br/>Surname: ${payload.lastName}<br/>Email: ${payload.email}<br/>Contact Number: ${payload.phone}<br/><br/>Message from Client: <br/><br/>${payload.enquiry}<br/><br/>`,
    ReplyTo: payload.email,
    Subject: `Contact us: ${payload.firstName} ${payload.lastName}`,
  };

  return transformedObject;
}

function requestCallbackResponse(form) {
  const divElement = document.createElement('div');
  divElement.classList.add('field-wrapper', 'message-wrapper');
  const paragraph = document.createElement('p');
  paragraph.classList.add('success');
  paragraph.textContent = CONTACTUS_SUCCESS_MESSAGE;
  divElement.appendChild(paragraph);
  form.insertBefore(divElement, form.firstChild);
}

function requestCallbackSubmitError(form, error) {
  // eslint-disable-next-line no-console
  console.error(error);
  errorResponseHandler();
  form.querySelector('button[type="submit"]').disabled = false;
}

// Function to handle contact us submission
export default async function requestCallbackSubmission(form) {
  const apiUrl = `/contact-us`;
  const payload = getFormInputs([...form.elements]);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestCallbackPayload(payload)),
  };
  try {
    const response = await fetch(apiUrl, fetchOptions);
    if (response.ok) {
      requestCallbackResponse(form);
    } else {
      const error = await response.text();
      throw new Error(error);
    }
  } catch (e) {
    requestCallbackSubmitError(form, e);
  } finally {
    form.setAttribute('data-submitting', 'false');
  }
}
