import { useMemo } from "react";
import { Credentials } from '@aws-sdk/types';

const useAWSCredentials = () => {
    const credentials = useMemo(() => {
        return {
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
            sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN,
            authenticated: !!process.env.REACT_APP_AWS_ACCESS_KEY_ID
        } as Credentials
    }, []);

    return credentials;
}

export default useAWSCredentials;
