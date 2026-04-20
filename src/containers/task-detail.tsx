import { useTaskStore } from "../stores/useTaskStore";
import { format } from "date-fns";
import { UpdateTask } from "./update-task";
import { useDeleteTask } from "../hooks/use-task";

export const TaskDetail = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const deleteTaskInStore = useTaskStore((state) => state.deleteTask);

  const { handleDeleteTask } = useDeleteTask();

  const handleDelete = (taskId: string) => {
    handleDeleteTask(taskId);
    deleteTaskInStore(taskId);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-fixed">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Deadline</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-500">
                  No task has found
                </td>
              </tr>
            ) : (
              tasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td>{t.description}</td>
                  <td>{t.status}</td>
                  <td>{format(new Date(t.deadlineAt), "MM/dd/yyyy")}</td>
                  <td className="flex gap-2">
                    <UpdateTask task={t} />

                    <button
                      className="btn bg-red-500"
                      onClick={() => handleDelete(t.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
