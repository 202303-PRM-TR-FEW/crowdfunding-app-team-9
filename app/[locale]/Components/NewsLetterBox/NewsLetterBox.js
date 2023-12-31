'use client'
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';
import { setShowNewsletterForm } from "@/app/redux/features/authSlice";



function NewsLetterBox() {
  const t = useTranslations('NewsLetterBox');
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col items-center text-center w-5/6 sm:w-2/3 py-12 px-7 bg-blackColor rounded-xl space-y-6  md:w-3/6 lg:w-2/6 ">
      <div className="topBox bg-greenColor rounded-xl">
        <Image
          src="/newsletterbox.png"
          alt="newsletterbox image"
          width={450}
          height={450}
          priority
        />
      </div>
      <div
        className="bottomBox flex flex-col text-whiteColor p-3  justify-center space-y-7 "
      >
        <h1 className="font-semibold text-[32px] -mb-2 ">{t('Stay informed')}</h1>
        <p className="leading-[24px]  text-[18px]">
          {t('Want to be among the first people to know about amazing projects on our platform? Join our monthly digest of the best causes')}
        </p>
        <button onClick={(e) => {
          e.stopPropagation();
          dispatch(setShowNewsletterForm());
        }} className="button-green text-[18px] "> {t('Join Newsletter')}</button>
      </div>
    </div>
  );
}

export default NewsLetterBox;
