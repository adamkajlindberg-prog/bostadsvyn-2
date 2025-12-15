import BrokerOnBoarding from "@/components/broker-onboarding";

const RegisterBrokerPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 @container">
      <div className="flex w-full max-w-md flex-col gap-6">
        <BrokerOnBoarding />
      </div>
    </div>
  );
};

export default RegisterBrokerPage;
