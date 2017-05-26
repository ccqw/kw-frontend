import styled from 'styled-components';

import A from 'base/A';
import { fastEaseQuad } from 'shared/styles/animation';

export const Link = styled(A)`
  transition: all ${fastEaseQuad}, transform 100ms linear;
  cursor: pointer;
  opacity: .7;

  &:focus,
  &:hover {
    opacity: .9;
    outline: none;
  }

  &:active {
    opacity: 1;
    transform: scale(.9);
  }
`;