import {observable, computed, action} from "mobx";

class UiModel {
    schedule;
    renderLayers;
    renderResource;
    renderPopover;
    renderAdornment;
    renderResourceHeader;
    renderAdornmentHeader;
    @observable activeLayer;
    @observable backgroundLayer;
    @observable displayHeaders;
    @observable eventRowRef;
    @observable rowHeight;
    @observable headerHeight;

    constructor({renderLayers, renderResource,
                activeLayer, backgroundLayer, renderPopover, 
                renderAdornment, displayHeaders, renderResourceHeader, 
                renderAdornmentHeader, rowHeight, headerHeight}, schedule) {
        this.renderLayers = renderLayers;
        this.renderResource = renderResource;
        this.schedule = schedule;
        this.renderPopover = renderPopover;
        this.renderAdornment = renderAdornment;
        this.activeLayer = activeLayer;
        this.backgroundLayer = backgroundLayer;
        this.displayHeaders = displayHeaders
        this.renderResourceHeader = renderResourceHeader;
        this.renderAdornmentHeader = renderAdornmentHeader;
        this.eventRowRef = undefined;
        this.rowHeight = rowHeight;
        this.headerHeight = headerHeight;
    }

    @action setRowSize = (ref) => {
        this.eventRowRef = ref;
    }

    // 30-minute cell segments, blocks rendered in grid
    @computed get cells() {
        const cells = Array.from(this.schedule.date.range.by("minute", { step: 30 })).map(m => m.format("H:mm"));
        cells.shift(); // Don't need to render a cell following the last value
        return cells;
    }

    // 15-minute segment, distance to fill when dragging
    @computed get halfCellWidth() {
        return this.eventRowWidth / (this.cells.length * 2);
    }

    // Hour markers to render as headers
    @computed get headers() {
        let headers = Array.from(this.schedule.date.range.by("hour")).map(m => m.format("ha").slice(0, -1));
        if (this.renderResourceHeader) headers.shift();
        headers.pop();
        return headers;
    }

    // Width of the row containing events
    @computed get eventRowWidth() {
        return (this.eventRowRef) ? this.eventRowRef.scrollWidth : undefined;
    }

    @action changeActiveLayer = layer => {
        this.activeLayer = layer;
    }

    @action toggleDisabledLayer = layer => {
        this.renderLayers[layer].disabled = !this.renderLayers[layer].disabled;
    }
}

export default UiModel;