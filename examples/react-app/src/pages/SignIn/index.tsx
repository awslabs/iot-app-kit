import React, { FC } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';

const AuthPage: FC = () => {
    return (
        <Authenticator>
            {({ signOut, user }) => (
                <Navigate to="/" />
            )}
        </Authenticator>
    )
}

export default AuthPage;
