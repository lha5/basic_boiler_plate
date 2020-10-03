import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {loginUser} from '../../../_actions/user_action';
import {withRouter} from 'react-router-dom';

function LoginPage(props) {
    const dispatch = useDispatch();

    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    };

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();

        let body = {
            email: Email,
            password: Password
        };

        dispatch(loginUser(body))
            .then(response => {
                if (response.payload.loginSuccess) {
                    props.history.push('/');
                } else {
                    alert('이메일 주소나 비밀번호가 다릅니다.');
                }
            });
    };

    return (
        <div style={{ width: '55%', margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <form
                onSubmit={onSubmitHandler}
                style={{display: 'flex', flexDirection: 'column'}}
            >
                <label>Email</label>
                <input type="text" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button>
                    Login
                </button>
            </form>
        </div>
    );
}

export default withRouter(LoginPage);