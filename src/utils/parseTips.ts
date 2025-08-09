// 解析后的提示数据结构
export interface ParsedTip {
  main: string; // 主要提示文本
  description?: string; // 补充描述（可选）
}

// 解析提示文本，分离主要内容和补充描述
export function parseTipText(tipText: string): ParsedTip {
  const lines = tipText.split("\n");
  const mainLines: string[] = [];
  let description: string | undefined;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith(">")) {
      // 找到第一个以 > 开头的行作为补充描述
      if (!description) {
        description = trimmedLine.substring(1).trim(); // 移除 > 符号和前后空格
      }
    } else if (trimmedLine) {
      // 非空行且不是描述行，添加到主要内容
      mainLines.push(trimmedLine);
    }
  }

  return {
    main: mainLines.join("\n").trim(),
    description,
  };
}

// 解析所有提示文本，支持空行和 -- 分隔符
export function parseAllTips(tips: string[]): ParsedTip[] {
  return tips.map(parseTipText);
}

// 从文本域内容解析提示条数
export function parseTipsFromText(text: string): string[] {
  if (!text.trim()) return [];

  // 使用统一正则：同时匹配 -- 分隔符和空行分隔符
  const tips = text
    .split(/\n\s*(?:--\s*)?\n/)
    .filter((tip) => tip.trim() !== "");

  return tips;
}
