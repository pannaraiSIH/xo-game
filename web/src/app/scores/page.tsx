"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { UserScores } from "@/types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "cn";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Scores() {
  const router = useRouter();

  const [scores, setScores] = useState<UserScores[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    async function fetchUserScores() {
      const response = await api.getUserScores(
        pagination.limit,
        pagination.page,
      );

      setScores(response.data ?? []);

      if (response.pagination) {
        setPagination(response.pagination);
      }
    }

    fetchUserScores();
  }, [pagination.limit, pagination.page]);

  function goBack() {
    router.replace("/");
  }

  return (
    <div className="p-10">
      <Button variant="outline" className="mb-6" onClick={() => goBack()}>
        Back
      </Button>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead className="">Player</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Streak</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.map((i) => (
              <TableRow key={i.user.id}>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>{i.user.firstName}</TableCell>
                <TableCell>{i.totalScore}</TableCell>
                <TableCell className="flex">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Image
                      key={idx}
                      src="/images/flame.svg"
                      alt="Mark X"
                      width={20}
                      height={20}
                      className={cn(
                        idx < i.currentStreak ? "opacity-100" : "opacity-20",
                      )}
                    />
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-end">
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(prev.page - 1, 1),
                  }))
                }
                className={cn(
                  pagination.page === 1 && "pointer-events-none opacity-50",
                )}
              />
            </PaginationItem>

            {Array.from({ length: pagination.totalPages }, (_, idx) => {
              const pageNumber = idx + 1;

              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={pagination.page === pageNumber}
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: pageNumber,
                      }))
                    }
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(prev.page + 1, prev.totalPages),
                  }))
                }
                className={cn(
                  pagination.page >= pagination.totalPages &&
                    "pointer-events-none opacity-50",
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
