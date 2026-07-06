import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";
import { serverUrl } from "../main";

const useOtherUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/user/others`,
          {
            withCredentials: true,
          }
        );

        dispatch(setOtherUsers(data));
      } catch (error) {
        console.log(error);
      }
    };

    getUsers();
  }, [dispatch]);
};

export default useOtherUsers;