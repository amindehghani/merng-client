import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useForm } from './../utils/hooks'
import {FETCH_POSTS_QUERY} from './../utils/graphql'

export default function PostForm() {

    const {values, onChange, onSubmit} = useForm(createPostCallback, {
        body: ''
    });

    const [createPost, {error}] = useMutation(CREATE_POST, {
        variables: values,
        update(proxy, result){
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            const newGetPosts = [result.data.createPost, ...data.getPosts];
            const newData = {...data, getPosts: newGetPosts};
            proxy.writeQuery({query: FETCH_POSTS_QUERY, data: newData
            });
            values.body = '';
        },
        onError(){
            return;
        }
    })

    function createPostCallback(){
        createPost();
    }

    return (
        <>
        <Form onSubmit={onSubmit}>
            <h2>Create a post:</h2>
            <Form.Field>
                <Form.Input
                    placeholder="Hi World!"
                    name="body"
                    onChange={onChange}
                    value={values.body}
                    error={error ? true : false}
                />
                <Button type="submit" color="teal">
                    Submit
                </Button>
            </Form.Field>
        </Form>
        {
            error && (
                <div className="ui error message" style={{marginBottom: 20}}>
                    <ul className="list">
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )
        }
        </>
    )
}

const CREATE_POST = gql`
    mutation createPost($body: String!){
        createPost(body: $body){
            id body createdAt username
            likes{
                id username createdAt
            }
            likeCount
            comments{
                id body username createdAt
            }
            commentCount
        }
    }
`;