import React from "react";
import { useSelector } from "react-redux";
import dp from "../assets/dp.webp";

const ReceiverMessage = ({ message, image }) => {
  const { selectedUser } = useSelector((state) => state.user);

  return (
    <div className="flex items-start gap-2">
      {/* DP - top left */}
      <div className="w-[32px] h-[32px] rounded-full overflow-hidden shrink-0 ring-2 ring-pink-500/40">
        <img
          src={selectedUser?.image || dp}
          alt="dp"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-fit max-w-[500px] px-5 py-2 bg-white/5 border border-white/10 text-white rounded-tr-2xl rounded-br-2xl rounded-bl-none shadow">
        {image && (
          <img
            src={image}
            alt="message"
            className="w-[200px] rounded-lg mb-2"
          />
        )}

        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ReceiverMessage;