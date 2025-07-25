import { useState, useRef, useEffect } from "react";
import { title } from "../primitives";

interface EventLog {
  type: string;
  timestamp: number;
  x?: number;
  y?: number;
  details?: string;
}

export default function MouseEventsTest() {
  const [logs, setLogs] = useState<EventLog[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // 添加事件日志
  const addLog = (
    type: string,
    e: React.MouseEvent | React.DragEvent,
    details?: string
  ) => {
    const newLog: EventLog = {
      type,
      timestamp: Date.now(),
      x: e.clientX,
      y: e.clientY,
      details,
    };

    setLogs((prevLogs) => {
      // 保持日志不超过 20 条
      const updatedLogs = [newLog, ...prevLogs];
      return updatedLogs.slice(0, 20);
    });
  };

  // 滚动日志到顶部
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [logs]);

  // 事件处理函数
  const handleMouseEnter = (e: React.MouseEvent) => {
    addLog("mouseEnter", e);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    addLog("mouseLeave", e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    addLog("mouseMove", e);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    addLog("mouseDown", e);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    addLog("mouseUp", e);
  };

  const handleClick = (e: React.MouseEvent) => {
    addLog("click", e);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    addLog("doubleClick", e);
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    // 设置拖拽数据
    e.dataTransfer.setData("text/plain", "正在拖拽的元素");
    // 设置拖拽图像
    if (dragRef.current) {
      e.dataTransfer.setDragImage(dragRef.current, 25, 25);
    }
    addLog("dragStart", e);
  };

  const handleDrag = (e: React.DragEvent) => {
    addLog("drag", e);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    addLog("dragEnd", e);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    addLog("dragEnter", e);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // 允许放置
    addLog("dragOver", e);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    addLog("dragLeave", e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    addLog("drop", e, `接收到数据: ${data}`);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className={title({ color: "blue", size: "md" })}>
        鼠标与拖拽事件测试
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* 测试区域 */}
        <div className="border border-default-200 rounded-lg p-4 min-h-[300px] flex flex-col gap-4">
          <h2 className="text-xl font-medium">交互测试区域</h2>

          {/* 基础鼠标事件测试区 */}
          <div
            className="bg-default-100 dark:bg-default-50 p-4 rounded-md transition-colors"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            // onMouseMove={(e) => addLog("mouseMove", e)}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
          >
            <p>鼠标事件测试区域</p>
            <p className="text-sm text-default-500">尝试各种鼠标操作</p>
          </div>

          {/* 拖拽事件测试区 */}
          <div className="flex gap-4">
            {/* 可拖拽元素 */}
            <div
              ref={dragRef}
              className="bg-primary-100 dark:bg-primary-900/30 p-4 rounded-md cursor-move select-none"
              draggable
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              style={isDragging ? { opacity: 0.5 } : undefined}
            >
              <p>拖拽我</p>
            </div>

            {/* 放置区域 */}
            <div
              className="bg-success-100 dark:bg-success-900/30 p-4 rounded-md flex-1 flex items-center justify-center"
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <p>放置区域</p>
            </div>
          </div>

          <button
            className="bg-danger-500 hover:bg-danger-600 text-white px-4 py-2 rounded-md w-fit"
            onClick={clearLogs}
          >
            清除日志
          </button>
        </div>

        {/* 事件日志区域 */}
        <div className="border border-default-200 rounded-lg p-4">
          <h2 className="text-xl font-medium mb-2">事件日志</h2>
          <div
            ref={logContainerRef}
            className="h-[400px] overflow-y-auto bg-default-50 dark:bg-default-900/50 rounded-md p-2"
            onMouseMove={handleMouseMove}
          >
            {logs.length === 0 ? (
              <p className="text-default-500 text-center py-4">暂无事件日志</p>
            ) : (
              logs.map((log, index) => (
                <div
                  key={`${log.timestamp}-${index}`}
                  className="mb-2 p-2 bg-default-100 dark:bg-default-800/50 rounded-md text-sm"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{log.type}</span>
                    <span className="text-default-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-default-600">
                    坐标: x={log.x}, y={log.y}
                  </div>
                  {log.details && (
                    <div className="text-default-600 mt-1">{log.details}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
