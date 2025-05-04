class MathUtils {
    static randomInteger(min, max) {
        if (min > max) [min, max] = [max, min]; // Автокоррекция
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

class ColorHelper {

    /**
     * Возвращает промежуточный цвет между двумя цветами с поддержкой прозрачности
     * @param {string} color1 - Цвет в формате "rgb(R,G,B)" или "rgba(R,G,B,A)"
     * @param {string} color2 - Цвет в формате "rgb(R,G,B)" или "rgba(R,G,B,A)"
     * @param {number} percent - Процент смещения к color2 (0-100)
     * @returns {string} Промежуточный цвет в формате "rgba(R,G,B,A)"
     */
    static betweenColors(color1, color2, percent) {
        // Функция для нормализации цвета в RGBA
        const normalizeToRGBA = (color) => {
            // Если уже RGBA
            const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
            if (rgbaMatch) {
                return [
                    parseInt(rgbaMatch[1]),
                    parseInt(rgbaMatch[2]),
                    parseInt(rgbaMatch[3]),
                    parseFloat(rgbaMatch[4])
                ];
            }

            // Если RGB - добавляем alpha=1
            const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgbMatch) {
                return [
                    parseInt(rgbMatch[1]),
                    parseInt(rgbMatch[2]),
                    parseInt(rgbMatch[3]),
                    1.0
                ];
            }

            // Если формат не распознан - возвращаем черный с прозрачностью 1
            return [0, 0, 0, 1];
        };

        // Нормализуем оба цвета
        const [r1, g1, b1, a1] = normalizeToRGBA(color1);
        const [r2, g2, b2, a2] = normalizeToRGBA(color2);

        // Нормализуем процент
        const normalizedPercent = Math.min(100, Math.max(0, percent)) / 100;

        // Вычисляем промежуточные значения
        const r = Math.round(r1 + (r2 - r1) * normalizedPercent);
        const g = Math.round(g1 + (g2 - g1) * normalizedPercent);
        const b = Math.round(b1 + (b2 - b1) * normalizedPercent);
        const a = a1 + (a2 - a1) * normalizedPercent;

        // Ограничиваем alpha диапазоном 0-1 и фиксируем 2 знака после запятой
        const clampedAlpha = Math.min(1, Math.max(0, a));
        return `rgba(${r}, ${g}, ${b}, ${clampedAlpha.toFixed(2)})`;
    }

    // Добавляем прозрачность в цвет:
    static adjustColorAlpha(rgbaColor, newAlpha) {
        // Если цвет в формате rgb, преобразуем в rgba
        if (rgbaColor.startsWith('rgb(')) {
            return rgbaColor.replace('rgb(', 'rgba(').replace(')', `, ${newAlpha})`);
        }

        // Если уже rgba, просто меняем alpha-канал
        return rgbaColor.replace(/[\d.]+\)$/, `${newAlpha})`);
    }
}


class GraphicsHelper {
    /**
     * Рисует линию с центром в указанных координатах.
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x - Центр по X
     * @param {number} y - Центр по Y
     * @param {object} params - Параметры линии {angle, length, thickness, xOffset, yOffset}
     * @param {string} color - Цвет линии
     */
    static drawCenteredLine(ctx, x, y, params, color) {
        const centerX = x + params.xOffset;
        const centerY = y + params.yOffset;
        const angleRad = params.angle * Math.PI / 180;
        const halfLength = params.length / 2;

        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = params.thickness;
        ctx.beginPath();
        ctx.moveTo(
            centerX - Math.cos(angleRad) * halfLength,
            centerY - Math.sin(angleRad) * halfLength
        );
        ctx.lineTo(
            centerX + Math.cos(angleRad) * halfLength,
            centerY + Math.sin(angleRad) * halfLength
        );
        ctx.stroke();
        ctx.restore();
    }
}


class OrcAppearance {
    constructor(size = 140, isEnemy = false, level) {
        this.size = size;
        this.isEnemy = isEnemy;

        this.emotionChances = {
            calm: {
                weight: 4,
            },
            angry: {
                weight: 2,
            },
            sruprised: {
                weight: 3,
            }
        };

        this.emotion = this.getRandomEmotion(this.emotionChances)
        this.oneEye = Math.random() < 4 / 23;

        this.generateColors(level, isEnemy)
        this.generateBody();
        this.generateFace();
        this.generateHair();
        this.generateWeapon();
    }

