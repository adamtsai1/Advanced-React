import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { ApolloConsumer } from 'react-apollo';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';

import RemoveFromCart, { DELETE_CART_ITEM_MUTATION } from './';
import { CURRENT_USER_QUERY } from '../User';
import { fakeCartItem, fakeUser } from '../../lib/testUtils';

const mocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: {
            data: {
                me: {
                    ...fakeUser(),
                    cart: [fakeCartItem({ id: 'abc123' })],
                },
            },
        },
    },
    {
        request: {
            query: DELETE_CART_ITEM_MUTATION,
            variables: { id: 'abc123' },
        },
        result: {
            data: {
                removeFromCart: {
                    __typename: 'CartItem',
                    id: 'abc123',
                },
            },
        },
    },
];

describe('<RemoveFromCart />', () => {
    it('renders and matches snapshot', () => {
        const wrapper = mount(
            <MockedProvider>
                <RemoveFromCart id="abc123" />
            </MockedProvider>
        );

        expect(toJSON(wrapper.find('button'))).toMatchSnapshot();
    });

    it('removes the item from cart', async () => {
        let apolloClient;
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <ApolloConsumer>
                    {client => {
                        apolloClient = client;
                        return <RemoveFromCart id="abc123" />;
                    }}
                </ApolloConsumer>
            </MockedProvider>
        );

        const {
            data: { me },
        } = await apolloClient.query({ query: CURRENT_USER_QUERY });

        expect(me.cart).toHaveLength(1);
        expect(me.cart[0].item.price).toBe(5000);
        wrapper.find('button').simulate('click');
        await wait();

        const {
            data: { me: meAfterItemRemove },
        } = await apolloClient.query({ query: CURRENT_USER_QUERY });
        expect(meAfterItemRemove.cart).toHaveLength(0);
    });
});
