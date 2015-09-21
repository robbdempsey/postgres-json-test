
select "sum"((document->>'_integer')::NUMERIC) from "perf_childDoc"
	-- no index - .03 seconds with 20,072 records
select "avg"((document->>'_integer')::NUMERIC) from "perf_childDoc"
	-- no index - .03 seconds with 20,072 records
select * from "perf_childDoc" where document->>'_date' between '1986-03-13' and '1992-03-11'
	-- no index - .09 sec to return 2,660 records out of 20,072

CREATE INDEX ON "perf_childDoc"((document->>'_date'));

select * from "perf_childDoc" where document->>'_date' between '1986-03-13' and '1992-03-11'
	-- indexed - .03 sec to return 2,660 records out of 20,072


select * from "perf_childDoc"
where document->>'_date' between '1986-03-13' and '1992-03-11'
and ((document->>'_integer')::NUMERIC) <= .41

select "number", title, c.created, 
d.created as childCreated, d."document"->>'_integer' as sample
from perf_case c
left outer join "perf_childDoc" d
ON c.id = d."caseId"
where ((document->>'_integer')::NUMERIC) <= .41

select "number", title, c.created, 
d.created as childCreated, d."document"->>'_integer' as _integer
from perf_case c
inner join "perf_childDoc" d
ON c.id = d."caseId"
where c."id" =


-- all postgres views are read-only at this point.  you can trigger off of them to simulate updates
CREATE VIEW perf_yellowFin AS
	select "number", title, c.created, 
	d."lastModified" as childCreated, d."document"->>'_integer' as sample
	from perf_case c
	left outer join "perf_childDoc" d
	ON c.id = d."caseId"
	where ((document->>'_integer')::NUMERIC) <= .41

select * from perf_yellowfin
