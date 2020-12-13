import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Button, Icon, Label} from 'semantic-ui-react';


export default function LikeButton({post: {id, likes, likeCount}, user}){
    const [liked, setLiked] = useState(false);
    useEffect(() => {
        if(user && likes.find(like => like.username === user.username)){
            setLiked(true);
        }else{
            setLiked(false);
        }
    }, [user, likes])

    const[likePost] = useMutation(LIKE_POST, {
        variables: {postId: id}
    });

    const likeButton = user ? (
        liked ? (
            <Button color='teal' filled="true" onClick={likePost}>
        <Icon name='heart' />
      </Button>
        ) : (
            <Button color='teal' basic onClick={likePost}>
        <Icon name='heart' />
      </Button>
        )
    ) : (
        <Button color='teal' basic as={Link} to="/login">
        <Icon name='heart' />
      </Button>
    )
    return(
        <Button as='div' labelPosition='right'>
      {likeButton}
      <Label basic color='teal' pointing='left'>
        {likeCount}
      </Label>
    </Button>
    )
}

const LIKE_POST = gql`
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
            likes{
                id username
            }
            likeCount
        }
    }
`;