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
    {
        request: { query: CURRENT_USER_QUERY },
        result: {
            data: {
                me: {
                    ...fakeUser(),
                    cart: [fakeCartItem()],
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

    it('adds an item to cart when clicked', async () => {
        let apolloClient;
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <ApolloConsumer>
                    {client => {
                        apolloClient = client;
                        return <AddToCart id="abc123" />;
                    }}
                </ApolloConsumer>
            </MockedProvider>
        );

        const {
            data: { me },
        } = await apolloClient.query({ query: CURRENT_USER_QUERY });

        expect(me.cart).toHaveLength(0);

        // Add an item to the cart
        wrapper.find('button').simulate('click');
        await wait();

        // Check if the item is in the cart
        const {
            data: { me: meAfterAddToCart },
        } = await apolloClient.query({ query: CURRENT_USER_QUERY });

        await wait();

        expect(meAfterAddToCart.cart).toHaveLength(1);
        expect(meAfterAddToCart.cart[0].id).toBe('omg123');
        expect(meAfterAddToCart.cart[0].quantity).toBe(3);
    });

    it('changes from add to adding when clicked', async () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <AddToCart id="abc123" />;
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        expect(wrapper.text()).toContain('Add To Cart');

        wrapper.find('button').simulate('click');
        expect(wrapper.text()).toContain('Adding To Cart');
    });
});
