import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../main";

const useCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/user/current`,
          {
            withCredentials: true,
          }
        );

        if (data.success) {
          dispatch(setUserData(data.user));
        }
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    };

    verifyUser();
  }, [dispatch]);
};

export default useCurrentUser;