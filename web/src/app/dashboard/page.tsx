import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

// Define a more specific type based on the query
type MeetingWithDoctor = {
  id: string;
  startTime: Date;
  endTime: Date;
  reason: string | null;
  doctor: {
    name: string | null;
  };
};

export default async function PatientDashboardPage() {
  const session = await auth();
  if (!session || (session.user as any).role !== "PATIENT") {
    redirect("/login");
  }

  const meetings: MeetingWithDoctor[] = await prisma.meeting.findMany({
    where: {
      patientId: (session.user as any).id,
      startTime: { gte: new Date() },
    },
    orderBy: { startTime: "asc" },
    include: { doctor: { select: { name: true } } },
  });

  const grouped = meetings.reduce((acc: Record<string, MeetingWithDoctor[]>, m) => {
    const date = m.startTime.toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(m);
    return acc;
  }, {});

  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <div className="max-w-4xl mx-auto space-y-5">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-primary)]/80">Patient Dashboard</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)]">Upcoming meetings</h1>
            <p className="text-sm text-[var(--color-foreground)]/70 mt-1">
              Keep track of your scheduled sessions with your doctor.
            </p>
          </div>
        </header>

        <section className="bg-[var(--color-surface)]/95 rounded-2xl border border-white/60 shadow-sm p-4 md:p-6 space-y-4 backdrop-blur-sm">
          {Object.keys(grouped).length === 0 ? (
            <p className="text-sm text-[var(--color-foreground)]/70">No upcoming meetings.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(grouped).map(([date, meetings]) => (
                <div key={date} className="space-y-2">
                  <h2 className="font-semibold text-sm md:text-base text-[var(--color-foreground)]/80">{date}</h2>
                  <ul className="space-y-2">
                    {meetings.map((m) => (
                      <li
                        key={m.id}
                        className="p-3 md:p-4 rounded-xl border border-[var(--color-primary)]/10 bg-white/85 dark:bg-white/5 flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-semibold text-sm md:text-base text-[var(--color-foreground)]">
                            {m.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {m.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <span className="inline-flex items-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2.5 py-0.5 text-xs font-medium">
                            With Dr. {m.doctor.name}
                          </span>
                        </div>
                        {m.reason && (
                          <div className="text-xs md:text-sm text-[var(--color-foreground)]/70 mt-1">
                            Reason: {m.reason}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

