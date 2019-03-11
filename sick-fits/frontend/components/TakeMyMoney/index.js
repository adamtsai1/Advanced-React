import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import StripeCheckout from 'react-stripe-checkout';
import gql from 'graphql-tag';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';

import calcTotalPrice from '../../lib/calcTotalPrice';
import ErrorMessage from '../ErrorMessage';
import User, { CURRENT_USER_QUERY } from '../User';

const CREATE_ORDER_MUTATION = gql`
    mutation createOrder($token: String!) {
        createOrder(token: $token) {
            id
            charge
            total
            items {
                id
                title
            }
        }
    }
`;

function totalItems(cart) {
    return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

class TakeMyMoney extends Component {
    onToken = async (response, createOrder) => {
        NProgress.start();

        const order = await createOrder({
            variables: {
                token: response.id,
            },
        }).catch(error => {
            alert(error.message);
        });

        Router.push({
            pathname: '/order',
            query: { id: order.data.createOrder.id },
        });
    };

    render() {
        return (
            <User>
                {({ data: { me }, loading }) => {
                    if (loading) {
                        return null;
                    }

                    return (
                        <Mutation
                            mutation={CREATE_ORDER_MUTATION}
                            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
                        >
                            {createOrder => (
                                <StripeCheckout
                                    amount={calcTotalPrice(me.cart)}
                                    name="Sick Fits"
                                    description={`Order of ${totalItems(
                                        me.cart
                                    )} items`}
                                    image={
                                        me.cart.length > 0 &&
                                        me.cart[0].item &&
                                        me.cart[0].item.image
                                    }
                                    stripeKey="pk_test_XlBaSXoYmaCqiN5hr6sgIAis"
                                    currency="USD"
                                    email={me.email}
                                    token={response =>
                                        this.onToken(response, createOrder)
                                    }
                                >
                                    {this.props.children}
                                </StripeCheckout>
                            )}
                        </Mutation>
                    );
                }}
            </User>
        );
    }
}

export default TakeMyMoney;
export { CREATE_ORDER_MUTATION };
