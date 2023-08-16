import { useTranslations } from "next-intl";

const FundingBoxDonationBox = ({ handleBtnClick, amount }) => {
  const t = useTranslations("FundingBox");
  return (
    <div className="flex flex-col items-center justify-center space-y-2 md:space-y-5 mb-3 sm:mb-5 ">
      <div className="w-full flex justify-center space-x-1.5 sm:space-x-5 sm:justify-between ">
        <p
          className={` ${amount === 25 && 'bg-whiteColor text-blackColor border border-blackColor'} button-dark`}
          onClick={() => handleBtnClick(25)}
        >
          $25
        </p>
        <p
          className={`  ${amount === 50 && 'bg-whiteColor text-blackColor border border-blackColor '} button-dark`}
          onClick={() => handleBtnClick(50)}
        >
          $50
        </p>
        <p
          className={` ${amount === 75 && 'bg-whiteColor text-blackColor border border-blackColor '} button-dark`}
          onClick={() => handleBtnClick(75)}
        >
          $75
        </p>
        <p
          className={` ${amount === 100 && 'bg-whiteColor text-blackColor border border-blackColor '} button-dark`}
          onClick={() => handleBtnClick(100)}
        >
          $100
        </p>
      </div>

      <div className="w-full">
        <label
          className={`text-left text-md font-semibold block mb-2`}
        >
          {t("Custom Value")}
        </label>
        <div className="relative text-whiteColor hover:text-blackColor">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">$</span>
          <input
            placeholder="Custom"
            className={`button-dark w-full cursor-default pl-5 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none `}
            type="number"
            value={amount}
            onChange={(e) => handleBtnClick(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default FundingBoxDonationBox;
