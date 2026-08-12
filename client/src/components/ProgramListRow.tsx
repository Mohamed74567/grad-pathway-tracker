import { BookmarkPlus, CalendarDays, ExternalLink, MapPin, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export type DirectoryListProgram = {
  id: number;
  slug: string;
  universityName: string;
  programName: string;
  degreeType: "phd" | "masters";
  subfield: string;
  city: string;
  state: string;
  officialUrl: string;
  fundingStatus: "funded" | "available" | "not_stated" | "not_applicable";
  applicationFeeDisplay?: string | null;
  grePolicy?: string | null;
  duolingoPolicy?: string | null;
  admissionFactsSourceLabel?: string | null;
  admissionFactsSourceUrl?: string | null;
  deadlines?: Array<{ deadlineDate: Date | string | null; deadlineLabel?: string | null; academicCycle?: string | null }>;
};

const fundingLabel = { funded: "Funded", available: "Funding available", not_stated: "Funding not stated", not_applicable: "N/A" };

function formatDeadline(program: DirectoryListProgram) {
  const upcoming = (program.deadlines ?? [])
    .filter(item => item.deadlineDate)
    .sort((a, b) => new Date(String(a.deadlineDate)).getTime() - new Date(String(b.deadlineDate)).getTime())[0];
  if (upcoming?.deadlineDate) return new Date(String(upcoming.deadlineDate)).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const guidance = (program.deadlines ?? []).find(item => item.deadlineLabel)?.deadlineLabel;
  return guidance ?? "Check source";
}

function signalText(value: string | null | undefined, fallback: string) {
  return value?.trim() || fallback;
}

export function ProgramListRow({ program, onSave, saved }: { program: DirectoryListProgram; onSave?: (id: number) => void; saved?: boolean }) {
  const degreeLabel = program.degreeType === "phd" ? "PhD" : "Master’s";
  return <article className="program-list-row surface group grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(18rem,1.6fr)_minmax(9rem,.75fr)_minmax(14rem,1.1fr)_minmax(9rem,.65fr)_auto] lg:items-center">
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 font-mono-ui text-[0.61rem] font-bold uppercase tracking-[.14em] ${program.degreeType === "phd" ? "bg-violet-100 text-violet-800" : "bg-teal-100 text-teal-800"}`}>{degreeLabel}</span><span className="font-mono-ui text-[0.61rem] uppercase tracking-wide text-slate-400">{program.subfield}</span></div>
      <h2 className="mt-2 truncate text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">{program.universityName}</h2>
      <p className="mt-0.5 truncate text-sm text-slate-600">{program.programName}</p>
      <p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5 text-violet-500" />{program.city}, {program.state}</p>
    </div>

    <div className="rounded-xl bg-amber-50/70 p-3 lg:bg-transparent lg:p-0"><p className="section-kicker">Next deadline</p><p className="mt-1 flex items-start gap-1.5 text-sm font-bold leading-5 text-slate-800"><CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />{formatDeadline(program)}</p></div>

    <div><p className="section-kicker">Admission signals</p><div className="mt-2 flex flex-wrap gap-1.5"><Signal label="Fee" value={signalText(program.applicationFeeDisplay, "See source")} muted={!program.applicationFeeDisplay} /><Signal label="GRE" value={signalText(program.grePolicy, "See source")} muted={!program.grePolicy} />{program.duolingoPolicy ? <Signal label="Duolingo" value={program.duolingoPolicy} /> : null}</div>{program.admissionFactsSourceUrl ? <a href={program.admissionFactsSourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wide text-violet-700 hover:text-violet-900"><ShieldCheck className="h-3 w-3" />{program.admissionFactsSourceLabel ?? "Admission source"}<ExternalLink className="h-3 w-3" /></a> : null}</div>

    <div><p className="section-kicker">Funding</p><p className="mt-2 inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-800">{fundingLabel[program.fundingStatus]}</p></div>

    <div className="flex flex-wrap items-center gap-2 lg:justify-end"><Link href={`/programs/${program.slug}`} className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-violet-200 hover:text-violet-800">Profile</Link><a href={program.officialUrl} target="_blank" rel="noreferrer" aria-label={`Visit official ${program.universityName} program page`} className="inline-flex h-9 items-center gap-1 rounded-lg px-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">Visit <ExternalLink className="h-3.5 w-3.5" /></a>{onSave ? <button onClick={() => onSave(program.id)} className={`inline-flex h-9 items-center gap-1 rounded-lg px-3 text-xs font-bold transition active:scale-95 ${saved ? "bg-teal-50 text-teal-800" : "bg-violet-700 text-white hover:bg-violet-800"}`}><BookmarkPlus className="h-3.5 w-3.5" />{saved ? "Saved" : "Track"}</button> : null}</div>
  </article>;
}

function Signal({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return <span className={`max-w-full truncate rounded-md px-2 py-1 text-[0.66rem] font-bold ${muted ? "bg-slate-100 text-slate-500" : "bg-violet-50 text-violet-800"}`} title={`${label}: ${value}`}>{label}: {value}</span>;
}
