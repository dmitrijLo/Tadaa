import InterestPicker from "./InterestPicker";

const fetchInterestOptions = async (): Promise<
  InterestOption[] | undefined
> => {
  try {
    const response = await fetch(`${process.env.API_URL}/interests`);
    if (!response.ok) return undefined;

    const interests: InterestOption[] = await response.json();

    return interests;
  } catch (error) {
    console.log(error);
  }
};

export default async function InterestOptionComponent() {
  const interests = await fetchInterestOptions();

  return (
    <>
      <InterestPicker interests={interests} />
    </>
  );
}
