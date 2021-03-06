import styled from "styled-components";
import { transparentize } from "polished";
import * as COLORS from "common/styles/colors";
import { gutter } from "common/styles/layout";

const fullWidthMixin = ({ fullWidth }) => `max-width: ${fullWidth ? "100%" : "70%"};`;

const borderColorMixin = ({ color, fade }) => {
  const dividerColor = COLORS[color] || color;
  return fade ? `
    border-image: linear-gradient(
      90deg,
      ${transparentize(1, dividerColor)},
      ${transparentize(0, dividerColor)} 50%,
      ${transparentize(1, dividerColor)} 100%
    ) 0 0 100%;
  ` : `
    border-color: ${dividerColor};
  `;
};

export const StyledDivider = styled.div`
  ${fullWidthMixin}
  ${gutter({ prop: "margin", position: "top" })}
  margin-left: auto;
  margin-right: auto;
  color: ${({ color }) => COLORS[color] || color};
  background-color: ${COLORS.transparent};
  background-position: 50%;
  border: 0;
  border-width: 0 0 1px;
  border-style: solid;
  ${borderColorMixin};
`;
