import styled from 'styled-components';
import { transparentize } from 'polished';

import { centerByPadding, gutter } from 'shared/styles/layout';
import { white, whiteDark } from 'shared/styles/colors';
import { bottomLight } from 'shared/styles/shadows';
import { resetList } from 'shared/styles/utils';

export const Header = styled.header`
  ${centerByPadding}
  ${gutter({ prop: 'margin', position: 'bottom', type: 'outer' })} /* logo unfortunately adds height already */
  grid-area: Header;
  position: relative;
  background-color: ${white};
  box-shadow: ${bottomLight};
  border-bottom: 1px solid ${transparentize(0.5, whiteDark)};
`;

export const Nav = styled.nav`
  ${gutter({ position: 'horizontal', type: 'outer' })} /* logo unfortunately adds height already */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Ul = styled.ul`
  ${resetList}
  display: flex;
  justify-content: center;
`;