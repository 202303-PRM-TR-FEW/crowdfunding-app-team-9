'use client';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { setCloseMobileNav } from '@/app/redux/features/authSlice';
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import { FaCopyright } from 'react-icons/fa';
import Image from 'next/image';
import { useTranslations } from "next-intl";

function Footer() {
  const projects = useSelector(state => state.auth.projects);
  const t = useTranslations('Footer');
  const dispatch = useDispatch();

  const projectsWithTotalDonate = projects.map(project => {
    const totalDonations = project?.donations?.reduce((total, donation) => total + Number(donation.amount), 0);
    return {
      project,
      totalDonations
    }
  })

  let popularProjects = []

  if (projects.length === 1) {
    popularProjects = projectsWithTotalDonate
  } else {
    popularProjects = projectsWithTotalDonate.sort((a, b) => b.totalDonations - a.totalDonations).slice(1, 3);
  }

  return (
    <footer
      className="bg-greenColor pt-5 md:pt-10 text-center md:text-left text-blackColor"
      data-testid="footer"
    >
      <div className="container mx-auto px-4">
        <div className='border-b border-whiteColor pb-5 md:pb-10"'>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10">
            <div className="firstcolumn flex flex-col order-3 md:order-1">
              <h1 className='font-semibold text-l sm:text-xl md:text-2xl py-4'>
                {t('givinglyTitle')}
              </h1>
              <p>
                {t('givinglyDescription')}
              </p>
              <div className='icons flex py-10 space-x-5 md:space-x-8 justify-center  md:justify-start'>
                <Link href='https://www.instagram.com/explore/tags/crowdfunding/' target='blank' className="flex hover:opacity-60">
                  <FaInstagram className="text-3xl" />
                </Link>
                <Link href='https://www.facebook.com/groups/2903714209899706/' target='blank' className="flex hover:opacity-60">
                  <FaFacebook className="text-3xl" />
                </Link>
                <Link href='https://twitter.com/crowdfunding' target='blank' className="flex hover:opacity-60">
                  <FaTwitter className="text-3xl" />
                </Link>
              </div>
            </div>
            <div className="secondcolumn order-2">
              <h1 className='font-semibold text-l sm:text-xl md:text-2xl py-4'>
                {t('projectsTitle')}
              </h1>
              <div className='flex flex-col space-y-6 items-center md:items-start'>
                {popularProjects.length > 0 ? (
                  popularProjects?.map((project) => (
                    <Link onClick={() => dispatch(setCloseMobileNav(false))} href={`/projects/${project.project.docId}`} key={project.project.id} className="flex items-center space-x-3 ease-in duration-200 hover:scale-105 ">
                      <Image
                        alt={project.project.title}
                        src={project.project.image.includes('svg') ? `${project.project.image}.svg` : project.project.image}
                        width={70}
                        height={50}
                        className="rounded-lg shadow-lg w-[70px] h-[50px] object-fill "
                      />
                      <h3 className="font-semibold truncate">{project.project.title}</h3>
                    </Link>
                  ))
                ) : (
                  <p>{t('Currently, no trending projects to display')}</p>
                )}
              </div>
            </div>
            <div className="thirdcolumn order-1 md:order-3">
              <h1 className='font-bold text-l sm:text-xl md:text-2xl py-4'>
                {t('ourStoryTitle')}
              </h1>
              <p className=''>
                {t('ourStoryDescription')}
              </p>
            </div>
          </div>
        </div>
        <p className='text-center py-8'>
          <FaCopyright className="inline-block mr-2" />
          {t('allRightsReserved')}
        </p>
      </div>
    </footer>
  )
}

export default Footer;
