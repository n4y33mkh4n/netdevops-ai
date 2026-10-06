const MASTER='DESH COMMUNICATIONS — ISP / IIG Infrastructure Master Database';
function db(){const f=DriveApp.getFilesByName(MASTER);if(!f.hasNext())throw Error('Master spreadsheet not found');return SpreadsheetApp.open(f.next())}
const M=[
['M01','🏢 Site / POP','Sites_POPs','SITE',['Site Name','Site Type','Operational Status','District','Upazila / Area','Full Address','Power Type','Generator','UPS','Location Latitude','Location Longitude','Location Accuracy (m)','Google Maps Link']],
['M02','🗄️ Rack / Space','Racks_Spaces','RACK',['Site','Room / Data Hall','Rack Number','Rack Type','Total Rack U','Grounding Status']],
['M03','🖥️ Equipment','Equipment','EQP',['Equipment Type','Vendor','Model','Serial Number','Site','Rack','Hostname','Management IP','Role','Criticality','Outdoor / Standalone']],
['M04','🔌 Ports / Interfaces','Ports_Interfaces','PORT',['Equipment','Port Name','Port Type','Speed','Media','Admin Status','Operational Status','VLAN','IP Address','MAC Address','Service','Circuit ID']],
['M05','🧵 Fiber Cable','Fiber_Cables','CAB',['Cable Name','Cable Type','Fiber Count','Fiber Type','A-End Site','Z-End Site','Length (km)','Route Status','Condition','A-End Latitude','A-End Longitude','Z-End Latitude','Z-End Longitude','OTDR Reference','As-built / Route Document Link']],
['M06','🔬 Fiber Core','Fiber_Cores','CORE',['Cable','Core Number','Color','Tube Number','Status','A-End ODF Port','Z-End ODF Port','Service','Circuit ID','Wavelength','Loss (dB)']],
['M07','🔌 ODF / Patch','ODF_Patch','ODF',['Site','Rack','ODF Name','Tray / Panel','Port Number','Port Type','Fiber Count','Core','Patch To','Status']],
['M08','🛣️ Backbone Route','Backbone_Routes','ROUTE',['Route Name','Route Type','From Site','To Site','Distance (km)','Fiber Cable','Duct / Pole Type','Wayleave Status','Route Risk','GIS Reference','Last Survey','Survey By','Condition']],
['M09','📍 GIS Reference','GIS_Reference','GIS',['Object Type','Object ID','Geometry Type','GIS Layer','Latitude','Longitude','Accuracy (m)','Google Maps Link']],
['M10','📡 Transmission / TG','Transmission_TG','TG',['TG Type','Vendor','Model','Serial Number','Site','Rack','Capacity','Chassis ID','Card / Module','Port Count','Used Ports','Protection Mode','Status','Criticality']],
['M11','🌐 Upstream / IIG','Upstreams_IIG','IIG',['Provider Name','Provider Type','POI Site','Circuit ID','Physical Medium','Cable','Port','Capacity (Gbps)','Remote ASN','Session Type','IPv4 Subnet','IPv6 Prefix','VLAN','Contract ID','SLA','Primary / Backup','Status']],
['M12','🔗 Circuit / Service','Circuits_Services','SRV',['Service Type','Service Name','Customer / Partner','Capacity','IP Range','A-End Object','Z-End Object','Primary / Backup','Status']],
['M13','🧮 IP / VLAN / BGP','IP_VLAN_BGP','IP',['Resource Type','Resource Name','VRF','VLAN ID','VLAN Name','IPv4 Subnet','IPv4 Gateway','IPv6 Prefix','Local ASN','Remote ASN','BGP Neighbor','BGP Role','Site','Equipment','Port','Service','Circuit ID','Purpose','Status']],
['M14','🧭 Network Trace','Network_Trace','TRACE',['Service','A-End Object','A-End Port','A-End Type','Z-End Object','Z-End Port','Z-End Type','Primary Path','Backup Path','Fiber Cable','Core','ODF Port A','ODF Port Z','Splitter','OLT','PON Port','CPE','VLAN','IP Range','Circuit ID','Protection','Trace Status']],
['M15','🌐 Splitter / FDT / FAT','Splitters_FTTH','SPL',['Splitter Type','Input Count','Output Count','Ratio','Input Core ID','Output Port Start','Used Outputs','Available Outputs','Status','Latitude','Longitude']],
['M16','🏠 Customer CPE / ONU','Customers_CPE','CPE',['Customer ID','Customer Name','CPE Type','WAN IP','ONU Serial Number','MAC Address','OLT','PON Port','Splitter','Site / Address','Install Date','Status']],
['M17','⚡ Power / Environment','Power_Environment','PWR',['Power Asset Type','Asset / Name','Site','Rack','Battery Rating','Runtime (min)','Fuel Type','Last Service','Next Service','Alarm Status','Status']],
['M18','🔋 Power Redundancy','Power_Redundancy','PWRPATH',['Site','Asset','Power Path','Source Type','Source Asset','Voltage (V)','Capacity (A)','Load (A)','Battery (Ah)','Runtime (min)','UPS Status','Generator Status','A/B Redundancy','Grounding Status','Alarm Status']],
['M19','📦 Spare Inventory','Spare_Inventory','STK',['Item Category','Part Number','Item Description','Unit','Opening Quantity','Min Level','Reorder Level','Store Location','Bin Number']],
['M20','🔄 Spare Movement','Spare_Movement','MOV',['Date / Time','Part Number','Item Description','Movement Type','Quantity','From Location','To Location','Related Asset','Work Order','Technician','Approved By']],
['M21','🛠️ Maintenance / PM','Maintenance_PM','PM',['Asset','Maintenance Type','Scheduled Date','Completed Date','Technician','Work Order','Finding','Action Taken','Downtime (min)','Parts Used','Cost','Next Due','Status']],
['M22','🚨 Incident / Change','Incidents_Changes','INC',['Record Type','Date / Time','Affected Site','Affected Asset','Affected Service','Severity','Issue / Change','Root Cause','Impact','Action','Owner','Start Time','End Time','Downtime (min)','Approval Ref','Status']],
['M23','📄 Contracts / Documents','Contracts_Documents','DOC',['Document Type','Reference Number','Provider / Vendor','Related Asset','Related Site','Start Date','Expiry Date','SLA','File Link','Owner','Status']],
['M24','🤝 Vendor / SLA','Vendor_SLA','SLA',['Provider / Vendor','Service Type','Service','Circuit ID','Asset','POI Site','Contract Start','Contract Expiry','SLA Target','Escalation Level 1','Escalation Level 2','NOC Contact','Commercial Contact','Penalty Clause','Renewal Notice Days','Owner']],
['M25','🔍 Data Quality Review','Data_Quality','DQ',['Check Name','Target Sheet','Expected Result','Owner','Frequency','Status','Notes']],
['M26','📝 Audit / Change Log','Audit_Log','AUD',['Action Type','Sheet Name','Record ID','Field Name','Old Value','New Value','Reason','Approval Ref','Ticket Ref','Status']]
];
const O={
'Site Type':['Core POP','POP','Distribution POP','Data Center','Exchange','Cabinet','FDT','Other'],
'Operational Status':['Active','Planned','Down','Retired'],
'Power Type':['Grid','Generator','Solar','Hybrid','Other'],'Generator':['Yes','No'],'UPS':['Yes','No'],
'Rack Type':['19-inch','Open Rack','Wall Mount','Other'],'Grounding Status':['Good','Needs Attention','Unknown'],
'Equipment Type':['Router','Switch','OLT','Firewall','Server','BNG/BRAS','DWDM','OTN','Other'],
'Role':['Core','Edge','Distribution','Access','OLT','BNG/BRAS','Transmission','Management','Other'],
'Criticality':['Low','Medium','High','Critical'],'Outdoor / Standalone':['Yes','No'],
'Port Type':['Ethernet','SFP','SFP+','SFP28','QSFP','PON','Console','Management','Other'],
'Speed':['100M','1G','10G','25G','40G','100G','100G','400G','Other'],
'Admin Status':['Enabled','Disabled'],'Operational Status':['Up','Down','Unknown'],
'Media':['Fiber','UTP','DAC','Radio','Other'],
'Cable Type':['ADSS','Duct','Underground','Direct Burial','OPGW','Other'],
'Fiber Count':['12','24','48','72','96','144','288','Other'],
'Fiber Type':['G.652D','G.657A1','G.657A2','Other'],
'Route Status':['Active','Planned','Damaged','Retired'],'Condition':['Excellent','Good','Fair','Poor','Critical'],
'Status':['Active','Planned','Down','Retired'],
'TG Type':['OTN','DWDM','SDH','Microwave','Router','Other'],
'Provider Type':['IIG','Transit','CDN','IXP','Upstream'],'Session Type':['BGP','Static','L2','L3'],
'Primary / Backup':['Primary','Backup','Single'],'Service Type':['Internet','IIG','Transit','IPLC','DIA','Backhaul','Other'],
'Resource Type':['VLAN','IPv4','IPv6','BGP','VRF'],'BGP Role':['iBGP','eBGP','RR','Other'],
'Trace Status':['Verified','Pending','Broken','Retired'],'Splitter Type':['FDT','FAT','Splitter'],
'CPE Type':['ONU','ONT','Router','Media Converter','Other'],
'Record Type':['Incident','Change'],'Severity':['Low','Medium','High','Critical'],
'Movement Type':['IN','OUT','TRANSFER','ADJUSTMENT'],'Maintenance Type':['PM','CM','Inspection','Emergency'],
'Document Type':['Contract','SLA','PO','As-Built','Permit','Other'],
'Action Type':['Create','Update','Delete','Approve','Reject'],'Frequency':['Daily','Weekly','Monthly','Quarterly'],
'A/B Redundancy':['Yes','No','Partial']
};
const D=['Site','Rack','Equipment','Cable','A-End Site','Z-End Site','Fiber Cable','Core','Service','POI Site','OLT','Splitter','Input Core ID','ODF Port A','ODF Port Z'];
function addQ(f,m,l){
 let t='['+m[0]+'] '+l,x;
 if(D.indexOf(l)>=0)x=f.addListItem().setTitle(t).setChoiceValues(['No master data yet']);
 else if(O[l])x=f.addListItem().setTitle(t).setChoiceValues(O[l]);
 else if(/Issue|Finding|Action Taken|Reason|Old Value|New Value|Notes|Address|Impact|Action$/.test(l))x=f.addParagraphTextItem().setTitle(t);
 else if(/Date|Install|Scheduled|Completed|Expiry|Start|Next Due|Last Service|Last Survey/.test(l))x=f.addDateItem().setTitle(t);
 else x=f.addTextItem().setTitle(t);
 if(!/Notes|Google Maps|Link|Old Value|New Value|Finding|Action Taken|Expected Result|Impact/.test(l))x.setRequired(true);
}
function setup(){
 const ss=db(),f=FormApp.create('DESH COMMUNICATIONS — ISP / IIG Infrastructure Inventory v2');
 f.setDescription('ISP / IIG Infrastructure Inventory System\n\nMaster Database directly edit করবেন না। Module select করে required information submit করুন। GPS-enabled field এ latitude/longitude ও accuracy capture করুন.');
 f.setProgressBar(true).setCollectEmail(true).setConfirmationMessage('Submission received. Master Database processing will follow.');
 const menu=f.addMultipleChoiceItem().setTitle('আপনি কোন ধরনের information submit করতে চান?').setRequired(true),pages=[];
 M.forEach(m=>{const p=f.addPageBreakItem().setTitle(m[1]).setHelpText('Module '+m[0]+' → '+m[2]);pages.push(p);m[4].forEach(l=>addQ(f,m,l));p.setGoToPage(FormApp.PageNavigationType.SUBMIT)});
 menu.setChoices(M.map((m,i)=>menu.createChoice(m[1],pages[i])));
 f.setDestination(FormApp.DestinationType.SPREADSHEET,ss.getId());f.setAcceptingResponses(true);
 const c=ss.getSheetByName('FORM_AUTOMATION')||ss.insertSheet('FORM_AUTOMATION');c.clear();c.getRange(1,1,4,2).setValues([['KEY','VALUE'],['FORM_ID',f.getId()],['FORM_URL',f.getPublishedUrl()],['FORM_EDIT_URL',f.getEditUrl()]]);
 PropertiesService.getScriptProperties().setProperty('FORM_ID',f.getId());Logger.log(f.getPublishedUrl());return f.getPublishedUrl();
}