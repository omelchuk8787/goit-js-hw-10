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

let userSelectedDate;
let intervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const date = new Date(selectedDates);
    if (intervalId) {
      btnElem.disabled = true;
    }
    if (date.getTime() - Date.now() <= 0) {
      iziToast.show({
        position: 'topRight',
        backgroundColor: '#fa5656',
        messageColor: 'white',
        title: 'Caution',
        message: 'Please choose a date in the future',
      });
      btnElem.disabled = true;
      console.log(btnElem.disabled);
    } else {
      btnElem.disabled = false;
      console.log(btnElem.disabled);
      userSelectedDate = selectedDates;
    }
  },
};

function startCountdown() {
  const finishTime = new Date(userSelectedDate);
  btnElem.disabled = true;
  inputElem.disabled = true;
  intervalId = setInterval(() => {
    const currentTime = Date.now();
    const diff = finishTime.getTime() - currentTime;
    const countdown = convertMs(diff);
    timerFields.seconds.textContent = addLeadingZero(countdown).secondsStr;
    timerFields.minutes.textContent = addLeadingZero(countdown).minutesStr;
    timerFields.hours.textContent = addLeadingZero(countdown).hoursStr;
    timerFields.days.textContent = addLeadingZero(countdown).daysStr;
    if (diff < 1000) {
      clearInterval(intervalId);
      inputElem.disabled = false;
    }
  }, 1000);
}

function addLeadingZero({ days, hours, minutes, seconds }) {
  const daysStr = days.toString().padStart(2, '0');
  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');
  const secondsStr = seconds.toString().padStart(2, '0');
  return { daysStr, hoursStr, minutesStr, secondsStr };
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
btnElem.addEventListener('click', startCountdown);

flatpickr('input#datetime-picker', options);
