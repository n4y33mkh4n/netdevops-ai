function setupFinalForm(){
  const SS_ID='10DMdkWhSVEjRQ8Wz9po7qCkV3dHgFw2sP2U8OfsrgUw';
  const title='DESH COMMUNICATIONS — ISP / IIG Infrastructure Inventory';
  const desc='Internal infrastructure inventory input form for DESH COMMUNICATIONS ISP / IIG. Select one module per submission. Mandatory fields are marked with *. Do not enter passwords, secrets, API keys, or private credentials.';
  const M=[
['1 🏢 Site / POP','Site / POP',['Site Type*','Site Name*','Operational Status*','Region','District*','Upazila / Area*','Full Address*','Power Type*','Generator*','UPS*','Location Latitude*','Location Longitude*','Location Accuracy (m)*','Google Maps Link','Location Captured At*']],
['2 🗄️ Rack / Space','Rack / Space',['Site*','Room / Data Hall*','Rack Number*','Rack Type*','Total Rack U*','Grounding Status*']],
['3 🖥️ Equipment','Equipment',['Equipment Type*','Vendor*','Model*','Serial Number*','Site*','Rack*','Hostname','Management IP','Loopback IP','OS / Firmware','Role*','Criticality*','Outdoor / Standalone*']],
['4 🔌 Ports / Interfaces','Ports / Interfaces',['Equipment*','Port Name*','Port Type*','Speed*','Media','Admin Status*','Operational Status*','VLAN','IP Address','MAC Address','Connected Remote Port','Service','Circuit ID']],
['5 🧵 Fiber Cable','Fiber Cable',['Cable Name*','Cable Type*','Fiber Count*','Fiber Type*','A-End Site*','Z-End Site*','Length (km)*','Route Status*','Condition*','A-End Latitude*','A-End Longitude*','A-End Accuracy (m)*','A-End Maps Link','A-End Captured At*','Z-End Latitude*','Z-End Longitude*','Z-End Accuracy (m)*','Z-End Maps Link','Z-End Captured At*','OTDR Reference','As-built / Route Document Link','Notes']],
['6 🔬 Fiber Core','Fiber Core',['Cable*','Core Number*','Color','Tube Number','Status*','A-End ODF Port','Z-End ODF Port','Service','Circuit ID','Wavelength','Loss (dB)']],
['7 🔌 ODF / Patch','ODF / Patch',['Site*','Rack*','ODF Name*','Tray / Panel*','Port Number*','Port Type*','Fiber Count*','Core','Patch To','Status*']],
['8 🛣️ Backbone Route','Backbone Route',['Route Name*','Route Type*','From Site*','To Site*','Distance (km)*','Fiber Cable','Duct / Pole Type','Wayleave Status','Route Risk','GIS Reference','Last Survey','Survey By','Condition*']],
['9 📍 GIS Reference','GIS Reference',['Object Type*','Object ID*','Geometry Type*','GIS Layer','Latitude','Longitude','Accuracy (m)','Google Maps Link']],
['10 📡 Transmission / TG','Transmission / TG',['TG Type*','Vendor*','Model*','Serial Number*','Site*','Rack*','Capacity','Chassis ID','Card/Module','Port Count','Used Ports','Protection Mode','Power A','Power B','Status*','Criticality*']],
['11 🌐 Upstream / IIG','Upstream / IIG',['Provider Name*','Provider Type*','POI Site','Circuit ID','Physical Medium','Cable','Port','Capacity (Gbps)*','Remote ASN','Session Type*','IPv4 Subnet','IPv6 Prefix','VLAN','Contract ID','SLA','Primary / Backup*','Status*']],
['12 🔗 Circuit / Service','Circuit / Service',['Service Type*','Service Name*','Customer / Partner','Capacity','IP Range','A-End Object','Z-End Object','Primary / Backup','Status*']],
['13 🧮 IP / VLAN / BGP','IP / VLAN / BGP',['Resource Type*','Resource Name*','VRF','VLAN ID','VLAN Name','IPv4 Subnet','IPv4 Gateway','IPv6 Prefix','Local ASN','Remote ASN','BGP Neighbor','BGP Role','Site','Equipment','Port','Service','Circuit ID','Purpose','Status*']],
['14 🧭 Network Trace','Network Trace',['Service*','A-End Object*','A-End Port','A-End Type','Z-End Object*','Z-End Port','Z-End Type','Primary Path','Backup Path','Fiber Cable','Core','ODF Port A','ODF Port Z','Splitter','OLT','PON Port','CPE','VLAN','IP Range','Circuit ID','Protection','Trace Status*']],
['15 🌐 Splitter / FDT / FAT','Splitter / FDT / FAT',['Splitter Type*','Input Count*','Output Count*','Ratio*','Input Core ID','Output Port Start','Used Outputs','Available Outputs','Status*','Latitude*','Longitude*']],
['16 🏠 Customer CPE / ONU','Customer CPE / ONU',['Customer ID*','Customer Name*','CPE Type*','WAN IP','ONU Serial Number','MAC Address','OLT','PON Port','Splitter','Site / Address','Install Date','Status*']],
['17 ⚡ Power / Environment','Power / Environment',['Power Asset Type*','Asset/Name','Site','Rack','Battery Rating','Runtime (min)','Fuel Type','Last Service','Next Service','Alarm Status*','Status*']],
['18 🔋 Power Redundancy','Power Redundancy',['Site*','Asset','Power Path*','Source Type*','Source Asset','Voltage (V)','Capacity (A)','Load (A)','Battery (Ah)','Runtime (min)','UPS Status','Generator Status','A/B Redundancy*','Grounding Status','Alarm Status*']],
['19 📦 Spare Inventory','Spare Inventory',['Item Category*','Part Number*','Item Description*','Unit*','Opening Quantity*','Min Level','Reorder Level','Store Location*','Bin Number']],
['20 🔄 Spare Movement','Spare Movement',['Date/Time*','Part Number*','Item Description*','Movement Type*','Quantity*','From Location','To Location','Related Asset','Work Order','Technician','Approved By']],
['21 🛠️ Maintenance / PM','Maintenance / PM',['Asset*','Maintenance Type*','Scheduled Date*','Completed Date','Technician','Work Order','Finding','Action Taken','Downtime (min)','Parts Used','Cost','Next Due','Status*']],
['22 🚨 Incident / Change','Incident / Change',['Record Type*','Date/Time*','Affected Site','Affected Asset','Affected Service','Severity*','Issue / Change*','Root Cause','Impact','Action','Owner*','Start Time','End Time','Downtime (min)','Change Window','Approval Ref','Status*']],
['23 📄 Contracts / Documents','Contracts / Documents',['Document Type*','Reference Number*','Provider / Vendor*','Related Asset','Related Site','Start Date','Expiry Date','SLA','File Link','Owner','Status*']],
['24 🤝 Vendor / SLA','Vendor / SLA',['Provider / Vendor*','Service Type*','Service','Circuit ID','Asset','POI Site','Contract Start','Contract Expiry','SLA Target*','Escalation Level 1','Escalation Level 2','NOC Contact','Commercial Contact','Penalty Clause','Renewal Notice Days*','Owner*']],
['25 🔍 Data Quality Review','Data Quality Review',['Check Name*','Target Sheet*','Expected Result','Owner*','Frequency*','Status*','Notes']],
['26 📝 Audit / Change Log','Audit / Change Log',['Action Type*','Sheet Name*','Record ID*','Field Name','Old Value','New Value','Reason*','Approval Ref','Ticket Ref','Status*']]
  ];
  const form=FormApp.create(title);
  form.setDescription(desc);
  form.setConfirmationMessage('Information submitted successfully. Reference: form response timestamp.');
  form.setProgressBar(true);
  const menu=form.addListItem().setTitle('আপনি কোন ধরনের information submit করতে চান?').setRequired(true);
  const pages=[];
  M.forEach(function(m){
    const p=form.addPageBreakItem().setTitle(m[0]);
    p.setHelpText('Module: '+m[1]+'. Fill the required fields marked with *. Submit one record at a time.');
    pages.push(p);
    m[2].forEach(function(label){
      const required=label.endsWith('*');
      const q=label.replace(/\*$/,'');
      let item;
      if(/Date\/Time|Captured At|Start Time|End Time/.test(q)) item=form.addDateTimeItem().setTitle(q);
      else if(/Date$|Install Date|Scheduled Date|Completed Date|Next Due|Last Service|Contract Start|Contract Expiry|Start Date|Expiry Date|Last Survey/.test(q)) item=form.addDateItem().setTitle(q);
      else if(/Notes|Finding|Action Taken|Issue \/ Change|Root Cause|Impact|Action|Reason|Old Value|New Value|Penalty Clause|Expected Result|As-built/.test(q)) item=form.addParagraphTextItem().setTitle(q);
      else item=form.addTextItem().setTitle(q);
      item.setRequired(required);
    });
    p.setGoToPage(FormApp.PageNavigationType.SUBMIT);
  });
  menu.setChoices(pages.map(function(p){return menu.createChoice(p.getTitle(),p);}));
  form.setDestination(FormApp.DestinationType.SPREADSHEET,SS_ID);
  PropertiesService.getScriptProperties().setProperties({FINAL_FORM_ID:form.getId(),FINAL_FORM_EDIT_URL:form.getEditUrl(),FINAL_FORM_PUBLISHED_URL:form.getPublishedUrl()});
  Logger.log(JSON.stringify({editUrl:form.getEditUrl(),publishedUrl:form.getPublishedUrl(),id:form.getId()}));
  return form.getEditUrl();
}