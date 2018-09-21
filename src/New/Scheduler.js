import * as React from "react";
import injectSheet, {ThemeProvider} from "react-jss";
import {PropTypes} from "prop-types";
import {Background, Body,  Row, Resources} from "./";
import Theme from "./Theme";
import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

const styles = {
    schedulerContainer: {
        width: "100%",
        display: 'flex',
        justifyContent: "flex-start",
        alignItems: "center",
        height: "100%"
    },
    scheduleBodyContainer: {
        width: "100%",
        height: "100%"
    }
}

@injectSheet(styles)
export default class Scheduler extends React.Component {

    static propTypes = {
        events: PropTypes.arrayOf(PropTypes.object).isRequired,
        resources: PropTypes.arrayOf(PropTypes.object).isRequired,
        resourceComponent: PropTypes.func.isRequired,
        start: PropTypes.string.isRequired,
        end: PropTypes.string.isRequired,
        minuteStep: PropTypes.number.isRequired,
        backgroundLayer: PropTypes.number.isRequired
    }

    render() {

        const {events, resources, resourceComponent, start, end, minuteStep} = this.props;
        const range= moment.range([moment(start), moment(end)]);

        const daysEvents = events.filter(event => range.contains(moment(event.start)) || range.contains(moment(event.end)));
        const rows = resources.map(resource => {
            
            const resourceEvents = daysEvents.filter(event => 
                {
                    return event.resourceId === resource.id;
                }
            );

            return (
                <Row 
                    start={start}
                    end={end}
                    events={resourceEvents}
                />
            )
        });

        return (
            <ThemeProvider theme={Theme}>
                <div className={this.props.classes.schedulerContainer}>
                    <Resources
                        resources={resources}
                        resourceComponent={resourceComponent}
                    />
                    <div className={this.props.classes.scheduleBodyContainer}>
                        <Background
                            start={start}
                            end={end}
                            minutesPerCell={minuteStep}
                            rowCount={resources.length}
                            layer={props.backgroundLayer}
                        />
                        <Body
                            rows={rows}
                        />
                    </div>
                </div>
            </ThemeProvider>
        )
    }
}

