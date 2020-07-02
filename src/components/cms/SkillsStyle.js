import styled from 'styled-components';
import StaffPick from '../../images/staff_pick.png';

export const SelectedText = styled.p`
  margin-left: 1.5rem;
  font-weight: bold;
  font-size: 0.875rem;
`;

export const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 0.625rem;
  background: #fff;
  height: 6.25rem;
  margin-bottom: 0.375rem;
`;

export const StaffPickImage = styled.img.attrs({
  src: StaffPick,
  alt: 'Staff Pick Badge',
})`
  margin: 0 0 0.5rem 0.5rem;
  height: 1.5rem;
  width: 1.5rem;
`;