    generateColors(level, isEnemy) {

        // Цвет волос на основе уровня
        const hairColor = this.calculateHairColor(level)
        // Цвета бровей и зрачков на основе цвета волос   
        const eyebrowColor = this.getEyebrowColor(hairColor);
        const pupilColor = this.getPupilColor(hairColor);
        // Цвет тела случано в промежутках
        const friendColor = ColorHelper.betweenColors('rgb(39, 149, 86)', 'rgb(8, 92, 43)', MathUtils.randomInteger(1, 100));
        const enemyColor = ColorHelper.betweenColors('rgb(92, 61, 46)', 'rgb(132, 38, 20)', MathUtils.randomInteger(1, 100));

        this.colors = {
            body: isEnemy ? enemyColor : friendColor,
            hair: hairColor,
            eyeWhite: isEnemy ? 'rgba(255, 70, 70, 1)' : 'rgba(255, 255, 255, 1)',
            pupil: pupilColor, //'rgba(20, 36, 2, 0.9)',
            eyebrow: eyebrowColor,
            mouth: 'rgba(104, 9, 9, 0.33)',
            teeth: 'rgba(255, 255, 255, 1)',
            weapon: {
                handle: 'rgba(100, 100, 100, 1)',
                blade: 'rgba(200, 200, 200, 1)',
                edge: 'rgba(150, 150, 150, 1)',
                texture: 'rgba(70, 70, 70, 1)'
            }
        };
    }
    // Цвет бровей -- цвет волос только на 0.15 прозрачнее
    getPupilColor(hairColor) {
        return ColorHelper.betweenColors(hairColor, 'rgb(20, 36, 2)', 65);
    }
    // Цвет глаз -- цвет волос только на 0.05 прозрачнее
    getEyebrowColor(hairColor) {
        return ColorHelper.adjustColorAlpha(hairColor, 0.85)
    }

