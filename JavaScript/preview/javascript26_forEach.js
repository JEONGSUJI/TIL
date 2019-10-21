const Numbers = (function() {
  function numbers(){
    this.numberArray = [];
  }
  numbers.prototype.multiply = function (arr) {
    // 1번방법 const that = this;
    arr.forEach(function (item) {
      // 일반 함수로 호출되는 콜백 함수 내부의 this는 전역 객체를 가리킨다.
      // TypeError: Cannot read property 'numberArray' of undefined

      // 1번방법 that.numberArray.push(item * item);
      // 3번방법
      this.numberArray.push(item * item);

    // 2번 방법 }.bind(this));
    
    // 3번방법
    }, this);
    
    // 화살표 함수는 내부에 this를 갖지 않는다.
    // arr.forEach(item => this.numberArray.push(item * item));
  };
  return Numbers;
}());

const numbers = new Numbers();
numbers.multiply([1, 2, 3]);
console.log(numbers.numberArray);