import * as React from "react";
import {Moment} from "moment";
import {MomentRange} from "moment-range";

export type DateModel = {
    currentDay: number;
    startTime: string;
    endTime: string;
    schedule: ScheduleStore;
    setDate: (day: number) => void;
    decrementDate: () => void;
    incrementDate: () => void;
    start: Moment;
    end: Moment;
    range: MomentRange;
    hours: number;
}

export type Resource = {
    id: number | string;
    componentProps?: {
        [key: string]: any;
    }
}

export type ResourceModel = {
    componentProps: {[key: string]: any};
    id: number | string;
    events: EventModel[];
    schedule: ScheduleStore;
}

export type EventModel = { 
    id: number | string;
    layer: number;
    schedule: ScheduleStore;
    resource: ResourceModel;
    start: string;
    end: string;
    resizable: boolean;
    movable: boolean;
    displayPopup: boolean;
    active: boolean;
    _start: Moment;
    _end: Moment;
    duration: number;
    delete: () => void;
}

export type Event = {
    id: number;
    start: string;
    end: string;
    day: number;
    resourceId: number | string;
    layer: number;
    resizable?: boolean;
    componentProps?: {
        [key: string]: number;
    }
}

export type SchedulerStore =  {
    constructor(init: {
        resources: Resource[],
        events: Event[],
        startTime: number,
        endTime: number,
        currentDay: number,
        activeLayer: number,
        backgroundLayer: number,
        renderLayers: {
            [key: number]: {
                event: any,
                resizer: any
            }
        },
        renderResource: any,
        renderPopover?: any,
        renderAdornment?: any,
        resizeEvent: (newTime: Moment, event: Event, timeChange: "start" | "end") => void,
        createEvent: (newEvent: Event, resource: Resource, startTime: Moment) => void,
        displayHeaders?: boolean
    });

    date: DateModel;
    resources: ResourceModel;
    resizeEvent: (newTime: Moment,event: Event,timeChange: "start"|"end") => void;
    createEvent: (newEvent: Event,resource: Resource,startTime: Moment) => void;
    events: EventModel[];
}

declare const Scheduler: React.ComponentType<any>;

export default Scheduler;