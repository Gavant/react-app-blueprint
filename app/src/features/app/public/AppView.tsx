import { Box, CssBaseline } from '@mui/material';
import styled, { createGlobalStyle } from 'styled-components';

const Root = styled(Box)``;

const RootCSS = createGlobalStyle`
  body, #root {
    margin: 0;
  }
`;

const AppView = () => {
    return (
        <Root>
            <CssBaseline />
            <RootCSS />
            <h1>{'Welcome to {{APP_NAME}}'}</h1>
        </Root>
    );
};

export default AppView;
