import { useTaskStore } from "../stores/useTaskStore";

export interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
}

export const Pagination = ({ page, setPage }: PaginationProps) => {
  const totalPages = useTaskStore((state) => state.totalPages);
  const handlePrev = () => {
    if (page <= 1) return;
    setPage(page - 1);
  };

  const handleNext = () => {
    if (page >= totalPages) return;
    setPage(page + 1);
  };

  return (
    <>
      <div className="join">
        <button
          className="join-item btn"
          onClick={handlePrev}
          disabled={page === 1}
        >
          «
        </button>
        <button className="join-item btn">Page {page}</button>
        <button
          className="join-item btn"
          onClick={handleNext}
          disabled={page === totalPages || totalPages === 0}
        >
          »
        </button>
      </div>
    </>
  );
};
