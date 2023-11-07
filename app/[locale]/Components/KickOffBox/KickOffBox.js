"use client";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { setShowKickOffBox } from "@/app/redux/features/authSlice";
import { FaUpload, FaCalendarAlt } from 'react-icons/fa';
import { MdArrowBackIosNew } from 'react-icons/md';
import { DateRange } from "react-date-range";
import { addDays, format } from "date-fns";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useTranslations } from "next-intl";

import { db, storage } from "@/app/firebase/firebase-confing";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from 'react-toastify';
import Spinner from "../Spinner/Spinner";

const schema = yup.object({
  title: yup.string().max(50).required(),
  goalAmount: yup.number().required(),
  timeline: yup
    .array()
    .of(yup.date().min(new Date()))
    .min(2)
    .required(),
  category: yup.string().required(),
  description: yup.string().max(150).required(),
  image: yup
    .mixed()
    .test("fileRequired", "Image is required", (value) => {
      return value.length > 0;
    }),
}).required();

const KickOffBox = () => {
  const [showDateBox, setShowDateBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector(state => state.auth.user);
  const profilPic = useSelector(state => state.auth.profilPic);
  const dispatch = useDispatch();
  const t = useTranslations('KickOffBox');

  useEffect(() => {
    window.addEventListener('click', clickHandler);
    return () => {
      window.removeEventListener('click', clickHandler);
    }
  }, []);

  const containerRef = useRef();
  const rangeRef = useRef();

  const { register, handleSubmit, formState: { errors }, control, watch } = useForm({
    resolver: yupResolver(schema)
  });
  const timeline = watch('timeline');

  useEffect(() => {
    if (errors.timeline) {
      toast.error(
        `${t(
          "Please select a future date, and also make sure to select both a start and end date"
        )}.`,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          draggable: false
        });
    }
  }, [errors.timeline])

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const imgFile = data.image[0];
      const storageRef = ref(storage, `project-img/${imgFile.name}`);
      const snapshot = await uploadBytes(storageRef, imgFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      const formattedTimeline = data.timeline.map((date) => format(date, "dd/MM/yy"));
      const creator = user.email.split('@')[0].replace(/[0-9]/g, '');
      const projectData = {
        category: data.category,
        creator: creator,
        description: data.description,
        goalAmount: data.goalAmount,
        id: user.id,
        image: downloadURL,
        profilPic: profilPic,
        timeline: formattedTimeline[1],
        title: data.title,
        donations: []
      };
      await addDoc(collection(db, "projects"), projectData);
      toast.success(`${t("You have successfully created your project")}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        draggable: false,
      });
    } catch (err) {
      toast.error(
        `${t("An error occurred while creating your project")}. ${t(
          "Please try again later"
        )}`,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          draggable: false
        });
    } finally {
      setIsLoading(false);
      dispatch(setShowKickOffBox());
    }
  };

  const clickHandler = (e) => {
    if (!rangeRef.current.contains(e.target)) {
      setShowDateBox(false);
    }
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      dispatch(setShowKickOffBox());
    }
  };

  return (
    <div className="bg-opacity-70 h-screen w-screen  fixed top-0 left-0 grid place-content-center z-50 bg-blackColor  ">
      <div ref={containerRef} className="relative bg-whiteColor -mt-6 p-6 rounded-xl shadow sm:p-12 sm:-mt-0">
        <button
          onClick={() => dispatch(setShowKickOffBox())}
          className="absolute top-2 left-0 p-3 text-blackColor rounded-full hover:bg-grayishColor sm:left-8 sm:top-3"
        >
          <MdArrowBackIosNew size={20} />
        </button>
        <h1 className="text-4xl py-5 font-semibold md:py-8 sm:text-5xl">
          {t('Kick-off')}
          <br /> {t('your project')}
        </h1>
        <form id="form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3  text-blackColor">
          <div className="flex justify-center  space-x-2 sm:space-x-6 ">
            <div className="left-side flex flex-col space-y-3 sm:space-y-6 w-1/2 py-4 ">
              <div>
                <label htmlFor="projectTitle" className={` text-sm  font-semibold block mb-2 sm:text-lg ${errors.title && `text-red-500`}`}>
                  {t('Name of your project')}
                </label>
                <input
                  {...register('title')}
                  id="projectTitle"
                  placeholder={t("Build a cat shelter")}
                  className={` placeholder-blackColor bg-whiteColor border-blackColor w-full px-4 text-xs sm:text-sm py-2 border-b  border-opacity-100  focus:outline-none ${errors.title && `border-red-500 placeholder-red-500`}`}
                />
              </div>
              <div>
                <label htmlFor="goalAmount" className={`text-sm  font-semibold block mb-2 sm:text-lg ${errors.goalAmount && `text-red-500`}`}>
                  {t('Add your goal')}
                </label>
                <input
                  {...register('goalAmount')}
                  id="goalAmount"
                  placeholder="$ 3.000"
                  className={`bg-whiteColor w-full px-4 py-2  border-b border-blackColor border-opacity-100 text-xl sm:text-2xl  placeholder-blackColor focus:outline-none placeholder:font-semibold ${errors.goalAmount && `border-red-500 placeholder-red-500`} `}
                />
              </div>
              <div ref={rangeRef}>
                {showDateBox && (
                  <Controller
                    name="timeline"
                    control={control}
                    defaultValue={[
                      addDays(new Date(), 1),
                      addDays(new Date(), 7),
                    ]}
                    render={({ field }) => (
                      <DateRange
                        className="absolute top-1/2 -translate-y-1/2 right-2 rounded-xl shadow-2xl shadow-blackColor z-10"
                        onChange={(item) => {
                          field.onChange([item.selection.startDate, item.selection.endDate]);
                        }}
                        ranges={[
                          {
                            startDate: field.value[0],
                            endDate: field.value[1],
                            key: 'selection',
                          },
                        ]}
                      />
                    )}
                  />
                )}
                <label htmlFor="timeline" className={`text-sm  font-semibold block mb-2 sm:text-lg ${errors.timeline && `text-red-500`}`}>
                  {t('Add your timeline')}
                </label>
                <div className="flex space-x-3">
                  <input
                    id="timeline"
                    onClick={() => setShowDateBox(prev => !prev)}
                    value={`${timeline ? `${format(timeline[0], 'dd/MM/yy')}-${format(timeline[1], 'dd/MM/yy')}` : ''}`}
                    placeholder="dd/MM/yy"
                    className={`bg-whiteColor placeholder-blackColor text-xs sm:text-sm w-full p-2 border-b border-blackColor border-opacity-100 focus:outline-none cursor-pointer ${errors.timeline && `border-red-500 placeholder-red-500`}`}
                    readOnly
                  />
                  <div onClick={() => setShowDateBox(prev => !prev)} className={`button-light z-0 ${errors.timeline && `bg-redColor text-red-500 border-red-500 hover:bg-lightRedColor hover:text-red-500 hover:opacity-60`}`}>
                    <FaCalendarAlt />
                  </div>
                </div>
              </div>
            </div>
            <div className="mid-side border-l border-blackColor"></div>
            <div className="right-side w-1/2 py-4 space-y-3 sm:space-y-6">
              <div>
                <label htmlFor="category" className="text-sm  font-semibold mb-2 block sm:text-lg">{t('Select category')}</label>
                <select
                  {...register('category')}
                  className={`bg-whiteColor border-b border-blackColor w-full px-4 py-2 cursor-pointer outline-none text-xs sm:text-sm ${errors.category && `border-red-500 placeholder-red-500`}`} id="category">
                  <option value="education"> {t('Education')} </option>
                  <option value="culture">{t('Culture')} </option>
                  <option value="animals">{t('Animals')}</option>
                  <option value="children">{t('Children')}</option>
                </select>
              </div>
              <div>
                <label htmlFor="description" className={`text-sm  font-semibold block mb-2 sm:text-lg ${errors.description && `text-red-500`}`}>
                  {t('About your project')}
                </label>
                <textarea
                  {...register('description')}
                  defaultValue={t('Tell us about your project to build a cat shelter')}
                  className={`bg-whiteColor text-xs sm:text-sm w-full px-4 py-2 border-b border-blackColor border-opacity-100 focus:outline-none ${errors.description && `border-red-500 placeholder-red-500`}`}
                  id="description"
                  cols="10"
                  rows="3">
                </textarea>
              </div>
              <div className="text-center">
                <label htmlFor="file-upload" className={`file-label button-light py-2.5 ${errors.image && `bg-redColor text-red-500 border-red-500 hover:bg-lightRedColor hover:text-red-500 hover:opacity-60`}`}>
                  <FaUpload size={20} />
                  <span className="ml-2 text-sm sm:text-base">{t('Add media')}</span>
                </label>
                <input
                  {...register('image')}
                  id="file-upload"
                  type="file"
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>
          <div className="w-full">
            <button type="submit" className={`button-dark w-full`} disabled={isLoading}>{isLoading && <Spinner />}{t('Upload project')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KickOffBox;


