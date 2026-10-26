import fs from 'node:fs/promises';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';

const OUT = 'C:/gc-app/outputs/sg_ai_12_platform_template';
const C = {void:'#0A0A0A',panel:'#121212',paper:'#F2F2F2',white:'#FFFFFF',mist:'#E8E8E6',steel:'#6B6B6B',line:'#D8D8D4',forest:'#0C3024',copper:'#C79F6B',electric:'#2061DE',hazard:'#E8672E',critical:'#FF3B30',confirm:'#1FAA59',input:'#EAF0FF'};
const shared = [
  ['00.01','Accountable human','Name the person accountable for this platform decision.','AI never substitutes for accountable authority.','Select the accountable individual for this Estate.','Verify role, current credential and declared authority.','Authority verification note','Blocks gate if absent'],
  ['00.02','Estate / property identifier','Enter the permanent working identifier used across evidence and decisions.','Identifiers remain stable; rename by controlled decision only.','Local code and location may vary.','Check identifier collision and dossier consistency.','Identity reconciliation','Blocks gate if inconsistent'],
  ['00.03','Pinned EBOK version','Enter the exact EBOK version governing this work.','Only IDs at pinned versions bind.','None. A later version requires deliberate migration.','Compare project artifacts with pinned version.','Canon gap report','Blocks all downstream work'],
  ['00.04','Decision deadline','Enter the date by which the human gate must be heard.','A deadline never lowers an evidence requirement.','Timing may follow project constraints.','Identify evidence at risk of missing the date.','Decision-readiness forecast','Causes HOLD, never automatic approval'],
  ['00.05','Known exception references','List active exception IDs touching this platform.','Every exception has owner, expiry and remediation.','Exception content is project-specific.','Check expiry, overlap and downstream impact.','Exception impact map','Expired exception causes STOP'],
];

