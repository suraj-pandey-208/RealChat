import React from "react";

const SenderMessage = ({ message, image }) => {
  return (
    <div className="w-fit max-w-[500px] px-5 py-2 bg-gradient-to-br to-fuchsia-600 text-white rounded-2xl ml-auto shadow shadow-pink-500/20">
      
      {image && (
        <img
          src={image}
          alt="message"
          className="w-[200px] rounded-lg mb-2"
        />
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default SenderMessage;