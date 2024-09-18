import React, { useState, useRef } from "react";

const PreviewCard = ({
  heading,
  title,
  img,
  date,
  club,
}: {
  heading?: string;
  className?: string;
  title?: string | React.ReactNode;
  img?: React.ReactNode;
  date?: string;
  club?: string;
}) => {

  const cards = [
  ];

  for(var i=0; i<10; i++){
    cards.push(
      <div className="text-white card  min-w-96 shadow-xl mx-6 bg-[#0b0b0b]">
        <figure>
          <img
            src="https://d8it4huxumps7.cloudfront.net/uploads/images/opportunity/mobile_banner/6435620db86f7_gen-ai-hackathon.png"
            alt="Shoes"
          />
        </figure>
        <div className="card-body ">
          <h2 className="card-title">GEN AI Hackathon</h2>
          <p>IEEE UCEK</p>
          <p>18, Aug 2024 <span>•</span> IEEE Hall</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-black text-white">
      <h1 className="text-5xl font-semibold ml-8 py-20">{heading}</h1>
      <div className="flex overflow-x-scroll remove-scrollbar pb-10">

     {cards}
      </div>
    </div>
  );
};

export default PreviewCard;
