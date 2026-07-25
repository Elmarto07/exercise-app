import { StretchNotFound } from "@/components/stretch/stretch-not-found";
import { StretchPlayer } from "@/components/stretch/stretch-player";
import { getRoutineById } from "@/lib/services/stretch-resolver";

type StretchPageProps = {
  params: Promise<{ routineId: string }>;
};

export default async function StretchPage({ params }: StretchPageProps) {
  const { routineId } = await params;
  const routine = getRoutineById(routineId);

  if (!routine || routine.exercises.length === 0) {
    return <StretchNotFound />;
  }

  return <StretchPlayer routine={routine} />;
}