    // Метод для расчета цвета волос в зависимости от уровня
    calculateHairColor(level) {
        if (level >= 100) return 'rgba(255, 255, 255, 1)'; // Белоснежные для 100+ уровня

        // без прозрачности
        const hairColorPresets = {
            colorStop1: 'rgb(60, 40, 4)',       // Уровень 1
            colorStop2: 'rgb(210, 180, 60)',     // Уровень 30
            colorStop3: 'rgb(180, 65, 30)',      // Уровень 50
            colorStop4: 'rgb(19, 109, 227))',    // Уровень 51
            colorStop5: 'rgb(255, 255, 255)'     // Уровень 100+
        };

        // Цветовые точки для градиента
        const colorStops = [
            { level: 1, color: parseRgba(hairColorPresets.colorStop1) },
            { level: 30, color: parseRgba(hairColorPresets.colorStop2) },
            { level: 50, color: parseRgba(hairColorPresets.colorStop3) },
            { level: 51, color: parseRgba(hairColorPresets.colorStop4) },
            { level: 100, color: parseRgba(hairColorPresets.colorStop5) }
        ];

        // Вспомогательная функция создает массив из трех значений
        function parseRgba(rgbaStr) {
            const parts = rgbaStr.match(/[\d.]+/g);
            return [parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2])];
        }

        // Находим между какими точками находится текущий уровень
        let startStop, endStop;
        for (let i = 0; i < colorStops.length - 1; i++) {
            if (level >= colorStops[i].level && level <= colorStops[i + 1].level) {
                startStop = colorStops[i];
                endStop = colorStops[i + 1];
                break;
            }
        }


        // Если уровень выше максимального (но меньше 100)
        if (!startStop) {
            startStop = colorStops[colorStops.length - 2];
            endStop = colorStops[colorStops.length - 1];
        }

        // Рассчитываем промежуточный цвет
        const ratio = (level - startStop.level) / (endStop.level - startStop.level);
        const r = Math.round(startStop.color[0] + (endStop.color[0] - startStop.color[0]) * ratio);
        const g = Math.round(startStop.color[1] + (endStop.color[1] - startStop.color[1]) * ratio);
        const b = Math.round(startStop.color[2] + (endStop.color[2] - startStop.color[2]) * ratio);

        return `rgba(${r}, ${g}, ${b}, 1)`;
    }

    generateBody() {
        this.body = {
            bodyColor: this.colors.body,
            bodyWidth: (2 + Math.random() / 1.2)
        };
    }

    generateWeapon() {
        this.weapon = {
            type: 'mace',
            offsetX: this.isEnemy ? 0 : MathUtils.randomInteger(-10, 2),
            offsetY: this.isEnemy ? 0 : MathUtils.randomInteger(10, 25),
            angle: this.isEnemy ? +Math.PI / Math.random() * 1.2 : -Math.random() * 1.2,
            colors: this.colors.weapon
        };
    }

    generateHair() {
        this.hair = {
            color: this.colors.hair,
            count: MathUtils.randomInteger(500, 800)
        };
    }

    generateFace() {
        this.face = {
            oneEye: this.oneEye,
            eyes: this.generateEyes(),
            pupils: this.generatePupils(),
            eyebrows: this.generateEyebrows(),
            mouth: this.generateMouth()
        };
    }

    generateEyes() {
        //console.log(this.emotion)
        let xRandomRange = 0

        if (this.emotion === "calm") {
            xRandomRange = this.oneEye ? 0 : MathUtils.randomInteger(8, 25)
        }
        if (this.emotion === "sruprised") {
            xRandomRange = this.oneEye ? 0 : MathUtils.randomInteger(13, 25)
        }
        if (this.emotion === "angry") {
            xRandomRange = this.oneEye ? 0 : MathUtils.randomInteger(11, 25)
        }
        if (this.emotion === "damaged") {
            xRandomRange = this.oneEye ? 0 : MathUtils.randomInteger(11, 25)
        }

        return {
            radius: this.oneEye ? 14 : 12,
            baseYOffset: -this.size / 6,
            yRandomRange: this.oneEye ? 0 : MathUtils.randomInteger(-3, 3),
            xRandomRange: xRandomRange,
            color: this.colors.eyeWhite
        };
    }

    generatePupils() {
        return {
            radius: this.oneEye ? 4 :
                (MathUtils.randomInteger(1, 20) < 3 ? 2.5 : MathUtils.randomInteger(3, 4)),
            offset: this.isEnemy ? -3 : 5,
            verticalOffset: MathUtils.randomInteger(1, 20) < 8 ? 0 : MathUtils.randomInteger(-4, 4),
            color: this.colors.pupil
        };
    }


    getRandomEmotion(emotionChances) {
        const totalWeight = Object.values(emotionChances).reduce((sum, e) => sum + e.weight, 0);
        let random = Math.random() * totalWeight;

        for (const [emotion, config] of Object.entries(emotionChances)) {
            if (random < config.weight) return emotion;
            random -= config.weight;
        }

        return 'calm';
    }

    generateEyebrows() {

        let leftAngle = 0
        let rightAngle = 0
        let xOffsetL = 0
        let yOffsetL = 0
        let xOffsetR = 0
        let yOffsetR = 0
        let thickness = MathUtils.randomInteger(4, 6)


        if (this.emotion === "calm") {
            leftAngle = MathUtils.randomInteger(-12, 12)
            rightAngle = MathUtils.randomInteger(-12, 12)
            xOffsetL = 0
            yOffsetL = 0
            xOffsetR = 0
            yOffsetR = 0
            thickness = thickness
        }
        if (this.emotion === "sruprised") {
            leftAngle = MathUtils.randomInteger(-15, -30)
            rightAngle = MathUtils.randomInteger(-5, -10)
            xOffsetL = -5
            yOffsetL = MathUtils.randomInteger(-5, -10)
            xOffsetR = -3
            yOffsetR = -3
            thickness = thickness
        }
        if (this.emotion === "angry") {
            leftAngle = MathUtils.randomInteger(15, 23)
            rightAngle = -leftAngle
            xOffsetL = 2
            yOffsetL = MathUtils.randomInteger(-1, -3)
            xOffsetR = -2
            yOffsetR = -3
            thickness = thickness
        }
        if (this.emotion === "damaged") {
            leftAngle = MathUtils.randomInteger(15, 30)
            rightAngle = -leftAngle + MathUtils.randomInteger(-5, 5)
            xOffsetL = 2
            yOffsetL = MathUtils.randomInteger(-1, -3)
            xOffsetR = -2
            yOffsetR = -0
            thickness = thickness + 1
        }


        const length = this.size / 6
        return {

            left: {
                angle: leftAngle,  // Угол
                length: length,    // Длина брови
                thickness: thickness,       // Толщина брови
                xOffset: 0 + xOffsetL,     // Сдвиг влево-вправо
                yOffset: 0 + yOffsetL,     // Сдвиг вверх-вниз
            },
            right: {
                angle: rightAngle,
                length: length,
                thickness: thickness,
                xOffset: 0 + xOffsetR,     // Сдвиг влево-вправо
                yOffset: 0 + yOffsetR,     // Сдвиг вверх-вниз
            },
            single: {
                angle: 5,
                length: length * 1.6,
                thickness: thickness + 2,
                xOffset: 0,
                yOffset: MathUtils.randomInteger(2, -6),
            },

            color: this.colors.eyebrow

        };
    }

    generateMouth() {

        let thickness = 2
        let yOffset = MathUtils.randomInteger(1, -2)
        let xOffset = MathUtils.randomInteger(2, -2)

        if (this.emotion === "calm") {

        }
        if (this.emotion === "sruprised") {

        }
        if (this.emotion === "angry") {

        }
        if (this.emotion === "damaged") {
            thickness = 3
            yOffset = MathUtils.randomInteger(-1, -2)
        }

        return {
            type: this.isEnemy ? 'aggressive' : 'neutral',
            color: this.colors.mouth,
            teethColor: this.colors.teeth,
            yOffset: yOffset,
            xOffset: xOffset,
            thickness: thickness
        };
    }

    regenerateFace() {
        //this.oneEye = Math.random() < 4 / 23;        
        this.face.eyes = this.generateEyes()
        this.face.pupils = this.generatePupils()
        this.face.eyebrows = this.generateEyebrows()
        this.face.mouth = this.generateMouth()
    }
    regenerateHair(level) {
        let newColor = this.calculateHairColor(level)
        this.colors.hair = newColor
        this.hair.color = newColor
        this.colors.eyebrow = this.getEyebrowColor(newColor)
        this.colors.pupil = this.getPupilColor(newColor)
        console.log()
        // this.generateHair()
        this.face.eyebrows = this.generateEyebrows()
        this.face.pupils = this.generatePupils()
    }
}

