import { Route } from 'react-router-dom';

import { Authenticate } from '~/core/utils/routing';
import FourOhFour from '~/features/404/public/FourOhFourView';
import App from '~/features/app/public/AppView';
import Login from '~/features/authentication/public/LoginView';

const MainRoutes = (
    <>
        <Route element={<Login />} path="/login" />
        <Route element={Authenticate(<App />)} path="/">
            {/* add authenticated routes here */}
        </Route>
        <Route element={<FourOhFour />} path="*" />
    </>
);

export default MainRoutes;
