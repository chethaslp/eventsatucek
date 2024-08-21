import React from "react";

function Card({
  title,
  header,
  date,
  isOnline,
  venue,
  club,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  date?: string;
  isOnline?: boolean;
  venue?: string;
  club: string;
}) {
  return <div></div>;
}

export default Card;
