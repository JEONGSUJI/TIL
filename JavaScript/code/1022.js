// let todos = [
//   { id: 1, content: 'HTML',  completed: false },
//   { id: 2, content: 'CSS', completed: true },
//   { id: 3, content: 'JavaScript', completed: false }
// ]

// // todo에서 completed가 true인 요소를 제거하라

// todos = todos.filter(v => !v.completed);

// console.log(todos);

let todos = [
  { id: 1, content: 'HTML',  completed: false },
  { id: 2, content: 'CSS', completed: true },
  { id: 3, content: 'JavaScript', completed: false }
]

// completed가 true인 요소의 개수를 구하라

console.log(todos.filter(item => item.completed).length);0