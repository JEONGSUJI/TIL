const targetStr = 'Is this all there is?';

// 플래그 미사용, 문자열 is를 대소문자를 구별하여 한번만 검색
let regexr = /is/;

console.log(targetStr.match(regexr));

// 플래그 i, g 사용 : 대소문자 구별하지 않고 대상 문자열 끝까지 검색
regexr = /is/ig;

console.log(targetStr.match(regexr));
console.log(targetStr.match(regexr).length);