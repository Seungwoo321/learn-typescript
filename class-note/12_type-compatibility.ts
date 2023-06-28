// 인터페이스
interface Developer {
  name: string;
  skill: string;
}
interface Person {
  name: string;
}
// class Person {
//   name: string;
// }
var developer: Developer = { name: 'tony', skill: 'Iron Making' };
var person: Person;
// developer = person
person = developer
// developer = new Person()

// 함수
var add = function (a: number) {
  // ...
}
var sum = function (a: number, b: number) {
  // ...
}
sum = add
// add = sum

// 제네릭
interface Empty<T> {
  // ...
}
var empty1: Empty<string> = 'a';
var empty2: Empty<number> = 1;

empty1 = empty2;
empty2 = empty1

interface NotEmpty<T> {
  data: T;
}
var notEmpty1: NotEmpty<string> = { data: 'a' };
var notEmpty2: NotEmpty<number> = { data: 1 };

notEmpty1 = notEmpty2;
notEmpty2 = notEmpty1;
