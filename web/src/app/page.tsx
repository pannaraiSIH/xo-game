"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { GameResult, UserRole } from "@/types/enums";
import { cn } from "cn";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const WINNING_MOVES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

enum Mark {
  PLAYER = "X",
  BOT = "O",
}

function getRandomMove(availableMoves: number[]) {
  const randomIdx = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIdx];
}

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  const [board, setBoard] = useState<(Mark | null)[]>(Array(9).fill(null));
  const [playerTurn, setPlayerTurn] = useState(true);
  const [playerScore, setPlayerScore] = useState(0);
  const [playerStreak, setPlayerStreak] = useState(0);
  const [showBonus, setShowBonus] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchCurrentScore() {
      try {
        const response = await api.getCurrentScore();
        setPlayerScore(response.totalScore);
        setPlayerStreak(response.currentStreak);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCurrentScore();
  }, []);

  const getWinningMoves = useCallback((board: (Mark | null)[], mark: Mark) => {
    return WINNING_MOVES.find((combo) =>
      combo.every((idx) => board[idx] === mark),
    );
  }, []);

  const playerWinningMoves = getWinningMoves(board, Mark.PLAYER);
  const botWinningMoves = getWinningMoves(board, Mark.BOT);
  const winningMoves = playerWinningMoves ?? botWinningMoves ?? [];
  const isDraw = board.every((cell) => cell !== null) && !winningMoves.length;

  function addBotMove(currentBoard: (Mark | null)[]) {
    const availableMoves = currentBoard
      .map((cell, idx) => (cell === null ? idx : null))
      .filter((idx): idx is number => idx !== null);

    if (!availableMoves.length) return;

    const randomIdx = getRandomMove(availableMoves);
    const nextBoard = [...currentBoard];
    nextBoard[randomIdx] = Mark.BOT;
    setBoard(nextBoard);
    setPlayerTurn(true);
  }

  function handlePlayerMove(idx: number) {
    if (board[idx] || winningMoves.length || isDraw || !playerTurn) return;

    const nextBoard = [...board];
    nextBoard[idx] = Mark.PLAYER;
    setBoard(nextBoard);

    const won = getWinningMoves(nextBoard, Mark.PLAYER);
    const draw = board.every((cell) => cell !== null);

    if (won || draw) return;

    setPlayerTurn(false);

    setTimeout(() => {
      addBotMove(nextBoard);
    }, 500);
  }

  const hasSubmittedResult = useRef(false);

  useEffect(() => {
    if (!winningMoves.length && !isDraw) return;
    if (hasSubmittedResult.current) return;

    hasSubmittedResult.current = true;

    async function submitGameResult() {
      let result: GameResult;

      if (isDraw) {
        result = GameResult.DRAW;
      } else if (playerWinningMoves) {
        result = GameResult.WIN;
      } else {
        result = GameResult.LOSE;
      }

      try {
        const response = await api.createGameResult(result);
        setPlayerScore(response.totalScore);
        setPlayerStreak(response.hasBonus ? 3 : response.currentStreak);

        if (response.hasBonus) {
          setShowBonus(true);

          setTimeout(() => {
            setShowBonus(false);
            setPlayerStreak(response.currentStreak);
          }, 1500);
        }
      } catch (error) {
        hasSubmittedResult.current = false;
        console.error(error);
      }
    }

    submitGameResult();
  }, [winningMoves.length, isDraw, playerWinningMoves]);

  function restartGame() {
    setBoard(Array(9).fill(null));
    setPlayerTurn(true);
    hasSubmittedResult.current = false;
  }

  function handleViewScores() {
    router.push("/scores");
  }

  async function signOut() {
    await api.signOut();
    router.push("/login");
  }

  if (isLoading) {
    return (
      <div className="min-h-dvh grid place-content-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <p>Not signed in</p>;
  }

  return (
    <div className="mx-auto max-w-md pt-10 pb-10">
      <div className="flex justify-between mb-6">
        {user.role === UserRole.ADMIN && (
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleViewScores}>
              Scores
            </Button>
          </div>
        )}

        <div className="ml-auto flex gap-4">
          <Avatar>
            <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={restartGame}>
          {winningMoves.length || isDraw ? "Play Again" : "Restart Game"}
        </Button>
      </div>

      <div className=" grid grid-cols-3 gap-2 pt-5 pb-5">
        {board.map((cell, idx) => (
          <button
            key={idx}
            className={cn(
              "flex aspect-square items-center justify-center rounded-md border text-3xl font-semibold transition-colors",
              cell || !playerTurn
                ? "cursor-not-allowed"
                : "cursor-pointer hover:border-2 hover:border-orange-500",
              botWinningMoves?.includes(idx) && "border-[#C2410C] bg-[#FDEEE6]",
              playerWinningMoves?.includes(idx) &&
                "border-[#0A66D6] bg-[#E8F1FD]",
            )}
            onClick={() => handlePlayerMove(idx)}
          >
            {cell === Mark.PLAYER ? (
              <Image
                src="/images/mark-x.svg"
                alt="Mark X"
                width={120}
                height={120}
              />
            ) : cell === Mark.BOT ? (
              <Image
                src="/images/mark-o.svg"
                alt="Mark O"
                width={120}
                height={120}
              />
            ) : null}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 text-center">
        <div>
          <p className={`${playerTurn ? "text-blue-500" : ""}`}>Player (X)</p>
          <p>Score: {playerScore}</p>

          <div className="flex items-center justify-center gap-2">
            <div className="flex">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Image
                  key={idx}
                  src="/images/flame.svg"
                  alt="Mark X"
                  width={20}
                  height={20}
                  className={cn(
                    idx < playerStreak ? "opacity-100" : "opacity-20",
                  )}
                />
              ))}
            </div>

            {showBonus && (
              <span className="text-sm font-medium text-orange-500">
                +1 Bonus
              </span>
            )}
          </div>
        </div>

        <div>
          <p className={`${!playerTurn ? "text-[#C2410C]" : ""}`}>Bot (O)</p>
        </div>
      </div>
    </div>
  );
}
