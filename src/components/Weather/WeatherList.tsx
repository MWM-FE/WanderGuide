import React, { useEffect, useState } from "react";
import { getWeather, WeatherData, WeatherEntry } from "../../api/weather";
import { useQuery } from "@tanstack/react-query";
import IsLoading from "../common/IsLoading";
import { formatDate, formatUtc } from "../../Util/dateFormatter";
import { DestinationData, destinationData } from "../../store/destinationAtom";
import { useRecoilValue } from "recoil";

type WeatherProps = {
  setWeatherDate: (date: { startDate: string; endDate: string }) => void;
  setRefreshDate: (date: string) => void;
};

const WeatherList = ({ setWeatherDate, setRefreshDate }: WeatherProps) => {
  const [weatherGroup, setWeatherGroup] = useState<{
    [key: string]: WeatherEntry[];
  }>({});
  const [weatherList, setWeatherList] = useState<WeatherEntry[]>([]);
  const planDate = useRecoilValue<DestinationData>(destinationData);
  const { apiParams } = planDate;

  const countries: string = apiParams["영문명"];

  const { data, error, isLoading } = useQuery<WeatherData, Error>({
    queryKey: ["weather", countries],
    queryFn: () => getWeather(countries),
    enabled: !!countries,
    refetchInterval: 3 * 60 * 60 * 1000
  });

  useEffect(() => {
    if (data) {
      const currentTime = formatUtc();
      setRefreshDate(formatDate());
      const grouped = data.list
        .filter((item) => {
          return formatUtc(item.dt_txt) > currentTime;
        })
        .reduce<{
          [key: string]: WeatherEntry[];
        }>((acc, cur) => {
          const date = cur.dt_txt.split(" ")[0];
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(cur);
          return acc;
        }, {});
      setWeatherGroup(grouped);
    }
  }, [data, setRefreshDate]);

  useEffect(() => {
    const getMiddleValue = (array: WeatherEntry[]) => {
      if (array.length % 2 === 0) {
        return array[array.length / 2 - 1];
      } else {
        return array[Math.floor(array.length / 2)];
      }
    };

    const middleValues = Object.keys(weatherGroup).map((key) =>
      getMiddleValue(weatherGroup[key])
    );
    setWeatherList(middleValues);
  }, [weatherGroup]);

  useEffect(() => {
    if (weatherList.length === 0) return;
    setWeatherDate({
      startDate: weatherList[0].dt_txt.split(" ")[0],
      endDate: weatherList[weatherList.length - 1].dt_txt.split(" ")[0]
    });
  }, [weatherList, setWeatherDate]);

  if (isLoading) return <IsLoading />;
  if (error)
    return (
      <div className="text-cool-gray flex justify-center items-center text-sm">
        날씨 데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );

  return (
    <div className="flex h-full flex-col justify-around">
      <div className="item-center mb-[15px] flex gap-[10px]">
        <img src="/images/location.svg" alt="location" />
        <span className="text-sm font-bold leading-6 ">{countries}</span>
      </div>
      <div className="flex gap-[18px] justify-around mx-auto my-0">
        {weatherList.map((weather) => (
          <div key={weather.dt} className="flex flex-col items-center">
            <span className="text-blue text-sm ">
              {weather.dt_txt.split(" ")[0]}
            </span>
            <span className="text-cool-gray text-sm">
              {weather.dt_txt.split(" ")[1].split(":")[0]}시
            </span>
            <img
              className="shrink"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather"
            />
            <span className="display w-[110px] text-center text-sm font-bold text-sky-950">
              {weather.main.temp.toFixed(1)}°C
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherList;
