
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


// // Создаем персонажей на поле боя
// создатьПерсонажей('game-canvas', orc1, orc2, orc3, bug1, bug2)

class Battlefield {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = 1200;
        this.canvas.height = 800;
        this.ctx = this.canvas.getContext('2d');
        this.gridColor = 'rgba(255, 255, 255, 1)';
        this.init();
    }

    init() {
        this.drawGrid();
    }

    drawGrid() {
        this.ctx.strokeStyle = this.gridColor;
        this.ctx.lineWidth = 2;

        // Вертикальные линии
        for (let x = 0; x <= 1200; x += 200) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, 800);
            this.ctx.stroke();
        }

        // Горизонтальные линии
        for (let y = 0; y <= 800; y += 200) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(1200, y);
            this.ctx.stroke();
        }
    }

    drawTeam1(characters) {
        const startX = this.canvas.width * 0.05;
        const startY = this.canvas.height * 0.20;
        const stepY = 250;

        characters.forEach((character, index) => {
            this.drawCharacter(startX, startY + index * stepY, character);
        });
    }

    drawTeam2(characters) {
        const startX = this.canvas.width * 0.95;
        const startY = this.canvas.height * 0.20;
        const stepY = 250;

        characters.forEach((character, index) => {
            this.drawCharacter(startX, startY + index * stepY, character, true);
        });
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
            this.drawOrc(posX, y, size, isEnemy);
        } else {
            this.drawBug(posX, y, size, isEnemy);
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

    drawOrc(x, y, size, isEnemy = false) {
        // Рисуем орка (голова + туловище)
        this.ctx.save();

        // Туловище (эллипс)
        this.ctx.fillStyle = isEnemy ? 'rgba(92, 61, 46, 1)' : 'rgb(25, 121, 67)';
        this.ctx.beginPath();
        this.ctx.ellipse(x, y + size / 2, size / (2 + Math.random()/1.2), size / 2, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Голова (круг)
        this.ctx.beginPath();
        this.ctx.arc(x, y - size / 6, size / 3, 0, Math.PI * 2);
        this.ctx.fill();

        // Волосы (15 треугольников с случайными наклонами)
        this.ctx.fillStyle = 'rgba(30, 30, 30, 1)';
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
            this.ctx.beginPath();
            this.ctx.moveTo(tipX, tipY);
            this.ctx.lineTo(leftX, leftY);
            this.ctx.lineTo(rightX, rightY);
            this.ctx.closePath();
            this.ctx.fill();

            // Добавляем немного текстуры
            if (Math.random() > 0.3) {
                this.ctx.strokeStyle = 'rgba(50, 50, 50, 0.4)';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(tipX, tipY);
                this.ctx.lineTo((leftX + rightX) / 2, (leftY + rightY) / 2);
                this.ctx.stroke();
            }
        }

        // Глаза
        const eyeColor = isEnemy ? 'rgba(255, 70, 70, 1)' : 'rgba(255, 255, 255, 1)';
        this.ctx.fillStyle = eyeColor;
        this.ctx.beginPath();
        let eyePosition1 = 25 *Math.random()/1
        let eyePosition2 =  25*Math.random()/1
        this.ctx.arc(x - eyePosition1, y -3+6*Math.random() - size / 6, 12, 0, Math.PI * 2); // Левый глаз
        this.ctx.arc(x + eyePosition2, y -3+6*Math.random() - size / 6, 12, 0, Math.PI * 2); // Правый глаз
        this.ctx.fill();


        // Брови (злые у врагов)
        this.ctx.strokeStyle = 'rgba(30, 30, 30, 0.9)';
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        // Левая бровь
        this.ctx.moveTo(x - (eyePosition1-5)*2, y - size / 6 - 10);
        this.ctx.lineTo(x - (eyePosition1-5), y - size / 6 - (isEnemy ? 20 : 23));
        // Правая бровь
        this.ctx.moveTo(x + (eyePosition1-5), y - size / 6 - (isEnemy ? 20 : 9.5));
        this.ctx.lineTo(x + (eyePosition2-5)*2, y - size / 6 - 10);
        this.ctx.stroke();


        // Зрачки (смотрят вперёд у игрока, косят у врагов)
        this.ctx.fillStyle = 'rgba(20, 36, 2, 0.9)';
        this.ctx.beginPath();
        // Левый зрачок
        const pupilOffset = isEnemy ? -3 : 2;
        this.ctx.arc(x - eyePosition1 + pupilOffset, y -3+6*Math.random() - size / 6, 5, 0, Math.PI * 2);
        // Правый зрачок
        this.ctx.arc(x + eyePosition2 + pupilOffset, y - size / 6, 5, 0, Math.PI * 2);
        this.ctx.fill();


        // Рот (злой у врагов)
        this.ctx.strokeStyle = 'rgba(104, 9, 9, 0.33)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        if (isEnemy) {
            // Злой оскал
            this.ctx.arc(x, y + size / 12, 15, 0.2 * Math.PI, 0.8 * Math.PI);
            // Зубы
            this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            for (let i = 0; i < 4; i++) {
                const toothX = x - 12 + i * 8;
                this.ctx.fillRect(toothX, y + size / 12 - 5, 4, 5);
            }
        } else {
            // Нейтральный рот
            this.ctx.moveTo(x - 15, y + size / 12);
            this.ctx.lineTo(x + 15, y + size / 12);
        }
        this.ctx.stroke();

        this.ctx.restore();

        // Рисуем топор с видом "анфас" под 45 градусов
        this.ctx.save();

        // Позиция точки крепления топора
        const gripX = isEnemy ? x - 40 : x + 40;  // Смещаем ближе к телу
        const gripY = y + 35;  // Опускаем ниже для лучшего визуала

        this.ctx.translate(gripX, gripY);

        // Наклон 45 градусов (в радианах это Math.PI/4)
        const axeAngle = isEnemy ? +Math.PI / Math.random()*1.2 : -Math.random()*1.2;
        this.ctx.rotate(axeAngle);

        // Ручка топора (3D-вид)
        this.ctx.fillStyle = 'rgba(100, 100, 100, 1)';
        this.ctx.fillRect(0, -4, 80, 8);  // Более толстая и длинная ручка

        // Лезвие топора (вид анфас)
        this.ctx.fillStyle = 'rgba(200, 200, 200, 1)';
        this.ctx.beginPath();
        if (isEnemy) {
            // Лезвие для врага (слева)
            this.ctx.moveTo(-10, -20);
            this.ctx.lineTo(-40, -30);
            this.ctx.lineTo(-40, 30);
            this.ctx.lineTo(-10, 20);
        } else {
            // Лезвие для игрока (справа)
            this.ctx.moveTo(80, -20);
            this.ctx.lineTo(110, -30);
            this.ctx.lineTo(110, 30);
            this.ctx.lineTo(80, 20);
        }
        this.ctx.closePath();
        this.ctx.fill();

        // Детализация лезвия (острие)
        this.ctx.fillStyle = 'rgba(150, 150, 150, 1)';
        this.ctx.beginPath();
        if (isEnemy) {
            this.ctx.moveTo(-40, -30);
            this.ctx.lineTo(-50, 0);
            this.ctx.lineTo(-40, 30);
        } else {
            this.ctx.moveTo(110, -30);
            this.ctx.lineTo(120, 0);
            this.ctx.lineTo(110, 30);
        }
        this.ctx.closePath();
        this.ctx.fill();

        // Текстура рукояти
        this.ctx.strokeStyle = 'rgba(70, 70, 70, 1)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 8; i++) {
            this.ctx.strokeRect(10 * i, -3, 5, 6);
        }

        this.ctx.restore();
    }

    drawBug(x, y, size, isEnemy = false) {
        // Тело
        this.ctx.fillStyle = isEnemy ? 'rgba(93, 64, 55, 1)' : 'rgba(139, 69, 19, 1)';
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Глаза
        this.ctx.fillStyle = isEnemy ? 'rgba(255, 82, 82, 1)' : 'rgba(255, 255, 255, 1)';
        this.ctx.beginPath();
        this.ctx.arc(x - 25, y - 15, 10, 0, Math.PI * 2);
        this.ctx.arc(x + 25, y - 15, 10, 0, Math.PI * 2);
        this.ctx.fill();

        // Усики
        this.ctx.strokeStyle = isEnemy ? 'rgba(78, 52, 46, 1)' : 'rgba(93, 64, 55, 1)';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(x - 25, y - 15);
        this.ctx.lineTo(x - 45, y - 35);
        this.ctx.moveTo(x + 25, y - 15);
        this.ctx.lineTo(x + 45, y - 35);
        this.ctx.stroke();

        // Крылья
        this.ctx.fillStyle = isEnemy ? 'rgba(150, 150, 150, 0.3)' : 'rgba(200, 200, 200, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(x, y - 10, 35, 50, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

// Пример использования:
const battlefield = new Battlefield('battlefield');

// Создаем команды
const team1 = [orc1, orc2, orc3];
const team2 = [bug1, bug2];

// Рисуем команды
battlefield.drawTeam1(team1);
battlefield.drawTeam2(team2);

