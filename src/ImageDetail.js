import React, { Component } from 'react';
import * as S3 from './S3.js';
import './styles/ImageDetail.css';
import { withRouter } from 'react-router';
import { IMAGES_PATH } from './App.js';
import { getRecordDetails } from './DDB.js';
import { buildSnapshot } from './utils.js';
import Time from 'react-time';

class ImageDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filename: props.match.params.filename,
            recordData: false
        }
    }

    setDdbRecordOnState = (ddbRecord) => {
        this.setState({
            recordData: buildSnapshot(ddbRecord)
        });
    }

    componentWillMount() {
        const that = this;
        const fn = this.state.filename;

        S3.getObjectData(fn).then(data => {
            var blob = new Blob([data], { type: "image/jpeg" });
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL(blob);
            document.getElementById("img-det-" + fn).src = imageUrl;
        });

        getRecordDetails(fn).then(data => {
            if (data.Items && data.Items.length === 1) {
                that.setDdbRecordOnState(data.Items[0]);
            } else {
                console.error("Invalid response when retreiving record details.", data.Items);
            }
        });
    }

    imageClick = () => {
        this.props.history.push(IMAGES_PATH);
    }

    render() {
        const fn = this.state.filename;

        let imageDetailDivContents;

        if (this.state.recordData) {
            imageDetailDivContents = (<div id={"img-det-list-" + fn} className="img-det-list">
                <div><label>filename:</label> {this.state.recordData.filename}</div>
                <div><label>date: </label><Time value={this.state.recordData.date} format="h:mma MM/DD/YY" /></div>
                <div><label>temperature: </label>{this.state.recordData.tempInF}f</div>
                <div><label>humidity: </label>{this.state.recordData.humidity}%</div>
            </div>);
        }

        return (
            <div className="image-detail-container">
                <div>
                    <img id={"img-det-" + fn} alt="Jackson" onClick={this.imageClick} />
                </div>
                { imageDetailDivContents }
            </div>
        );
    }
}

export default withRouter(ImageDetail);
