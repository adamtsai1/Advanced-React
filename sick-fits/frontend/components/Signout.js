import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';

import { CURRENT_USER_QUERY } from './User';
import Form from './styles/Form';

const SIGNOUT_MUTATION = gql`
    mutation SIGNOUT_MUTATION {
        signout {
            message
        }
    }
`;

class Signout extends Component {
    render() {
        const { user } = this.props;

        return (
            <Mutation mutation={SIGNOUT_MUTATION} refetchQueries={[ { query: CURRENT_USER_QUERY } ]}>
                {(signout) => (
                    <Link href="">
                        <a onClick={signout}>Sign Out {user.name}</a>
                    </Link>
                )}
            </Mutation>
        );
    }
}

export default Signout;
