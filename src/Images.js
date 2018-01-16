import React, { Component } from 'react';
import Snapshot from './Snapshot.js';
import * as DDB from './DDB.js';
import './styles/Images.css';
import { buildSnapshot } from './utils.js';

class Images extends Component {

    PicPageSize = 10;

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
        
        DDB.listMostRecentRecords(this.PicPageSize, lastDate).then((result) => {
            let newItems = result.Items.map((item) =>  buildSnapshot(item));
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
