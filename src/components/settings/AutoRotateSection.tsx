import React, { useState } from "react";
import { Switch } from "@heroui/switch";
import { NumberInput } from "@heroui/number-input";
import { darkNumberInputStyles } from "@/styles/component-styles";

interface AutoRotateSectionProps {
  initialAutoRotate: boolean;
  initialRotateInterval: number;
}

export interface AutoRotateSectionRef {
  getValues: () => { autoRotate: boolean; rotateInterval: number };
}

export const AutoRotateSection = React.forwardRef<
  AutoRotateSectionRef,
  AutoRotateSectionProps
>(({ initialAutoRotate, initialRotateInterval }, ref) => {
  const [autoRotate, setAutoRotate] = useState(initialAutoRotate);
  const [rotateInterval, setRotateInterval] = useState(initialRotateInterval);

  // 暴露获取当前值的方法
  React.useImperativeHandle(
    ref,
    () => ({
      getValues: () => ({ autoRotate, rotateInterval }),
    }),
    [autoRotate, rotateInterval]
  );

  return (
    <div className="flex gap-2">
      <Switch
        color="primary"
        isSelected={autoRotate}
        onValueChange={(value) => setAutoRotate(value)}
        classNames={{
          label: "text-white",
        }}
      >
        自动轮换提示
      </Switch>
      <NumberInput
        label="间隔"
        minValue={30}
        size="lg"
        isDisabled={!autoRotate}
        value={rotateInterval}
        onValueChange={(value) => setRotateInterval(value)}
        placeholder="输入轮换间隔"
        labelPlacement="outside-left"
        formatOptions={{
          style: "unit",
          unit: "second",
          unitDisplay: "narrow",
        }}
        classNames={darkNumberInputStyles}
      />
    </div>
  );
});
