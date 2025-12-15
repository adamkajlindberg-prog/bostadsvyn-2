import SelectProfile from "@/components/select-profile";

const SelectProfilePage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 @container">
      <div className="flex w-full max-w-md flex-col gap-6">
        <SelectProfile />
      </div>
    </div>
  );
};

export default SelectProfilePage;
