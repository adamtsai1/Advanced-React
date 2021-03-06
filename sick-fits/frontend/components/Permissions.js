import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import ErrorMessage from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

const permissions = [
    'ADMIN',
    'USER',
    'ITEMCREATE',
    'ITEMUPDATE',
    'ITEMDELETE',
    'PERMISSIONUPDATE',
];

const ALL_USERS_QUERY = gql`
    query ALL_USERS_QUERY {
        users {
            id
            name
            email
            permissions
        }
    }
`;

const UPDATE_USER_PERMISSIONS_MUTATION = gql`
    mutation UPDATE_USER_PERMISSIONS_MUTATION(
        $permissions: [Permission]!
        $userId: String!
    ) {
        updatePermissions(permissions: $permissions, userId: $userId) {
            id
            name
            email
            permissions
        }
    }
`;

const Permissions = props => (
    <Query query={ALL_USERS_QUERY}>
        {({ data, loading, error }) => (
            <div>
                <ErrorMessage error={error} />
                <div>
                    <h1>Manage Permissions</h1>
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                {permissions.map(permission => (
                                    <th key={permission}>{permission}</th>
                                ))}
                                <th />
                            </tr>
                        </thead>

                        <tbody>
                            {data.users.map(user => (
                                <UserPermissions key={user.id} user={user} />
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        )}
    </Query>
);

class UserPermissions extends Component {
    static propTypes = {
        user: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            email: PropTypes.string,
            permissions: PropTypes.array,
        }).isRequired,
    };

    state = {
        permissions: this.props.user.permissions,
    };

    handlePermissionChange = (event, updatePermissions) => {
        const checkbox = event.target;

        // Take a copy of the current permissions
        let updatedPermissions = [...this.state.permissions];

        // Figure out if we need to remove or add this permission
        if (checkbox.checked) {
            updatedPermissions.push(checkbox.value);
        } else {
            updatedPermissions = updatedPermissions.filter(
                permission => permission !== checkbox.value
            );
        }

        this.setState({ permissions: updatedPermissions }, updatePermissions);
    };

    render() {
        const user = this.props.user;

        return (
            <Mutation
                mutation={UPDATE_USER_PERMISSIONS_MUTATION}
                variables={{
                    permissions: this.state.permissions,
                    userId: user.id,
                }}
            >
                {(updatePermissions, { data, loading, error }) => {
                    return (
                        <>
                            {error && (
                                <tr>
                                    <td colspan="9">
                                        <ErrorMessage error={error} />
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                {permissions.map(permission => (
                                    <td key={permission}>
                                        <label
                                            htmlFor={`${user.id -
                                                permission}-${permission}}`}
                                        >
                                            <input
                                                id={`${user.id -
                                                    permission}-${permission}}`}
                                                type="checkbox"
                                                checked={this.state.permissions.includes(
                                                    permission
                                                )}
                                                value={permission}
                                                onChange={event =>
                                                    this.handlePermissionChange(
                                                        event,
                                                        updatePermissions
                                                    )
                                                }
                                            />
                                        </label>
                                    </td>
                                ))}

                                <td>
                                    <SickButton
                                        type="button"
                                        disabled={loading}
                                        onClick={updatePermissions}
                                    >
                                        Updat{loading ? 'ing' : 'e'}
                                    </SickButton>
                                </td>
                            </tr>
                        </>
                    );
                }}
            </Mutation>
        );
    }
}

export default Permissions;
