import { ProgramCard, type DirectoryProgram } from "@/components/ProgramCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { matchesDirectorySupplementalFilters } from "../../../shared/directoryFilters";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
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
  const input = useMemo(() => ({ degreeTypes: degree === "all" ? undefined : [degree], subfields: subfield === "all" ? undefined : [subfield], states: state === "all" ? undefined : [state], funding: funding === "all" ? undefined : [funding as "funded" | "available" | "not_stated" | "not_applicable"], tiers: tier === "all" ? undefined : [tier as "q1" | "q2" | "q3" | "not_listed"], search: search || undefined }), [degree, funding, search, state, subfield, tier]);
  const { data: programs = [], isLoading } = trpc.tracker.directory.list.useQuery(input);
  const { data: facets } = trpc.tracker.directory.facets.useQuery();
  const utils = trpc.useUtils();
  const add = trpc.tracker.applications.add.useMutation({ onSuccess: () => { utils.tracker.applications.list.invalidate(); toast.success("Added to My Applications"); }, onError: error => toast.error(error.message) });
  const { data: applications = [] } = trpc.tracker.applications.list.useQuery();
  const saved = new Set(applications.map(item => item.application.programId));
  const filteredPrograms = programs.filter(program => matchesDirectorySupplementalFilters(program, { acceptanceRange: acceptance as "all" | "under10" | "10to30" | "30plus", deadlineWindowDays: deadlineWindow === "all" ? undefined : Number(deadlineWindow.replace("days", "")) }));
  return <div className="content-frame page-enter space-y-6">
    <section className="surface overflow-hidden p-6 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_.8fr] lg:items-end">
        <div><p className="section-kicker">Verified program directory</p><h1 className="font-editorial mt-2 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Find a program worth tracking.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Browse master’s and doctoral programs separately, then inspect evidence before you decide. Missing university-published facts are deliberately shown as unavailable—not estimated.</p></div>
        <div className="rounded-2xl bg-violet-950 p-5 text-violet-50"><p className="font-mono-ui text-[0.62rem] uppercase tracking-[.18em] text-violet-200">Evidence status</p><p className="mt-2 text-lg font-bold">Official source links only</p><p className="mt-1 text-sm leading-5 text-violet-200">Every published record has an evidence trail. The directory grows only after field-level checks.</p></div>
      </div>
      <div className="mt-7 inline-flex rounded-2xl bg-slate-100 p-1.5" role="tablist" aria-label="Degree type">
        <button role="tab" aria-selected={degree === "phd"} onClick={() => setDegree("phd")} className={`rounded-xl px-4 py-2 text-sm font-extrabold transition active:scale-95 ${degree === "phd" ? "bg-violet-700 text-white shadow-sm" : "text-slate-600 hover:text-violet-700"}`}>PhD programs</button>
        <button role="tab" aria-selected={degree === "masters"} onClick={() => setDegree("masters")} className={`rounded-xl px-4 py-2 text-sm font-extrabold transition active:scale-95 ${degree === "masters" ? "bg-teal-600 text-white shadow-sm" : "text-slate-600 hover:text-teal-700"}`}>Master’s programs</button>
        <button role="tab" aria-selected={degree === "all"} onClick={() => setDegree("all")} className={`rounded-xl px-4 py-2 text-sm font-extrabold transition active:scale-95 ${degree === "all" ? "bg-slate-800 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>Compare all</button>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><Input value={search} onChange={event => setSearch(event.target.value)} className="h-10 rounded-xl border-slate-200 bg-white pl-9" placeholder="University, program, or field" /></div>
        <Select value={degree} onValueChange={value => setDegree(value as typeof degree)}><SelectTrigger className="h-10 min-w-35 rounded-xl bg-white"><SelectValue placeholder="Degree" /></SelectTrigger><SelectContent><SelectItem value="all">All degrees</SelectItem><SelectItem value="phd">PhD programs</SelectItem><SelectItem value="masters">Master’s programs</SelectItem></SelectContent></Select>
        <Select value={state} onValueChange={setState}><SelectTrigger className="h-10 min-w-35 rounded-xl bg-white"><SelectValue placeholder="State" /></SelectTrigger><SelectContent><SelectItem value="all">All states</SelectItem>{facets?.states.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
        <Select value={funding} onValueChange={setFunding}><SelectTrigger className="h-10 min-w-42 rounded-xl bg-white"><SelectValue placeholder="Funding" /></SelectTrigger><SelectContent><SelectItem value="all">Any funding</SelectItem><SelectItem value="funded">Funded</SelectItem><SelectItem value="available">Funding available</SelectItem><SelectItem value="not_stated">Not stated</SelectItem></SelectContent></Select>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select value={subfield} onValueChange={setSubfield}><SelectTrigger className="h-10 rounded-xl bg-white"><SelectValue placeholder="Field" /></SelectTrigger><SelectContent><SelectItem value="all">All fields</SelectItem>{facets?.subfields.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
        <Select value={tier} onValueChange={setTier}><SelectTrigger className="h-10 rounded-xl bg-white"><SelectValue placeholder="QS/THE tier" /></SelectTrigger><SelectContent><SelectItem value="all">Any tier</SelectItem><SelectItem value="q1">Q1</SelectItem><SelectItem value="q2">Q2</SelectItem><SelectItem value="q3">Q3</SelectItem><SelectItem value="not_listed">Not listed</SelectItem></SelectContent></Select>
        <Select value={acceptance} onValueChange={setAcceptance}><SelectTrigger className="h-10 rounded-xl bg-white"><SelectValue placeholder="Acceptance rate" /></SelectTrigger><SelectContent><SelectItem value="all">Any official rate</SelectItem><SelectItem value="under10">Under 10%</SelectItem><SelectItem value="10to30">10%–30%</SelectItem><SelectItem value="30plus">Over 30%</SelectItem></SelectContent></Select>
        <Select value={deadlineWindow} onValueChange={setDeadlineWindow}><SelectTrigger className="h-10 rounded-xl bg-white"><SelectValue placeholder="Deadline window" /></SelectTrigger><SelectContent><SelectItem value="all">Any official deadline</SelectItem><SelectItem value="30days">Next 30 days</SelectItem><SelectItem value="60days">Next 60 days</SelectItem><SelectItem value="90days">Next 90 days</SelectItem></SelectContent></Select>
      </div>
    </section>
    <section className="flex items-center justify-between"><div><p className="section-kicker">Directory results</p><h2 className="mt-1 text-xl font-extrabold tracking-tight">{isLoading ? "Loading programs" : `${filteredPrograms.length} verified ${degree === "phd" ? "PhD" : degree === "masters" ? "Master’s" : "program"} records`}</h2></div><Button variant="outline" onClick={() => { setDegree("phd"); setSearch(""); setState("all"); setFunding("all"); setSubfield("all"); setTier("all"); setAcceptance("all"); setDeadlineWindow("all"); }} className="rounded-xl border-slate-200 bg-white"><Filter className="mr-2 h-4 w-4" />Clear filters</Button></section>
    {filteredPrograms.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredPrograms.map((program, index) => <div key={program.id} className="stagger-item" style={{ animationDelay: `${Math.min(index * 45, 240)}ms` }}><ProgramCard program={program as DirectoryProgram} saved={saved.has(program.id)} onSave={id => add.mutate({ programId: id })} /></div>)}</div> : <div className="surface py-16 text-center"><SlidersHorizontal className="mx-auto h-8 w-8 text-violet-400" /><h3 className="mt-4 text-lg font-bold">No records match these filters</h3><p className="mx-auto mt-1 max-w-md text-sm text-slate-600">Try clearing a filter. The catalog intentionally excludes programs until their official source record is ready.</p></div>}
  </div>;
}
