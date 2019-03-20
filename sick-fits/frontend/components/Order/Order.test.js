import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { ApolloConsumer } from 'react-apollo';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';

import Order, { SINGLE_ORDER_QUERY } from './';
import { fakeOrder } from '../../lib/testUtils';

const mocks = [
    {
        request: {
            query: SINGLE_ORDER_QUERY,
            variables: {
                id: 'abc123',
            },
        },
        result: {
            data: {
                order: {
                    ...fakeOrder(),
                    updatedAt: null,
                },
            },
        },
    },
];

describe('<Order />', () => {
    it('renders and matches the snapshot', async () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <Order id="abc123" />
            </MockedProvider>
        );

        await wait();
        wrapper.update();

        const order = wrapper.find('div[data-test="order"]');
        expect(toJSON(order)).toMatchSnapshot();
    });
});
