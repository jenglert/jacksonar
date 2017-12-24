import React, { Component } from 'react';
import * as S3 from './S3.js';
import Time from 'react-time'
import './Snapshot.css';

class Snapshot extends Component {

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
        });

        return (
            <div key={fn} className="snapshot">
                <div class="snapshot-layout">
                    <div class="image">
                        <img id={"img-" + fn} src="" alt="" height="270" width="320" /> 
                    </div>
                    <div class="stats">
                        <div class="time">
                            <Time value={date} titleFormat="YYYY/MM/DD HH:mm" relative />
                        </div>
                        <div class="temp-and-humidity">
                            <div>{tempInF}&#176;F</div>
                            <div>{humidity}%</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Snapshot;