class CharacterRenderer {
    static drawCharacter(ctx, x, y, appearance, species) {
        const renderer = this.getRenderer(species);
        renderer.draw(ctx, x, y, appearance);
    }

    static getRenderer(species) {
        switch (species) {
            case 'Орк': return OrcRenderer;
            case 'Жук': return BugRenderer;
            default: throw new Error(`Unknown species: ${species}`);
        }
    }

    // Базовые методы, которые должны определить наследники
    static draw(ctx, x, y, character) {
        // Общая логика рисования персонажа (должна переопределяться)
        throw new Error('Общая логика рисования персонажа must be implemented in subclass');
    }

    static drawBodyParts(ctx, x, y, character) {
        // Логика рисования тела (должна переопределяться)
        throw new Error('Общая логика рисования тела must be implemented in subclass');
    }

    static drawFacialFeatures(ctx, x, y, character) {
        // Логика рисования лица (должна переопределяться)
        throw new Error('Общая логика рисования лица must be implemented in subclass');
    }

}

class OrcRenderer extends CharacterRenderer {
    static draw(ctx, x, y, appearance) {
        ctx.save();
        this.drawBodyParts(ctx, x, y, appearance);
        this.drawFace(ctx, x, y, appearance);
        this.drawHair(ctx, x, y, appearance);
        this.drawMace(ctx, x, y, appearance)
        ctx.restore();
    }
    // Тело    
    static drawBodyParts(ctx, x, y, appearance) {
        this.drawBody(ctx, x, y, appearance);
        this.drawHead(ctx, x, y, appearance);
    }

    static drawFace(ctx, x, y, appearance) {
        this.drawEyes(ctx, x, y, appearance);
        this.drawEyebrows(ctx, x, y, appearance);
        this.drawMouth(ctx, x, y, appearance);
    }

