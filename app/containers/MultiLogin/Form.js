import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { createStructuredSelector } from 'reselect';
import { reduxForm, Field } from 'redux-form';
import { Redirect } from 'react-router-dom';

import { hasToken } from 'utils/auth';
import app from 'containers/App/actions';

import {
  requiredValid,
  emailValid,
  minLengthValid,
  confirmPasswordValid,
} from 'shared/validations';

import {
  selectActivePanel,
  selectLoginSelected,
  selectResetSelected,
  selectRegisterSelected,
  selectMainInputText,
} from './selectors';

import Input from './Input';

import {
  Form,
  SubmitButton,
  ApiLink,
  ValidationMessage,
} from './styles';

FormView.propTypes = {
  loginSelected: PropTypes.bool.isRequired,
  registerSelected: PropTypes.bool.isRequired,
  resetSelected: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  mainInputText: PropTypes.string.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.array,
};

function FormView({
  handleSubmit,
  loginSelected,
  registerSelected,
  resetSelected,
  mainInputText,
  error,
  submitting,
}) {
  if (hasToken()) {
    return <Redirect to="/" />;
  }

  return (
    <Form onSubmit={handleSubmit} autoComplete="on">
      <Field
        label={`Enter ${!resetSelected ? 'username' : 'email'}`}
        name={!resetSelected ? 'username' : 'email'}
        component={Input}
        placeholder={mainInputText}
        validate={!resetSelected ? [requiredValid] : [requiredValid, emailValid]}
      />
      <Field
        label="Enter email"
        name="email"
        component={Input}
        type="email"
        placeholder="Email"
        validate={registerSelected ? [requiredValid, emailValid] : []}
        isHidden={loginSelected || resetSelected}
      />
      <Field
        label="Enter account password"
        name="password"
        component={Input}
        type="password"
        placeholder="Password"
        validate={!resetSelected ? [requiredValid, minLengthValid] : []}
        isHidden={resetSelected}
      />
      <Field
        label="Confirm account password"
        name="confirmPassword"
        component={Input}
        type="password"
        placeholder="Confirm Password"
        validate={registerSelected ? [requiredValid, minLengthValid, confirmPasswordValid] : []}
        isHidden={(loginSelected || resetSelected)}
      />
      <Field
        label="Enter WaniKani API key"
        name="apiKey"
        component={Input}
        placeholder="WaniKani API key"
        validate={registerSelected ? [requiredValid] : []}
        isHidden={loginSelected || resetSelected}
      >
        <ApiLink
          title="Get WK API key"
          name="HELP"
          color="black"
          href="https://www.wanikani.com/settings/account#public-api-key"
          isHidden={loginSelected || resetSelected}
          tabIndex={loginSelected || resetSelected ? -1 : 0}
          external
        />
      </Field>
      {error && <ValidationMessage>{error}</ValidationMessage>}
      <SubmitButton type="submit">
        {(submitting && 'Submitting') ||
        (registerSelected && 'Create Account') ||
        (loginSelected && '行こう') ||
        (resetSelected && 'Reset Password')}
      </SubmitButton>
    </Form>
  );
}

const mapStateToProps = createStructuredSelector({
  activePanel: selectActivePanel,
  loginSelected: selectLoginSelected,
  resetSelected: selectResetSelected,
  registerSelected: selectRegisterSelected,
  mainInputText: selectMainInputText,
});

const enhance = compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'multiLogin',
    onSubmit: (values, dispatch, props) => {
      const { username, email, password, apiKey } = values;
      const { loginSelected, registerSelected, resetSelected } = props;

      if (registerSelected) {
        dispatch(app.user.register.request({ username, email, password, apiKey }));
      }

      if (loginSelected) {
        dispatch(app.user.login.request({ username, password }));
      }

      if (resetSelected) {
        // FIXME: this works, but we don't have a follow-up in place yet
        // dispatch(app.user.resetPassword.request({ email }));
        window.alert('Temporarily disabled - please contact us to reset your password.');
      }
    },
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      // reset form if user changes panel and there are lingering general submission errors
      if (prevProps.activePanel !== this.props.activePanel && this.props.error) {
        this.props.reset();
      }
    },
  })
);


export default enhance(FormView);
