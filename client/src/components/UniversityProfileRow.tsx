import { Link } from "wouter";
import { ExternalLink, MapPin, ShieldCheck } from "lucide-react";
import type { DirectoryListProgram } from "./ProgramListRow";

export type UniversityProfile = {
  universityName: string;
  programs: DirectoryListProgram[];
};

function degreeLabel(program: DirectoryListProgram) {
  return program.degreeType === "phd" ? "PhD" : "Master’s";
}

export function UniversityProfileRow({ profile }: { profile: UniversityProfile }) {
  const paths = [...profile.programs].sort((a, b) => {
    if (a.degreeType !== b.degreeType) return a.degreeType === "phd" ? -1 : 1;
    return a.programName.localeCompare(b.programName);
  });
  const anchor = paths[0];
  const degreeTypes = new Set(paths.map(path => path.degreeType));

  return <article className="program-list-row surface p-4 sm:p-5">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-violet-100 px-2.5 py-1 font-mono-ui text-[0.61rem] font-bold uppercase tracking-[.14em] text-violet-800">University profile</span>
          {degreeTypes.has("phd") && degreeTypes.has("masters") ? <span className="rounded-full bg-teal-100 px-2.5 py-1 font-mono-ui text-[0.61rem] font-bold uppercase tracking-[.11em] text-teal-800">PhD + Master’s choices</span> : null}
          <span className="font-mono-ui text-[0.61rem] uppercase tracking-wide text-slate-400">{paths.length} verified degree {paths.length === 1 ? "path" : "paths"}</span>
        </div>
        <h2 className="mt-2 text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">{profile.universityName}</h2>
        <p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5 text-violet-500" />{anchor.city}, {anchor.state}</p>
      </div>
      <a href={anchor.officialUrl} target="_blank" rel="noreferrer" className="inline-flex h-9 shrink-0 items-center gap-1 self-start rounded-lg px-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">University source <ExternalLink className="h-3.5 w-3.5" /></a>
    </div>

    <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {paths.map(path => <Link key={path.id} href={`/programs/${path.slug}`} className="group/degree rounded-xl border border-slate-200 bg-white p-3 transition hover:border-violet-300 hover:bg-violet-50/40">
        <div className="flex items-center justify-between gap-2"><span className={`rounded-full px-2 py-0.5 font-mono-ui text-[0.59rem] font-bold uppercase tracking-[.12em] ${path.degreeType === "phd" ? "bg-violet-100 text-violet-800" : "bg-teal-100 text-teal-800"}`}>{degreeLabel(path)}</span><ExternalLink className="h-3.5 w-3.5 text-slate-400 transition group-hover/degree:text-violet-700" /></div>
        <p className="mt-2 line-clamp-2 text-sm font-bold leading-5 text-slate-800">{path.programName}</p>
        <p className="mt-2 text-xs font-semibold text-violet-700">{path.hasFeeWaiverGuidance ? "Open degree-specific facts & fee-waiver help" : "Open degree-specific admission facts"}</p>
      </Link>)}
    </div>

    <p className="mt-4 flex items-start gap-1.5 text-xs leading-5 text-slate-500"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />Choose a degree path to see its own application fee, deadline, and admission requirements. Fee-waiver help is displayed only when an official source supports it; facts are never copied from one degree to another.</p>
  </article>;
}
