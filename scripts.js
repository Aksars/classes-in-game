
class Orc {
    constructor(name, phrase, hp, attack) {
        this.name = name
        this.phrase = phrase
        this.hp = hp
        this.maxHp = hp
        this.attack = attack
        this.species = "Орк"
        this.level = 1
    }
    sayPhrase = () => console.log(this.phrase)
    battleCry = () => console.log("ЛОК'ТАР ОГАР!")
}

class Bug {
    constructor(name, phrase, hp, attack) {
        this.name = name
        this.phrase = phrase
        this.hp = hp
        this.maxHp = hp
        this.attack = attack
        this.species = "Жук"
        this.level = 1
    }
    sayPhrase = () => console.log(this.phrase)
    hide = () => console.log("Прячемся! *становиться невидимым*")
}

// Создаем персонажей
const orc1 = new Orc("Гром'Аш", "За Орду!", 250, 7)
const orc2 = new Orc("Разогр", "Опять работать!", 100, 4)
const orc3 = new Orc("Гаррош", "Я принёс только смерть!", 150, 5)

const bug1 = new Bug("Жучара", "---------*зловеще молчит*----------", 50, 3)
const bug2 = new Bug("Васян", "*ZZZZZZZZZZZZZZZZZZZ*", 50, 3)


// Создаем персонажей на поле боя
создатьПерсонажей(orc1, orc2, orc3, bug1, bug2)









// Функция для создания визуального представления персонажей
function создатьПерсонажей(...characters) {
    const battlefield = document.getElementById('battlefield')
    let yPosition = 20
    
    characters.forEach((character, index) => {
        const charElement = document.createElement('div')
        charElement.className = `character ${character.species === 'Орк' ? 'orc' : 'bug'}`
        charElement.style.left = '20px'
        charElement.style.top = `${yPosition}px`
        
        const avatar = document.createElement('div')
        avatar.className = 'avatar'
        avatar.textContent = character.species === 'Орк' ? '🪓' : '🪲'
        
        const hpBar = document.createElement('div')
        hpBar.className = 'hp-bar'
        
        const hpFill = document.createElement('div')
        hpFill.className = 'hp-fill'
        hpFill.style.width = `${(character.hp / character.maxHp) * 100}%`
        
        const name = document.createElement('div')
        name.className = 'name'
        name.textContent = character.name
        
        hpBar.appendChild(hpFill)
        charElement.appendChild(avatar)
        charElement.appendChild(hpBar)
        charElement.appendChild(name)
        
        battlefield.appendChild(charElement)
        
        yPosition += 100
    })
}