const layers = [
{name:'L1 Strategy', code:'L1', title:'STRATEGY PLATFORM', next:'L2 Business', rows:[
['1.01','Strategic objective','State the precise outcome this Estate is intended to achieve.','Every objective cites the L0 domain it serves.','Objective emphasis may vary by portfolio need.','Test objective against L0 and current portfolio strategy.','Strategic-fit brief','Required for strategy gate'],
['1.02','Target catchments','Name the actual origin markets and travel radius.','Bottom-up demand governs when top-down and bottom-up disagree.','Catchment, radius and season are local.','Research demand, travel time, seasonality and substitutes.','Demand evidence book','Required for market gate'],
['1.03','Approved guest profiles','Select the applicable governed persona IDs.','A property may not be pitched to an undeclared audience.','Local trigger, season and price logic may vary.','Calibrate global profiles to local demand evidence.','Profile calibration','Required for demand gate'],
['1.04','Category-fit statement','Explain why this Estate advances verified state change.','Hotels sell where you sleep; SG sells how you wake.','Local proof and narrative may vary.','Challenge proposition against category and competitor evidence.','Category-fit assessment','Required for portfolio admission'],
['1.05','Claims proposed for use','List every outward claim contemplated.','No claim may exceed what a gate verifies; anti-hype doctrine applies.','Only evidence-backed local facts may vary.','Trace each claim to certification evidence or mark unsupported.','Claims substantiation matrix','Unsupported claim causes STOP'],
['1.06','Portfolio role and horizon','Choose unit proof, network proof or platform opening.','Each horizon has a gate, not merely a date.','Estate role may vary by portfolio sequence.','Map dependencies and test whether a downstream horizon is premature.','Horizon dependency map','Required for execution authority'],
['1.07','Material strategic risks','Record the risks humans accept or refuse.','Risks remain visible, owned and reviewed.','Risk profile is Estate-specific.','Research competitor, regulation, demand and execution exposure.','Strategic risk register','Unowned material risk causes HOLD'],
]},
{name:'L2 Business', code:'L2', title:'BUSINESS PLATFORM', next:'L3 Digital', rows:[
['2.01','Business-model configuration','Describe owner, developer, operator and platform roles.','L2 designs; L6 prices; L10 signs.','Entity and partner configuration may vary.','Compare models and identify quality-loss seams.','Business-model comparison','Required for model approval'],
['2.02','Capabilities retained by SG','List knowledge-chain capabilities SG will own.','SG owns the knowledge chain and guest relationship.','Local execution resources may vary.','Map capability criticality and dependency.','Own/rent capability map','Protected capability cannot be outsourced'],
['2.03','Partner shapes proposed','Name partner, operator, developer, manufacturer or integrator roles.','Partners access published interfaces, never constitutional core.','Partner selection is local.','Research competence, accreditation and exit exposure.','Partner boundary matrix','No entry without boundary and exit'],
['2.04','Revenue-stream intent','Select permitted streams and their rationale.','Invariant promises are never separate line items.','Local compositions and memberships may vary.','Model stream logic without setting final prices.','Revenue architecture','Metering invariant causes STOP'],
['2.05','Lifecycle stages','Define discovery through return and advocacy responsibilities.','Lifecycle uses governed objects and one accountable chain.','Channel and cadence may vary.','Detect handoff gaps and orphan responsibilities.','Lifecycle responsibility map','Orphan stage causes HOLD'],
['2.06','Partner exit design','State what happens to quality, guests, data and IP at exit.','Exit design precedes partner entry.','Exit mechanics vary by relationship.','Stress-test transition, continuity and custody.','Partner exit plan','No exit plan means no partner gate'],
['2.07','Brand architecture choice','Select applicable approved brand and scope.','Brand does not redefine SG standards.','Property expression may vary within approved brand.','Check portfolio fit and collision.','Brand fit note','Requires human brand decision'],
]},
{name:'L3 Digital', code:'L3', title:'DIGITAL PLATFORM · XIS', next:'L4 Physical', rows:[
['3.01','Connectivity survey','Enter carriers, availability, outages and backhaul constraints.','Core room functions never depend on WAN or cloud.','Carrier and redundancy topology vary.','Research failure history and realistic outage scenarios.','Connectivity resilience assessment','Required for Tests A–E plan'],
['3.02','Power and edge constraints','Enter power quality, backup and edge installation conditions.','Local reflexes and manual paths survive central failure.','Hardware and redundancy may vary.','Model edge capacity, thermal and power resilience.','Edge feasibility plan','Blocks digital design if inadequate'],
['3.03','Permitted sensing proposal','List each sensor, purpose and zone.','No cameras/cloud microphones in guest zones; no issued wearables.','Sensor model may vary only inside prohibition envelope.','Test necessity, minimisation and banned-sensing dependency.','Sensor justification register','Banned sensing causes STOP'],
['3.04','Data categories and retention','List every proposed record and retention need.','Collect body state, never person identity; bounded retention and deletion.','Shorter local periods may apply.','Map legal basis, minimisation and deletion.','Privacy impact pack','No legal basis causes STOP'],
['3.05','Integration inventory','List life safety, access, plant, room and enterprise integrations.','Ring-0 overrides every sensory rule.','Vendor and protocol may vary.','Threat-model interfaces and failure propagation.','Integration threat model','Unbounded failure domain causes HOLD'],
['3.06','Tests A–F witness plan','Name test dates, witnesses and evidence methods.','Tests A–F and their pass conditions do not vary.','Execution schedule may follow project sequence.','Prepare severance scenarios and evidence capture.','Certification test plan','All tests required before certification'],
['3.07','Human privacy decision','Record accepted privacy architecture and rejected capabilities.','Convenience does not override sensing constitution.','Risk appetite may only narrow collection.','Provide options and consequences.','Privacy decision packet','Explicit human approval required'],
]},
{name:'L4 Physical', code:'L4', title:'PHYSICAL PLATFORM · SGDS', next:'L5 Service', rows:[
['4.01','PVE-05 conversion approval','Enter the signed conversion decision reference.','Detailed SG design begins only after conversion approval.','None.','Verify authority, date, scope and conditions.','Conversion authority check','Absent approval causes STOP'],
['4.02','Site survey package','Reference terrain, hydrology, climate, ecology and geotechnical evidence.','Design evidence precedes configuration.','All site facts are local.','Identify missing seasons, resolutions and conflicts.','Survey sufficiency report','Incomplete critical survey causes HOLD'],
['4.03','Seasonal sensory evidence','Reference acoustic, dark-sky, foliage and climate measurements.','Field conditions and stressed seasons govern.','Measured local baselines vary.','Analyse worst-case conditions and sensory ceiling.','Sensory ceiling assessment','Required for configuration'],
['4.04','Chassis and variant decision','Select chassis and any approved overlay.','Selection follows ground and view logic, not aesthetic preference.','RISE/RIDGE/VOYAGER/EXPANSE and overlay selection are site responses.','Compare configurations against terrain, views and logistics.','Chassis recommendation','Human selection required'],
['4.05','Zone and gradient decision','Confirm Z0–Z6 sequence and ghost-route basis.','Stimulation falls monotonically; ghost route never crosses guest vector.','Geometry bends to terrain.','Simulate movement, sightline, noise and logistics conflicts.','Zone proof and movement model','Broken sequence causes STOP'],
['4.06','Invariant compliance inputs','Enter evidence for INV-001 through INV-007.','Acoustic, darkness, privacy, thermal, air, visual noise and decision load do not vary.','Means of achievement may vary.','Run conformance and conflict analysis.','Invariant compliance matrix','Any traded invariant causes STOP'],
['4.07','Platform/site BOM split','Enter platform and site-specific value.','85/15 platform/site ratio; 600 mm grid; Nature Frame 45–65%; threshold ±0.','Local materials and assemblies inside interfaces.','Audit BOM classification and interface impact.','BOM ratchet report','Above 15% returns to design'],
['4.08','Design freeze authority','Name approver and freeze date.','Changes after freeze reopen the relevant gate.','Schedule is project-specific.','Check unresolved ICDs and hold points.','Freeze-readiness pack','No freeze with open critical interface'],
]},
{name:'L5 Service', code:'L5', title:'SERVICE PLATFORM', next:'L6 Capital', rows:[
['5.01','Conversion authority reference','Enter the same approved PVE-05 record used by L4.','Property-specific guest-hosting design starts post approval.','None.','Reconcile authority across L4, L5 and L7.','Hosting-start authority check','Absent approval causes STOP'],
['5.02','Guest-state priorities','Select the relevant governed guest states and target outcomes.','Eleven states are forward-only; backward transition is a defect.','Local emphasis may vary.','Map target state to measured intervention.','Guest-state map','Required for hosting design'],
['5.03','Arrival conditions','Enter arrival modes, durations, handoffs and constraints.','Arrival-to-calm within 12 minutes; check-in under 120 seconds.','Route and transport choreography are local.','Simulate arrival under peak and failure conditions.','Arrival choreography','Failed timing causes redesign'],
['5.04','Ritual and moment choices','Select governed vibes, moments, add-ons and sockets.','Composition uses governed grammar; socket filled, never drilled.','Local content and terroir may vary.','Research cultural fit and state-change evidence.','Ritual composition register','Ungoverned invention causes HOLD'],
['5.05','Ghost Mode operating inputs','Enter staffing routes, task windows and stores.','Guest/staff vectors never intersect; ghost integrity target 1.00.','Routing and staffing schedule vary.','Simulate occupancy, task and failure overlap.','Ghost choreography model','Any unmitigated intersection causes STOP'],
['5.06','Sovereign Purge inputs','Enter turnover, chemistry, equipment and evidence method.','Return biological, thermal, olfactory and digital state to zero.','Local workflow may vary inside standard.','Time-study and test reset sequence.','Purge SOP and evidence plan','Unproven reset causes HOLD'],
['5.07','Human hosting choices','Name high-EQ moments, staffing and recovery authority.','Humans appear where emotion is high; system is never explained to guest.','Language and cultural expression vary.','Research capability and workload.','People and recovery plan','Human approval required'],
['5.08','Soft-opening readiness','Enter rehearsal results and unresolved defects.','No guests before certification; failures are rehearsed.','Rehearsal sequence varies.','Analyse defect closure and state performance.','Soft-opening evidence pack','Open critical defect causes STOP'],
]},
{name:'L6 Capital', code:'L6', title:'CAPITAL PLATFORM', next:'L7 Property', rows:[
['6.01','Source-backed acquisition basis','Enter land, transaction and due-diligence values with source references.','Every number traces to evidence.','Values are Estate-specific.','Verify sources, dates, inclusions and exclusions.','Acquisition basis reconciliation','Unsupported value causes HOLD'],
['6.02','Scenario assumptions','Enter base, optimistic, conservative and downturn drivers.','Decisions use conservative; optimistic-only projects are declined.','Market drivers vary.','Research comparable evidence and sensitivity.','Scenario book','Conservative failure causes REJECT/HOLD'],
['6.03','Development budget','Enter per-key, per-studio and composition costs.','70/30 CapEx split protects guest-perceivable realm.','Local costs and chassis benchmark vary.','Benchmark, classify and detect value-engineering leakage.','Development cost audit','Split breach requires redesign'],
['6.04','Underwriting indices','Enter evidence for MAI, HTI, OEI, DTI, ERI, CQI and HBCI.','Floors: 90, 85, 92, 92, 93, 93, 95 respectively.','Evidence values vary; floors do not.','Test scoring and evidence completeness.','Index gate report','Any floor miss blocks approval'],
['6.05','Capital structure choices','Enter HoldCo/PropCo/OpCo, debt, equity and covenant terms.','Constitutional IP remains insulated; DSCR above 1.5.','Financing mix varies.','Stress-test downturn and control rights.','Capital structure memo','Unacceptable control/covenant causes STOP'],
['6.06','Return and payback inputs','Enter cash flows, exit assumptions and timing.','Stated floors: project IRR >18%, equity IRR >22%, payback <8 years.','Cash flows and exit evidence vary.','Recalculate and sensitivity-test.','Return analysis','Floor miss blocks conversion'],
['6.07','Human risk acceptance','Record accepted risks, contingency and conditions.','Risk is explicit, priced and owned.','Risk appetite is a human decision.','Compare mitigations and residual exposure.','Capital decision packet','Required for PVE-05'],
]},
{name:'L7 Property', code:'L7', title:'PROPERTY PLATFORM', next:'L8 Network', rows:[
['7.01','PVE-01 land decision inputs','Enter severance, sensory ceiling and market evidence.','Order: severance, sensory ceiling, market; price last.','All observations are site-specific.','Assemble land-intelligence dossier.','PVE-01 dossier','GO/HOLD/REJECT required'],
['7.02','PVE-02 place potential','Enter local nature, culture, season and demand evidence.','Before conversion this proves potential, not property-specific hosting design.','Place evidence is local.','Test uniqueness and relocatability.','PVE-02 place-potential pack','Human acceptance required'],
['7.03','PVE-03 planning proof','Enter preliminary positions, views, privacy and ghost paths.','Freeze means later position change reopens gate.','Geometry is site-adaptive.','Run view/privacy/gradient conflict analysis.','PVE-03 plan proof','Human freeze required'],
['7.04','PVE-04 delivery certainty','Enter interfaces, quantities, permissions, logistics and takt.','Release certifies beginning is safe; >15% site content returns to design.','Delivery plan is local.','Stress-test buildability and sequence.','PVE-04 certainty pack','Open critical interface blocks'],
['7.05','PVE-05 conversion decision','Enter capital paper and human disposition.','No prior-gate assumption may be unevidenced.','GO/HOLD/REJECT is human.','Reconcile all prior gates.','PVE-05 conversion packet','Controls identity transition'],
['7.06','Identity wording','Select Estate candidate, property in development or certified property.','Identity follows recorded gate status only.','Name may vary; status logic does not.','Check wording across all artifacts.','Identity consistency report','Misstatement causes STOP'],
['7.07','Dossier custodian','Name owner, version and update cadence.','One pinned identity per property; upgrades are deliberate migrations.','Custodian and cadence may vary.','Audit dossier completeness.','Dossier audit','Stale dossier causes HOLD'],
]},
{name:'L8 Network', code:'L8', title:'NETWORK PLATFORM', next:'L9 Governance', rows:[
['8.01','Proposed cluster','Name cluster, travel radius and climate/terroir class.','Clusters share what guests never see.','Boundary and class are contextual.','Test operational reach and learning validity.','Cluster-fit study','Required for admission'],
['8.02','Certified property count','Enter currently certified estates in the cluster.','Hub opens when third estate certifies.','Count varies.','Verify certification status and capacity.','Hub threshold check','Below threshold blocks hub opening'],
['8.03','Shared capability proposal','List procurement, revenue, BI, HR, payroll and specialists to share.','Nothing guest-adjacent is centralised.','Shared mix may vary.','Map service interfaces and capacity.','Shared/local responsibility map','Boundary breach causes STOP'],
['8.04','Hub staffing inputs','Enter people, volume and projected keys.','Hub remains flat by architecture, not hidden workload.','Headcount within model may vary.','Capacity and workload modelling.','Hub capacity model','Overload causes HOLD'],
['8.05','Data exchange decision','Enter data contributed, received and rights.','Privacy constitution governs; departure keeps own data but loses compound.','Permitted local data may vary.','Assess transfer, provenance and privacy.','Data exchange pack','Human data authority required'],
['8.06','Certification-floor status','Enter every operating property floor status.','No new cluster while any operating estate is below floors.','Performance values vary.','Validate exceptions and remediation.','Growth constraint report','Any floor miss blocks expansion'],
['8.07','Learning transfer decision','Approve which finding may transfer to this property.','Negative patterns propagate as fast as positive; applicability must be evidenced.','Intervention varies by context.','Compare cohort and configuration similarity.','Transferability note','Human adoption decision required'],
]},
{name:'L9 Governance', code:'L9', title:'GOVERNANCE PLATFORM', next:'L10 Commercial', rows:[
['9.01','Decision authority','Name board, accountable role and decision scope.','Custodian is not author; powers remain divided.','Meeting date may vary.','Verify eligibility, conflicts and authority.','Authority and conflict check','Invalid authority voids decision'],
['9.02','Decision question','State the exact binary or bounded question.','Decision records preserve reasoning and dissent.','Question is project-specific.','Identify affected IDs and downstream consequences.','Board issue brief','Ambiguous question causes HOLD'],
['9.03','Evidence index','List every evidence item and grade.','Only IDs bind; evidence remains graded and traceable.','Evidence content varies.','Check provenance, completeness and contradictions.','Evidence sufficiency report','Missing material evidence causes HOLD'],
['9.04','Risk and exception status','Enter risk owners and exception expiries.','Expired exception escalates; no waiver is silent.','Project risks vary.','Cross-query affected objects and registers.','Risk/exception impact map','Expired exception causes STOP'],
['9.05','Audit cadence','Enter monthly, quarterly and annual dates.','Cadence follows operational, seasonal and constitutional drift.','Dates follow local season.','Build audit programme and evidence sample.','Audit schedule','Missing cadence causes HOLD'],
['9.06','Certification decision inputs','Enter traces, tests, defects and closure evidence.','No trace, no certificate; certification lapses on evidence.','Evidence comes from property.','Check certification battery and open findings.','Certification recommendation','Human board decides'],
['9.07','Change classification','Choose project correction, evidence gap or ECN.','Regime B changes only via evidence → ECN → Board → EDC → release.','Classification depends on facts.','Analyse firewall and impact.','Change-control packet','Wrong path causes build failure'],
]},
{name:'L10 Commercial', code:'L10', title:'COMMERCIAL PLATFORM', next:'L11 Research', rows:[
['10.01','Instrument type and parties','Enter agreement, licence, procurement or accreditation instrument.','L10 signs what L2 designed and L6 priced.','Parties and form vary.','Check authority, role and jurisdiction.','Instrument strategy','Required before drafting'],
['10.02','Pinned object schedule','List every standard, object and version incorporated.','Contracts cite IDs at pinned versions, never vague descriptions.','Applicable objects vary.','Validate dependency and version status.','Object dependency schedule','Missing version causes STOP'],
['10.03','Commercial terms','Enter approved fee, price, payment and performance basis.','Operator cannot earn by trading constitutional performance.','Approved economics vary.','Reconcile to L6 authority.','Commercial reconciliation','Variance without approval causes STOP'],
['10.04','IP access requested','List drawings, data, engines and know-how requested.','Licensable rails and protected core remain separate; engines used, never inspected.','Permitted scope varies.','Classify each item under IP taxonomy.','IP boundary matrix','Protected-core disclosure causes STOP'],
['10.05','Vendor qualification','Enter audit, first article, warranty and capacity evidence.','Approved library and PPAP-lite precede orders.','Vendor choice varies.','Research quality, logistics and resilience.','Vendor due-diligence pack','Unqualified vendor blocks award'],
['10.06','Jurisdiction inputs','Enter land, employment, data, licensing and insurance constraints.','Local law is reconciled; constitutional promise is not silently diluted.','Jurisdiction clauses vary.','Research authoritative legal requirements for counsel review.','Jurisdiction matrix','Counsel/human approval required'],
['10.07','Signature and award authority','Name authorised signatories and limits.','Accreditation is revocable and scope-pinned.','Named individuals vary.','Verify current authority and accreditation.','Execution authority check','Invalid authority blocks execution'],
]},
{name:'L11 Research', code:'L11', title:'RESEARCH PLATFORM', next:'L12 Academy', rows:[
['11.01','Research question','State one answerable question and affected IDs.','Opinion never amends; question precedes data.','Question responds to local or platform gap.','Refine scope and decision relevance.','Research question protocol','Ambiguity causes HOLD'],
['11.02','Current evidence base','List primary sources, standards and existing grade.','Grade A–D travels with finding forever.','Source set varies.','Systematic search and contradiction mapping.','Evidence table','Required before experiment'],
['11.03','Protocol and hypothesis','Enter pre-registered design, sample, measures and analysis.','Protocol is fixed before collection.','Cohort and instrumentation may vary inside ethics/privacy.','Review power, bias and reproducibility.','Protocol review pack','Human protocol approval required'],
['11.04','Consent and privacy basis','Enter consent, minimisation and retention.','Banned sensing is not researched slowly; it is rejected.','Local ethics process may vary.','Assess privacy and ethics risk.','Ethics/privacy assessment','No basis causes STOP'],
['11.05','Site transferability','Explain why evidence applies to this climate, cohort and configuration.','Local evidence does not silently become universal canon.','Transfer context varies.','Compare exposure and population conditions.','Transferability analysis','Weak transfer causes HOLD'],
['11.06','Finding and grade decision','Enter human-approved finding and authoritative grade.','AI may recommend; humans assign grade.','Finding varies.','Analyse uncertainty and contradictions.','Finding pack','Required for ECN/decision'],
['11.07','Publication/IP decision','Choose publish, patent, trade secret or internal.','Boundary ruled before disclosure.','Decision varies by finding.','Assess defensibility and disclosure cost.','Publication/IP options','Human approval required'],
]},
{name:'L12 Academy', code:'L12', title:'ACADEMY', next:null, rows:[
['12.01','Role population','List roles, headcount, location and mobilisation date.','Capability precedes authority.','Team composition varies.','Map roles to capabilities and risks.','Capability coverage map','Required for learning plan'],
['12.02','Required certification altitude','Select Foundation, Professional, Authority or Master by role.','Each altitude presumes the one below; nobody authors what they have not operated.','Role requirement varies.','Validate prerequisites and current status.','Credential requirement matrix','Gap blocks dependent authority'],
['12.03','Local learning needs','Enter language, law, climate, equipment and cultural modules.','Localisation cannot change the canon taught.','Delivery context varies.','Research role-specific learning barriers.','Localisation plan','Human curriculum approval'],
['12.04','Simulation scenarios','Select ghost, recovery, island, smoke, purge and operational drills.','Hard skills are practically rehearsed; written recall alone is insufficient.','Scenario setting varies.','Build simulations from real failure modes.','Simulation pack','Required before practical exam'],
['12.05','Assessment evidence','Enter observation, test, assessor and remediation record.','Certification is live status with expiry.','Evidence is person-specific.','Check completeness and consistency.','Assessment audit','Incomplete evidence blocks credential'],
['12.06','Credential decision','Enter award, renew, suspend or revoke.','Lapsed credential suspends dependent authority automatically.','Human decision varies.','Verify moment-of-signature validity.','Credential decision pack','Human certifier decides'],
['12.07','Release recertification impact','Enter changed objects and affected roles.','Every MAJOR release triggers affected-track recertification.','Affected scope varies.','Map release delta to roles and courses.','Recertification plan','Required before new version authority'],
]},
];

