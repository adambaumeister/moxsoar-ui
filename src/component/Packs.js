import React from 'react';
import Moxsoar from '../api/moxsoar';
import logo from '../moxsoar_logo.svg';

class PackList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            packs: []
        };
    }

    componentDidMount() {
        var m = new Moxsoar();
        m.GetPacks(this);
    }

    addPacks(result) {
        for (var pack of result.json["Packs"]) {
            console.log(pack.Name)
        }
    }

    render() {
        return (
            <div className="mt-3 ml-5 mr-5">
                <Pack/>
                <Pack/>
                <Pack/>
                <Pack/>

            </div>
        )
    }
}

class Pack extends React.Component {
    render() {
        return (
            <div className="card mb-2">
                <div className="card-body">
                    er's a card
                </div>
            </div>
        )
    }
}

export default class Main extends React.Component {
    render() {
        return (
            <div className="row h-100 justify-content-center align-items-center">
                <div className="card main-box">

                    <img src={logo} height='50px' className="mt-4"></img>
                    <h1 className="header mt-2 text-center text-muted">Installed Content Packs</h1>
                    <PackList/>
                </div>
            </div>
        )
    }
}