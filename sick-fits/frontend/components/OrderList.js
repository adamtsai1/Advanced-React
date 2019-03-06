import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { format } from 'date-fns';
import gql from 'graphql-tag';
import Router from 'next/router';

import Table from './styles/Table';
import formatMoney from '../lib/formatMoney';

const ORDER_LIST_QUERY = gql`
    query ORDER_LIST_QUERY {
        orders {
            id
            total
            createdAt
        }
    }
`;

class OrderList extends Component {
    render() {
        return (
            <Query query={ORDER_LIST_QUERY}>
                {({ data, loading, error }) => {
                    console.log(data);
                    const { orders } = data;

                    return (
                        <div>
                            <h1>My Orders</h1>

                            <Table>
                                <thead>
                                    <tr>
                                        <th style={{ width: '100px' }}>
                                            Order ID
                                        </th>
                                        <th style={{ width: '100px' }}>
                                            Total
                                        </th>
                                        <th style={{ width: '100px' }}>Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {orders.map(order => (
                                        <tr
                                            onClick={() =>
                                                Router.push({
                                                    pathname: '/order',
                                                    query: {
                                                        id: order.id,
                                                    },
                                                })
                                            }
                                        >
                                            <td>{order.id}</td>
                                            <td>{formatMoney(order.total)}</td>
                                            <td>
                                                {format(
                                                    order.createdAt,
                                                    'MMMM d, YYYY h:mm a'
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default OrderList;
