import React, { Component } from 'react';
import Snapshot from './Snapshot.js';
import * as DDB from './DDB.js';

class Images extends Component {

    constructor(props) {
        super(props);

        this.state = {
            snapshots: {},
            isLoading: true
        }

        DDB.listMostRecentRecords(3).then((result) => {
            // [{filename, humidity, date, tempInF, picture-set}]
            this.setState({ 
                isLoading: false,
                snapshots: result.Items.map((item) => Images.buildSnapshot(item))
            }); 
        });
    }

    static buildSnapshot(ddbResult) {
        return {
            filename: ddbResult.filename["S"],
            humidity: parseFloat(ddbResult.humidity["N"]),
            tempInF: parseFloat(ddbResult.tempInF["N"]),
            date: new Date(ddbResult.date["S"])
        };
    }

    render() {
        if (this.state.isLoading) {
            return (<div>It's loading!!!</div>)
        } else {

            const listItems = this.state.snapshots.map((snap) => {
                return (
                    <Snapshot 
                        filename={snap.filename} 
                        key={"image-" + snap.filename} 
                        humidity={snap.humidity}
                        tempInF={snap.tempInF}
                        date={snap.date} />
                );
            });

            return (
                <div className="snapshots" >
                    {listItems}
                </div>
            );
        }
    }


}

export default Images;
