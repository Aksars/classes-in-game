class CharacterRenderer {

    static drawOrc(ctx, x, y, size, isEnemy = false) {
        // Рисуем орка (голова + туловище)
        ctx.save();

        // Туловище (эллипс)
        ctx.fillStyle = isEnemy ? 'rgba(92, 61, 46, 1)' : 'rgb(25, 121, 67)';
        ctx.beginPath();
        ctx.ellipse(x, y + size / 2, size / (2 + Math.random() / 1.2), size / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Голова (круг)
        ctx.beginPath();
        ctx.arc(x, y - size / 6, size / 3, 0, Math.PI * 2);
        ctx.fill();

        // Волосы (15 треугольников с случайными наклонами)
        ctx.fillStyle = 'rgba(30, 30, 30, 1)';
        const hairCount = 500;
        const headRadius = size / 2.5;
        const headCenterX = x;
        const headCenterY = y - size / 6;
        const hairLength = size / 2;

        for (let i = 0; i < hairCount; i++) {
            // Угол расположения на голове
            const headAngle = Math.PI + (i / (hairCount - 1)) * Math.PI;

            // Случайный угол наклона волоса (-30° до +30° от вертикали)
            const tiltAngle = (Math.random() - 0.5) * Math.PI / 2;

            // Точка крепления к голове
            const rootX = headCenterX + Math.cos(headAngle) * headRadius * 0.8;
            const rootY = headCenterY + Math.sin(headAngle) * headRadius * 0.8;

            // Кончик волоса (с учетом наклона)
            const tipX = rootX + Math.sin(tiltAngle) * hairLength * (0.8 + Math.random() * 0.5);
            const tipY = rootY - Math.cos(tiltAngle) * hairLength * (0.8 + Math.random() * 0.5);

            // Боковые точки основания (перпендикулярно направлению волоса)
            const perpendicularAngle = tiltAngle + Math.PI / 2;
            const spread = headRadius * 0.15;
            const leftX = rootX + Math.cos(perpendicularAngle) * spread;
            const leftY = rootY + Math.sin(perpendicularAngle) * spread;
            const rightX = rootX - Math.cos(perpendicularAngle) * spread;
            const rightY = rootY - Math.sin(perpendicularAngle) * spread;

            // Рисуем треугольник
            ctx.beginPath();
            ctx.moveTo(tipX, tipY);
            ctx.lineTo(leftX, leftY);
            ctx.lineTo(rightX, rightY);
            ctx.closePath();
            ctx.fill();

            // Добавляем немного текстуры
            if (Math.random() > 0.3) {
                ctx.strokeStyle = 'rgba(50, 50, 50, 0.4)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(tipX, tipY);
                ctx.lineTo((leftX + rightX) / 2, (leftY + rightY) / 2);
                ctx.stroke();
            }
        }

        // Конфигурация лица персонажа
        const FACE_SETTINGS = {
            // Глаза
            eyes: {
                radius: 12,
                baseYOffset: -size / 6,  // Базовое смещение по Y
                yRandomRange: 6,       // Случайное смещение по Y (-3..+3)
                xRandomRange: 25,      // Случайное смещение по X (0..25)
                enemyColor: 'rgba(255, 70, 70, 1)',
                friendColor: 'rgba(255, 255, 255, 1)'
            },

            // Зрачки
            pupils: {
                radius: 5,
                color: 'rgba(20, 36, 2, 0.9)',
                enemyOffset: -3,  // Косоглазие у врагов
                friendOffset: 5    // Смотрят вперед у друзей
            },

            // Брови
            eyebrows: {
                thickness: 6,
                color: 'rgba(30, 30, 30, 0.9)',
                enemyYOffset: 20,
                friendYOffset: 11.5,
                length: size / randomInteger(10,13),
                leftAngle:randomInteger(0,10)<5? randomInteger(-3,-10)/10:randomInteger(0,10)<5?-0.3:0.1,  // Угол наклона левой брови
                rightAngle: 0.2   // Угол наклона правой брови
            }
        };

        // Рассчитываем позиции глаз со случайным смещением
        const leftEyeX = x - (FACE_SETTINGS.eyes.xRandomRange * Math.random());
        const rightEyeX = x + (FACE_SETTINGS.eyes.xRandomRange * Math.random());
        const eyesY = y + FACE_SETTINGS.eyes.baseYOffset +
            (Math.random() * FACE_SETTINGS.eyes.yRandomRange - FACE_SETTINGS.eyes.yRandomRange / 2);

        // Рисуем глаза
        ctx.fillStyle = isEnemy ? FACE_SETTINGS.eyes.enemyColor : FACE_SETTINGS.eyes.friendColor;
        ctx.beginPath();
        ctx.arc(leftEyeX, eyesY, FACE_SETTINGS.eyes.radius, 0, Math.PI * 2);
        ctx.arc(rightEyeX, eyesY, FACE_SETTINGS.eyes.radius, 0, Math.PI * 2);
        ctx.fill();

        // Рисуем зрачки
        const pupilOffset = isEnemy ? FACE_SETTINGS.pupils.enemyOffset : FACE_SETTINGS.pupils.friendOffset;
        ctx.fillStyle = FACE_SETTINGS.pupils.color;
        ctx.beginPath();
        ctx.arc(leftEyeX + pupilOffset, eyesY, FACE_SETTINGS.pupils.radius, 0, Math.PI * 2);
        ctx.arc(rightEyeX + pupilOffset, eyesY, FACE_SETTINGS.pupils.radius, 0, Math.PI * 2);
        ctx.fill();

        // Рисуем брови
        const eyebrowYBase = y + FACE_SETTINGS.eyes.baseYOffset;
        const eyebrowOffset = isEnemy ? FACE_SETTINGS.eyebrows.enemyYOffset : FACE_SETTINGS.eyebrows.friendYOffset;

        ctx.strokeStyle = FACE_SETTINGS.eyebrows.color;
        ctx.lineWidth = FACE_SETTINGS.eyebrows.thickness;
        ctx.beginPath();

        // Левая бровь (наклонная)
        ctx.moveTo(
            leftEyeX - 10 + Math.cos(FACE_SETTINGS.eyebrows.leftAngle) * FACE_SETTINGS.eyebrows.length,
            eyebrowYBase - eyebrowOffset + Math.sin(FACE_SETTINGS.eyebrows.leftAngle) * FACE_SETTINGS.eyebrows.length
        );
        ctx.lineTo(
            leftEyeX - 20,
            eyebrowYBase - 10
        );

        // Правая бровь (наклонная)
        ctx.moveTo(
            rightEyeX - 5,
            eyebrowYBase - eyebrowOffset
        );
        ctx.lineTo(
            rightEyeX + Math.cos(FACE_SETTINGS.eyebrows.rightAngle) * FACE_SETTINGS.eyebrows.length + 5,
            eyebrowYBase - 12 + Math.sin(FACE_SETTINGS.eyebrows.rightAngle) * FACE_SETTINGS.eyebrows.length
        );

        ctx.stroke();


        // Рот (злой у врагов)
        ctx.strokeStyle = 'rgba(104, 9, 9, 0.33)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (isEnemy) {
            // Злой оскал
            ctx.arc(x, y + size / 12, 15, 0.2 * Math.PI, 0.8 * Math.PI);
            // Зубы
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            for (let i = 0; i < 4; i++) {
                const toothX = x - 12 + i * 8;
                ctx.fillRect(toothX, y + size / 12 - 5, 4, 5);
            }
        } else {
            // Нейтральный рот
            ctx.moveTo(x - 15, y + size / 12);
            ctx.lineTo(x + 15, y + size / 12);
        }
        ctx.stroke();

        ctx.restore();

        // Рисуем топор с видом "анфас" под 45 градусов
        ctx.save();

        // Позиция точки крепления топора
        const gripX = isEnemy ? x - 40 : x + 40;  // Смещаем ближе к телу
        const gripY = y + 35;  // Опускаем ниже для лучшего визуала

        ctx.translate(gripX, gripY);

        // Наклон 45 градусов (в радианах это Math.PI/4)
        const axeAngle = isEnemy ? +Math.PI / Math.random() * 1.2 : -Math.random() * 1.2;
        ctx.rotate(axeAngle);

        // Ручка топора (3D-вид)
        ctx.fillStyle = 'rgba(100, 100, 100, 1)';
        ctx.fillRect(0, -4, 80, 8);  // Более толстая и длинная ручка

        // Лезвие топора (вид анфас)
        ctx.fillStyle = 'rgba(200, 200, 200, 1)';
        ctx.beginPath();
        if (isEnemy) {
            // Лезвие для врага (слева)
            ctx.moveTo(-10, -20);
            ctx.lineTo(-40, -30);
            ctx.lineTo(-40, 30);
            ctx.lineTo(-10, 20);
        } else {
            // Лезвие для игрока (справа)
            ctx.moveTo(80, -20);
            ctx.lineTo(110, -30);
            ctx.lineTo(110, 30);
            ctx.lineTo(80, 20);
        }
        ctx.closePath();
        ctx.fill();

        // Детализация лезвия (острие)
        ctx.fillStyle = 'rgba(150, 150, 150, 1)';
        ctx.beginPath();
        if (isEnemy) {
            ctx.moveTo(-40, -30);
            ctx.lineTo(-50, 0);
            ctx.lineTo(-40, 30);
        } else {
            ctx.moveTo(110, -30);
            ctx.lineTo(120, 0);
            ctx.lineTo(110, 30);
        }
        ctx.closePath();
        ctx.fill();

        // Текстура рукояти
        ctx.strokeStyle = 'rgba(70, 70, 70, 1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 8; i++) {
            ctx.strokeRect(10 * i, -3, 5, 6);
        }

        ctx.restore();
    }

    static drawBug(ctx, x, y, size, isEnemy = false) {
        // Тело
        ctx.fillStyle = isEnemy ? 'rgba(93, 64, 55, 1)' : 'rgba(139, 69, 19, 1)';
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Глаза
        ctx.fillStyle = isEnemy ? 'rgba(255, 82, 82, 1)' : 'rgba(255, 255, 255, 1)';
        ctx.beginPath();
        ctx.arc(x - 25, y - 15, 10, 0, Math.PI * 2);
        ctx.arc(x + 25, y - 15, 10, 0, Math.PI * 2);
        ctx.fill();

        // Усики
        ctx.strokeStyle = isEnemy ? 'rgba(78, 52, 46, 1)' : 'rgba(93, 64, 55, 1)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 25, y - 15);
        ctx.lineTo(x - 45, y - 35);
        ctx.moveTo(x + 25, y - 15);
        ctx.lineTo(x + 45, y - 35);
        ctx.stroke();

        // Крылья
        ctx.fillStyle = isEnemy ? 'rgba(150, 150, 150, 0.3)' : 'rgba(200, 200, 200, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x, y - 10, 35, 50, 0, 0, Math.PI * 2);
        ctx.fill();
    }

}

function randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }
  

class Battlefield {

    static instance; // Единственный экземпляр класса допустим и сразу инициализируется и запоминается сюда при вызове конструктора

    constructor(canvasID) {
        if (Battlefield.instance) {
            return Battlefield.instance;
        }
        Battlefield.instance = this;

        // Инициализация canvas
        this.canvas = document.getElementById(canvasID);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1200;
        this.canvas.height = 800;
        this.characters = { friend: [], enemy: [] };
        this.gridColor = 'rgba(255, 255, 255, 1)';
        this._redrawRequested = false;
        this._dirtyTeams = new Set();
    }

    // Регистрация нового персонажа
    registerCharacter(character) {
        // ведем учет персонажей на поле в поле класса characters
        this.characters[character.team].push(character);
        this.redrawTeam(character.team);
    }

    // Перерисовка команды
    requestRedraw(team) {
        this._dirtyTeams.add(team);

        if (!this._redrawRequested) {
            this._redrawRequested = true;
            requestAnimationFrame(() => {
                this._dirtyTeams.forEach(team => this.redrawTeam(team));
                this._dirtyTeams.clear();
                this._redrawRequested = false;
            });
        }
    }

    requestCharacterRedraw(character) {
        if (!this._redrawRequested) {
            this._redrawRequested = true;
            requestAnimationFrame(() => {
                this.redrawSingleCharacter(character);
                this._redrawRequested = false;
            });
        }
    }

