document.getElementById('verificationForm').addEventListener('submit', function (event) {
    const codes = [
      document.getElementById('code1').value.trim(),
      document.getElementById('code2').value.trim(),
      document.getElementById('code3').value.trim(),
      document.getElementById('code4').value.trim(),
    ];
  
    if (!codes.every(code => code.length === 1)) {
      event.preventDefault(); // Prevent form submission
      alert('Please enter all four digits.');
    }
  });
  
  // Countdown Timer
  let countdownSeconds = 133; // 2 minutes and 13 seconds
  const timerElement = document.querySelector('.timer');
  
  function startTimer() {
    const intervalId = setInterval(() => {
      countdownSeconds--;
      const minutes = Math.floor(countdownSeconds / 60);
      const seconds = countdownSeconds % 60;
      timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
      if (countdownSeconds <= 0) {
        clearInterval(intervalId);
        timerElement.textContent = 'Resend';
        timerElement.classList.remove('text-danger');
        timerElement.classList.add('text-primary');
      }
    }, 1000);
  }
  
  startTimer();