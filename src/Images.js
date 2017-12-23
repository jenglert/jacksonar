import React, { Component } from 'react';
import * as S3 from './S3.js';

class Images extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fileNames: ["loading"],
            isLoading: true
        }

        S3.listBucket(3).then((result) => {
            this.setState({ fileNames: result, isLoading: false });
        });
    }

    render() {
        if (this.state.isLoading) {
            return (<div>It's loading!!!</div>)
        } else {

            const listItems = this.state.fileNames.map((fn) => {

                S3.getObjectData(fn).then((data) => {
                    var blob = new Blob( [ data ], { type: "image/jpeg" } );
                    var urlCreator = window.URL || window.webkitURL;
                    var imageUrl = urlCreator.createObjectURL( blob );
                    document.getElementById("img-" + fn).src = imageUrl;
                });

                return (
                    <li key={fn}>
                        <img id={"img-" + fn} src="" alt="" height="25%" width="25%" /> <br />

                        {fn}
                    </li>
                );
            });

            return (
                <ul>
                    {listItems}
                </ul>
            );
        }
    }


}

export default Images;
