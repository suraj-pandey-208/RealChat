import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../main";
import { setMessages } from "../redux/messageSlice";

const useGetMessages = () => {
  const dispatch = useDispatch();

  const { selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) {
        dispatch(setMessages([]));
        return;
      }

      try {
        const { data } = await axios.get(
          `${serverUrl}/api/message/${selectedUser._id}`,
          {
            withCredentials: true,
          }
        );

        dispatch(setMessages(data));
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    };

    fetchMessages();
  }, [selectedUser, dispatch]);
};

export default useGetMessages;