import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';
import Form from './styles/Form';

const RESET_PASSWORD_MUTATION = gql`
    mutation RESET_PASSWORD_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
        resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
            id
            email
            name
        }
    }
`;

class ResetPassword extends Component {
    static propTypes = {
        resetToken: PropTypes.string.isRequired,
    };

    state = {
        password: '',
        confirmPassword: '',
    };

    saveToState = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        return (
            <Mutation
                mutation={RESET_PASSWORD_MUTATION}
                variables={{
                    resetToken: this.props.resetToken,
                    password: this.state.password,
                    confirmPassword: this.state.confirmPassword,
                }}
                refetchQueries={[
                    { query: CURRENT_USER_QUERY },
                ]}
            >
                {(resetPassword, { error, loading, called }) => (
                    <Form method="post" onSubmit={async e => {
                        e.preventDefault();
                        await resetPassword();
                        this.setState({ password: '', confirmPassword: '' });
                    }}>
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Reset Your Password</h2>

                            <ErrorMessage error={error} />

                            <label htmlFor="password">
                                Password
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={this.state.password}
                                    onChange={this.saveToState}
                                />
                            </label>

                            <label htmlFor="confirmPassword">
                                Confirm Password
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={this.state.confirmPassword}
                                    onChange={this.saveToState}
                                />
                            </label>

                            <button type="submit">Reset Password</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}

export default ResetPassword;
