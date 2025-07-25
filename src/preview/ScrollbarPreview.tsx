import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { Divider } from "@heroui/divider";
import { RefreshCw } from "lucide-react";

const ScrollbarPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("default");
  const [useCustomClass, setUseCustomClass] = useState<boolean>(true);

  // 生成示例内容
  const generateContent = () => {
    const content = [];
    for (let i = 1; i <= 30; i++) {
      content.push(<p key={i}>这是测试内容行 {i}</p>);
    }
    return content;
  };

  // 滚动条样式类列表
  const scrollbarStyles = [
    {
      id: "default",
      name: "默认滚动条",
      className: "",
    },
    {
      id: "webkit",
      name: "Webkit 原生样式",
      className: "",
    },
    {
      id: "thin-gray",
      name: "细灰色滚动条",
      className:
        "scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800",
    },
    {
      id: "thin-red",
      name: "细红色滚动条",
      className:
        "scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-red-800 hover:scrollbar-thumb-red-500",
    },
    {
      id: "thin-blue",
      name: "细蓝色滚动条",
      className:
        "scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-900 hover:scrollbar-thumb-blue-500",
    },
    {
      id: "custom-preset",
      name: "预设样式类",
      className: "custom-scrollbar-dark",
    },
  ];

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-800 text-white border border-gray-700">
      <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-lg">
        <h2 className="text-xl font-bold">滚动条样式预览</h2>
      </CardHeader>

      <CardBody>
        <div className="mb-4">
          <Switch isSelected={useCustomClass} onValueChange={setUseCustomClass}>
            <span className="text-white">
              使用自定义类 (tailwind-scrollbar)
            </span>
          </Switch>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {scrollbarStyles.map((style) => (
            <Button
              key={style.id}
              size="sm"
              color={activeTab === style.id ? "primary" : "default"}
              variant={activeTab === style.id ? "shadow" : "bordered"}
              onPress={() => setActiveTab(style.id)}
              className="text-white"
            >
              {style.name}
            </Button>
          ))}
        </div>

        <Divider className="my-2 bg-gray-700/50" />

        {/* 滚动区域 */}
        <div
          className={`h-64 overflow-y-auto p-4 border border-gray-700 rounded-lg bg-gray-900/50 ${
            activeTab === "webkit"
              ? ""
              : useCustomClass && activeTab !== "default"
                ? scrollbarStyles.find((s) => s.id === activeTab)?.className ||
                  ""
                : ""
          }`}
        >
          {generateContent()}
        </div>

        <div className="mt-4 p-3 bg-gray-900/30 rounded-lg border border-gray-700/50">
          <p className="font-mono text-sm break-all">
            {activeTab === "default"
              ? "默认样式 - 无自定义类"
              : activeTab === "webkit"
                ? "使用 ::-webkit-scrollbar CSS 样式（在 globals.css 中）"
                : useCustomClass
                  ? scrollbarStyles.find((s) => s.id === activeTab)
                      ?.className || ""
                  : "tailwind-scrollbar 类被禁用"}
          </p>
        </div>
      </CardBody>

      <CardFooter>
        <Button
          color="primary"
          endContent={<RefreshCw size={16} />}
          onPress={() => window.location.reload()}
        >
          重新加载
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScrollbarPreview;
