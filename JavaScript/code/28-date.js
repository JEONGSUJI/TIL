(function printNow(){
  const today = new Date();
  // console.log(today);

  const dayNames = ['(일요일)', '(월요일)', '(화요일)', '(수요일)', '(목요일)', '(금요일)', '(토요일)'];
  const day = dayNames[today.getDay()];
  // console.log(today.getDay());
  // console.log(day);

  const year = today.getFullYear();
  // console.log(year);

  const month = today.getMonth() + 1;
  // console.log(month);
  
  const date = today.getDate();
  // console.log(date);

  let hour = today.getHours();
  // console.log(hour);

  let minute = today.getMinutes();
  // console.log(minute);
  
  let second = today.getSeconds();
  // console.log(second);
  
  const ampm = hour >= 12 ? 'pm' : 'am';

  hour %= 12;
  hour = hour || 12;

  minute = minute < 10 ? '0' + minute : minute;
  second = second < 10 ? '0' + second : second;

  const now = `${year}년 ${month}월 ${date}일 ${day} ${hour}:${minute}:${second} ${ampm}`;

  console.log(now);
  setTimeout(printNow, 1000);
}());
