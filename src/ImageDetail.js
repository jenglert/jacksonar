import React, { Component } from 'react';
import * as S3 from './S3.js';
import './styles/ImageDetail.css';
import { withRouter } from 'react-router';
import { IMAGES_PATH } from './App.js';
import { getRecordDetails, markIsJackson, scanNext } from './DDB.js';
import { buildSnapshot } from './utils.js';
import Time from 'react-time';

class ImageDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filename: props.match.params.filename,
            date: false,
            recordData: false
        }
    }

    setDdbRecordOnState = (ddbRecord) => {
        this.setState({
            recordData: buildSnapshot(ddbRecord),
            date: ddbRecord.date['S']
        });
    }

    loadSnapshot = (filename) => {
        const that = this;

        S3.getObjectData(filename).then(data => {
            var blob = new Blob([data], { type: "image/jpeg" });
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL(blob);
            document.getElementById('the-img').src = imageUrl;
        });

        getRecordDetails(filename).then(data => {
            if (data.Items && data.Items.length === 1) {
                that.setDdbRecordOnState(data.Items[0]);
            } else {
                console.error("Invalid response when retreiving record details.", data.Items);
            }
        });
    }

    navigate = (backwards) => {
        const that = this;
        scanNext(this.state.date, backwards)
            .then(filename => {
                that.props.history.push('/image-detail/' + filename);
            })
            .catch(err => {
                console.error("Unable to go to the next page: " + err);
            });
    }

    componentDidMount() {
        this.loadSnapshot(this.state.filename);
    }

    componentWillReceiveProps(nextProps) {
        this.loadSnapshot(nextProps.match.params.filename);
    }

    imageClick = () => {
        this.props.history.push(IMAGES_PATH);
    }

    isJacksonClick = (isJackson) => {
        const that = this;

        markIsJackson(this.state.date, isJackson)
            .then(result => {
                that.loadSnapshot(that.state.filename);
            })
            .catch(err => {
                console.error("Unable to update is jackson: " + err);
            });
    }

    renderIsJacksonButtons = () => {
        return (
            <div className="is-jackson">
                <button onClick={() => this.isJacksonClick(true)}>
                    It's Jackson
                </button>
                <button onClick={() => this.isJacksonClick(false)}>
                    It's not Jackson
                </button>
            </div>);
    }

    render() {
        const fn = this.state.filename;

        let imageDetailDivContents;

        if (this.state.recordData) {
            imageDetailDivContents = (<div className="img-det-list">
                <div><label>filename:</label> {this.state.recordData.filename}</div>
                <div><label>date: </label><Time value={this.state.recordData.date} format="h:mma MM/DD/YY" /></div>
                <div><label>temperature: </label>{this.state.recordData.tempInF}f</div>
                <div><label>humidity: </label>{this.state.recordData.humidity}%</div>
                <div><label>is JR: </label>{this.state.recordData.isJackson}</div>
                {this.renderIsJacksonButtons()}
            </div>);
        }

        return (
            <div>
                <div className="image-detail-container">
                    <div>
                        <img id={"the-img"} alt="Jackson" onClick={this.imageClick} />
                    </div>
                    {imageDetailDivContents}
                </div>
                <div className="navigation">
                    <button onClick={() => this.navigate(true)}> Previous </button>
                    <button onClick={() => this.navigate(false)}> Next </button>
                </div>
            </div>
        );
    }
}

export default withRouter(ImageDetail);
