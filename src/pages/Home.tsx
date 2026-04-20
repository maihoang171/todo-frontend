import { useEffect, useState } from "react";
import { CreateTask } from "../containers/create-task";
import { useFetchTasks } from "../hooks/use-task";
import { Pagination } from "../containers/pagination";
import { TaskDetail } from "../containers/task-detail";

export const Home = () => {
  const [page, setPage] = useState(1);

  const { handleFetchTasks } = useFetchTasks();

  const handleTaskCreated = async () => {
    setPage(1);
    await handleFetchTasks(1);
  };

  useEffect(() => {
    handleFetchTasks(page);
  }, [page]);

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-4xl m-5">Welcome to my todo app</h1>

        <CreateTask onSuccess={handleTaskCreated} />

        <h2 className="font-bold text-2xl mt-4">Task list</h2>

        <Pagination page={page} setPage={setPage} />

        <TaskDetail />
      </div>
    </>
  );
};
