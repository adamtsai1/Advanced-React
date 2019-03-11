import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { ApolloConsumer } from 'react-apollo';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';

import AddToCart, { ADD_TO_CART_MUTATION } from './';
import { CURRENT_USER_QUERY } from '../User';
import { fakeUser, fakeCartItem } from '../../lib/testUtils';

const mocks = [
    {
        request: {
            query: ADD_TO_CART_MUTATION,
            variables: {
                id: 'abc123',
            },
        },
        result: {
            data: {
                addToCart: {
                    ...fakeCartItem(),
                    quantity: 1,
                },
            },
        },
    },
    {
        request: { query: CURRENT_USER_QUERY },
        result: {
            data: {
                me: {
                    ...fakeUser(),
                    cart: [],
                },
            },
        },
    },
];

describe('<AddToCart />', () => {
    it('renders and matches snapshot', async () => {
        const wrapper = mount(
            <MockedProvider>
                <AddToCart id="abc123" />
            </MockedProvider>
        );

        await wait();
        wrapper.update();

        expect(toJSON(wrapper.find('button'))).toMatchSnapshot();
    });
});
