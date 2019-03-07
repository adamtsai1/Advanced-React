import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { format, formatDistance } from 'date-fns';
import gql from 'graphql-tag';
import Link from 'next/link';
import styled from 'styled-components';

import ErrorMessage from './ErrorMessage';
import OrderItemStyles from './styles/OrderItemStyles';
import formatMoney from '../lib/formatMoney';

const USER_ORDERS_QUERY = gql`
    query USER_ORDERS_QUERY {
        orders(orderBy: createdAt_DESC) {
            id
            total
            createdAt
            items {
                id
                title
                price
                description
                quantity
                image
            }
        }
    }
`;

const OrderUl = styled.ul`
    display: grid;
    grid-gap: 4rem;
    grid-template-columns: repeat(auto-fit, minmax(50%, 1fr));
`;

class OrderList extends Component {
    render() {
        return (
            <Query query={USER_ORDERS_QUERY}>
                {({ data, loading, error }) => {
                    if (error) {
                        return <ErrorMessage error={error} />;
                    }

                    if (loading) {
                        return <p>Loading...</p>;
                    }

                    const { orders } = data;
                    return (
                        <div>
                            <h2>You have {orders.length} order(s)</h2>

                            <OrderUl>
                                {orders.map(order => {
                                    console.log(order);
                                    return (
                                        <OrderItemStyles>
                                            <Link
                                                href={{
                                                    pathname: '/order',
                                                    query: { id: order.id },
                                                }}
                                            >
                                                <a>
                                                    <div className="order-meta">
                                                        <p>
                                                            {order.items.reduce(
                                                                (a, b) =>
                                                                    a +
                                                                    b.quantity,
                                                                0
                                                            )}{' '}
                                                            items
                                                        </p>

                                                        <p>
                                                            {order.items.length}{' '}
                                                            products
                                                        </p>

                                                        <p>
                                                            {formatDistance(
                                                                order.createdAt,
                                                                new Date()
                                                            )}
                                                        </p>

                                                        <p>
                                                            {formatMoney(
                                                                order.total
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="images">
                                                        {order.items.map(
                                                            item => (
                                                                <img
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    src={
                                                                        item.image
                                                                    }
                                                                    alt={
                                                                        item.title
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                </a>
                                            </Link>
                                        </OrderItemStyles>
                                    );
                                })}
                            </OrderUl>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default OrderList;
