import { useEffect, useState } from "react";
import { BranchSelection, ClassSelection, Loader } from "../components";
import { MainLayout } from "../layout";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

const Select = () => {
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [selectedClass, setSelectedClass] = useState(null);

  const [classesAvaiable, setClassesAvaiable] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getClassesAvaiable = async (branchCode) => {
    const res = await api.get(`data/core_sections.json`);
    const data = res.data;
    return {
      data: {
        sections: data[branchCode],
      },
    };
  };

  const setupTimetableHandler = async () => {
    setIsLoading(true);

    try {
      const coreReq = api.get(`data/core_timetable.json`);

      const [coreRes] = await Promise.all([coreReq]);
      const coreData = coreRes.data;

      const timetable = {
        core_timetable: coreData[selectedClass],
      };

      localStorage.setItem("timetable", JSON.stringify(timetable));
      localStorage.setItem("v", JSON.stringify("v2"));

      navigate("/");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getInfoFromBranch = async (branchCode) => {
      const [classesAvaiable] = await Promise.all([
        getClassesAvaiable(branchCode),
      ]);

      setClassesAvaiable(classesAvaiable.data.sections);
      setSelectedClass(classesAvaiable.data.sections[0]);
    };

    if (selectedBranch) {
      getInfoFromBranch(selectedBranch);
    }
  }, [selectedBranch]);

  return (
    <MainLayout>
      <BranchSelection
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
      />
      {classesAvaiable.length > 0 && (
        <ClassSelection
          classSelectionHeading={"Select Core Section: "}
          classSelectionName={"CoreSections"}
          classesAvaiable={classesAvaiable}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
        />
      )}
      {selectedBranch &&
        selectedClass && (
          <button
            onClick={setupTimetableHandler}
            className="bg-[#0663e5] w-full h-12 flex justify-center items-center p-3 font-medium rounded-sm mb-12"
          >
            {isLoading ? <Loader /> : "Setup Timetable"}
          </button>
        )}
    </MainLayout>
  );
};

export default Select;
