import React, { Component } from 'react';
import Snapshot from './Snapshot.js';
import * as DDB from './DDB.js';
import './styles/Images.css';

class Images extends Component {

    constructor(props) {
        super(props);

        this.state = {
            snapshots: [],
            hasMore: false,
            isLoading: true,
            hasMoreLoading: false,
        }
    }

    loadSnapshots = (onComplete) => {
        let lastDate = null; 
        if (this.state.snapshots.length > 0) {
            let lastRecord = this.state.snapshots[this.state.snapshots.length - 1];
            lastDate = lastRecord.date;
        }
        
        DDB.listMostRecentRecords(3, lastDate).then((result) => {
            let newItems = result.Items.map((item) => Images.buildSnapshot(item));
            let hasMore = result.LastEvaluatedKey && Object.keys(result.LastEvaluatedKey).length !== 0;
            this.setState({
                hasMoreLoading: false,
                hasMore: hasMore,
                snapshots: [ ...this.state.snapshots, ...newItems ]
            });

            onComplete();
        });
    }

    componentDidMount() {
        this.loadSnapshots(() => {
            this.setState({ isLoading: false });
        });
    }

    handleShowMore = () => {
        this.setState({ hasMoreLoading: true });

        this.loadSnapshots(() => {
            this.setState({ hasMoreLoading: false });
        })
    }

    static buildSnapshot(ddbResult) {
        return {
            filename: ddbResult.filename["S"],
            humidity: parseFloat(ddbResult.humidity["N"]),
            tempInF: parseFloat(ddbResult.tempInF["N"]),
            date: new Date(ddbResult.date["S"])
        };
    }

    renderShowMoreButton = () => {
        if (this.state.hasMore) {
            return (
                <div className='show-more'>
                    <input type="button" onClick={this.handleShowMore} value="Show More" disabled={this.state.hasMoreLoading} />
                </div>
            );
        } else { 
            return null;
        }
    }

    render() {
        if (this.state.isLoading) {
            return (<div className='loading'>It's loading!!!</div>)
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
                <div>
                    <div className="snapshots" >
                        {listItems}
                        {this.renderShowMoreButton()}
                    </div>
                </div>
            );
        }
    }


}

export default Images;
