import React, { Component } from 'react';
import * as S3 from './S3.js';
import Time from 'react-time'
import './styles/Snapshot.css';
import { withRouter } from 'react-router-dom';

class Snapshot extends Component {

    onSnapshotClick = (filename) => {
        this.props.history.push('/image-detail/' + filename);
    }

    render() {
        const fn = this.props.filename;
        const date = this.props.date;
        const tempInF = this.props.tempInF;
        const humidity = this.props.humidity;

        S3.getObjectData(fn).then((data) => {
            var blob = new Blob([data], { type: "image/jpeg" });
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL(blob);
            document.getElementById("img-" + fn).src = imageUrl;
        })

        return (
            <div key={fn} className="snapshot" onClick={() => this.onSnapshotClick(fn)} >
                <img id={"img-" + fn} src="" alt=""  />
                <div className="time">
                    <Time value={date} format="h:mm a"  />
                </div>
                <div className="temp">
                    <div>{tempInF}&#176;F</div>
                </div>
                <div className="humidity">
                    <div>{humidity}%</div>
                </div>
            </div>
        );
    }
}

export default withRouter(Snapshot);
