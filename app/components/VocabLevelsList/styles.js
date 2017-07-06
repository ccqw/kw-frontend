import styled from 'styled-components';
import { rgba } from 'polished';

import { resetList } from 'shared/styles/utils';
import { gutter } from 'shared/styles/layout';
import { greyLight } from 'shared/styles/colors';

export const Ul = styled.ul`
  ${resetList}
  ${gutter({ prop: 'margin', type: 'outer', position: 'vertical' })}
  ${gutter({ prop: 'margin', type: 'inner', position: 'horizontal' })}
  display: flex;
  flex-flow: row wrap;
  border: 1px solid ${rgba(greyLight, 0.5)};
  > li {
    ${gutter({ type: 'inner', position: 'horizontal' })}
    flex: 1 0 400px;
    border: 1px solid ${rgba(greyLight, 0.5)};
  }
`;
