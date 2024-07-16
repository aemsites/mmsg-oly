export const CONTACTUS_SUCCESS_MESSAGE =
  'Thank you for sending us an email. We will get in contact with you as soon as possible.';
export const ERROR_MESSAGE = 'Something went wrong! Please try again later.';

export function getFormInputs(form) {
  const inputs = {};

  form.forEach((field) => {
    if (field.name && field.type !== 'submit' && !field.disabled) {
      if (field.type === 'radio') {
        if (field.checked) inputs[field.name] = field.value;
      } else if (field.type === 'checkbox') {
        if (field.checked)
          inputs[field.name] = inputs[field.name] ? `${inputs[field.name]},${field.value}` : field.value;
      } else if (field.type === 'number') {
        inputs[field.name] = parseInt(field.value, 10);
      } else {
        inputs[field.name] = field.value;
      }
    }
  });

  return inputs;
}

export function errorResponseHandler() {
  const fieldWrapper = document.querySelector('.form.block');
  const existingMesageContainer = document.querySelector('.field-wrapper.message-wrapper');

  if (existingMesageContainer) {
    existingMesageContainer.remove();
  }

  const divElement = document.createElement('div');
  divElement.classList.add('field-wrapper', 'message-wrapper');
  const paragraph = document.createElement('p');
  paragraph.classList.add('error');
  paragraph.textContent = ERROR_MESSAGE;

  divElement.appendChild(paragraph);
  fieldWrapper.insertBefore(divElement, fieldWrapper.firstChild);

  const submit = document.querySelector('button[type="submit"]');
  if (submit) submit.disabled = false;
}
