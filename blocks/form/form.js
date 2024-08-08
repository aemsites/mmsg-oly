import createField from './form-fields.js';
import { sampleRUM } from '../../scripts/aem.js';
import requestCallbackSubmission from './request-callback.js';

const googleRecaptchaKey = '6LcKcVQpAAAAAKJxn3Mg1o1ca9jjrEJFDigV4zwa';

async function loadRecaptcha() {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

/* eslint-disable-next-line func-names */
window.onloadCallback = function () {
  // eslint-disable-next-line
  grecaptcha.render('recaptcha-container', {
    sitekey: googleRecaptchaKey,
  });
};

export async function createForm(formHref) {
  const { pathname } = new URL(formHref);
  const resp = await fetch(pathname);
  const json = await resp.json();

  const form = document.createElement('form');
  // eslint-disable-next-line prefer-destructuring
  form.dataset.action = pathname.split('.json')[0];

  const fields = await Promise.all(json.data.map((fd) => createField(fd, form)));
  fields.forEach((field) => {
    if (field) {
      form.append(field);
    }
  });

  const fieldsets = form.querySelectorAll('fieldset');
  fieldsets.forEach((fieldset) => {
    form.querySelectorAll(`[data-fieldset="${fieldset.name}"]`).forEach((field) => {
      fieldset.append(field);
    });
  });

  return form;
}

function getFormType(form) {
  const objWithFormType = [form.elements].find((obj) => obj.formType !== undefined);
  return objWithFormType ? objWithFormType.formType?.value : null;
}

function generatePayload(form) {
  const payload = {};

  [...form.elements].forEach((field) => {
    if (field.name && field.type !== 'submit' && !field.disabled) {
      if (field.type === 'radio') {
        if (field.checked) payload[field.name] = field.value;
      } else if (field.type === 'checkbox') {
        if (field.checked)
          payload[field.name] = payload[field.name] ? `${payload[field.name]},${field.value}` : field.value;
      } else {
        payload[field.name] = field.value;
      }
    }
  });
  return payload;
}

function handleSubmitError(form, error) {
  form.querySelector('button[type="submit"]').disabled = false;
  sampleRUM('form:error', { source: '.form', target: error.stack || error.message || 'unknown error' });
}

async function genericSubmission(form, payload) {
  const response = await fetch(form.dataset.action, {
    method: 'POST',
    body: JSON.stringify({ data: payload }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    sampleRUM('form:submit', { source: '.form', target: form.dataset.action });
    if (form.dataset.confirmation) {
      window.location.href = form.dataset.confirmation;
    }
  } else {
    const error = await response.text();
    throw new Error(error);
  }
}

async function handleSubmit(form) {
  if (form.getAttribute('data-submitting') === 'true') return;

  const submit = form.querySelector('button[type="submit"]');
  try {
    form.setAttribute('data-submitting', 'true');
    submit.disabled = true;
    // eslint-disable-next-line
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
      throw new Error('Please complete the reCAPTCHA');
    }
    const formType = getFormType(form);
    const payload = generatePayload(form);
    payload['g-recaptcha-response'] = recaptchaResponse;

    switch (formType) {
      case 'get-quote':
        await requestCallbackSubmission(form, payload);
        break;
      case 'request-callback':
        await requestCallbackSubmission(form, payload);
        break;
      default:
        await genericSubmission(form, payload);
        break;
    }
  } catch (e) {
    handleSubmitError(form, e);
  } finally {
    form.setAttribute('data-submitting', 'false');
  }
}

export default async function decorate(block) {
  const formLink = block.querySelector('a[href$=".json"]');
  if (!formLink) return;

  const form = await createForm(formLink.href);
  block.replaceChildren(form);

  const formBlockDiv = document.createElement('div');
  formBlockDiv.classList.add('g-recaptcha');
  formBlockDiv.setAttribute('data-sitekey', googleRecaptchaKey);
  formBlockDiv.id = 'recaptcha-container';
  form.querySelector('.field-wrapper.submit-wrapper').prepend(formBlockDiv);

  setTimeout(async () => {
    await loadRecaptcha();
  }, 2000);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.checkValidity()) {
      handleSubmit(form);
    } else {
      const firstInvalidEl = form.querySelector(':invalid:not(fieldset)');
      if (firstInvalidEl) {
        firstInvalidEl.focus();
        firstInvalidEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}
