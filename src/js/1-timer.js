import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const inputElem = document.querySelector('#datetime-picker');
const btnElem = document.querySelector('button[data-start]');
const timerElem = document.querySelector('.timer');

const timerFields = {
  days: timerElem.querySelector('[data-days]'),
  hours: timerElem.querySelector('[data-hours]'),
  minutes: timerElem.querySelector('[data-minutes]'),
  seconds: timerElem.querySelector('[data-seconds]'),
};

btnElem.disabled = true;

let userSelectedDate = null;
let intervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selected = selectedDates[0];

    if (selected <= Date.now()) {
      iziToast.show({
        position: 'topRight',
        backgroundColor: '#fa5656',
        messageColor: 'white',
        title: 'Caution',
        message: 'Please choose a date in the future',
      });
      btnElem.disabled = true;
      return;
    }

    userSelectedDate = selected;
    btnElem.disabled = false;
  },
};

function startCountdown() {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }

  const finishTime = userSelectedDate.getTime();
  btnElem.disabled = true;
  inputElem.disabled = true;

  intervalId = setInterval(() => {
    const diff = finishTime - Date.now();

    if (diff <= 0) {
      clearInterval(intervalId);
      intervalId = null;
      inputElem.disabled = false;
      btnElem.disabled = true;
      updateTimer(convertMs(0));
      return;
    }

    const timeLeft = convertMs(diff);
    updateTimer(timeLeft);
  }, 1000);
}

function updateTimer({ days, hours, minutes, seconds }) {
  timerFields.days.textContent = addLeadingZero(days);
  timerFields.hours.textContent = addLeadingZero(hours);
  timerFields.minutes.textContent = addLeadingZero(minutes);
  timerFields.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

btnElem.addEventListener('click', startCountdown);
flatpickr('#datetime-picker', options);
