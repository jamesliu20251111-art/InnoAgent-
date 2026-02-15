
import { GoogleGenAI, Type } from "@google/genai";
import { Project, Feedback } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getProjectCoachFeedback = async (project: Project): Promise<Feedback> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `请作为“奇异博士”创新教练，分析以下创新项目并提供反馈。
    项目名称: ${project.name}
    行业: ${project.industry}
    当前状态: ${project.status}
    描述: ${project.description}
    
    请用玄学的术语（如维度、时空、因果）结合严谨的项目管理知识，提供一份详细的SWOT分析和多重宇宙建议（即：如果换一个方向做，会发生什么？）。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "项目成熟度评分 (0-100)" },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
          threats: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          multiverseAlternatives: { type: Type.ARRAY, items: { type: Type.STRING }, description: "平行宇宙中的其他可行方向" },
        },
        required: ["score", "strengths", "weaknesses", "opportunities", "threats", "recommendations", "multiverseAlternatives"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse response", e);
    throw new Error("解析反馈数据失败");
  }
};

export const generateBrainstormingIdeas = async (prompt: string): Promise<string[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `你现在处于镜像空间（Mirror Dimension），这是一个无尽可能的领域。请基于以下想法，通过魔法般的联想产生5个极其前卫、甚至有些疯狂但具备逻辑性的创新点子：${prompt}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  
  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return ["无法连接多重宇宙"];
  }
};

export const chatWithStrange = async (history: any[], newMessage: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: '你是“奇异博士”，一名掌握时间宝石和多元宇宙知识的顶级创新项目教练。你的说话风格神秘、睿智、略带一点傲慢但充满责任感。你会用魔法比喻来解释商业逻辑。例如，“这就是你在这个现实中的因果联系”。你会帮助用户打磨他们的商业计划、市场策略和产品设计。',
    },
  });

  // Since we don't have the history formatted for the Chat API easily here, 
  // we'll just send the current context. In a real app, we'd map history.
  return await chat.sendMessage({ message: newMessage });
};
