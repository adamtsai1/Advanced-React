import { MockedProvider } from 'react-apollo/test-utils';
import { mount } from 'enzyme';
import Router from 'next/router';
import wait from 'waait';
import Pagination, { PAGINATION_QUERY } from '../components/Pagination';

Router.router = {
    push() {},
    prefetch() {},
};

function makeMocksFor(length) {
    return [
        {
            request: { query: PAGINATION_QUERY },
            result: {
                data: {
                    itemsConnection: {
                        __typename: 'aggregate',
                        aggregate: {
                            __typename: 'count',
                            count: length,
                        },
                    },
                },
            },
        },
    ];
}

describe('<Pagination />', () => {
    it('displays a loading message', async () => {
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(1)}>
                <Pagination page={1} />
            </MockedProvider>
        );

        expect(wrapper.text()).toContain('Loading...');
    });

    it('renders pagination for single page', async () => {
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(3)}>
                <Pagination page={1} />
            </MockedProvider>
        );

        await wait();
        wrapper.update();

        const pagination = wrapper.find('div[data-test="pagination"]');
        const prevButtonDisabled = pagination
            .find('.prev')
            .prop('aria-disabled');

        const nextButtonDisabled = pagination
            .find('.next')
            .prop('aria-disabled');

        const currentPage = pagination.find('.current-page').text();
        const totalPages = pagination.find('.total-pages').text();

        expect(prevButtonDisabled).toBe(true);
        expect(nextButtonDisabled).toBe(true);
        expect(currentPage).toBe('1');
        expect(totalPages).toBe('1');
    });

    it('renders pagination for multiple pages and viewing page 1', async () => {
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(10)}>
                <Pagination page={1} />
            </MockedProvider>
        );

        await wait();
        wrapper.update();

        const pagination = wrapper.find('div[data-test="pagination"]');
        const prevButtonDisabled = pagination
            .find('.prev')
            .prop('aria-disabled');

        const nextButtonDisabled = pagination
            .find('.next')
            .prop('aria-disabled');

        const currentPage = pagination.find('.current-page').text();
        const totalPages = pagination.find('.total-pages').text();

        expect(prevButtonDisabled).toBe(true);
        expect(nextButtonDisabled).toBe(false);
        expect(currentPage).toBe('1');
        expect(totalPages).toBe('3');
    });

    it('renders pagination for multiple pages and viewing middle page', async () => {
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(10)}>
                <Pagination page={2} />
            </MockedProvider>
        );

        await wait();
        wrapper.update();

        const pagination = wrapper.find('div[data-test="pagination"]');
        const prevButtonDisabled = pagination
            .find('.prev')
            .prop('aria-disabled');

        const nextButtonDisabled = pagination
            .find('.next')
            .prop('aria-disabled');

        const currentPage = pagination.find('.current-page').text();
        const totalPages = pagination.find('.total-pages').text();

        expect(prevButtonDisabled).toBe(false);
        expect(nextButtonDisabled).toBe(false);
        expect(currentPage).toBe('2');
        expect(totalPages).toBe('3');
    });

    it('renders pagination for multiple pages and viewing last page', async () => {
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(10)}>
                <Pagination page={3} />
            </MockedProvider>
        );

        await wait();
        wrapper.update();

        const pagination = wrapper.find('div[data-test="pagination"]');
        const prevButtonDisabled = pagination
            .find('.prev')
            .prop('aria-disabled');

        const nextButtonDisabled = pagination
            .find('.next')
            .prop('aria-disabled');

        const currentPage = pagination.find('.current-page').text();
        const totalPages = pagination.find('.total-pages').text();

        expect(prevButtonDisabled).toBe(false);
        expect(nextButtonDisabled).toBe(true);
        expect(currentPage).toBe('3');
        expect(totalPages).toBe('3');
    });
});
