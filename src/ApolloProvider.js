import React from 'react';
import App from './App';
import {InMemoryCache, ApolloProvider, ApolloClient, createHttpLink} from '@apollo/client';
import {setContext} from 'apollo-link-context'

const authLink = setContext(() =>{
    const token = localStorage.getItem('jwtToken');
    return{
        headers:{
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const url = createHttpLink({
    uri: 'https://merngserveramin.herokuapp.com'
})

const client = new ApolloClient({
    link: authLink.concat(url),
    cache: new InMemoryCache()
});



function ApolloProvide(){
    return(
        <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
    )
}

export default ApolloProvide;
