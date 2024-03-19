import Card from './Card.js';
import Game from './Game.js';
import TaskQueue from './TaskQueue.js';
import SpeedRate from './SpeedRate.js';

// Отвечает является ли карта уткой.
function isDuck(card) {
    return card instanceof Duck;
}

// Отвечает является ли карта собакой.
function isDog(card) {
    return card instanceof Dog;
}

// Дает описание существа по схожести с утками и собаками
function getCreatureDescription(card) {
    if (isDuck(card) && isDog(card)) {
        return 'Утка-Собака';
    }
    if (isDuck(card)) {
        return 'Утка';
    }
    if (isDog(card)) {
        return 'Собака';
    }
    return 'Существо';
}

class Creature extends Card {
    constructor(name, maxPower, image) {
        super(name, maxPower, image);
    }

    getDescriptions() {
        const firstStr = getCreatureDescription(this);
        const secondStr = super.getDescriptions()[0];
        return [firstStr, secondStr];
    }
}

class Gatling extends Creature{
    constructor() {
        super("Гатлинг", 6);
    }

    attack (gameContext, continuation) {
        const taskQueue = new TaskQueue();
        const {currentPlayer, oppositePlayer, position, updateView} = gameContext;
        for (let pos = 0; pos < oppositePlayer.table.length; pos++) {
            const oppositeCard = oppositePlayer.table[pos];
            taskQueue.push(onDone => this.view.showAttack(onDone));
            taskQueue.push(onDone => {
                console.log("gfgg")
                if (oppositeCard) {
                    this.dealDamageToCreature(this.currentPower, oppositeCard, gameContext, onDone);
                } else {
                    this.dealDamageToPlayer(1, gameContext, onDone);
                }

            });
        }
        taskQueue.continueWith(continuation);
    };
}
// Основа для утки.
class Duck extends Creature {
    constructor(name="Мирная утка", maxPower=2, image) {
        super(name, maxPower, image);
    }

    quacks = function () { console.log('quack') };
    swims = function () { console.log('float: both;') };
}


// Основа для собаки.
class Dog extends Creature {
    constructor(name="Пес-бандит", maxPower=3, image) {
        super(name, maxPower, image);
    }
}

class Trasher extends Dog {
    constructor() {
        super("Громила", 5);
    }
}


// Колода Шерифа, нижнего игрока.
const seriffStartDeck = [
    new Duck('Мирный житель', 10),
    new Duck(),
    new Duck('Мирный житель', 10),
];

// Колода Бандита, верхнего игрока.
const banditStartDeck = [
    new Dog('Бандит', 1),
    new Gatling(),
    //new Dog('Бандит', 3),

];


// Создание игры.
const game = new Game(seriffStartDeck, banditStartDeck);

// Глобальный объект, позволяющий управлять скоростью всех анимаций.
SpeedRate.set(1);

// Запуск игры.
game.play(false, (winner) => {
    alert('Победил ' + winner.name);
});
