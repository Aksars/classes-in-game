// Фаза 1 НАЧАЛО
// Фаза 1 НАЧАЛО
// Фаза 1 НАЧАЛО
// Фаза 1 НАЧАЛО
// ОБЪЕКТЫ
// let orc1 = {
//     name:"Гром'Аш",
//     hp:250,
//     attack: 7,
//     level:1,
//     phrase:"За Орду!",
//     sayPhrase: function(){ console.log(this.phrase) },
//     battleCry: function(){ console.log("ЛОК'ТАР ОГАР!") },
//     species: "Орк"
// }
// let orc2 = {
//     name:"Разогр",
//     hp:100,
//     attack: 4,
//     level:1,
//     phrase:"Опять работать!",
//     sayPhrase: function(){ console.log(this.phrase) },
//     battleCry: function(){ console.log("ЛОК'ТАР ОГАР!") },
//     species: "Орк"
// }
// let orc3 = {
//     name:"Гаррош",
//     hp:150,
//     attack: 5,
//     level:1,
//     phrase:"Я принёс только смерть!",
//     sayPhrase: function(){ console.log(this.phrase) },
//     battleCry: function(){ console.log("ЛОК'ТАР ОГАР!") },
//     species: "Орк"
// }

// let bug1 = {
//     name:"Жучара",
//     hp:50,
//     attack: 3,
//     level:1,
//     phrase:"---------*зловеще молчит*----------",
//     sayPhrase: function(){ console.log(this.phrase) },
//     hide: function(){ console.log("Прячемся! *становиться невидимым*") },
//     species: "Жук"
// }

// let bug2 = {
//     name:"Васян",
//     hp:50,
//     attack: 3,
//     level:1,
//     phrase:"*ZZZZZZZZZZZZZZZZZZZ*",
//     sayPhrase: function(){ console.log(this.phrase) },
//     hide: function(){ console.log("Прячемся! *становиться невидимым*") },
//     species: "Жук"
// }

// console.log(orc1,orc2,orc3,bug1,bug2)

// ЗАДАНИЯ // ЗАДАНИЯ // ЗАДАНИЯ // ЗАДАНИЯ // ЗАДАНИЯ // ЗАДАНИЯ

// 1)
// СОЗДАТЬ ТРЕТЬЕГО ЖУКА, С ДРУГИМ ИМНЕНЕМ, ФРАЗОЙ и ЗДОРОВЬЕМ




// Фаза 1 КОНЕЦ
// Фаза 1 КОНЕЦ
// Фаза 1 КОНЕЦ
// Фаза 1 КОНЕЦ

// Фаза 2 НАЧАЛО
// Фаза 2 НАЧАЛО
// Фаза 2 НАЧАЛО
// Фаза 2 НАЧАЛО
// КЛАССЫ И ОБЪЕКТЫ

// class Orc {
//     constructor(name, phrase, hp, attack) {
//         this.name = name
//         this.phrase = phrase
//         this.hp = hp
//         this.attack = attack
//         this.species = "Орк"
//         this.level = 1
//     }
//     sayPhrase = () => console.log(this.phrase)
//     battleCry = () => console.log("ЛОК'ТАР ОГАР!")
// }

// class Bug {
//     constructor(name, phrase, hp, attack) {
//         this.name = name
//         this.phrase = phrase
//         this.hp = hp
//         this.attack = attack
//         this.species = "Жук"
//         this.level = 1
//     }
//     sayPhrase = () => console.log(this.phrase)
//     hide = () => console.log("Прячемся! *становиться невидимым*")
// }

// // Создаем конкретные объекты классов Орк и Жук
// let orc1 = new Orc("Гром'Аш", "За Орду!", 250, 7)
// let orc2 = new Orc("Разогр", "Опять работать!", 100, 4)
// let orc3 = new Orc("Гаррош", "Я принёс только смерть!", 150, 5)

// let bug1 = new Bug("Жучара", "---------*зловеще молчит*----------", 50, 3)
// let bug2 = new Bug("Васян", "*ZZZZZZZZZZZZZZZZZZZ*", 50, 3)

// console.log(orc1, orc2, orc3, bug1, bug2)

// ЗАДАНИЯ // ЗАДАНИЯ // ЗАДАНИЯ // ЗАДАНИЯ // ЗАДАНИЯ // ЗАДАНИЯ

// 1) 
// НАПИСАТЬ КЛАСС РОБОТ

// 2) РОБОТЫ УМЕЮТ ГОВОРИТЬ ФРАЗУ КАК И ДРУГИЕ И ВЫПОЛНЯТЬ АТАКАУ ЛАЗЕРОМ
// (имеют метод laser() с консол логом "Стреляет лазером и наносит ? урона" )

// 3) 
// СОЗДАТЬ 2-Х КОНКРЕТНЫХ РОБОТОВ





// Фаза 2 КОНЕЦ
// Фаза 2 КОНЕЦ
// Фаза 2 КОНЕЦ
// Фаза 2 КОНЕЦ

// Фаза 3 НАЧАЛО
// Фаза 3 НАЧАЛО
// Фаза 3 НАЧАЛО
// Фаза 3 НАЧАЛО
// НАСЛЕДОВАНИЕ КЛАССОВ

// class Enemy {
//     constructor(name, phrase, hp, attack) {
//         this.name = name
//         this.phrase = phrase
//         this.hp = hp
//         this.attack = attack
//         this.level = 1       
//     }
//     sayPhrase = () => console.log(this.phrase)    
// }

// class Orc extends Enemy {
//     constructor(name, phrase, hp, attack) {
//         super(name, phrase, hp, attack)
//         this.species = "Орк"
//         this.rage = 20  
//     }
//     battleCry = () => {
//         console.log("ЛОК'ТАР ОГАР!")
//         this.rage += 10  // Боевой клич увеличивает ярость
//     }
// }

// class Bug extends Enemy {
//     constructor(name, phrase, hp, attack) {
//         super(name, phrase, hp, attack)
//         this.species = "Жук"        
//     }
//     hide = () => console.log("Прячемся! *становится невидимым*")
// }

// class Robot extends Enemy {
//     constructor(name, phrase, hp, attack) {
//         super(name, phrase, hp, attack)
//         this.species = "Робот"        
//     }
//     laser = () => {       
//             console.log(`${this.name} стреляет лазером и наносит ${this.attack} урона!`);          
//     }    
// }

// // Создаем персонажей
// const orc1 = new Orc("Гром'Аш", "За Орду!", 250, 7)
// const orc2 = new Orc("Разогр", "Опять работать!", 100, 4)  
// const orc3 = new Orc("Гаррош", "Я принёс только смерть!", 150, 5)

// const bug1 = new Bug("Жучара", "---------*зловеще молчит*----------", 50, 3)
// const bug2 = new Bug("Васян", "*ZZZZZZZZZZZZZZZZZZZ*", 50, 3)

// const robot1 = new Robot("Мегатрон", "Я вас уничтожу!", 200, 15)
// const robot2 = new Robot("Терминатор", "I'll be back", 300, 10);

// console.log(orc1, orc2, orc3, bug1, bug2, robot1)


// ЗАДАНИЯ // ЗАДАНИЯ // ЗАДАНИЯ // ЗАДАНИЯ // ЗАДАНИЯ // ЗАДАНИЯ

// 1)
// ДОБАВИТЬ ВСЕМ ЖУКАМ КОЛИЧЕСТВО ЛАП = 6
// ДОБАВИТЬ ВСЕМ РОБОТАМ ЗАРЯД БАТАРЕИ ( 100% в начале)
// ДОБАВИТЬ ВСЕМ ВРАГАМ ПОКАЗАТЕЛЬ ОПЫТА (0 на 1 уровне)

// 2)
// ДОБАВИТЬ ВСЕМ ВРАГАМ ДЕЙСТВИЕ АТАКОВАТЬ
// ДЕЙСТВИЕ АТАКОВАТЬ ВЫВОДИТ СООБЩЕНИЕ В КОНСОЛЬ ТИПА
// ${имя_персонажа} атакует и наносит ${атака} урона

// 3)
// ПОВЫСИТЬ УРОВЕНЬ ДВУМ ЛЮБЫМ ПЕРСОНАЖАМ, ПОДНЯТЬ ИМ АТАКУ И ЗДОРОВЬЕ






// Фаза 3 КОНЕЦ
// Фаза 3 КОНЕЦ
// Фаза 3 КОНЕЦ
// Фаза 3 КОНЕЦ

// Фаза 4 НАЧАЛО
// Фаза 4 НАЧАЛО
// Фаза 4 НАЧАЛО
// Фаза 4 НАЧАЛО
// СЕТТЕРЫ И ГЕТТЕРЫ

