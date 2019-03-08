import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import RequestReset, { REQUEST_RESET_MUTATION } from './';

const mocks = [
    {
        request: {
            query: REQUEST_RESET_MUTATION,
            variables: { email: 'adam.tsai@fostermade.co' },
        },
        result: {
            data: {
                requestReset: { __typename: 'Message', message: 'success' },
            },
        },
    },
];

describe('<RequestReset />', () => {
    it('renders and matches snapshot', () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <RequestReset />
            </MockedProvider>
        );

        const requestResetForm = wrapper.find(
            'form[data-test="request-reset"]'
        );

        expect(toJSON(requestResetForm)).toMatchSnapshot();
    });

    it('calls the mutation', async () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <RequestReset />
            </MockedProvider>
        );

        // Simulate typing an email
        wrapper.find('input').simulate('change', {
            target: {
                name: 'email',
                value: 'adam.tsai@fostermade.co',
            },
        });

        // Simulate submitting the form
        wrapper.find('form').simulate('submit');

        await wait();
        wrapper.update();

        expect(wrapper.find('p').text()).toContain(
            'Success! Check your email for a reset link!'
        );
    });
});
