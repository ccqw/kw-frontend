import styled from 'styled-components';

import A from 'common/components/A';
import { ghost } from 'common/styles/utils';
import { fastEaseQuad } from 'common/styles/animation';

export const Link = styled(A)`
  transition: all ${fastEaseQuad}, transform 100ms linear;
  cursor: pointer;
  opacity: .7;
  ${({ visuallyHidden }) => visuallyHidden && ghost}

  &:focus,
  &:hover {
    opacity: 1;
    outline: none;
  }

  &:active {
    opacity: 1;
  }

  & > * {
    transform: scale(1);
    &:active {
      transform: scale(.9);
    }
  }
`;
