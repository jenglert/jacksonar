import React, { Component } from 'react';
import * as S3 from './S3.js';
import './styles/ImageDetail.css';
import { withRouter } from 'react-router';
import { IMAGES_PATH } from './App.js';

class ImageDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filename: props.match.params.filename
        }
    }

    imageClick = () => {
        this.props.history.push(IMAGES_PATH);
    }

    render() {
        const fn = this.state.filename;

        S3.getObjectData(fn).then((data) => {
            var blob = new Blob([data], { type: "image/jpeg" });
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL(blob);
            document.getElementById("img-det-" + fn).src = imageUrl;
        });

        return (
            <div className="image-detail-container">
                <img id={"img-det-" + fn} alt="Jackson" onClick={this.imageClick} />
            </div>
        );
    }
}

export default withRouter(ImageDetail);
