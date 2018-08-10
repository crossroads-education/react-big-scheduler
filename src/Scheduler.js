import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Row, Col, Icon, Radio, Popover, Calendar } from 'antd'
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import DnDSource from './DnDSource'
import DnDContext from './DnDContext'
import EventItem from './EventItem'
import ResourceView from './ResourceView'
import HeaderView from './HeaderView'
import BodyView from './BodyView'
import ResourceEvents from './ResourceEvents'
import AgendaView from './AgendaView'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import "./css/style.css";
import 'antd/dist/antd.css';

class Scheduler extends Component {

    constructor(props) {
        super(props);

        const { schedulerData, dndSources } = props;
        let sources = [];
        sources.push(new DnDSource((props) => {
            return props.eventItem;
        }, EventItem));
        if (dndSources != undefined && dndSources.length > 0) {
            sources = [...sources, ...dndSources];
        }
        let dndContext = new DnDContext(sources, ResourceEvents);

        this.currentArea = -1;

        this.state = {
            visible: false,
            dndContext: dndContext,
            contentHeight: schedulerData.getSchedulerContentDesiredHeight(),
            browserScrollbarHeight: 17,
            browserScrollbarWidth: 17,
        };
    }

    static propTypes = {
        schedulerData: PropTypes.object.isRequired,
        prevClick: PropTypes.func.isRequired,
        nextClick: PropTypes.func.isRequired,
        onViewChange: PropTypes.func.isRequired,
        onSelectDate: PropTypes.func.isRequired,
        onSetAddMoreState: PropTypes.func,
        updateEventStart: PropTypes.func,
        updateEventEnd: PropTypes.func,
        moveEvent: PropTypes.func,
        leftCustomHeader: PropTypes.object,
        rightCustomHeader: PropTypes.object,
        newEvent: PropTypes.func,
        subtitleGetter: PropTypes.func,
        eventItemClick: PropTypes.func,
        viewEventClick: PropTypes.func,
        viewEventText: PropTypes.string,
        viewEvent2Click: PropTypes.func,
        viewEvent2Text: PropTypes.string,
        conflictOccurred: PropTypes.func,
        eventItemTemplateResolver: PropTypes.func,
        dndSources: PropTypes.array,
        slotClickedFunc: PropTypes.func,
        slotItemTemplateResolver: PropTypes.func,
        nonAgendaCellHeaderTemplateResolver: PropTypes.func,
    }

    componentDidUpdate(props, state) {
        const { schedulerData } = this.props;
        const { localeMoment } = schedulerData;
        if (schedulerData.getScrollToToday()) {
            if (!!this.schedulerContent && this.schedulerContent.scrollWidth > this.schedulerContent.clientWidth) {
                let start = localeMoment(schedulerData.startDate).startOf('day'),
                    end = localeMoment(schedulerData.endDate).endOf('day'),
                    now = localeMoment();
                if (now >= start && now <= end) {
                    let index = 0;
                    schedulerData.headers.forEach((item) => {
                        let header = localeMoment(item.time);
                        if (now >= header)
                            index++;
                    })
                    this.schedulerContent.scrollLeft = (index - 1) * schedulerData.getContentCellWidth();

                    schedulerData.setScrollToToday(false);
                }
            }
        }
    }

