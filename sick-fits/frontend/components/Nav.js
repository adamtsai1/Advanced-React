import React from 'react';
import Link from 'next/link';

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
