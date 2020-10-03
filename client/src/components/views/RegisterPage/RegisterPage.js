import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {registerUser} from "../../../_actions/user_action";
import {withRouter} from 'react-router-dom';

function RegisterPage(props) {
    const dispatch = useDispatch();

    const [Name, setName] = useState('');
    const [Email, setEamil] = useState('');
    const [Password, setPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');

    const onNameHandler = (event) => {
        setName(event.currentTarget.value);
    };

    const onEmailHandler = (event) => {
        setEamil(event.currentTarget.value);
    };

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    };

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value);
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();

        if (Password !== ConfirmPassword) {
            return alert('비밀번호와 비밀번호 확인이 같아야 합니다.');
        }

        let body = {
            name: Name,
            email: Email,
            password: Password
        };

        dispatch(registerUser(body))
            .then(response => {
                if (response.payload.success) {
                    props.history.push('/login');
                } else {
                    alert('회원 가입을 할 수 없습니다.');
                }
            });
    };

    return (
        <div style={{ width: '55%', margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <form
                onSubmit={onSubmitHandler}
                style={{display: 'flex', flexDirection: 'column'}}
            >
                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} />
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
                <br />
                <button>
                    회원 가입
                </button>
            </form>
        </div>
    );
}

export default withRouter(RegisterPage);