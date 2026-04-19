"use client";
import css from "./NoteDetails.module.css";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchNoteById } from "@/lib/api";

export default function NoteDetailsClient() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    staleTime: 60000,
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading note</p>;
  if (!data) return <p>Note not found</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{data.title}</h2>
        </div>
        <p className={css.tag}>{data.tag}</p>
        <p className={css.content}>{data.content}</p>
        <p className={css.date}>
          {" "}
          {new Date(data.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
