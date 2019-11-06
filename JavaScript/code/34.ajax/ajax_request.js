const xhr = new XMLHttpRequest();
// xhr.open('GET', '/users');
// xhr.send();

xhr.open('POST', '/users');
xhr.setRequestHeader('Content-type', 'application/json');

const data = { id: 3, title: 'JavaScript', author: 'Park', price: 5000};
xhr.send(JSON.stringify(data));

xhr.send(Object.keys(data).map(key => `${key}=${data[key]}`).join('&'));
