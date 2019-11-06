const todos = [
  { id: 1, content: 'HTML', completed: true },
  { id: 2, content: 'CSS', completed: true },
  { id: 3, content: 'JavaScript', completed: false }
];

const str = JSON.stringify(todos);
console.log(typeof str, str);

const parsed = JSON.parse(str);
console.log(typeof parsed, parsed);
