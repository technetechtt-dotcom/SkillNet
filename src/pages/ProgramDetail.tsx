import React from 'react';
import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  CheckCircleIcon,
  FileTextIcon,
  UsersIcon,
  CalendarIcon,
  MapPinIcon,
  CoinsIcon,
  GraduationCapIcon } from
'lucide-react';
interface ProgramDetailProps {
  programId: string;
  onBack: () => void;
}
// Learnership listings for SETA
const SETA_LEARNERSHIPS = [
{
  id: 'l1',
  title: 'Electrical Engineering Learnership',
  provider: 'merSETA',
  location: 'Johannesburg, Pretoria',
  duration: '12 months',
  stipend: 'R 4,500/month',
  nqf: 'NQF Level 4',
  closing: '30 Nov 2026',
  spots: 120
},
{
  id: 'l2',
  title: 'Plumbing Trade Learnership',
  provider: 'CETA',
  location: 'Cape Town, Durban',
  duration: '18 months',
  stipend: 'R 4,200/month',
  nqf: 'NQF Level 3',
  closing: '15 Dec 2026',
  spots: 80
},
{
  id: 'l3',
  title: 'Automotive Mechanic Learnership',
  provider: 'merSETA',
  location: 'Port Elizabeth',
  duration: '12 months',
  stipend: 'R 5,000/month',
  nqf: 'NQF Level 4',
  closing: '20 Dec 2026',
  spots: 45
},
{
  id: 'l4',
  title: 'ICT End User Computing',
  provider: 'MICT SETA',
  location: 'Nationwide',
  duration: '12 months',
  stipend: 'R 3,800/month',
  nqf: 'NQF Level 3',
  closing: '10 Jan 2027',
  spots: 200
},
{
  id: 'l5',
  title: 'Welding & Fabrication',
  provider: 'merSETA',
  location: 'Vereeniging, Sasolburg',
  duration: '12 months',
  stipend: 'R 4,500/month',
  nqf: 'NQF Level 3',
  closing: '05 Dec 2026',
  spots: 60
}];

// Available grants from different organizations
const GRANTS_LIST = [
{
  id: 'g1',
  name: 'NEF iMbewu Fund',
  provider: 'National Empowerment Fund',
  amount: 'R 250,000 – R 15M',
  type: 'Loan & Grant',
  deadline: 'Open',
  purpose: 'Start-ups & emerging black entrepreneurs (51%+ black ownership).',
  color: 'bg-primary'
},
{
  id: 'g2',
  name: 'SEFA Small Enterprise Loan',
  provider: 'Small Enterprise Finance Agency',
  amount: 'R 500 – R 5M',
  type: 'Loan',
  deadline: 'Rolling',
  purpose: 'Micro, small & medium enterprises with viable business plans.',
  color: 'bg-blue-500'
},
{
  id: 'g3',
  name: 'NYDA Grant Programme',
  provider: 'National Youth Development Agency',
  amount: 'R 1,000 – R 250,000',
  type: 'Grant',
  deadline: '28 Feb 2027',
  purpose: 'Youth-owned businesses (ages 18–35). Non-repayable.',
  color: 'bg-secondary'
},
{
  id: 'g4',
  name: 'NSFAS Bursary',
  provider: 'National Student Financial Aid Scheme',
  amount: 'Full coverage',
  type: 'Bursary',
  deadline: '31 Jan 2027',
  purpose: 'TVET & university students from households earning <R 350k/yr.',
  color: 'bg-accent'
},
{
  id: 'g5',
  name: 'DTIC Black Industrialists Scheme',
  provider: 'Dept. of Trade, Industry & Competition',
  amount: 'R 30M – R 50M',
  type: 'Cost-sharing Grant',
  deadline: 'Rolling',
  purpose: 'Black-owned industrial businesses in manufacturing.',
  color: 'bg-violet-500'
},
{
  id: 'g6',
  name: 'IDC Gro-E Youth Scheme',
  provider: 'Industrial Development Corporation',
  amount: 'R 1M – R 50M',
  type: 'Loan',
  deadline: 'Rolling',
  purpose: 'Youth entrepreneurs creating jobs in priority sectors.',
  color: 'bg-emerald-500'
},
{
  id: 'g7',
  name: 'SAB Foundation Tholoana',
  provider: 'SAB Foundation',
  amount: 'R 75,000',
  type: 'Grant + Mentorship',
  deadline: '15 Mar 2027',
  purpose: 'Survivalist & micro entrepreneurs with growth potential.',
  color: 'bg-orange-500'
},
{
  id: 'g8',
  name: 'Anglo Zimele Fund',
  provider: 'Anglo American',
  amount: 'R 1M – R 10M',
  type: 'Loan',
  deadline: 'Rolling',
  purpose: 'SMMEs in mining-host communities.',
  color: 'bg-red-500'
}];

