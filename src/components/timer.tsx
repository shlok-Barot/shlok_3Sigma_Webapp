import React, { PropsWithChildren } from "react";

interface TimerI {
  seconds: number;
}
const Timer: React.FC<PropsWithChildren<TimerI>> = ({ seconds }) => {
  return <>{seconds} seconds</>;
};

export default Timer;
