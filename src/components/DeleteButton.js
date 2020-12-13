import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react'
import {Button, Icon, Confirm} from 'semantic-ui-react';
import {FETCH_POSTS_QUERY} from './../utils/graphql';

export default function DeleteButton({postId, commentId, callback}) {
    const [isOpen, setOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT : DELETE_POST;


    const [deleteAction] = useMutation(mutation, {
        variables: {
            postId,
            commentId
        },
        update(proxy){
            setOpen(false);
            if(!commentId){
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                const newPosts = data.getPosts.filter(p => p.id !== postId);
                const newData = {...data, getPosts: newPosts};
                proxy.writeQuery({query: FETCH_POSTS_QUERY, data: newData});
            }
            if(callback) callback();
        }
    })
    return (
        <>
        <Button as="div" color="red" onClick={() => setOpen(true)} floated="right">
        <Icon name="trash" style={{margin: 0}}/>
      </Button>
      <Confirm
      open={isOpen}
      onCancel={() => setOpen(false)}
      onConfirm={deleteAction}
      />
      </>
    )
}


const DELETE_POST = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`;

const DELETE_COMMENT = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id
            comments{
                id
                username
                createdAt
                body
            }
            commentCount
        }
    }
`;