const PROGRAMS_DATA: Record<string, any> = {
  grants: {
    title: 'Grants & Funding',
    subtitle: 'R 2.4 Billion in active opportunities',
    color: 'bg-primary',
    description:
    'Explore active grants, bursaries and loans from government departments, development finance institutions and private foundations across South Africa.',
    listings: GRANTS_LIST,
    listingType: 'grants'
  },
  seta: {
    title: 'SETA Learnerships',
    subtitle: 'Apply for accredited learnerships',
    color: 'bg-secondary',
    description:
    'Learnerships are structured learning programmes that combine theory and practical workplace experience. Earn a stipend while gaining an accredited NQF-aligned qualification across 21 Sector Education and Training Authorities.',
    requirements: [
    'South African ID',
    'Minimum Grade 9 (varies by learnership)',
    'Aged 18 – 35',
    'Currently unemployed',
    'Willing to commit to full duration'],

    listings: SETA_LEARNERSHIPS,
    listingType: 'learnerships'
  },
  yes: {
    title: 'YES Initiative',
    subtitle: 'Youth Employment Service',
    color: 'bg-accent',
    description:
    'A business-led collaboration with government to create 12-month quality work experiences for unemployed black youth.',
    requirements: [
    'Black South African',
    'Unemployed',
    'Between 18 and 35 years old',
    'Matric certificate (preferred)'],

    benefits: [
    '12-month quality work experience',
    'Minimum wage salary',
    'CV and reference letter',
    'Smartphone and apps for learning']

  },
  coida: {
    title: 'COIDA Compliance',
    subtitle: 'Compensation for Occupational Injuries',
    color: 'bg-violet-500',
    description:
    'Ensure your business is compliant with the Compensation for Occupational Injuries and Diseases Act to protect your workers.',
    requirements: [
    'Company registration documents',
    'Employee details and earnings',
    'Nature of business description',
    'Banking details'],

    benefits: [
    'Protection against civil claims',
    'Medical costs covered for injured workers',
    'Compensation for temporary/permanent disablement',
    'Letter of Good Standing']

  },
  'id-link': {
    title: 'Link ID Number',
    subtitle: 'Verify your identity',
    color: 'bg-primary',
    description:
    'Linking your South African ID unlocks access to government programs, grants and learnerships directly from your profile.',
    requirements: [
    'Valid SA ID document',
    'Selfie for biometric verification',
    'Banking details (optional)'],

    benefits: [
    'One-tap applications to programs',
    'Pre-filled forms',
    'Direct stipend & grant payouts',
    'Auto B-BBEE classification']

  }
};
export function ProgramDetail({ programId, onBack }: ProgramDetailProps) {
  const program = PROGRAMS_DATA[programId] || PROGRAMS_DATA['seta'];
  const hasListings = !!program.listings;
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="bg-surface px-4 py-4 flex items-center gap-3 border-b border-border shadow-sm">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-background transition-colors">
          
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-text-primary flex-1">
          Program Details
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Hero */}
        <div
          className={`p-6 rounded-3xl text-white ${program.color} relative overflow-hidden shadow-elevated`}>
          
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-1">{program.title}</h2>
            <p className="opacity-90 text-sm font-medium">{program.subtitle}</p>
          </div>
        </div>

        {/* About */}
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-2">About</h3>
          <p className="text-text-secondary leading-relaxed text-sm">
            {program.description}
          </p>
        </div>

        {/* Requirements */}
        {program.requirements &&
        <div>
            <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
              <FileTextIcon className="w-5 h-5 text-primary" />
              Eligibility
            </h3>
            <ul className="space-y-2">
              {program.requirements.map((req: string, idx: number) =>
            <li
              key={idx}
              className="flex items-start gap-2 text-text-secondary text-sm">
              
                  <CheckCircleIcon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
            )}
            </ul>
          </div>
        }

        {/* Benefits */}
        {program.benefits &&
        <div>
            <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-secondary" />
              Benefits
            </h3>
            <ul className="space-y-2">
              {program.benefits.map((benefit: string, idx: number) =>
            <li
              key={idx}
              className="flex items-start gap-2 text-text-secondary text-sm">
              
                  <CheckCircleIcon className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
            )}
            </ul>
          </div>
        }

        {/* Listings — Grants */}
        {hasListings && program.listingType === 'grants' &&
        <div>
            <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
              <CoinsIcon className="w-5 h-5 text-primary" />
              Active Grants ({program.listings.length})
            </h3>
            <div className="space-y-3">
              {program.listings.map((grant: any) =>
            <div
              key={grant.id}
              className="bg-surface rounded-3xl border border-border p-4 shadow-sm">
              
                  <div className="flex items-start gap-3 mb-3">
                    <div
                  className={`w-1 self-stretch rounded-full ${grant.color} flex-shrink-0`} />
                
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-text-primary text-base mb-1 leading-tight">
                        {grant.name}
                      </h4>
                      <p className="text-xs text-text-secondary font-medium">
                        by {grant.provider}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-primary/10 text-primary">
                      {grant.type}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mb-3 leading-relaxed">
                    {grant.purpose}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-background rounded-xl p-2.5 border border-border">
                      <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-0.5">
                        Amount
                      </p>
                      <p className="text-sm font-bold text-text-primary">
                        {grant.amount}
                      </p>
                    </div>
                    <div className="bg-background rounded-xl p-2.5 border border-border">
                      <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-0.5">
                        Deadline
                      </p>
                      <p className="text-sm font-bold text-text-primary">
                        {grant.deadline}
                      </p>
                    </div>
                  </div>
                  <button className="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors">
                    Apply
                    <ExternalLinkIcon className="w-4 h-4" />
                  </button>
                </div>
            )}
            </div>
          </div>
        }

        {/* Listings — Learnerships */}
        {hasListings && program.listingType === 'learnerships' &&
        <div>
            <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
              <GraduationCapIcon className="w-5 h-5 text-secondary" />
              Open Learnerships ({program.listings.length})
            </h3>
            <div className="space-y-3">
              {program.listings.map((l: any) =>
            <div
              key={l.id}
              className="bg-surface rounded-3xl border border-border p-4 shadow-sm">
              
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-text-primary text-base mb-1 leading-tight">
                        {l.title}
                      </h4>
                      <p className="text-xs text-text-secondary font-medium">
                        {l.provider}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-secondary/10 text-secondary whitespace-nowrap">
                      {l.nqf}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-text-secondary font-medium mb-3">
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="w-3.5 h-3.5" />
                      {l.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {l.duration}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-background rounded-xl p-2 border border-border">
                      <p className="text-[9px] text-text-secondary font-bold uppercase mb-0.5">
                        Stipend
                      </p>
                      <p className="text-xs font-bold text-text-primary">
                        {l.stipend}
                      </p>
                    </div>
                    <div className="bg-background rounded-xl p-2 border border-border">
                      <p className="text-[9px] text-text-secondary font-bold uppercase mb-0.5">
                        Closes
                      </p>
                      <p className="text-xs font-bold text-text-primary">
                        {l.closing}
                      </p>
                    </div>
                    <div className="bg-background rounded-xl p-2 border border-border">
                      <p className="text-[9px] text-text-secondary font-bold uppercase mb-0.5">
                        Spots
                      </p>
                      <p className="text-xs font-bold text-success">
                        {l.spots}
                      </p>
                    </div>
                  </div>
                  <button className="w-full py-2.5 bg-secondary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                    Apply Now
                    <ExternalLinkIcon className="w-4 h-4" />
                  </button>
                </div>
            )}
            </div>
          </div>
        }

        <div className="h-4" />
      </div>

      {/* Apply CTA — only for programs without listings */}
      {!hasListings &&
      <div className="p-4 border-t border-border bg-surface">
          <button className="w-full py-3.5 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors">
            {programId === 'id-link' ? 'Link My ID' : 'Apply Now'}
            <ExternalLinkIcon className="w-4 h-4" />
          </button>
        </div>
      }
    </div>);

}