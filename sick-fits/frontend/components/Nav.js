import React from 'react';
import { Mutation } from 'react-apollo';
import Link from 'next/link';

import { TOGGLE_CART_MUTATION } from './Cart';
import Signout from './Signout';
import User from './User';
import NavStyles from './styles/NavStyles';

const Nav = () => (
    <User>
        {({ data: { me } }) => (
            <NavStyles>
                <Link href="/items">
                    <a>Shop</a>
                </Link>

                {me && (
                    <React.Fragment>
                        <Link href="/sell">
                            <a>Sell</a>
                        </Link>

                        <Link href="/orders">
                            <a>Orders</a>
                        </Link>

                        <Link href="/me">
                            <a>Account</a>
                        </Link>

                        <Signout user={me} />

                        <Mutation mutation={TOGGLE_CART_MUTATION}>
                            {(toggleCart) => (
                                <button onClick={toggleCart}>My Cart</button>
                            )}
                        </Mutation>
                    </React.Fragment>
                )}

                {!me && (
                    <Link href="/signup">
                        <a>Sign-up</a>
                    </Link>
                )}
            </NavStyles>
        )}
    </User>
);

export default Nav;
