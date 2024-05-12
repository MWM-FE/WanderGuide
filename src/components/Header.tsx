import React, { useEffect, useState } from "react";
import { getData } from "../indexeddb/indexedDB";

type MainHeaderProps = {
  selected: number;
};

const MainHeader = ({ selected }: MainHeaderProps) => {
  // indexedDB 비동기여서. indexedDB를 기다리는 분기 추가
  const [country, setCountry] = useState<string>("");
  useEffect(() => {
    getData("plan", selected + 1).then((res) => setCountry(res.title));
  }, [selected]);

  return (
    <div className="bg-white h-[57px] border-b border-gray-200 flex items-center justify-between">
      {country && (
        <>
          <div className="pl-2">
            <span>{country}</span>
          </div>
          <div className="flex items-center">
            <button className="w-[34px] h-[34px] bg-blue-50 rounded-full flex items-center justify-center hover:bg-blue-100">
              <img
                className="w-[20px] h-[20px]"
                src="/images/settings.svg"
                alt="logo"
              />
            </button>
            <button className="w-[34px] h-[34px] bg-blue-50 rounded-full flex items-center justify-center m-3 hover:bg-blue-100">
              <img
                className="w-[20px] h-[20px]"
                src="/images/notification.svg"
                alt="notification"
              />
            </button>
          </div>{" "}
        </>
      )}
    </div>
  );
};

export default MainHeader;
