import { ICredentials } from "@aws-amplify/core";
import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";

const useAWSCredentials = () => {
  const [credentials, setCredentials] = useState<ICredentials>();
  const { showBoundary } = useErrorBoundary();
  const navigate = useNavigate();

  useEffect(() => {
    const doAsync = async () => {
      const currentUserCredentials = await Auth.currentUserCredentials();
      if (currentUserCredentials instanceof Error) {
        const error = currentUserCredentials as Error;
        if (error.name === 'NotAuthorizedException') {
          navigate('/signin');
        } else {
          showBoundary(currentUserCredentials as Error);
        }
      } else {
        setCredentials(currentUserCredentials);
      }
    }

    doAsync();
  }, [navigate, showBoundary]);

  return credentials;
};

export default useAWSCredentials;
