const targetStr = 'This is a pen.';
const regexr = /is/ig;

// RegExp 객체의 메소드
console.log(regexr.exec(targetStr));
console.log(regexr.test(targetStr));

// String 객체의 메소드
console.log(targetStr.match(regexr));
console.log(targetStr.replace(regexr, 'IS'));

// String.prototype.search는 검색된 문자열의 첫번째 인덱스를 반환한다.
console.log(targetStr.search(regexr));
console.log(targetStr.split(regexr));