    redrawSingleCharacter(character) {
        const isEnemy = character.team === "enemy";
        const team = this.characters[character.team];
        const index = team.indexOf(character);
        
        if (index === -1) return;

        const startX = isEnemy ? this.canvas.width * 0.95 : this.canvas.width * 0.05;
        const startY = this.canvas.height * 0.20;
        const stepY = 250;

        // Очищаем только область этого персонажа
        this.clearCharacterArea(
            startX,
            startY + index * stepY,
            character
        );

        // Перерисовываем только этого персонажа
        this.drawCharacter(
            startX,
            startY + index * stepY,
            character,
            isEnemy
        );
        
        character._dirty = false;
        
    }

    clearCharacterArea(x, y, character) {
        const size = 140; // Должно соответствовать вашему размеру персонажа
        const clearWidth = size * 1.5;
        const clearHeight = size * 1.5;
        
        this.ctx.save();
        this.ctx.clearRect(
            x - clearWidth/2,
            y - clearHeight/2,
            clearWidth,
            clearHeight
        );
        this.ctx.restore();
        
        // Восстанавливаем сетку в очищенной области
        this.drawGridInArea(
            x - clearWidth/2,
            y - clearHeight/2,
            clearWidth,
            clearHeight
        );
    }



    redrawTeam(team) {
        const isEnemy = team === "enemy";
        const startX = isEnemy ? this.canvas.width * 0.95 : this.canvas.width * 0.05;
        const startY = this.canvas.height * 0.20;
        const stepY = 250;

        // Исправлено: обращаемся напрямую к массиву characters[team]
        const needClear = this.characters[team].some(c => c._dirty);
        if (needClear) {
            this.clearTeamArea(isEnemy);
        }

        this.characters[team].forEach((character, index) => {
            if (character._dirty || needClear) {
                this.drawCharacter(
                    startX,
                    startY + index * stepY,
                    character,
                    isEnemy
                );
                character._dirty = false;
            }
        });
    }

