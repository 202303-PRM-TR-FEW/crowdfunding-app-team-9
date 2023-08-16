import Image from "next/image";

const MyProjectsDonorCard = ({ donation }) => {
  const donor = donation?.cardholder.split(' ');
  const isDisplaySecondWord = donor.length > 1 ? donor[1][0] : '';
  return (
    <>
      <div className="text-blackColor flex items-center space-x-4 cursor-pointer p-2 rounded-xl transition-all duration-300 ease-in-out hover:bg-blackColor hover:text-whiteColor ">
        <div className="w-[50px] h-[50px]">
          <Image
            src={`https://via.placeholder.com/150/D4EE25/0A0A0A?text=${donor[0][0] + isDisplaySecondWord}`}
            alt={donation?.cardholder}
            width={50}
            height={50}
            className="rounded-md"
          />
        </div>
        <div className="grow w-3/5">
          <h4 className="text-sm font-semibold sm:text-lg md:text-[18px]">{donation?.cardholder}</h4>
          <p className="text-xs font-medium sm:text-sm md:text-[14px]">{donation?.description[0].toUpperCase() + donation?.description.slice(1)}</p>
        </div>
        <p className="text-sm font-semibold sm:text-lg w-1/5 md:text-[18px]">${donation?.amount}</p>
      </div>
    </>
  );
};

export default MyProjectsDonorCard;
