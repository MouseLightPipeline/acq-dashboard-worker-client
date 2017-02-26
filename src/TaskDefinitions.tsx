import * as React from "react";
import {Panel} from "react-bootstrap"

import {TaskDefinitionTableWithQuery} from "./TaskDefinitionTable";
import {TaskStartComponent} from "./TaskStartContainer";
import {Loading} from "./Loading";

export class TaskDefinitions extends React.Component<any, any> {
    onStartTask = (taskDefinitionId: string, scriptArgs: string[]) =>  {
        this.props.startTaskMutation(taskDefinitionId, scriptArgs)
        .then(() => {
            this.props.data.refetch();
        }).catch((error: any) => {
            console.log("there was an error sending the query", error);
        });
    };

    render() {
        let taskDefinitions = [];

        if (this.props.data && this.props.data.taskDefinitions) {
            taskDefinitions = this.props.data.taskDefinitions;
        }

        return (
            <div>
                {this.props.data.loading ? <Loading/> : <TablePanel taskDefinitions={taskDefinitions} startTask={this.onStartTask}/>}
            </div>
        );
    }
}

class TablePanel extends React.Component<any, any> {
    render() {
        return (
            <div>
                <Panel collapsible defaultExpanded header="Available Tasks" bsStyle="primary">
                    <TaskDefinitionTableWithQuery taskDefinitions={this.props.taskDefinitions}/>
                </Panel>
                <TaskStartComponent taskDefinitions={this.props.taskDefinitions} startTask={this.props.startTask}/>
            </div>
        );
    }
}