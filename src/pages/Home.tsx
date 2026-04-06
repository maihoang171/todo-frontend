import { CreateTask } from "../containers/create-task";

export const Home = () => {
  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-4xl m-5">Welcome to my todo app</h1>

        <CreateTask />

        <h2 className="font-bold text-2xl mt-4">Task list</h2>
      </div>
    </>
  );
};
