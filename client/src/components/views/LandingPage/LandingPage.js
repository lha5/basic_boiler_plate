import React, {useEffect} from 'react';
import axios from 'axios';
import {Box, Heading, Main} from 'grommet';
import {withRouter} from 'react-router-dom';

function LandingPage(props) {

    useEffect(() => {
        axios.get('/api/hello').then(response => console.log(response.data));
    }, []);

    const onClickHandler = () => {
        axios.get('/api/user/logout')
            .then(response => {
                if (response.data.success) {
                    props.history.push('/login');
                } else {
                    alert('로그아웃을 할 수 없습니다.');
                }
            });
    };

    return (
        <Main>
            <Box
                align="center"
                justify="center"
            >
                <Heading>시작 페이지</Heading>
                <button onClick={onClickHandler}>Logout</button>
            </Box>
        </Main>
    );
}

export default withRouter(LandingPage);