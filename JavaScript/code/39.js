function step1() {
  console.log(1);  
};

step1(function() {
  console.log(1);
  step2(value1, function() {
    console.log(2);
    step3(value2, function() {
      console.log(3);
      step4(value3, function() {
        console.log(4);
        step5(value4, function() {
            // value5를 사용하는 처리
          console.log(5);
        });
        console.log(4-1);
      });
      console.log(3-1);
    });
    console.log(2-1);
  });
  console.log(1-1);
});