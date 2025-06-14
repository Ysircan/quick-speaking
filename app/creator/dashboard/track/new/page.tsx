import CreateTrackForm from "@/components/track/CreateTrackForm"

export default function NewTrackPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-white">
      <h1 className="text-2xl font-bold mb-6">🎯 创建新的训练营</h1>
      <CreateTrackForm />
    </div>
  )
}
