USE [rnwzshnvd_live]
GO

Drop view sisense_properties 

/****** Object:  View [dbo].[sisense_properties]    Script Date: 9/8/2020 12:09:00 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


create view [dbo].[sisense_properties] as 
(select
ltrim(rtrim(lower(p.scode))) 'property_code',
a.subgroup16 'program',
ltrim(rtrim(p.saddr2)) + ', ' + 
p.scity + ' ' +
p.sstate + ' ' +
p.szipcode 'full_address',
a.subgroup13 'county',
a.subgroup15 'neighborhood',
a.subgroup14 'program_type',
c.dMonthlyAmount * 12 / sq.dsqft0 'sq_foot_cost',
a.subgroup18 'ownership',
sq.dsqft0 'sqft',
convert(date, c.dtfrom) 'lease_from',
convert(date, c.dtto) 'lease_to',
c.dMonthlyAmount 'monthly_rent',
c.dMonthlyAmount * 12 'annual_rent',
case when d.defunding_clause IS NULL THEN 'N' ELSE 'Y' END AS 'defunding_clause',
a.subgroup19 'renewal_option',
a.subgroup17 'campus',
ca.dmonthlyamount 'security_deposit',
cd.name 'landlord_contact_name'


from property p
join attributes a on a.SCODE = p.SCODE
--left join sisense_property_value v on v.code = p.SCODE
left JOIN (select * from tenant where ISTATUS = 0) t ON t.hproperty = p.hmy


left join (select t.scode, cr.dmonthlyamount, dtfrom, dtto from tenant t join commamendments ca on t.hmyperson = ca.htenant
join camrule cr on cr.hamendment = ca.hmy
where hchargecode = 1
and ca.istatus = 1
and getdate() between dtfrom and dtto) c on c.SCODE = t.SCODE

left join (select t.scode, sum(cr.dmonthlyamount) dmonthlyamount from tenant t join commamendments ca on t.hmyperson = ca.htenant
join camrule cr on cr.hamendment = ca.hmy
where hchargecode = 4
and ca.istatus = 1 group by t.scode) ca on ca.SCODE = c.SCODE

left join (select hTenant, 'Y' 'defunding_clause' from commclauses where sName = 'Defunding') d on d.hTenant = t.hmyperson
left join (select hperson, max(ltrim(rtrim((ltrim(rtrim(fname)) + ' ' + ltrim(rtrim((lname)) +  ' ' + phone0))))) 'name' from contact_details group by hperson) cd on cd.hperson = t.hmyperson
left join (select p.scode, s.dsqft0
   from property p
   left join unit u on p.hmy = u.hproperty
   left join sqft s on u.hmy = s.hpointer
   where s.itype = 4
   and p.binactive = 0) sq on sq.scode = p.scode
where bInactive = 0
and p.scode not in ('.active', '.billing', '.ottilie', 'template')
)
GO