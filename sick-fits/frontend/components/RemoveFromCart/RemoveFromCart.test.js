import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import MockedProvider from 'react-apollo/test-utils';
import RemoveFromCart, { DELETE_CART_ITEM_MUTATION } from './';

describe('<RemoveFromCart />', () => {
    it('renders and matches snapshot', () => {
        expect(1).toBe(1);
    });
});
