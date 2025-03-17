import React from "react";

const MessageDisplay: React.FC = () => {
  const message = "Hello there!";

  return (
    <div>
      <p>{message}</p>
    </div>
  );
};

export default MessageDisplay;
