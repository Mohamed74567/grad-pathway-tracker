import { BadgeCheck, BookmarkPlus, ExternalLink, MapPin, Sparkles } from "lucide-react";
import { Link } from "wouter";

export type DirectoryProgram = {
  id: number;
  slug: string;
  universityName: string;
  programName: string;
  degreeType: "phd" | "masters";
  subfield: string;
  city: string;
  state: string;
  fundingStatus: "funded" | "available" | "not_stated" | "not_applicable";
  rankingTier: "q1" | "q2" | "q3" | "not_listed" | null;
  campusImageUrl: string | null;
  officialUrl: string;
  acceptanceRate?: string | null;
  deadlines?: Array<{ deadlineDate: string | null }>;
};

const fundingLabel = { funded: "Funded", available: "Funding available", not_stated: "Funding not stated", not_applicable: "N/A" };

export function ProgramCard({ program, onSave, saved }: { program: DirectoryProgram; onSave?: (id: number) => void; saved?: boolean }) {
  const degreeLabel = program.degreeType === "phd" ? "PhD" : "Master’s";
  return (
    <article className="interactive-card surface group flex min-h-[268px] flex-col overflow-hidden p-0">
      <div className="relative h-24 overflow-hidden bg-[linear-gradient(135deg,#e5dcff,#d5f6ed)]">
        {program.campusImageUrl ? <img src={program.campusImageUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" /> : <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_28%,rgba(255,255,255,.8),transparent_12%),linear-gradient(120deg,rgba(117,89,211,.68),rgba(99,210,183,.6))]" />}
        <div className="absolute inset-x-4 top-4 flex items-center justify-between">
          <span className="rounded-full bg-white/88 px-2.5 py-1 font-mono-ui text-[0.62rem] font-medium uppercase tracking-wide text-violet-800">{degreeLabel}</span>
          <span className="rounded-full bg-slate-950/65 px-2.5 py-1 font-mono-ui text-[0.6rem] uppercase tracking-wide text-white">{program.rankingTier ? program.rankingTier.toUpperCase() : "Tier pending"}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="section-kicker">{program.subfield}</p>
        <h3 className="mt-2 line-clamp-2 text-lg font-extrabold tracking-tight text-slate-900">{program.universityName}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-slate-600">{program.programName}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-violet-800"><MapPin className="h-3 w-3" />{program.state}</span>
          <span className="flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-teal-800"><Sparkles className="h-3 w-3" />{fundingLabel[program.fundingStatus]}</span>
        </div>
        <div className="mt-auto flex items-center gap-2 pt-5">
          <Link href={`/programs/${program.slug}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-violet-700 hover:text-violet-900">View profile <ExternalLink className="h-3.5 w-3.5" /></Link>
          <a href={program.officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">Visit <ExternalLink className="h-3 w-3" /></a>
          {onSave ? <button onClick={() => onSave(program.id)} className="ml-auto inline-flex h-8 items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-3 text-xs font-bold text-violet-800 transition hover:bg-violet-100 active:scale-95"><BookmarkPlus className="h-3.5 w-3.5" />{saved ? "Saved" : "Track"}</button> : null}
        </div>
      </div>
    </article>
  );
}
