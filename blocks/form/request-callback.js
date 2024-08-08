import { CONTACTUS_SUCCESS_MESSAGE, errorResponseHandler } from './helper.js';

// function requestCallbackPayload(payload) {
//   // const transformedObject = {
//   //   Context: 'Contact Us',
//   //   From: payload.email,
//   //   FromName: `${payload.firstName} ${payload.lastName}`,
//   //   MessageHtml: `Name: ${payload.firstName}<br/>Surname: ${payload.lastName}<br/>Email: ${payload.email}<br/>Contact Number: ${payload.phone}<br/><br/>Message from Client: <br/><br/>${payload.enquiry}<br/><br/>`,
//   //   ReplyTo: payload.email,
//   //   Subject: `Contact us: ${payload.firstName} ${payload.lastName}`,
//   // };
//   const transformedObject = {
//     FirstName: payload.firstName,
//     LastName: 'MMSG fianl last',
//     Email: 'test@test.com',
//     BrandID: 'Remserv',
//     Channel: 'Digital',
//     SubChannel: 'Website',
//     Referrer: 'Generic',
//     ReferrerTeam: '',
//     EmployerCode: null,
//     MobilePhone: '0405599123',
//     OtherPhone: '0405599123',
//     EmployerName: 'Queensland Corrective Services',
//     State: 'Qld',
//     PreferredCallBackTime: '',
//     Notes: 'Testing please ignore',
//     Salary: '0.00',
//     OriginatingTeam: '',
//     VehicleType: '',
//     ConsultantTransferredTo: '',
//     SiteUrl:
//       'https://www.remservlease.com.au/vehicle-offers?cid=partner%3Aemail%3Afy24q4_vo_rs_qg_lg_%3Atgu_camp%3Afindmycar2&consultant=generic&utm_campaign=2024_All%20Member&utm_medium=email&_hsenc=p2ANqtz-_6ZwY5mTTcIFZPr3CIlmnm-NbEtr3vUV0L0CSVq_5Wd79kgzfwBx32RoNSODek9SZtSdcGiIroU3MORXWBuTJDbtiVWQ&_hsmi=308146742&utm_content=308146742&utm_source=hs_email',
//     ExistingEmployer: null,
//     UUID: '6dfe0695-4473-462d-ba64-48f2a8c7743d',
//     MarketingChannelSource: 'Email\r',
//     MarketingAttribution: 'cid=partner:email:fy24q4_vo_rs_qg_lg_:tgu_camp:findmycar2',
//     CampaignName: 'fy24q4_vo_rs_qg_lg_',
//   };

//   return transformedObject;
// }

function requestCallbackResponse(form) {
  const divElement = document.createElement('div');
  divElement.classList.add('field-wrapper', 'message-wrapper');
  const paragraph = document.createElement('p');
  paragraph.classList.add('success');
  paragraph.textContent = CONTACTUS_SUCCESS_MESSAGE;
  divElement.appendChild(paragraph);
  form.innerHTML = '';
  form.append(divElement);
}

function requestCallbackSubmitError(form, error) {
  // eslint-disable-next-line no-console
  console.error(error);
  errorResponseHandler();
  form.querySelector('button[type="submit"]').disabled = false;
}

// Function to handle contact us submission
export default async function requestCallbackSubmission(form, payload) {
  // const apiUrl = `https://110267-mmsg-stage.adobeioruntime.net/api/v1/web/MMSG/generic`;
  const apiUrl = 'https://110267-mmsgtest-stage.adobeioruntime.net/api/v1/web/mmsg_test/RequestACall';

  // const payload = getFormInputs([...form.elements]);
  // getFormInputs([...form.elements]);
  console.log('payload', payload);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
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
