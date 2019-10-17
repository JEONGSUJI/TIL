function Circle(radius){
  this.radius = radius;
}

Circle.prototype.getArea = function(){
  return Math.PI * this.radius ** 2;
};

const circle1 = new Circle(1);

console.log(circle1)

console.log(circle1.__proto__ === Circle.prototype);
console.log(Object.getPrototypeOf(circle1));

console.log(circle1.getArea());