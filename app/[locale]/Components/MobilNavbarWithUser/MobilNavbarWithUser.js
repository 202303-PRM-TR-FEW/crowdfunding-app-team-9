'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';

import { setShowInfoBox, setShowKickOffBox, setShowMobilNav, setSearchInputVal } from '@/app/redux/features/authSlice';
import NavbarSearchInput from '../NavbarSearchInput/NavbarSearchInput';
import InfoBox from '../InfoBox/InfoBox';

function MobilNavbarWithUser({ bgColor, defaultLink, activeLink, selectedLink }) {
  const showInfoBox = useSelector(state => state.auth.showInfoBox);
  const user = useSelector(state => state.auth.user)
  const projects = useSelector(state => state.auth.projects);
  const profilPic = useSelector(state => state.auth.profilPic);
  const dispatch = useDispatch();
  const t = useTranslations('MobilNavbarWithUser');
  const isUserHaveProject = projects.some(project => project.id === user.id);

  const style = {
    container: `fixed top-[69px] left-1/2 -translate-x-1/2 w-full bg-greenColor flex flex-col space-y-3 py-5 items-center md:hidden z-50 ${bgColor && `bg-greenTransparent`}`,
    button: `button-dark hover:bg-transparent`,
    userContainer: `flex flex-col items-center space-y-1`,
    userImage: `rounded-full cursor-pointer w-[45px] h-[45px] hover:opacity-80`,
    signOutButton: `flex space-x-[1px] items-center text-xs text-red-600 hover:opacity-60`,
    headerInput: `rounded-needed outline-0 py-1 pl-2 placeholder:text-center `,
    InfoBoxContainer: `flex flex-col mt-3 py-2 px-6 rounded-md bg-grayishColor text-blackColor text-[13px] shadow-lg`,
    infoBoxLinks: `flex items-center gap-1 whitespace-nowrap  font-medium hover:opacity-60`,
    infoBoxUserName: `flex items-center gap-1 font-medium cursor-default capitalize `,
    infoBoxEmail: `flex items-center gap-1 font-medium cursor-default  `,
    userInfos: `flex flex-col items-start py-2.5 px-1 border-b border-blackColor space-y-2.5`,
    userFeatures: `flex flex-col items-start  px-1 py-2.5 space-y-2.5`,
    infoBoxPointer: `absolute top-3 left-1/2 -translate-x-1`,
  };

  const handleNewProjectClick = () => {
    if (isUserHaveProject) {
      toast.error(
        `${t("Existing active project under")} ${user?.email}. ${t(
          "Wait or delete it before creating a new one"
        )}.`,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
        }
      );
    } else {
      dispatch(setShowMobilNav())
      setTimeout(() => {
        dispatch(setShowKickOffBox())
      }, 1)
    }
  }

  const handleInfoBoxClick = (e) => {
    e.stopPropagation()
    setTimeout(() => {
      dispatch(setShowInfoBox())
    }, 1);
  }

  const handleLinkClicks = () => {
    dispatch(setSearchInputVal(''))
    dispatch(setShowMobilNav())
  }

  return (
    <div className={style.container}>
      <div className={style.userContainer}>
        <Image
          className={style.userImage}
          onClick={handleInfoBoxClick}
          src={profilPic ? (profilPic.includes('svg') ? `${profilPic}.svg` : profilPic) : `https://via.placeholder.com/150/0A0A0A/FAFAFA?text=${user.email[0].toUpperCase()}`}
          width={45}
          height={45}
          alt="Picture of the user"
        />
        {showInfoBox && <InfoBox style={style} />}
      </div>
      <NavbarSearchInput style={style} placeholder={t('Search for projects')} />
      <Link onClick={handleLinkClicks} className={selectedLink === '/' || selectedLink === '/tr' ? activeLink : defaultLink} href="/">
        {t('Home')}
      </Link>
      <Link onClick={handleLinkClicks} className={selectedLink === '/projects' || selectedLink === '/tr/projects' ? activeLink : defaultLink} href="/projects">
        {t('Projects')}
      </Link>
      {!isUserHaveProject &&
        <button onClick={handleNewProjectClick} className={style.button}>
          {t('New Project')}
        </button>}
    </div>
  );
}

export default MobilNavbarWithUser;
