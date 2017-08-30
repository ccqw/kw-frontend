import styled from 'styled-components';
import { placeholder } from 'polished';

import { gutter } from 'shared/styles/layout';
import { zeta } from 'shared/styles/typography';
import { borderRadius } from 'shared/styles/sizing';
import { greyLight, grey, orange } from 'shared/styles/colors';

export const Form = styled.form`
  display: flex;
  flex-flow: column nowrap;
  justify-content: inherit;
  align-content: inherit;
  align-items: inherit;
  width: 100%;
  max-width: 900px;
  min-width: 320px;
`;

export const TextArea = styled.textarea`
  ${gutter({ type: 'outer', prop: 'padding' })}
  ${gutter({ prop: 'margin' })}
  ${placeholder({ color: grey })};
  ${zeta}
  width: 100%;
  max-width: 100%;
  resize: none;
  border-radius: ${borderRadius};

  &:not(:focus) {
    border: 1px dashed ${greyLight};
  }
`;

export const Controls = styled.div`
  ${gutter({ position: 'vertical' })};
  ${gutter({ position: 'horizontal', mod: 2 })};
  flex: 1 0 100%;
`;

export const Block = styled.div`
  ${gutter()}
  display: flex;
  flex-flow: column nowrap;
`;

export const Label = styled.label`
  display: flex;
  flex-flow: row wrap;
  align-content: center;
  align-items: center;
  & > * {
    ${gutter()}
    display: block;
  }
`;

export const Note = styled.div`
  ${gutter()}
  font-style: italic;
`;

export const ValidationMessage = styled.div`
  ${gutter()}
  flex: 1 0 100%;
  font-size: .9em;
  font-style: italic;
  color: ${orange};
`;
