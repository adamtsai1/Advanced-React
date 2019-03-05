import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const BigButton = styled.button`
    font-size: 3rem;
    background: none;
    border: none;
    &:hover {
        color: ${props => props.theme.red};
        cursor: pointer;
    }
`;

import { CURRENT_USER_QUERY } from './User';

const DELETE_CART_ITEM_MUTATION = gql`
    mutation DELETE_CART_ITEM_MUTATION($id: ID!) {
        removeFromCart(id: $id) {
            id
        }
    }
`;

class RemoveFromCart extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
    };

    // This gets called as soon as we get a response from the server after a mutation has been performed.
    // You can use this instead of refetchQueries.
    update = (cache, payload) => {

        // 1. Read the cache
        const data = cache.readQuery({ query: CURRENT_USER_QUERY });

        // 2. Remove that item from the cart
        const cartItemId = payload.data.removeFromCart.id;
        data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);

        // 3. Write it back to the cache
        cache.writeQuery({ query: CURRENT_USER_QUERY, data });
    };

    render() {
        return (
            <Mutation
                mutation={DELETE_CART_ITEM_MUTATION}
                variables={{ id: this.props.id }}
                update={this.update}
                optimisticResponse={{
                    __typename: 'Mutation',
                    removeFromCart: {
                        __typename: 'CartItem',
                        id: this.props.id,
                    },
                }}
            >
                {(deleteCartItem, { loading, }) => (
                    <BigButton
                        disabled={loading}
                        title="Delete Item"
                        onClick={() => {
                            deleteCartItem().catch(error => alert(error.message));
                        }}
                    >&times;</BigButton>
                )}
            </Mutation>
        );
    }
}

export default RemoveFromCart;
