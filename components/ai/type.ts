// 📄 components/ai/type.ts

export type QuestionType = "choice" | "short" | "cloze"

export interface PromptParams {
  topic: string
  style?: string
  structure: {
    type: QuestionType
    count: number
  }[]
}
