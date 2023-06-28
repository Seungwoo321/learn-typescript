interface Developer {
  name: string;
  skill: string;
}

interface Person {
  name: string;
  age: number
}

function introduce (): Developer | Person {
  return {
    name: 'Tony',
    age: 13,
    skill: 'Iron Making'
  }
}

var tony = introduce();

// 타입 단언을 사용해도 타입 추론이 가능해지지만 복잡해진다.
if ((tony as Developer).skill) {
  var skill = (tony as Developer).skill;
  console.log(skill);
} else if ((tony as Person).age) {
  var age = (tony as Person).age;
  console.log(age);
}

// 타입 가드 정의
function isDeveloper (target: Developer | Person): target is Developer {
  return  (target as Developer).skill !== undefined;
}

if (isDeveloper(tony)) {
  console.log(tony.skill)
} else {
  console.log(tony.age)
}