import { ProgramListRow, type DirectoryListProgram } from "@/components/ProgramListRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { matchesDirectorySupplementalFilters, type DuolingoFilter, type GrePolicyFilter } from "../../../shared/directoryFilters";
import { ChevronDown, FilterX, Search, SlidersHorizontal } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { toast } from "sonner";

export default function Directory() {
  const [degree, setDegree] = useState<"all" | "phd" | "masters">("phd");
  const [search, setSearch] = useState("");
  const [state, setState] = useState("all");
  const [funding, setFunding] = useState("all");
  const [subfield, setSubfield] = useState("all");
  const [tier, setTier] = useState("all");
  const [acceptance, setAcceptance] = useState("all");
  const [deadlineWindow, setDeadlineWindow] = useState("all");
  const [grePolicy, setGrePolicy] = useState<GrePolicyFilter>("all");
  const [duolingo, setDuolingo] = useState<DuolingoFilter>("all");
  const [showMore, setShowMore] = useState(false);
  const deferredSearch = useDeferredValue(search);
  const input = useMemo(() => ({ degreeTypes: degree === "all" ? undefined : [degree], subfields: subfield === "all" ? undefined : [subfield], states: state === "all" ? undefined : [state], funding: funding === "all" ? undefined : [funding as "funded" | "available" | "not_stated" | "not_applicable"], tiers: tier === "all" ? undefined : [tier as "q1" | "q2" | "q3" | "not_listed"], search: deferredSearch.trim() || undefined }), [degree, deferredSearch, funding, state, subfield, tier]);
  const { data: programs = [], isLoading } = trpc.tracker.directory.list.useQuery(input);
  const { data: facets } = trpc.tracker.directory.facets.useQuery(undefined, { staleTime: 10 * 60_000 });
  const utils = trpc.useUtils();
  const add = trpc.tracker.applications.add.useMutation({ onSuccess: () => { utils.tracker.applications.list.invalidate(); toast.success("Added to My Applications"); }, onError: error => toast.error(error.message) });
  const { data: applications = [] } = trpc.tracker.applications.list.useQuery(undefined, { staleTime: 30_000 });
  const saved = new Set(applications.map(item => item.application.programId));
  const filteredPrograms = programs.filter(program => matchesDirectorySupplementalFilters(program, {
    acceptanceRange: acceptance as "all" | "under10" | "10to30" | "30plus",
    deadlineWindowDays: deadlineWindow === "all" ? undefined : Number(deadlineWindow.replace("days", "")),
    grePolicy,
    duolingo,
  }));
  const clearFilters = () => { setDegree("phd"); setSearch(""); setState("all"); setFunding("all"); setSubfield("all"); setTier("all"); setAcceptance("all"); setDeadlineWindow("all"); setGrePolicy("all"); setDuolingo("all"); setShowMore(false); };
  const degreeTitle = degree === "phd" ? "PhD programs" : degree === "masters" ? "Master’s programs" : "All programs";

  return <div className="content-frame page-enter space-y-5">
    <section className="surface overflow-hidden p-5 sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="section-kicker">Program explorer</p><h1 className="font-editorial mt-2 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Choose with the admission facts in view.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Start with degree and deadline. GRE and English-test filters only match records with a verified, linked policy—unknown is never treated as a no.</p></div>
        <div className="rounded-2xl bg-violet-950 px-4 py-3 text-violet-50"><p className="font-mono-ui text-[0.6rem] uppercase tracking-[.16em] text-violet-200">Directory standard</p><p className="mt-1 text-sm font-bold">Evidence before convenience</p></div>
      </div>
      <div className="mt-6 inline-flex rounded-2xl bg-slate-100 p-1.5" role="tablist" aria-label="Degree type">
        <DegreeTab active={degree === "phd"} onClick={() => setDegree("phd")} label="PhD" />
        <DegreeTab active={degree === "masters"} onClick={() => setDegree("masters")} label="Master’s" teal />
        <DegreeTab active={degree === "all"} onClick={() => setDegree("all")} label="All" neutral />
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(16rem,1fr)_11rem_11rem_11rem_auto]">
        <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><Input value={search} onChange={event => setSearch(event.target.value)} className="h-10 rounded-xl border-slate-200 bg-white pl-9" placeholder="University, program, or field" /></div>
        <Select value={deadlineWindow} onValueChange={setDeadlineWindow}><SelectTrigger className="h-10 rounded-xl bg-white"><SelectValue placeholder="Deadline" /></SelectTrigger><SelectContent><SelectItem value="all">Any deadline</SelectItem><SelectItem value="30days">Next 30 days</SelectItem><SelectItem value="60days">Next 60 days</SelectItem><SelectItem value="90days">Next 90 days</SelectItem></SelectContent></Select>
        <Select value={grePolicy} onValueChange={value => setGrePolicy(value as GrePolicyFilter)}><SelectTrigger className="h-10 rounded-xl bg-white"><SelectValue placeholder="GRE policy" /></SelectTrigger><SelectContent><SelectItem value="all">Any GRE policy</SelectItem><SelectItem value="not_required">GRE not required</SelectItem><SelectItem value="optional">GRE optional</SelectItem><SelectItem value="required">GRE required</SelectItem></SelectContent></Select>
        <Select value={duolingo} onValueChange={value => setDuolingo(value as DuolingoFilter)}><SelectTrigger className="h-10 rounded-xl bg-white"><SelectValue placeholder="English test" /></SelectTrigger><SelectContent><SelectItem value="all">Any test policy</SelectItem><SelectItem value="accepted">Duolingo accepted</SelectItem></SelectContent></Select>
        <Button type="button" variant="outline" onClick={() => setShowMore(value => !value)} className="h-10 rounded-xl border-slate-200 bg-white"><SlidersHorizontal className="mr-2 h-4 w-4" />More <ChevronDown className={`ml-1 h-3.5 w-3.5 transition ${showMore ? "rotate-180" : ""}`} /></Button>
      </div>
      {showMore ? <div className="mt-3 grid gap-3 border-t border-slate-100 pt-3 sm:grid-cols-2 lg:grid-cols-5">
        <Select value={state} onValueChange={setState}><SelectTrigger className="h-10 rounded-xl bg-white"><SelectValue placeholder="State" /></SelectTrigger><SelectContent><SelectItem value="all">All states</SelectItem>{facets?.states.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
        <Select value={subfield} onValueChange={setSubfield}><SelectTrigger className="h-10 rounded-xl bg-white"><SelectValue placeholder="Field" /></SelectTrigger><SelectContent><SelectItem value="all">All fields</SelectItem>{facets?.subfields.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
        <Select value={funding} onValueChange={setFunding}><SelectTrigger className="h-10 rounded-xl bg-white"><SelectValue placeholder="Funding" /></SelectTrigger><SelectContent><SelectItem value="all">Any funding</SelectItem><SelectItem value="funded">Funded</SelectItem><SelectItem value="available">Funding available</SelectItem><SelectItem value="not_stated">Not stated</SelectItem></SelectContent></Select>
        <Select value={acceptance} onValueChange={setAcceptance}><SelectTrigger className="h-10 rounded-xl bg-white"><SelectValue placeholder="Acceptance rate" /></SelectTrigger><SelectContent><SelectItem value="all">Any attributable rate</SelectItem><SelectItem value="under10">Under 10%</SelectItem><SelectItem value="10to30">10%–30%</SelectItem><SelectItem value="30plus">Over 30%</SelectItem></SelectContent></Select>
        <Select value={tier} onValueChange={setTier}><SelectTrigger className="h-10 rounded-xl bg-white"><SelectValue placeholder="Ranking context" /></SelectTrigger><SelectContent><SelectItem value="all">Any tier</SelectItem><SelectItem value="q1">Q1</SelectItem><SelectItem value="q2">Q2</SelectItem><SelectItem value="q3">Q3</SelectItem><SelectItem value="not_listed">Not listed</SelectItem></SelectContent></Select>
      </div> : null}
    </section>

    <section className="flex flex-wrap items-end justify-between gap-3"><div><p className="section-kicker">{degreeTitle}</p><h2 className="mt-1 text-xl font-extrabold tracking-tight">{isLoading ? "Loading verified records" : `${filteredPrograms.length} source-checked programs`}</h2></div><Button variant="outline" onClick={clearFilters} className="rounded-xl border-slate-200 bg-white"><FilterX className="mr-2 h-4 w-4" />Reset explorer</Button></section>
    {filteredPrograms.length ? <div className="space-y-3">{filteredPrograms.map(program => <ProgramListRow key={program.id} program={program as DirectoryListProgram} saved={saved.has(program.id)} onSave={id => add.mutate({ programId: id })} />)}</div> : <div className="surface py-16 text-center"><SlidersHorizontal className="mx-auto h-8 w-8 text-violet-400" /><h3 className="mt-4 text-lg font-bold">No verified records match this view</h3><p className="mx-auto mt-1 max-w-md text-sm text-slate-600">Try a broader filter. Programs with unknown GRE or English-test policies are deliberately not included in those policy filters.</p></div>}
  </div>;
}

function DegreeTab({ active, onClick, label, teal = false, neutral = false }: { active: boolean; onClick: () => void; label: string; teal?: boolean; neutral?: boolean }) {
  const activeClass = neutral ? "bg-slate-800 text-white shadow-sm" : teal ? "bg-teal-600 text-white shadow-sm" : "bg-violet-700 text-white shadow-sm";
  return <button role="tab" aria-selected={active} onClick={onClick} className={`rounded-xl px-4 py-2 text-sm font-extrabold transition active:scale-95 ${active ? activeClass : "text-slate-600 hover:text-violet-700"}`}>{label}</button>;
}
