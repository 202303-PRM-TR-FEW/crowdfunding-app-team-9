'use client'
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';


import ConfirmationBox from '../ConfirmationBox/ConfirmationBox';
import MyProjectDetails from "../MyProjectDetail/MyProjectsDetail";
import MyProjectsTransaction from "../MyProjectTransaction/MyProjectsTransaction";
import MyProjectsStatistics from "../MyProjectStatistics/MyProjectsStatistics";

const MyProjects = () => {
  const [matchedProject, setMatchedProject] = useState([]);
  const projects = useSelector(state => state.auth.projects);
  const user = useSelector(state => state.auth.user);
  const showConfirmationBox = useSelector(state => state.auth.showConfirmationBox);
  const dispatch = useDispatch();

  useEffect(() => {
    const filterForMatch = projects.filter(project => project.id === user.id);
    setMatchedProject(filterForMatch)
  }, [projects, user])


  

  return (
    <>
      <div className="bg-whiteColor">
        <div className="container min-h-screen mx-auto w-4/5 pt-[calc(70px+2rem)] pb-10 px-4 space-y-10 flex flex-col lg:flex-row lg:space-x-24 md:space-y-0 md:w-full">
          <div className="space-y-10 lg:w-3/5">
            <MyProjectDetails project={matchedProject[0]} />
            <div className="progress-bar flex flex-col justify-between">
              <div className="h-4 bg-grayishColor rounded-lg">
                <div
                  className="h-full rounded-lg bg-greenColor"
                  style={{
                    width: `${(matchedProject[0]?.moneyRaised / matchedProject[0]?.goalAmount) * 100
                      }%`,
                  }}
                />
              </div>
              <div className="flex justify-between">
                <div className="raised flex flex-col justify-between">
                  <p className="mt-1.5 text-[18px] font-semibold ">Raised:</p>
                  <p className="text-lg sm:text-xl font-bold py-1 sm:py-2 md:py-3 md:text-2xl lg:text-[32px]">
                    ${matchedProject[0]?.moneyRaised}
                  </p>
                </div>
                <div className="goal flex flex-col justify-between">
                  <p className="text-[18px] font-semibold mt-1.5">Goal:</p>
                  <p className="text-lg sm:text-xl font-bold py-1 sm:py-2 md:py-3 md:text-2xl lg:text-[32px]">
                    ${matchedProject[0]?.goalAmount}
                  </p>
                </div>
                
              </div>
              
            </div>
            
          </div>
          <div className="lg:w-2/5">
            {showConfirmationBox && (
              <ConfirmationBox project={matchedProject[0]} user={user} />
            )}
            <MyProjectsTransaction project={matchedProject[0]} />
            <MyProjectsStatistics project={matchedProject[0]} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProjects;