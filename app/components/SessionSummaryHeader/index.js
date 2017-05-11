import React from 'react';
import PropTypes from 'prop-types';
import titleCase from 'voca/title_case';

import LogoLink from 'components/LogoLink';
import SessionLink from 'components/SessionLink';

import {
  Header,
  Wrapper,
  Title,
} from './styles';

SessionSummaryHeader.propTypes = {
  category: PropTypes.string.isRequired,
  count: PropTypes.number,
  linkRoute: PropTypes.string.isRequired,
};

SessionSummaryHeader.defaultProps = {
  count: 0,
};

function SessionSummaryHeader({ category, count, linkRoute }) {
  return (
    <Header>
      <Wrapper>
        <LogoLink />
        <Title>{titleCase(category)} Summary</Title>
        <SessionLink
          text="Continue Session"
          to={linkRoute}
          count={count}
        />
      </Wrapper>
    </Header>
  );
}

export default SessionSummaryHeader;