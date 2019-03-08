import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Router from 'next/router';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';

import CreateItem, { CREATE_ITEM_MUTATION } from './';
import { fakeItem } from '../../lib/testUtils';
import { watchFile } from 'fs';

// Mock the global fetch API
const dogImage = 'https://dog.com/dog.jpg';
global.fetch = jest.fn().mockResolvedValue({
    json: () => ({
        secure_url: dogImage,
        eager: [{ secure_url: dogImage }],
    }),
});

describe('<CreateItem />', () => {
    it('renders and matches snapshot', () => {
        const wrapper = mount(
            <MockedProvider>
                <CreateItem />
            </MockedProvider>
        );

        const createItemForm = wrapper.find('form[data-test="create-item"]');
        expect(toJSON(createItemForm)).toMatchSnapshot();
    });

    it('uploads a file when changed', async () => {
        const wrapper = mount(
            <MockedProvider>
                <CreateItem />
            </MockedProvider>
        );

        const fileInput = wrapper.find('input[name="file"]');
        fileInput.simulate('change', {
            target: { files: ['fake-image.jpg'] },
        });

        await wait();
        wrapper.update();

        const component = wrapper.find('CreateItem').instance();
        expect(component.state.image).toEqual(dogImage);
        expect(component.state.largeImage).toEqual(dogImage);
        expect(global.fetch).toHaveBeenCalled();
        // global.fetch.mockClear();
    });

    it('handles state updating', async () => {
        const wrapper = mount(
            <MockedProvider>
                <CreateItem />
            </MockedProvider>
        );

        wrapper.find('input[name="file"]').simulate('change', {
            target: { files: ['fake-image.jpg'] },
        });

        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: fakeItem().title,
            },
        });

        wrapper.find('input[name="price"]').simulate('change', {
            target: {
                name: 'price',
                value: fakeItem().price,
            },
        });

        wrapper.find('textarea[name="description"]').simulate('change', {
            target: {
                name: 'description',
                value: fakeItem().description,
            },
        });

        await wait();
        wrapper.update();

        const component = wrapper.find('CreateItem').instance();
        expect(component.state).toMatchObject({
            image: dogImage,
            largeImage: dogImage,
            title: fakeItem().title,
            price: fakeItem().price,
            description: fakeItem().description,
        });

        // expect(component.state.image).toEqual(dogImage);
        // expect(component.state.largeImage).toEqual(dogImage);
        // expect(component.state.title).toEqual(fakeItem().title);
        // expect(component.state.price).toEqual(fakeItem().price);
        // expect(component.state.description).toEqual(fakeItem().description);
    });

    it('creates the item when the form is submitted', async () => {
        const item = fakeItem();
        const mocks = [
            {
                request: {
                    query: CREATE_ITEM_MUTATION,
                    variables: {
                        title: item.title,
                        description: item.description,
                        image: '',
                        largeImage: '',
                        price: item.price,
                    },
                },
                result: {
                    data: {
                        createItem: {
                            ...item,
                            __typename: 'Item',
                        },
                    },
                },
            },
        ];

        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <CreateItem />
            </MockedProvider>
        );

        wrapper.find('input[name="file"]').simulate('change', {
            target: { files: ['fake-image.jpg'] },
        });

        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: item.title,
            },
        });

        wrapper.find('input[name="price"]').simulate('change', {
            target: {
                name: 'price',
                value: item.price,
            },
        });

        wrapper.find('textarea[name="description"]').simulate('change', {
            target: {
                name: 'description',
                value: item.description,
            },
        });

        // Mock the router
        Router.router = { push: jest.fn() };
        wrapper.find('form').simulate('submit');
        await wait(500);
        wrapper.update();

        expect(Router.router.push).toHaveBeenCalled();
        expect(Router.router.push).toHaveBeenCalledWith({
            pathname: '/item',
            query: { id: 'abc123' },
        });
    });
});