    static drawBody(ctx, x, y, appearance) {
        const size = appearance.size
        const bodyWidth = appearance.body.bodyWidth
        ctx.fillStyle = appearance.body.bodyColor;
        ctx.beginPath();
        ctx.ellipse(x, y + size / 2, size / bodyWidth, size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    static drawHead(ctx, x, y, appearance) {
        const size = appearance.size
        ctx.fillStyle = appearance.body.bodyColor;
        ctx.beginPath();
        ctx.arc(x, y - size / 6, size / 3, 0, Math.PI * 2);
        ctx.fill();
    }

    static drawHair(ctx, x, y, appearance) {
        const size = appearance.size

        ctx.fillStyle = appearance.hair.color;
        const hairCount = 500;
        const headRadius = size / 2.5;
        const headCenterX = x;
        const headCenterY = y - size / 6;
        const hairLength = size / 2;

        for (let i = 0; i < hairCount; i++) {
            const headAngle = Math.PI + (i / (hairCount - 1)) * Math.PI;
            const tiltAngle = (Math.random() - 0.5) * Math.PI / 2;

            const rootX = headCenterX + Math.cos(headAngle) * headRadius * 0.8;
            const rootY = headCenterY + Math.sin(headAngle) * headRadius * 0.8;

            const tipX = rootX + Math.sin(tiltAngle) * hairLength * (0.8 + Math.random() * 0.5);
            const tipY = rootY - Math.cos(tiltAngle) * hairLength * (0.8 + Math.random() * 0.5);

            const perpendicularAngle = tiltAngle + Math.PI / 2;
            const spread = headRadius * 0.15;
            const leftX = rootX + Math.cos(perpendicularAngle) * spread;
            const leftY = rootY + Math.sin(perpendicularAngle) * spread;
            const rightX = rootX - Math.cos(perpendicularAngle) * spread;
            const rightY = rootY - Math.sin(perpendicularAngle) * spread;

            ctx.beginPath();
            ctx.moveTo(tipX, tipY);
            ctx.lineTo(leftX, leftY);
            ctx.lineTo(rightX, rightY);
            ctx.closePath();
            ctx.fill();
        }
    }

    static drawEyes(ctx, x, y, appearance) {
        const eyes = appearance.face.eyes;
        const pupils = appearance.face.pupils;
        const eyeColor = eyes.color;
        const pupilColor = pupils.color;
        const eyePositions = this._getEyePositions(eyes);

        // Рисуем сначала все глаза
        ctx.fillStyle = eyeColor;
        eyePositions.forEach(eye => {
            ctx.beginPath();
            ctx.arc(x + eye.x, y + eye.y, eyes.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // Затем рисуем все зрачки
        ctx.fillStyle = pupilColor;
        eyePositions.forEach(eye => {
            ctx.beginPath();
            ctx.arc(
                x + eye.x + pupils.offset,
                y + eye.y + pupils.verticalOffset,
                pupils.radius,
                0,
                Math.PI * 2
            );
            ctx.fill();
        });

        // this.animationSpeed = 0.05

        //  // Анимируем зрачки
        //  const pupilXOffset = Math.sin(time * this.animationSpeed) * 3; // -3..+3
        //  const pupilYOffset = Math.cos(time * this.animationSpeed * 0.7) * 2; // -2..+2

        //  ctx.fillStyle = pupilColor;
        //  eyePositions.forEach(eye => {
        //      ctx.beginPath();
        //      ctx.arc(
        //          x + eye.x + pupils.offset + pupilXOffset,
        //          y + eye.y + pupils.verticalOffset + pupilYOffset,
        //          pupils.radius,
        //          0,
        //          Math.PI * 2
        //      );
        //      ctx.fill();
        //  });
    }

    static _getEyePositions(eyes) {

        if (eyes.oneEye) {
            return [{ x: 0, y: eyes.baseYOffset }];
        }
        return [
            { x: -eyes.xRandomRange, y: eyes.baseYOffset },
            { x: eyes.xRandomRange, y: eyes.baseYOffset + eyes.yRandomRange }
        ];
    }

    static drawEyebrows(ctx, x, y, appearance) {
        const eyes = appearance.face.eyes;

        const eyebrows = appearance.face.eyebrows;
        //console.log(eyebrows)
        const oneEye = appearance.face.oneEye;

        const eyePositions = oneEye ? [{ x: 0, y: eyes.baseYOffset }] : [
            { x: -eyes.xRandomRange, y: eyes.baseYOffset },
            { x: eyes.xRandomRange, y: eyes.baseYOffset + eyes.yRandomRange }
        ]

        ctx.strokeStyle = eyebrows.color;

        // делаем копию настроек чтоб не менять оригинальные
        const eyebrowsCopy = JSON.parse(JSON.stringify(eyebrows))
        const { left, right, color, single } = eyebrowsCopy;

        if (oneEye) {
            const singleBrow = single; // Копируем, чтобы не менять исходный объект

            // Центрируем относительно единственного глаза
            singleBrow.xOffset += eyePositions[0].x;
            singleBrow.yOffset += eyePositions[0].y - 15; // Сдвиг вверх

            // Рисуем одну бровь (например, горизонтальную или специальную форму)
            GraphicsHelper.drawCenteredLine(ctx, x, y, singleBrow, color);
        } else {

            ctx.lineCap = 'round'; // Чтобы концы бровей были закругленные
            // Для двух глаз — брови над каждым глазом
            left.xOffset += eyePositions[0].x;  // Добавляем позицию глаза к базовому смещению
            left.yOffset += eyePositions[0].y - 10;

            right.xOffset += eyePositions[1].x;
            right.yOffset += eyePositions[1].y - 10;
            GraphicsHelper.drawCenteredLine(ctx, x, y, left, color);
            GraphicsHelper.drawCenteredLine(ctx, x, y, right, color);
        }

        ctx.restore();

    }


    static drawMouth(ctx, x, y, appearance) {
        const size = appearance.size;
        const isEnemy = appearance.isEnemy;
        const mouth = appearance.face.mouth;

        const offsetX = mouth.xOffset
        const offsetY = mouth.yOffset
        const thickness = mouth.thickness

        ctx.strokeStyle = mouth.color;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.lineCap = 'round'

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
            ctx.fillStyle = mouth.teethColor;
            const toothCount = 4;
            const angleStep = (mouthEndAngle - mouthStartAngle) / (toothCount - 1);

            for (let i = 0; i < toothCount; i++) {
                const angle = mouthStartAngle + i * angleStep;
                const toothX = x + Math.cos(angle) * mouthRadius;
                const toothY = mouthCenterY + Math.sin(angle) * mouthRadius;

                ctx.save();
                ctx.translate(toothX, toothY);
                ctx.rotate(angle + Math.PI / 3);

                ctx.beginPath();
                ctx.moveTo(-3, 0);
                ctx.lineTo(2, 0);
                ctx.lineTo(0, -7);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
        } else {
            // Нейтральный рот
            ctx.moveTo(x - 15 + offsetX, y + size / 12 + offsetY);
            ctx.lineTo(x + 15 + offsetX, y + size / 12 + offsetY);
            ctx.stroke();
        }
    }

    static drawMace(ctx, x, y, appearance) {
        const isEnemy = appearance.isEnemy;
        const weapon = appearance.weapon;
        const weaponAngle = appearance.weapon.angle
        ctx.save();
        const gripX = isEnemy ? x - 40 : x + 40 + weapon.offsetX;
        const gripY = y + 35 + weapon.offsetY;
        ctx.translate(gripX, gripY);

        ctx.rotate(weaponAngle);

        // Ручка топора
        ctx.fillStyle = weapon.colors.handle;
        ctx.fillRect(0, -4, 80, 8);

        // Лезвие топора
        ctx.fillStyle = weapon.colors.blade;
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

}

class BugRenderer extends CharacterRenderer {

    static draw(ctx, x, y, appearance) {


        // this.drawBodyParts(ctx, x, y, appearance);
        // //this.drawFace(ctx, x, y, appearance);
        // this.drawSpikes(ctx, x, y, appearance);  // Шипы на спине
        // this.drawClaws(ctx, x, y, appearance);   // Клешни/лапы
        // this.drawWings(ctx, x, y, appearance);   // Крылья (опционально)
        // ctx.restore();
        appearance.calculateHairColor(20)
        const isEnemy = appearance.isEnemy;
        // Объект с цветами в RGBA формате
        const beetleColors = {
            bodyMain: isEnemy ? 'rgba(61, 41, 26, 0.7)' : 'rgba(102, 102, 102, 0.7)',
            bodyStroke: 'rgba(90, 58, 32, 0.7)',
            legs: 'rgba(26, 18, 11, 1)',
            jawBase: 'rgba(26, 10, 0, 1)',
            jawStroke: 'rgba(0, 0, 0, 1)',
            jawDetails: 'rgba(193, 24, 24, 0.20)',
            head: 'rgba(26, 18, 11, 0.74)',
            eyeGradientStart: isEnemy ? 'rgba(255, 0, 0, 1)' : 'rgba(102, 102, 102, 0.7)',
            eyeGradientEnd: isEnemy ? 'rgba(136, 0, 0, 1)' : 'rgba(255, 255, 255, 0.7)',
            pupils: 'rgba(0, 0, 0, 1)',
            eyeShine: 'rgb(171, 171, 171)',
            antennae: 'rgba(182, 182, 182, 0.55)',
            plates: 'rgb(48, 26, 9)',
            wings: isEnemy ? 'rgba(61, 41, 26, 0.7)' : 'rgba(102, 102, 102, 0.7)',
            wingStroke: 'rgba(90, 58, 32, 1)'
        };

        let isFacingRight = !appearance.isEnemy;
        let size = 140;

        // Сохраняем контекст для трансформаций
        ctx.save();

        // Переносим начало координат и сразу поворачиваем на 90°
        ctx.translate(x, y + 10);
        ctx.rotate(Math.PI / 2); // 90° по часовой стрелке

        // Отражаем жука, если он смотрит влево
        if (!isFacingRight) {
            ctx.translate(0, -30);
            ctx.scale(1, -1);
        }

        // Размеры частей жука (пропорционально основному размеру)
        const bodyWidth = size * 0.7;
        const bodyHeight = size * 0.5;
        const headSize = size * 0.25;

        // Ноги (острые и угрожающие)
        ctx.strokeStyle = beetleColors.legs;
        ctx.lineWidth = size * 0.04;
        const legPairs = 3;
        ctx.lineCap = 'round';
        for (let i = 0; i < legPairs; i++) {
            const offsetY = (i - 1) * (bodyHeight / 2.5);
            const legLength = size * 0.3;

            // Передние ноги более крупные
            const frontMultiplier = i === 0 ? 1.1 : 1;

            // Левая сторона
            ctx.beginPath();
            ctx.moveTo(-bodyWidth / 2.5, offsetY);
            ctx.lineTo(-bodyWidth / 2 - legLength * frontMultiplier, offsetY - legLength * 0.7);
            ctx.stroke();

            // Правая сторона
            ctx.beginPath();
            ctx.moveTo(bodyWidth / 2.5, offsetY);
            ctx.lineTo(bodyWidth / 2 + legLength * frontMultiplier, offsetY - legLength * 0.7);
            ctx.stroke();
        }

        // Тело жука (острый хитиновый панцирь)
        ctx.fillStyle = beetleColors.bodyMain;
        ctx.beginPath();
        ctx.ellipse(0, 0, bodyWidth / 2, bodyHeight / 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = beetleColors.bodyStroke;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Челюсти (острые и зубчатые)
        ctx.fillStyle = beetleColors.jawBase;
        ctx.strokeStyle = beetleColors.jawStroke;
        ctx.lineWidth = size * 0.045;

        // Левая челюсть
        ctx.beginPath();
        ctx.moveTo(-headSize / 2, -bodyWidth - headSize / 3 - 10);  // Начало левой челюсти
        ctx.lineTo(-5, -bodyWidth / 2 - headSize - 5);  // Конец левой челюсти (смещен влево на 5px от центра)
        ctx.stroke();

        // Правая челюсть
        ctx.beginPath();
        ctx.moveTo(headSize / 2, -bodyWidth - headSize / 3 - 10);  // Начало правой челюсти
        ctx.lineTo(5, -bodyWidth / 2 - headSize - 5);  // Конец правой челюсти (смещен вправо на 5px от центра)
        ctx.stroke();

        // Дополнительные линии на челюстях
        ctx.strokeStyle = beetleColors.jawDetails;
        ctx.lineWidth = size * 0.038;
        ctx.beginPath();
        // Левая линия
        ctx.moveTo(-headSize / 3, -bodyWidth - headSize / 3);
        ctx.lineTo(-headSize / 2 + 8, -bodyWidth - headSize / 3 - 8);
        // Правая линия
        ctx.moveTo(headSize / 3, -bodyWidth - headSize / 3);
        ctx.lineTo(headSize / 2 - 8, -bodyWidth - headSize / 3 - 8);
        ctx.stroke();

        // Голова (детализированная)
        ctx.fillStyle = beetleColors.head;
        ctx.beginPath();
        ctx.arc(0, -bodyWidth / 2 - headSize / 2, headSize, 0, Math.PI * 2);
        ctx.fill();

        // Глаза (со светящимся эффектом)
        const eyeGradient = ctx.createRadialGradient(
            -headSize / 3, -bodyWidth / 2 - headSize / 1.8, 1,
            -headSize / 3, -bodyWidth / 2 - headSize / 1.8, headSize / 4
        );
        eyeGradient.addColorStop(0, beetleColors.eyeGradientStart);
        eyeGradient.addColorStop(1, beetleColors.eyeGradientEnd);
        ctx.fillStyle = eyeGradient;
        ctx.beginPath();
        ctx.arc(-headSize / 3, -bodyWidth / 2 - headSize / 1.8, headSize / 4, 0, Math.PI * 2);
        ctx.arc(headSize / 3, -bodyWidth / 2 - headSize / 1.8, headSize / 4, 0, Math.PI * 2);
        ctx.fill();

        // Зрачки (вертикальные эллипсы для хищного взгляда)
        ctx.fillStyle = beetleColors.pupils;
        ctx.beginPath();
        // Левый зрачок
        ctx.ellipse(-headSize / 3.7 - headSize / 12, -bodyWidth / 2 - headSize / 1.8,
            headSize / 10, headSize / 6, 0, 0, Math.PI * 2);
        // Правый зрачок
        ctx.ellipse(headSize / 3.7 + headSize / 12, -bodyWidth / 2 - headSize / 1.8,
            headSize / 10, headSize / 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Блики в глазах
        ctx.fillStyle = beetleColors.eyeShine;
        ctx.beginPath();
        // Левый блик
        ctx.arc(-headSize / 3.3 - headSize / 8, -bodyWidth / 2 - headSize / 1.9, headSize / 15, 0, Math.PI * 2);
        // Правый блик
        ctx.arc(headSize / 3.3 + headSize / 8, -bodyWidth / 2 - headSize / 1.9, headSize / 15, 0, Math.PI * 2);
        ctx.fill();

        // Усики (изогнутые)
        ctx.strokeStyle = beetleColors.antennae;
        ctx.lineWidth = size * 0.02;
        ctx.beginPath();
        ctx.moveTo(-headSize / 3, -bodyWidth / 2 - headSize / 5);
        ctx.quadraticCurveTo(-headSize, -bodyWidth / 2 - headSize * 1.5, -headSize * 0.8, -bodyWidth / 2 - headSize * 1.8);
        ctx.moveTo(headSize / 3, -bodyWidth / 2 - headSize / 5);
        ctx.quadraticCurveTo(headSize, -bodyWidth / 2 - headSize * 1.5, headSize * 0.8, -bodyWidth / 2 - headSize * 1.8);
        ctx.stroke();

        // Хитиновые пластины на спине
        ctx.strokeStyle = beetleColors.plates;
        ctx.lineWidth = size * 0.02;
        const bodyRadiusX = bodyWidth / 2;
        const bodyRadiusY = bodyHeight / 1.2;

        for (let i = 1; i < 6; i++) {
            const ratio = i / 6.3;
            const plateY = -bodyRadiusY + (2 * bodyRadiusY) * ratio;
            const plateWidth = (bodyRadiusX / bodyRadiusY) * Math.sqrt(bodyRadiusY ** 2 - plateY ** 2);

            ctx.beginPath();
            ctx.ellipse(0, plateY, plateWidth * 1.05, bodyRadiusY / 4, 0, 0, Math.PI);
            ctx.stroke();
        }

        // Левое крыло
        ctx.fillStyle = beetleColors.wings;
        ctx.beginPath();
        ctx.moveTo(-bodyWidth / 2 + 10, -10);
        ctx.quadraticCurveTo(
            -bodyWidth / 2 - size * 0.5, size * 0.2,
            -bodyWidth / 2 - size * 0.5, size * 0.4
        );
        ctx.quadraticCurveTo(
            -bodyWidth / 6 - size * 0.1, size * 0.3,
            -bodyWidth / 3, size * 0.2
        );
        ctx.closePath();
        ctx.fill();

        // Контур крыла
        ctx.strokeStyle = beetleColors.wingStroke;
        ctx.lineWidth = size * 0.01;
        ctx.stroke();

        // Правое крыло (отраженное и смещенное вниз)
        ctx.fillStyle = beetleColors.wings;
        ctx.beginPath();
        ctx.moveTo(bodyWidth / 2 - 10, -10 + 15);
        ctx.quadraticCurveTo(
            bodyWidth / 2 + size * 0.5, size * 0.2 + 15,
            bodyWidth / 2 + size * 0.5, size * 0.4 + 15
        );
        ctx.quadraticCurveTo(
            bodyWidth / 6 + size * 0.1, size * 0.3 + 15,
            bodyWidth / 3, size * 0.2 + 15
        );
        ctx.closePath();
        ctx.fill();

        // Контур правого крыла
        ctx.strokeStyle = beetleColors.wingStroke;
        ctx.lineWidth = size * 0.01;
        ctx.stroke();

        // Восстанавливаем контекст
        ctx.restore();

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
        this.drawCharacter(character);
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

    drawCharacter(character) {
        const charData = this._characterCanvases.get(character);
        if (!charData) return;

        const { ctx, canvas } = charData;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Проверка что не забыли создать внешность у героя
        if (!character.appearance) {
            throw new Error('Нет внешности у персонажа ' + character.name);
        }

        // Центральные координаты в canvas персонажа
        const centerX = 100;
        const centerY = 150;

        CharacterRenderer.drawCharacter(ctx, centerX, centerY, character.appearance, character.species)

        // Отрисовка HP и имени
        this.drawCharacterUI(ctx, character, centerX, centerY);
    }

    drawCharacterUI(ctx, character, x, y) {
        const size = character.appearance.size;
        //console.log(character.appearance)
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

        // Текст HP (белый с чёрной обводкой для лучшей читаемости)
        const hpText = `${Math.round(character.hp)}/${character.maxHp}`;
        ctx.font = 'bold 15px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Белый текст поверх
        ctx.fillStyle = 'white';
        ctx.fillText(hpText, x, hpBarY + hpBarHeight / 2 + 1);

        // Круг уровня
        ctx.fillStyle = 'rgba(255, 255, 255, 0.66)'; // Фон круга
        ctx.beginPath();
        ctx.arc(x - hpBarWidth / 2 - 15, hpBarY + hpBarHeight / 2, 25, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Тень (имитация обводки)
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 1; // Размытие
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Основной текст
        ctx.fillStyle = character.appearance.hair.color;
        ctx.fillText(character.level, x - hpBarWidth / 2 - 15, hpBarY + hpBarHeight / 2 + 1);

        // Отключаем тень для остального кода
        ctx.shadowBlur = 0;
        // // Чёрная обводка текста
        // ctx.strokeStyle = 'black';
        // ctx.lineWidth = 3;
        // ctx.strokeText(hpText, x, hpBarY + hpBarHeight / 2);



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
        // сколько здоровья на 1 уровне
        this.lvl1HP =hp
        // сколько здоровья максимум сейчас
        this.maxHp = hp;
        // текущее здоровье, работает через геттер get hp(){}
        this._hp = hp;
        
        this.attack = attack;
        this.team = team;
    }

    get hp() { return this._hp; }

    set hp(value) {
        const newHp = Math.max(0, Math.min(value, this.maxHp));
        if (newHp !== this._hp) {
            const oldHp = this._hp;
            this._hp = newHp;
            // Регенерируем только лицо при получении урона
            if (newHp < oldHp) {
                // Шансы эмоций на лице у персонажа чем больше число тем выше шанс
                const emotionChances = {
                    calm: {
                        weight: 1,
                    },
                    angry: {
                        weight: 4,
                    },
                    sruprised: {
                        weight: 3,
                    },
                    damaged: {
                        weight: 8,
                    }
                };
                this.appearance.emotion = this.appearance.getRandomEmotion(emotionChances)
                console.log(this.appearance.emotion)

                this.appearance.generateWeapon()
                this.appearance.regenerateFace()
            }
            this.redraw();
        }
    }

    set level(value) {
        this._level = value
        this.appearance.regenerateHair(this.level)
        this.redraw()
    }

    get level() {
        return this._level
    }

    redraw() {
        Battlefield.instance.drawCharacter(this);
    }
}
class Orc extends Character {
    constructor(name, phrase, hp, attack, team = "friend") {
        super(name, phrase, hp, attack, team)
        this.species = "Орк"
        this._level = 1
        // Враг или друг?
        const isEnemy = team === 'enemy'
        // размер модельки в пх
        const size = 140
        this.appearance = new OrcAppearance(size, isEnemy, this.level);

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
        this._level = 1

        // Враг или друг?
        const isEnemy = team === 'enemy'
        // размер модельки в пх
        const size = 140
        this.appearance = new OrcAppearance(size, isEnemy, this.level);

        // Регестрируем персонажа только когда он полностью получил все характеристики
        Battlefield.instance.registerCharacter(this)
    }

    hide = () => console.log("Прячемся! *становиться невидимым*")
}

const battlefield = new Battlefield('battlefield');


// Создаем персонажей
const orc1 = new Orc("Гром'Аш", "За Орду!", 250, 7)

const bug1 = new Bug("Разогр", "Опять работать!", 100, 4)
const orc3 = new Orc("Гаррош", "Я принёс только смерть!", 150, 5)

const orc4 = new Orc("Ренер", "Я принёс только смерть!", 150, 5, "enemy")
const bug2 = new Bug("Жучара", "---------*зловеще молчит*----------", 50, 3, "enemy")
const orc6 = new Orc("Васян", "*ZZZZZZZZZZZZZZZZZZZ*", 50, 3, "enemy")

