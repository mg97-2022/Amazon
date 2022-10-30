import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoMdArrowDropright } from "react-icons/io";
import classes from "./SignupForm.module.css";
import Card from "../../../components/ui/Card/Card";
import InputFields from "./InputFields/InputFields";
import useHttp from "../../../hooks/use-http";
import { useDispatch } from "react-redux";
import { userActions } from "../../../store/user";

function SignupForm() {
  const [validForm, setValidForm] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isLoading, sendRequest } = useHttp();

  // email exist (error)
  useEffect(() => {
    if (error) {
      dispatch(userActions.getUserEmail(userData.email));
      navigate("error");
    }
  }, [error, navigate, dispatch, userData]);

  const getUserDataHandler = useCallback((data) => {
    setUserData(data);
  }, []);

  const responseHandler = (response) => {
    const userToken = `${response.email.replace(".", "")}${response.localId}`;
    dispatch(userActions.getUserToken(userToken));
  };

  const validFormHandler = useCallback((validFormValue) => {
    setValidForm(validFormValue);
  }, []);

  const formSubmitHandler = (e) => {
    e.preventDefault();

    if (!validForm) {
      setInvalidInput(true);
      return;
    }
    setInvalidInput(false);

    sendRequest(
      {
        url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_KEY}`,
        method: "POST",
        body: {
          ...userData,
          returnSecureToken: true,
        },
        headers: {
          "Content-Type": "application/json",
        },
      },
      responseHandler
    );
  };

  return (
    <Card className={classes.container}>
      <form className={classes.form} onSubmit={formSubmitHandler}>
        <h2>Create account</h2>
        <InputFields
          onGetUserData={getUserDataHandler}
          invalidInput={invalidInput}
          onValidFormHandler={validFormHandler}
        />
        <button type="submit">Continue</button>
        <div className={classes.text}>
          By creating an account, you agree to Amazon's{" "}
          <span>Conditions of Use</span> and <span>Privacy Notice</span>.
        </div>
        <div className={classes.signin}>
          <p>Already have an account? </p>
          <Link to="/signin">
            Sign in <IoMdArrowDropright />
          </Link>
        </div>
      </form>
    </Card>
  );
}

export default SignupForm;
