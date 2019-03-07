import Item from '../components/Item';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

const fakeItem = {
    id: 'ABC123',
    title: 'A cool item',
    price: 4000,
    description: 'This item is cool',
    image: 'dog.jpg',
    largeImage: 'dog-large.jpg',
};

describe('<Item />', () => {
    it('renders and matches the snapshot', () => {
        const wrapper = shallow(<Item item={fakeItem} />);
        expect(toJSON(wrapper)).toMatchSnapshot();
    });

    // it('renders the PriceTag and title properly', () => {
    //     const wrapper = shallow(<Item item={fakeItem} />);
    //     const PriceTag = wrapper.find('PriceTag');
    //     // console.log(wrapper.debug());
    //     // console.log(PriceTag.text());
    //     // console.log(PriceTag.div().text());
    //     // console.log(PriceTag.children().text());
    //     expect(PriceTag.children().text()).toBe('$50');
    //     expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
    // });
    // it('renders the image properly', () => {
    //     const wrapper = shallow(<Item item={fakeItem} />);
    //     const img = wrapper.find('img');
    //     expect(img.props().src).toBe(fakeItem.image);
    //     expect(img.props().alt).toBe(fakeItem.title);
    // });
    // it('renders out the buttons properly', () => {
    //     const wrapper = shallow(<Item item={fakeItem} />);
    //     const buttonList = wrapper.find('.buttonList');
    //     expect(buttonList.children()).toHaveLength(3);
    //     expect(buttonList.children().find('Link')).toHaveLength(1);
    //     expect(
    //         buttonList
    //             .children()
    //             .find('AddToCart')
    //             .exists()
    //     ).toBe(true);
    //     expect(buttonList.children().find('DeleteItem')).toHaveLength(1);
    // });
});
