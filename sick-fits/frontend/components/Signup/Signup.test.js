import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Router from 'next/router';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';

import Signup, { SIGNUP_MUTATION } from './';
import { CURRENT_USER_QUERY } from '../User';
import { fakeUser } from '../../lib/testUtils';

const me = fakeUser();
const mocks = [
    {
        request: {
            query: SIGNUP_MUTATION,
            variables: {
                email: me.email,
                name: me.name,
                password: 'test123',
            },
        },
        result: {
            data: {
                signup: {
                    __typename: 'User',
                    id: 'abc123',
                    email: me.email,
                    name: me.name,
                },
            },
        },
    },
];

describe('<Signup />', () => {
    it('renders and matches snapshot', () => {
        const wrapper = mount(
            <MockedProvider>
                <Signup />
            </MockedProvider>
        );

        console.log(wrapper.debug());
    });
});
