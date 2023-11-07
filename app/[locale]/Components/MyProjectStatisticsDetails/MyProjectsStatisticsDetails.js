import Image from "next/image";
import { useTranslations } from "next-intl";

const MyProjectsStatisticsDetails = ({ project }) => {
  const t = useTranslations("MyProjectStatisticsDetails");

  const profilPic = project.profilPic.includes('svg')
    ? `${project.profilPic}.svg`
    : project.profilPic;

  return (
    <table className="w-full mx-auto bg-gradient-to-r from-whiteColor to-grayishColor text-blackColor rounded-md shadow-lg mt-5 md:w-2/3 lg:w-full">
      <tbody className="text-center">
        <tr>
          <td className="font-semibold ">{t("Creator:")}</td>
          <td>
            <div className="flex items-center justify-center space-x-2">
              <Image
                className="rounded-full mt-1 w-[25px] h-[25px]"
                src={profilPic}
                width={25}
                height={25}
                alt="profile picture"
              />
              <p className="capitalize">{project?.creator.split("@")[0]}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td className="font-semibold">{t("End Date:")}</td>
          <td>
            <p className="bg-redColor rounded-xl">{project?.timeline}</p>
          </td>
        </tr>
        <tr>
          <td className="font-semibold">{t("Category:")}</td>
          <td>
            <p className="capitalize">{project?.category}</p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default MyProjectsStatisticsDetails;
