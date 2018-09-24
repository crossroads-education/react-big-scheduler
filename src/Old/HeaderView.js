import React, {Component} from 'react'
import {PropTypes} from 'prop-types'
import {ViewTypes} from './index'
import injectSheet from "react-jss";
import classNames from "classnames";
import Header from 'antd/lib/calendar/Header';

const styles = theme => ({
    listElement: {
        width: "100%",
        borderTop: "solid 1px #e9e9e9",
        borderLeft: "solid 1px #e9e9e9",
        textAlign: "center",
        extend: props => props.userStyle.headerItem
    },
    nonWorkingElement: props =>  ({
        color: props.schedulerData.config.nonWorkingTimeHeadColor,
        backgroundColor: props.schedulerData.config.nonWorkingTimeHeadBgColor,
        extend: props.userStyle.headerNonWorkingItem
    }),
    header3Text: {
        extend: theme.header3Text
    },
    headerContainer: {
        height: props => props.schedulerData.getTableHeaderHeight(),
        display: "flex",
        extend: props => props.userStyle.headerContainer
    }
});

@injectSheet(styles)
class HeaderView extends Component {
    
    constructor(props) {
        super(props);
    }

    static propTypes = {
        schedulerData: PropTypes.object.isRequired,
        nonAgendaCellHeaderTemplateResolver : PropTypes.func,
    }

    render() {
        const {schedulerData, nonAgendaCellHeaderTemplateResolver, classes, headerComponent } = this.props;
        const {headers, viewType, config, localeMoment} = schedulerData;
        let minuteStepsInHour = schedulerData.getMinuteStepsInHour();
        let HeaderComponent = headerComponent;
        let headerList = [];
        if(viewType === ViewTypes.Day){
            headers.forEach((item, index) => {
                if(index % minuteStepsInHour === 0){
                    let datetime = localeMoment(item.time);
                    let element = (HeaderComponent) ?
                        <HeaderComponent key={item.time} time={item.time} workingHour={!item.nonWorkingTime} itemIndex={index} schedulerData={schedulerData}/>
                    : (
                        <div key={item.time} className={classNames(classes.listElement, { nonWorkingElement: !!item.nonWorkingTime})}>
                            <span>{config.nonAgendaDayCellHeaderFormat.split('|').map(item => datetime.format(item))[0]}</span>
                        </div>
                    );
                    headerList.push(element);
                }
            })
        }
        else {
            headerList = headers.map((item, index) => {
                let datetime = localeMoment(item.time);
                let pFormattedList = config.nonAgendaOtherCellHeaderFormat.split('|').map(item => datetime.format(item));

                return (nonAgendaCellHeaderTemplateResolver) ? 
                    nonAgendaCellHeaderTemplateResolver(schedulerData, item, pFormattedList[index]) 
                : (
                        <div key={item.time} className={classNames(classes.listElement, { nonWorkingElement: !!item.nonWorkingTime })}>
                        {pFormattedList.map((item, index) => (
                            <div key={index}>{item}</div>
                        ))}
                    </div>
                );
            });
        }

        return (
            <div className={classes.headerContainer}>
                {headerList}
            </div>
        );
    }
}

export default HeaderView