class Enemy {
  constructor(name, phrase, hp, attack) {
    this.name = name;
    this.phrase = phrase;
    this.hp = hp;
    this.attack = attack;
    this._level = 1;
    this._xp = 0;
  }
  sayPhrase = () => console.log(this.phrase);
  attackMove = () => {
     console.log(`${this.name} атакует и наносит ${this.attack} урона!`);          
  };
  get danger() {
    return this.hp * this.attack + this._level*25;
  }
  set xp(опыт) {
    this._xp = опыт;
    this.level = Math.floor(опыт / 1000) + 1;
  }
  get xp() {
    return this._xp;
  }
  set level(левл) {
    this._level = левл;
    this._xp = (this._level - 1) * 1000;
  }
}
class Orc extends Enemy {
    constructor(name, phrase, hp, attack) {
        super(name, phrase, hp, attack)
        this.species = "Орк"
        this.rage = 20  
    }
    battleCry = () => {
        console.log("ЛОК'ТАР ОГАР!")
        this.rage += 10  // Боевой клич увеличивает ярость
    }
}
class Bug extends Enemy {
  constructor(name, phrase, hp, attack) {
    super(name, phrase, hp, attack);
    this.species = "Жук";
    this.лапы = 6;
  }
  hide = () => console.log("Прячемся! *становится невидимым*")
}
class Robot extends Enemy {
  constructor(name, phrase, hp, attack) {
    super(name, phrase, hp, attack);
    this.species = "Робот";
    this.battary = 100;
  }
  laser = () => {       
          console.log(`${this.name} стреляет лазером и наносит ${this.attack} урона!`);          
  } 
}

// Создаем персонажей. Все точно так же
const orc1 = new Orc("Гром'Аш", "За Орду!", 250, 7)
const orc2 = new Orc("Разогр", "Опять работать!", 100, 4)  
const orc3 = new Orc("Гаррош", "Я принёс только смерть!", 150, 5)

const bug1 = new Bug("Жучара", "---------*зловеще молчит*----------", 50, 3)
const bug2 = new Bug("Васян", "*ZZZZZZZZZZZZZZZZZZZ*", 50, 3)

const robot1 = new Robot("Мегатрон", "Я вас уничтожу!", 200, 15)


// ЗАДАНИЯ // ЗАДАНИЯ // ЗАДАНИЯ // ЗАДАНИЯ // ЗАДАНИЯ // ЗАДАНИЯ

// 1)
// НАПИСАТЬ АВТОМАТИЧЕСКУЮ ЛОГИКУ ПОДНЯТИЯ МАКСИМАЛЬНОГО ЗДОВОВЬЯ (по +50 за уровень) 
// И АТАКИ (по +2 за уровень) ПРИ ИЗМЕНЕНИИ УРОВНЯ
// 2)
// ПОДНЯТЬ УРОВЕНЬ 2 ВРАГАМ И ПРОВЕРИТЬ ИХ КЛАСС ОПАСНОСТИ






// Фаза 4 КОНЕЦ
// Фаза 4 КОНЕЦ
// Фаза 4 КОНЕЦ
// Фаза 4 КОНЕЦ

// Можно использовать сеттер для ограничения свойств в классе, но тут возникают следующие
// пробелммы -- свойство attack занято сеттером attack и приходиться использовать
// свойство _attack и сеттер attack для обхода этой проблеммы
// class Enemy {
//     constructor (name, phrase, hp, attack) {
//         this.name = name
//         this.phrase = phrase
//         this.hp = hp
//         if(attack<0){
//           console.log("только положительные числа")
//           this._attack = 0
//         }
//         else{
//             this._attack = attack
//         }
//     }
//     get power(){
//       return this.hp*this._attack
//     }
//     set attack(value){
//       if(value<0){
//           console.log("только положительные числа")
//           this._attack = 0
//       }
//       else{
//           this._attack = value
//       }
//     }
//     sayPhrase = () => console.log(this.phrase)
// }

//  var robot2 = new Robot("Валии(злой)", "Привет, я живу один на планете", 240, -8)
//  у robot 2 отрицательная атака приводиться к 0 (допустим если он под действием дебафа)

// добавить здоровья
//this.hp = this.hp + (this._level * 50)
//this.attack = this.attack + (this.attack * 2)
