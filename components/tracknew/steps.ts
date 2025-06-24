export type StepType = 'text' | 'number' | 'info' | 'image'

export interface TrackStep {
  id: string
  type: StepType
  title: string
  subtitle?: string
  key?: 'title' | 'description' | 'durationDays' | 'coverImage'
  options?: string[]
}

export const steps: TrackStep[] = [
  {
    id: 'intro',
    type: 'info',
    title: 'Create your own training camp',
    subtitle: 'Let\'s set it up in a few simple steps.'
  },
  {
    id: 'title',
    type: 'text',
    title: 'What will you name this track?',
    key: 'title',
  },
  {
    id: 'description',
    type: 'text',
    title: 'Write a short description',
    key: 'description',
  },
 
  {
    id: 'days',
    type: 'number',
    title: 'How many days will it last?',
    key: 'durationDays',
  },
]
