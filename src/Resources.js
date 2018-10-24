import * as React from "react";
import injectSheet from "react-jss";
import {PropTypes} from "prop-types";

const styles = theme => ({
    resourceContainer: {
        borderBottom: theme.borders.row,
        boxSizing: "border-box",
        backgroundColor: theme.rowColors.even,
        flex: 1
    },
    resourcesRoot: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        "& $resourceContainer:nth-child(odd)": {
            backgroundColor: theme.rowColors.odd//"#F2F1F1"
        },
        height: "100%",
        borderRight: theme.borders.resources,
    }  
})

@injectSheet(styles)
export default class Resources extends React.Component {

    static propTypes = {
        resources: PropTypes.arrayOf(PropTypes.object).isRequired,
        render: PropTypes.func.isRequired
    };

    render() {
        return (
            <div className={this.props.classes.resourcesRoot}>
                {this.props.resources.map(resource => (
                    <div className={this.props.classes.resourceContainer} key={resource.id}>
                        <this.props.render {...resource.componentProps} />
                    </div>
                ))}
            </div>
        )
    }
}
