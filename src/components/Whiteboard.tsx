import { useRef } from "react";
import { WhiteboardStyled } from "./WhiteboardStyled";
import { Paths } from "../types";
import { drawPathsWithPoints, getRandomColor } from "../utils";

export const Whiteboard = function () {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isDrawing = useRef(false);
  const isMouseDown = useRef(false);
  const paths = useRef<Paths>([]);

  const color = useRef(getRandomColor());

  return (
    <div className="size-full p-4">
      <section className="absolute left-80 top-10 flex flex-wrap">
        <button
          onClick={() => (isDrawing.current = !isDrawing.current)}
          type="button"
          className=" bg-green-500 text-white hover:bg-green-400 rounded-md py-2 px-4"
        >
          toggle draw
        </button>
        <button
          onClick={() => {
            let newColor = color.current;
            do {
              newColor = getRandomColor();
            } while (newColor === color.current);
            color.current = newColor;
          }}
          type="button"
          className="ml-2 bg-violet-500 text-white hover:bg-violet-400 rounded-md py-2 px-4"
        >
          change color
        </button>
        <button
          onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            paths.current.splice(-1, 1);
            drawPathsWithPoints(paths.current, canvas);
          }}
          type="button"
          className="ml-2 bg-yellow-500 text-white hover:bg-yellow-400 rounded-md py-2 px-4"
        >
          undo
        </button>
        <button
          onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.reset();
            paths.current.length = 0;
          }}
          type="button"
          className="ml-2 bg-red-500 text-white hover:bg-red-400 rounded-md py-2 px-4"
        >
          clear
        </button>
      </section>

      <WhiteboardStyled
        ref={canvasRef}
        className="aspect-video border border-slate-500 rounded-lg"
        width={1024}
        height={768}
        onMouseDown={(e) => {
          if (!isDrawing.current) return;
          const target = e.target as HTMLCanvasElement;
          if (!target || target.tagName.toLowerCase() !== "canvas") return;
          const ctx = target.getContext("2d");
          if (!ctx) return;

          isMouseDown.current = true;

          const rect = target.getBoundingClientRect();
          const scaleX = target.width / rect.width;
          const scaleY = target.height / rect.height;

          const newPoint = {
            x: e.nativeEvent.offsetX * scaleX,
            y: e.nativeEvent.offsetY * scaleY,
          };

          ctx.beginPath();
          ctx.lineWidth = 10;
          ctx.strokeStyle = color.current;

          ctx.moveTo(newPoint.x, newPoint.y);

          const lastPathIndex = paths.current.length - 1;
          paths.current.push({
            pathIndex: lastPathIndex + 1,
            points: [newPoint],
          });
        }}
        onMouseMove={(e) => {
          if (!isDrawing.current || !isMouseDown.current) return;
          const target = e.target as HTMLCanvasElement;
          if (!target || target.tagName.toLowerCase() !== "canvas") return;

          const ctx = target.getContext("2d");
          if (!ctx) return;

          const rect = target.getBoundingClientRect();
          const scaleX = target.width / rect.width;
          const scaleY = target.height / rect.height;

          const newPoint = {
            x: e.nativeEvent.offsetX * scaleX,
            y: e.nativeEvent.offsetY * scaleY,
          };

          ctx.lineTo(newPoint.x, newPoint.y);
          ctx.stroke();

          const lastPathIndex = paths.current.length - 1;
          paths.current[lastPathIndex].points.push(newPoint);
        }}
        onMouseUp={() => {
          isMouseDown.current = false;
        }}
      />
    </div>
  );
};
