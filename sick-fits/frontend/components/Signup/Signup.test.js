import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Router from 'next/router';
import { ApolloConsumer } from 'react-apollo';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';

import Signup, { SIGNUP_MUTATION } from './';
import { CURRENT_USER_QUERY } from '../User';
import { fakeUser } from '../../lib/testUtils';

function simulateTyping(wrapper, name, value) {
    wrapper.find(`input[name="${name}"]`).simulate('change', {
        target: { name, value },
    });
}

const me = fakeUser();
const mocks = [
    // Signup mutation mock
    {
        request: {
            query: SIGNUP_MUTATION,
            variables: {
                email: me.email,
                name: me.name,
                password: 'wes',
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

    // Current User query mock
    {
        request: {
            query: CURRENT_USER_QUERY,
        },
        result: {
            data: { me },
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

        const signupForm = wrapper.find('form[data-test="signup"]');
        expect(toJSON(signupForm)).toMatchSnapshot();
    });

    it('handles state updating', async () => {
        const me = {
            email: 'adam.tsai@fostermade.co',
            name: 'Adam Tsai',
            password: 'abc123',
        };

        const wrapper = mount(
            <MockedProvider>
                <Signup />
            </MockedProvider>
        );

        simulateTyping(wrapper, 'email', me.email);
        simulateTyping(wrapper, 'name', me.name);
        simulateTyping(wrapper, 'password', me.password);

        await wait();
        wrapper.update();

        const signupComponent = wrapper.find('Signup').instance();
        expect(signupComponent.state).toMatchObject({
            email: me.email,
            name: me.name,
            password: me.password,
        });
    });
});
