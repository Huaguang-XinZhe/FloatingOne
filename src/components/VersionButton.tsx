import React, { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Badge } from "@heroui/badge";
import { buttonStyles } from "@/styles/component-styles";
import { getVersion } from "@tauri-apps/api/app";
import { useNewVersionDownloaded } from "@/store/appStore";
import { emit } from "@tauri-apps/api/event";
import { EventKey } from "@/types";
// import { delay } from "@/utils/utils";

const VersionButton: React.FC = () => {
  // 本地状态：当前版本
  const [currentVersion, setCurrentVersion] = useState("");

  const isNewVersionDownloaded = useNewVersionDownloaded();

  // 初始化
  useEffect(() => {
    const initialize = async () => {
      // 获取当前版本
      const version = await getVersion();
      // // 调试延迟
      // delay(1000);
      setCurrentVersion(version);
    };

    initialize();
  }, []);

  // 按钮点击处理
  const askInstall = async () => {
    await emit(EventKey.INSTALL_REQUEST);
  };

  return (
    <>
      {currentVersion && (
        <Badge
          isInvisible={!isNewVersionDownloaded}
          content="New"
          color="danger"
          shape="circle"
          size="sm"
        >
          <Button
            variant="light"
            isDisabled={!isNewVersionDownloaded}
            onPress={askInstall}
            className={buttonStyles.hoverGray800}
          >
            v{currentVersion}
          </Button>
        </Badge>
      )}
    </>
  );
};

export default VersionButton;
