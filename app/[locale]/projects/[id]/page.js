"use client";
import { useEffect, useState } from "react";
import { db } from "@/app/firebase/firebase-confing";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { FaCalendarAlt } from "react-icons/fa";
import { parse, differenceInDays } from "date-fns";
import { setShowFundingBox, setCloseMobileNav } from "@/app/redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import FundingBox from "../../Components/FundingBox/FundingBox";
import Loader from "@/app/[locale]/Components/Loader/Loader";

function Page({ params }) {
  const [project, setProject] = useState(null);
  const dispatch = useDispatch();
  const showFundingBox = useSelector((state) => state.auth.showFundingBox);

  const fetchData = async () => {
    const docRef = doc(db, "projects", params.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setProject(docSnap.data());
    } else {
      console.log("no such doc!!");
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);
  const t = useTranslations("Project");
  const today = new Date();
  const endDate = parse(project?.timeline, "dd/MM/yy", new Date());
  const dayLeft = differenceInDays(endDate, today);
  let message;
  if (t("Lang") === "English") {
    if (dayLeft === 1) {
      message = "1 day left";
    } else if (dayLeft === 0) {
      message = "Ends today";
    } else {
      message = `${dayLeft} days left`;
    }
  } else {
    if (dayLeft === 0) {
      message = "Bugün sona eriyor";
    } else {
      message = `${dayLeft} gün kaldı`;
    }
  }
  const moneyRaised = project?.donations.reduce((acc, donation) => acc + Number(donation.amount), 0)
  const progressPercentage = (moneyRaised / project?.goalAmount) * 100;
  return (
    <div className="bg-whiteColor  mt-[70px]">
      {project ? (
        <div className="container mx-auto px-4 py-6 flex flex-col justify-around items-center text-center md:flex-row  md:text-start md:space-y-0 md:h-screen-70 md:space-x-6">
          <div className=" mt-4 rounded-xl md:w-2/5 md:mt-0 md:flex md:items-center grid place-content-center">
            <Image
              className="rounded-xl h-[200px] w-[200px] md:h-[350px] md:w-[400px] lg:h-[450px] lg:w-[450px] object-cover"
              alt={project?.title}
              src={project?.image.includes('svg') ? `${project.image}.svg` : project.image}
              width={450}
              height={450}
            />
          </div>
          <div className="flex flex-col px-6 space-y-3 py-3 md:w-3/5 md:text-start ">
            <h1 className="text-2xl font-bold">{project?.title[0].toUpperCase() + project?.title.slice(1)}</h1>
            <div className="flex flex-row space-x-1 items-center justify-center md:justify-start">
              <Image
                className=" w-6 h-6 items-start rounded-full"
                alt={project?.title}
                src={project.profilPic ? project.profilPic.includes('svg') ? `${project.profilPic}.svg` : project.profilPic : "/user.png"}
                width={50}
                height={50}
              />
              <h2 className="text-lg">{project?.creator.split("@")[0]}</h2>
            </div>
            <div className="flex flex-col justify-between  md:border-y md:border-blackColor md:flex-row md:space-y-0 md:container">
              <div className="flex flex-col space-y-5 px-2 md:w-1/2 md:pt-5">
                <h1 className="text-lg font-bold">{t("About Project")}</h1>
                <p className="text-lg pb-5 md:leading-tight lg:leading-normal">{project?.description[0].toUpperCase() + project?.description.slice(1)}</p>
              </div>
              <div className="md:border-l md:border-blackColor "></div>
              <div className="md:w-1/2 md:py-5">
                <div className="space-y-5 progress-bar flex flex-col justify-between md:px-2  ">
                  <div className="flex justify-between">
                    <div className="raised flex flex-col px-4 py-2 justify-between">
                      <p className="text-sm sm:text-base md:text-lg">
                        {t("Raised:")}
                      </p>
                      <p className="text-lg sm:text-xl md:text-xl font-bold py-1 sm:py-2 md:py-3">
                        ${moneyRaised}
                      </p>
                    </div>
                    <div className="bg-greenColor px-6 py-2 rounded-lg flex flex-col justify-between ">
                      <p className="text-sm sm:text-base md:text-lg">
                        {t("Goal:")}
                      </p>
                      <p className="text-lg sm:text-xl md:text-xl font-bold py-1 sm:py-2 md:py-3">
                        ${project?.goalAmount}
                      </p>
                    </div>
                  </div>
                  <div className="h-4 bg-grayishColor rounded-lg">
                    <div
                      className="h-full rounded-lg bg-greenColor"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-center space-x-2 pt-2 md:py-5 text-lg">
                  <FaCalendarAlt size={20} />
                  <p>{message}</p>
                </div>
              </div>
            </div>
            <div>
              <button
                onClick={() => {
                  setTimeout(() => {
                    dispatch(setShowFundingBox());
                    dispatch(setCloseMobileNav(false))
                  }, 1);
                }}
                className="button-dark mt-2 w-full md:w-1/2"
              >
                {t("Fund This Project")}


              </button>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
      {showFundingBox && <FundingBox docId={params.id} project={project} />}
    </div>
  );
}

export default Page;
