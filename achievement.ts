enum Events {
    GotSnowBalls,
    PickUpMushrooms,
    PlayerFourHours
}

enum EventType {
    Trigger,
    Count,
    Time
}

type PlayerType = {
    event: Events,
    other: boolean | number | Date,
    hoursToStop?: number
};


abstract class Achievement {
    public Id: number;
    public EventType: EventType;

    protected constructor(id: Events, eventType: EventType) {
        this.Id = id;
        this.EventType = eventType;
    }
}


class Player {
    public readonly Name;
    public Quests: PlayerType[];

    constructor(name: string, quests: PlayerType[]) {
        this.Name = name;
        this.Quests = quests;
    }

    public showMyAchives(): void {
        for (let i in this.Quests) {
            console.log(this.Quests);
        }
    }
}

class TriggerAchieve extends Achievement {
    constructor(id: Events, eventType: EventType) {
        super(id, eventType);
    }

    public trigger(player: Player, state: boolean): void {
        let data: PlayerType = {
            event: this.Id,
            other: state
        }

        if (this.isAchieved(player, data.event)) {
            return;
        }

        player.Quests.push(data);
    }

    private isAchieved(player: Player, event: Events): boolean {
        let quests = JSON.stringify(player.Quests);

        if (quests.includes(event.toString())) {

            const quests: PlayerType[] = JSON.parse(JSON.stringify(player.Quests));
            const desiredQuest = quests.find(quest => quest.event === event);

            if (desiredQuest) {
                console.log(desiredQuest.other);
                return <boolean>desiredQuest.other;
            } else {
                return false;
            }

        } else {
            return false;
        }
    }
}

class CountAchieve extends Achievement {
    private _count: number

    constructor(id: Events, eventType: EventType, count: number) {
        super(id, eventType);
        this._count = count;
    }

    public trigger(player: Player, amount: number): void {
        let data: PlayerType = {
            event: this.Id,
            other: amount
        }

        if (amount > this._count)
            return;

        player.Quests.push(data);
    }

    public getCurrentStat(player: Player, event: Events): number | undefined | null {

        let quests = JSON.stringify(player.Quests);
        if (quests.includes(event.toString())) {

            const quests: PlayerType[] = JSON.parse(JSON.stringify(player.Quests));
            const desiredQuest = quests.find(quest => quest.event === event);

            if (desiredQuest) {
                const otherValue = desiredQuest.other;
                return <number>otherValue;
            } else {
                return null;
            }

        } else {
            return null;
        }
    }

    public getMaxStat(player: Player, event: Events): number | null {
        let quests = JSON.stringify(player.Quests);

        if (quests.includes(event.toString())) {
            return this._count;
        } else {
            return null;
        }
    }
}

class TimeAchieve extends Achievement {
    private _time: number;

    constructor(id: Events, eventType: EventType, time: number) {
        super(id, eventType);
        this._time = time;
    }

    public startTrack(player: Player): void {

        let quests = JSON.stringify(player.Quests);

        if (quests.includes(this.Id.toString())) {
            const quests: PlayerType[] = JSON.parse(JSON.stringify(player.Quests));
            const desiredQuest = quests.find(quest => quest.event === this.Id);

            if (desiredQuest) {
                let currentTime: Date = new Date();
                let hoursToStop = currentTime.setHours(currentTime.getHours() + this._time)

                let data: PlayerType = {
                    event: this.Id,
                    other: currentTime,
                    hoursToStop: hoursToStop
                };

                player.Quests.push(data);
                console.log(data);
            }
        }
    }

    public stopTrack(player: Player): void {
        let isExist = JSON.stringify(player.Quests);

        if (isExist.includes(this.Id.toString())) {
            let quests: PlayerType[] = JSON.parse(isExist);
            const desiredQuest = quests.find(quest => quest.event === this.Id);

            if (desiredQuest) {
                const date = new Date(desiredQuest.other.toString());

                if (date.getTime() - Date.now() <= 0) {
                    // todo
                }
            }
        }
    }
}

let data: PlayerType[] = [
    {
        event: Events.PlayerFourHours,
        other: 5,
    },
]

let player: Player = new Player("kiraz", data)
player.showMyAchives();

// регистрация ачивки
const PickUpMushrooms: TriggerAchieve = new TriggerAchieve(Events.PickUpMushrooms, EventType.Trigger);
const GotSnowBalls: CountAchieve = new CountAchieve(Events.GotSnowBalls, EventType.Count, 100)
const PlayerFourHours: TimeAchieve = new TimeAchieve(Events.PlayerFourHours, EventType.Time, 5)

// лист из ачивок
const quests = {
    PickUpMushrooms,
    GotSnowBalls,
    PlayerFourHours
}

// использование
quests.PickUpMushrooms.trigger(player, true);
quests.GotSnowBalls.trigger(player, 15);

quests.GotSnowBalls.getCurrentStat(player, Events.PickUpMushrooms);
quests.GotSnowBalls.getMaxStat(player, Events.PickUpMushrooms);

quests.PlayerFourHours.startTrack(player);
quests.PlayerFourHours.stopTrack(player);