import { useState } from "react";
import WeatherList from "./WeatherList";
import { DestinationData, destinationData } from "../../store/destinationAtom";
import { useRecoilValue } from "recoil";
import NoSettingData from "../common/NoSettingData";

type WeatherProps = {
  startDate: string;
  endDate: string;
};

const Weather = () => {
  const [weatherDate, setWeatherDate] = useState<WeatherProps>({
    startDate: "",
    endDate: ""
  });
  const [refreshDate, setRefreshDate] = useState<string>("");
  const planDate = useRecoilValue<DestinationData>(destinationData);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[53px] items-center justify-between pb-5">
        <div>
          <span className="text-[22px] font-semibold ">날씨</span>
          {weatherDate.startDate && (
            <span className="m-2 text-xs">
              {weatherDate.startDate} ~ {weatherDate.endDate}
            </span>
          )}
        </div>
        {refreshDate && (
          <div className="flex items-center">
            <img
              className="h-[20px] w-[20px]"
              src="/images/refresh.svg"
              alt="refresh"
            />
            <span className="pl-1 text-xs">{refreshDate}</span>
          </div>
        )}
      </div>
      <div className=" w-full rounded-3xl bg-white p-5 h-full min-h-[239px]">
        {planDate?.planInfo.destination ? (
          <WeatherList
            setWeatherDate={setWeatherDate}
            setRefreshDate={setRefreshDate}
          />
        ) : (
          <NoSettingData />
        )}
      </div>
    </div>
  );
};

export default Weather;
