import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from 'react-redux';
import { useTranslations } from 'next-intl';
import { setCloseMobileNav } from "@/app/redux/features/authSlice";

const Cards = ({ projects }) => {
  const t = useTranslations('Projects');
  const dispatch = useDispatch();
  const searchInputVal = useSelector(state => state.auth.searchInputVal);
  if (!projects || projects.length === 0) {
    return <div className="text-center text-4xl pb-44 md:pb-56 lg:pb-60 xl:pb-72">{t("No projects available in this category")}</div>;
  };

  const searchedProjects = projects.filter(project => {
    return project.title.toLowerCase().includes(searchInputVal.toLowerCase()) || project.creator.toLowerCase().includes(searchInputVal.toLowerCase());
  })
  const handleCardClick = () => {
    dispatch(setCloseMobileNav(false))
  }

  return (
    <div className="projects-part container mx-auto px-4 flex flex-col items-center justify-center space-y-8  pb-20 md:space-y-0 md:grid md:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
      {searchedProjects.length === 0 ? (
        <div className="text-center text-4xl pb-28  md:w-[700px] lg:pb-32 xl:pb-40 2xl:pb-44">
          {t('noProjectsAvailable', { searchInputVal })}
        </div>
      ) : (
        searchedProjects.map((project) => (
          <div
            key={project.id}
            className="w-[300px] bg-whiteColor border border-grayishColor rounded-lg shadow ease-in duration-200 hover:scale-105 flex flex-col justify-between"
          >
            <div className="img-container flex flex-col justify-center items-center bg-grayishColor rounded-lg border-0">
              <Link onClick={handleCardClick} href={`/projects/${project.docId}`}>
                <div className="image-wrapper flex justify-center items-center  ">
                  <Image
                    alt={project.title}
                    src={project.image.includes('svg') ? `${project.image}.svg` : project.image}
                    width={300}
                    height={230}
                    className="rounded-lg w-[300px] h-[230px] object-cover "
                  />
                </div>
              </Link>
            </div>
            <div className="p-5">
              <Link onClick={handleCardClick} href={`/projects/${project.docId}`}>
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <Image
                    src={project.profilPic.includes('svg') ? `${project.profilPic}.svg` : project.profilPic}
                    width={25}
                    height={25}
                    alt="user-profil-pic"
                    className="w-[25px] h-[25px] rounded-full"
                  />
                  <h2 className="text-blackColor">{project.creator.split('@')[0]}</h2>
                </div>
                <div className="h-16">
                  <h2 className="mb-4 mt-1 text-lg text-center font-bold tracking-tight text-blackColor">
                    {project.title[0].toUpperCase() + project.title.slice(1)}
                  </h2>
                </div>
              </Link>
              <div className="progress-bar flex flex-col justify-between">
                <div className="h-4 bg-grayishColor rounded-lg">
                  <div
                    className="h-full bg-greenColor rounded-lg"
                    style={{
                      width: `${(project?.donations?.reduce((acc, donation) => acc + Number(donation.amount), 0) / project.goalAmount) * 100
                        }%`,
                    }}
                  />
                </div>
                <div className="flex justify-between">
                  <div className="raised flex flex-col justify-between">
                    <p className="text-sm  md:text-lg mt-1.5 ">{t("Raised:")}</p>
                    <p className="text-md  font-semibold  py-2 ">
                      ${project?.donations?.reduce((acc, donation) => acc + Number(donation.amount), 0)}
                    </p>
                  </div>
                  <div className="goal flex flex-col justify-between">
                    <p className="text-sm  md:text-lg mt-1.5">{t("Goal:")}</p>
                    <p className="text-md  font-semibold  py-2 ">
                      ${project.goalAmount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Cards;

