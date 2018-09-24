import React, {Component} from 'react'
import {PropTypes} from 'prop-types' 
import injectSheet from "react-jss";

const styles = theme => ({
    timelineEvent: props => ({
        left: props.left + "%",
        width: props.width,
        top: props.top,
        extend: theme.timelineEvent
    }),
    timelineEventContent: {
        height: props => props.schedulerData.config.eventItemHeight, 
        color: "#999",
        textAlign: "center",
        extend: props => props.userStyle.timelineEventContent
    }
})

@injectSheet(styles)
class AddMore extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        schedulerData: PropTypes.object.isRequired,
        number: PropTypes.number.isRequired,
        left: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired,
        clickAction: PropTypes.func.isRequired,
        headerItem: PropTypes.object.isRequired,
        widthExtra: PropTypes.number,
        leftExtra: PropTypes.number
    }

    render() {
        const {number, clickAction, headerItem, classes} = this.props;
        let content = '+'+number+'more';
        return (
        <a className={classes.timelineEvent} onClick={() => {clickAction(headerItem);}} >
            <div className={classes.timelineEventContent}>
                {content}
            </div>
        </a>
        );
    }
}

export default AddMore