import React from 'react';
import Team from '../../../../components/About/Team';
import { shallow, mount } from 'enzyme';
import Card from '@material-ui/core/Card';
// eslint-disable-next-line no-undef
jest.mock('../../../../apis/index');
// eslint-disable-next-line no-undef
jest.mock('../../../../constants/team');
describe('<Team />', () => {
  it('render Team without crashing', () => {
    shallow(<Team location={{ pathname: '/team' }} />);
  });

  it('renders contributor data fetched from api', (done) => {
    // eslint-disable-next-line no-undef
    const wrapper = mount(<Team />);
    const testNames = [
      'MEMBER 1',
      'MEMBER 2',
      'MANAGER 1Event Manager',
      'MANAGER 2Community and Project Manager',
      'contributer1',
      'contributer2',
    ];
    setTimeout(() => {
      wrapper.update();
      const cards = wrapper.find(Card.displayName);
      // eslint-disable-next-line max-nested-callbacks
      cards.forEach((card, i) => {
        expect(card.text() === testNames[i]).toBeTruthy();
      });
      done();
    });
  });
});
