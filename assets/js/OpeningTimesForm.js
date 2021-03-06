import React from "react";
const { Component } = React;
import TimeField from 'react-simple-timefield';
import $ from 'jquery';

export default class StoreForm extends Component {
    state = {
        initialized: false,
        openingTimes: []
    };

    defaultOpeningTime = {
        weekday: 1,
        open: '08:00',
        close: '20:00'
    };

    componentDidMount() {
        let openingTimes = {
            all: [],
            delivery: [],
            pickup: []
        };
        for (let i = 0; i < opening_times.length; i++) {
            openingTimes[opening_times[i].type].push(opening_times[i]);
        }
        this.setState({
            initialized: true,
            openingTimes: openingTimes,
            store: opeing_time_store,
            allOpen: openingTimes.all.length > 0,
            deliveryOpen: openingTimes.delivery.length > 0,
            pickupOpen: openingTimes.pickup.length > 0
        });
    }

    addLine(area, position) {
        let openingTimes = this.state.openingTimes;
        openingTimes[area] = openingTimes[area].slice(0, position + 1).concat(
            [Object.assign({type: area}, this.defaultOpeningTime)],
            openingTimes[area].slice(position + 1)
        );
        this.setState({
            openingTimes: openingTimes
        });
    }

    removeLine(area, position) {
        let openingTimes = this.state.openingTimes;
        openingTimes[area] = openingTimes[area].slice(0, position).concat(openingTimes[area].slice(position + 1));
        this.setState({
            openingTimes: openingTimes
        });
    }

    triggerOpenSwitch(area) {
        if (!this.state[area + 'Open'] && !this.state.openingTimes[area].length) {
            let openingTimes = this.state.openingTimes;
            openingTimes[area].push(Object.assign({type: area}, this.defaultOpeningTime));
            this.setState({
                [area + 'Open']: true,
                openingTimes: openingTimes
            });
            return;

        }
        this.setState({
            [area + 'Open']: !this.state[area + 'Open']
        });
    }

    render() {
        if (!this.state.initialized)
            return(<div>...</div>);
        return (
            <div>
                <p>
                    <label htmlFor="all_switch" style={{marginTop: '10px'}}>
                        <input
                            type="checkbox"
                            name="all_switch"
                            id="all_switch"
                            defaultChecked={this.state.allOpen}
                            onClick={this.triggerOpenSwitch.bind(this, 'all')}
                        />{' '}
                        Geschäft hat geöffnet
                    </label>
                </p>
                {this.renderOpeningTimes('all', this.state.allOpen)}
                <p>
                    <label htmlFor="delivery" style={{marginTop: '10px'}}>
                        <input
                            type="checkbox"
                            name="delivery"
                            defaultChecked={this.state.store.delivery || this.state.openingTimes.delivery.length}
                            id="delivery"
                        />{' '}
                        Bietet Lieferung
                    </label><br/>
                    <label htmlFor="delivery_switch" style={{marginTop: '10px'}}>
                        <input
                            type="checkbox"
                            name="delivery_switch"
                            id="delivery_switch"
                            defaultChecked={this.state.deliveryOpen}
                            onClick={this.triggerOpenSwitch.bind(this, 'delivery')}
                        />{' '}
                        Abweichende Lieferzeiten
                    </label><br/>
                </p>
                {this.renderOpeningTimes('delivery', this.state.deliveryOpen)}
                <p>
                    <label htmlFor="pickup" style={{marginTop: '10px'}}>
                        <input
                            type="checkbox"
                            name="pickup"
                            defaultChecked={this.state.store.pickup || this.state.openingTimes.pickup.length}
                            id="pickup"
                        />{' '}
                        Bietet Abholung
                    </label><br/>
                    <label htmlFor="pickup_switch" style={{marginTop: '10px'}}>
                        <input
                            type="checkbox"
                            name="pickup_switch"
                            id="pickup_switch"
                            defaultChecked={this.state.pickupOpen}
                            onClick={this.triggerOpenSwitch.bind(this, 'pickup')}
                        />{' '}
                        Abweichende Abholzeiten
                    </label>
                </p>
                {this.renderOpeningTimes('pickup', this.state.pickupOpen)}
                <label htmlFor="onlineshop" style={{marginTop: '10px'}}>
                    <input
                        type="checkbox"
                        name="onlineshop"
                        defaultChecked={this.state.store.onlineshop}
                        id="onlineshop"
                    />{' '}
                    Hat Onlineshop
                </label><br/>
            </div>
        );
    }

    renderOpeningTimes(area, condition) {
        if (!condition)
            return;
        let result = [];
        for (let i = 0; i < this.state.openingTimes[area].length; i++) {
            result.push(this.renderOpeningTime(area, this.state.openingTimes[area][i], i));
        }
        return (
            <div className="container">
                {result}
            </div>
        )
    }
    setWeekday(area, position, evt) {
        let openingTimes = this.state.openingTimes;
        openingTimes[area][position].weekday = evt.target.value;
        this.setState({
            openingTimes: openingTimes
        });
    }

    renderOpeningTime(area, opening_time, position) {
        return (
            <div className="row">
                <div className="col-4">
                    <select
                        className="form-control"
                        value={opening_time.weekday}
                        name={`opening_times_${area}-${position}-weekday`}
                        onChange={this.setWeekday.bind(this, area, position)}
                    >
                        <option value="1">Montag</option>
                        <option value="2">Dienstag</option>
                        <option value="3">Mittwoch</option>
                        <option value="4">Donnerstag</option>
                        <option value="5">Freitag</option>
                        <option value="6">Samstag</option>
                        <option value="7">Sonntag</option>
                    </select>
                </div>
                <div className="col-3">
                    <TimeField
                        value={opening_time.open}
                        className="form-control"
                        style={{width: '100%'}}
                        name={`opening_times_${opening_time.type}-${position}-open`}
                    />
                </div>
                <div className="col-3">
                    <TimeField
                        value={opening_time.close}
                        className="form-control"
                        style={{width: '100%'}}
                        name={`opening_times_${opening_time.type}-${position}-close`}
                    />
                </div>
                <div className="col-2" style={{textAlign: 'right'}}>
                    {position > 0 &&
                        <i className="fa fa-minus-circle fa-2x" aria-hidden="true" onClick={this.removeLine.bind(this, opening_time.type, position)}></i>
                    }{' '}
                    <i className="fa fa-plus-circle fa-2x" aria-hidden="true" onClick={this.addLine.bind(this, opening_time.type, position)}></i>
                </div>
            </div>
        )
    }
}