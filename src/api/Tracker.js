import React from 'react';
import Moxsoar from './moxsoar';
import { ExclamationDiamond, CheckCircle } from 'react-bootstrap-icons';
import ReactTooltip from 'react-tooltip';


export class ElasticSearch {
    constructor() {
        this.moxsoar = new Moxsoar();
    }
    GetStatus(cb) {
        // Retrieve/Check the status
        this.moxsoar.TestSettings(cb)
    }
}
export class ElasticSearchStatusSimple extends React.Component {
    render() {
        var esState = "Not connected to Elasticsearch instance."
        var o = <ExclamationDiamond
            size={24}
            className="text-warning"
        />

            
        if (this.props.status) {
            o = <CheckCircle
                size={24}
                className="text-success"
            />
            esState = "Elasticsearch is connected!"
        }
        return (
            <span data-tip={esState}>
                {o}
                <ReactTooltip place="top" type="dark" effect="float"/>
            </span>
        )
    }
}