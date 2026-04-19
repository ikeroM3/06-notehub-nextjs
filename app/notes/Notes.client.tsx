"use client";

import { useState } from "react";
import { fetchNotes } from "@/lib/api";
import { useDebouncedCallback } from "use-debounce";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import css from "./App.module.css";

export default function NotesClient() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () =>
      fetchNotes({
        page,
        searchText: search,
        perPage: 12,
      }),
    placeholderData: keepPreviousData,
    staleTime: 60000,
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onChange={handleSearch} />

          {data?.totalPages > 1 && (
            <Pagination
              totalPages={data.totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          )}

          <button onClick={() => setIsModalOpen(true)} className={css.button}>
            Create note +
          </button>
        </header>

        {isLoading && <p>Loading...</p>}
        {isError && <p>Error...</p>}

        {data?.notes?.length ? (
          <NoteList notes={data.notes} />
        ) : (
          !isLoading && <p>No notes found.</p>
        )}
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onClose={() => {
              setIsModalOpen(false);
              queryClient.invalidateQueries({ queryKey: ["notes"] });
            }}
          />
        </Modal>
      )}
    </>
  );
}
