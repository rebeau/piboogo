import { useRecoilState, useResetRecoilState } from 'recoil';
import {
  currentStepState,
  testDataState,
  testStartState,
  testStepIdState,
  testStepState,
} from 'src/stores/testRecoil';

export const useTest = () => {
  const resetCurrentStep = useResetRecoilState(currentStepState);
  const [currentStep, setCurrentStep] = useRecoilState(currentStepState);
  const resetStep = useResetRecoilState(testStepState);
  const [step, setStep] = useRecoilState(testStepState);
  const resetStepId = useResetRecoilState(testStepIdState);
  const [stepId, setStepId] = useRecoilState(testStepIdState);
  const resetListData = useResetRecoilState(testDataState);
  const [listData, setListData] = useRecoilState(testDataState);
  const resetIsStart = useResetRecoilState(testStartState);
  const [isStart, setIsStart] = useRecoilState(testStartState);

  const initTest = () => {
    resetCurrentStep();
    resetStepId();
    resetStep();
    resetListData();
    resetIsStart();
  };

  return {
    initTest,
    resetCurrentStep,
    currentStep,
    setCurrentStep,
    stepId,
    setStepId,
    step,
    setStep,
    listData,
    setListData,
    isStart,
    setIsStart,
  };
};
