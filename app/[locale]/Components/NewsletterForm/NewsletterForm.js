import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { useDispatch } from "react-redux";
import { setShowNewsletterForm } from "@/app/redux/features/authSlice";
import { useRef, useEffect, useState } from "react";
import emailjs from '@emailjs/browser';
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

const schema = yup.object().shape({
  username: yup.string().required("Name is required"),
  email: yup.string().email("Please enter a valid email address.").required("Email is required."),
});

const NewsletterForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch();
  const containerRef = useRef();
  const t = useTranslations('NewsletterForm');
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  emailjs.init('49EQMlcq2BdXR7HqC');

  let template = 'eng_temp';

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      emailjs.send("service_91kosip", template, {
        name: data.username[0].toUpperCase() + data.username.slice(1),
        recipient: data.email,
      });
      toast.success(
        `${t("Congratulations")} ${data.username[0].toUpperCase() + data.username.slice(1)
        }! ${t("You have successfully subscribed to Givingly newsletter")}.`,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          draggable: false
        });
    } catch (err) {
      toast.error(
        `${t("An error occurred while subscribing your project")}. ${t(
          "Please try again later"
        )}.`,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          draggable: false
        });
    } finally {
      setIsLoading(false)
      dispatch(setShowNewsletterForm())
    }
  }

  const handleCloseForm = () => {
    dispatch(setShowNewsletterForm())
  }

  useEffect(() => {
    window.addEventListener('click', handleOutClick);
    return () => {
      window.removeEventListener('click', handleOutClick)
    }
  }, [])

  const handleOutClick = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      dispatch(setShowNewsletterForm())
    }
  }

  return (
    <section className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center px-4 sm:px-20 bg-blackColor bg-opacity-70  z-50">
      <div ref={containerRef} className="bg-whiteColor flex flex-col  p-6 sm:p-8 md:p-10 rounded-xl shadow relative md:w-2/3 lg:w-1/2  xl:w-1/3">
        <div className="">
          <button onClick={handleCloseForm} className="absolute top-2 left-5 p-3 text-blackColor rounded-full hover:bg-grayishColor md:top-3">
            <MdOutlineArrowBackIos size={20} />
          </button>
          <h2 className="text-2xl font-bold mb-2 mt-6 text-center  md:text-3xl ">
            {t('Receive our content for free')}
          </h2>
          <div className="flex flex-col justify-center">
            <form onSubmit={handleSubmit(onSubmit)} >
              <input
                {...register('username')}
                placeholder={t('Name')}
                className={`border-b border-blackColor bg-whiteColor px-3 py-1 mt-7 mb-8 w-full text-lg outline-none sm:text-xl ${errors.username && `border-red-500 placeholder-red-500`}`}
              />
              <input
                {...register('email')}
                placeholder="Gmail"
                className={`border-b border-blackColor bg-whiteColor px-3 py-1 mb-5 w-full outline-none text-lg sm:text-xl ${errors.email && `border-red-500 placeholder-red-500`} `}
              />
              <button className="button-dark mt-5 w-full">
                {isLoading && <span className="loader"></span>}{t('Subscribe to Newsletter')}
              </button>
            </form>
          </div>
        </div>
        <hr className="mt-5 mb-6" />
        <p className="text-center">
          {t('Don\'t miss out on this chance to be part of something amazing! Enter your gmail address below to join our newsletter and embark on a journey of positive change and creativity')}
        </p>
      </div>
    </section>
  )
}

export default NewsletterForm
