import CreateTask from "../containers/create-task";

const Home = () => {
  return (
    <>
      <h1 className="font-bold text-3xl text-center mt-3">
        Welcome to my todo app
      </h1>
      <CreateTask/>
      <h2 className="text-2xl font-bold text-center">Task List</h2>
    </>
  );
};

export default Home