    render() {
        const { schedulerData, leftCustomHeader, rightCustomHeader } = this.props;
        const { renderData, viewType, showAgenda, isEventPerspective, config } = schedulerData;
        const calendarPopoverEnabled = config.calendarPopoverEnabled;

        let dateLabel = schedulerData.getDateLabel();
        let defaultValue = `${viewType}${showAgenda ? 1 : 0}${isEventPerspective ? 1 : 0}`;
        let radioButtonList = config.views.map(item => {
            return <RadioButton key={`${item.viewType}${item.showAgenda ? 1 : 0}${item.isEventPerspective ? 1 : 0}`}
                value={`${item.viewType}${item.showAgenda ? 1 : 0}${item.isEventPerspective ? 1 : 0}`}><span
                    style={{ margin: "0px 8px" }}>{item.viewName}</span></RadioButton>
        })

        let tbodyContent = <div />;
        if (showAgenda) {
            tbodyContent = <AgendaView
                {...this.props}
            />
        }
        else {
            let resourceTableWidth = schedulerData.getResourceTableWidth();
            let schedulerContainerWidth = (config.viewResources) ? config.schedulerContainerWidth - resourceTableWidth : width;
            let schedulerContentWidth = (config.viewResources) ? config.schedulerContentWidth - resourceTableWidth : width;
            let DndResourceEvents = this.state.dndContext.getDropTarget();
            let eventDndSource = this.state.dndContext.getDndSource();

            let resourceEventsList = renderData.map((item) => {
                return <DndResourceEvents
                    {...this.props}
                    key={item.slotId}
                    resourceEvents={item}
                    dndSource={eventDndSource}
                />
            });
            let schedulerContentStyle = { margin: "0px, 0px, 0px, 0px", position: "relative", width: schedulerContentWidth };
            let resourceContentStyle = { overflowX: "auto", overflowY: "auto" };
            if (config.schedulerMaxHeight > 0) {
                schedulerContentStyle = {
                    ...schedulerContentStyle,
                    maxHeight: config.schedulerMaxHeight - config.tableHeaderHeight
                };
                resourceContentStyle = {
                    ...resourceContentStyle,
                    maxHeight: config.schedulerMaxHeight - config.tableHeaderHeight
                };
            }

            let resourceName = schedulerData.isEventPerspective ? config.taskName : config.resourceName;
            const resourceView = (
                <div style={{ width: resourceTableWidth, display: "inline-block" }}>
                    <div className="resource-view">
                        {config.displayHeader &&
                            <div style={{ overflow: "hidden", borderBottom: "1px solid #e9e9e9", height: config.tableHeaderHeight }}>
                                <div>
                                    <div className="resource-table">
                                        <div className="header3-text">
                                            {resourceName}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        <div style={resourceContentStyle} ref={this.schedulerResourceRef} onMouseOver={this.onSchedulerResourceMouseOver} onMouseOut={this.onSchedulerResourceMouseOut} onScroll={this.onSchedulerResourceScroll}>
                            <ResourceView
                                {...this.props}
                            />
                        </div>
                    </div>
                </div>
            );

            let overflow = (schedulerContainerWidth < schedulerContentWidth) ? { overflowX: "scroll", overflowY: "hidden" } : { overflow: "hidden" };

            tbodyContent = (
                <React.Fragment>
                    {config.viewResources && resourceView}
                    <div style={{ width: schedulerContainerWidth, display: "inline-block" }}>
                        <div className="scheduler-view" style={overflow}>
                            <div style={{ width: schedulerContentWidth }}>
                                {config.displayHeader &&
                                    <div style={{ overflow: "hidden", borderBottom: "1px solid #e9e9e9", height: config.tableHeaderHeight }}>
                                        <div ref={this.schedulerHeadRef} onMouseOver={this.onSchedulerHeadMouseOver} onMouseOut={this.onSchedulerHeadMouseOut} onScroll={this.onSchedulerHeadScroll}>
                                            <div>
                                                <div className="scheduler-bg-table">
                                                    <HeaderView {...this.props} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div style={schedulerContentStyle} ref={this.schedulerContentRef} onMouseOver={this.onSchedulerContentMouseOver} onMouseOut={this.onSchedulerContentMouseOut} onScroll={this.onSchedulerContentScroll} >
                                    <div>
                                        <div className="scheduler-content">
                                            <div className="scheduler-content-table" >
                                                <div>
                                                    {resourceEventsList}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="scheduler-bg" style={{ zIndex: config.backgroundLayer, pointerEvents: "none" }}>
                                            <div className="scheduler-bg-table" ref={this.schedulerContentBgTableRef} >
                                                <BodyView {...this.props} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );


        };

        let popover = <div className="popover-calendar"><Calendar fullscreen={false} onSelect={this.onSelect} /></div>;

        return (
            <div className="scheduler" style={{ width: config.schedulerContainerWidth }}>
                <div>
                    <div colSpan="2">
                        <Row type="flex" align="middle" justify="space-between" style={{ marginBottom: '24px' }}>
                            {leftCustomHeader}
                            <Col>
                                <div className='header2-text'>
                                    <Icon type="left" style={{ marginRight: "8px" }} className="icon-nav"
                                        onClick={this.goBack} />
                                    {
                                        calendarPopoverEnabled
                                            ?
                                            <Popover content={popover} placement="bottom" trigger="click"
                                                visible={this.state.visible}
                                                onVisibleChange={this.handleVisibleChange}>
                                                <span className={'header2-text-label'} style={{ cursor: 'pointer' }}>{dateLabel}</span>
                                            </Popover>
                                            : <span className={'header2-text-label'}>{dateLabel}</span>
                                    }
                                    <Icon type="right" style={{ marginLeft: "8px" }} className="icon-nav"
                                        onClick={this.goNext} />
                                </div>
                            </Col>
                            <Col>
                                <RadioGroup defaultValue={defaultValue} size="default" onChange={this.onViewChange}>
                                    {radioButtonList}
                                </RadioGroup>
                            </Col>
                            {rightCustomHeader}
                        </Row>
                    </div>
                </div>
                <div>
                    {tbodyContent}
                </div>
            </div>
        )
    }

    schedulerHeadRef = (element) => {
        this.schedulerHead = element;
    }

    onSchedulerHeadMouseOver = () => {
        this.currentArea = 2;
    }

    onSchedulerHeadMouseOut = () => {
        this.currentArea = -1;
    }

    onSchedulerHeadScroll = (proxy, event) => {
        if ((this.currentArea === 2 || this.currentArea === -1) && this.schedulerContent.scrollLeft != this.schedulerHead.scrollLeft)
            this.schedulerContent.scrollLeft = this.schedulerHead.scrollLeft;
    }

    schedulerResourceRef = (element) => {
        this.schedulerResource = element;
    }

    onSchedulerResourceMouseOver = () => {
        this.currentArea = 1;
    }

    onSchedulerResourceMouseOut = () => {
        this.currentArea = -1;
    }

    onSchedulerResourceScroll = (proxy, event) => {
        if ((this.currentArea === 1 || this.currentArea === -1) && this.schedulerContent.scrollTop != this.schedulerResource.scrollTop)
            this.schedulerContent.scrollTop = this.schedulerResource.scrollTop;
    }

    schedulerContentRef = (element) => {
        this.schedulerContent = element;
    }

    schedulerContentBgTableRef = (element) => {
        this.schedulerContentBgTable = element;
    }

    onSchedulerContentMouseOver = () => {
        this.currentArea = 0;
    }

    onSchedulerContentMouseOut = () => {
        this.currentArea = -1;
    }

    onSchedulerContentScroll = (proxy, event) => {
        if (this.currentArea === 0 || this.currentArea === -1) {
            if (this.schedulerHead.scrollLeft != this.schedulerContent.scrollLeft)
                this.schedulerHead.scrollLeft = this.schedulerContent.scrollLeft;
            if (this.schedulerResource.scrollTop != this.schedulerContent.scrollTop)
                this.schedulerResource.scrollTop = this.schedulerContent.scrollTop;
        }
    }

    onViewChange = (e) => {
        const { onViewChange, schedulerData } = this.props;
        let viewType = parseInt(e.target.value.charAt(0));
        let showAgenda = e.target.value.charAt(1) === '1';
        let isEventPerspective = e.target.value.charAt(2) === '1';
        onViewChange(schedulerData, { viewType: viewType, showAgenda: showAgenda, isEventPerspective: isEventPerspective });
    }

    goNext = () => {
        const { nextClick, schedulerData } = this.props;
        nextClick(schedulerData);
    }

    goBack = () => {
        const { prevClick, schedulerData } = this.props;
        prevClick(schedulerData);
    }

    handleVisibleChange = (visible) => {
        this.setState({ visible });
    }

    onSelect = (date) => {
        this.setState({
            visible: false,
        });

        const { onSelectDate, schedulerData } = this.props;
        onSelectDate(schedulerData, date);
    }
}

export default DragDropContext(HTML5Backend)(Scheduler);