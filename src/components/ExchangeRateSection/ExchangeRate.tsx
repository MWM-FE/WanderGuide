import { useGetExchangeRate } from "../../hook/useGetExchangeRate";
import NoExchangeRate from "./NoExchangeRate";
import NoSettingData from "../common/NoSettingData";
import { useRecoilState } from "recoil";
import { destinationData } from "../../store/destinationAtom";
import { calcCash } from "../../Util/calcCash";
import IsLoading from "../common/IsLoading";

const ExchangeRate = () => {
  const [DestinationData] = useRecoilState(destinationData);
  const country = DestinationData?.planInfo.destination || "";

  const { cashData, isLoading, checkWeekend } = useGetExchangeRate(country);

  const list: number[] = [1, 2, 5, 10, 20, 50, 100];

  return (
    <div className="h-full flex flex-col">
      <div className="h-[53px] flex justify-between items-center pb-5">
        <div>
          <span className="text-[22px] font-semibold pr-2">환율</span>
        </div>
        <div className="flex items-center">
          <img
            className="w-[20px] h-[20px]"
            src="/images/refresh.svg"
            alt="refresh"
          />
          <span className="text-xs pl-1">{checkWeekend} 11:00</span>
        </div>
      </div>
      <div className="bg-white w-full h-[140px] flex flex-row justify-center items-center rounded-3xl overflow-hidden">
        {isLoading ? (
          <IsLoading />
        ) : (
          <>
            {country ? (
              cashData?.krw && cashData?.exc ? (
                list.map((ele, idx) => {
                  return (
                    <div
                      key={idx}
                      className={`flex-1 ${idx === 0 ? "" : "border-l"} text-[13px]`}
                    >
                      <div className="text-center py-[22px] border-b text-black font-bold">
                        {ele} {cashData.exc}
                      </div>
                      <div className="text-center py-[22px]">
                        {calcCash(cashData.krw, ele)}원
                      </div>
                    </div>
                  );
                })
              ) : (
                <NoExchangeRate />
              )
            ) : (
              <NoSettingData />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExchangeRate;
