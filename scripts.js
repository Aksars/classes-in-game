class CharacterRenderer {

    static drawOrc(ctx, x, y, size, isEnemy = false) {
        ctx.save();

        // Цветовые настройки
        const colors = {
            body: isEnemy ? 'rgba(92, 61, 46, 1)' : 'rgb(25, 121, 67)',
            hair: 'rgba(30, 30, 30, 1)',
            eyeWhite: isEnemy ? 'rgba(255, 70, 70, 1)' : 'rgba(255, 255, 255, 1)',
            pupil: 'rgba(20, 36, 2, 0.9)',
            eyebrow: 'rgba(30, 30, 30, 0.9)',
            mouth: 'rgba(104, 9, 9, 0.33)',
            teeth: 'rgba(255, 255, 255, 1)',
            axeHandle: 'rgba(100, 100, 100, 1)',
            axeBlade: 'rgba(200, 200, 200, 1)',
            axeEdge: 'rgba(150, 150, 150, 1)',
            axeTexture: 'rgba(70, 70, 70, 1)'
        };

        // Основные части орка
        this.drawBody(ctx, x, y, size, colors.body);
        this.drawHead(ctx, x, y, size, colors.body); // Голова того же цвета, что и тело
        this.drawHair(ctx, x, y, size, colors.hair);

        // Детали лица        
        this.drawFaceFeatures(ctx, x, y, size, isEnemy);        
        this.drawMouth(ctx, x, y-5, size, isEnemy)

        // Оружие
        this.drawMace(ctx, x, y, isEnemy, colors.axeHandle, colors.axeBlade, colors.axeEdge, colors.axeTexture);

        ctx.restore();
    }

    static drawBody(ctx, x, y, size, bodyColor) {
        // Туловище (эллипс)
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(x, y + size / 2, size / (2 + Math.random() / 1.2), size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    static drawHead(ctx, x, y, size, headColor) {
        // Голова (круг)
        ctx.fillStyle = headColor;
        ctx.beginPath();
        ctx.arc(x, y - size / 6, size / 3, 0, Math.PI * 2);
        ctx.fill();
    }

    static drawHair(ctx, x, y, size, hairColor) {
        // Волосы (500 треугольников с случайными наклонами)
        ctx.fillStyle = hairColor;
        const hairCount = 500;
        const headRadius = size / 2.5;
        const headCenterX = x;
        const headCenterY = y - size / 6;
        const hairLength = size / 2;

        for (let i = 0; i < hairCount; i++) {
            const headAngle = Math.PI + (i / (hairCount - 1)) * Math.PI;
            const tiltAngle = (Math.random() - 0.5) * Math.PI / 2;

            // Точка крепления к голове
            const rootX = headCenterX + Math.cos(headAngle) * headRadius * 0.8;
            const rootY = headCenterY + Math.sin(headAngle) * headRadius * 0.8;

            // Кончик волоса
            const tipX = rootX + Math.sin(tiltAngle) * hairLength * (0.8 + Math.random() * 0.5);
            const tipY = rootY - Math.cos(tiltAngle) * hairLength * (0.8 + Math.random() * 0.5);

            // Боковые точки основания
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

            // Текстура волос
            if (Math.random() > 0.3) {
                ctx.strokeStyle = 'rgba(50, 50, 50, 0.4)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(tipX, tipY);
                ctx.lineTo((leftX + rightX) / 2, (leftY + rightY) / 2);
                ctx.stroke();
            }
        }
    }

    static drawFaceFeatures(ctx, x, y, size, isEnemy) {
        // Конфигурация лица (перенесено из оригинального кода)
        const FACE_SETTINGS = {
            eyes: {
                radius: 12,
                baseYOffset: -size / 6,
                yRandomRange: this.randomInteger(1,6),
                xRandomRange: this.randomInteger(15,25),
                enemyColor: 'rgba(255, 70, 70, 1)',
                friendColor: 'rgba(255, 255, 255, 1)'
            },
            pupils: {
                radius: this.randomInteger(0,14)<3?2: this.randomInteger(3,4),
                color: 'rgba(20, 36, 2, 0.9)',
                enemyOffset: -3,
                friendOffset: 5
            },
            eyebrows: {
                thickness: 6,
                color: 'rgba(30, 30, 30, 0.9)',
                enemyYOffset: 20,
                friendYOffset: 11.5,
                length: size / this.randomInteger(10, 13),
                leftAngle: this.randomInteger(0, 10) < 5 ? 
                         this.randomInteger(-3, -10) / 10 : 
                         this.randomInteger(0, 10) < 5 ? -0.3 : 0.1,
                rightAngle: 0.2
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
    }

    static drawMouth(ctx, x, y, size, isEnemy) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.33)';
        ctx.lineWidth = 2;
        ctx.beginPath();

        if (isEnemy) {
            // Злой оскал
            const mouthCenterY = y + size / 12 - 15;
            const mouthRadius = 15;
            const mouthStartAngle = 0.2 * Math.PI;
            const mouthEndAngle = 0.8 * Math.PI;
            
            // Рисуем дугу рта
            ctx.beginPath();
            ctx.arc(x, mouthCenterY, mouthRadius, mouthStartAngle, mouthEndAngle);
            ctx.stroke();
            
            // Рисуем зубы по дуге
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            const toothCount = 4; // Количество зубов
            const angleStep = (mouthEndAngle - mouthStartAngle) / (toothCount - 1);
            
            for (let i = 0; i < toothCount; i++) {
                const angle = mouthStartAngle + i * angleStep;
                const toothX = x + Math.cos(angle) * mouthRadius;
                const toothY = mouthCenterY + Math.sin(angle) * mouthRadius;
                
                // Поворачиваем зубы по касательной к дуге
                ctx.save();
                ctx.translate(toothX, toothY);
                ctx.rotate(angle + Math.PI/3); // Поворачиваем на 90° к углу дуги
                
                // Рисуем зуб 
                ctx.beginPath();
                ctx.moveTo(-3, 0);
                ctx.lineTo(2, 0);
                ctx.lineTo(0, -7); // Острый конец зуба
                ctx.closePath();
                ctx.fill();
                
                ctx.restore();
            }
        } else {
            // Нейтральный рот (как было)
            ctx.moveTo(x - 15, y + size / 12);
            ctx.lineTo(x + 15, y + size / 12);
        }
        ctx.stroke();
    }

    static drawMace(ctx, x, y, isEnemy) {
        ctx.save();

        const gripX = isEnemy ? x - 40 : x + 40;
        const gripY = y + 35;
        ctx.translate(gripX, gripY);

        const axeAngle = isEnemy ? +Math.PI / Math.random() * 1.2 : -Math.random() * 1.2;
        ctx.rotate(axeAngle);

        // Ручка топора
        ctx.fillStyle = 'rgba(100, 100, 100, 1)';
        ctx.fillRect(0, -4, 80, 8);

        // Лезвие топора
        ctx.fillStyle = 'rgba(200, 200, 200, 1)';
        ctx.beginPath();
        if (isEnemy) {
            ctx.moveTo(-10, -20);
            ctx.lineTo(-40, -30);
            ctx.lineTo(-40, 30);
            ctx.lineTo(-10, 20);
        } else {
            ctx.moveTo(80, -20);
            ctx.lineTo(110, -30);
            ctx.lineTo(110, 30);
            ctx.lineTo(80, 20);
        }
        ctx.closePath();
        ctx.fill();

        // Острие лезвия
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

    static randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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


class Battlefield {
    static instance;

    constructor(canvasID) {
        if (Battlefield.instance) return Battlefield.instance;
        Battlefield.instance = this;

        // Основной canvas
        this.canvas = document.getElementById(canvasID);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1200;
        this.canvas.height = 800;

        // Контейнер для персонажей
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.canvas.parentElement.appendChild(this.container);

        this.gridColor = 'rgba(255, 255, 255, 1)';

        this.characters = { friend: [], enemy: [] };
        this._characterCanvases = new Map();
        this.drawGrid();
    }

    registerCharacter(character) {
        this.characters[character.team].push(character);

        // Создаем canvas для персонажа
        const charCanvas = document.createElement('canvas');
        charCanvas.width = 400;
        charCanvas.height = 300;
        charCanvas.style.position = 'absolute';
        charCanvas.style.zIndex = '10';
        this.container.appendChild(charCanvas);

        this._characterCanvases.set(character, {
            canvas: charCanvas,
            ctx: charCanvas.getContext('2d')
        });

        this.updateCharacterPosition(character);
        this.redrawCharacter(character);
    }

    updateCharacterPosition(character) {
        const teamArray = this.characters[character.team];
        const index = teamArray.indexOf(character);
        const isEnemy = character.team === "enemy";

        const x = isEnemy ? this.canvas.width * 0.95 - 100 : this.canvas.width * 0.05 + 100;
        const y = 150 + index * 250;

        const charData = this._characterCanvases.get(character);
        charData.canvas.style.left = `${x - 100}px`;
        charData.canvas.style.top = `${y - 150}px`;
    }

    redrawCharacter(character) {
        const charData = this._characterCanvases.get(character);
        if (!charData) return;

        const { ctx, canvas } = charData;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Центральные координаты в canvas персонажа
        const centerX = 100;
        const centerY = 150;
        const size = 140;

        if (character.species === 'Орк') {
            CharacterRenderer.drawOrc(ctx, centerX, centerY, size, character.team === "enemy");
        } else {
            CharacterRenderer.drawBug(ctx, centerX, centerY, size, character.team === "enemy");
        }

        // Отрисовка HP и имени
        this.drawCharacterUI(ctx, character, centerX, centerY, size);
    }

    drawCharacterUI(ctx, character, x, y, size) {
        // Полоска HP
        const hpBarWidth = size * 0.82;
        const hpBarHeight = 20;
        const hpBarY = y - 90;

        // Фон HP
        ctx.fillStyle = 'rgba(51, 51, 51, 1)';
        ctx.fillRect(x - hpBarWidth / 2, hpBarY, hpBarWidth, hpBarHeight);

        // Заполнение HP
        const currentHp = (character.hp / character.maxHp) * hpBarWidth;
        ctx.fillStyle = character.hp > character.maxHp * 0.8 ? 'rgb(36, 218, 43)' :
            character.hp > character.maxHp * 0.33 ? 'rgba(255, 193, 7, 1)' :
                'rgba(244, 67, 54, 1)';
        ctx.fillRect(x - hpBarWidth / 2, hpBarY, currentHp, hpBarHeight);

        // Имя
        ctx.fillStyle = 'white';
        ctx.font = 'bold 19px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(character.name, x, y - size / 1.35);
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
}


class Character {
    constructor(name, phrase, hp, attack, team) {
        this.name = name;
        this.phrase = phrase;
        this._hp = hp;
        this.maxHp = hp;
        this.attack = attack;
        this.team = team === "friend" || team === "enemy" ? team :
            (() => { throw new Error("Неверная команда!") })
        this._dirty = true;
    }

    get hp() { return this._hp; }

    set hp(value) {
        const newHp = Math.max(0, Math.min(value, this.maxHp));
        if (newHp !== this._hp) {
            this._hp = newHp;
            this._dirty = true;
            Battlefield.instance.redrawCharacter(this);
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