    clearTeamArea(isEnemy) {
        const startX = isEnemy ? this.canvas.width * 0.7 : 0;
        const width = this.canvas.width * 0.3;

        // Сохраняем текущие настройки контекста
        this.ctx.save();

        // Очищаем область
        this.ctx.clearRect(startX, 0, width, this.canvas.height);

        // Восстанавливаем настройки
        this.ctx.restore();

        // Перерисовываем сетку только в очищенной области
        this.drawGridInArea(startX, 0, width, this.canvas.height);
    }

    drawGridInArea(x, y, width, height) {
        this.ctx.save();
        this.ctx.strokeStyle = this.gridColor;
        this.ctx.lineWidth = 2;

        // Вертикальные линии
        const firstVertical = Math.max(0, Math.floor(x / 200) * 200);
        for (let lineX = firstVertical; lineX < x + width; lineX += 200) {
            if (lineX > x && lineX < x + width) {
                this.ctx.beginPath();
                this.ctx.moveTo(lineX, y);
                this.ctx.lineTo(lineX, y + height);
                this.ctx.stroke();
            }
        }

        // Горизонтальные линии
        const firstHorizontal = Math.max(0, Math.floor(y / 200) * 200);
        for (let lineY = firstHorizontal; lineY < y + height; lineY += 200) {
            if (lineY > y && lineY < y + height) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, lineY);
                this.ctx.lineTo(x + width, lineY);
                this.ctx.stroke();
            }
        }

        this.ctx.restore();
    }


    drawCharacter(x, y, character, isEnemy = false) {
        // Константы для настройки полоски HP
        const HP_BAR_WIDTH_PERCENT = 82; // % от размера персонажа
        const HP_BAR_HEIGHT = 20;        // Высота полоски в пикселях
        const HP_BAR_Y_OFFSET = 90;      // Отступ сверху от центра персонажа
        const NAME_Y_OFFSET = 1.35;       // Множитель для позиционирования имени

        const size = 140;
        const posX = isEnemy ? x - 100 : x + 100;

        // Рассчитываем размеры полоски HP
        const hpBarWidth = size * (HP_BAR_WIDTH_PERCENT / 100);
        const hpBarX = posX - hpBarWidth / 2;
        const hpBarY = y - HP_BAR_Y_OFFSET;

        // Рисуем персонажа
        if (character.species === 'Орк') {
            CharacterRenderer.drawOrc(this.ctx, posX, y, size, isEnemy);
        } else {
            CharacterRenderer.drawBug(this.ctx, posX, y, size, isEnemy);
        }

        // Имя персонажа
        this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        this.ctx.font = 'bold 19px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(character.name, posX, y - size / NAME_Y_OFFSET);

        // Полоска HP (фон)
        this.ctx.fillStyle = 'rgba(51, 51, 51, 1)';
        this.ctx.fillRect(hpBarX, hpBarY, hpBarWidth, HP_BAR_HEIGHT);

        // Полоска HP (заполнение)
        const currentHpWidth = (character.hp / character.maxHp) * hpBarWidth;
        this.ctx.fillStyle = character.hp > character.maxHp * 0.8 ? 'rgb(36, 218, 43)' :
            character.hp > character.maxHp * 0.33 ? 'rgba(255, 193, 7, 1)' :
                'rgba(244, 67, 54, 1)';
        this.ctx.fillRect(hpBarX, hpBarY, currentHpWidth, HP_BAR_HEIGHT);
    }

}


