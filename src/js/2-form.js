let formData = { email: '', message: '' };

document.addEventListener('DOMContentLoaded', () => {
  const formElem = document.querySelector('.feedback-form');

  const lsData = getFromLS('feedback-form-state', { email: '', message: '' });

  if (lsData && typeof lsData === 'object') {
    formData.email = lsData.email;
    formData.message = lsData.message;
  } else {
    formData.email = '';
    formData.message = '';
  }
  formElem.elements.email.value = formData.email;
  formElem.elements.message.value = formData.message;

  formElem.addEventListener('input', e => {
    formData.email = e.currentTarget.elements.email.value.trim();
    formData.message = e.currentTarget.elements.message.value.trim();
    saveToLS('feedback-form-state', formData);
  });

  formElem.addEventListener('submit', e => {
    e.preventDefault();
    const email = e.currentTarget.elements.email.value;
    const message = e.currentTarget.elements.message.value;
    if (!email || !message) {
      alert('Не заповнені дані');
      return;
    }
    console.log(formData);
    localStorage.removeItem('feedback-form-state');
    formElem.reset();
    formData = { email: '', message: '' };
  });
});

function saveToLS(key, value) {
  const jsonData = JSON.stringify(value);
  localStorage.setItem(key, jsonData);
}

function getFromLS(key, defaultValue) {
  const jsonData = localStorage.getItem(key);
  if (jsonData === null) {
    return defaultValue;
  }
  try {
    const data = JSON.parse(jsonData);
    return data;
  } catch {
    return defaultValue || jsonData;
  }
}
