import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  username: string;
  authorized: boolean;
  raw: any;
}

const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<User>({} as User);
  const navigate = useNavigate();

  useEffect(() => {
    const doAsync = async () => {
      const currentUserInfo = await Auth.currentUserInfo();

      if (!!currentUserInfo) {
        const userInfo = {
          firstName: currentUserInfo.attributes?.given_name,
          lastName: currentUserInfo.attributes?.family_name,
          email: currentUserInfo.attributes?.email,
          id: currentUserInfo.id,
          username: currentUserInfo.username,
          authorized: !!currentUserInfo,
          raw: currentUserInfo,
        };

        setUserInfo(userInfo);
      } else {
        navigate('/signin')
      }
    };

    doAsync();
  }, [navigate]);

  return userInfo;
};

export default useUserInfo;
