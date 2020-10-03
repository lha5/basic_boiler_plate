import React, {useEffect} from 'react';
import axios from 'axios';
import {Box, Heading, Main} from 'grommet';

function LandingPage() {

    useEffect(() => {
        axios.get('/api/hello').then(response => console.log(response.data));
    }, []);

    return (
        <Main>
            <Box
                align="center"
                justify="center"
            >
                <Heading>시작 페이지</Heading>
            </Box>
        </Main>
    );
}

export default LandingPage;