const wb = Workbook.create();
for (const l of layers) wb.worksheets.add(l.name);

const statusValues = ['Not Started','In Progress','Complete','Blocked','Not Applicable'];
const decisionValues = ['Pending','GO','HOLD','REJECT','Approved','Not Applicable'];

for (let si=0; si<layers.length; si++) {
  const l = layers[si];
  const sh = wb.worksheets.getItem(l.name);
  sh.showGridLines = false;
  sh.freezePanes.freezeRows(9);
  sh.freezePanes.freezeColumns(2);
  sh.getRange('A1:N1').merge(); sh.getRange('A1').values=[[`${l.code}  /  ${l.title}`]];
  sh.getRange('A2:N2').merge(); sh.getRange('A2').values=[['HUMAN INPUT & FRONTIER AI EXECUTION TEMPLATE  ·  SG-EBOK v3.0']];
  sh.getRange('A1:N1').format={fill:C.void,font:{name:'Outfit',size:22,bold:false,color:C.paper},verticalAlignment:'center'};
  sh.getRange('A2:N2').format={fill:C.panel,font:{name:'Space Mono',size:9,color:C.copper},verticalAlignment:'center'};
  sh.getRange('A1:N1').format.rowHeight=34; sh.getRange('A2:N2').format.rowHeight=22;
  sh.getRange('A4').values=[['INPUT COMPLETENESS']]; sh.getRange('C4').values=[['OPEN / BLOCKED']]; sh.getRange('E4').values=[['SYSTEM GATE']]; sh.getRange('G4').values=[['HUMAN DISPOSITION']]; sh.getRange('I4').values=[['PREVIOUS GATE']]; sh.getRange('K4').values=[['NEXT PLATFORM']];
  const rows = [...shared, ...l.rows]; const start=10, end=start+rows.length-1;
  sh.getRange('A5').formulas=[[`=(COUNTIF(J${start}:J${end},"Complete")+COUNTIF(J${start}:J${end},"Not Applicable"))/COUNTA(A${start}:A${end})`]];
  sh.getRange('C5').formulas=[[`=COUNTIF(J${start}:J${end},"<>Complete")-COUNTIF(J${start}:J${end},"Not Applicable")`]];
  sh.getRange('E5').formulas=[[`=IF(COUNTIF(J${start}:J${end},"Blocked")>0,"STOP",IF(A5=1,"READY FOR HUMAN GATE","HOLD"))`]];
  sh.getRange('G5').values=[['Pending']]; sh.getRange('G5').dataValidation={rule:{type:'list',values:decisionValues}};
  if (si===0) sh.getRange('I5').values=[['FOUNDATION / L0']]; else sh.getRange('I5').formulas=[[`='${layers[si-1].name}'!G5`]];
  sh.getRange('K5').values=[[l.next || 'END / OPERATE & RECERTIFY']];
  for (const cell of ['A4','C4','E4','G4','I4','K4']) sh.getRange(cell).format={font:{name:'Space Mono',size:8,color:C.steel},horizontalAlignment:'left'};
  for (const cell of ['A5','C5','E5','G5','I5','K5']) sh.getRange(cell).format={fill:C.white,font:{name:'Space Mono',size:11,bold:true,color:C.void},borders:{preset:'outside',style:'thin',color:C.line},verticalAlignment:'center'};
  sh.getRange('A5').format.numberFormat='0%';
  sh.getRange('A7:N7').merge(); sh.getRange('A7').values=[['BLUE CELLS REQUIRE HUMAN INPUT  ·  WHITE CELLS ARE SG STANDARDS OR AI DELIVERABLE DEFINITIONS  ·  DO NOT PROCEED ON HOLD OR STOP']];
  sh.getRange('A7:N7').format={fill:C.mist,font:{name:'Space Mono',size:8,color:C.steel},verticalAlignment:'center'};
  const headers=[['REF','HUMAN INPUT / DECISION','WHY REQUIRED','FIXED SG STANDARD','SITE-ADAPTABLE ENVELOPE','HUMAN RESPONSE','EVIDENCE / SOURCE','OWNER','DUE DATE','STATUS','AI RESEARCH REQUIRED','EXPECTED AI DELIVERABLE','GATE EFFECT','REVIEW NOTE']];
  sh.getRange('A9:N9').values=headers; sh.getRange('A9:N9').format={fill:C.void,font:{name:'Space Mono',size:8,bold:true,color:C.paper},wrapText:true,verticalAlignment:'center',borders:{bottom:{style:'medium',color:C.electric}}}; sh.getRange('A9:N9').format.rowHeight=34;
  const data=rows.map(r=>[r[0],r[1],r[2],r[3],r[4],'','', '', null,'Not Started',r[5],r[6],r[7],'']);
  sh.getRange(`A${start}:N${end}`).values=data;
  sh.getRange(`A${start}:N${end}`).format={font:{name:'Inter',size:9,color:C.void},verticalAlignment:'top',wrapText:true,borders:{insideHorizontal:{style:'thin',color:C.line}}};
  sh.getRange(`A${start}:A${end}`).format={font:{name:'Space Mono',size:8,color:C.electric},fill:C.mist};
  for (const col of ['F','G','H','I','J','N']) sh.getRange(`${col}${start}:${col}${end}`).format.fill=C.input;
  sh.getRange(`J${start}:J${end}`).dataValidation={rule:{type:'list',values:statusValues}};
  sh.getRange(`I${start}:I${end}`).format.numberFormat='yyyy-mm-dd';
  sh.getRange(`J${start}:J${end}`).conditionalFormats.add('containsText',{text:'Complete',format:{fill:'#DFF3E6',font:{color:C.forest,bold:true}}});
  sh.getRange(`J${start}:J${end}`).conditionalFormats.add('containsText',{text:'Blocked',format:{fill:'#FDE4E2',font:{color:C.critical,bold:true}}});
  sh.getRange(`J${start}:J${end}`).conditionalFormats.add('containsText',{text:'In Progress',format:{fill:'#FFF0E6',font:{color:C.hazard,bold:true}}});
  sh.getRange('E5').conditionalFormats.add('containsText',{text:'STOP',format:{fill:C.critical,font:{color:C.white,bold:true}}});
  sh.getRange('E5').conditionalFormats.add('containsText',{text:'HOLD',format:{fill:C.hazard,font:{color:C.white,bold:true}}});
  sh.getRange('E5').conditionalFormats.add('containsText',{text:'READY',format:{fill:C.confirm,font:{color:C.white,bold:true}}});
  const widths={A:9,B:28,C:28,D:34,E:28,F:30,G:24,H:16,I:13,J:16,K:34,L:30,M:24,N:28};
  for (const [col,w] of Object.entries(widths)) sh.getRange(`${col}:${col}`).format.columnWidth=w;
  sh.getRange(`A${start}:N${end}`).format.rowHeight=56;
  sh.getRange(`A${end+2}:N${end+2}`).merge(); sh.getRange(`A${end+2}`).values=[['HUMAN GATE RECORD']]; sh.getRange(`A${end+2}:N${end+2}`).format={fill:C.void,font:{name:'Space Mono',size:9,bold:true,color:C.paper}};
  const gateRows=[['Decision authority','','Decision date','','Disposition','','Decision record ID','','Conditions / reasons','','Next authorised action','','Signature / approval reference',''],['','','','','','','','','','','','','','']];
  sh.getRange(`A${end+3}:N${end+4}`).values=gateRows;
  sh.getRange(`A${end+3}:N${end+4}`).format={borders:{preset:'inside',style:'thin',color:C.line},wrapText:true,verticalAlignment:'top'};
  for (const c of ['B','D','F','H','J','L','N']) sh.getRange(`${c}${end+3}:${c}${end+4}`).format.fill=C.input;
}

await fs.mkdir(OUT,{recursive:true});
for (const l of layers) {
  const sh=wb.worksheets.getItem(l.name); const used=sh.getUsedRange();
  const png=await wb.render({sheetName:l.name,range:used.address,scale:0.8,format:'png'});
  await fs.writeFile(`${OUT}/${l.code}.png`,new Uint8Array(await png.arrayBuffer()));
}
const xlsx=await SpreadsheetFile.exportXlsx(wb);
await xlsx.save(`${OUT}/SG-Frontier-AI-Human-Input-Template.xlsx`);

const inspect=await wb.inspect({kind:'table',range:'L7 Property!A1:N18',include:'values,formulas',tableMaxRows:18,tableMaxCols:14,maxChars:6000});
console.log(inspect.ndjson);
const errors=await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',options:{useRegex:true,maxResults:100},summary:'formula error scan'});
console.log(errors.ndjson);
