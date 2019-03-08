import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';

import Nav from './';
import { CURRENT_USER_QUERY } from '../User';
import { fakeUser } from '../../lib/testUtils';

const notSignedInMocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: { data: { me: null } },
    },
];

const signedInMocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: { data: { me: fakeUser() } },
    },
];

const signedInMocksWithCartItems = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: {
            data: {
                me: {
                    ...fakeUser(),
                    cart: [
                        {
                            __typename: 'CartItem',
                            id: 1,
                            quantity: 1,
                            item: {
                                __typename: 'Item',
                                id: 1,
                                title: 'test',
                                description: 'test',
                                price: 1,
                                image: 'test',
                                largeImage: 'test',
                            },
                        },
                        {
                            __typename: 'CartItem',
                            id: 2,
                            quantity: 1,
                            item: {
                                __typename: 'Item',
                                id: 2,
                                title: 'test',
                                description: 'test',
                                price: 1,
                                image: 'test',
                                largeImage: 'test',
                            },
                        },
                        {
                            __typename: 'CartItem',
                            id: 3,
                            quantity: 1,
                            item: {
                                __typename: 'Item',
                                id: 3,
                                title: 'test',
                                description: 'test',
                                price: 1,
                                image: 'test',
                                largeImage: 'test',
                            },
                        },
                    ],
                },
            },
        },
    },
];

describe('<Nav />', () => {
    it('renders a minimal nav when signed out', async () => {
        const wrapper = mount(
            <MockedProvider mocks={notSignedInMocks}>
                <Nav />
            </MockedProvider>
        );

        await wait();
        wrapper.update();

        const nav = wrapper.find('[data-test="nav"]');
        expect(toJSON(nav)).toMatchSnapshot();
    });

    it('renders a full nav when signed in', async () => {
        const wrapper = mount(
            <MockedProvider mocks={signedInMocks}>
                <Nav />
            </MockedProvider>
        );

        await wait();
        wrapper.update();

        const nav = wrapper.find('ul[data-test="nav"]');
        expect(nav.children().length).toBe(6);
        expect(nav.text()).toContain('Sign Out');
        // expect(toJSON(nav)).toMatchSnapshot(); // This creates a huge snapshot because of SignOut component. Use other methods instead.
    });

    it('renders the number of items in the cart', async () => {
        const wrapper = mount(
            <MockedProvider mocks={signedInMocksWithCartItems}>
                <Nav />
            </MockedProvider>
        );

        await wait();
        wrapper.update();

        const nav = wrapper.find('ul[data-test="nav"]');
        const count = nav.find('div.count');

        expect(toJSON(count)).toMatchSnapshot();
    });
});
