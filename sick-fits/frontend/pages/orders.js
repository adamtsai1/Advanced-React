import React from 'react';

import OrderList from '../components/OrderList';
import PleaseSignIn from '../components/PleaseSignIn';

const OrdersPage = props => (
    <PleaseSignIn>
        <OrderList />
    </PleaseSignIn>
);

export default OrdersPage;
