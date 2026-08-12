import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, BadgeCheck, BookmarkPlus, Building2, CheckCircle2, ExternalLink, MapPin, ShieldCheck } from "lucide-react";
import { Link, useLocation, useRoute } from "wouter";
import { toast } from "sonner";

const unavailable = "Not published by institution";

export default function ProgramDetails() {
  const [, params] = useRoute("/programs/:slug");
  const [, setLocation] = useLocation();
  const { data: program, isLoading } = trpc.tracker.directory.bySlug.useQuery({ slug: params?.slug ?? "" }, { enabled: Boolean(params?.slug) });
  const utils = trpc.useUtils();
  const add = trpc.tracker.applications.add.useMutation({ onSuccess: () => { utils.tracker.applications.list.invalidate(); toast.success("Added to My Applications"); }, onError: error => toast.error(error.message) });
  if (isLoading) return <div className="content-frame py-20 text-center text-slate-500">Loading verified record…</div>;
  if (!program) return <div className="content-frame py-20 text-center"><h1 className="font-editorial text-4xl">Program not found</h1><Link href="/programs" className="mt-4 inline-block font-bold text-violet-700">Return to directory</Link></div>;
  const degreeLabel = program.degreeType === "phd" ? "PhD" : "Master’s";
  const requirements = program.applicationRequirements ?? ["See the official program application page for current requirements."];
  return <div className="content-frame page-enter space-y-5">
    <button onClick={() => setLocation("/programs")} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-violet-700"><ArrowLeft className="h-4 w-4" />All programs</button>
    <section className="surface overflow-hidden">
      <div className="relative min-h-68 bg-[linear-gradient(120deg,#33206e,#7356ca_52%,#45b99a)]">
        {program.campusImageUrl ? <img src={program.campusImageUrl} alt={program.campusImageAlt ?? "University campus"} className="absolute inset-0 h-full w-full object-cover" /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
        <div className="relative flex min-h-68 flex-col justify-end p-6 text-white sm:p-9"><div className="mb-3 flex flex-wrap gap-2"><span className="rounded-full bg-white/18 px-3 py-1 font-mono-ui text-[0.65rem] uppercase tracking-[.15em] backdrop-blur">{degreeLabel}</span><span className="rounded-full bg-white/18 px-3 py-1 font-mono-ui text-[0.65rem] uppercase tracking-[.15em] backdrop-blur">Verified sources</span></div><h1 className="font-editorial max-w-3xl text-4xl font-semibold leading-none tracking-tight sm:text-5xl">{program.universityName}</h1><p className="mt-3 text-base text-white/85">{program.programName}</p></div>
      </div>
      <div className="grid gap-5 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8"><div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600"><span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-violet-600" />{program.city}, {program.state}</span><span className="flex items-center gap-1.5"><Building2 className="h-4 w-4 text-violet-600" />{program.department}</span><span className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-teal-600" />Checked {program.verifiedAt ? new Date(program.verifiedAt).toLocaleDateString() : "—"}</span></div><Button onClick={() => add.mutate({ programId: program.id })} className="rounded-xl bg-violet-700 hover:bg-violet-800"><BookmarkPlus className="mr-2 h-4 w-4" />Track application</Button></div>
    </section>
    <div className="grid gap-5 xl:grid-cols-[1.38fr_.62fr]">
      <div className="space-y-5">
        <section className="surface p-6 sm:p-7"><p className="section-kicker">Program profile</p><p className="mt-3 leading-7 text-slate-700">{program.description ?? "The official program website has not yet published a directory-ready summary."}</p><div className="mt-6 grid gap-6 md:grid-cols-2"><div><h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">Curriculum highlights</h2><ul className="mt-3 space-y-2">{(program.curriculumHighlights ?? []).map(item => <li key={item} className="flex gap-2 text-sm text-slate-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />{item}</li>)}</ul></div><div><h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">Research areas</h2><div className="mt-3 flex flex-wrap gap-2">{(program.facultyResearchAreas ?? []).map(item => <span key={item} className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-800">{item}</span>)}</div></div></div><div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/55 p-5"><h2 className="text-sm font-extrabold uppercase tracking-wide text-teal-950">Application requirements</h2><ul className="mt-3 grid gap-2 sm:grid-cols-2">{requirements.map(item => <li key={item} className="flex gap-2 text-sm text-teal-900"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />{item}</li>)}</ul></div></section>
        <section className="surface p-6 sm:p-7"><p className="section-kicker">Official deadline guidance</p><div className="mt-4 space-y-3">{program.deadlines.length ? program.deadlines.map(item => <a key={item.id} href={item.sourceUrl} target="_blank" rel="noreferrer" className="group flex items-start justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/75 p-4 transition hover:border-violet-200 hover:bg-violet-50"><div><p className="text-sm font-bold text-slate-800">{item.deadlineLabel ?? item.deadlineType}</p><p className="mt-1 font-mono-ui text-[0.64rem] uppercase tracking-wide text-slate-500">{item.applicantType} · {item.academicCycle}</p></div><ExternalLink className="mt-1 h-4 w-4 shrink-0 text-violet-600" /></a>) : <p className="text-sm text-slate-600">No official deadline has been published for this record yet.</p>}</div></section>
      </div>
      <aside className="space-y-5"><section className="surface p-6"><p className="section-kicker">Decision facts</p><dl className="mt-4 divide-y divide-slate-100"><Fact label="Funding" value={program.fundingStatus === "funded" ? "Funded" : program.fundingStatus === "available" ? "Funding available" : unavailable} /><Fact label="Tuition" value={program.tuitionDisplay ?? unavailable} /><Fact label="Acceptance rate" value={program.acceptanceRate ? `${program.acceptanceRate}%` : unavailable} /><Fact label="QS/THE tier" value={program.rankingTier ? program.rankingTier.toUpperCase() : unavailable} /></dl></section><section className="rounded-3xl bg-violet-950 p-6 text-violet-50"><ShieldCheck className="h-5 w-5 text-teal-300" /><h2 className="mt-3 font-editorial text-2xl font-semibold">Source-first, not guess-first.</h2><p className="mt-2 text-sm leading-6 text-violet-200">This record avoids estimates where the institution has not published a program-level figure. Use the official page for the live application instructions.</p><a href={program.officialUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-teal-200">Open official program page <ExternalLink className="h-4 w-4" /></a></section></aside>
    </div>
  </div>;
}

function Fact({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between gap-4 py-3.5"><dt className="text-sm text-slate-500">{label}</dt><dd className="max-w-45 text-right text-sm font-bold text-slate-800">{value}</dd></div>; }
