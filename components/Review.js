import React, {Component} from "react";
import {Comment, Icon} from "semantic-ui-react";

class Review extends Component {
    render() {
        const review = this.props.review;

        return (
            <Comment>
                <Comment.Author as='b'>{review.reviewer}</Comment.Author>
                <Comment.Metadata>
                    {review.reviewScore} <Icon name='star'/>
                </Comment.Metadata>
                <Comment.Text>{review.reviewText}</Comment.Text>
            </Comment>
        );
    }
}

export default Review;