class Character {
    constructor(name, phrase, hp, attack, team) {
        this.name = name
        this.phrase = phrase
        this._hp = hp
        this.maxHp = hp
        this.attack = attack
        if (team == "friend" || team == "enemy")
            this.team = team
        else
            throw new Error("Неверная команда!")

        this._dirty = true; // Флаг необходимости перерисовки
    }

    get hp() {
        return this._hp;
    }

    set hp(value) {
        if (value !== this._hp) {
            this._hp = Math.max(0, Math.min(value, this.maxHp));
            this._dirty = true;
            Battlefield.instance.requestCharacterRedraw(this);
        }
    }
}

class Orc extends Character {
    constructor(name, phrase, hp, attack, team = "friend") {
        super(name, phrase, hp, attack, team)
        this.species = "Орк"
        this.level = 1

        // Регестрируем персонажа только когда он полностью получил все характеристики
        Battlefield.instance.registerCharacter(this)
    }
    sayPhrase = () => console.log(this.phrase)
    battleCry = () => console.log("ЛОК'ТАР ОГАР!")
}

class Bug extends Character {
    constructor(name, phrase, hp, attack, team = "friend") {
        super(name, phrase, hp, attack, team)
        this.species = "Жук"
        this.level = 1

        // Регестрируем персонажа только когда он полностью получил все характеристики
        Battlefield.instance.registerCharacter(this)
    }

    hide = () => console.log("Прячемся! *становиться невидимым*")
}

const battlefield = new Battlefield('battlefield');


// Создаем персонажей
const orc1 = new Orc("Гром'Аш", "За Орду!", 250, 7)
const orc2 = new Orc("Разогр", "Опять работать!", 100, 4)
const orc3 = new Orc("Гаррош 2", "Я принёс только смерть!", 150, 5)

const orc4 = new Orc("Гаррош 2", "Я принёс только смерть!", 150, 5, "enemy")
const bug1 = new Bug("Жучара", "---------*зловеще молчит*----------", 50, 3, "enemy")
const bug2 = new Bug("Васян", "*ZZZZZZZZZZZZZZZZZZZ*", 50, 3, "enemy")

