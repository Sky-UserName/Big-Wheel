
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBlessing = async (name: string, dept: string, prize: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `你是一位年会主持人。请为刚刚在中奖名单中被抽中的员工“${name}”（部门：${dept}）写一段贺词。
      他刚才在大转盘中抽中了“${prize}”。
      语气要极其喜庆、高端、幽默，并结合他的部门特点和所中的奖品。
      字数在50字左右。`,
      config: {
        temperature: 0.85,
        topP: 0.95,
      }
    });
    return response.text || `恭喜${name}！好运连连！`;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `恭喜${name}！抽中${prize}，祝新的一年事业步步高升！`;
  }
};
